/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "hd3d4px55ioml1o",
    "created": "2026-06-06 21:11:47.990Z",
    "updated": "2026-06-06 21:11:47.990Z",
    "name": "foroms",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bqhbfmkv",
        "name": "title",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 2,
          "max": 4,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "0jcom8gv",
        "name": "visibility",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "public",
            "private"
          ]
        }
      },
      {
        "system": false,
        "id": "cvhc1vpr",
        "name": "mission",
        "type": "editor",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "convertUrls": false
        }
      },
      {
        "system": false,
        "id": "jueg75og",
        "name": "is_registered",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "3a04lx1e",
        "name": "current_phase",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 1,
          "max": 3,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "cptqzaw9",
        "name": "phase_started_at",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "jjthibqo",
        "name": "memo_count",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": 100,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "6roxne8j",
        "name": "common_px_bank",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 500,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "ytpv2ser",
        "name": "total_px_genesis",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 5000,
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
  const collection = dao.findCollectionByNameOrId("hd3d4px55ioml1o");

  return dao.deleteCollection(collection);
})
