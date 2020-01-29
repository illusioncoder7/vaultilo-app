import React from "react";
import { useBlockstack } from "react-blockstack";
import Landing from "./components/Landing.js";
import AppRouter from './components/AppRouter.js';
import './styles/icons.css';

export default function App() {
  return (
    <AppRouter/>
  );
}
