import { loadComponent } from "./utils/componentLoader.js";
import { apis } from "./config/apis.js";
import { columns } from "./data/columns.js";
import { initDataTable } from "./components/dataTable/index.js";
import { initSensorChart } from "./components/sensorChart/index.js";

async function loadAndRender(config, columns) {
  const {
    api,
    title,
    entityName,
    columnsKey,
    getEmpty,
    actions: entityActions,
    createModal,
  } = config;

  const targetId = config.tableId || "table" + config.entityName;
  if (!document.getElementById(targetId)) {
    const h2 = document.createElement("h2");
    h2.textContent = config.title;

    const div = document.createElement("div");
    div.id = targetId;

    document.querySelector(".container").append(h2, div);
  }

  const container = document.getElementById(targetId);
  container.innerHTML = "<div class='text-muted'>Загрузка...</div>";

  const data = await api.getAll();

  await loadComponent(targetId, "./components/dataTable", initDataTable, {
    targetId,
    columns: columns[columnsKey],
    data,
    entityName,
    modal: {
      title,
      api,
      actions: config.actions,
    },
    actions: [
      {
        label: "Создать " + title,
        icon: "➕",
        action: () => {
          createModal?.({
            reload: () => loadAndRender(config, columns),
          });
        },
      },
    ],
    refreshOnModalClose: true,
  });
}

(async () => {
  for (const config of Object.values(apis)) {
    await loadAndRender(config, columns);
  }

  const div = document.createElement("div");
  div.id = "sensorChartCanvas";
  //   <div id="sensorChartCanvas"></div>
  document.querySelector(".container").prepend(div);

  await loadComponent(
    "sensorChartCanvas",
    "./components/sensorChart",
    initSensorChart
  );
})();
