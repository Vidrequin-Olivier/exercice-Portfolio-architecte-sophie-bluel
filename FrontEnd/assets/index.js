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

// Creates a header banner in edit mode.
function editingModeBanner() {
    document.querySelector("body").insertAdjacentHTML("beforebegin", `
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

// Create a "portfolioHeader" container and move the "h2" inside it.
function moveH2ToPortfolioHeader() {
    const portfolio = document.querySelector("#portfolio");
    const h2 = portfolio.querySelector("h2");

    // Créer et insérer le conteneur "portfolioHeader" avant le "h2"
    const portfolioHeader = document.createElement("div");
    portfolioHeader.classList.add("portfolioHeader");
    portfolio.insertBefore(portfolioHeader, h2);

    // Déplacer le "h2" à l'intérieur du conteneur "portfolioHeader"
    portfolioHeader.appendChild(h2);
};

// Creates the edit projects button.
function editProjectsButton() {
    const mesProjets = document.querySelector("#portfolio h2");
    mesProjets.insertAdjacentHTML("afterend", '<p class="editProjectsButton"><i class="fa-regular fa-pen-to-square"></i>modifier</p>');
    const editProjectsButton = document.querySelector(".editProjectsButton");
    editProjectsButton.addEventListener("click", () => {
        const projectsModalBackground = document.querySelector(".projectsModalBackground");
        projectsModalBackground.style.display = "flex";
    })
};

// Creates and display the sorting bar
function sortingBar() {
    document.querySelector(".portfolioHeader").insertAdjacentHTML("afterend", `
        <div class="sortingBar">
            <button class="button" id="0">Tous</button>
        </div>
    `);
    const sortingBar = document.querySelector(".sortingBar");
    const categories = retrieveCategories();
    categories.forEach( el => sortingBar.innerHTML += `<button class="button" id="${el.id}">${el.name}</button>`);
};

// Retrieves the different categories from the backend.
function retrieveCategories() {
    const works = JSON.parse(window.sessionStorage.getItem("works")) ;
    const categoryMap = new Map();
    works.forEach(work => {
        categoryMap.set(work.category.id, work.category);
    });
    const uniqueCategories = Array.from(categoryMap.values());
    return uniqueCategories;
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

// Changes the display when in edit mode.
function displayConnectedState() {
    displayMainTag();
    const editingModeBanner = document.querySelector(".editingModeBanner");
    editingModeBanner.style.display = "flex"
    loginToLogout();
    const sortingBar = document.querySelector(".sortingBar");
    sortingBar.style.display = "none";
    const editProjectsButton = document.querySelector(".editProjectsButton");
    editProjectsButton.style.display = "block";
};

// Switch from "login" to "logout"
function loginToLogout() {
    const loginButton = document.querySelector(".loginButton");
    loginButton.style.display = "none";
    const logoutButton = document.querySelector(".logoutButton");
    logoutButton.style.display = "inline";
};

// Logs out the user, deletes login information and displays the home page.
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
    const logoutButton = document.querySelector(".logoutButton");
    logoutButton.style.display = "none";
    const loginButton = document.querySelector(".loginButton");
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
    if (window.sessionStorage.getItem("works")) {
        document.querySelector("body").insertAdjacentHTML("afterbegin", `
            <section class="projectsModalBackground">
                <div class="projectsModal">
                    <button class="backToGallery">
                        <i class="fa-solid fa-xl fa-arrow-left"></i>
                    </button>
                    <button class="closeModalButton">
                        <i class="fa-solid fa-xl fa-xmark"></i>
                    </button>
                </div>
            </section>
        `);
        addProjectGallery();
        addProjectForm();
        addModalListeners();
        displaySelectedCards(0, ".projectsModalGallery");
        addDeleteIcons();
    } else {
        setTimeout( () => {createProjectsModal()}, 1000);
    };
};

// Creates the container for the project gallery in the modal.
function addProjectGallery() {
    document.querySelector(".closeModalButton").insertAdjacentHTML("afterend", `
        <div class="projectsGallery">
            <h2>Galerie photo</h2>
            <div class="projectsModalGallery"></div>
            <div class="line"></div>
            <button class="addNewProjectButton">Ajouter une photo</button>
        </div>
    `);
};

// Create the form to add projects.
function addProjectForm() {
    document.querySelector(".projectsGallery").insertAdjacentHTML("afterend", `
        <form class="addProjectForm">
            <h2>Ajout photo</h2>

            <div class="photoSelectionBlockContainer">
                <img class="photoDisplayed" src="">
                <label class="photoSelectionBlock" for="image">
                    <i class="fa-regular fa-image"></i>
                    <p class="addPhoto">+ Ajouter photo</p>
                    <p>jpg, png : 4mo max</p>
                </label>
                <input type="file" id="image" accept=".jpg,.png" value="4194304" required>
            </div>

            <label for="addPhotoTitle">Titre</label>
            <input type="text" id="addPhotoTitle" required>

            <label for="selectCategory">Catégorie</label>
            <div class="selectCategoryContainer">
                <select id="selectCategory" name="category" required>
                    <option value="" disabled selected hidden></option>
                    <option value="1">Objet</option>
                    <option value="2">Appartement</option>
                    <option value="3">Hotel & restaurant</option>
                </select>
            </div>

            <div class="line"></div>
            <button class="modalFormSubmitButton">Valider</button>
        </form>
    `);
};

// Adds event listeners on modal elements.
function addModalListeners() {
    document.querySelector(".backToGallery").addEventListener("click", () => {
        backToGallery();
    });
    document.querySelector(".projectsModalBackground").addEventListener("click", () => {
        closeProjectsModal();
    });
    document.querySelector(".closeModalButton").addEventListener("click", () => {
        closeProjectsModal();
    });
    document.querySelector(".projectsModal").addEventListener("click", (e) => {
      e.stopPropagation();
    });
    document.querySelector(".addNewProjectButton").addEventListener("click", () => {
        addNewProjectButton();
    });
    document.querySelector("#image").addEventListener("change", () => {
        newImageSelected();
    })
};

// Display the project gallery and hides the project addition form.
function backToGallery() {
    document.querySelector(".addProjectForm").style.display = "none";
    document.querySelector(".projectsGallery").style.display = "flex";
    document.querySelector(".backToGallery").style.display = "none";
};

// Hide editing projects modal and clears the input fields of the work addition form.
function closeProjectsModal() {
    document.querySelector(".projectsModalBackground").style.display = "none";
    document.querySelector(".projectsGallery").style.display = "flex";
    document.querySelector(".addProjectForm").style.display = "none";
    document.querySelector(".photoSelectionBlock").style.opacity = "1";
    document.querySelector(".photoDisplayed").src = "";
    document.querySelector("#addPhotoTitle").value = "";
    document.querySelector("#selectCategory").value = "";
};

// Adds a delete icon to each figure in the modal.
function addDeleteIcons() {
    document.querySelectorAll(".projectsModalGallery figure").forEach(el => {
        el.insertAdjacentHTML("afterbegin", `
            <div class="deleteIcon"><i class="fa-solid fa-xs fa-trash-can"></i></div>
        `);
        el.querySelector(".deleteIcon").addEventListener("click", () => deleteProject());
    });
};

// Deletes the project when clicking on the icon.
function deleteProject() {
    console.log("la fonction est déclarée mais pas encore écrite.");
};

// Display the project addition form and hides the project gallery.
function addNewProjectButton() {
    document.querySelector(".projectsGallery").style.display = "none";
    document.querySelector(".addProjectForm").style.display = "flex";
    document.querySelector(".backToGallery").style.display = "block";
};

// Selecting a new image in the add projects form.
function newImageSelected() {
    document.querySelector(".photoSelectionBlock").style.opacity = "0";
    
    const input = document.querySelector("#image");
    const file = input.files[0];
    const imgURL = URL.createObjectURL(file);
    const img = document.querySelector(".photoDisplayed");
    img.src = imgURL;
};

function mainFunction() {
    fetchWorks();
    editingModeBanner();
    moveH2ToPortfolioHeader();
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
