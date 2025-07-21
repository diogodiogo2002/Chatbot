const infoSVG = `<svg id="Bold" viewBox="0 0 24 24" width="32" height="32"><path fill = "currentcolor" d="M19.061,7.854a1.5,1.5,0,0,0-2.122,0l-4.586,4.585a.5.5,0,0,1-.707,0L7.061,7.854A1.5,1.5,0,0,0,4.939,9.975l4.586,4.586a3.5,3.5,0,0,0,4.95,0l4.586-4.586A1.5,1.5,0,0,0,19.061,7.854Z"/></svg>`
const copySVG = `<svg  id="Layer_1" height="32" viewBox="0 0 24 24" width="32" data-name="Layer 1"><path fill = "currentcolor" d="m13.5 19h-8a5.506 5.506 0 0 1 -5.5-5.5v-8a5.506 5.506 0 0 1 5.5-5.5h8a5.506 5.506 0 0 1 5.5 5.5v8a5.506 5.506 0 0 1 -5.5 5.5zm-8-16a2.5 2.5 0 0 0 -2.5 2.5v8a2.5 2.5 0 0 0 2.5 2.5h8a2.5 2.5 0 0 0 2.5-2.5v-8a2.5 2.5 0 0 0 -2.5-2.5zm18.5 15.5v-11.5a1.5 1.5 0 0 0 -3 0v11.5a2.5 2.5 0 0 1 -2.5 2.5h-11.5a1.5 1.5 0 0 0 0 3h11.5a5.506 5.506 0 0 0 5.5-5.5z"/></svg>`
const checkSVG = `<svg version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 507.506 507.506" style="enable-background:new 0 0 507.506 507.506;" xml:space="preserve" width="32" height="32"><g><path fill = "currentcolor" d="M163.865,436.934c-14.406,0.006-28.222-5.72-38.4-15.915L9.369,304.966c-12.492-12.496-12.492-32.752,0-45.248l0,0   c12.496-12.492,32.752-12.492,45.248,0l109.248,109.248L452.889,79.942c12.496-12.492,32.752-12.492,45.248,0l0,0   c12.492,12.496,12.492,32.752,0,45.248L202.265,421.019C192.087,431.214,178.271,436.94,163.865,436.934z"/></g></svg>`

const form = document.getElementById("chat-form");
const chatBox = document.getElementById("chat-box");
const chatWidget = document.getElementById("chat-widget");
const chatToggle = document.getElementById("chat-toggle");
const input = document.getElementById("user-input");

let can_reply = true;


function addMessage(text, sender, info_text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  if (sender === "bot" && info_text != null) {
    const contentWrapper = document.createElement("div");
    contentWrapper.classList.add("bot-content");

    const msgText = document.createElement("div");
    msgText.innerText = text;
    msgText.classList.add("bot-text");

    const infoBox = document.createElement("div");
    infoBox.textContent = info_text;
    infoBox.classList.add("info-box");

    const toggleBtn = document.createElement("button");
    toggleBtn.innerHTML = infoSVG;
    toggleBtn.classList.add("info-toggle-outside");

    
    const copyBtn = document.createElement("button");
    copyBtn.innerHTML = copySVG;
    copyBtn.classList.add("copy-btn");
    
    copy_info = text; 

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(copy_info).then(() => {
        copyBtn.innerHTML = checkSVG;
        setTimeout(() => {
          copyBtn.innerHTML = copySVG;
        }, 1000);
      }).catch(err => {
        console.error("Erro ao copiar para a área de transferência: ", err);
      });
    });


    toggleBtn.addEventListener("click", () => {
      const showingInfo = infoBox.classList.contains("visible");

      const svg = toggleBtn.querySelector("svg");
      svg.classList.toggle("rotated"); // alterna a rotação

      if (showingInfo) {
        // Ocultar info e mostrar texto normal
        infoBox.classList.remove("visible");
        msgText.classList.remove("hidden");
        copy_info = text;
      }else {
        // Mostrar info e esconder texto normal
        msgText.classList.add("hidden");
        infoBox.classList.add("visible");
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
  }else {
    msg.textContent = text;
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}