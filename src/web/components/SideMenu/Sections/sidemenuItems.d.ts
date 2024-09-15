interface IMenuItem {
  icon: string;
  text: string;
  active: string;
  isActive: boolean;
}

type SideMenuItems = [string, IMenuItem[]];

type TSectionsViewProps = {
  sidemenuItems: SideMenuItems;
  children: React.ReactNode;
};