export function createTrueFalse(box, boxContainer, data, index) {
  const questionList = document.createElement("div");
  questionList.className = "question-list";

  data.data.forEach((item, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";

    const questionText = document.createElement("label");
    questionText.className = "question_label";
    questionText.textContent = item.AnswerString;
    questionText.style.fontSize = data.fontSize;
    questionText.style.backgroundColor = data.answerBackground;
    questionText.style.color = data.color;
    questionText.style.fontFamily = data.fontName;

    const trueLabel = document.createElement("label");
    trueLabel.textContent = "Đúng";
    trueLabel.style.fontSize = "20px";
    trueLabel.style.color = "black";

    const trueRadio = document.createElement("input");
    trueRadio.type = "radio";
    trueRadio.name = `answer_${index}`;
    trueRadio.value = "true";

    const falseLabel = document.createElement("label");
    falseLabel.textContent = "Sai";
    falseLabel.style.fontSize = "20px";
    falseLabel.style.color = "black";

    const falseRadio = document.createElement("input");
    falseRadio.type = "radio";
    falseRadio.name = `answer_${index}`;
    falseRadio.value = "false";

    questionDiv.appendChild(questionText);
    questionDiv.appendChild(trueRadio);
    questionDiv.appendChild(trueLabel);
    questionDiv.appendChild(falseRadio);
    questionDiv.appendChild(falseLabel);
    questionList.appendChild(questionDiv);
  });
  box.appendChild(questionList);

  const fontSizeSelect = document.getElementById(`font-size-selector-${index}`);
  fontSizeSelect.addEventListener("change", function () {
    const newSize = this.value;
    document.querySelectorAll(".question_label").forEach((btn) => {
      btn.style.fontSize = newSize;
    });
  });

  const checkBtn = document.getElementById(`check-btn-${index}`);
  checkBtn.addEventListener("click", function () {
    box.querySelectorAll(".question").forEach((questionDiv, index) => {
      const selected = box.querySelector(
        `input[name='answer_${index}']:checked`
      );
      const questionLabel = questionDiv.querySelector(".question_label");
      if (selected) {
        if (
          (selected.value === "true" && data.data[index].IsTrueCorrect) ||
          (selected.value === "false" && !data.data[index].IsTrueCorrect)
        ) {
          questionLabel.style.backgroundColor = "lightgreen";
        } else {
          questionLabel.style.backgroundColor = "lightcoral";
        }
      }
    });
  });

  const resetBtn = document.getElementById(`reset-btn-${index}`);
  resetBtn.addEventListener("click", function () {
    box.querySelectorAll(".question").forEach((questionDiv) => {
      const questionLabel = questionDiv.querySelector(".question_label");
      questionLabel.style.backgroundColor = data.answerBackground;
      questionDiv
        .querySelectorAll("input[type='radio']")
        .forEach((radio) => (radio.checked = false));
    });
  });
}
