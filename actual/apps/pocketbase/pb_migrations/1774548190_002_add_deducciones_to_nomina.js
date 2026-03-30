/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("nomina");

  const existing = collection.fields.getByName("deducciones");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("deducciones"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "deducciones",
    required: false,
    min: 0
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("nomina");
  collection.fields.removeByName("deducciones");
  return app.save(collection);
})