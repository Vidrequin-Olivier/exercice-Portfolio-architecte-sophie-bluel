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
    const portfolioHeader = document.createElement("div");
    portfolioHeader.classList.add("portfolioHeader");
    portfolio.insertBefore(portfolioHeader, h2);
    portfolioHeader.appendChild(h2);
};

// Creates the edit projects button.
function editProjectsButton() {
    document.querySelector("#portfolio h2").insertAdjacentHTML("afterend",
        '<p class="editProjectsButton"><i class="fa-regular fa-pen-to-square"></i>modifier</p>'
    );
    document.querySelector(".editProjectsButton").addEventListener("click", () => {
        document.querySelector(".projectsModalBackground").style.display = "flex";
    })
};

// Creates and display the sorting bar
function sortingBar() {
    if (window.sessionStorage.getItem("works")) {
        document.querySelector(".portfolioHeader").insertAdjacentHTML("afterend", `
            <div class="sortingBar">
                <button class="button" id="0">Tous</button>
            </div>
        `);
        const sortingBar = document.querySelector(".sortingBar");
        const categories = retrieveCategories();
        categories.forEach( el => sortingBar.innerHTML += `<button class="button" id="${el.id}">${el.name}</button>`);
        sortingButtonSelector();
    } else {
        setTimeout( () => {sortingBar()}, 500);
    };
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
    buttonsList.forEach(el => {
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
            <figure class="${card.id}">
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
        clearInputsEntries("loginForm");
        displayMainTag();
    });
};

// Display main tag and hides section tag.
function displayMainTag() {
    document.querySelector(".loginPage").style.display = "none";
    document.querySelector(".loginButton").style.fontWeight = "400";
    document.querySelector("main").style.display = "block";
};

// Display section tag and hides main tag.
function displaySectionTag() {
    document.querySelector("main").style.display = "none";
    document.querySelector(".loginButton").style.fontWeight = "600";
    document.querySelector(".loginPage").style.display = "flex";
};

// Login form submission management.
function loginFormSubmission() {
    document.querySelector(".loginForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const userEmailInput = document.getElementById("emailInput").value;
        const userPasswordInput = document.getElementById("passwordInput").value;
        let userInformations = {
            "email": userEmailInput,
            "password": userPasswordInput
        };
        userInformations = JSON.stringify(userInformations);
        connectionAttempt(userInformations);
    });
};

// Sending the connection request upon login form submission.
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
                alert("Echec de la requête.");
                break
            case 404:
                alert("Erreur dans l’identifiant ou le mot de passe.");
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
    document.querySelector(".editingModeBanner").style.display = "flex";
    loginToLogout();
    document.querySelector(".sortingBar").style.display = "none";
    document.querySelector(".editProjectsButton").style.display = "block";
};

// Switch from "login" to "logout"
function loginToLogout() {
    document.querySelector(".loginButton").style.display = "none";
    document.querySelector(".logoutButton").style.display = "inline";
};

// Logs out the user, deletes login information and displays the home page.
function logout() {
    window.sessionStorage.removeItem("loginToken");
    document.querySelector(".editingModeBanner").style.display = "none";
    logoutToLogin();
    document.querySelector(".sortingBar").style.display = "flex";
    document.querySelector(".editProjectsButton").style.display = "none";
    clearInputsEntries("loginForm");
};

// Switch from "login" to "logout"
function logoutToLogin() {
    document.querySelector(".logoutButton").style.display = "none";
    document.querySelector(".loginButton").style.display = "inline";
};

// Clear the form inputs.
function clearInputsEntries(formClassName) {
    document.querySelectorAll(`.${formClassName} input`).forEach( el => {
        el.value = "";
    });
    document.getElementById("image").value = "";
    document.querySelector("#addPhotoTitle").value = "";
    document.querySelector("#selectCategory").value = "";
    document.querySelector(".photoDisplayed").src = "";
};

// Creates the project editing modal window.
function createProjectsModal() {
    if (window.sessionStorage.getItem("works")) {
        document.querySelector(".editingModeBanner").insertAdjacentHTML("afterend", `
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
        setTimeout( () => {createProjectsModal()}, 500);
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
                    <option value="1">Objets</option>
                    <option value="2">Appartements</option>
                    <option value="3">Hotels & restaurants</option>
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
    });
    document.getElementById("addPhotoTitle").addEventListener("change", () => {
        IsReadyToSubmit();
    });
    document.getElementById("selectCategory").addEventListener("change", () => {
        IsReadyToSubmit();
    });
    document.querySelector(".addProjectForm").addEventListener("submit", (e) => {
        if (IsReadyToSubmit() === true) {
            e.preventDefault();
            const imageInput = document.getElementById("image");
            const fileSizeLimit = 4194304; // 4 MB in bytes
        
            if (imageInput.files && imageInput.files[0]) {
              const file = imageInput.files[0];
              if (file.size > fileSizeLimit) {
                alert("Le fichier image est trop volumineux. Taille maximale : 4 Mo");
                return;
              }
            }
            submitNewProject();
        };
    });
};

// Display the project gallery and hides the project addition form.
function backToGallery() {
    document.querySelector(".addProjectForm").style.display = "none";
    document.querySelector(".projectsGallery").style.display = "flex";
    document.querySelector(".backToGallery").style.display = "none";
    document.querySelector(".photoSelectionBlock").style.opacity = "1";
    document.querySelector(".photoDisplayed").style.display = "none";
    clearInputsEntries("addProjectForm");
};

// Hide editing projects modal and clears the input fields of the work addition form.
function closeProjectsModal() {
    document.querySelector(".projectsModalBackground").style.display = "none";
    document.querySelector(".projectsGallery").style.display = "flex";
    document.querySelector(".addProjectForm").style.display = "none";
    clearInputsEntries("addProjectForm");
    IsReadyToSubmit();
};

// Adds a delete icon to each figure in the modal.
function addDeleteIcons() {
    document.querySelectorAll(".projectsModalGallery figure").forEach(el => {
        el.insertAdjacentHTML("afterbegin", `
            <div class="deleteIcon"><i class="fa-solid fa-xs fa-trash-can"></i></div>
        `);
        el.querySelector(".deleteIcon").addEventListener("click", () => deleteProject(el.className));
    });
};

// Deletes the project when clicking on the icon.
async function deleteProject(el) {
    const apiAddress = `http://localhost:5678/api/works/${el}`;
    try {
        const loginToken = JSON.parse(window.sessionStorage.getItem("loginToken"));
        const response = await fetch(apiAddress, {
            method: "DELETE",
            headers: {"accept": "*/*", "Authorization": `Bearer ${loginToken.token}`}
        });
        const responseStatus = response.status;
        switch (responseStatus) {
            case 204:
                const works = JSON.parse(sessionStorage.getItem("works"));
                const indexToDelete = works.findIndex(work => work.id === el);
                works.splice(indexToDelete, 1);
                sessionStorage.setItem("works", JSON.stringify(works));
                refreshGalleries();
                break
            case 401:
                alert("Requête refusée.");
                break
            case 500:
                alert("Erreur serveur inattendue.");
                break
            default:
                console.log(`réponce du serveur: ${responseStatus}`);
                alert(`Réponse serveur non valide: ${response.statusText}.`);
        }
    } catch (error) {
        alert(`Une erreur est survenue: ${error.message}.`);
        return false;
    };
};

// Refreshes galleries when adding or removing projects.
function refreshGalleries() {
    document.querySelector(".projectsModalGallery").innerHTML = "";
    displaySelectedCards(0, ".projectsModalGallery");
    document.querySelector(".gallery").innerHTML = "";
    displaySelectedCards(0, ".gallery");
    addDeleteIcons();
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
    img.style.display = "block";
    IsReadyToSubmit();
};

// Checks if all the input fields of the project addition form are completed and changes the color of the submit button accordingly.
function IsReadyToSubmit() {
    const modalFormSubmitButton = document.querySelector(".modalFormSubmitButton");
    if ((document.getElementById("image").value === "") ||
        (document.getElementById("addPhotoTitle").value === "") ||
        (document.getElementById("selectCategory").value === "") ) {
            modalFormSubmitButton.style.backgroundColor = "#A7A7A7";
            return false;
    };
    modalFormSubmitButton.style.backgroundColor = "var(--main-color)";
    return true;
};

// Sends a project addition request to the API based on data from the project addition form.
async function submitNewProject() {
    const apiAddress = "http://localhost:5678/api/works";
    const loginToken = JSON.parse(window.sessionStorage.getItem("loginToken"));

    const image = document.getElementById("image").files[0];
    const title = document.getElementById("addPhotoTitle").value;
    const category = document.getElementById("selectCategory").value;

    const project = new FormData();
    project.append('image', image);
    project.append('title', title);
    project.append('category', category);

    try {
        const response = await fetch(apiAddress, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${loginToken.token}`
            },
            body: project
        });
        const responseStatus = response.status;
        switch (responseStatus) {
            case 201:
                const data = await response.json();
                const addCategory = {id:`${data.categoryId}`, name:`${project.category}`};
                data.category = addCategory;
                const works = JSON.parse(window.sessionStorage.getItem("works"));
                works.push(data);
                window.sessionStorage.setItem("works", JSON.stringify(works));
                refreshGalleries();
                backToGallery();
                break
            case 400:
                alert("Echec de la requête.");
                break
            case 401:
                alert("Requête refusée.");
                break
            case 500:
                alert("Erreur serveur inattendue.");
                break
            default:
                alert(`Réponse serveur non valide: ${response.statusText}.`);
        }
    } catch (error) {
        alert(`Une erreur est survenue: ${error.message}.`);
        console.log(alert);
        return false;
    };
};

// Maintain connection on page reload.
function maintainConnection() {
    if (window.sessionStorage.getItem("loginToken")) {
        if (window.sessionStorage.getItem("works")) {
            displayConnectedState();
        } else {
            setTimeout( () => {maintainConnection()}, 500);
        };
    };
};

function mainFunction() {
    fetchWorks();
    editingModeBanner();
    moveH2ToPortfolioHeader();
    editProjectsButton();
    sortingBar();
    createLoginPage();
    pageLayout();
    loginFormSubmission();
    createProjectsModal();
    maintainConnection();
};

mainFunction();
