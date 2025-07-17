const charCounter = document.getElementById("char-counter");

const maxChars = 100; // Limite de caracteres



// Evento de teclado para o input
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
    charCounter.textContent = maxChars;
  }
});

// Evento de input para ajuste de altura
input.addEventListener("input", () => {
    input.style.height = "auto";
    const maxHeight = parseInt(getComputedStyle(input).lineHeight) * 3;
    input.style.overflowY = input.scrollHeight > maxHeight ? "auto" : "hidden";
    input.style.height = Math.min(input.scrollHeight, maxHeight) + "px";

    const remainingChars = (input.value.length - maxChars) * -1  ;
    charCounter.textContent = remainingChars;
    
    if (remainingChars <= 20 && remainingChars > 5) {
      charCounter.classList.add('warning');
    }else if (remainingChars <= 5) {
      charCounter.classList.add('danger');
    }else {
      charCounter.className = '';
    }

});

// Evento de toggle do chat
chatToggle.addEventListener("click", () => {
  chatWidget.classList.toggle("hidden");
  if (!chatWidget.classList.contains("hidden")) {
    input.focus();

    if (first_open) {
      setTimeout(() => {
        addMessage("Olá! Como posso ajudar?", "bot");
      }, 300);
      first_open = false;
    }
  }
});

// Evento de submit do formulário
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!can_reply) return;

  const userText = input.value.trim();
  if (!userText) return;

  addMessage(userText, "user", info_text = null);
  input.value = "";
  can_reply = false;

  try {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: userText}),
    });

    const data = await response.json();
    const botReply = data.reply || "Erro ao responder 😵";
    const info_text = data.info || "Nenhuma informação adicional disponível.";

    addMessage(botReply, "bot", info_text);
    
  } catch (error) {
    addMessage("Erro de ligação ao servidor 😢", "bot");
  }
  can_reply = true;
});