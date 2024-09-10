import React from 'react';
import './App.css';
import { css } from '@emotion/react';
import * as style from "@styles/app";

import { TitleBarView, SidemenuView, MainAreaView } from "@components/exportComponents";
import { SideMenuContextProvider } from "./contexts/SideMenuContext";
import { TicketElementsContextProvider } from './contexts/TicketElementsContext';

export const App = () => {
    return (
        <>
            <SideMenuContextProvider>

                <TicketElementsContextProvider>
                    <TitleBarView />
                    <div
                        css={style.root}
                    >
                        <SidemenuView />
                        <MainAreaView />
                    </div>

                </TicketElementsContextProvider>
            </SideMenuContextProvider>
        </>
    );
};
