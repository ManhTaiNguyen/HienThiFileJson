import { createCrossWord } from "./crossword.js";
import { createMultiple } from "./multiple.js";
import { createNumbering } from "./numbering.js";
import { createSingle } from "./single.js";
import { createSorting } from "./sorting.js";
import { createTrueFalse } from "./truefalse.js";

export function createExerciseBox(data, index) {
  const boxContainer = document.getElementById("box_container");

  // Tạo box chính
  const box = document.createElement("div");
  box.className = "box";
  box.id = `box-${index}`;

  // Header
  const boxHeader = document.createElement("div");
  boxHeader.className = "box-header";

  // Reset
  const resetBtn = document.createElement("button");
  resetBtn.className = "btn-check";
  resetBtn.id = `reset-btn-${index}`;
  resetBtn.style.color = data.btnTextColor;
  resetBtn.style.fontSize = "20px";
  resetBtn.style.backgroundColor = data.btnColor;
  resetBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';

  // Check
  const checkBtn = document.createElement("button");
  checkBtn.className = "btn-check";
  checkBtn.id = `check-btn-${index}`;
  checkBtn.style.color = data.btnTextColor;
  checkBtn.style.fontSize = "20px";
  checkBtn.style.backgroundColor = data.btnColor;
  checkBtn.innerHTML = '<i class="fa-regular fa-circle-check"></i>';

  // Thay đổi cỡ chữ
  const fontSizeSelect = document.createElement("select");
  fontSizeSelect.className = "font-size-selector";
  fontSizeSelect.id = `font-size-selector-${index}`;

  let optionsHTML = "";
  for (let i = 2; i <= 120; i += 2) {
    optionsHTML += `<option value="${i}px" ${
      i === 24 ? "selected" : ""
    }>${i}px</option>`;
  }

  fontSizeSelect.innerHTML = optionsHTML;
  fontSizeSelect.value = data.fontSize;

  boxHeader.appendChild(resetBtn);
  boxHeader.appendChild(checkBtn);
  boxHeader.appendChild(fontSizeSelect);

  // Áp dụng thuộc tính từ JSON
  box.style.textAlign = "center";
  box.style.padding = "20px 0";
  box.style.width = data.width + "px";
  box.style.height = data.height + "px";
  box.style.backgroundColor = data.fill;
  box.style.borderRadius = data.borderRadius + "px";
  box.style.left = data.left + "px";
  box.style.top = data.top + "px";
  box.style.color = data.color;
  box.style.position = "absolute";
  box.style.fontFamily = data.fontName;
  box.style.transform = `rotate(${data.rotate}deg)`;
  box.style.border = data.outline
    ? `${data.outline.width}px ${data.outline.style} ${data.outline.color}`
    : "none";
  box.style.boxShadow = data.shadow
    ? `${data.shadow.h}px ${data.shadow.v}px ${data.shadow.blur}px ${data.shadow.color}`
    : "none";

  if (data.gradient && data.fillType === "gradient") {
    const colors = data.gradient.color.join(",");
    box.style.background = `linear-gradient(${data.gradient.rotate}deg, ${colors})`;
  }

  box.prepend(boxHeader);
  boxContainer.appendChild(box);

  switch (data.excerciseType) {
    case "single":
      createSingle(box, boxContainer, data, index);
      break;

    case "true-false":
      createTrueFalse(box, boxContainer, data, index);
      break;

    case "multiple":
      createMultiple(box, boxContainer, data, index);
      break;

    case "numbering":
      createNumbering(box, boxContainer, data, index);
      break;

    case "sorting":
      createSorting(box, boxContainer, data, index);
      break;

    case "cross-word":
      createCrossWord(box, boxContainer, data, index);
      break;
  }
}
