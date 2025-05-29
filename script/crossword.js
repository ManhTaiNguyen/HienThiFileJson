export function createCrossWord(box, boxContainer, data, index) {
  const answerList = document.createElement("div");
  answerList.className = "answer-list";

  data.data.forEach((item, index) => {
    const answerItem = document.createElement("div");
    answerItem.className = "answer-item";

    const question = document.createElement("button");
    question.className = "question-btn";
    question.id = `question-btn-${index}`;
    question.innerHTML = '<i class="fa-regular fa-circle-question"></i>';
    question.style.fontSize = "16px";
    question.style.width = "36px";
    question.style.height = "36px";
    question.style.backgroundColor = data.btnColor;
    question.style.color = data.btnTextColor;

    const answer = document.createElement("button");
    answer.className = "answer-btn";
    answer.id = `answer-btn-${index}`;
    answer.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
    answer.style.fontSize = "16px";
    answer.style.width = "36px";
    answer.style.height = "36px";
    answer.style.backgroundColor = data.btnColor;
    answer.style.color = data.btnTextColor;
    answer.style.marginRight = "20px";

    answerItem.appendChild(question);
    answerItem.appendChild(answer);

    data.data[index].RowCells.forEach((itm, i) => {
      const cell = document.createElement("input");
      cell.className = "cell";
      cell.style.fontSize = data.fontSize;
      cell.style.backgroundColor = data.answerBackground;
      cell.style.color = data.color;
      cell.style.fontFamily = data.fontName;

      if (data.data[index].RowCells[i].Value == "") {
        cell.style.backgroundColor = "transparent";
        cell.style.border = "1px solid transparent";
      }

      answerItem.appendChild(cell);
    });

    answerList.appendChild(answerItem);
  });

  box.appendChild(answerList);

  // Xử lý gọi modal
  answerList.querySelectorAll(".question-btn").forEach((btn, index) => {
    btn.addEventListener("click", function () {
      const questionTitle = `Câu hỏi ${index + 1}`;
      const questionContent = data.data[index].Question;
      createModal();
      showModal(questionTitle, questionContent);
    });
  });

  // Xử lý answer
  answerList.querySelectorAll(".answer-btn").forEach((btn, index) => {
    btn.addEventListener("click", function () {
      const answerItem = this.closest(".answer-item"); // Lấy dòng cha chứa nút
      answerItem.querySelectorAll(".cell").forEach((cell, i) => {
        cell.value = data.data[index].RowCells[i].Value; // Gán giá trị đúng dòng
        if (cell.value !== "") {
          cell.style.backgroundColor = data.answerBackground;
          cell.style.border = "1px solid #000000";
        }
      });
    });
  });

  // Xử lý sự kiện Check
  const checkBtn = document.getElementById(`check-btn-${index}`);
  checkBtn.addEventListener("click", function () {
    answerList.querySelectorAll(".answer-item").forEach((answer, index) => {
      answer.querySelectorAll(".cell").forEach((cell, i) => {
        cell.value = data.data[index].RowCells[i].Value;
        if (cell.value != "") {
          cell.style.backgroundColor = data.answerBackground;
          cell.style.border = "1px solid #000000";
        }
      });
    });
  });

  // Xử lý sự kiện Reset
  const resetBtn = document.getElementById(`reset-btn-${index}`);
  resetBtn.addEventListener("click", function () {
    answerList.querySelectorAll(".cell").forEach((cell, i) => {
      cell.value = "";
    });
  });

  // Xử lý sự kiện thay đổi font
  const fontSizeSelect = document.getElementById(`font-size-selector-${index}`);
  fontSizeSelect.addEventListener("change", function () {
    const newSize = this.value;
    box.querySelectorAll(".cell").forEach((cell) => {
      cell.style.fontSize = newSize;
    });
  });

  // Tạo Modal bằng JavaScript
  function createModal() {
    const mask = document.createElement("div");
    mask.className = "mask";
    document.body.appendChild(mask);

    const modal = document.createElement("div");
    modal.id = "questionModal";
    modal.className = "modal";
    modal.style.display = "none"; // Ẩn mặc định
    modal.innerHTML = `
    <div class="modal-content">
      <h3 id="questionTitle" style="color: red; text-align: left;"></h3>
      <p id="questionContent"></p>
      <div class="btn-wrap">
        <button id="closeModalBtn" class="close-btn">Đóng</button>
      </div>
    </div>
  `;

    document.body.appendChild(modal);
  }

  // Hàm hiển thị modal với nội dung động
  function showModal(title, content) {
    const modal = document.getElementById("questionModal");
    const mask = document.querySelector(".mask");
    document.getElementById("questionTitle").innerText = title;
    document.getElementById("questionContent").innerText = content;
    mask.style.display = "block";
    modal.style.display = "block";

    // Sự kiện đóng modal
    document.getElementById("closeModalBtn").onclick = function () {
      modal.style.display = "none";
      mask.style.display = "none";
    };

    // Đóng khi nhấn ra ngoài
    window.onclick = function (event) {
      if (event.target === mask) {
        modal.style.display = "none";
        mask.style.display = "none";
      }
    };
  }
}
