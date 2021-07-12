const ratingsEl = document.querySelectorAll(".rating");
const sendBtn = document.querySelector("#send");
const panel = document.querySelector("#panel");

ratingsEl.forEach((el) => {
    el.addEventListener("click", () => {
        ratingsEl.forEach((innerEl) => {
            innerEl.classList.remove("active");
        });

        el.classList.add("active");
    });
});