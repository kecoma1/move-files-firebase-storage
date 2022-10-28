const fs = require("fs");
const { ref, listAll, getBytes, getMetadata, uploadBytes } = require("firebase/storage");
var ab2str = require('arraybuffer-to-string')
const { storage } = require("../firebase");

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
};

const read_actions = () => {
  const buffer = fs.readFileSync("actions.json");
  const actions = JSON.parse(buffer);

  return actions;
};

const execute_action = async (action = {}) => {
  const listRef = ref(storage, action.takeFrom);

  const res = await listAll(listRef);
  // Moving the files in the folder
  for (item of res.items) {
    download_upload_file(item, action.moveTo);
  }

  for (prefix of res.prefixes) {
    move_files_from_folder(prefix, action.moveTo+'/'+prefix.name);
  }
};

module.exports = {
  read_actions,
  execute_action,
};
