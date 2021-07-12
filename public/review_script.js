const ratingsEl = document.querySelectorAll(".rating");
const sendBtn = document.querySelector("#send");
const panel = document.querySelector("#panel");
const text = document.getElementsByTagName("textarea");

ratingsEl.forEach((el) => {
    el.addEventListener("click", () => {
        ratingsEl.forEach((innerEl) => {
            innerEl.classList.remove("active");
        });

        el.classList.add("active");
        text[0].innerHTML = el.getElementsByTagName("small")[0].innerHTML + ":";
        // el.getElementsByTagName("small")[0].innerText
    });
});