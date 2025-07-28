const QuizSVG = `<svg viewBox="0 0 24 24" width="32" height="32"><path fill = "currentcolor" d="M12,19c-.829,0-1.5-.672-1.5-1.5,0-1.938,1.352-3.709,3.909-5.118,1.905-1.05,2.891-3.131,2.51-5.301-.352-2.003-1.997-3.648-4-4-1.445-.254-2.865,.092-4.001,.974-1.115,.867-1.816,2.164-1.922,3.559-.063,.825-.785,1.445-1.609,1.382-.826-.063-1.445-.783-1.382-1.609,.17-2.237,1.29-4.315,3.073-5.7C8.89,.278,11.149-.275,13.437,.126c3.224,.566,5.871,3.213,6.437,6.437,.597,3.399-1.018,6.794-4.017,8.447-1.476,.813-2.357,1.744-2.357,2.49,0,.828-.671,1.5-1.5,1.5Zm-1.5,3.5c0,.828,.672,1.5,1.5,1.5s1.5-.672,1.5-1.5-.672-1.5-1.5-1.5-1.5,.672-1.5,1.5Z"/></svg>`;
const ChatSVG = `<svg viewBox="0 0 24 24" width="32" height="32"><path fill = "currentcolor" d="M24,11.246A12.011,12.011,0,1,0,12.017,24H18.5A5.507,5.507,0,0,0,24,18.5V11.34ZM21,18.5A2.5,2.5,0,0,1,18.5,21H12.017a9.041,9.041,0,0,1-6.731-3.011,8.926,8.926,0,0,1-2.227-7.034,9.038,9.038,0,0,1,7.788-7.882A9.484,9.484,0,0,1,12.02,3a8.933,8.933,0,0,1,5.739,2.066A9.038,9.038,0,0,1,21,11.389Z"/><path fill = "currentcolor" d="M9.5,11h3a1.5,1.5,0,0,0,0-3h-3a1.5,1.5,0,0,0,0,3Z"/><path fill = "currentcolor" d="M16.5,13h-7a1.5,1.5,0,0,0,0,3h7a1.5,1.5,0,0,0,0-3Z"/></svg>`;

const charCounter = document.getElementById("char-counter");
const swapBtn = document.getElementById("swap-btn");
const loadingOverlay = document.getElementById("loading-overlay");

const maxChars = 100; // Limite de caracteres

let ip = 8000;
let first_open = true;

swapBtn.innerHTML = ChatSVG;

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
    chatTitle.innerText = "Modo Principal ativado";
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

  let verificandoEstado = false;

  estadoInterval = setInterval(async () => {
    
    if (verificandoEstado) return;
    verificandoEstado = true;
    
    const pronto = await verificarEstado();
    console.log(pronto);
    
    if (pronto) {
      clearInterval(estadoInterval);
      estadoInterval = null;
      verificandoEstado = false;
      
      loadingOverlay.style.display = "none";
      console.log("✅ Servidor pronto");
      switch_cor();
      return;
    }
    
    verificandoEstado = false;
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

  if (getComputedStyle(root).getPropertyValue("--primary-color").trim() == "#247937ff") {
    root.style.setProperty("--primary-color", "#0b1789");
    root.style.setProperty("--bot-bubble", "#0b1789");
    root.style.setProperty("--primary-light", "#1a2bb8");
    chatTitle.innerHTML = "Modo Principal ativado";
    swapBtn.innerHTML = ChatSVG;
  } else {
    root.style.setProperty("--primary-color", "#247937ff");
    root.style.setProperty("--bot-bubble", "#247937ff");
    root.style.setProperty("--primary-light", "#44af5bff");
    chatTitle.innerHTML = "Modo Quiz ativado";
    swapBtn.innerHTML = QuizSVG;
  }
}