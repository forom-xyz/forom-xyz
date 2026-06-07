/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "x25pdij2g33wuj1",
    "created": "2026-06-06 21:43:32.311Z",
    "updated": "2026-06-06 21:43:32.311Z",
    "name": "pending_approvals_view",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ulxgjkex",
        "name": "original_id",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      },
      {
        "system": false,
        "id": "9qco8nxf",
        "name": "item_type",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      },
      {
        "system": false,
        "id": "xn1rn9mr",
        "name": "author",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      },
      {
        "system": false,
        "id": "nrk63dvt",
        "name": "forom",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      },
      {
        "system": false,
        "id": "jwhxdf2l",
        "name": "preview",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT\n  (ROW_NUMBER() OVER(ORDER BY item.created DESC)) as id,\n  item.original_id,\n  item.item_type,\n  item.author,\n  item.forom,\n  item.preview,\n  item.created\nFROM (\n  SELECT\n    id as original_id,\n    'memo' as item_type,\n    user as author,\n    forom,\n    resume as preview,\n    created\n  FROM memos\n  WHERE status = 'pending_approval'\n\n  UNION ALL\n\n  SELECT\n    id as original_id,\n    type as item_type,\n    created_by as author,\n    forom,\n    title as preview,\n    created\n  FROM tasks\n  WHERE status = 'pending_approval'\n) item"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("x25pdij2g33wuj1");

  return dao.deleteCollection(collection);
})
