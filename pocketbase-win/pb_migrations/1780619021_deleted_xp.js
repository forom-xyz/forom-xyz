/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("wfbjwxtoo31w7ms");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "wfbjwxtoo31w7ms",
    "created": "2026-06-04 23:33:23.020Z",
    "updated": "2026-06-04 23:33:23.020Z",
    "name": "xp",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "7gjzqqve",
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
})
