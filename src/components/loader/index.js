export function createLoader(message = "Загрузка...") {
  const wrapper = document.createElement("div");
  wrapper.className = "d-flex justify-content-center align-items-center p-4";

  const text = document.createElement("div");
  text.className = "spinner-border me-2";
  text.setAttribute("role", "status");

  const label = document.createElement("span");
  label.textContent = message;

  wrapper.append(text, label);
  return wrapper;
}
