/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("insumos");

  const existing = collection.fields.getByName("stockMinimo");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("stockMinimo"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "stockMinimo",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("insumos");
  collection.fields.removeByName("stockMinimo");
  return app.save(collection);
})