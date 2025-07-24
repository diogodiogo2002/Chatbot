from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

import subprocess
import os
import threading
import uvicorn
import signal
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Para dev local, tudo liberado
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Caminho base
base_path = os.path.join("interface", "backend")

# Estado atual
modo_ativo = "main"
processo_atual = None
porta_modo = {"main": 8000, "quiz_main": 8001}  # Portas diferentes para cada modo

def iniciar_modo(modo):
    global processo_atual, modo_ativo

    if processo_atual and modo == modo_ativo:
        print(f"🔁 Modo {modo} já está ativo.")
        return

    if processo_atual:
        print(f"🛑 A terminar processo anterior ({modo_ativo})...")
        processo_atual.terminate()
        processo_atual.wait()
        time.sleep(1)

    if modo in porta_modo:
        comando = f"uvicorn {modo}:app --port {porta_modo[modo]}"
    else:
        print("❌ Modo inválido")
        return

    print(f"✅ A iniciar modo: {modo} na porta {porta_modo[modo]}")
    
    # DEBUG EXTRA - mostra erros
    processo_atual = subprocess.Popen(
        comando,
        cwd=base_path,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # Espera 0.5s e imprime se houver erro
    time.sleep(0.5)
    if processo_atual.poll() is not None:  # já terminou -> erro
        stdout, stderr = processo_atual.communicate()
        print("STDOUT:\n", stdout)
        print("STDERR:\n", stderr)

    modo_ativo = modo


@app.on_event("startup")
def ao_arrancar():
    # Inicia com o modo por defeito
    iniciar_modo(modo_ativo)

@app.post("/modo")
async def mudar_modo(request: Request):
    corpo = (await request.body()).decode().strip()
    print(f"📨 Novo modo recebido:", repr(corpo))  # 👈 MOSTRA EXACTAMENTE O QUE CHEGA
    iniciar_modo(corpo)
    return {"mensagem": f"Modo alterado para {corpo}", "porta": porta_modo.get(corpo, None)}


@app.get("/modo")
def get_modo():
    return {"modo_ativo": modo_ativo, "porta": porta_modo[modo_ativo]}

def iniciar_api_controladora():
    uvicorn.run(app, host="127.0.0.1", port=9000)

if __name__ == "__main__":
    thread_api = threading.Thread(target=iniciar_api_controladora)
    thread_api.start()