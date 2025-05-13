import { apiRequest } from "./apiClient.js";
import { mockBeds as initialMockBeds } from "../mock/mockBeds.js";

let mockBeds = [...initialMockBeds];

export const bedsAPI = {
  getAll: () =>
    apiRequest("/v1/beds", {}, () => Promise.resolve([...mockBeds])),

  getById: (id) =>
    apiRequest(`/v1/beds/${id}`, {}, () =>
      Promise.resolve(mockBeds.find((b) => b.id === id))
    ),

  create: (bed) =>
    apiRequest(
      "/v1/beds",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bed),
      },
      () => {
        const newBed = { ...bed, id: Date.now().toString() };
        mockBeds.push(newBed);
        return Promise.resolve(newBed);
      }
    ),

  update: (id, bed) =>
    apiRequest(
      `/v1/beds/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bed),
      },
      () => {
        const index = mockBeds.findIndex((b) => b.id === id);
        if (index === -1) return Promise.reject("Грядка не найдена (mock)");
        mockBeds[index] = { ...mockBeds[index], ...bed };
        return Promise.resolve(mockBeds[index]);
      }
    ),

  delete: (id) =>
    apiRequest(`/v1/beds/${id}`, { method: "DELETE" }, () => {
      mockBeds = mockBeds.filter((b) => b.id !== id);
      return Promise.resolve();
    }),
};
