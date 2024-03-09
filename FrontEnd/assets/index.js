// Fetch works from backend
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
    displaySelectedCards(0, ".gallery");
};

function editingModeBanner() {
    const body = document.querySelector("body");
    body.insertAdjacentHTML("beforebegin", `
        <div class="editingModeBanner">
            <p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>
        </div>`
    );
};

// Creates a logout button.
function logoutButton() {
    const logoutButton = document.createElement("li");
    logoutButton.className = "logoutButton";
    logoutButton.innerHTML = "logout";
    logoutButton.addEventListener("click", () => {
        logout();
    });
    return logoutButton;
};

// Creates the edit projects button.
function editProjectsButton() {
    const mesProjets = document.querySelector("#portfolio h2");
    mesProjets.insertAdjacentHTML("afterend", '<p class="editProjectsButton"><i class="fa-regular fa-pen-to-square"></i>modifier</p>');
    const editProjectsButton = document.querySelector(".editProjectsButton");
    editProjectsButton.addEventListener("click", () => {
        const projectsModalBackground = document.querySelector(".projectsModalBackground");
        projectsModalBackground.style.display = "flex"
    })
};

// Creates and display the sorting bar
function sortingBar() {
    const parentElement = document.getElementById("portfolio");
    const gallery = document.querySelector(".gallery");
    const sortingBar = document.createElement("div");
    sortingBar.className = "sortingBar";
    sortingBar.innerHTML = `
                            <button class="button">Tous</button>
                            <button class="button">Objets</button>
                            <button class="button">Appartements</button>
                            <button class="button">Hôtels & restaurants</button>
                        `;
    parentElement.insertBefore(sortingBar, gallery);
};

// Define the selected sorting button on page load and upon click.
function sortingButtonSelector() {
    const sortingBar = document.querySelector(".sortingBar");
    const buttonsList = sortingBar.querySelectorAll("button");
    buttonsList[0].classList.add("buttonSelected");
    let buttonCategoryId = 0;
    buttonsList.forEach(el => {
        el.id = buttonCategoryId;
        buttonCategoryId += 1
        el.addEventListener("click", () => {
            buttonsList.forEach(e => e.classList.remove("buttonSelected"));
            el.classList.add("buttonSelected");
            displaySelectedCards(el.id, ".gallery");
        });
    });
};

// Retrieve data from session storage and create 'card' elements.
function displaySelectedCards(buttonCategoryId, target) {
    const data = JSON.parse(window.sessionStorage.getItem("works"));
    const targetSelector = document.querySelector(`${target}`);

    targetSelector.innerHTML = data
        .filter(card => buttonCategoryId == 0 || card.categoryId == buttonCategoryId)
        .map(card => `
            <figure>
                <img src="${card.imageUrl}" alt="${card.title}">
                <figcaption>${card.title}</figcaption>
            </figure>
        `)
        .join("");
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
            <input type="text" id="emailInput" autofocus required>
            <p>Mot de passe</p>
            <input type="password" id="passwordInput" required>
            <button type="submit" class="button buttonSelected">Se connecter</button>
        </form>
        <a href="#">Mot de passe oublié</a>
        <button class="backToMainPage button buttonSelected">Retour à la page d'acceuil</button>
    `;
    parentElement.insertBefore(loginPage, footerTag);
};

// Display main or section tag and hides the other tag.
function pageLayout() {
    const loginButton = document.querySelector("header li:nth-of-type(3)");
    loginButton.className = "loginButton"
    loginButton.insertAdjacentElement("afterend", logoutButton());
    loginButton.addEventListener("click", () => {
        displaySectionTag();
    });
    const backToMainPage = document.querySelector(".backToMainPage");
    backToMainPage.addEventListener("click", () => {
        clearInputsEntries();
        displayMainTag();
    });
};

// Display main tag and hides section tag.
function displayMainTag() {
    const loginPage = document.querySelector(".loginPage");
    const loginButton = document.querySelector(".loginButton");
    const mainTag = document.querySelector("main");
    loginPage.style.display = "none";
    loginButton.style.fontWeight = "400";
    mainTag.style.display = "block";
};

// Display section tag and hides main tag.
function displaySectionTag() {
    const mainTag = document.querySelector("main");
    const loginButton = document.querySelector(".loginButton");
    const loginPage = document.querySelector(".loginPage");
    mainTag.style.display = "none";
    loginButton.style.fontWeight = "600";
    loginPage.style.display = "flex";
};

// Information entered by the user in the login form.
let userEmailInput = "";
let userPasswordInput = "";

// Listen for inputs and update the corresponding variables.
function loginEventListener() {
    const emailInput = document.getElementById("emailInput");
    emailInput.addEventListener("change", (e) => {
        userEmailInput = e.target.value;
    });
    const passwordInput = document.getElementById("passwordInput");
    passwordInput.addEventListener("change", (e) => {
        userPasswordInput = e.target.value;
    });
};

// Form submission management.
function formSubmission() {
    const loginForm = document.querySelector(".loginForm");
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let userInformations = {
            "email": userEmailInput,
            "password": userPasswordInput
        };
        userInformations = JSON.stringify(userInformations);
        connectionAttempt(userInformations);
    });
};

// Sending the connection request upon form submission.
async function connectionAttempt(userInformations) {
    const apiAddress = "http://localhost:5678/api/users/login";
    try {
        const response = await fetch(apiAddress, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: userInformations
        });
        const responseStatus = response.status;
        switch (responseStatus) {
            case 200:
                const responseData = await response.json();
                const loginToken = JSON.stringify(responseData);
                window.sessionStorage.setItem("loginToken", loginToken);
                displayConnectedState();
                break
            case 401:
                alert("Echec de la requète.");
                break
            case 404:
                alert("Nom utilisateur ou mot de passe incorrect.");
                break
            default:
                alert(`Réponse serveur non valide: ${response.statusText}.`);
        }
    } catch (error) {
        alert(`Une erreur est survenue: ${error.message}.`);
        return false;
    };
};

function displayConnectedState() {
    displayMainTag();
    const editingModeBanner = document.querySelector(".editingModeBanner");
    editingModeBanner.style.display = "flex"
    loginToLogout();
    const sortingBar = document.querySelector(".sortingBar");
    sortingBar.style.display = "none";
    const editProjectsButton = document.querySelector(".editProjectsButton");
    editProjectsButton.style.display = "block"
};

// Switch from "login" to "logout"
function loginToLogout() {
    const loginButton = document.querySelector(".loginButton")
    loginButton.style.display = "none";
    const logoutButton = document.querySelector(".logoutButton")
    logoutButton.style.display = "inline";
};

function logout() {
    window.sessionStorage.removeItem("loginToken");
    const editingModeBanner = document.querySelector(".editingModeBanner");
    editingModeBanner.style.display = "none";
    logoutToLogin();
    const sortingBar = document.querySelector(".sortingBar");
    sortingBar.style.display = "flex";
    const editProjectsButton = document.querySelector(".editProjectsButton");
    editProjectsButton.style.display = "none";
    clearInputsEntries();
};

// Switch from "login" to "logout"
function logoutToLogin() {
    const logoutButton = document.querySelector(".logoutButton")
    logoutButton.style.display = "none";
    const loginButton = document.querySelector(".loginButton")
    loginButton.style.display = "inline";
};

// Clear the login form inputs.
function clearInputsEntries() {
    const inputEntries = document.querySelectorAll(".loginForm input");
    inputEntries.forEach( el => {
        el.value = "";
    });
};

// Creates the project editing modal window.
function createProjectsModal() {
    const body = document.querySelector("body");
    body.insertAdjacentHTML("afterbegin", `
        <section class="projectsModalBackground">
            <div class="projectsModal">

            </div>
        </section>
    `);
    const projectsModalBackground = document.querySelector(".projectsModalBackground");
    projectsModalBackground.addEventListener("click", () => {
        closeProjectsModal();
    });
    const projectsModal = document.querySelector(".projectsModal");
    projectsModal.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    displaySelectedCards(0, ".projectsModal");
};

// Hide editing projects modal.
function closeProjectsModal() {
    const projectsModalBackground = document.querySelector(".projectsModalBackground");
    projectsModalBackground.style.display = "none";
};

function mainFunction() {
    fetchWorks();
    editingModeBanner();
    editProjectsButton();
    sortingBar();
    sortingButtonSelector();
    createLoginPage();
    pageLayout();
    loginEventListener();
    formSubmission();
    createProjectsModal();
};

mainFunction();
