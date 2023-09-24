import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App.js";
import Events from './Events.js';
import './index.css';
import AeonCharacter from './AeonCharacter.js';
import reportWebVitals from './reportWebVitals';
import "./styles/CharacterSheet.css";

import CssBaseline from "@mui/material/CssBaseline";

import defaultCharacter from "./characters/default.json";

import DiceScene from './DiceScene.js';

const ACData = JSON.parse(localStorage.getItem('ACData')) || defaultCharacter;
const AC = new AeonCharacter(ACData);
window.AC = AC;

window.Events = Events;

window.scene = new DiceScene();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();