const path = require("path");
const express = require("express");
const xss = require("xss");
const NotesService = require("./noteservices");
const notesRouter = express.Router();
const jsonParser = express.json();
const UuidGen = require("./uuidGen");

const serializeNote = note => ({
  id: note.id,
  name: xss(note.name),
  modified: note.modified,
  folderId: note.folderid,
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
  .post(jsonParser, (req, res, next) => {
    const uuid = UuidGen.create_integerUUID();
    const { name, folderId, content } = req.body;

    if (!name) {
      return res.status(400).json({
        error: { message: "Missing name in the request body" }
      });
    }

    if (!folderId) {
      return res.status(400).json({
        error: { message: "Missing folderId in the request body" }
      });
    }

    const noteObj = {
      id: uuid,
      name: name,
      folderid: folderId,
      content: content
    };

    NotesService.insertNote(req.app.get("db"), noteObj)
      .then(note => {
        res.status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(serializeNote(note));
      })
      .catch(next);
  });


notesRouter.route("/:noteId")
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
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = notesRouter;