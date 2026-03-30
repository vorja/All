/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("saneamiento");

  const existing = collection.fields.getByName("unidad");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("unidad"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "unidad",
    required: true
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("saneamiento");
  collection.fields.removeByName("unidad");
  return app.save(collection);
})