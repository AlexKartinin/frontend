import { createLoader } from "../loader/index.js";

/**
 * Открывает универсальную модалку
 * @param {object} options
 */
export function openModal({
  title = "",
  content = "",
  onSubmit = null,
  onClose = null,
  actions = [],
  loading = false,
  loadingMessage = "Загрузка...",
  load = null,
  onOpen = null,
}) {
  let modalEl = document.getElementById("universalModal");

  if (!modalEl) {
    modalEl = createDynamicModal();
  }

  const titleEl = modalEl.querySelector("#modalTitle");
  const bodyEl = modalEl.querySelector("#modalBody");
  const btnSubmit = modalEl.querySelector("#modalSubmit");
  const btnCancel = modalEl.querySelector("#modalCancel");
  const buttonRow = modalEl.querySelector(".button-row");

  const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);

  // Закрытие
  function close() {
    bsModal.hide();
    if (typeof onClose === "function") onClose();
  }

  // Отрисовка начального контента
  titleEl.textContent = title;
  bodyEl.innerHTML = "";
  const initialContent =
    loading || typeof load === "function"
      ? createLoader(loadingMessage)
      : content;

  if (typeof initialContent === "string") {
    bodyEl.innerHTML = initialContent;
  } else if (initialContent instanceof HTMLElement) {
    bodyEl.appendChild(initialContent);
  }

  // Очистка и установка действий
  buttonRow.querySelectorAll(".custom-action").forEach((el) => el.remove());

  if (Array.isArray(actions)) {
    actions
      .filter((a) => a.visible !== false)
      .forEach((action) => {
        const btn = document.createElement("button");
        btn.className = `btn custom-action ${
          action.danger ? "btn-danger" : "btn-secondary"
        }`;
        btn.type = "button";
        btn.textContent = action.label;
        btn.onclick = () => action.onClick({ close, context: content });
        buttonRow.prepend(btn);
      });
  }

  // Установка обработчиков
  btnSubmit.onclick = () =>
    typeof onSubmit === "function"
      ? onSubmit({ modal: modalEl, body: bodyEl, close })
      : close();

  btnCancel.onclick = () => close();

  bsModal.show();

  if (typeof onOpen === "function") {
    onOpen({ close, modal: modalEl });
  }

  // Подмена контента при асинхронной загрузке
  if (typeof load === "function") {
    load().then((result) => {
      const { content, onSubmit, actions } =
        result instanceof HTMLElement ? { content: result } : result;

      updateModal({ content, onSubmit, actions }, modalEl, close);
    });
  }
}

/**
 * Обновляет содержимое и обработчики текущей модалки
 */
function updateModal({ content, onSubmit, actions = [] }, modalEl, close) {
  const bodyEl = modalEl.querySelector("#modalBody");
  const btnSubmit = modalEl.querySelector("#modalSubmit");
  const buttonRow = modalEl.querySelector(".button-row");

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  // Обновить тело
  bodyEl.innerHTML = "";
  if (typeof content === "string") {
    bodyEl.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    bodyEl.appendChild(content);
  }

  // Обновить действия
  buttonRow.querySelectorAll(".custom-action").forEach((el) => el.remove());
  if (Array.isArray(actions)) {
    actions
      .filter((a) => a.visible !== false)
      .forEach((action) => {
        const btn = document.createElement("button");
        btn.className = `btn custom-action ${
          action.danger ? "btn-danger" : "btn-secondary"
        }`;
        btn.type = "button";
        btn.textContent = action.label;
        btn.onclick = () => action.onClick({ close });
        buttonRow.prepend(btn);
      });
  }

  // Обновить onSubmit
  btnSubmit.onclick = () =>
    typeof onSubmit === "function"
      ? onSubmit({ modal: modalEl, body: bodyEl, close })
      : close();
}

/**
 * Создаёт модалку, если нет в DOM
 */
function createDynamicModal() {
  const modalEl = document.createElement("div");
  modalEl.className = "modal fade";
  modalEl.id = "universalModal";
  modalEl.setAttribute("tabindex", "-1");
  modalEl.setAttribute("data-bs-theme", "dark");
  modalEl.setAttribute("data-dynamic", "true");

  modalEl.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitle"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body" id="modalBody"></div>
          <div class="modal-footer button-row">
            <button type="button" class="btn btn-secondary" id="modalCancel">Отмена</button>
            <button type="button" class="btn btn-primary" id="modalSubmit">Применить</button>
          </div>
        </div>
      </div>
    `;

  document.body.appendChild(modalEl);
  return modalEl;
}
