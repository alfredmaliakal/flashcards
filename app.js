const countEl = document.getElementById("count");
const cardEl = document.getElementById("card");
const labelEl = document.getElementById("label");
const textEl = document.getElementById("text");
const hintEl = document.getElementById("hint");
const nextEl = document.getElementById("next");

let cards = [];
let order = [];
let index = 0;
let revealed = false;

function parseCards(raw) {
  const cards = [];
  let question = "";

  for (const line of raw.split(/\r?\n/)) {
    if (line.startsWith("Q:")) {
      question = line.slice(2).trim();
    } else if (line.startsWith("A:") && question) {
      const answer = line.slice(2).trim();
      if (answer) cards.push({ q: question, a: answer });
      question = "";
    }
  }

  return cards;
}

function shuffle(items) {
  const next = items.slice();
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function reshuffle() {
  const last = order[order.length - 1];
  order = shuffle(cards.map((_, i) => i));
  if (order.length > 1 && order[0] === last) {
    order.push(order.shift());
  }
  index = 0;
}

function current() {
  return cards[order[index]];
}

function render() {
  const card = current();
  if (!card) {
    textEl.textContent = "No cards found in QNA.txt";
    labelEl.textContent = "";
    hintEl.textContent = "";
    countEl.textContent = "0 / 0";
    return;
  }

  countEl.textContent = `${index + 1} / ${cards.length}`;
  labelEl.textContent = revealed ? "answer" : "question";
  textEl.textContent = revealed ? card.a : card.q;
  hintEl.textContent = revealed ? "tap for question" : "tap to reveal";
  hintEl.classList.toggle("is-hidden", false);
}

function reveal() {
  if (!current()) return;
  revealed = !revealed;
  render();
}

function nextCard() {
  if (!cards.length) return;
  index += 1;
  if (index >= order.length) reshuffle();
  revealed = false;
  render();
}

function onPointer() {
  let startX = 0;
  let startY = 0;
  let tracking = false;

  cardEl.addEventListener("pointerdown", (event) => {
    tracking = true;
    startX = event.clientX;
    startY = event.clientY;
  });

  cardEl.addEventListener("pointerup", (event) => {
    if (!tracking) return;
    tracking = false;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) nextCard();
      return;
    }
    reveal();
  });

  cardEl.addEventListener("pointercancel", () => {
    tracking = false;
  });
}

async function start() {
  try {
    const response = await fetch("QNA.txt", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load QNA.txt");
    cards = parseCards(await response.text());
  } catch (error) {
    textEl.textContent = "Could not load QNA.txt";
    hintEl.textContent = "";
    countEl.textContent = "0 / 0";
    return;
  }

  reshuffle();
  render();
}

nextEl.addEventListener("click", nextCard);

document.addEventListener("keydown", (event) => {
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    reveal();
  }
  if (event.key === "ArrowRight" || event.key === "n") {
    nextCard();
  }
});

onPointer();
start();
