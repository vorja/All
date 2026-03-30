/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("medidores");

  const existing = collection.fields.getByName("historial");
  if (existing) {
    if (existing.type === "json") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("historial"); // exists with wrong type, remove first
  }

  collection.fields.add(new JSONField({
    name: "historial",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("medidores");
  collection.fields.removeByName("historial");
  return app.save(collection);
})