import { useTicketElementsContext } from "@src/web/contexts/TicketElementsContext";
import * as style from "@styles/components/MainArea/Tables";
import { tableHeaders } from "../config/tableHeaders";

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
            {tableHeaders.map((header: string, index: number) => {
              return (
                <th
                  key={index}
                >
                  {header}
                </th>
              );
            })}
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
          }
        </tbody>
      </table>
    </div>
  );
}
