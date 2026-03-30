/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("nomina");

  const existing = collection.fields.getByName("horas_regulares_trabajadas");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("horas_regulares_trabajadas"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "horas_regulares_trabajadas",
    required: true
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("nomina");
  collection.fields.removeByName("horas_regulares_trabajadas");
  return app.save(collection);
})