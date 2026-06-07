/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "1r7gubynjdnzzze",
    "created": "2026-06-06 21:20:13.812Z",
    "updated": "2026-06-06 21:20:13.812Z",
    "name": "forom_members",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "xcaqduit",
        "name": "user",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "pcuuqpze",
        "name": "forom",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "hd3d4px55ioml1o",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "ofuhhifc",
        "name": "role",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "creator",
            "s-mod",
            "mod",
            "editor",
            "associate - Default: associate"
          ]
        }
      },
      {
        "system": false,
        "id": "bzq1weyn",
        "name": "status",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "pending",
            "active",
            "banned"
          ]
        }
      },
      {
        "system": false,
        "id": "l4bjdfn0",
        "name": "local_px",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 0,
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
  const collection = dao.findCollectionByNameOrId("1r7gubynjdnzzze");

  return dao.deleteCollection(collection);
})
