import { deviceAPI } from "../../api/devices.js";
// Chart должен быть доступен глобально через <script src="../libs/chart.umd.js">

export async function initSensorChart() {
  const container = document.getElementById("sensorChartCanvas");

  if (!container) {
    console.warn("❌ Контейнер sensorChartCanvas не найден");
    return;
  }

  // 👇 Вставляем HTML формы прямо из JS
  container.innerHTML = `
    <div class="card mt-4">
      <div class="card-header">
        <h5 class="mb-0">График показаний датчиков</h5>
      </div>
      <div class="card-body">
        <form id="chartFilterForm" class="row gy-2 gx-3 align-items-end">
          <div class="row mb-3">
            <div class="col-md-4">
              <label for="deviceSelect" class="form-label">Выберите датчики</label>
              <select id="deviceSelect" class="form-select h-100" multiple></select>
            </div>
            <div class="col-md-8">
              <div class="row">
                <div class="col-md-6">
                  <label for="startDate" class="form-label">Начальная дата</label>
                  <input type="date" class="form-control" id="startDate" required />
                </div>
                <div class="col-md-6">
                  <label for="endDate" class="form-label">Конечная дата</label>
                  <input type="date" class="form-control" id="endDate" required />
                </div>
              </div>
              <div class="row mt-3 align-items-end">
                <div class="col-md-6">
                  <label for="chartType" class="form-label">Тип графика</label>
                  <select id="chartType" class="form-select">
                    <option value="line">Линейный</option>
                    <option value="bar">Столбчатый</option>
                    <option value="scatter">Точечный</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <button type="submit" class="btn btn-primary w-100">Показать</button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div class="mt-4">
          <canvas id="sensorChart" height="100"></canvas>
        </div>
      </div>
    </div>
  `;

  await new Promise((resolve) => requestAnimationFrame(resolve)); // гарантируем, что DOM отрисовался

  const deviceSelect = document.getElementById("deviceSelect");
  const chartTypeSelect = document.getElementById("chartType");
  const form = document.getElementById("chartFilterForm");
  const chartCanvas = document.getElementById("sensorChart");

  if (!deviceSelect || !form || !chartCanvas) {
    console.warn("❌ Элементы формы не найдены в DOM");
    return;
  }

  let chartInstance = null;

  // Загрузка доступных датчиков
  async function loadDevices() {
    const devices = await deviceAPI.getAll();
    devices.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = d.name || d.id;
      deviceSelect.appendChild(opt);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const deviceIds = Array.from(deviceSelect.selectedOptions).map(
      (o) => o.value
    );
    const from = document.getElementById("startDate").value;
    const to = document.getElementById("endDate").value;
    const chartType = chartTypeSelect?.value || "line";

    if (!deviceIds.length) return alert("Выберите хотя бы один датчик");

    const datasets = await Promise.all(
      deviceIds.map(async (id) => {
        const data = await deviceAPI.getMeasurements(id, from, to);
        return {
          label: id,
          data: data
            .filter((d) => d.createdAt && !isNaN(Date.parse(d.createdAt)))
            .map((d) => ({ x: d.createdAt, y: d.value })),
          borderColor: getRandomColor(),
          backgroundColor: "transparent",
          tension: 0.3,
          pointRadius: 4,
        };
      })
    );

    if (chartInstance) chartInstance.destroy();

    const ctx = chartCanvas.getContext("2d");
    if (!ctx) {
      console.error("Не удалось получить context у canvas");
      return;
    }

    chartInstance = new window.Chart(ctx, {
      type: chartType,
      data: { datasets },
      options: {
        responsive: true,
        parsing: true,
        scales: {
          x: {
            type: "time",
            time: { unit: "hour" },
            title: { display: true, text: "Время" },
          },
          y: { title: { display: true, text: "Значение" } },
        },
        plugins: {
          legend: { position: "top" },
          tooltip: { intersect: false, mode: "index" },
        },
      },
    });

    console.log("📊 График отрисован с типом:", chartType);
  });

  function getRandomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
  }

  loadDevices();
}
