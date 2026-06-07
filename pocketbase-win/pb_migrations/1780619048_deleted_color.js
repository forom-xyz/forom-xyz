/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("cuy5rfsrd7uarwx");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "cuy5rfsrd7uarwx",
    "created": "2026-06-04 23:32:07.861Z",
    "updated": "2026-06-04 23:32:43.764Z",
    "name": "color",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "sk0ynpsa",
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
