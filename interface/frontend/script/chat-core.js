const infoSVG = `<svg id="Bold" viewBox="0 0 24 24" width="32" height="32"><path fill = "currentcolor" d="M19.061,7.854a1.5,1.5,0,0,0-2.122,0l-4.586,4.585a.5.5,0,0,1-.707,0L7.061,7.854A1.5,1.5,0,0,0,4.939,9.975l4.586,4.586a3.5,3.5,0,0,0,4.95,0l4.586-4.586A1.5,1.5,0,0,0,19.061,7.854Z"/></svg>`
const copySVG = `<svg  id="Layer_1" height="32" viewBox="0 0 24 24" width="32" data-name="Layer 1"><path fill = "currentcolor" d="m13.5 19h-8a5.506 5.506 0 0 1 -5.5-5.5v-8a5.506 5.506 0 0 1 5.5-5.5h8a5.506 5.506 0 0 1 5.5 5.5v8a5.506 5.506 0 0 1 -5.5 5.5zm-8-16a2.5 2.5 0 0 0 -2.5 2.5v8a2.5 2.5 0 0 0 2.5 2.5h8a2.5 2.5 0 0 0 2.5-2.5v-8a2.5 2.5 0 0 0 -2.5-2.5zm18.5 15.5v-11.5a1.5 1.5 0 0 0 -3 0v11.5a2.5 2.5 0 0 1 -2.5 2.5h-11.5a1.5 1.5 0 0 0 0 3h11.5a5.506 5.506 0 0 0 5.5-5.5z"/></svg>`
const checkSVG = `<svg version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 507.506 507.506" style="enable-background:new 0 0 507.506 507.506;" xml:space="preserve" width="32" height="32"><g><path fill = "currentcolor" d="M163.865,436.934c-14.406,0.006-28.222-5.72-38.4-15.915L9.369,304.966c-12.492-12.496-12.492-32.752,0-45.248l0,0   c12.496-12.492,32.752-12.492,45.248,0l109.248,109.248L452.889,79.942c12.496-12.492,32.752-12.492,45.248,0l0,0   c12.492,12.496,12.492,32.752,0,45.248L202.265,421.019C192.087,431.214,178.271,436.94,163.865,436.934z"/></g></svg>`
const speakSVG = `<svg viewBox="0 0 24 24"><path fill= "currentcolor" d="M24,17c0,2.479-.965,4.809-2.718,6.561-.293,.293-.677,.439-1.061,.439s-.768-.146-1.061-.439c-.586-.586-.586-1.536,0-2.121,1.186-1.186,1.839-2.763,1.839-4.439s-.653-3.254-1.839-4.439c-.586-.585-.586-1.535,0-2.121s1.535-.586,2.121,0c1.753,1.752,2.718,4.082,2.718,6.561Zm-6.268-3.061c-.586-.586-1.535-.586-2.121,0s-.586,1.535,0,2.121c.251,.251,.389,.585,.389,.939s-.138,.688-.389,.939c-.586,.586-.586,1.535,0,2.121,.293,.293,.677,.439,1.061,.439s.768-.146,1.061-.439c1.688-1.688,1.688-4.434,0-6.121ZM1.416,.018C.589,.064-.044,.772,.002,1.6c.046,.828,.754,1.446,1.582,1.414,2.697-.155,5.273,1.054,6.932,3.266,.965,1.193,2.653,4.251,3.268,5.721h-.39c-.756,0-1.394,.562-1.488,1.312l-.371,2.938c-.126,.998-.979,1.75-1.984,1.75h-1.05c-.829,0-1.5,.672-1.5,1.5v1c0,.275-.224,.5-.5,.5H1.5c-.829,0-1.5,.672-1.5,1.5s.671,1.5,1.5,1.5h3c1.766,0,3.231-1.315,3.467-3.018,2.329-.194,4.247-2.002,4.544-4.356l.206-1.631c1.484-.087,2.283-1.303,2.283-2.449,0-1.662-3.135-6.896-4.118-8.109C8.655,1.463,5.124-.189,1.416,.018Z"/></svg>`
const xSVG = `<svg   viewBox="0 0 24 24" width="32" height="32"><path fill = "currentcolor" d="M13.93,12L21.666,2.443c.521-.644,.422-1.588-.223-2.109-.645-.522-1.588-.421-2.109,.223l-7.334,9.06L4.666,.557c-1.241-1.519-3.56,.357-2.332,1.887l7.736,9.557L2.334,21.557c-.521,.644-.422,1.588,.223,2.109,.64,.519,1.586,.424,2.109-.223l7.334-9.06,7.334,9.06c.524,.647,1.47,.742,2.109,.223,.645-.521,.744-1.466,.223-2.109l-7.736-9.557Z"/></svg>`

const form = document.getElementById("chat-form");
const chatBox = document.getElementById("chat-box");
const chatWidget = document.getElementById("chat-widget");
const chatToggle = document.getElementById("chat-toggle");
const input = document.getElementById("user-input");

let can_reply = true;
let speaking = false;


function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

function speakText(text) {
  if (!window.speechSynthesis) {
    console.warn("Seu navegador não suporta síntese de voz.");
    return;
  }

  stopSpeaking(); // Cancela qualquer fala anterior
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-PT"; // ou "pt-BR", conforme preferires

  speaking = true;
  window.speechSynthesis.speak(utterance);

  utterance.onend = () => {
    speaking = false;
  };

  utterance.onerror = () => {
    speaking = false;
  };
}
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

    const speakBtn = document.createElement("button");
    speakBtn.innerHTML = speakSVG;
    speakBtn.classList.add("speak-btn");
    
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

      speakBtn.addEventListener("click", ()=>{
        if (!speaking) {
        speakText(text); // Fala o que está visível
        speakBtn.innerHTML = xSVG;
        } else {
          stopSpeaking();
          speaking = false;
          speakBtn.innerHTML = speakSVG;
        }
      });

      const buttonsWrapper = document.createElement("div");
      buttonsWrapper.classList.add("buttons-wrapper");

      // Adicionar os botões ao container
      buttonsWrapper.appendChild(toggleBtn);
      buttonsWrapper.appendChild(speakBtn)
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