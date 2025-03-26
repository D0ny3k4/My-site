document.addEventListener("DOMContentLoaded", () => {
    const playersDiv = document.getElementById("players");
    const addPlayerButton = document.getElementById("add-player");
    const resetScoresButton = document.getElementById("reset-scores");
    const sortScoresButton = document.getElementById("sort-scores");
    const toggleThemeButton = document.getElementById("toggle-theme");
    let players = JSON.parse(localStorage.getItem("players")) || {};

    // Render all players from localStorage
    function renderPlayers() {
        playersDiv.innerHTML = ""; // Clear existing players
        for (const id in players) {
            createPlayerElement(id, players[id].name, players[id].score);
        }
        highlightLeader();
    }

    // Create a new player DOM element
    function createPlayerElement(id, name, score) {
        const playerDiv = document.createElement("div");
        playerDiv.className = "player";
        playerDiv.id = `player-${id}`;
        playerDiv.innerHTML = `
            <span>${name}: <span id="score-${id}">${score}</span></span>
            <button onclick="updateScore('${id}', 1)">+1</button>
            <button onclick="updateScore('${id}', -1)">-1</button>
            <button onclick="removePlayer('${id}')">Remove</button>
        `;
        playersDiv.appendChild(playerDiv);
    }

    // Add a new player
    function addPlayer() {
        const name = prompt("Enter player name:");
        if (name) {
            const id = `player-${Date.now()}`; // Unique ID based on timestamp
            players[id] = { name, score: 0 };
            saveToLocalStorage();
            createPlayerElement(id, name, 0);
        }
    }

    // Update a player's score
    window.updateScore = (id, value) => {
        players[id].score += value;
        document.getElementById(`score-${id}`).textContent = players[id].score;
        saveToLocalStorage();
        highlightLeader();
    };

    // Remove a player
    window.removePlayer = (id) => {
        delete players[id];
        document.getElementById(`player-${id}`).remove();
        saveToLocalStorage();
        highlightLeader();
    };

    // Reset all scores
    function resetScores() {
        for (const id in players) {
            players[id].score = 0;
        }
        saveToLocalStorage();
        renderPlayers();
    }

    // Save players to localStorage
    function saveToLocalStorage() {
        localStorage.setItem("players", JSON.stringify(players));
    }

    // Highlight the player with the highest score
    function highlightLeader() {
        let maxScore = -Infinity;
        let leaderId = null;
        for (const id in players) {
            if (players[id].score > maxScore) {
                maxScore = players[id].score;
                leaderId = id;
            }
        }
        document.querySelectorAll(".player").forEach(player => player.classList.remove("leader"));
        if (leaderId) {
            document.getElementById(`player-${leaderId}`).classList.add("leader");
        }
    }

    // Sort players by score
    function sortPlayers() {
        const sortedPlayers = Object.entries(players)
            .sort(([, a], [, b]) => b.score - a.score)
            .reduce((acc, [id, data]) => {
                acc[id] = data;
                return acc;
            }, {});
        players = sortedPlayers;
        renderPlayers();
    }

    // Toggle Light/Dark Mode
    function toggleTheme() {
        document.body.classList.toggle("dark-mode");
    }

    // Event Listeners
    addPlayerButton.addEventListener("click", addPlayer);
    resetScoresButton.addEventListener("click", resetScores);
    sortScoresButton.addEventListener("click", sortPlayers);
    toggleThemeButton.addEventListener("click", toggleTheme);

    // Initial Render
    renderPlayers();
});
