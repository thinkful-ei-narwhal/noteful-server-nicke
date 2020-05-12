const path = require("path");
const express = require("express");
const xss = require("xss");
const FoldersService = require("./folderservices");
const foldersRouter = express.Router();
const jsonParser = express.json();

const serializeFolder = folder => ({
  id: folder.id,
  name: xss(folder.folder_name)
});

module.exports = foldersRouter;