/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("insumos");

  const existing = collection.fields.getByName("categoria");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("categoria"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "categoria",
    required: false,
    values: ["Aceites y Grasas", "Condimentos", "Empaque", "Qu\u00edmicos", "Herramientas"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("insumos");
  collection.fields.removeByName("categoria");
  return app.save(collection);
})