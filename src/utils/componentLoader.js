/**
 * Загружает HTML-компонент и вставляет его в указанный контейнер.
 * Инициализационная JS-функция передаётся отдельно.
 *
 * @param {string} containerId - ID контейнера на странице
 * @param {string} htmlPath - путь к папке компонента (например "./components/profileModal")
 * @param {Function} [initFn] - функция инициализации, вызывается после загрузки HTML
 * @param {any} [config] - конфигурация для передачи в initFn
 */
export async function loadComponent(
  containerId,
  htmlPath,
  initFn = null,
  config = null
) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Контейнер #${containerId} не найден`);
    return;
  }

  try {
    const html = await fetch(`${htmlPath}/index.html`).then((res) => {
      if (!res.ok) throw new Error(`Не удалось загрузить HTML: ${res.status}`);
      return res.text();
    });

    container.innerHTML = html;

    // Ждём 2 animationFrame — для полной отрисовки элементов
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );

    if (typeof initFn === "function") {
      initFn(config);
    }
  } catch (error) {
    console.error(`❌ Ошибка загрузки компонента из ${htmlPath}:`, error);
  }
}
