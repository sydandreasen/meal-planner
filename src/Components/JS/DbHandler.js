import base from "./Firebase.js";
const db = base.database();

// write specified data to specified path
export const writeData = (path, ...info) => {
  db.ref(path)
    .set(
      // note this will overwrite all information at the designated path, even at child paths
      // to update without overwriting, use .update
      ...info
    )
    .catch((error) => alert(error));
};

// write specified data to specified path + child
export const writeWChild = (path, child, ...info) => {
  db.ref(path)
    .child(child)
    .set(...info)
    .catch((error) => alert(error));
};

// update specified data to specified path
export const updateData = (path, ...info) => {
  db.ref(path)
    .update(...info)
    .catch((error) => alert(error));
};

// update specified data to specified path + child
export const updateWChild = (path, child, ...info) => {
  db.ref(path)
    .child(child)
    .update(...info)
    .catch((error) => alert(error));
};
