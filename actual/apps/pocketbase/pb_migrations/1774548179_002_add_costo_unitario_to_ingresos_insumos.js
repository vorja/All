/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("ingresos_insumos");

  const existing = collection.fields.getByName("costo_unitario");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("costo_unitario"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "costo_unitario",
    required: true,
    min: 0
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("ingresos_insumos");
  collection.fields.removeByName("costo_unitario");
  return app.save(collection);
})