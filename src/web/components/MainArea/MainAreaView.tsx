import * as style from "@styles/components/MainArea/MainArea";

import { useSideMenuContext } from "@src/web/contexts/SideMenuContext";

import { AllTickets, NotAssigned, ClosedTicket } from "./routes/index";
import { useTicketElementsContext } from "@src/web/contexts/TicketElementsContext";
import { IScrappedGlpiDatas } from "@src/types/mainWindowPreload";
import { useEffect, useState } from "react";

export const MainAreaView = () => {
  const {
    state
  } = useSideMenuContext();

  const [testData, setTestData] = useState([] as any);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetching data");
        const data = await window.scrappedGlpiDatas.getData();
        setTestData(data);
        console.log("data fetched" + data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  console.dir("testData: " + testData);


  return (
    <div
      css={style.Root}
    >
      {
        state === "allTickets"
          ? <div
            css={style.Container}
          >
            <AllTickets
              testData={testData}
            />
          </div>

          : state === "notAssigned"
            ? <div
              css={style.Container}
            >
              <NotAssigned
              />
            </div>

            : state === "closed"
              ? <div
                css={style.Container}
              >
                <ClosedTicket
                />
              </div>

              : null // ここには来ない
      }
    </div>
  );
};
