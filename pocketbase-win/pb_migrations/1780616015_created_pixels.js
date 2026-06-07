/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "mbituqmon97tbvz",
    "created": "2026-06-04 23:33:35.924Z",
    "updated": "2026-06-04 23:33:35.924Z",
    "name": "pixels",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "eizm1dzh",
        "name": "field",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
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
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("mbituqmon97tbvz");

  return dao.deleteCollection(collection);
})
