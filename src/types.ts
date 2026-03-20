// Contrato para o Jogo da Memória
export interface PartidaMemoria {
  id: string;
  nomeJogador: string;
  tempoSegundos: number;
  tentativas: number;
  dataConclusao: string;
}

// Contrato para o Formulário de Contato
export interface MensagemContato {
  nome: string;
  email: string;
  mensagem: string;
}