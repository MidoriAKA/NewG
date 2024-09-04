import React from 'react';
import './App.css';
import { TitleBarView } from './components/TitleBar/TitleBarView';
import { SidemenuView } from './components/SideMenu/SideMenuView';

export const App = () => {
    return (
        <>
            <TitleBarView />
            <SidemenuView />
        </>
    );
};