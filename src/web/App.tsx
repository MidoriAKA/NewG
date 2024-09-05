import React from 'react';
import './App.css';
import { TitleBarView } from './components/TitleBar/TitleBarView';
import { SidemenuView } from './components/SideMenu/SideMenuView';
import { MainAreaView } from './components/MainArea/MainAreaView';

export const App = () => {
    return (
        <>
            <TitleBarView />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: '100vh-41px',
                }}
            >
                <SidemenuView />
                <MainAreaView />
            </div>
        </>
    );
};
