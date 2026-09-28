// --- Configuration & Placeholders ---
// Note: meme images and vote sounds are now handled per-party.

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
        isFavored: true,
        memeImage: "assets/images/bjpmeme.jpg",
        voteSound: "assets/sounds/modi-sab-changasi.mp3",
        memeText: "SAB CHANGA SI MITTRON"
    },
    {
        id: "ncf",
        name: "Harle G",
        acronym: "HG",
        image: "assets/images/raga.jpg",
        desc: "Mandatory chai break every 15 minutes. Youth leader since 1947.",
        popularity: "0.01% (Family Included)",
        scamLevel: "Vintage",
        isFavored: false,
        memeImage: "assets/images/bjp.jpg",
        voteSound: "assets/sounds/lavden-bhojyam.mp3",
        memeText: "LAWDEN BHOJYAM"
    },
    {
        id: "ddl",
        name: "Single Janta Party",
        acronym: "SJP",
        image: "assets/images/bhai.jpg",
        desc: "Bhai rule the world. Driving skills not included.",
        popularity: "0.05% (Box Office)",
        scamLevel: "Blockbuster",
        isFavored: false,
        memeImage: "assets/images/sjp.jpg",
        voteSound: "assets/sounds/modi-ji-bkl.mp3",
        memeText: "BKL, Tu single Hi Marega"
    },
    {
        id: "umr",
        name: "Cockroach Janta Party",
        acronym: "CJP",
        image: "assets/images/cjp.jpg",
        desc: "CUCKS will rule the Cockroaches. Nuclear winter survivalists.",
        popularity: "0.001% (Underground)",
        scamLevel: "Pest Control",
        isFavored: false,
        memeImage: "assets/images/cjp.jpg",
        voteSound: "assets/sounds/is-sajjan-ko-kya-takleef-hai-bhai.mp3",
        memeText: "GENDU GENERATION HAI SACH ME"
    }
];

const confirmationQuestions = [
    "Are you sure you want to vote for the <strong>{party}</strong>?",
    "Do you really wanna vote them?",
    "Are you absolutely sure about this decision?",
    "Think about the consequences! Still want to proceed?",
    "Final warning: Are you 100% positive?"
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
const captchaOverlay = document.getElementById("captcha-overlay");
const modalContent = document.getElementById("modal-content");
const toastContainer = document.getElementById("toast-container");
const confettiContainer = document.getElementById("confetti-container");
const resetBtn = document.getElementById("reset-btn");
const memeTextElement = document.getElementById("meme-text");
const mediaContainer = document.getElementById("media-container");
const memeImgElement = document.getElementById("meme-image");

const fundsCounter = document.getElementById("funds-counter");
const dictatorToggle = document.getElementById("dictator-toggle");

let audioPlayer = null;
let selectedPartyForVote = null;

// --- Initialization ---
function init() {
    renderParties();
    setupResetBtn();

    // Start random interferences
    setInterval(() => {
        if (!mediaContainer.classList.contains("hidden")) return;
        const msg = randomInterferences[Math.floor(Math.random() * randomInterferences.length)];
        showToast("BREAKING NEWS: " + msg);
    }, 12000);

    // Start Live Funds Counter
    setInterval(() => {
        let current = parseInt(fundsCounter.innerText.replace(/,/g, ''));
        current += Math.floor(Math.random() * 500000) + 10000;
        fundsCounter.innerText = current.toLocaleString();
    }, 800);

    // Dictator Mode Listener
    dictatorToggle.addEventListener("change", (e) => {
        if (e.target.checked) {
            document.body.classList.add("dictator-active");
            showToast("DICTATOR MODE ENGAGED. Dissent is now disabled.");
            playGlitchSound();
        } else {
            document.body.classList.remove("dictator-active");
            showToast("Democracy restored... for now.");
        }
    });
}

// --- Render Functions ---
function renderParties() {
    partiesGrid.innerHTML = "";
    parties.forEach(party => {
        const card = document.createElement("div");
        card.className = "party-card glass-panel";
        card.setAttribute("data-id", party.id);
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
                <button class="btn bribe-btn" onclick="handleBribeClick('${party.name}')"><i class="fa-solid fa-sack-dollar"></i> BRIBE</button>
            </div>
        `;
        partiesGrid.appendChild(card);
    });
}

// --- Interaction Logic ---
window.handleVoteClick = (partyId) => {
    selectedPartyForVote = parties.find(p => p.id === partyId);

    // Open Captcha First
    captchaOverlay.classList.remove("hidden");
};

window.verifyCaptcha = () => {
    // Doesn't matter what they selected, always fail the first time if we wanted, but let's just accept it
    captchaOverlay.classList.add("hidden");

    // Reset selected boxes
    document.querySelectorAll('.captcha-box').forEach(box => box.classList.remove('selected'));

    const party = selectedPartyForVote;
    if (document.body.classList.contains("dictator-active")) {
        // In dictator mode, force BJP win regardless of what they clicked (though only BJP is visible anyway)
        const bjp = parties.find(p => p.id === "bjp");
        selectedPartyForVote = bjp;
        showFavoredModal(bjp);
    } else if (party.isFavored) {
        showFavoredModal(party);
    } else {
        showConfirmationModal(0);
    }
};

window.handleBribeClick = (partyName) => {
    playChaChingSound();
    const bribeAmounts = ["₹500 and a quarter bottle", "A government contract", "A shiny new toaster", "A ticket to Dubai"];
    const amount = bribeAmounts[Math.floor(Math.random() * bribeAmounts.length)];

    let currentFunds = parseInt(fundsCounter.innerText.replace(/,/g, ''));
    if (currentFunds > 500000) {
        fundsCounter.innerText = (currentFunds - 500000).toLocaleString();
    }

    showToast(`Attempting to bribe ${partyName} with ${amount}...`);

    setTimeout(() => {
        showToast(`MLAs successfully loaded onto the luxury resort bus.`);
    }, 2000);
};

window.showConfirmationModal = (step) => {
    const party = selectedPartyForVote;
    if (step >= confirmationQuestions.length) {
        executeVote();
        return;
    }

    playErrorSound();
    const questionText = confirmationQuestions[step].replace("{party}", party.name);

    modalContent.innerHTML = `
        <h3 class="modal-title">Wait a minute... (Question ${step + 1}/5)</h3>
        <p class="modal-body">${questionText}</p>
        <div class="modal-actions">
            <button class="btn success-btn" onclick="showConfirmationModal(${step + 1})">YES</button>
            <button class="btn danger-btn" onclick="closeModalAndToast()">NO</button>
        </div>
    `;
    openModal();
};

function showFavoredModal(party) {
    playSuccessSound();
    const isDictator = document.body.classList.contains("dictator-active");
    const btnText = isDictator ? "OBEY" : "YES";
    modalContent.innerHTML = `
        <h3 class="modal-title">Excellent Choice!</h3>
        <p class="modal-body">Would you like to vote for the <strong>${party.name}</strong>?</p>
        <div class="modal-actions">
            <button class="btn success-btn" onclick="executeVote()">${btnText}</button>
            <button class="btn success-btn" onclick="executeVote()">${isDictator ? "SUBMIT" : "OF COURSE"}</button>
            <button class="btn success-btn" onclick="executeVote()">${isDictator ? "SURRENDER" : "HELL YEAH"}</button>
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

window.executeVote = () => {
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

// --- Final Outcome ---
function showResultsDashboard() {
    if (selectedPartyForVote) {
        const sound = selectedPartyForVote.voteSound;
        const img = selectedPartyForVote.memeImage;
        const text = selectedPartyForVote.memeText;

        mediaContainer.classList.remove("hidden");
        if (memeTextElement) memeTextElement.innerText = text || "";

        // Play sound if available
        if (sound) {
            if (!audioPlayer) {
                audioPlayer = new Audio(sound);
            } else {
                audioPlayer.src = sound;
            }
            audioPlayer.play().catch(e => console.log("Audio play failed", e));
        }

        // Show Image if available
        if (img) {
            memeImgElement.src = img;
            memeImgElement.classList.remove("hidden");
        }
    }
}

// --- Reset ---
function setupResetBtn() {
    resetBtn.addEventListener("click", () => {
        mediaContainer.classList.add("hidden");
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }
        partiesGrid.style.display = "grid";
        showToast("Democracy rebooted successfully.");
    });
}

// --- Utilities ---
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
        <span><i class="fa-solid fa-triangle-exclamation"></i></span>
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

// --- Sound Synthesizer (No external assets needed) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playChaChingSound() {
    playTone(800, 'sine', 0.1);
    setTimeout(() => playTone(1200, 'sine', 0.3), 100);
}

function playErrorSound() {
    playTone(150, 'sawtooth', 0.4);
}

function playSuccessSound() {
    playTone(400, 'sine', 0.1);
    setTimeout(() => playTone(600, 'sine', 0.1), 100);
    setTimeout(() => playTone(800, 'sine', 0.2), 200);
}

function playGlitchSound() {
    playTone(100, 'square', 0.1);
    setTimeout(() => playTone(50, 'square', 0.1), 50);
    setTimeout(() => playTone(300, 'square', 0.2), 100);
}

// Boot up
init();
