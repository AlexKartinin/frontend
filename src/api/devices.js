import { apiRequest } from "./apiClient.js";
import { mockDevices, mockMeasurements } from "../mock/mockDevices.js";

let fallbackDevices = [...mockDevices];

export const deviceAPI = {
  getAll: () => {
    console.log("📦 getAll →", fallbackDevices);
    return apiRequest("/v1/devices", {}, () =>
      Promise.resolve([...fallbackDevices])
    );
  },

  getById: (id) =>
    apiRequest(`/v1/devices/${id}`, {}, () =>
      Promise.resolve(fallbackDevices.find((d) => d.id === id))
    ),

  create: (device) =>
    apiRequest(
      "/v1/devices",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(device),
      },
      () => {
        const newDevice = { ...device, id: Date.now().toString() };
        fallbackDevices.push(newDevice);
        return Promise.resolve(newDevice);
      }
    ),

  update: (id, device) =>
    apiRequest(
      `/v1/devices/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(device),
      },
      () => {
        const index = fallbackDevices.findIndex((d) => d.id === id);
        if (index === -1) return Promise.reject("Device not found (mock)");
        fallbackDevices[index] = { ...fallbackDevices[index], ...device };
        return Promise.resolve(fallbackDevices[index]);
      }
    ),

  delete: (id) =>
    apiRequest(`/v1/devices/${id}`, { method: "DELETE" }, () => {
      console.log("🔁 fallback: удаляем устройство", id);
      fallbackDevices = fallbackDevices.filter((d) => d.id !== id);
      return Promise.resolve();
    }),

  getCurrentMeasurements: () =>
    apiRequest("/v1/devices/measurements", {}, () =>
      Promise.resolve(
        fallbackDevices.map((d) => ({
          id: d.id,
          value: d.value ?? 0,
          unit: d.unit,
          timestamp: d.lastUpdated,
        }))
      )
    ),

  getMeasurements: (id, hours = 24) =>
    apiRequest(`/v1/devices/${id}/measurements?hours=${hours}`, {}, () =>
      Promise.resolve(mockMeasurements[id] || [])
    ),

  test: (id) =>
    Promise.resolve({
      id,
      result: "Тестовое действие выполнено (mock)",
      action: "noop",
      timestamp: new Date().toISOString(),
    }),
};
