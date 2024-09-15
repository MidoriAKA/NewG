import { createContext, useContext, useState } from 'react';
import importJson from "@components/SideMenu/sideMenuItems.json" assert { type: "json" };

const SideMenuContext = createContext({} as ISideMenuContext);
export const useSideMenuContext = () => {
  return useContext(SideMenuContext);
}

export const SideMenuContextProvider: React.FC<TAppProps> = ({ children }) => {
  const [currentActive, setActive] = useState("allTickets" as Active);
  const importedItems: SideMenuItems[] = JSON.parse(JSON.stringify(importJson));
  const [sidemenuItems, changeActive] = useState<SideMenuItems[]>(importedItems);
  const handleActive = (active: Active) => {
    sidemenuItems.map((section: SideMenuItems, index: number) => {
      const items: IMenuItem[] = section[1];
      items.map((item: IMenuItem, index: number) => {
        if (item.active === active) {
          item.isActive = true;
          setActive(active);
        } else {
          item.isActive = false;
        }
      });
    });
    changeActive(sidemenuItems);
  }




  return (
    <SideMenuContext.Provider
      value={{
        currentActive,
        sidemenuItems,
        handleActive
      }}>
      {children}
    </SideMenuContext.Provider>
  );
}
