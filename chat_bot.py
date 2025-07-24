import webbrowser
import os
import subprocess




# Caminho da pasta onde queres executar o comando
caminho_da_pasta = "interface/backend"

comando = "uvicorn main:app --reload"

# Comando que queres executar (por exemplo, listar os ficheiros)
subprocess.Popen(comando, cwd=caminho_da_pasta, shell=True)

url = "127.0.0.1:8000"

# Caminho absoluto para o ficheiro index.html
#caminho_html = os.path.abspath("interface/frontend/index.html")

# Abrir no navegador
#webbrowser.open(f"file://{caminho_html}")