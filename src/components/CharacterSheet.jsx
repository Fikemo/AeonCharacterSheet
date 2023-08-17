import React, {useState} from 'react';
import CharacterStat from "./CharacterStat.jsx";
import Image from "./Image.jsx";
import TestFileReader from './TestFileReader.jsx';

import EV from "../Events.js";

import {AC} from "../index.js";

export default function CharacterSheet() {
    const defaultStats = {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10
    }

    function getCurrentStats() {
        return AC.stats ? AC.stats : defaultStats;
    }

    EV.on("dataChanged", () => {
        console.log("dataChanged");
        setStats(getCurrentStats());
    });

    const [stats, setStats] = useState(() => {getCurrentStats()});

    function handleStatChange(stat, value) {
        if (window.AC) window.AC.stats[stat] = value;
        setStats(prevStats => ({...prevStats, [stat]: value}));
    }

    return (
        <div className='character-sheet'>
            <TestFileReader/>
            <div className='character-stats'>
                {Object.keys(stats).map(stat => (
                    <CharacterStat
                        key={stat}
                        stat={stat}
                        value={stats[stat]}
                        onStatChange={handleStatChange}
                    />
                ))}
            </div>
        </div>
    )
}