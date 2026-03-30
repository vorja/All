/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("ingresos_insumos");

  const existing = collection.fields.getByName("fecha");
  if (existing) {
    if (existing.type === "date") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("fecha"); // exists with wrong type, remove first
  }

  collection.fields.add(new DateField({
    name: "fecha",
    required: true
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("ingresos_insumos");
  collection.fields.removeByName("fecha");
  return app.save(collection);
})