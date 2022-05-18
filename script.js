const $container = document.querySelector("#container");
const $loginBtns = document.querySelectorAll(".login");
const $modal = document.querySelector(".modal");
const $closeButton = document.querySelector(".close-button");
const $form = document.querySelector("#form");
const $content = document.querySelector(".content-wrapper");
const $passwordMessage = document.querySelector("#senha-message");
const $emailMessage = document.querySelector("#email-message");

let $loginBtn;

let displayWidth = window.screen.width;
if (displayWidth <= 768) {
	$loginBtn = $loginBtns[0]; // Mobile
} else {
	$loginBtn = $loginBtns[1]; // Desktop
}

const searchBar = () => {
	return `<form class="search-bar">
                <div>
                    <label for="totQuotes">Total of quotes:</label>
                    <input id="totQuotes" type="number" value="3" min="1" max="500" />
                </div>
                <div>
                <button id="randomQuote" class="btn">Random quote</button>
                    <button class="btn" type="submit">Search</button>
                </div>
            </form>
        `;
};

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

// Login
const login = token => {
	localStorage.setItem("token", token);
	$loginBtn.innerHTML = "Logout";
	$loginBtn.removeEventListener("click", () => showModal(true));
	$loginBtn.addEventListener("click", logout);
	showModal(false);
	$container.removeChild($content);
	$container.insertAdjacentHTML("afterbegin", searchBar());

	const $searchBar = document.querySelector(".search-bar");
	const $randomQuote = document.querySelector("#randomQuote");

	$randomQuote.addEventListener("click", event => {
		event.preventDefault();
		getQuotes("/random");
	});

	$searchBar.addEventListener("submit", event => {
		event.preventDefault();
		const totQuotes = event.target.totQuotes.value;
		getQuotes(`?count=${totQuotes}`);
	});

	getQuotes("?count=3");
};

const logout = () => {
	localStorage.removeItem("token");
	location.reload();
};

const submitHandler = async event => {
	event.preventDefault();

	const email = event.target.email;
	const password = event.target.senha;

	$passwordMessage.classList.add("hide");
	$emailMessage.classList.add("hide");
	email.classList.remove("invalid");
	password.classList.remove("invalid");

	const isEmailInvalid = email.value.trim() === 0 || email.value.length < 3;
	const isPasswordInvalid = password.value.trim() === 0 || password.value.length < 3;

	if (isEmailInvalid) {
		$emailMessage.classList.remove("hide");
		email.classList.add("invalid");
	}
	if (isPasswordInvalid) {
		$passwordMessage.classList.remove("hide");
		password.classList.add("invalid");
	}
	if (isEmailInvalid || isPasswordInvalid) return;

	try {
		const response = await fetch("https://reqres.in/api/login", {
			method: "POST",
			headers: new Headers({ "Content-Type": "application/json" }),
			body: JSON.stringify({
				email: email.value,
				password: password.value,
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

// Session
const token = localStorage.getItem("token");

if (token) {
	login(token);
} else {
	$loginBtn.addEventListener("click", () => showModal(true));
}
