const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const chatWidget = document.getElementById("chat-widget");
const chatToggle = document.getElementById("chat-toggle");

let can_reply = true;

// Abrir/fechar o widget ao clicar na bolinha
chatToggle.addEventListener("click", () => {
  chatWidget.classList.toggle("hidden");
  if (!chatWidget.classList.contains("hidden")) {
    input.focus();
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!can_reply) return;

  const userText = input.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  input.value = "";
  can_reply = false;

  try {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: userText }),
    });

    const data = await response.json();
    const botReply = data.reply || "Erro ao responder 😵";

    addMessage(botReply, "bot");
    

  } catch (error) {
    addMessage("Erro de ligação ao servidor 😢", "bot");
    
  }
    can_reply = true;
});

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
