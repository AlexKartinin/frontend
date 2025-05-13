export const mockBeds = [
  {
    id: "bed-001",
    greenhouseId: "gh-001",
    name: "Грядка №1",
    cropId: "crop-001",
    deviceIds: ["dev-001", "dev-002"],
    createdAt: new Date(Date.now() - 86400000).toISOString(), // вчера
    updatedAt: new Date().toISOString(),
  },
  {
    id: "bed-002",
    greenhouseId: "gh-001",
    name: "Грядка №2",
    cropId: null,
    deviceIds: [],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), // позавчера
    updatedAt: new Date(Date.now() - 7200000).toISOString(), // 2 часа назад
  },
];
