import { useTicketElementsContext } from "@src/web/contexts/TicketElementsContext";
import * as style from "@styles/components/MainArea/Tables";

export const AllTickets = () => {

  const {
    ticketsDatas
  } = useTicketElementsContext();
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
            ticketsDatas.map((ticket: any, index: number) => {
              const tdElements = [];
              const ticketLength = ticket.length;
              for (let i = 0; i < ticketLength; i++) {
                switch (i) {
                  case 1:
                    tdElements.push(
                      <td
                        key={i}
                        css={style.TableCell_Title}
                      >
                        {ticket[i][1]}
                      </td>
                    );
                    break;
                  case 3:
                  case 4:
                    tdElements.push(
                      <td
                        key={i}
                        css={style.TableCell}
                      >
                        {
                          ticket[i][1]
                            .toString()
                            .replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1/$2/$3 $4:$5')}
                      </td>
                    );
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
              return (
                <tr
                  key={index}
                  css={style.TableRow}
                >
                  {tdElements}
                </tr>
              );
            })
            // ticketsDatas.forEach((ticket: any, index: number) => {
            //   const tdElements = [];
            //   for (let i = 0; i === 12; i++) {
            //     console.log(i);
            //     tdElements.push(
            //       <td
            //         key={i}
            //         css={style.TableCell}
            //       >
            //         {ticket[i][1]}
            //       </td>
            //     );
            //   }
            //   tdElements.pop();
            //   return (
            //     <tr
            //       key={index}
            //       css={style.TableRow}
            //     >
            //       {tdElements}
            //     </tr>
            //   );
            // })
          }
        </tbody>
      </table>
    </div>
  );
}
