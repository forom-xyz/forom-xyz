/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("uvy9ttqjmzevx7t");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "uvy9ttqjmzevx7t",
    "created": "2026-06-04 23:32:26.752Z",
    "updated": "2026-06-04 23:32:26.752Z",
    "name": "city",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "4tebravb",
        "name": "field",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
