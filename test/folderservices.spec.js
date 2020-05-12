const knex = require("knex");
const app = require("../src/app");
const notefulFixture = require("./notefulfixture");
const FolderServices = require("../src/folderservices");

describe("Folder Endpoints", function () {
  let db;
  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });
  before(() => db("folders").truncate());
  before(() => db("notes").truncate());
  after(() => db.destroy());

  context("Given there are notes and folders in the database", () => {
    beforeEach("insert folders", () => {
      return db
        .into("folders")
        .insert(notefulFixture.folders);
    });
    beforeEach("insert notes", () => {
      return db
        .into("notes")
        .insert(notefulFixture.notes);
    });

    it("should return the folders table", () => {
      supertest(app).get("/folders").expect(200, notefulFixture.folders);
    });

  });
});