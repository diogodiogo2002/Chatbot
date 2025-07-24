const charCounter = document.getElementById("char-counter");
const swapBtn = document.getElementById("swap-btn");
const loadingOverlay = document.getElementById("loading-overlay");

const maxChars = 100; // Limite de caracteres

let ip = 8000;
let first_open = true;

// Evento de teclado para o input
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
    charCounter.textContent = maxChars;
  }
});

// Evento de input para ajuste de altura e contador de caracteres
input.addEventListener("input", () => {
    const lineHeight = parseInt(getComputedStyle(input).lineHeight);
    const minHeight = lineHeight;
    const maxHeight = lineHeight * 3;

    input.style.height = "auto";

    // Garante no mínimo 2 linhas e no máximo 3
    const newHeight = Math.min(Math.max(input.scrollHeight, minHeight), maxHeight);
    input.style.height = newHeight + "px";
    input.style.overflowY = newHeight >= maxHeight ? "auto" : "hidden";
    
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
  chatWidget.classList.toggle("visible");
  if (chatWidget.classList.contains("visible")) {
    input.focus();

    if (first_open) {
      setTimeout(() => {
        addMessage("Olá! Como posso ajudar?", "bot",);
      }, 300);
      first_open = false;
    }
  }
});



// Evento de submit do formulário
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const botaoQueSubmeteu = e.submitter; // <- aqui está o botão
  
  if (!can_reply) return;

  const userText = input.value.trim();
  if (!userText) return;

  addMessage(userText, "user", null);
  input.value = "";
  can_reply = false;

  try {
    const response = await fetch("http://127.0.0.1:"+ip+"/chat", {
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
    const quizData = data.quiz || [];
    addMessage(botReply, "bot", info_text);
    if (quizData.length > 0) {
    renderQuiz(quizData);
}
    if (sugestions.length > 0 &&  quizData.length === 0) {
      const suggestionsBox = document.createElement("div");
      suggestionsBox.classList.add("suggestions-box");

      sugestions.forEach((suggestion) => {
        const suggestionBtn = document.createElement("button");
        suggestionBtn.textContent = suggestion;
        suggestionBtn.classList.add("suggestion-btn");

        suggestionBtn.addEventListener("click", () => {
          input.value = suggestion;
          form.requestSubmit();
          charCounter.textContent = maxChars;
        });

        suggestionsBox.appendChild(suggestionBtn);
      });

      chatBox.appendChild(suggestionsBox);    
    }
  
  } catch (error) {
    addMessage("Erro de ligação ao servidor 😢" + error, "bot");
  }
  can_reply = true;
});


async function alternarModo() {
  // Ativa overlay no início
  loadingOverlay.style.display = "flex";

  const novoModo = ip === 8000 ? "quiz_main" : "main";
  const novaPorta = ip === 8000 ? 8001 : 8000;

  try {
    const resposta = await fetch("http://127.0.0.1:9000/modo", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: novoModo
    });

    const dados = await resposta.json();
    console.log("🔁 Modo alterado:", dados);

    setTimeout(() => {

      ip = novaPorta; // atualiza o IP após a troca

    }, 1500); // pequena espera para transição visual

  } catch (erro) {
    console.error("❌ Erro ao alternar modo:", erro);
    loadingOverlay.style.display = "none"; // só desativa overlay se falhar
  }
}

let estadoInterval = null; // ← variável global para guardar o intervalo

swapBtn.addEventListener("click", async (e) => {
  e.preventDefault();

   if (estadoInterval !== null) {
    clearInterval(estadoInterval);
    estadoInterval = null;
  }
  await alternarModo();

  estadoInterval = setInterval(async () => {
    const pronto = await verificarEstado();
    console.log(pronto);
    if (pronto) {
      loadingOverlay.style.display = "none";
      clearInterval(estadoInterval);
      estadoInterval = null; // limpa referência
      console.log("✅ Servidor pronto");
    
      switch_cor();
    }
  }, 500);

  
});

async function verificarEstado() {
  try {
    const resp = await fetch("http://127.0.0.1:9000/estado");
    const dados = await resp.json();
    return dados.pronto;
  } catch (err) {
    console.error("❌ Erro ao verificar estado:", err);
    return false;
  }
}

function switch_cor(){
  const root = document.documentElement;    

      if (novaPorta === 8000) {
        root.style.setProperty("--primary-color", "#0b1789");
        root.style.setProperty("--bot-bubble", "#0b1789");
        root.style.setProperty("--primary-light", "#1a2bb8");
      } else {
        root.style.setProperty("--primary-color", "#247937ff");
        root.style.setProperty("--bot-bubble", "#247937ff");
        root.style.setProperty("--primary-light", "#44af5bff");
      }

      // Atualiza ip atual
      ip = novaPorta;

    }, 1500); // espera 1.5 segundos

  } catch (erro) {
    console.error("❌ Erro ao alternar modo:", erro);
    loadingOverlay.style.display = "none";
  }
}