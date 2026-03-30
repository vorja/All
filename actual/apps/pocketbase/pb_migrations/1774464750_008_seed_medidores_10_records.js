/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("medidores");

  const record0 = new Record(collection);
    record0.set("fecha", "2024-12-01");
    record0.set("agua_lectura", 1000);
    record0.set("agua_consumo", 45);
    record0.set("gas_lectura", 500);
    record0.set("gas_consumo", 12);
    record0.set("energia_lectura", 2500);
    record0.set("energia_consumo", 85);
    record0.set("arriendo", 1500000);
    record0.set("historial", [{"fecha": "2024-12-01", "lectura": 1000, "diferencia": 45, "costoEstimado": 22500}, {"fecha": "2024-11-30", "lectura": 955, "diferencia": 48, "costoEstimado": 24000}]);
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
    record1.set("agua_lectura", 1045);
    record1.set("agua_consumo", 45);
    record1.set("gas_lectura", 512);
    record1.set("gas_consumo", 12);
    record1.set("energia_lectura", 2585);
    record1.set("energia_consumo", 85);
    record1.set("arriendo", 1500000);
    record1.set("historial", [{"fecha": "2024-12-02", "lectura": 1045, "diferencia": 45, "costoEstimado": 22500}, {"fecha": "2024-12-01", "lectura": 1000, "diferencia": 45, "costoEstimado": 22500}]);
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
    record2.set("agua_lectura", 1090);
    record2.set("agua_consumo", 45);
    record2.set("gas_lectura", 524);
    record2.set("gas_consumo", 12);
    record2.set("energia_lectura", 2670);
    record2.set("energia_consumo", 85);
    record2.set("arriendo", 1500000);
    record2.set("historial", [{"fecha": "2024-12-03", "lectura": 1090, "diferencia": 45, "costoEstimado": 22500}, {"fecha": "2024-12-02", "lectura": 1045, "diferencia": 45, "costoEstimado": 22500}]);
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
    record3.set("agua_lectura", 1135);
    record3.set("agua_consumo", 45);
    record3.set("gas_lectura", 536);
    record3.set("gas_consumo", 12);
    record3.set("energia_lectura", 2755);
    record3.set("energia_consumo", 85);
    record3.set("arriendo", 1500000);
    record3.set("historial", [{"fecha": "2024-12-04", "lectura": 1135, "diferencia": 45, "costoEstimado": 22500}, {"fecha": "2024-12-03", "lectura": 1090, "diferencia": 45, "costoEstimado": 22500}]);
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
    record4.set("agua_lectura", 1180);
    record4.set("agua_consumo", 45);
    record4.set("gas_lectura", 548);
    record4.set("gas_consumo", 12);
    record4.set("energia_lectura", 2840);
    record4.set("energia_consumo", 85);
    record4.set("arriendo", 1500000);
    record4.set("historial", [{"fecha": "2024-12-05", "lectura": 1180, "diferencia": 45, "costoEstimado": 22500}, {"fecha": "2024-12-04", "lectura": 1135, "diferencia": 45, "costoEstimado": 22500}]);
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
    record5.set("agua_lectura", 1225);
    record5.set("agua_consumo", 45);
    record5.set("gas_lectura", 560);
    record5.set("gas_consumo", 12);
    record5.set("energia_lectura", 2925);
    record5.set("energia_consumo", 85);
    record5.set("arriendo", 1500000);
    record5.set("historial", [{"fecha": "2024-12-06", "lectura": 1225, "diferencia": 45, "costoEstimado": 22500}, {"fecha": "2024-12-05", "lectura": 1180, "diferencia": 45, "costoEstimado": 22500}]);
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
    record6.set("agua_lectura", 1270);
    record6.set("agua_consumo", 45);
    record6.set("gas_lectura", 572);
    record6.set("gas_consumo", 12);
    record6.set("energia_lectura", 3010);
    record6.set("energia_consumo", 85);
    record6.set("arriendo", 1500000);
    record6.set("historial", [{"fecha": "2024-12-07", "lectura": 1270, "diferencia": 45, "costoEstimado": 22500}, {"fecha": "2024-12-06", "lectura": 1225, "diferencia": 45, "costoEstimado": 22500}]);
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
    record7.set("agua_lectura", 1315);
    record7.set("agua_consumo", 45);
    record7.set("gas_lectura", 584);
    record7.set("gas_consumo", 12);
    record7.set("energia_lectura", 3095);
    record7.set("energia_consumo", 85);
    record7.set("arriendo", 1500000);
    record7.set("historial", [{"fecha": "2024-12-08", "lectura": 1315, "diferencia": 45, "costoEstimado": 22500}, {"fecha": "2024-12-07", "lectura": 1270, "diferencia": 45, "costoEstimado": 22500}]);
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
    record8.set("agua_lectura", 1360);
    record8.set("agua_consumo", 45);
    record8.set("gas_lectura", 596);
    record8.set("gas_consumo", 12);
    record8.set("energia_lectura", 3180);
    record8.set("energia_consumo", 85);
    record8.set("arriendo", 1500000);
    record8.set("historial", [{"fecha": "2024-12-09", "lectura": 1360, "diferencia": 45, "costoEstimado": 22500}, {"fecha": "2024-12-08", "lectura": 1315, "diferencia": 45, "costoEstimado": 22500}]);
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
    record9.set("agua_lectura", 1405);
    record9.set("agua_consumo", 45);
    record9.set("gas_lectura", 608);
    record9.set("gas_consumo", 12);
    record9.set("energia_lectura", 3265);
    record9.set("energia_consumo", 85);
    record9.set("arriendo", 1500000);
    record9.set("historial", [{"fecha": "2024-12-10", "lectura": 1405, "diferencia": 45, "costoEstimado": 22500}, {"fecha": "2024-12-09", "lectura": 1360, "diferencia": 45, "costoEstimado": 22500}]);
  try {
    app.save(record9);
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