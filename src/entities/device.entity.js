import { deviceAPI } from "../api/devices.js";
import { bedsAPI } from "../api/beds.js";
import { greenhouseAPI } from "../api/greenhouse.js";
import { renderFormFromObject, extractFormData } from "../utils/formBuilder.js";
import { openModal } from "../components/universalModal/index.js";
import { renderMeasurementsTable } from "../utils/measurementsRenderer.js";

export const deviceEntity = {
  title: "Устройство",
  entityName: "Device",
  api: deviceAPI,
  tableId: "tableDevices",

  getEmpty: () => ({
    name: "",
    type: "THERMOMETER",
    status: "ACTIVE",
    greenhouseId: null,
    bedId: null,
    // macAddress: "",
    // value: 0,
    // unit: "",
  }),

  createModal: async ({ reload }) => {
    console.log("createModal");
    openModal({
      title: "Создание — Устройство",
      loading: true,
      loadingMessage: "Загружаем справочники...",
      load: async () => {
        const [greenhouses, beds] = await Promise.all([
          greenhouseAPI.getAll(),
          bedsAPI.getAll(),
        ]);

        const greenhouseOptions = greenhouses.map((g) => ({
          label: g.name ?? `Теплица ${g.id}`,
          value: g.id,
        }));

        const bedOptions = beds.map((b) => ({
          label: b.name ?? `Грядка ${b.id}`,
          value: b.id,
        }));

        const form = renderFormFromObject(
          {
            name: "",
            type: "THERMOMETER",
            status: "ACTIVE",
            greenhouseId: {
              type: "select",
              options: greenhouseOptions,
              value: null,
            },
            bedId: {
              type: "multiselect",
              options: bedOptions,
              value: [],
            },
          },
          deviceEntity.entityName
        );

        return {
          content: form,
          onSubmit: async ({ close }) => {
            const newData = extractFormData(form);
            await deviceEntity.api.create(newData);
            close();
            if (typeof reload === "function") reload();
          },
          actions: deviceEntity.actions({}, { reload }),
        };
      },
    });
  },

  actions: (context, { reload } = {}) => [
    {
      label: "Удалить устройство",
      danger: true,
      visible: !!context?.id,
      onClick: async ({ close }) => {
        if (!context?.id) return;

        if (context.bedId) {
          try {
            const bed = await bedsAPI.getById(context.bedId);
            const updated = {
              ...bed,
              deviceIds: bed.deviceIds.filter((id) => id !== context.id),
            };
            await bedsAPI.update(bed.id, updated);
          } catch (err) {
            console.warn("Ошибка обновления грядки:", err);
          }
        }

        await deviceAPI.delete(context.id);
        close();
        if (typeof reload === "function") reload();
      },
    },
    {
      label: "Показания",
      visible: !!context?.id,
      onClick: async () => {
        await renderMeasurementsTable(context.id);
      },
    },
  ],
};
