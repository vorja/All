/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("lotes");
  const field = collection.fields.getByName("valor_unitario");
  field.name = "precioTotal";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("lotes");
  const field = collection.fields.getByName("precioTotal");
  field.name = "valor_unitario";
  return app.save(collection);
})