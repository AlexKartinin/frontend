import { ENUMS } from "../enums/enums.js";
import { LOOKUPS } from "./lookups.js";

/**
 * Рендерит форму по объекту, используя ENUMS и LOOKUPS для select-полей
 */
export function renderFormFromObject(obj, entityName = null) {
  const wrapper = document.createElement("div");

  for (const [key, value] of Object.entries(obj)) {
    const label = document.createElement("label");
    label.textContent = key;
    label.style.display = "block";
    label.style.margin = "0.5em 0 0.2em";

    let input;

    // 🎯 ENUM → <select>
    const enumOptions = entityName ? ENUMS?.[entityName]?.[key] : null;
    if (enumOptions) {
      input = document.createElement("select");
      input.name = key;
      enumOptions.forEach((optionValue) => {
        const opt = document.createElement("option");
        opt.value = optionValue;
        opt.textContent = optionValue;
        if (value === optionValue) opt.selected = true;
        input.appendChild(opt);
      });

      wrapper.append(label, input);
      continue;
    }

    // 🔗 LOOKUP → input + filtered select
    const lookup = entityName ? LOOKUPS?.[entityName]?.[key] : null;
    if (lookup) {
      const { labelField = "name", source, multiple = false } = lookup;

      const select = document.createElement("select");
      const searchInput = document.createElement("input");
      searchInput.placeholder = "Поиск...";
      searchInput.style.marginBottom = "0.5em";
      select.name = key;
      select.style.width = "100%";
      if (multiple) select.multiple = true;

      source().then((options) => {
        const allOptions = [...options];

        const renderOptions = (filtered) => {
          select.innerHTML = "";
          filtered.forEach((item) => {
            const opt = document.createElement("option");
            opt.value = item.id;
            opt.textContent = item[labelField];
            if (
              (multiple && Array.isArray(value) && value.includes(item.id)) ||
              (!multiple && value === item.id)
            ) {
              opt.selected = true;
            }
            select.appendChild(opt);
          });
        };

        renderOptions(allOptions);

        searchInput.addEventListener("input", () => {
          const query = searchInput.value.toLowerCase();
          const filtered = allOptions.filter((item) =>
            item[labelField]?.toLowerCase().includes(query)
          );
          renderOptions(filtered);
        });
      });

      wrapper.append(label, searchInput, select);
      continue;
    }

    // 🧩 Вложенный объект
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const subGroup = document.createElement("fieldset");
      const legend = document.createElement("legend");
      legend.textContent = key;
      subGroup.appendChild(legend);

      for (const [subKey, subValue] of Object.entries(value)) {
        const subLabel = document.createElement("label");
        subLabel.textContent = subKey;
        subLabel.style.display = "block";
        subLabel.style.margin = "0.3em 0 0.2em";

        const subInput = document.createElement("input");
        subInput.type = typeof subValue === "number" ? "number" : "text";
        subInput.name = `${key}.${subKey}`;
        subInput.value = subValue ?? "";
        subInput.style.width = "100%";

        subGroup.append(subLabel, subInput);
      }

      wrapper.appendChild(subGroup);
      continue;
    }

    // 📋 Массив как textarea
    if (Array.isArray(value)) {
      input = document.createElement("textarea");
      input.name = key;
      input.value = value.join(", ");
      input.style.width = "100%";
      input.rows = 2;
    } else {
      input = document.createElement("input");
      input.type = typeof value === "number" ? "number" : "text";
      input.name = key;
      input.value = value ?? "";
      input.style.width = "100%";
    }

    wrapper.append(label, input);
  }

  return wrapper;
}

/**
 * Извлекает данные из формы, включая вложенные объекты, массивы, select[multiple]
 */
export function extractFormData(formEl) {
  const result = {};

  formEl.querySelectorAll("input, textarea, select").forEach((input) => {
    const path = input.name.split(".");

    let value;

    if (input.tagName === "SELECT" && input.multiple) {
      value = Array.from(input.selectedOptions).map((opt) => opt.value);
    } else if (input.type === "number") {
      value = Number(input.value);
    } else {
      value = input.value.trim();
      if (input.tagName === "TEXTAREA" && value.includes(",")) {
        value = value.split(",").map((v) => v.trim());
      }
    }

    if (path.length === 1) {
      result[path[0]] = value;
    } else {
      if (!result[path[0]]) result[path[0]] = {};
      result[path[0]][path[1]] = value;
    }
  });

  return result;
}
