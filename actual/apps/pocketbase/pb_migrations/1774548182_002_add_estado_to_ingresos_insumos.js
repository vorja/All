/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("ingresos_insumos");

  const existing = collection.fields.getByName("estado");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("estado"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "estado",
    required: false,
    values: ["Registrado", "Verificado", "Pagado"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("ingresos_insumos");
  collection.fields.removeByName("estado");
  return app.save(collection);
})