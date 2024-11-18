const levels = {
  easy: [
    { word: "கோவில்", scrambled: ["வி", "ல்", "கோ"] },
    { word: "வாழை", scrambled: ["ழை", "வா"] },
    { word: "நிலா", scrambled: ["நி", "லா"] },
  ],
  medium: [
    { word: "இடியாப்பம்", scrambled: ["இ", "டி", "யா", "ப்", "ப", "ம்"] },
    { word: "மணிக்கட்டை", scrambled: ["ம", "ணி", "க்", "க", "ட்", "டை"] },
    { word: "பள்ளி", scrambled: ["ப", "ள்", "ளி"] },
  ],
  hard: [
    { word: "சிந்தனைகள்", scrambled: ["சி", "ந்", "த", "னை", "கள்"] },
    { word: "தொகுதிகள்", scrambled: ["தொ", "கு", "தி", "கள்"] },
    { word: "அரசு", scrambled: ["அ", "ர", "சு"] },
  ],
};
let currentLevel, currentIndex, score, levelStartTime, totalTime, timerInterval;
let mistakeMade = false; // Track mistakes for the current word

function startGame(level) {
  currentLevel = level;
  currentIndex = 0;
  score = 0;
  document.getElementById("score").textContent = score;
  totalTime = 0;
  document.getElementById("level-selector").classList.add("hidden");
  document.getElementById("game-board").classList.remove("hidden");
  startLevel();
}

function startLevel() {
  levelStartTime = Date.now();
  updateTimer(); // Start updating the timer
  loadWord();
  if (timerInterval) clearInterval(timerInterval); // Clear any existing interval
  timerInterval = setInterval(updateTimer, 1000); // Update the timer every second
}
function loadWord() {
  const { scrambled } = levels[currentLevel][currentIndex];
  const scrambledTiles = document.getElementById("scrambled-tiles");
  scrambledTiles.innerHTML = scrambled
    .map((tile) => `<div draggable="true">${tile}</div>`)
    .join("");

  Array.from(scrambledTiles.children).forEach((tile) => {
    // Add mouse drag-and-drop events
    tile.addEventListener("dragstart", dragStart);
    tile.addEventListener("dragover", dragOver);
    tile.addEventListener("drop", drop);

    // Add touch support
    tile.addEventListener("touchstart", touchStart);
    tile.addEventListener("touchmove", touchMove);
    tile.addEventListener("touchend", touchEnd);
  });
}

let draggedTile, touchStartX, touchStartY;

function touchStart(event) {
  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  draggedTile = event.target; // Remember the touched tile
}

function touchMove(event) {
  event.preventDefault(); // Prevent page scrolling during touch
  const touch = event.touches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);

  if (
    element &&
    element !== draggedTile &&
    element.parentNode === draggedTile.parentNode
  ) {
    const parent = element.parentNode;
    parent.insertBefore(draggedTile, element.nextSibling);
  }
}

function touchEnd() {
  draggedTile = null; // Reset the dragged tile
}

function dragStart(event) {
  draggedTile = event.target;
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  const targetTile = event.target;
  const parent = targetTile.parentNode;
  parent.insertBefore(draggedTile, targetTile.nextSibling);
}

function verifyAnswer() {
  const userAnswer = Array.from(
    document.getElementById("scrambled-tiles").children
  )
    .map((tile) => tile.textContent)
    .join("");
  const correctAnswer = levels[currentLevel][currentIndex].word;

  if (userAnswer === correctAnswer) {
    if (mistakeMade) {
      // Reduced score for correct answer after a mistake
      score += getReducedScore();
    } else {
      // Normal score for correct answer
      score += getScore();
    }
    document.getElementById("feedback").textContent = "Correct!";
    document.getElementById("score").textContent = score;
    showMeaning(correctAnswer);
    setTimeout(nextWord, 2000);
  } else {
    document.getElementById("feedback").textContent = "Incorrect!";
    mistakeMade = true; // Mark that a mistake was made
    score += getPenalty();
    document.getElementById("score").textContent = score;
  }
}

function getScore() {
  return currentLevel === "easy" ? 3 : currentLevel === "medium" ? 5 : 7;
}

function getReducedScore() {
  return currentLevel === "easy" ? 1 : currentLevel === "medium" ? 2 : 3;
}

function getPenalty() {
  return currentLevel === "easy" ? -1 : currentLevel === "medium" ? -2 : -3;
}

function showMeaning(word) {
  const meaningBox = document.getElementById("meaning");
  meaningBox.textContent = `The meaning of "${word}" is... (Add meanings here)`;
  meaningBox.classList.remove("hidden");
}

function nextWord() {
  currentIndex++;
  const meaningBox = document.getElementById("meaning");
  meaningBox.classList.add("hidden");
  mistakeMade = false; // Reset mistake flag for the next word

  if (currentIndex < levels[currentLevel].length) {
    loadWord();
  } else {
    endLevel();
  }
}

function endLevel() {
  clearInterval(timerInterval); // Stop the timer
  const levelEndTime = Date.now();
  const timeTaken = Math.floor((levelEndTime - levelStartTime) / 1000);
  totalTime += timeTaken;

  document.getElementById(
    "feedback"
  ).textContent = `Level "${currentLevel}" completed in ${timeTaken} seconds!`;

  setTimeout(() => {
    document.getElementById("game-board").classList.add("hidden");
    document.getElementById("level-selector").classList.remove("hidden");
    document.getElementById("feedback").textContent = ""; // Clear feedback
  }, 3000);
}

function updateTimer() {
  const currentTime = Math.floor((Date.now() - levelStartTime) / 1000);
  document.getElementById("time").textContent = currentTime; // Update the timer display
}
