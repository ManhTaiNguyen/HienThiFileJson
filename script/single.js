export function createSingle(box, boxContainer, data, index) {
  const answerList = document.createElement("div");
  answerList.className = "answer-list";
  const radioGroupName = `answer-group-${index}`;

  data.data.forEach((item, index) => {
    const answerItem = document.createElement("div");
    answerItem.className = "answer-item";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.className = "answer";
    radio.name = radioGroupName;

    const answerBtn = document.createElement("button");
    answerBtn.className = "btn-answer";
    answerBtn.textContent = item.AnswerString;
    answerBtn.style.backgroundColor = data.answerBackground;
    answerBtn.style.color = data.color;
    answerBtn.style.fontSize = data.fontSize;
    answerBtn.style.fontFamily = data.fontName;

    answerItem.onclick = function () {
      radio.checked = true;
    };

    answerItem.appendChild(radio);
    answerItem.appendChild(answerBtn);
    answerList.appendChild(answerItem);
  });

  box.appendChild(answerList);

  // Xử lý sự kiện Check
  const checkBtn = document.getElementById(`check-btn-${index}`);
  checkBtn.addEventListener("click", function () {
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
    box.querySelectorAll(".btn-answer").forEach((btn, i) => {
      btn.style.backgroundColor = data.answerBackground;
      btn.previousElementSibling.checked = false;
    });
  });

  // Xử lý sự kiện thay đổi font
  const fontSizeSelect = document.getElementById(`font-size-selector-${index}`);
  fontSizeSelect.addEventListener("change", function () {
    const newSize = this.value;
    box.querySelectorAll(".btn-answer").forEach((btn) => {
      btn.style.fontSize = newSize;
    });
  });
}
