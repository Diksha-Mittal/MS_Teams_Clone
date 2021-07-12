const ratingsEl = document.querySelectorAll(".rating");
const text = document.getElementsByTagName("textarea");

// reaction selection
ratingsEl.forEach((el) => {
    el.addEventListener("click", () => {
        ratingsEl.forEach((innerEl) => {
            innerEl.classList.remove("active");
        });

        el.classList.add("active");
        text[0].innerHTML = el.getElementsByTagName("small")[0].innerHTML + ": ";
    });
});