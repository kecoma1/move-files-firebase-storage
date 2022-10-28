const fs = require("fs");

const { ref, listAll, getBytes, getMetadata, uploadBytes } = require("firebase/storage");
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

const download_upload_file = async (reference, to) => {
  // Downloading the file the file
  const metadata = await getMetadata(reference);
  const file = await getBytes(reference);

  const toRef = ref(storage, to+'/'+metadata.name);

  // Uploading the file to the referenced folder
  uploadBytes(toRef, file).then((snapshot) => {
    console.log('[INFO] - Sucess! - File', metadata.name, 'moved to:', snapshot.metadata.fullPath);
  }).catch((error) => {
    console.log('[ERROR] - FAILED! - File', metadata.name, 'not moved!\nErorr:', error);
  })

  return to+'/'+metadata.name;
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
      setDoc(doc.ref, {[action.routeField]: fileRoute});
      console.log('[INFO] - Sucess! - Firestore document updated!', document[action.routeField], '->', fileRoute);

    })
  }
};

module.exports = {
  read_actions,
  execute_action,
};
