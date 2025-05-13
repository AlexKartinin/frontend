export const mockSettings = [
  {
    id: "gh-setting-001",
    tempMin: 15,
    tempMax: 30,
    humidityMin: 40,
    humidityMax: 70,
    lightIntensityMin: 200,
    lightIntensityMax: 800,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // вчера
    updatedAt: new Date().toISOString(),
  },
];
