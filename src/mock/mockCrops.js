export const mockCrops = [
  {
    id: "crop-001",
    name: "Помидор",
    tempMin: 18,
    tempMax: 30,
    waterRequirementLiters: 3,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "crop-002",
    name: "Огурец",
    tempMin: 16,
    tempMax: 28,
    waterRequirementLiters: 2.5,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
