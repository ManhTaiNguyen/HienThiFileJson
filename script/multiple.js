export function createMultiple(box, boxContainer, data, index) {
  const answerList = document.createElement("div");
  answerList.className = "answer-list";

  data.data.forEach((item, index) => {
    const answerItem = document.createElement("div");
    answerItem.className = "answer-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "answer";
    checkbox.dataset.index = index;

    const answerBtn = document.createElement("button");
    answerBtn.className = "btn-answer";
    answerBtn.textContent = item.AnswerString;
    answerBtn.style.backgroundColor = data.answerBackground;
    answerBtn.style.color = data.color;
    answerBtn.style.fontSize = data.fontSize;
    answerBtn.style.fontFamily = data.fontName;

    answerItem.onclick = function () {
      checkbox.checked = true;
    };

    answerItem.appendChild(checkbox);
    answerItem.appendChild(answerBtn);
    answerList.appendChild(answerItem);
  });

  box.appendChild(answerList);

  // Xử lý sự kiện Check
  const checkBtn = document.getElementById(`check-btn-${index}`);
  checkBtn.addEventListener("click", function () {
    const box = document.getElementById(`box-${index}`);
    box.querySelectorAll(".btn-answer").forEach((btn, i) => {
      btn.style.backgroundColor = data.answerBackground; // Reset màu
    });
    box.querySelectorAll(".btn-answer").forEach((btn, i) => {
      const radio = btn.previousElementSibling;
      if (radio.checked) {
        if (data.data[i].IsChecked) {
          btn.style.backgroundColor = "lightgreen"; // Đúng
        } else {
          btn.style.backgroundColor = "lightcoral"; // Sai
        }
      }
    });
  });

  // Xử lý sự kiện Reset
  const resetBtn = document.getElementById(`reset-btn-${index}`);
  resetBtn.addEventListener("click", function () {
    const box = document.getElementById(`box-${index}`);
    box.querySelectorAll(".btn-answer").forEach((btn, i) => {
      btn.style.backgroundColor = data.answerBackground;
      btn.previousElementSibling.checked = false;
    });
  });

  // Xử lý sự kiện thay đổi font
  const fontSizeSelect = document.getElementById(`font-size-selector-${index}`);
  fontSizeSelect.addEventListener("change", function () {
    const newSize = this.value;
    const box = document.getElementById(`box-${index}`);
    if (box) {
      box.querySelectorAll(".btn-answer").forEach((btn) => {
        btn.style.fontSize = newSize;
      });
    }
  });
}
