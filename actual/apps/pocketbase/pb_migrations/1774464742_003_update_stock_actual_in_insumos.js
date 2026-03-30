/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("insumos");
  const field = collection.fields.getByName("stock_actual");
  field.required = true;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("insumos");
  const field = collection.fields.getByName("stock_actual");
  field.required = true;
  return app.save(collection);
})