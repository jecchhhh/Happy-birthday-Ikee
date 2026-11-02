// =================================
// ELEMENTS
// =================================

const intro = document.getElementById("intro");
const envelopeButton = document.getElementById("openEnvelope");
const petalContainer = document.getElementById("petalContainer");

const bookSection = document.getElementById("bookSection");
const frontCover = document.getElementById("frontCover");
const openBookView = document.getElementById("openBookView");
const backCover = document.getElementById("backCover");

const openBookButton = document.getElementById("openBook");
const reopenBookButton = document.getElementById("reopenBook");

const leftImage = document.getElementById("leftImage");
const rightImage = document.getElementById("rightImage");

const turnSheet = document.getElementById("turnSheet");
const turnFrontImage = document.getElementById("turnFrontImage");
const turnBackImage = document.getElementById("turnBackImage");

const prevButton = document.getElementById("prevPage");
const nextButton = document.getElementById("nextPage");

const pageCounter = document.getElementById("pageCounter");
const bookHint = document.getElementById("bookHint");
const readAgainButton = document.getElementById("readAgain");

const backgroundMusic = document.getElementById("backgroundMusic");


// =================================
// PAGE ORDER
// =================================

const pages = [];

for (let i = 1; i <= 14; i++) {
    pages.push(`pages/page-${String(i).padStart(2, "0")}.jpg`);
}

const spreads = [
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8],
    [9, 10],
    [11, 12]
];


// =================================
// BOOK STATE
// =================================

let currentView = "cover";
let currentSpread = 0;
let isTurning = false;

const TURN_DURATION = 1150;


// =================================
// SHOW PAGE SPREAD
// =================================

function showSpread(index) {
    currentSpread = index;

    leftImage.src = pages[spreads[index][0]];
    rightImage.src = pages[spreads[index][1]];

    currentView = "spread";

    frontCover.classList.add("hidden");
    backCover.classList.add("hidden");
    openBookView.classList.remove("hidden");

    pageCounter.textContent =
        `${String(spreads[index][0] + 1).padStart(2, "0")} — ${String(spreads[index][1] + 1).padStart(2, "0")} / 14`;

    bookHint.textContent = "take your time. this one's for you.";

    readAgainButton.classList.add("hidden");

    updateControls();
}


// =================================
// UPDATE CONTROLS
// =================================

function updateControls() {
    prevButton.disabled =
        isTurning ||
        (currentView === "spread" && currentSpread === 0) ||
        currentView === "cover";

    nextButton.disabled =
        isTurning ||
        currentView === "back";
}


// =================================
// OPEN BOOK
// =================================

function openBook() {
    if (isTurning) return;

    frontCover.classList.add("hidden");
    backCover.classList.add("hidden");

    showSpread(0);
}

openBookButton.addEventListener("click", openBook);


// =================================
// FRONT COVER
// =================================

function showFrontCover() {
    currentView = "cover";

    openBookView.classList.add("hidden");
    backCover.classList.add("hidden");
    frontCover.classList.remove("hidden");

    readAgainButton.classList.add("hidden");

    bookHint.textContent = "click to open";

    updateControls();
}


// =================================
// BACK COVER
// =================================

function showBackCover() {
    currentView = "back";

    openBookView.classList.add("hidden");
    frontCover.classList.add("hidden");
    backCover.classList.remove("hidden");

    pageCounter.textContent = "14 / 14";

    bookHint.textContent =
        "and that's the little book i made for you.";

    readAgainButton.classList.remove("hidden");

    updateControls();
}


// =================================
// SMOOTH PAGE TURN ANIMATION
// =================================

function animateTurn(direction, frontPage, backPage, callback) {
    if (isTurning) return;

    isTurning = true;

    // Preload images before starting the flip
    const preloadFront = new Image();
    const preloadBack = new Image();

    preloadFront.src = frontPage;
    preloadBack.src = backPage;

    Promise.all([
        preloadFront.decode().catch(() => {}),
        preloadBack.decode().catch(() => {})
    ]).then(() => {

        turnSheet.className = "turn-sheet active " + direction;

        turnFrontImage.src = frontPage;
        turnBackImage.src = backPage;

        updateControls();

        setTimeout(() => {
            turnSheet.className = "turn-sheet";

            callback();

            isTurning = false;
            updateControls();

        }, TURN_DURATION);
    });
}


// =================================
// NEXT PAGE
// =================================

function nextPage() {
    if (isTurning) return;

    if (currentView === "cover") {
        openBook();
        return;
    }

    if (currentView !== "spread") return;

    // Next two-page spread
    if (currentSpread < spreads.length - 1) {

        const nextSpread = currentSpread + 1;

        animateTurn(
            "next",
            pages[spreads[currentSpread][1]],
            pages[spreads[nextSpread][0]],
            () => showSpread(nextSpread)
        );

        return;
    }

    // Final turn to the back cover
    animateTurn(
        "next",
        pages[12],
        pages[13],
        () => showBackCover()
    );
}


// =================================
// PREVIOUS PAGE
// =================================

function previousPage() {
    if (isTurning) return;

    // Return from back cover
    if (currentView === "back") {

        animateTurn(
            "previous",
            pages[13],
            pages[12],
            () => showSpread(5)
        );

        return;
    }

    if (currentView !== "spread") return;

    // Return to front cover
    if (currentSpread === 0) {

        animateTurn(
            "previous",
            pages[1],
            pages[0],
            () => showFrontCover()
        );

        return;
    }

    // Previous two-page spread
    const previousSpread = currentSpread - 1;

    animateTurn(
        "previous",
        pages[spreads[currentSpread][0]],
        pages[spreads[previousSpread][1]],
        () => showSpread(previousSpread)
    );
}


// =================================
// BUTTON EVENTS
// =================================

nextButton.addEventListener("click", nextPage);

prevButton.addEventListener("click", previousPage);

reopenBookButton.addEventListener("click", previousPage);

readAgainButton.addEventListener("click", () => {
    showFrontCover();
});


// =================================
// FLOWER AND PETAL ANIMATION
// =================================

function createPetals() {

    const decorations = ["✿", "❀", "✧", "♡", "❋"];

    const colors = [
        "#dba9a1",
        "#85866b",
        "#d9b875",
        "#b98b80",
        "#fffaf1"
    ];

    for (let i = 0; i < 65; i++) {

        const petal = document.createElement("span");

        petal.classList.add("petal");

        petal.textContent =
            decorations[Math.floor(Math.random() * decorations.length)];

        petal.style.left = Math.random() * 100 + "vw";

        petal.style.fontSize =
            (12 + Math.random() * 20) + "px";

        petal.style.animationDuration =
            (3 + Math.random() * 5) + "s";

        petal.style.animationDelay =
            Math.random() * 2 + "s";

        petal.style.color =
            colors[Math.floor(Math.random() * colors.length)];

        petalContainer.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, 10000);
    }
}


// =================================
// OPEN ENVELOPE
// =================================

envelopeButton.addEventListener("click", () => {

    if (envelopeButton.classList.contains("opening")) return;

    envelopeButton.classList.add("opening");

    createPetals();

    // Start background music
    backgroundMusic.volume = 0.35;

    backgroundMusic.play().catch(() => {
        console.log("Music could not play. Check the audio file.");
    });

    setTimeout(() => {
        intro.classList.add("fade-out");
    }, 900);

    setTimeout(() => {
        intro.classList.add("hidden");
        bookSection.classList.remove("hidden");
    }, 1700);
});


// =================================
// KEYBOARD CONTROLS
// =================================

document.addEventListener("keydown", (event) => {

    if (currentView === "spread") {

        if (event.key === "ArrowRight") {
            nextPage();
        }

        if (event.key === "ArrowLeft") {
            previousPage();
        }
    }
});


// =================================
// INITIAL STATE
// =================================

showFrontCover();