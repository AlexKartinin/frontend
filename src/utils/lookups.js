import { cropsAPI } from "../api/crops.js";
import { deviceAPI } from "../api/devices.js";

export const LOOKUPS = {
  Bed: {
    cropId: {
      labelField: "name",
      source: async () => await cropsAPI.getAll(),
    },
    deviceIds: {
      labelField: "name",
      multiple: true,
      source: async () => await deviceAPI.getAll(),
      //   filterFn: (device, bed) => {
      //     if (!bed?.greenhouseId) return false;
      //     return (
      //       device.greenhouseId === bed.greenhouseId &&
      //       (!device.bedId || device.bedId === bed.id)
      //     );
      //   },
    },
  },
};
