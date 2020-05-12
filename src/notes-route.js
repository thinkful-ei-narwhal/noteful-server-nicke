const path = require("path");
const express = require("express");
const xss = require("xss");
const NotesService = require("./noteservices");
const notesRouter = express.Router();
const jsonParser = express.json();

const serializeNote = note => ({
  id: note.id,
  note_name: xss(note.note_name),
  modified: note.modified,
  folderId: note.folderId,
  content: xss(note.content)
});

notesRouter.route("/")
  .get((req, res, next) => {
    NotesService.getAllNotes(req.app.get("db"))
      .then(
        notes => {
          res.json(notes.map(serializeNote));
        })
      .catch(next);
  })
  .post(jsonParser, (req, res) => {
    res.send("NOICE");
  });


notesRouter.route("/:nodeId")
  .all((req, res, next) => {
    NotesService.getNoteById(req.app.get("db"), req.params.noteId)
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: {
              message: "note doesnt exist"
            }
          });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note));
  })
  .delete((req, res, next) => {
    NotesService.deleteNote(req.app.get("db"), req.params.noteId)
      .then(runRowsAffected => {
        res.status.end();
      })
      .catch(next);
  });

module.exports = notesRouter;