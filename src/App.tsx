import React from "react";
import { Routes, Route } from "react-router";
import { Matches } from "./Pages/Matches";
import { Match } from "./Pages/Match";
import { Home } from "./Pages/Home";
import "./styles.css"

export default function App() {
    return (
        // <div className="App">
        //     this is a sentence with a match attached to it <Match />
        // </div>

        <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="matches/" element={ <Matches /> } />
            <Route path="matches/:matches" element={ <Match /> } />
        </Routes>
    );
}