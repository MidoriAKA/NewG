import * as style from "@styles/components/MainArea/MainArea";

import { useSideMenuContext } from "@src/web/contexts/SideMenuContext";
import { renderComponent } from "./routes/config/routesComponents";

export const MainAreaView = () => {
  const {
    currentActive
  } = useSideMenuContext();

  const renderContent = (current: Active) => {
    const RouteComponent = renderComponent[current];
    return RouteComponent ? <RouteComponent /> : <div>404</div>;;
  }

  return (
    <div
      className="main-area__root"
      css={style.Root}
    >
      <div
        css={style.Container}
      >
        {renderContent(currentActive)}
      </div>
    </div>
  );
};
