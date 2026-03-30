/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("nomina");

  const existing = collection.fields.getByName("valor_hora_regular");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("valor_hora_regular"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "valor_hora_regular",
    required: true
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("nomina");
  collection.fields.removeByName("valor_hora_regular");
  return app.save(collection);
})