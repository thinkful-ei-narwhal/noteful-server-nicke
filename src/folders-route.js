const path = require("path");
const express = require("express");
const xss = require("xss");
const FoldersService = require("./folderservices");
const foldersRouter = express.Router();
const jsonParser = express.json();
const UuidGen = require("./uuidGen");

const serializeFolder = folder => ({
  id: folder.id,
  name: xss(folder.name)
});

foldersRouter.route("/")
  .get((req, res, next) => {
    FoldersService.getAllFolders(req.app.get("db"))
      .then(
        folders => {
          res.json(folders.map(serializeFolder));
        })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name } = req.body;
    const uuid = UuidGen.create_integerUUID();
    if (!name) {
      return res.status(400).json({
        error: { message: "Missing name in the request body" }
      });
    }
    const folderObj = {
      id: uuid,
      name: name
    };
    FoldersService.insertFolder(req.app.get("db"), folderObj)
      .then(folder => {
        res.status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(serializeFolder(folder));
      })
      .catch(next);
  });


foldersRouter.route("/:folderId")
  .all((req, res, next) => {
    FoldersService.getFolderById(req.app.get("db"), req.params.folderId)
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: {
              message: "folder doesnt exist"
            }
          });
        }
        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeFolder(res.folder));
  })
  .delete((req, res, next) => {
    FoldersService.deleteFolder(req.app.get("db"), req.params.folderId)
      .then(runRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });



module.exports = foldersRouter;