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
        ("Olá! Como posso ajudar?", "bot");
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
    const sugestions = data.related_suggestions || "Sem sugestões disponíveis.";
    addMessage(botReply, "bot", info_text);
    
    if (sugestions.length > 0) {
      const suggestionsBox = document.createElement("div");
      suggestionsBox.classList.add("suggestions-box");

      sugestions.forEach((suggestion) => {
        const suggestionBtn = document.createElement("button");
        suggestionBtn.textContent = suggestion;
        suggestionBtn.classList.add("suggestion-btn");

        suggestionBtn.addEventListener("click", () => {
          input.value = suggestion;
          input.dispatchEvent(new Event("input")); // Atualiza o contador de caracteres
          form.requestSubmit();
        });

        suggestionsBox.appendChild(suggestionBtn);
      });

      chatBox.appendChild(suggestionsBox);    
    }
  
  } catch (error) {
    addMessage("Erro de ligação ao servidor 😢", "bot");
  }
  can_reply = true;
});

suggestionBtn.addEventListener("mousemove", (e) => {
  const rect = suggestionBtn.getBoundingClientRect();
  const x = e.clientX - rect.left; // posição X do rato dentro do botão
  const y = e.clientY - rect.top;  // posição Y do rato dentro do botão
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = -(y - centerY) / 10; // ajusta a sensibilidade
  const rotateY = (x - centerX) / 10;

  suggestionBtn.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

suggestionBtn.addEventListener("mouseleave", () => {
  suggestionBtn.style.transform = "rotateX(0) rotateY(0)";
});
