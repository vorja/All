/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("insumos");
  const field = collection.fields.getByName("categoria");
  field.values = ["Aceites y Qu\u00edmicos", "Empaque", "Utilidades"];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("insumos");
  const field = collection.fields.getByName("categoria");
  field.values = ["Aceites y Grasas", "Condimentos", "Empaque", "Qu\u00edmicos", "Herramientas"];
  return app.save(collection);
})