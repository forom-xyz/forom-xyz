/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cuy5rfsrd7uarwx")

  collection.name = "color"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cuy5rfsrd7uarwx")

  collection.name = "Color"

  return dao.saveCollection(collection)
})
