// --- Configuration & Placeholders ---
const memeImage = ""; // e.g., "assets/images/meme.png"
const voteSound = ""; // e.g., "assets/sounds/success.mp3"

// --- Data Structures ---
const parties = [
    {
        id: "bjp",
        name: "Bharat Jugaad Party",
        acronym: "BJP",
        image: "assets/images/modi.jpg",
        desc: "Lawden Bhojyam For Win. We fix bridges with cello tape.",
        popularity: "99.9% (EVM Adjusted)",
        scamLevel: "World Class",
        isFavored: true
    },
    {
        id: "ncf",
        name: "Harle G",
        acronym: "HG",
        image: "assets/images/raga.jpg",
        desc: "Mandatory chai break every 15 minutes. Youth leader since 1947.",
        popularity: "0.01% (Family Included)",
        scamLevel: "Vintage",
        isFavored: false
    },
    {
        id: "ddl",
        name: "Single Janta Party",
        acronym: "SJP",
        image: "assets/images/bhai.jpg",
        desc: "Bhai rule the world. Driving skills not included.",
        popularity: "0.05% (Box Office)",
        scamLevel: "Blockbuster",
        isFavored: false
    },
    {
        id: "umr",
        name: "Cockroach Janta Party",
        acronym: "CJP",
        image: "assets/images/cjp.jpg",
        desc: "CUCKS will rule the Cockroaches. Nuclear winter survivalists.",
        popularity: "0.001% (Underground)",
        scamLevel: "Pest Control",
        isFavored: false
    }
];

const funnyRejections = [
    "Excellent. Democracy remains safe. Probably.",
    "Good choice. They were going to tax oxygen anyway.",
    "Vote successfully forwarded to absolutely nobody.",
    "Your vote is being carefully ignored... just kidding.",
    "Error 404: Alternative choice not found.",
    "EVM Hacked successfully. Re-routing vote...",
    "Vote sent to the Bermuda Triangle."
];

const escalationSteps = [
    "YOUR VOTE...",
    "COUNTED...",
    "DOUBLE-CHECKED...",
    "TRIPLE-CHECKED...",
    "SENT TO SOMEONE'S UNCLE...",
    "ADJUSTING ALGORITHMS...",
    "BRIBE ACCEPTED...",
    "DEMOCRACY.EXE HAS STOPPED RESPONDING"
];

const randomInterferences = [
    "Foreign hackers are currently re-arranging the ballots...",
    "A stray cow has eaten 14,000 votes in Uttar Pradesh.",
    "Wi-Fi disconnected. Defaulting all votes to the winner.",
    "News channel declares winner before voting starts.",
    "EVM machine is demanding a tea break."
];

// --- DOM Elements ---
const partiesGrid = document.getElementById("parties-grid");
const modalOverlay = document.getElementById("modal-overlay");
const modalContent = document.getElementById("modal-content");
const toastContainer = document.getElementById("toast-container");
const confettiContainer = document.getElementById("confetti-container");
const resultsDashboard = document.getElementById("results-dashboard");
const resetBtn = document.getElementById("reset-btn");
const mediaContainer = document.getElementById("media-container");
const memeImgElement = document.getElementById("meme-image");

let audioPlayer = null;

// --- Initialization ---
function init() {
    renderParties();
    setupResetBtn();
    
    // Start random interferences
    setInterval(() => {
        if (!resultsDashboard.classList.contains("hidden")) return;
        const msg = randomInterferences[Math.floor(Math.random() * randomInterferences.length)];
        showToast("BREAKING NEWS: " + msg);
    }, 12000);
}

// --- Render Functions ---
function renderParties() {
    partiesGrid.innerHTML = "";
    parties.forEach(party => {
        const card = document.createElement("div");
        card.className = "party-card glass-panel";
        const imgContent = party.image
            ? `<img src="${party.image}" alt="${party.name}" class="party-image">`
            : `<div class="party-image-placeholder">No Image</div>`;

        card.innerHTML = `
            ${party.icon ? `<div class="party-icon">${party.icon}</div>` : ''}
            ${imgContent}
            <h2 class="party-name">${party.name} <span class="acronym">(${party.acronym})</span></h2>
            <p class="party-desc">"${party.desc}"</p>
            <div class="party-stats">
                <div class="stat-row">Popularity: <span class="stat-highlight">${party.popularity}</span></div>
                <div class="stat-row">Scam Level: <span class="stat-highlight">${party.scamLevel}</span></div>
            </div>
            <div class="card-actions">
                <button class="btn vote-btn" onclick="handleVoteClick('${party.id}')">VOTE</button>
                <button class="btn bribe-btn" onclick="handleBribeClick('${party.name}')">💰 BRIBE</button>
            </div>
        `;
        partiesGrid.appendChild(card);
    });
}

// --- Interaction Logic ---
window.handleVoteClick = (partyId) => {
    const party = parties.find(p => p.id === partyId);

    if (party.isFavored) {
        showFavoredModal(party);
    } else {
        showNormalModal(party);
    }
};

window.handleBribeClick = (partyName) => {
    const bribeAmounts = ["₹500 and a quarter bottle", "A government contract", "A shiny new toaster", "A ticket to Dubai"];
    const amount = bribeAmounts[Math.floor(Math.random() * bribeAmounts.length)];
    showToast(`Attempting to bribe ${partyName} with ${amount}...`);
    
    setTimeout(() => {
        showToast(`Bribe successfully accepted by ${partyName}. Morals compromised.`);
    }, 2000);
};

function showNormalModal(party) {
    modalContent.innerHTML = `
        <h3 class="modal-title">Wait a minute...</h3>
        <p class="modal-body">Are you sure you want to vote for the <strong>${party.name}</strong>?</p>
        <div class="modal-actions">
            <button class="btn danger-btn" onclick="closeModalAndToast()">NO</button>
            <button class="btn danger-btn" onclick="closeModalAndToast()">ABSOLUTELY NOT</button>
        </div>
    `;
    openModal();
}

function showFavoredModal(party) {
    modalContent.innerHTML = `
        <h3 class="modal-title">Excellent Choice!</h3>
        <p class="modal-body">Would you like to vote for the <strong>${party.name}</strong>?</p>
        <div class="modal-actions">
            <button class="btn success-btn" onclick="executeFavoredVote()">YES</button>
            <button class="btn success-btn" onclick="executeFavoredVote()">OF COURSE</button>
            <button class="btn success-btn" onclick="executeFavoredVote()">HELL YEAH</button>
        </div>
    `;
    openModal();
}

function openModal() {
    modalOverlay.classList.remove("hidden");
}

window.closeModalAndToast = () => {
    modalOverlay.classList.add("hidden");
    const randomMsg = funnyRejections[Math.floor(Math.random() * funnyRejections.length)];
    showToast(randomMsg);
};

window.executeFavoredVote = () => {
    // Play sound if available
    if (voteSound) {
        if (!audioPlayer) {
            audioPlayer = new Audio(voteSound);
        }
        audioPlayer.play().catch(e => console.log("Audio play failed (maybe no interaction yet)", e));
    }

    // Show Image if available
    if (memeImage) {
        mediaContainer.classList.remove("hidden");
        memeImgElement.src = memeImage;
        memeImgElement.classList.remove("hidden");
    }

    // Start celebration
    modalContent.innerHTML = `
        <h3 class="modal-title">CONGRATULATIONS!</h3>
        <p class="modal-body" id="escalation-text">YOUR TOTALLY REAL VOTE HAS BEEN TOTALLY COUNTED.</p>
        <div class="progress-bar-container">
            <div id="progress-bar" class="progress-bar"></div>
        </div>
    `;

    shootConfetti();
    runEscalationSequence();
};

// --- Escalation Sequence ---
function runEscalationSequence() {
    const textElement = document.getElementById("escalation-text");
    const progressBar = document.getElementById("progress-bar");
    let step = 0;

    const interval = setInterval(() => {
        if (step < escalationSteps.length) {
            textElement.innerText = escalationSteps[step];
            progressBar.style.width = `${((step + 1) / escalationSteps.length) * 100}%`;
            step++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                modalOverlay.classList.add("hidden");
                partiesGrid.style.display = "none";
                showResultsDashboard();
            }, 1000);
        }
    }, 1200);
}

// --- Results Dashboard ---
function showResultsDashboard() {
    if (memeImage) mediaContainer.classList.add("hidden");

    resultsDashboard.classList.remove("hidden");

    // Funny animation on stats
    const totalElement = document.getElementById("stat-total");
    let count = 1284300;
    const countInterval = setInterval(() => {
        count += Math.floor(Math.random() * 100);
        totalElement.innerText = count.toLocaleString();
    }, 50);

    setTimeout(() => {
        clearInterval(countInterval);
        totalElement.innerText = "OVER 9000!!!";
        totalElement.classList.add("glitch-text");
    }, 3000);
}

// --- Reset ---
function setupResetBtn() {
    resetBtn.addEventListener("click", () => {
        resultsDashboard.classList.add("hidden");
        partiesGrid.style.display = "grid";
        showToast("Democracy rebooted successfully.");
    });
}

// --- Utilities ---
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
        <span>⚠️</span>
        <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3500);
}

function shootConfetti() {
    const colors = ["#FF9933", "#FFFFFF", "#138808", "#000080"];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";

        // Random properties
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 2) + "s";
        confetti.style.animationDelay = (Math.random() * 0.5) + "s";

        confettiContainer.appendChild(confetti);

        // Clean up
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Boot up
init();
