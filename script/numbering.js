export function createNumbering(box, boxContainer, data, index) {
  const fontSizeSelect = document.getElementById(`font-size-selector-${index}`);
  const answerList = document.createElement("div");
  answerList.className = "answer-list";

  renderAnswer();
  function renderAnswer() {
    answerList.innerHTML = "";
    shuffleArray(data.data);
    data.data.forEach((item, index) => {
      const answerItem = document.createElement("div");
      answerItem.className = "answer-item";

      const input = document.createElement("input");
      input.type = "number";
      input.className = "answer";
      input.style.fontSize = data.fontSize;

      const answerBtn = document.createElement("button");
      answerBtn.className = "btn-answer";
      answerBtn.textContent = item.AnswerString;
      answerBtn.style.backgroundColor = data.answerBackground;
      answerBtn.style.color = data.color;
      answerBtn.style.fontSize = fontSizeSelect.value
        ? fontSizeSelect.value
        : data.fontSize;
      answerBtn.style.fontFamily = data.fontName;

      answerItem.appendChild(input);
      answerItem.appendChild(answerBtn);
      answerList.appendChild(answerItem);
    });

    box.appendChild(answerList);
  }

  // Xử lý sự kiện Check
  const checkBtn = document.getElementById(`check-btn-${index}`);
  checkBtn.addEventListener("click", function () {
    box.querySelectorAll(".btn-answer").forEach((btn, i) => {
      btn.style.backgroundColor = data.answerBackground; // Reset màu
    });
    box.querySelectorAll(".btn-answer").forEach((btn, i) => {
      const index = btn.previousElementSibling.value;
      if (index != "" && index != null) {
        if (data.data[i].IdAnswerTrue == index) {
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
    renderAnswer();
    box.querySelectorAll(".btn-answer").forEach((btn, i) => {
      btn.style.backgroundColor = data.answerBackground;
      btn.previousElementSibling.value = "";
    });
  });

  // Xử lý sự kiện thay đổi font
  fontSizeSelect.addEventListener("change", function () {
    const newSize = this.value;
    if (box) {
      box.querySelectorAll(".btn-answer").forEach((btn) => {
        btn.style.fontSize = newSize;
      });
      box.querySelectorAll(".answer").forEach((input) => {
        input.style.fontSize = newSize;
      });
    }
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
