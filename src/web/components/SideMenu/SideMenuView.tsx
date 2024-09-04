import * as style from "@styles/components/SideMenu/SideMenu"
import { useState } from "react";

export const SidemenuView = () => {

  type Active =
    | "dashboard"
    | "assets"
    | "users"
    | "locations"
    | "networks"
    | "plugins"
    | "settings";
  const [isActive, setActive] = useState<Active>("dashboard");

  const sidemenuItems = [
    {
      icon: "📊",
      text: "Dashboard",
      active: "dashboard",
    },
    {
      icon: "📦",
      text: "Assets",
      active: "assets",
    },
    {
      icon: "👥",
      text: "Users",
      active: "users",
    },
    {
      icon: "📍",
      text: "Locations",
      active: "locations",
    },
    {
      icon: "🌐",
      text: "Networks",
      active: "networks",
    },
    {
      icon: "🔌",
      text: "Plugins",
      active: "plugins",
    },
    {
      icon: "⚙️",
      text: "Settings",
      active: "settings",
    },
  ];

  return (
    <>
      <div
        className="side-menu"
        css={style.Container}
      >
        {sidemenuItems.map((item, index) => (
          <button
            key={index}
            className="side-menu__item"
            css={isActive === item.active ? style.ItemWrapperActive : style.ItemWrapper}
            data-is-active={isActive === item.active ? "true" : "false"}
            onClick={() => setActive(item.active as Active)}
          >
            <div
              className="side-menu__item__icon"
              css={style.ItemIcon}
            >
              <span
                aria-label={item.active}
              >{item.icon}</span>
            </div>
            <span>{item.text}</span>
          </button>
        ))}
      </div>
    </>
  );
};