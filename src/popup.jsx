import React from 'react';
import { createRoot } from 'react-dom/client';
import classes from './popup.module.css';
import Header from "./Components/Header/Header";

const Popup = () => {
    return (<div className={classes.popup}>
        <Header />
    </div>);
};
const root = createRoot(document.getElementById("popup-root"));
root.render(<Popup />);