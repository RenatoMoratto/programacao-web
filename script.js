const $container = document.querySelector("#container");
const $loginBtns = document.querySelectorAll(".login");
const $modal = document.querySelector(".modal");
const $closeButton = document.querySelector(".close-button");
const $form = document.querySelector("#form");
const $content = document.querySelector(".content-wrapper");

let $loginBtn;

let displayWidth = window.screen.width;
if (displayWidth <= 768) {
	$loginBtn = $loginBtns[0]; // Mobile
} else {
	$loginBtn = $loginBtns[1]; // Desktop
}

const getQuotes = async param => {
    let quotes = "";
    let $quotes = document.querySelector(".quotes");

    if ($quotes) {
        $quotes.parentNode.removeChild($quotes);
    }

    try {
        const response = await fetch(`https://programming-quotes-api.herokuapp.com/Quotes${param}`);
        const data = await response.json();

        if (data.length) {
            data.forEach(quote => {
                quotes = `${quotes}<blockquote>${quote.en}<br/><cite>${quote.author}</cite></blockquote>`;
            });
        } else {
            quotes = `<blockquote>${data.en}<br/><cite>${data.author}</cite></blockquote>`;
        }

        $container.insertAdjacentHTML("beforeend", `<main class="quotes">${quotes}</main>`);
    } catch (error) {
        alert(error.message);
    }
};

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

// Login
const login = token => {
	localStorage.setItem("token", token);
	$loginBtn.innerHTML = "Logout";
	$loginBtn.removeEventListener("click", () => showModal(true));
	$loginBtn.addEventListener("click", logout);
	showModal(false);
    $container.removeChild($content);
    getQuotes("?count=3");
};

const logout = () => {
	localStorage.removeItem("token");
	location.reload();
};

const submitHandler = async event => {
	event.preventDefault();

	const email = event.target.email.value;
	const password = event.target.senha.value;

	const isEmailInvalid = email.trim() === 0 || email.length < 3;
	const isPasswordInvalid = password.trim() === 0 || password.length < 3;

	if (isEmailInvalid || isPasswordInvalid) {
		let message = isEmailInvalid
			? "Insert a valid email address"
			: "The password must be at least 3 characters long";
		if (isEmailInvalid && isPasswordInvalid) {
			message = "Both email and password are invalid.\nInsert a valid email address and password.";
		}
		alert(message);
		return;
	}

	try {
		const response = await fetch("https://reqres.in/api/login", {
			method: "POST",
			headers: new Headers({ "Content-Type": "application/json" }),
			body: JSON.stringify({
				email,
				password,
			}),
		});
		const data = await response.json();

		if (response.status === 200) {
			login(data.token);
		} else {
			throw new Error(data.error);
		}
	} catch (error) {
		alert(error.message);
	}
};

$form.addEventListener("submit", submitHandler);
