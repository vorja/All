/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("lotes");

  const existing = collection.fields.getByName("variedad");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("variedad"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "variedad",
    required: true,
    values: ["Tipo A", "Tipo B", "Guayabo", "Hawaiano"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("lotes");
  collection.fields.removeByName("variedad");
  return app.save(collection);
})