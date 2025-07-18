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
    msgText.innerText = text;
    msgText.classList.add("bot-text");

    const infoBox = document.createElement("div");
    infoBox.textContent = info_text;
    infoBox.classList.add("info-box");

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "ℹ️";
    toggleBtn.classList.add("info-toggle-outside");

    
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "📋";
    copyBtn.classList.add("copy-btn");
    
    copy_info = text; 

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(copy_info).then(() => {
        copyBtn.textContent = "✅";
        setTimeout(() => {
          copyBtn.textContent = "📋";
        }, 2000);
      }).catch(err => {
        console.error("Erro ao copiar para a área de transferência: ", err);
      });
    });


    toggleBtn.addEventListener("click", () => {
      const showingInfo = infoBox.classList.contains("visible");

      if (showingInfo) {
        // Ocultar info e mostrar texto normal
        infoBox.classList.remove("visible");
        msgText.classList.remove("hidden");
        toggleBtn.textContent = "ℹ️";
        copy_info = text;
      } else {
        // Mostrar info e esconder texto normal
        msgText.classList.add("hidden");
        infoBox.classList.add("visible");
        toggleBtn.textContent = "💬";
        copy_info = info_text;
      }
    });

  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.classList.add("buttons-wrapper");

// Adicionar os botões ao container
buttonsWrapper.appendChild(toggleBtn);
buttonsWrapper.appendChild(copyBtn);
  

  contentWrapper.appendChild(msgText);

  if (info_text != null) {
    contentWrapper.appendChild(infoBox);
    contentWrapper.appendChild(buttonsWrapper);
      
      msg.appendChild(contentWrapper);
    }
  } else {
    msg.textContent = text;
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}