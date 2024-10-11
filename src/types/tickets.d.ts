export interface IRawTicket {
  "ID": string,
  "Título": string,
  "Status": string,
  "Última atualização": string,
  "Data de abertura": string,
  "Prioridade": string,
  "Requerente - Requerente": string,
  "Atribuído para - Técnico": string | null,
  "Atribuído para - Grupo técnico": string | null,
  "Categoria": string | null,
  "Aprovação - Status de aprovação": string | null,
  "Tempo para solução + Progresso": string | null,
  "": null
}

export interface ITicket {
  ID: string | number,
  title: string,
  status: string,
  lastUpdate: string | number,
  openDate: string | number,
  priority: string,
  requester: string,
  assignedToPerson: string | null,
  assignedToGroup: string | null,
  category: string | null,
  approvalStatus: string | null,
  timeToSolution: string | null
}