/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("insumos");

  const existing = collection.fields.getByName("imagen");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("imagen"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "imagen",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("insumos");
  collection.fields.removeByName("imagen");
  return app.save(collection);
})