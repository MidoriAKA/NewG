interface ISideMenuContext {
  currentActive: Active;
  sidemenuItems: SideMenuItems[];
  handleActive: (active: Active) => void;
}