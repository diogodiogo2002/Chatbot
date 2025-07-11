from importlib import reload

import arquivo_ai
import rag_system

from arquivo_ai import LocalAIClient
from rag_system import RAGSystem



def reload_file(name):
    try:
        reload(name)
        print(f"✅ {name}.py recarregado com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao recarregar RAGSystem: {e}")



if __name__ == "__main__":
    
    keys = ["exit", "rag", "ask", "help", "reload"]
    first_rag = False
    
    while True:
        resp = str(input("Console: ")).lower().split(" ")

        if resp[0] == keys[0]: #EXIT
            print("👋 Encerrando o programa...")
            break
        
        elif resp[0] == keys[1]:  #RAG
            try:
                rag = RAGSystem("info")
                first_rag = True
            except Exception as e:
                print(f"❌ Erro ao processar: {e}")
                first_rag = False
        
        elif resp[0] == keys[2]:   #ASK
            if  first_rag == True:
                try:
                    question = str(input("Pergunta: "))
                    resposta = rag.ask(question)
                    print("Resposta:", resposta["answer"])
                    print("Fontes:", resposta["sources"])
                except Exception as e:
                    print(f"❌ Erro ao processar pergunta: {e}")
            else:
                print("❌ RAG ainda não foi configurado. Use o comando 'rag' para configurar.")           
        
        elif resp[0] == keys[3]:   #HELP
            for key in keys:
                print(f"- {key}")

        elif resp[0] == keys[4]:

            if resp[1] == "rag":
                reload_file(rag_system)
                first_rag = False
            elif resp[1] == "ai":
                reload_file(arquivo_ai)
            elif resp[1] == "all":
                reload_file(rag_system)
                reload_file(arquivo_ai)
                first_rag = False
            else:
                print("Pecisas de defenir o que deseja recarregar.")


        
        else:
            print("Comando desconhecido.")
