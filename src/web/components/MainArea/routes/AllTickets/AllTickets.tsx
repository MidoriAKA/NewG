import * as style from "@styles/components/MainArea/Tables";

export const AllTickets = (ticketsDatas: any) => {
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
            <th>Requerente</th>
            <th>Atribuído p/ - Técnico</th>
            <th>Atribuído p/ - Grupo técnico</th>
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
                // tdElements.push(
                //   <td
                //     key={i}
                //     css={style.TableCell}
                //   >
                //     {ticket[i][1]}
                //   </td>
                // );
                switch (i) {
                  case 3:
                    tdElements.push(
                      <td
                        key={i}
                        css={style.TableCell}
                      >
                        {ticket[i][1].toLocaleString()}
                      </td>
                    )
                    break;
                  case 4:
                    tdElements.push(
                      <td
                        key={i}
                        css={style.TableCell}
                      >
                        {ticket[i][1].toLocaleString()}
                      </td>
                    )
                    break;
                  default:
                    tdElements.push(
                      <td
                        key={i}
                        css={style.TableCell}
                      >
                        {ticket[i][1]}
                      </td>
                    );
                    break;
                }
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
