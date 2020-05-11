const notesName = "notes";
const NoteServices = {
  getAllNotes(db) {
    return db.select("*").from(notesName);
  },
  getNoteById(db, id) {
    return db.select("*").from(notesName).where({ id }).first();
  },
  insertNote(db, note) {
    return db.select("*").insert(note).into(notesName)
      .returning("*").then(rows => {
        return rows[0];
      });
  },
  deleteNote(db, id) {
    return db.select("*").from(notesName).where({ id }).delete();
  },
  updateNote(db, id, newNoteFields) {
    return db.from(notesName).where({ id }).update(newNoteFields);
  }
};

module.exports = NoteServices;