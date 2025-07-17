const form = document.getElementById("chat-form");
const chatBox = document.getElementById("chat-box");
const chatWidget = document.getElementById("chat-widget");
const chatToggle = document.getElementById("chat-toggle");
const input = document.getElementById("user-input");

let can_reply = true;
let first_open = true;

function addMessage(text, sender, info_text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  if (sender === "bot") {
    const contentWrapper = document.createElement("div");
    contentWrapper.classList.add("bot-content");

    const msgText = document.createElement("div");
    msgText.textContent = text;
    msgText.classList.add("bot-text");

    const infoBox = document.createElement("div");
    infoBox.textContent = info_text;
    infoBox.classList.add("info-box", "hidden");

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "ℹ️";
    toggleBtn.classList.add("info-toggle-outside");

    toggleBtn.addEventListener("click", () => {
      if (toggleBtn.textContent === "ℹ️") {
        toggleBtn.textContent = "💬";
      }
      else {
        toggleBtn.textContent = "ℹ️";
      }

      msgText.classList.toggle("hidden");
      infoBox.classList.toggle("hidden");
    });

    contentWrapper.appendChild(msgText);
    if (info_text != null) {
      contentWrapper.appendChild(infoBox);
      contentWrapper.appendChild(toggleBtn);
    }
    
    msg.appendChild(contentWrapper);
  } else {
    msg.textContent = text;
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}