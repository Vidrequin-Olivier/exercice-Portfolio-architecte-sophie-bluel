// fetch works from backend
async function fetchWorks() {
    let data = window.sessionStorage.getItem("works");
    if (data === null || data === "null") {
        try {
            const apiAddress = "http://localhost:5678/api";
            const response = await fetch(apiAddress + "/works");
            if (!response.ok) {
                alert("La requête API n'a pas pu aboutir.");
                throw new Error("La requête API n'a pas pu aboutir.");
            } else {
                data = await response.json();
                const worksStringified = JSON.stringify(data);
                window.sessionStorage.setItem("works", worksStringified);
            };
        } catch (error) {
            console.error("Une erreur est survenue: ", error.message);
        };
    };
};

// Display the sorting bar
function sortBar() {
    const parentElement = document.getElementById("portfolio");
    const h2 = parentElement.getElementsByTagName("h2");
    const previousTag = h2[0];
    const sortBar = document.createElement("div");
    sortBar.className = "sortBar";
    sortBar.innerHTML = `
                            <button class="button">Tous</button>
                            <button class="button">Objets</button>
                            <button class="button">Appartements</button>
                            <button class="button">Hôtels & restaurants</button>
                        `;
    parentElement.insertBefore(sortBar, previousTag.nextSibling);
};

// function sortBar() {
//     const parentElement = document.getElementById("portfolio");
//     const sortBar = document.createElement("div");
//     sortBar.className = "sortBar";
//     sortBar.innerHTML = `
//                             <button class="button">Tous</button>
//                             <button class="button">Objets</button>
//                             <button class="button">Appartements</button>
//                             <button class="button">Hôtels & restaurants</button>
//                         `;
//     parentElement.appendChild(sortBar);
// };

// Set the selected sorting button on load and upon click.
function sortButtonSelected() {
    const buttonsList = document.querySelectorAll("button");
    let buttonSelected = buttonsList[0];
    buttonsList.forEach((el) => {
        el.addEventListener("click", (e) => {
            let isClicked = buttonsList[e];
            console.log(isClicked);
        });
    });
    buttonSelected.className += " buttonSelected"
};

// Retrieve data from session storage and create 'card' elements.
function createCards() {
    const worksList = JSON.parse(window.sessionStorage.getItem("works"));
    let cards = [];
    for (let i = 0; i < worksList.length; i++) {
        cards += `  
                    <article class="categoryId:${worksList[i].categoryId}" >
                        <figure>
                            <img src="${worksList[i].imageUrl}" alt="${worksList[i].title}">
                            <figcaption>${worksList[i].title}</figcaption>
                        </figure>
                    </article>
                 `;
    };
    return cards;
};

//  Display the cards based on the selected sort button.
function displaySelectedCards(cards) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = cards;
};

// Is it really useful to explain it ?
function mainFunction() {
    fetchWorks();
    sortBar();
    sortButtonSelected();
    displaySelectedCards(createCards())
};

mainFunction();