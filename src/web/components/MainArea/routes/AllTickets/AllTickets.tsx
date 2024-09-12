import { useTicketElementsContext } from "@src/web/contexts/TicketElementsContext";
import * as style from "@styles/components/MainArea/Tables";

export const AllTickets = () => {

  const {
    ticketsDatas
  } = useTicketElementsContext();

  console.log(ticketsDatas.length);
  console.log(ticketsDatas[0]);

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
            // ticketsDatas.map((ticket: any, index: number) => {
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
            ticketsDatas.forEach((ticket: any, index: number) => {
              const tdElements = [];
              for (let i = 0; i === 12; i++) {
                console.log(i);
                tdElements.push(
                  <td
                    key={i}
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
