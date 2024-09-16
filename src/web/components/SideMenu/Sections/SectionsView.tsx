import React, { Children, useState } from "react";

import { useSideMenuContext } from "@src/web/contexts/SideMenuContext";
import * as style from "@styles/components/SideMenu/SideMenu"

export const SectionsView: React.FC<TAppProps> | any = (props: TSectionsViewProps) => {

  const {
    currentActive,
    handleActive,
  } = useSideMenuContext();
  const sectionItems = props.sidemenuItems[1];

  return (
    <>
      <div
        className="side-menu"
        css={style.Container}
      >
        {props.children}
        {sectionItems.map((item: IMenuItem, index: number) => (
          <button
            key={`item__wrapper-${item.active}-${index}`}
            className="side-menu__item"
            css={item.isActive ? style.ItemWrapperActive : style.ItemWrapper}
            data-is-active={item.isActive ? "true" : "false"}
            onClick={() => handleActive(item.active as Active)}
          >
            <div
              key={`item__icon-${item.active}-${index}`}
              className="side-menu__item__icon"
              css={style.ItemIcon}
            >
              <span
                key={`item__icon-${item.active}-${index}`}
                aria-label={item.text}
              >{item.icon}</span>
            </div>
            <span
              key={`item__text-${item.active}-${index}`}
              className="side-menu__item__text"
              css={style.ItemText}
            >{item.text}</span>
          </button>
        ))}
      </div>
    </>
  );
};