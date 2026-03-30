/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("lotes");

  const record0 = new Record(collection);
    record0.set("fecha", "2024-12-01");
    record0.set("proveedor", "Finca El Sol");
    record0.set("kg", 750);
    record0.set("estado", "Valorizado");
    record0.set("precioTotal", 3750000);
    record0.set("valor_total", 3750000);
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
    record1.set("fecha", "2024-12-02");
    record1.set("proveedor", "Finca Verde");
    record1.set("kg", 950);
    record1.set("estado", "Pendiente");
    record1.set("precioTotal", 4750000);
    record1.set("valor_total", 4750000);
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
    record2.set("fecha", "2024-12-03");
    record2.set("proveedor", "Finca La Esperanza");
    record2.set("kg", 650);
    record2.set("estado", "Valorizado");
    record2.set("precioTotal", 3250000);
    record2.set("valor_total", 3250000);
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
    record3.set("fecha", "2024-12-04");
    record3.set("proveedor", "Finca Tropical");
    record3.set("kg", 1100);
    record3.set("estado", "Pendiente");
    record3.set("precioTotal", 5500000);
    record3.set("valor_total", 5500000);
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
    record4.set("fecha", "2024-12-05");
    record4.set("proveedor", "Finca del Caribe");
    record4.set("kg", 800);
    record4.set("estado", "Valorizado");
    record4.set("precioTotal", 4000000);
    record4.set("valor_total", 4000000);
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
    record5.set("fecha", "2024-12-06");
    record5.set("proveedor", "Finca El Sol");
    record5.set("kg", 900);
    record5.set("estado", "Pendiente");
    record5.set("precioTotal", 4500000);
    record5.set("valor_total", 4500000);
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
    record6.set("fecha", "2024-12-07");
    record6.set("proveedor", "Finca Verde");
    record6.set("kg", 700);
    record6.set("estado", "Valorizado");
    record6.set("precioTotal", 3500000);
    record6.set("valor_total", 3500000);
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
    record7.set("fecha", "2024-12-08");
    record7.set("proveedor", "Finca La Esperanza");
    record7.set("kg", 1050);
    record7.set("estado", "Pendiente");
    record7.set("precioTotal", 5250000);
    record7.set("valor_total", 5250000);
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
    record8.set("fecha", "2024-12-09");
    record8.set("proveedor", "Finca Tropical");
    record8.set("kg", 600);
    record8.set("estado", "Valorizado");
    record8.set("precioTotal", 3000000);
    record8.set("valor_total", 3000000);
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
    record9.set("fecha", "2024-12-10");
    record9.set("proveedor", "Finca del Caribe");
    record9.set("kg", 850);
    record9.set("estado", "Pendiente");
    record9.set("precioTotal", 4250000);
    record9.set("valor_total", 4250000);
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
    record10.set("fecha", "2024-12-11");
    record10.set("proveedor", "Finca El Sol");
    record10.set("kg", 1200);
    record10.set("estado", "Valorizado");
    record10.set("precioTotal", 6000000);
    record10.set("valor_total", 6000000);
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
    record11.set("fecha", "2024-12-12");
    record11.set("proveedor", "Finca Verde");
    record11.set("kg", 550);
    record11.set("estado", "Pendiente");
    record11.set("precioTotal", 2750000);
    record11.set("valor_total", 2750000);
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
    record12.set("fecha", "2024-12-13");
    record12.set("proveedor", "Finca La Esperanza");
    record12.set("kg", 920);
    record12.set("estado", "Valorizado");
    record12.set("precioTotal", 4600000);
    record12.set("valor_total", 4600000);
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
    record13.set("fecha", "2024-12-14");
    record13.set("proveedor", "Finca Tropical");
    record13.set("kg", 780);
    record13.set("estado", "Pendiente");
    record13.set("precioTotal", 3900000);
    record13.set("valor_total", 3900000);
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
    record14.set("fecha", "2024-12-15");
    record14.set("proveedor", "Finca del Caribe");
    record14.set("kg", 1050);
    record14.set("estado", "Valorizado");
    record14.set("precioTotal", 5250000);
    record14.set("valor_total", 5250000);
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