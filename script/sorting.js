export function createSorting(box, boxContainer, data, index) {
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
      input.dataset.index = index;
      input.value = index + 1;
      input.style.fontSize = "24px";
      input.style.borderRadius = "50%";
      input.style.backgroundColor = data.btnColor;
      input.style.color = data.btnTextColor;
      input.readOnly = true;

      const answerBtn = document.createElement("button");
      answerBtn.className = "btn-answer";
      answerBtn.value = data.data[index].IdAnswerTrue;
      answerBtn.textContent = item.AnswerString;
      answerBtn.style.backgroundColor = data.answerBackground;
      answerBtn.style.color = data.color;
      answerBtn.style.fontSize = fontSizeSelect.value
        ? fontSizeSelect.value
        : data.fontSize;
      answerBtn.style.fontFamily = data.fontName;
      answerBtn.draggable = true;

      // Xử lý sự kiện kéo
      let currentDraggedIndex = null;
      answerBtn.addEventListener("dragstart", (e) => {
        currentDraggedIndex = index;
        e.dataTransfer.setData("text/plain", index);
        e.target.classList.add("dragging");
      });

      answerBtn.addEventListener("dragenter", (e) => {
        e.preventDefault();
        console.log(currentDraggedIndex);
        if (currentDraggedIndex !== null && currentDraggedIndex !== index) {
          swapButtonsTemporarily(answerList, currentDraggedIndex, index);
        }
      });

      answerBtn.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      answerBtn.addEventListener("dragleave", (e) => {
        e.preventDefault();
      });

      answerBtn.addEventListener("drop", (e) => {
        e.preventDefault();
        e.target.classList.remove("drag-over");

        const draggedIndex = e.dataTransfer.getData("text/plain");
        const droppedIndex = index;

        if (draggedIndex !== droppedIndex) {
          swapButtons(answerList, draggedIndex, droppedIndex);
        }
      });

      answerBtn.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
      });

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
      if (btn.value != "" && btn.value != null) {
        const index = btn.previousElementSibling.value;
        if (btn.value == index) {
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
    });
  });

  // Xử lý sự kiện thay đổi font
  fontSizeSelect.addEventListener("change", function () {
    const newSize = this.value;
    if (box) {
      box.querySelectorAll(".btn-answer").forEach((btn) => {
        btn.style.fontSize = newSize;
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

function swapButtonsTemporarily(answerList, draggedIndex, droppedIndex) {
  const draggedItem = answerList.children[draggedIndex];
  const droppedItem = answerList.children[droppedIndex];

  if (!draggedItem || !droppedItem) return; // Kiểm tra nếu phần tử không tồn tại

  const draggedButton = draggedItem.querySelector(".btn-answer");
  const droppedButton = droppedItem.querySelector(".btn-answer");

  if (draggedButton && droppedButton) {
    droppedItem.insertBefore(draggedButton, droppedButton);
  }
}

function swapButtons(answerList, draggedIndex, droppedIndex) {
  const draggedButton =
    answerList.children[draggedIndex].querySelector(".btn-answer");
  const droppedButton =
    answerList.children[droppedIndex].querySelector(".btn-answer");

  if (draggedButton && droppedButton) {
    // Hoán đổi nội dung và màu sắc giữa hai button
    [draggedButton.textContent, droppedButton.textContent] = [
      droppedButton.textContent,
      draggedButton.textContent,
    ];
    [draggedButton.value, droppedButton.value] = [
      droppedButton.value,
      draggedButton.value,
    ];
    [draggedButton.style.backgroundColor, droppedButton.style.backgroundColor] =
      [
        droppedButton.style.backgroundColor,
        draggedButton.style.backgroundColor,
      ];
    [draggedButton.style.color, droppedButton.style.color] = [
      droppedButton.style.color,
      draggedButton.style.color,
    ];
  }
}
