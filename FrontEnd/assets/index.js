// fetch works from backend
async function fetchWorks() {
    let data = window.sessionStorage.getItem("works");
    if (data === null || data === "null") {
        try {
            const apiAddress = "http://localhost:5678/api";
            const response = await fetch(apiAddress + "/works");
            if (response.ok) {
                data = await response.json();
                const worksStringified = JSON.stringify(data);
                window.sessionStorage.setItem("works", worksStringified);
            } else {
                alert("La requête API n'a pas pu aboutir.");
                throw new Error("La requête API n'a pas pu aboutir.");
            };
        } catch (error) {
            console.error("Une erreur est survenue: ", error.message);
        };
    };
    displaySelectedCards(0);
};

// Display the sorting bar
function sortingBar() {
    const parentElement = document.getElementById("portfolio");
    const h2 = parentElement.getElementsByTagName("h2");
    const previousTag = h2[0];
    const sortingBar = document.createElement("div");
    sortingBar.className = "sortingBar";
    sortingBar.innerHTML = `
                            <button class="button">Tous</button>
                            <button class="button">Objets</button>
                            <button class="button">Appartements</button>
                            <button class="button">Hôtels & restaurants</button>
                        `;
    parentElement.insertBefore(sortingBar, previousTag.nextSibling);
};

// Set the selected sorting button on page load and upon click.
function sortingButtonSelector() {
    const sortingBar = document.querySelector(".sortingBar");
    const buttonsList = sortingBar.querySelectorAll("button");
    buttonsList[0].classList.add("buttonSelected");
    let j = 0;
    buttonsList.forEach(el => {
        el.id = j;
        j = j+1
        el.addEventListener("click", () => {
            buttonsList.forEach(e => e.classList.remove("buttonSelected"));
            el.classList.add("buttonSelected")
            displaySelectedCards(el.id);
        });
    });
};

// Retrieve data from session storage and create 'card' elements.
function displaySelectedCards(j) {
    const data = JSON.parse(window.sessionStorage.getItem("works"));
    const divGallery = document.querySelector(".gallery");
    let filteredCards = [];
    for (let i = 0; i < data.length; i++) {
        if (j == 0 || data[i].categoryId == j) {
            filteredCards += `
                                <figure>
                                    <img src="${data[i].imageUrl}" alt="${data[i].title}">
                                    <figcaption>${data[i].title}</figcaption>
                                </figure>
                             `;
        };
    };
    divGallery.innerHTML = filteredCards;
};

// Create the content for the login section.
function createLoginPage() {
    const parentElement = document.querySelector("body");
    const footerTag = document.querySelector("footer");
    const loginPage = document.createElement("section");
    loginPage.className = "loginPage";
    loginPage.innerHTML = `
        <h2>Log In</h2>
        <form class="loginForm">
            <p>E-mail</p>
            <input type="" id=""required>
            <p>Mot de passe</p>
            <input type="" id=""required>
            <button type="submit">Se connecter</button>
        </form>
        <button>Mot de passe oublié</button>
        <button class="backToMainPage">Retour à la page d'acceuil</button>
    `
    parentElement.insertBefore(loginPage, footerTag);
};

// Display main or section tag and hides the other tag.
function pageLayout() {
    const login = document.querySelector("header li:nth-of-type(3)");
    const mainTag = document.querySelector("main");
    const loginPage = document.querySelector(".loginPage");
    const backToMainPage = document.querySelector(".backToMainPage");
    backToMainPage.addEventListener("click", () => {
        loginPage.style.display = "none";
        mainTag.style.display = "block";
    });
    login.addEventListener("click", () => {
        mainTag.style.display = "none";
        loginPage.style.display = "flex";
    });
};

function mainFunction() {
    fetchWorks();
    sortingBar();
    sortingButtonSelector();
    createLoginPage();
    pageLayout();
};

mainFunction();