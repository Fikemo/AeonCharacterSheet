import * as React from 'react';
import "./App.css";
import { styled } from '@mui/material/styles';

import useACData from './hooks/useACData';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Components
import CharacterAppBar from './components/CharacterAppBar.js';
import Tooltip from '@mui/material/Tooltip';

// Layout
import Grid from '@mui/material/Grid';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';

// Inputs
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// icons
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';

import factions from "./sets/factions.json"
import races from "./sets/races.json"

export const ACContext = React.createContext();

/**
    ___________________________
    |          Title          |
    |_________________________|
    |                         |
    |           Stat          |
    |             +           |
    |       Stat Modifier     |
    |                         |
    |                         |
    |                         |
    |                         |
    |_________________________|
    |  -   |    Stat   |   +  |
    |______|___________|______|
*/

function StatBox(props) {
    const [ACData, setACData] = React.useContext(ACContext);
    const { stats, statModifiers } = ACData;

    const height = "110px";
    return (
        <Grid>

        </Grid>
    )
}

function StatBoxes(props) {
    const [ACData, setACData] = React.useContext(ACContext);
    const { stats } = ACData;

    const statBoxes = Object.keys(stats).map((statName, index) => {
        return (
            <StatBox key={index} stat={statName} />
        )
    })

    return (
        <Grid container >
            {statBoxes}
        </Grid>
    )
}

function CharacterSheetBody(props) {
    const [ACData, setACData] = React.useContext(ACContext);

    // When ACData.description changes, update the value of the character description text field
    // React.useEffect(() => {
    //     document.getElementById("description").value = ACData.description;
    // }, [ACData.description]);

    return (
        <Box sx={{display: "flex", flexGrow: 1}}>
            <Grid container spacing={1}>
                <Grid item xs={12} lg={3} sx={{display:"flex"}}>
                    <Stack spacing={1} sx={{flexGrow: 1}}>
                        <Paper elevation={3}>
                            <TextField 
                                fullWidth
                                id="characterName"
                                placeholder='Name'
                                defaultValue={ACData.name}
                                onChange={(event) => {
                                    setACData({...ACData, name: event.target.value});
                                }}
                            />
                        </Paper>
                        <Paper elevation={3} sx={{display:"flex", justifyContent:"center", alignItems: "center", flex: "1 0 auto", minHeight: "300px"}}>
                            <Tooltip title="Add Character Image" followCursor>
                                <AddBoxOutlinedIcon sx={{width: "50%", height: "50%"}}/>
                            </Tooltip>
                        </Paper>
                        <Paper>
                            <Select 
                                fullWidth
                                id="race"
                                placeholder='Race'
                                defaultValue={ACData.race ?? "Human"}
                                value={ACData.race}
                                onChange={(event) => {
                                    setACData({...ACData, race: event.target.value});
                                }}
                            >
                                {Object.keys(races).map((race, index) => {
                                    return (
                                        <MenuItem key={index} value={race}>{race}</MenuItem>
                                    )
                                })}
                            </Select>
                        </Paper>
                        <Paper>
                            <Select 
                                fullWidth
                                id="faction"
                                placeholder='Faction'
                                defaultValue={ACData.faction ?? "None"}
                                value={ACData.faction}
                                onChange={(event) => {
                                    setACData({...ACData, faction: event.target.value});
                                }}
                            >
                                {Object.keys(factions).map((faction, index) => {
                                    return (
                                        <MenuItem key={index} value={faction}>
                                            {faction}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </Paper>
                        <Paper elevation={3} sx={{}}>
                            <TextField
                                fullWidth
                                multiline
                                rows={5}
                                id="description"
                                placeholder='Description'
                                defaultValue={ACData.description}
                                onChange={(event) => {
                                    setACData({...ACData, description: event.target.value});
                                }}
                            />
                        </Paper>
                    </Stack>
                </Grid>
                <Grid item xs={12} lg={3} >
                    <Paper elevation={3} sx={{height: "100%"}}>

                    </Paper>
                </Grid>
                <Grid item xs={12} lg={3} >
                    <Paper elevation={3} sx={{height: "100%"}}>

                    </Paper>
                </Grid>
                <Grid item xs={12} lg={3} >
                    <Paper elevation={3} sx={{height: "100%"}}>

                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default function App() {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    return (
        <Box height={isLargeScreen ? "100vh" : "auto"} display="flex" padding="clamp(0px, 0.5%, 20px)" backgroundColor="lightgray">
            <ACContext.Provider value={useACData()}>
                <CharacterSheetBody />
            </ACContext.Provider>
        </Box>
    );
}