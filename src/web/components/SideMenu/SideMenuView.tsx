import * as style from "@styles/components/SideMenu/SideMenu"
import { useState } from "react";

import { useSideMenuContext } from "@src/web/contexts/SideMenuContext";
import { SectionsView } from "./Sections/SectionsView";

export const SidemenuView = () => {
  const {
    sidemenuItems,
  } = useSideMenuContext();
  return (
    <div
      className="side-menu"
      css={style.Container}
    >
      <SectionsView
        sidemenuItems={sidemenuItems[0]}
      >
        <div
          className="side-menu__section"
          css={style.Section}
        >
          <span
            className="side-menu__section__text"
            css={style.SectionText}
          >
            {sidemenuItems[0][0]}</span>
        </div>
      </SectionsView>
      <SectionsView
        sidemenuItems={sidemenuItems[1]}
      >
        <div
          className="side-menu__section"
          css={style.Section}
        >
          <span
            className="side-menu__section__text"
            css={style.SectionText}
          >
            {sidemenuItems[1][0]}</span>
        </div>
      </SectionsView>
    </div>
  );
};