import * as style from "@styles/components/MainArea/Tables";

export const AllTickets = (ticketsDatas: any) => {
  console.table(ticketsDatas);
  return (
    <div
      className="all-tickets__container"
      css={style.Container}
    >
      <table
        css={style.Table}
      >
        <thead
          css={style.TableHeader}
        >
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Status</th>
            <th>Última atualização</th>
            <th>Data de abertura</th>
            <th>Prioridade</th>
            <th>Requerente - Requerente</th>
            <th>Atribuído para - Técnico</th>
            <th>Atribuído para - Grupo técnico</th>
            <th>Categoria</th>
            <th>Aprovação - Status de aprovação</th>
            <th>Tempo para solução + Progresso</th>
          </tr>
        </thead>
        <tbody>
          {
            ticketsDatas.ticketsDatas.map((ticket: any, index: number) => {
              const tdElements = [];
              for (let i = 0; i < ticket.length; i++) {
                tdElements.push(
                  <td
                    css={style.TableCell}
                  >
                    {ticket[i][1]}
                  </td>
                );
              }
              tdElements.pop();
              return (
                <tr
                  key={index}
                  css={style.TableRow}
                >
                  {tdElements}
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
}
