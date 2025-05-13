import { ENUMS } from "../enums/enums.js";
import { LOOKUPS } from "./lookups.js";

/**
 * Рендерит форму по объекту с поддержкой ENUMS, LOOKUPS, фильтрацией и Bootstrap
 */
export function renderFormFromObject(
  obj,
  entityName = null,
  contextEntity = null
) {
  const wrapper = document.createElement("div");

  for (const [key, value] of Object.entries(obj)) {
    const group = document.createElement("div");
    group.className = "mb-3";

    const label = document.createElement("label");
    label.textContent = key;
    label.className = "form-label";
    group.appendChild(label);

    let input;

    if (value && typeof value === "object" && value.type === "select") {
      input = document.createElement("select");
      input.name = key;
      input.className = "form-select";

      value.options.forEach((opt) => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.label;
        if (opt.value === value.value) option.selected = true;
        input.appendChild(option);
      });

      if (typeof value.onChange === "function") {
        input.addEventListener("change", value.onChange);
      }

      group.appendChild(input);
      wrapper.appendChild(group);
      continue;
    }

    if (value && typeof value === "object" && value.type === "multiselect") {
      input = document.createElement("select");
      input.name = key;
      input.className = "form-select";
      input.multiple = true;

      value.options.forEach((opt) => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.label;
        if (Array.isArray(value.value) && value.value.includes(opt.value)) {
          option.selected = true;
        }
        input.appendChild(option);
      });

      group.appendChild(input);
      wrapper.appendChild(group);
      continue;
    }

    const enumOptions = entityName ? ENUMS?.[entityName]?.[key] : null;
    if (enumOptions) {
      input = document.createElement("select");
      input.name = key;
      input.className = "form-select";
      enumOptions.forEach((optionValue) => {
        const opt = document.createElement("option");
        opt.value = optionValue;
        opt.textContent = optionValue;
        if (value === optionValue) opt.selected = true;
        input.appendChild(opt);
      });

      group.appendChild(input);
      wrapper.appendChild(group);
      continue;
    }

    const lookup = entityName ? LOOKUPS?.[entityName]?.[key] : null;
    if (lookup) {
      const {
        labelField = "name",
        source,
        multiple = false,
        filterFn = null,
      } = lookup;

      const select = document.createElement("select");
      select.name = key;
      select.className = "form-select lookup-field";
      if (multiple) select.multiple = true;

      source().then((options) => {
        let allOptions = [...options];
        if (typeof filterFn === "function") {
          allOptions = allOptions.filter((item) =>
            filterFn(item, contextEntity)
          );
        }

        const renderOptions = (filtered) => {
          select.innerHTML = "";
          filtered.forEach((item) => {
            const opt = document.createElement("option");
            opt.value = item.id;
            opt.textContent = item[labelField];
            select.appendChild(opt);
          });

          if (!multiple && typeof value === "string") {
            select.value = value;
          } else if (multiple && Array.isArray(value)) {
            Array.from(select.options).forEach((opt) => {
              if (value.includes(opt.value)) opt.selected = true;
            });
          }
        };

        renderOptions(allOptions);

        // searchInput.addEventListener("input", () => {
        //   const query = searchInput.value.toLowerCase();
        //   const filtered = allOptions.filter((item) =>
        //     item[labelField]?.toLowerCase().includes(query)
        //   );
        //   renderOptions(filtered);
        // });
      });

      //group.appendChild(searchInput);
      group.appendChild(select);
      wrapper.appendChild(group);
      continue;
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const subGroup = document.createElement("fieldset");
      const legend = document.createElement("legend");
      legend.textContent = key;
      subGroup.className = "mb-3";
      subGroup.appendChild(legend);

      for (const [subKey, subValue] of Object.entries(value)) {
        const subWrap = document.createElement("div");
        subWrap.className = "mb-2";

        const subLabel = document.createElement("label");
        subLabel.textContent = subKey;
        subLabel.className = "form-label";

        const subInput = document.createElement("input");
        subInput.type = typeof subValue === "number" ? "number" : "text";
        subInput.name = `${key}.${subKey}`;
        subInput.value = subValue ?? "";
        subInput.className = "form-control";

        subWrap.append(subLabel, subInput);
        subGroup.appendChild(subWrap);
      }

      wrapper.appendChild(subGroup);
      continue;
    }

    if (Array.isArray(value)) {
      input = document.createElement("textarea");
      input.name = key;
      input.value = value.join(", ");
      input.className = "form-control";
      input.rows = 2;
    } else {
      input = document.createElement("input");
      input.type = typeof value === "number" ? "number" : "text";
      input.name = key;
      input.value = value ?? "";
      input.className = "form-control";
    }

    group.appendChild(input);
    wrapper.appendChild(group);
  }

  return wrapper;
}

export function extractFormData(formEl) {
  const result = {};

  formEl.querySelectorAll("input, textarea, select").forEach((input) => {
    const path = input.name.split(".");
    if (!path[0]) return;

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
