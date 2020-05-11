const folderName = "folders";
const FolderServices = {
  getAllFolders(db) {
    return db.select("*").from(folderName);
  },
  getFolderById(db, id) {
    return db.select("*").from(folderName).where({ id }).first();
  },
  insertFolder(db, folder) {
    return db.select("*").insert(folder).into(folderName)
      .returning("*").then(rows => {
        return rows[0];
      });
  },
  deleteFolder(db, id) {
    return db.select("*").from(folderName).where({ id }).delete();
  },
  updateNote(db, id, newFolderFields) {
    return db.from(folderName).where({ id }).update(newFolderFields);
  }
};

module.exports = FolderServices;