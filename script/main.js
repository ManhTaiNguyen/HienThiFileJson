import { createExerciseBox } from "./createBox.js";
import { drawLine } from "./line.js";
import { drawShape } from "./shape.js";
import { createTextElement } from "./text.js";

let jsonData = [];
let currentSlideIndex = 0;
let boxCount = 0;

document
  .getElementById("json-upload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        jsonData = JSON.parse(e.target.result);
        currentSlideIndex = 0;
        renderSlide(jsonData[currentSlideIndex]);
        updateButtons();
      } catch (error) {
        alert("Tệp JSON không hợp lệ!");
      }
    };
    reader.readAsText(file);
  });

document.getElementById("prev-slide").addEventListener("click", function () {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    renderSlide(jsonData[currentSlideIndex]);
    updateButtons();
  }
});

document.getElementById("next-slide").addEventListener("click", function () {
  if (currentSlideIndex < jsonData.length - 1) {
    currentSlideIndex++;
    renderSlide(jsonData[currentSlideIndex]);
    updateButtons();
  }
});

function updateButtons() {
  document.getElementById("prev-slide").disabled = currentSlideIndex === 0;
  document.getElementById("next-slide").disabled =
    currentSlideIndex === jsonData.length - 1;
}

function renderSlide(slide) {
  const container = document.getElementById("slide-container");
  container.innerHTML = "";

  if (slide.background) {
      container.style.backgroundColor = slide.background.color || '#ffffff';
      if (slide.background.image) {
          container.style.backgroundImage = `url(${slide.background.image})`;
          container.style.backgroundSize = 'cover';
          container.style.backgroundPosition = 'center';
      }
  }

  let boxContainer = document.getElementById("box_container");
  if (!boxContainer) {
    boxContainer = document.createElement("div");
    boxContainer.id = "box_container";
    container.appendChild(boxContainer);
  } else {
    boxContainer.innerHTML = "";
  }

  slide.elements.forEach((element) => {
    const div = document.createElement("div");
    div.classList.add("element");
    div.style.left = `${element.left}px`;
    div.style.top = `${element.top}px`;

    if (element.type === "text") {
    createTextElement(element, container);
    } else if (element.type === "line") {
      drawLine(element, container);
    } else if (element.type === "shape") {
      drawShape(element, container);
    } else if (element.type === "exercise") {
      createExerciseBox(element, boxCount);
      boxCount++;
    }

    container.appendChild(div);
  });
}

let fullscreen_btn = document.getElementById("fullscreen");
let fullscreen_out_btn = document.getElementById("fullscreen-out");

document.addEventListener("keydown", function (event) {
  if (event.key === "F11") {
    event.preventDefault();
    const slide = document.getElementById("slide-container");

    slide.style.position = "fixed";
    slide.style.top = "50%";
    slide.style.left = "50%";
    let scale = window.innerWidth / 1000;
    fullscreen_btn.classList.toggle("hidden");
    fullscreen_out_btn.classList.remove("hidden");
    slide.style.transform = `translate(-50%, -50%) scale(${scale})`;
    slide.style.transformOrigin = "center center";
    document.getElementById("json-upload").classList.toggle("hidden");
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(`Lỗi khi vào fullscreen: ${err.message}`);
    });
  }
});

fullscreen_btn.addEventListener("click", function () {
  const slide = document.getElementById("slide-container");
  slide.style.position = "fixed";
  slide.style.top = "50%";
  slide.style.left = "50%";
  let scale = window.innerWidth / 1000;
  fullscreen_btn.classList.toggle("hidden");
  fullscreen_out_btn.classList.remove("hidden");
  slide.style.transform = `translate(-50%, -50%) scale(${scale})`;
  slide.style.transformOrigin = "center center";
  document.getElementById("json-upload").classList.toggle("hidden");

  document.documentElement.requestFullscreen().catch((err) => {
    console.error(`Lỗi khi vào fullscreen: ${err.message}`);
  });
});

document.addEventListener("fullscreenchange", function () {
  const slide = document.getElementById("slide-container");

  if (!document.fullscreenElement) {
    fullscreen_btn.classList.remove("hidden");
    fullscreen_out_btn.classList.toggle("hidden");
    document.getElementById("json-upload").classList.remove("hidden");
    slide.setAttribute("style", slide.dataset.originalStyle);
  }
});

fullscreen_out_btn.addEventListener("click", function () {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch((err) => {
      console.log("Error exiting fullscreen: ", err);
    });
  }
});
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowRight") {
    document.getElementById("next-slide").click();
  }
  if (event.key === "ArrowLeft") {
    document.getElementById("prev-slide").click();
  }
});
