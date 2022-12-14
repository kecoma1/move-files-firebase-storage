const fs = require("fs");

const { ref, listAll, getBytes, getMetadata, uploadBytes, getDownloadURL } = require("firebase/storage");
const { collection, getDocs, setDoc } = require("firebase/firestore");
var ab2str = require('arraybuffer-to-string');

const { storage, db } = require("../firebase");

const getFinalRoute = (params, moveTo, doc, documentData) => {
  if (!params) return;

  let finalRoute = ''+moveTo;
  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    finalRoute = finalRoute.replace(
      param.representation,
      param.name === 'id'
      ? doc.id
      : documentData[param.name]
    );
  }

  return finalRoute;
}

const move_files_from_folder = async (reference, to) => {
  const res = await listAll(reference);

  // Moving the files in the folder
  for (item of res.items) {
    download_upload_file(item, to);
  }

  for (prefix of res.prefixes) {
    move_files_from_folder(prefix, to+'/'+prefix.name);
  }
}

const download_upload_file = async (reference, to, name = undefined) => {
  // Downloading the file the file
  const metadata = await getMetadata(reference);
  const file = await getBytes(reference);

  const file_name = name ? name+'.'+metadata.name.split('.')[1] : metadata.name

  const toRef = ref(storage, to+'/'+file_name);

  // Uploading the file to the referenced folder
  uploadBytes(toRef, file).then((snapshot) => {
    console.log('[INFO] - Sucess! - File', file_name, 'moved to:', snapshot.metadata.fullPath);
  }).catch((error) => {
    console.log('[ERROR] - FAILED! - File', file_name, 'not moved!\nErorr:', error);
  })

  return to+'/'+file_name;
};

const read_actions = () => {
  const buffer = fs.readFileSync("actions.json");
  const actions = JSON.parse(buffer);

  return actions;
};

const execute_action = async (action = {}) => {
  if (action.type === 'simple-move') {
    const listRef = ref(storage, action.takeFrom);
  
    const res = await listAll(listRef);
    // Moving the files in the folder
    for (item of res.items) {
      download_upload_file(item, action.moveTo);
    }
  
    for (prefix of res.prefixes) {
      move_files_from_folder(prefix, action.moveTo+'/'+prefix.name);
    }
  } else if (action.type === 'firestore-update-route') {
    const querySnapshot = await getDocs(collection(db, action.collection));
    querySnapshot.forEach(async (doc) => {
      const document = doc.data();

      // Getting the final route where the storage img/object is going to be stored 
      const move_to = getFinalRoute(action.params, action.moveTo, doc, document);

      // Getting the reference of the object
      const reference = ref(storage, document[action.routeField]);

      // Moving the file
      const fileRoute = await download_upload_file(reference, move_to);

      // Updating the firestore object
      setDoc(doc.ref, {
        ...document,
        [action.routeField]: fileRoute
      });
      console.log('[INFO] - Sucess! - Firestore document updated!', document[action.routeField], '->', fileRoute);

    })
  } else if (action.type === 'firestore-update-route-name') {
    const querySnapshot = await getDocs(collection(db, action.collection));
    querySnapshot.forEach(async (doc) => {
      const document = doc.data();

      // Getting the final route where the storage img/object is going to be stored 
      const move_to = getFinalRoute(action.params, action.moveTo, doc, document);

      // Getting the reference of the object
      const reference = ref(storage, document[action.routeField]);

      // Moving the file
      const fileRoute = await download_upload_file(reference, move_to, action.newName);

      // Updating the firestore object
      setDoc(doc.ref, {
        ...document,
        [action.routeField]: fileRoute
      });
      console.log('[INFO] - Sucess! - Firestore document updated!', document[action.routeField], '->', fileRoute);

    })
  } else if (action.type === 'firestore-update-url') {
    const querySnapshot = await getDocs(collection(db, action.collection));
    querySnapshot.forEach(async (doc) => {
      const document = doc.data();

      // Getting the route where the object is
      const objectRoute = getFinalRoute(action.params, action.objectLocation, doc, document);

      // Getting the reference of the place where the object is saved
      const reference = ref(storage, objectRoute);
    
      const res = await listAll(reference);

      for (item of res.items) {
        if (item.name.includes(action.objectName)) {
          // Getting the url of the file
          const url = await getDownloadURL(item);

          // Updating the document with the new url
          setDoc(doc.ref, {
            ...document,
            [action.field]: url
          })
          console.log('[INFO] - Sucess! - Firestore document updated!', document[action.field], '->', url);
          break;
        }
      }
    })
  } else if (action.type === 'firestore-update-subcollection-file') {
    const parentSnapshot = await getDocs(collection(db, action.parentCollection));
    // Going to the parent
    parentSnapshot.forEach(async (parentDoc) => {

      const querySnapshot = await getDocs(collection(db, action.parentCollection, parentDoc.id, action.collection));
      // Travaersing through each child
      querySnapshot.forEach(async (doc) => {
        const document = doc.data();

        // Getting the reference of the place where the object is 
        const reference = ref(storage, document[action.objectLocationField]);

        const objectRoute = getFinalRoute(action.params, action.objectLocation, parentDoc, parentDoc.data());

        const fileRoute = await download_upload_file(reference, objectRoute, doc.id);

        setDoc(doc.ref, {
          ...document,
          [action.objectLocationField]: fileRoute
        })

        console.log('[INFO] - Sucess! - Firestore document updated!', document[action.objectLocationField], '->', fileRoute);
      })
    });
  }
};

module.exports = {
  read_actions,
  execute_action,
};
