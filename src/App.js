import * as React from 'react';
import "./App.css";
import { styled } from '@mui/material/styles';

import useACData from './hooks/useACData';

// Components
import CharacterAppBar from './components/CharacterAppBar.js';

// Layout
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

// Inputs
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

// icons
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';

export const ACContext = React.createContext();

function GridBox(props) {
    return (
        <Grid2 xs={12} sm={6} lg={3}>
            <Box sx={{ margin: "1%" }}>
                {props.children}
            </Box>
        </Grid2>
    )
}

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
        <Grid2 xs={12} sx={{ height: height, border: "1px solid black", borderRadius: "20%", marginY: "3px" }}>
            <Grid2 container spacing={0} flexDirection="column">
                {/** Stat Title */}
                <Grid2 xs>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography variant="h6" component="h6" fontSize={11}>
                            {props.stat}
                        </Typography>
                    </Box>
                </Grid2>

                {/** Display current stat */}
                <Grid2 xs>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography variant="h4" component="h6" >
                            {stats[props.stat] + statModifiers[props.stat]}
                        </Typography>
                    </Box>
                </Grid2>

                <Grid2 container spacing={0}>
                    {/** Subtract base stat */}
                    <Grid2 xs={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <IconButton
                            onClick={() => {
                                setACData({
                                    ...ACData,
                                    stats: {
                                        ...stats,
                                        [props.stat]: stats[props.stat] - 1
                                    }
                                })
                            }}
                        >
                            <RemoveOutlinedIcon />
                        </IconButton>
                    </Grid2>

                    {/** Display base stat */}
                    <Grid2 xs={6} display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="h6" component="h6" >
                            {stats[props.stat]}
                        </Typography>
                    </Grid2>

                    {/** Add base stat */}
                    <Grid2 xs={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <IconButton
                            onClick={() => {
                                setACData({
                                    ...ACData,
                                    stats: {
                                        ...stats,
                                        [props.stat]: stats[props.stat] + 1
                                    }
                                })
                            }}
                        >
                            <AddOutlinedIcon />
                        </IconButton>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Grid2>
    )
}

function StatBoxes(props) {
    const [ACData, setACData] = React.useContext(ACContext);
    const { stats } = ACData;

    return Object.keys(stats).map((statName, index) => {
        return (
            <StatBox key={index} stat={statName} />
        )
    })
}

function CharacterSheetBody(props) {
    const [ACData, setACData] = React.useContext(ACContext);

    // When ACData.description changes, update the value of the character description text field
    React.useEffect(() => {
        document.getElementById("description").value = ACData.description;
    }, [ACData.description]);

    return (
        <Box sx={{ border: "1px solid black", marginX: "1%", minWidth: "350px" }}>
            <Grid2 container spacing={1}>
                <GridBox>
                    <Grid2 container spacing={0} rowSpacing={1}>
                        {/**Character Image Section */}
                        <Grid2 xs={9} sx={{border: "1px solid black"}}>
                            <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <AddBoxOutlinedIcon sx={{ height: "50%", width: "50%" }} />
                            </Box>
                        </Grid2>

                        {/**Character Stats Section */}
                        <Grid2 xs={3}>
                            <StatBoxes />
                        </Grid2>

                        {/**Character Description */}
                        <Grid2 xs={12}>
                            <TextField
                                id="description"
                                label="Description"
                                multiline
                                rows={4}
                                fullWidth
                                defaultValue={ACData.description}
                            />
                        </Grid2>
                    </Grid2>
                </GridBox>
            </Grid2>
        </Box>
    )
}

export default function App() {
    return (
        <div className="App">
            <ACContext.Provider value={useACData()}>
                <CharacterAppBar />
                <CharacterSheetBody />
            </ACContext.Provider>
        </div>
    );
}