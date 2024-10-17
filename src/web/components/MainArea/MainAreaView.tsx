import * as style from "@styles/components/MainArea/MainArea";

import { TicketsView } from "./TicketsView/TicketsView";
import { FilterView } from "./FilterView/FilterView";


export const MainAreaView = () => {

  return (
    <div
      className="main-area__root"
      css={style.Root}
    >
      <div
        css={style.Container}
      >
        <FilterView />
        <TicketsView />
      </div>
    </div>
  );
};
