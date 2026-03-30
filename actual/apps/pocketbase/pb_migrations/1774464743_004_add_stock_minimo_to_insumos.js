/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("insumos");

  const existing = collection.fields.getByName("stock_minimo");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("stock_minimo"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "stock_minimo",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("insumos");
  collection.fields.removeByName("stock_minimo");
  return app.save(collection);
})