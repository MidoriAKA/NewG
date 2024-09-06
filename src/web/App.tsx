import React from 'react';
import './App.css';
import { css } from '@emotion/react';
import * as style from "@styles/app";

import { TitleBarView, SidemenuView, MainAreaView } from "@components/exportComponents";
import { SideMenuContextProvider } from "./contexts/SideMenuContext";

export const App = () => {
    return (
        <>
            <TitleBarView />
            <div
                css={style.root}
            >
                <SideMenuContextProvider>
                    <SidemenuView />
                    <MainAreaView />
                </SideMenuContextProvider>
            </div>
        </>
    );
};
