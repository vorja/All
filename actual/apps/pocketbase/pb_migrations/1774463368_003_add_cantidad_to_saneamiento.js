/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("saneamiento");

  const existing = collection.fields.getByName("cantidad");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("cantidad"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "cantidad",
    required: true
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("saneamiento");
  collection.fields.removeByName("cantidad");
  return app.save(collection);
})