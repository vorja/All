/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("insumos");

  const record0 = new Record(collection);
    record0.set("nombre", "Aceite de Cocina Premium");
    record0.set("categoria", "Aceites y Qu\u00edmicos");
    record0.set("stock_actual", 150);
    record0.set("stock_minimo", 50);
    record0.set("unidad", "L");
    record0.set("costoUnitario", 8500);
    record0.set("imagen", "https://images.unsplash.com/photo-1587318014498-e4914a654ffa?w=400");
    record0.set("minimo", 50);
    record0.set("maximo", 300);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("nombre", "Detergente Industrial");
    record1.set("categoria", "Aceites y Qu\u00edmicos");
    record1.set("stock_actual", 200);
    record1.set("stock_minimo", 75);
    record1.set("unidad", "L");
    record1.set("costoUnitario", 12000);
    record1.set("imagen", "https://images.unsplash.com/photo-1584622181563-430f63602d4b?w=400");
    record1.set("minimo", 75);
    record1.set("maximo", 400);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("nombre", "Cajas de Cart\u00f3n Corrugado");
    record2.set("categoria", "Empaque");
    record2.set("stock_actual", 5000);
    record2.set("stock_minimo", 1000);
    record2.set("unidad", "Unidades");
    record2.set("costoUnitario", 450);
    record2.set("imagen", "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400");
    record2.set("minimo", 1000);
    record2.set("maximo", 10000);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("nombre", "Bolsas Pl\u00e1sticas Transparentes");
    record3.set("categoria", "Empaque");
    record3.set("stock_actual", 8000);
    record3.set("stock_minimo", 2000);
    record3.set("unidad", "Unidades");
    record3.set("costoUnitario", 25);
    record3.set("imagen", "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400");
    record3.set("minimo", 2000);
    record3.set("maximo", 15000);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("nombre", "Cinta Adhesiva Empaque");
    record4.set("categoria", "Empaque");
    record4.set("stock_actual", 300);
    record4.set("stock_minimo", 100);
    record4.set("unidad", "Unidades");
    record4.set("costoUnitario", 3500);
    record4.set("imagen", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400");
    record4.set("minimo", 100);
    record4.set("maximo", 500);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("nombre", "Desinfectante Multiusos");
    record5.set("categoria", "Aceites y Qu\u00edmicos");
    record5.set("stock_actual", 120);
    record5.set("stock_minimo", 40);
    record5.set("unidad", "L");
    record5.set("costoUnitario", 15000);
    record5.set("imagen", "https://images.unsplash.com/photo-1584308666744-24d5f400f6f0?w=400");
    record5.set("minimo", 40);
    record5.set("maximo", 250);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("nombre", "Guantes de Nitrilo");
    record6.set("categoria", "Utilidades");
    record6.set("stock_actual", 2500);
    record6.set("stock_minimo", 500);
    record6.set("unidad", "Pares");
    record6.set("costoUnitario", 150);
    record6.set("imagen", "https://images.unsplash.com/photo-1584308666744-24d5f400f6f0?w=400");
    record6.set("minimo", 500);
    record6.set("maximo", 5000);
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("nombre", "Mascarillas Quir\u00fargicas");
    record7.set("categoria", "Utilidades");
    record7.set("stock_actual", 3000);
    record7.set("stock_minimo", 1000);
    record7.set("unidad", "Unidades");
    record7.set("costoUnitario", 200);
    record7.set("imagen", "https://images.unsplash.com/photo-1584308666744-24d5f400f6f0?w=400");
    record7.set("minimo", 1000);
    record7.set("maximo", 6000);
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record8 = new Record(collection);
    record8.set("nombre", "Papel Higi\u00e9nico Industrial");
    record8.set("categoria", "Utilidades");
    record8.set("stock_actual", 450);
    record8.set("stock_minimo", 150);
    record8.set("unidad", "Unidades");
    record8.set("costoUnitario", 8000);
    record8.set("imagen", "https://images.unsplash.com/photo-1584308666744-24d5f400f6f0?w=400");
    record8.set("minimo", 150);
    record8.set("maximo", 800);
  try {
    app.save(record8);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record9 = new Record(collection);
    record9.set("nombre", "Jab\u00f3n L\u00edquido Antibacterial");
    record9.set("categoria", "Aceites y Qu\u00edmicos");
    record9.set("stock_actual", 180);
    record9.set("stock_minimo", 60);
    record9.set("unidad", "L");
    record9.set("costoUnitario", 18000);
    record9.set("imagen", "https://images.unsplash.com/photo-1584308666744-24d5f400f6f0?w=400");
    record9.set("minimo", 60);
    record9.set("maximo", 350);
  try {
    app.save(record9);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record10 = new Record(collection);
    record10.set("nombre", "Etiquetas Adhesivas");
    record10.set("categoria", "Empaque");
    record10.set("stock_actual", 10000);
    record10.set("stock_minimo", 3000);
    record10.set("unidad", "Unidades");
    record10.set("costoUnitario", 50);
    record10.set("imagen", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400");
    record10.set("minimo", 3000);
    record10.set("maximo", 20000);
  try {
    app.save(record10);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record11 = new Record(collection);
    record11.set("nombre", "Alcohol Desinfectante 70%");
    record11.set("categoria", "Aceites y Qu\u00edmicos");
    record11.set("stock_actual", 95);
    record11.set("stock_minimo", 30);
    record11.set("unidad", "L");
    record11.set("costoUnitario", 22000);
    record11.set("imagen", "https://images.unsplash.com/photo-1584308666744-24d5f400f6f0?w=400");
    record11.set("minimo", 30);
    record11.set("maximo", 200);
  try {
    app.save(record11);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record12 = new Record(collection);
    record12.set("nombre", "Bolsas de Basura Negras");
    record12.set("categoria", "Empaque");
    record12.set("stock_actual", 6000);
    record12.set("stock_minimo", 1500);
    record12.set("unidad", "Unidades");
    record12.set("costoUnitario", 35);
    record12.set("imagen", "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400");
    record12.set("minimo", 1500);
    record12.set("maximo", 12000);
  try {
    app.save(record12);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record13 = new Record(collection);
    record13.set("nombre", "Toallas de Papel Desechables");
    record13.set("categoria", "Utilidades");
    record13.set("stock_actual", 350);
    record13.set("stock_minimo", 100);
    record13.set("unidad", "Unidades");
    record13.set("costoUnitario", 12000);
    record13.set("imagen", "https://images.unsplash.com/photo-1584308666744-24d5f400f6f0?w=400");
    record13.set("minimo", 100);
    record13.set("maximo", 600);
  try {
    app.save(record13);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record14 = new Record(collection);
    record14.set("nombre", "Cloro L\u00edquido Concentrado");
    record14.set("categoria", "Aceites y Qu\u00edmicos");
    record14.set("stock_actual", 75);
    record14.set("stock_minimo", 25);
    record14.set("unidad", "L");
    record14.set("costoUnitario", 9500);
    record14.set("imagen", "https://images.unsplash.com/photo-1584308666744-24d5f400f6f0?w=400");
    record14.set("minimo", 25);
    record14.set("maximo", 150);
  try {
    app.save(record14);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})