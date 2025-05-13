import { deviceEntity } from "../entities/device.entity.js";
import { bedsAPI } from "../api/beds.js";
import { cropsAPI } from "../api/crops.js";
import { irrigationAPI } from "../api/irrigation.js";
import { greenhouseAPI } from "../api/greenhouse.js";

export const apis = {
  tableDevices: {
    ...deviceEntity,
    columnsKey: "devices", // добавляем вручную, чтобы привязать к columns
  },
  tableBeds: {
    api: bedsAPI,
    columnsKey: "beds",
    title: "Грядка",
    entityName: "Bed",
    tableId: "tableBeds",
  },
  tableCrops: {
    api: cropsAPI,
    columnsKey: "crops",
    title: "Культура",
    entityName: "Crop",
    tableId: "tableCrops",
  },
  tableIrrigation: {
    api: irrigationAPI,
    columnsKey: "irrigation",
    title: "Профиль полива",
    entityName: "IrrigationSchedule",
    tableId: "tableIrrigation",
  },
  tableSettings: {
    api: greenhouseAPI,
    columnsKey: "settings",
    title: "Параметры теплицы",
    entityName: "GreenhouseSetting",
    tableId: "tableSettings",
  },
};
