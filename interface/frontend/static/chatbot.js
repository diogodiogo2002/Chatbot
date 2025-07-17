(function () {
  const URL_DO_BACKEND = "http://127.0.0.1:8000/chat";

  // Criação dos elementos principais
  const widgetBtn = document.createElement("div");
  widgetBtn.id = "chat-toggle-widget";
  widgetBtn.textContent = "💬";
  widgetBtn.style = `
    position: fixed; bottom: 20px; right: 20px;
    background: #0078d4; color: white;
    width: 50px; height: 50px;
    border-radius: 50%; display: flex;
    align-items: center; justify-content: center;
    cursor: pointer; z-index: 9999;
    font-size: 24px;
  `;

  const chatContainer = document.createElement("div");
  chatContainer.id = "chat-widget";
  chatContainer.style = `
    position: fixed; bottom: 80px; right: 20px;
    width: 300px; max-height: 400px;
    background: white; border: 1px solid #ccc;
    border-radius: 10px; overflow: hidden;
    display: none; flex-direction: column;
    z-index: 9999; box-shadow: 0 0 10px rgba(0,0,0,0.2);
    font-family: sans-serif;
  `;

  const chatBox = document.createElement("div");
  chatBox.id = "chat-box";
  chatBox.style = `
    flex: 1; padding: 10px; overflow-y: auto;
    background: #f9f9f9;
  `;

  const form = document.createElement("form");
  form.id = "chat-form";
  form.style = `
    display: flex; border-top: 1px solid #ccc;
  `;

  const input = document.createElement("input");
  input.id = "user-input";
  input.type = "text";
  input.placeholder = "Escreve aqui...";
  input.style = `
    flex: 1; padding: 10px; border: none; outline: none;
  `;

  const sendBtn = document.createElement("button");
  sendBtn.type = "submit";
  sendBtn.textContent = "➤";
  sendBtn.style = `
    padding: 10px 15px; background: #0078d4;
    color: white; border: none; cursor: pointer;
  `;

  form.appendChild(input);
  form.appendChild(sendBtn);
  chatContainer.appendChild(chatBox);
  chatContainer.appendChild(form);
  document.body.appendChild(widgetBtn);
  document.body.appendChild(chatContainer);

  // Estado
  let can_reply = true;
  let first_open = true;

  // Abrir/fechar chat
  widgetBtn.addEventListener("click", () => {
    const isHidden = chatContainer.style.display === "none";
    chatContainer.style.display = isHidden ? "flex" : "none";
    if (isHidden && first_open) {
      setTimeout(() => {
        addMessage("Olá! Como posso ajudar?", "bot");
      }, 300);
      first_open = false;
    }
    input.focus();
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
      const response = await fetch(URL_DO_BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText }),
      });

      const data = await response.json();
      const botReply = data.reply || "Erro ao responder 😵";
      const sources = data.sources || [];
      addMessage(botReply, "bot", sources);
    } catch (err) {
      addMessage("Erro de ligação ao servidor 😢", "bot");
    }

    can_reply = true;
  });

  function addMessage(text, sender, sources = []) {
    const msg = document.createElement("div");
    msg.style = `
      margin: 8px 0;
      text-align: ${sender === "user" ? "right" : "left"};
    `;
    const bubble = document.createElement("div");
    bubble.textContent = text;
    bubble.style = `
      display: inline-block;
      background: ${sender === "user" ? "#0078d4" : "#e0e0e0"};
      color: ${sender === "user" ? "white" : "black"};
      padding: 8px 12px;
      border-radius: 12px;
      max-width: 80%;
    `;
    msg.appendChild(bubble);

    if (sender === "bot" && sources.length > 0) {
      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = "🔗 Fontes";
      toggleBtn.style = `
        display: block; margin-top: 5px;
        background: none; border: none; color: #0078d4;
        cursor: pointer; font-size: 12px;
      `;

      const sourceList = document.createElement("ul");
      sourceList.style = `
        display: none; margin-top: 4px; font-size: 11px;
        background: #f1f1f1; padding: 6px;
        border-radius: 5px;
      `;

      sources.forEach(src => {
        const li = document.createElement("li");
        li.textContent = src;
        sourceList.appendChild(li);
      });

      toggleBtn.addEventListener("click", () => {
        sourceList.style.display = sourceList.style.display === "none" ? "block" : "none";
      });

      msg.appendChild(toggleBtn);
      msg.appendChild(sourceList);
    }

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
})();
