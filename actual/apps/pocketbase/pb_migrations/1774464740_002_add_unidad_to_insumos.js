/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("insumos");

  const existing = collection.fields.getByName("unidad");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("unidad"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "unidad",
    required: false,
    values: ["Kg", "L", "Unidades", "Pares"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("insumos");
  collection.fields.removeByName("unidad");
  return app.save(collection);
})