export function initTableActions(container, actions = []) {
  container.innerHTML = "";

  actions
    .filter((a) => a.visible !== false)
    .forEach(({ label, icon = "", action }) => {
      const btn = document.createElement("button");
      btn.className = "btn btn-sm btn-outline-primary me-2";
      btn.type = "button";
      btn.innerHTML = icon
        ? `<span class="me-1">${icon}</span>${label}`
        : label;
      btn.onclick = action;
      container.appendChild(btn);
    });
}
