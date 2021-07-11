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

// sendBtn.addEventListener("click", () => {
//     panel.innerHTML = `
// 		<i class="fas fa-heart"></i>
// 		<strong>Thank you!</strong>
// 		<p>We'll use your feedback to improve our application service.</p>
// 		<a href="http://localhost:3030/exit"><button class="btn">Done</button></a>
// 	`;
// });