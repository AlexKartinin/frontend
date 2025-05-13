export const ENUMS = {
  Device: {
    type: [
      "THERMOMETER",
      "HUMIDITY_SENSOR",
      "LIGHT_SENSOR",
      "WINDOW",
      "IRRIGATOR",
    ],
    status: ["ACTIVE", "INACTIVE", "ERROR"],
  },

  // Дополнительно: можно добавить вручную или вытянуть из API
  Unit: {
    temperature: "°C",
    humidity: "%",
    light: "lx",
    default: "—",
  },

  // Пример для будущего
  IrrigationSchedule: {
    daysOfWeek: ["1", "2", "3", "4", "5", "6", "7"],
    isActive: [true, false],
  },
};
