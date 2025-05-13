import { apiRequest } from "./apiClient.js";
import { mockCrops as initialMockCrops } from "../mock/mockCrops.js";

let mockCrops = [...initialMockCrops];

export const cropsAPI = {
  getAll: () =>
    apiRequest("/v1/crops", {}, () => Promise.resolve([...mockCrops])),

  getById: (id) =>
    apiRequest(`/v1/crops/${id}`, {}, () =>
      Promise.resolve(mockCrops.find((c) => c.id === id))
    ),

  create: (crop) =>
    apiRequest(
      "/v1/crops",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(crop),
      },
      () => {
        const newCrop = { ...crop, id: Date.now().toString() };
        mockCrops.push(newCrop);
        return Promise.resolve(newCrop);
      }
    ),

  update: (id, crop) =>
    apiRequest(
      `/v1/crops/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(crop),
      },
      () => {
        const index = mockCrops.findIndex((c) => c.id === id);
        if (index === -1) return Promise.reject("Культура не найдена (mock)");
        mockCrops[index] = { ...mockCrops[index], ...crop };
        return Promise.resolve(mockCrops[index]);
      }
    ),

  delete: (id) =>
    apiRequest(`/v1/crops/${id}`, { method: "DELETE" }, () => {
      mockCrops = mockCrops.filter((c) => c.id !== id);
      return Promise.resolve();
    }),
};
