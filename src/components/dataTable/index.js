export async function initDataTable(config) {
  const {
    targetId,
    columns,
    data,
    entityName = null,
    onUpdate = null,
    onDelete = null,
    searchFields = [],
    filterField = null,
    editableFields = [],
    modal = null, // { title, api }
    actions = [], // [{ label, icon, visible, action }]
    refreshOnModalClose = true, // автообновление таблицы после модалки
  } = config;

  const container = document.getElementById(targetId);
  if (!container) {
    console.warn(`Контейнер с id #${targetId} не найден.`);
    return;
  }

  // Вставляем HTML-структуру таблицы, если пусто
  if (!container.querySelector(".data-table")) {
    container.innerHTML = `
        <div class="card mt-3">
        <div class="card-header d-flex justify-content-between align-items-center">
            <div class="table-actions"></div>
            <div class="data-table-toolbar"></div>
        </div>
        <div class="table-responsive">
            <table
            class="table table-bordered table-hover table-striped align-middle mb-0"
            >
            <thead>
                <tr class="data-table-header"></tr>
            </thead>
            <tbody class="data-table-body"></tbody>
            </table>
        </div>
        </div>
      `;
  }

  const headerRow = container.querySelector(".data-table-header");
  const body = container.querySelector(".data-table-body");
  const toolbarContainer = container.querySelector(".data-table-toolbar");
  const actionContainer = container.querySelector(".table-actions");

  // Подключаем действия через компонент tableActions
  if (actions.length > 0 && actionContainer) {
    const { initTableActions } = await import("../tableActions/index.js");
    initTableActions(actionContainer, actions);
  }

  let currentData = [...data];
  let sortField = null;
  let sortDirection = "asc";

  function buildHeader() {
    headerRow.innerHTML = "";
    columns.forEach((col) => {
      const th = document.createElement("th");
      th.textContent = col.title;

      if (col.field !== "actions") {
        th.style.cursor = "pointer";
        th.onclick = () => sortData(col.field);
        if (col.field === sortField) {
          th.textContent += sortDirection === "asc" ? " ▲" : " ▼";
        }
      }

      headerRow.appendChild(th);
    });
  }

  function renderTable(filteredData) {
    body.innerHTML = "";

    filteredData.forEach((row) => {
      const tr = document.createElement("tr");
      tr.className = "align-middle";
      tr.dataset.id = row.id;

      columns.forEach((col) => {
        const td = document.createElement("td");
        td.className = "text-truncate";

        if (col.field === "actions") {
          const btn = document.createElement("button");
          btn.className = "btn btn-sm btn-danger";
          btn.textContent = "Удалить";
          btn.onclick = (e) => {
            e.stopPropagation();
            if (typeof onDelete === "function") onDelete(row.id);
            tr.remove();
          };
          td.appendChild(btn);
        } else if (editableFields.includes(col.field)) {
          td.textContent = row[col.field] || "";

          td.onclick = (e) => {
            e.stopPropagation();
            const oldValue = row[col.field] || "";
            const input = document.createElement("input");
            input.type = "text";
            input.value = oldValue;
            input.style.width = "100%";

            td.innerHTML = "";
            td.appendChild(input);
            input.focus();

            const save = () => {
              const newValue = input.value.trim();
              if (newValue !== oldValue) {
                row[col.field] = newValue;
                if (typeof onUpdate === "function") {
                  onUpdate(row, col.field, newValue);
                }
              }
              td.textContent = row[col.field];
            };

            input.addEventListener("blur", save);
            input.addEventListener("keydown", (e) => {
              if (e.key === "Enter") input.blur();
            });
          };
        } else {
          td.textContent = row[col.field] ?? "";
        }

        tr.appendChild(td);
      });

      // Модалка по клику на строку
      if (modal) {
        tr.onclick = async () => {
          const { openModal } = await import("../universalModal/index.js");
          const { renderFormFromObject, extractFormData } = await import(
            "../../utils/formBuilder.js"
          );

          const form = renderFormFromObject(row, entityName);
          const wrapper = document.createElement("div");
          const pre = document.createElement("pre");
          pre.textContent = JSON.stringify(row, null, 2);

          wrapper.append(form, pre);
          console.log("initDataTable", row);
          console.log(modal.actions);
          openModal({
            title: modal.title,
            content: wrapper,
            onSubmit: async ({ close }) => {
              const updated = extractFormData(form);
              if (row?.id) {
                await modal.api.update(row.id, updated);
              } else {
                await modal.api.create(updated);
              }
              close();
              if (refreshOnModalClose) reloadData();
            },
            actions: modal.actions?.(row, { reload: reloadData }),
          });
        };
      }

      body.appendChild(tr);
    });
  }

  function sortData(field) {
    if (sortField === field) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortField = field;
      sortDirection = "asc";
    }

    currentData.sort((a, b) => {
      const valA = (a[field] || "").toString().toLowerCase();
      const valB = (b[field] || "").toString().toLowerCase();
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    buildHeader();
    renderTable(currentData);
  }

  async function reloadData() {
    if (modal?.api?.getAll) {
      const fresh = await modal.api.getAll();
      currentData = [...fresh];
      buildHeader();
      renderTable(currentData);
    }
  }

  buildHeader();
  renderTable(currentData);
}
