const $container = document.querySelector("#container");
const $loginBtns = document.querySelectorAll(".login");
const $modal = document.querySelector(".modal");
const $closeButton = document.querySelector(".close-button");

let $loginBtn;

let displayWidth = window.screen.width;
if (displayWidth <= 768) {
	$loginBtn = $loginBtns[0]; // Mobile
} else {
	$loginBtn = $loginBtns[1]; // Desktop
}

// Modal
const showModal = show => {
	if (show == true) {
		$modal.classList.add("active");
	} else {
		$modal.classList.remove("active");
	}
};

$closeButton.addEventListener("click", () => showModal(false));

window.addEventListener("click", event => {
	if (event.target == $modal) {
		$modal.classList.toggle("bump");
	}
});

$loginBtn.addEventListener("click", () => showModal(true));