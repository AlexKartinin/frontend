import { apiRequest } from "./apiClient.js";
import { mockProfiles as initialMockProfiles } from "../mock/mockProfiles.js";

let mockProfiles = [...initialMockProfiles];

export const irrigationAPI = {
  getAll: () =>
    apiRequest("/v1/irrigation", {}, () => Promise.resolve([...mockProfiles])),

  getById: (id) =>
    apiRequest(`/v1/irrigation/${id}`, {}, () =>
      Promise.resolve(mockProfiles.find((p) => p.id === id))
    ),

  create: (profile) =>
    apiRequest(
      "/v1/irrigation",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      },
      () => {
        const newProfile = { ...profile, id: Date.now().toString() };
        mockProfiles.push(newProfile);
        return Promise.resolve(newProfile);
      }
    ),

  update: (id, profile) =>
    apiRequest(
      `/v1/irrigation/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      },
      () => {
        const index = mockProfiles.findIndex((p) => p.id === id);
        if (index === -1) return Promise.reject("Профиль не найден (mock)");
        mockProfiles[index] = { ...mockProfiles[index], ...profile };
        return Promise.resolve(mockProfiles[index]);
      }
    ),

  delete: (id) =>
    apiRequest(`/v1/irrigation/${id}`, { method: "DELETE" }, () => {
      mockProfiles = mockProfiles.filter((p) => p.id !== id);
      return Promise.resolve();
    }),
};
