from langchain_ollama import OllamaEmbeddings  # Importação específica para Ollama
from langchain_ollama import OllamaLLM  # Novo nome da classe para LLM

class LocalAIClient:
    def __init__(self, model_name = "mistral"):
        self.mode_name = model_name
    
    def get_embeddings(self):
        return OllamaEmbeddings(model=self.mode_name)
    
    def get_llm(self, temperature = 0.7):
        return OllamaLLM(model = self.mode_name, temperature=temperature)
    
if __name__ == "__main__":
    try:
        ai_client = LocalAIClient()  
        embeding = ai_client.get_embeddings()
        llm = ai_client.get_llm()
        print("✅ LocalAIClient configurado com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao configurar LocalAIClient: {e}")