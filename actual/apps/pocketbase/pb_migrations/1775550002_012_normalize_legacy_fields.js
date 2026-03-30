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

  ensureField("nomina", new NumberField({
    name: "cantidad_horas_extras",
    required: false,
    max: null,
    min: 0
  }));

  ensureField("nomina", new BoolField({
    name: "periodo_cerrado",
    required: false
  }));

  ensureField("insumos", new NumberField({
    name: "stock_minimo",
    required: false,
    max: null,
    min: 0
  }));

  ensureField("lotes", new NumberField({
    name: "costo_materia_prima_total",
    required: false,
    max: null,
    min: 0
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

  removeIfExists("nomina", "periodo_cerrado");
  removeIfExists("insumos", "stock_minimo");
  removeIfExists("lotes", "costo_materia_prima_total");
})
