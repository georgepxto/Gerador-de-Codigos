let history = JSON.parse(localStorage.getItem("codeHistory") || "[]");
let lastGeneratedCode = "";

function saveHistory() {
  localStorage.setItem("codeHistory", JSON.stringify(history));
}

function addToHistory(code) {
  const time = new Date().toLocaleTimeString();
  history.unshift({ code, time });
  if (history.length > 10) history.pop();
  updateHistoryDisplay();
  saveHistory();
  lastGeneratedCode = code;
}

function updateHistoryDisplay() {
  const container = document.getElementById("historyContainer");
  container.innerHTML = history
    .map(
      (item) => `
                    <div class="history-item" data-code="${item.code}">
                        <div>${item.code}</div>
                        <div class="timestamp">${item.time}</div>
                    </div>
                `
    )
    .join("");
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const msg = document.getElementById("copyMessage");
    msg.style.opacity = "1";
    setTimeout(() => (msg.style.opacity = "0"), 2000);
  });
}

function generateCode(prefix) {
  const codigo = `${prefix}${Math.floor(10000 + Math.random() * 90000)}`;
  const codigoElement = document.getElementById("codigoGerado");
  codigoElement.style.display = "inline-block";
  codigoElement.textContent = codigo;
  addToHistory(codigo);
  copyToClipboard(codigo);
}

document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.prefix) {
      generateCode(button.dataset.prefix);
    }
  });
});

document.getElementById("clearHistory").addEventListener("click", () => {
  history = [];
  updateHistoryDisplay();
  saveHistory();
  document.getElementById("codigoGerado").style.display = "none";
  lastGeneratedCode = "";
});

document.getElementById("historyContainer").addEventListener("click", (e) => {
  const historyItem = e.target.closest(".history-item");
  if (historyItem) {
    const code = historyItem.dataset.code;
    copyToClipboard(code);

    const codigoElement = document.getElementById("codigoGerado");
    codigoElement.style.display = "inline-block";
    codigoElement.textContent = code;
    lastGeneratedCode = code;

    const items = document.querySelectorAll(".history-item");
    items.forEach((item) => item.classList.remove("copied"));
    historyItem.classList.add("copied");
    setTimeout(() => historyItem.classList.remove("copied"), 2000);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "1") generateCode("7G#");
  if (e.key === "2") generateCode("R7#");
  if (e.key === "3") generateCode("BT#");
  if (e.key.toLowerCase() === "c" && lastGeneratedCode)
    copyToClipboard(lastGeneratedCode);
  if (e.key.toLowerCase() === "l")
    document.getElementById("clearHistory").click();
});

document.getElementById("themeToggle").addEventListener("click", () => {
  const body = document.body;
  const isDark = body.classList.toggle("light-theme");
  document.getElementById("themeToggle").textContent = isDark
    ? "☀️ Tema Claro"
    : "🌙 Tema Escuro";
});

updateHistoryDisplay();

if (history.length > 0) {
  const codigoElement = document.getElementById("codigoGerado");
  codigoElement.style.display = "inline-block";
  codigoElement.textContent = history[0].code;
  lastGeneratedCode = history[0].code;
}
