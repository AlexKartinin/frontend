import { apiRequest } from "./apiClient.js";
import { mockSettings as greenhouse } from "../mock/mockGreenhouse.js";

let mockSettings = [...greenhouse];

export const greenhouseAPI = {
  getAll: () =>
    apiRequest("/v1/greenhouse/settings", {}, () =>
      Promise.resolve([...mockSettings])
    ),

  getById: (id) =>
    apiRequest(`/v1/greenhouse/settings/${id}`, {}, () =>
      Promise.resolve(mockSettings.find((s) => s.id === id))
    ),

  create: (setting) =>
    apiRequest(
      "/v1/greenhouse/settings",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setting),
      },
      () => {
        const newSetting = { ...setting, id: Date.now().toString() };
        mockSettings.push(newSetting);
        return Promise.resolve(newSetting);
      }
    ),

  update: (id, setting) =>
    apiRequest(
      `/v1/greenhouse/settings/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setting),
      },
      () => {
        const index = mockSettings.findIndex((s) => s.id === id);
        if (index === -1) return Promise.reject("Настройка не найдена (mock)");
        mockSettings[index] = { ...mockSettings[index], ...setting };
        return Promise.resolve(mockSettings[index]);
      }
    ),

  delete: (id) =>
    apiRequest(`/v1/greenhouse/settings/${id}`, { method: "DELETE" }, () => {
      mockSettings = mockSettings.filter((s) => s.id !== id);
      return Promise.resolve();
    }),
};
