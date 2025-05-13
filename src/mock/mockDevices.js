export const mockDevices = [
  {
    id: "dev-001",
    name: "Датчик температуры 1",
    type: "THERMOMETER",
    status: "ACTIVE",
    bedId: "bed-001",
    greenhouseId: "gh-001",
    deviceId: "temp-001",
    macAddress: "AA:BB:CC:DD:01",
    value: 23.5,
    unit: "°C",
    lastUpdated: new Date().toISOString(),
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 дня назад
    updatedAt: new Date().toISOString(),
  },
  {
    id: "dev-002",
    name: "Датчик влажности",
    type: "HUMIDITY_SENSOR",
    status: "ACTIVE",
    bedId: "bed-001",
    greenhouseId: "gh-001",
    deviceId: "hum-001",
    macAddress: "AA:BB:CC:DD:02",
    value: 45,
    unit: "%",
    lastUpdated: new Date().toISOString(),
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "dev-003",
    name: "Насос A",
    type: "IRRIGATOR",
    status: "INACTIVE",
    bedId: "bed-002",
    greenhouseId: "gh-001",
    deviceId: "pump-001",
    macAddress: "AA:BB:CC:DD:03",
    value: null,
    unit: null,
    lastUpdated: new Date().toISOString(),
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "dev-004",
    name: "Окно 1",
    type: "WINDOW",
    status: "ERROR",
    bedId: null,
    greenhouseId: "gh-001",
    deviceId: "win-001",
    macAddress: "AA:BB:CC:DD:04",
    value: null,
    unit: null,
    lastUpdated: new Date().toISOString(),
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "dev-005",
    name: "Датчик температуры 2",
    type: "THERMOMETER",
    status: "ACTIVE",
    bedId: "bed-001",
    greenhouseId: "gh-001",
    deviceId: "temp-001",
    macAddress: "AA:BB:CC:DD:02",
    value: 23.5,
    unit: "°C",
    lastUpdated: new Date().toISOString(),
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 дня назад
    updatedAt: new Date().toISOString(),
  },
];

// export const mockMeasurements = {
//   "dev-001": [
//     {
//       id: "m-001",
//       deviceId: "dev-001",
//       value: 21.8,
//       createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 ч назад
//     },
//     {
//       id: "m-002",
//       deviceId: "dev-001",
//       value: 22.1,
//       createdAt: new Date(Date.now() - 1800000).toISOString(),
//     },
//     {
//       id: "m-003",
//       deviceId: "dev-001",
//       value: 22.3,
//       createdAt: new Date().toISOString(),
//     },
//   ],
//   "dev-002": [],
// };

const now = Date.now();

export const mockMeasurements = {
  "dev-001": Array.from({ length: 10 }, (_, i) => ({
    id: `m-${i + 1}`,
    deviceId: "dev-001",
    value: 21 + Math.random(), // Примерная температура
    createdAt: new Date(now - (10 - i) * 600_000).toISOString(), // шаг 10 мин
  })),
  "dev-005": Array.from({ length: 10 }, (_, i) => ({
    id: `m-${i + 11}`,
    deviceId: "dev-005",
    value: 21 + Math.random(), // Температура от 21 до 22
    createdAt: new Date(now - (10 - i) * 600_000).toISOString(), // шаг 10 минут
  })),
};
