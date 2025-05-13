import { deviceAPI } from "../api/devices.js";

export async function renderMeasurementsTable(deviceId) {
  const targetId = "deviceMeasurements";
  let container = document.getElementById(targetId);

  if (!container) {
    const h3 = document.createElement("h3");
    h3.textContent = "Показания устройства";
    h3.className = "mt-5";

    container = document.createElement("div");
    container.id = targetId;
    container.className = "data-table-wrapper";

    document.querySelector(".container").append(h3, container);
  }

  container.innerHTML = "<div class='text-muted'>Загрузка...</div>";

  try {
    const data = await deviceAPI.getMeasurements(deviceId);
    if (!data.length) {
      container.innerHTML = "<div class='text-muted'>Нет данных</div>";
      return;
    }

    const table = document.createElement("table");
    table.className = "table table-sm table-bordered mt-2";

    const thead = document.createElement("thead");
    thead.innerHTML = "<tr><th>Время</th><th>Значение</th></tr>";

    const tbody = document.createElement("tbody");
    data.forEach(({ createdAt, value }) => {
      const date = new Date(createdAt);
      const formatted = isNaN(date) ? "—" : date.toLocaleString();

      const row = document.createElement("tr");
      row.innerHTML = `<td>${formatted}</td><td>${value}</td>`;
      tbody.appendChild(row);
    });

    table.append(thead, tbody);
    container.innerHTML = "";
    container.appendChild(table);
  } catch (err) {
    container.innerHTML = `<div class='text-danger'>Ошибка загрузки: ${err.message}</div>`;
  }
}
