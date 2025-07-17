const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const chatWidget = document.getElementById("chat-widget");
const chatToggle = document.getElementById("chat-toggle");

let can_reply = true;
let first_open = true;
// Abrir/fechar o widget ao clicar na bolinha
chatToggle.addEventListener("click", () => {
  chatWidget.classList.toggle("hidden");
  if (!chatWidget.classList.contains("hidden")) {
    input.focus();

    // Enviar mensagem "Olá" apenas na primeira abertura
    if (first_open) {
      setTimeout(() => {
        addMessage("Olá! Como posso ajudar?", "bot");
      }, 300);
      first_open = false;
    }
  }
});

function showSuggestions(suggestions) {
  const container = document.getElementById("suggested-questions");
  container.innerHTML = ""; // Limpa sugestões anteriores
  suggestions.forEach(text => {
    const button = document.createElement("button");
    button.classList.add("suggestion");
    button.textContent = text;
    button.addEventListener("click",() =>{
      input.value = text;
      form.dispatchEvent(new Event("submit"));
    });
    container.appendChild(button);
  });

container.style.display = "flex";
  
}

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
    const sources = data.sources || [];
    addMessage(botReply, "bot", sources);
    if (data.suggestions && data.suggestions.length > 0) {
      showSuggestions(data.suggestions);
    }
    

  } catch (error) {
    addMessage("Erro de ligação ao servidor 😢", "bot");
    
  }
    can_reply = true;
});

function addMessage(text, sender, sources = []) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  const messageText = document.createElement("p");
  messageText.textContent = text;
  msg.appendChild(messageText);

  // Se for o bot e houverem fontes, adiciona botão + lista
  if (sender === "bot" && sources.length > 0) {
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "🔗 Mostrar Fontes";
    toggleButton.classList.add("toggle-sources");

    const sourcesList = document.createElement("ul");
    sourcesList.classList.add("sources-list");
    sourcesList.style.display = "none";

    sources.forEach(src => {
      const li = document.createElement("li");
      li.textContent = src;
      sourcesList.appendChild(li);
    });

    toggleButton.addEventListener("click", () => {
      sourcesList.style.display = sourcesList.style.display === "none" ? "block" : "none";
    });

    msg.appendChild(toggleButton);
    msg.appendChild(sourcesList);
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

