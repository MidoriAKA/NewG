import * as style from "@styles/components/SideMenu/SideMenu"
import { useState } from "react";

import sidemenuItems from "./sideMenuItems.json" assert { type: "json" };
import { useSideMenuContext } from "@src/web/contexts/SideMenuContext";

export const SidemenuView = () => {

  const {
    state,
    setState
  } = useSideMenuContext();

  const [isActive, setActive] = useState<Active>("allTickets");
  const handleActive = (active: Active) => {
    setActive(active);
    setState(active);
  };

  return (
    <>
      <div
        className="side-menu"
        css={style.Container}
      >
        <div
          className="side-menu__section"
          css={style.Section}
        >
          <span
            className="side-menu__section__text"
            css={style.SectionText}
          >
            Chamados</span>
        </div>
        {sidemenuItems.map((item, index) => (
          <button
            key={index}
            className="side-menu__item"
            css={isActive === item.active ? style.ItemWrapperActive : style.ItemWrapper}
            data-is-active={isActive === item.active ? "true" : "false"}
            onClick={() => handleActive(item.active as Active)}
          >
            <div
              className="side-menu__item__icon"
              css={style.ItemIcon}
            >
              <span
                aria-label={item.active}
              >{item.icon}</span>
            </div>
            <span
              className="side-menu__item__text"
              css={style.ItemText}
            >{item.text}</span>
          </button>
        ))}
        <div
          className="side-menu__section"
          css={style.Section}
        >
          <span
            className="side-menu__section__text"
            css={style.SectionText}
          >
            Pin</span>
        </div>
      </div>
    </>
  );
};