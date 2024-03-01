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
    displaySelectedCards(createCards())
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

// function sortingBar() {
//     const parentElement = document.getElementById("portfolio");
//     const sortingBar = document.createElement("div");
//     sortingBar.className = "sortingBar";
//     sortingBar.innerHTML = `
//                             <button class="button">Tous</button>
//                             <button class="button">Objets</button>
//                             <button class="button">Appartements</button>
//                             <button class="button">Hôtels & restaurants</button>
//                         `;
//     parentElement.appendChild(sortingBar);
// };

// Set the selected sorting button on page load and upon click.
function sortingButtonSelector() {
    const sortingBar = document.querySelector(".sortingBar");
    const buttonsList = sortingBar.querySelectorAll("button");
    buttonsList[0].classList.add("buttonSelected");
    buttonsList.forEach(el => {
        el.addEventListener("click", () => {
            buttonsList.forEach(e => e.classList.remove("buttonSelected"));
            el.classList.add("buttonSelected")
        });
    });
};

// Retrieve data from session storage and create 'card' elements.
function createCards() {
    const worksList = JSON.parse(window.sessionStorage.getItem("works"));
    let cards = [];
    for (let i = 0; i < worksList.length; i++) {
        // remplacer cards += par cards.push() et corriger l'affichage
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

// Display the cards based on the selected sort button.
function displaySelectedCards(cards) {
    const gallery = document.querySelector(".gallery");
    // let displayedCards = [];
    // cards.forEach(el => {
    //     if(el.classList.contains("buttonSelected")) {
    //         displayedCards.push(el);
    //     };
    // });
    // gallery.innerHTML = displayedCards;
    gallery.innerHTML = cards;
};

// Is it really useful to explain it ?
function mainFunction() {
    fetchWorks();
    sortingBar();
    sortingButtonSelector();
};

mainFunction();