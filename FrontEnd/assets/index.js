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

function loginEventListener() {
    const login = document.querySelector("header li:nth-of-type(3)");
    login.addEventListener("click", () => displayLoginPage());
};

function displayLoginPage() {
    const mainTag = document.querySelector("main");
    const parentElement = document.querySelector("body");
    const footerTag = document.querySelector("footer");
    const loginPage = createLoginPage();
    mainTag.style.display = "none";
    parentElement.insertBefore(loginPage, footerTag);
};

function createLoginPage() {
    const loginPage = document.createElement("div");
    return loginPage;
};

function mainFunction() {
    fetchWorks();
    sortingBar();
    sortingButtonSelector();
    loginEventListener();
};

mainFunction();