/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const ensureField = (collectionName, field) => {
    const collection = app.findCollectionByNameOrId(collectionName);
    const existing = collection.fields.getByName(field.name);
    if (!existing) {
      collection.fields.add(field);
      app.save(collection);
    }
  };

  ensureField("lotes_produccion_ext", new NumberField({
    name: "precio_kg_materia",
    required: false,
    max: null,
    min: 0
  }));

  ensureField("lotes_produccion_ext", new TextField({
    name: "variedad",
    required: false
  }));
}, (app) => {
  const removeIfExists = (collectionName, fieldName) => {
    const collection = app.findCollectionByNameOrId(collectionName);
    const existing = collection.fields.getByName(fieldName);
    if (existing) {
      collection.fields.removeByName(fieldName);
      app.save(collection);
    }
  };
  removeIfExists("lotes_produccion_ext", "precio_kg_materia");
  removeIfExists("lotes_produccion_ext", "variedad");
});
