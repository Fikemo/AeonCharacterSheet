import {
    useState,
    useEffect,
    useRef,
    useReducer,
    useContext,
    createContext,
} from 'react';
import "./App.css";
import { styled } from '@mui/material/styles';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Components
import Tooltip from '@mui/material/Tooltip';

// Layout
import Divider from '@mui/material/Divider';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import FormHelperText from '@mui/material/FormHelperText';

// Inputs
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// icons
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import factions from "./sets/factions.json"
import races from "./sets/races.json"

export const ACContext = createContext();

const paperElevation = 5;

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

const reducer = (current, update) => {
    window.AC.data = { ...current, ...update };
    return { ...current, ...update };
}

const StatBox = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    // Get name with first letter capitalized
    const title = props.name.charAt(0).toUpperCase() + props.name.slice(1);
    
    const totalStatValue = ACData.stats?.[props.name] + ACData.statModifiers?.[props.name] ?? 0;
    
    return (
        <Grid2 xs={4} >
            <Paper elevation={paperElevation} square={false} sx={{borderRadius: '10px'}}>
                <Stack spacing={0} sx={{display:"flex", alignItems: "center"}}>
                    <Typography>{title}</Typography>
                    <Divider sx={{width: "100%"}}/>
                    <Typography fontSize="4em">{totalStatValue}</Typography>
                    <TextField
                        id={props.name}
                        size="small"
                        type="number"
                        value={ACData.stats?.[props.name] ?? 0}
                        onChange={(event) => {
                            dispatchACData({ stats: { ...ACData.stats, [props.name]: parseInt(event.target.value) } });
                        }}
                        sx={{ width: "50%" }}
                    />
                </Stack>
            </Paper>
        </Grid2>
    )
}

const StatBoxes = () => {
    // TODO: Use common reference to stats
    const [ACData, dispatchACData] = useContext(ACContext);

    return (
        <Grid2 container spacing={1}>
            {Object.keys(ACData.stats).map((stat, index) => {
                return (
                    <StatBox key={index} name={stat} />
                )
            })}
        </Grid2>
    )
}

export default function App() {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const height100 = isLargeScreen ? "100%" : "auto";

    const [ACData, dispatchACData] = useReducer(reducer, window.AC.data);

    const characterFileReader = new FileReader();

    const fileInputRef = useRef(null);

    return (
        <ACContext.Provider value={[ACData, dispatchACData]}>
            <Box
                height={isLargeScreen ? "100vh" : "auto"}
                padding="clamp(0px, 0.5%, 20px)"
                backgroundColor="lightgray"
                sx={{ flex: "1 0 auto" }}
            >
                <Grid2 container spacing={1} sx={{ backgroundColor: "gray", height: height100 }}>
                    <Grid2 xs={12} md={6} lg={3} >
                        <Stack spacing={1} sx={{ height: height100 }}>
                            {/**Character Name */}
                            <Paper elevation={paperElevation} >
                                <TextField
                                    fullWidth
                                    id="characterName"
                                    placeholder='Name'
                                    value={ACData.name ?? ""}
                                    onChange={(event) => {
                                        dispatchACData({ name: event.target.value });
                                    }}
                                    InputProps={{
                                        style: {
                                            fontSize: '2rem'
                                        }
                                    }}
                                />
                            </Paper>
                            {/**Character Image */}
                            <Paper elevation={paperElevation} sx={{ flex: "1 0 auto", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
                                <Tooltip title="Add Character Image" followCursor>
                                    <AddBoxOutlinedIcon sx={{ width: "50%", height: "50%" }} />
                                </Tooltip>
                            </Paper>
                            <Box display="flex">
                                {/**Age */}
                                <Paper elevation={paperElevation} sx={{ width: "25%", marginRight: theme.spacing(1)}}>
                                    <FormControl>
                                        <FormHelperText>Age</FormHelperText>
                                        <TextField
                                            id="age"
                                            type="number"
                                            defaultValue={ACData.age ?? 0}
                                            onChange={(event) => {
                                                dispatchACData({ age: event.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Paper>
                                {/**Race */}
                                <Paper elevation={paperElevation} sx={{ width: "75%" }}>
                                    <FormControl fullWidth>
                                        <FormHelperText>Race</FormHelperText>
                                        <Select
                                            id="race-select"
                                            value={ACData.race ?? "Human"}
                                            placeholder='Race'
                                            onChange={(event) => {
                                                dispatchACData({ race: event.target.value });
                                            }}
                                        >
                                            {Object.keys(races).map((race, index) => {
                                                return (
                                                    <MenuItem key={index} value={race}>
                                                        {race}
                                                    </MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
                                </Paper>
                            </Box>
                            {/**Faction */}
                            <Paper elevation={paperElevation}>
                                <FormControl fullWidth>
                                    <FormHelperText>Faction</FormHelperText>
                                    <Select
                                        id="faction-select"
                                        value={ACData.faction ?? "None"}
                                        onChange={(event) => {
                                            dispatchACData({ faction: event.target.value });
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
                                </FormControl>
                            </Paper>
                            {/**Description */}
                            <Paper elevation={paperElevation}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={8}
                                    id="description"
                                    placeholder='Description'
                                    defaultValue={ACData.description}
                                    onChange={(event) => {
                                        dispatchACData({ description: event.target.value });
                                    }}
                                />
                            </Paper>
                        </Stack>
                    </Grid2>
                    <Grid2 xs={12} md={6} lg={3} >
                        <Stack spacing={1} sx={{ height: height100 }}>
                            {/**Health */}
                            <Paper elevation={paperElevation}>
                                <FormControl fullWidth>
                                    <FormHelperText>Health </FormHelperText>
                                    <TextField
                                        id="health"
                                        type="number"
                                        defaultValue={ACData.health}
                                        onChange={(event) => {
                                            dispatchACData({ health: event.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Paper>
                            {/**Stats */}
                            <StatBoxes />
                        </Stack>
                    </Grid2>
                    <Grid2 xs={12} md={6} lg={3} >

                    </Grid2>
                    <Grid2 xs={12} md={6} lg={3} >
                        <Stack spacing={1} sx={{ height: height100 }}>
                            {/**Import and dowload buttons */}
                            <Paper elevation={paperElevation}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept=".json"
                                    id="file-upload-button"
                                    style={{ display: "none" }}
                                    onChange={(event) => {
                                        const file = event.target.files[0];
                                        if (file) {
                                            characterFileReader.onload = (event) => {
                                                try {
                                                    const character = JSON.parse(event.target.result);
                                                    dispatchACData(character);
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                            }
                                            characterFileReader.readAsText(file);
                                        }
                                    }}
                                />
                                <Tooltip title="Import Character" >
                                    <IconButton
                                        onClick={(event) => {
                                            if (fileInputRef.current) {
                                                fileInputRef.current.click();
                                            }
                                        }}
                                    >
                                        <FileUploadIcon />
                                    </IconButton>
                                </Tooltip>
                            </Paper>
                        </Stack>
                    </Grid2>
                </Grid2>
            </Box>
        </ACContext.Provider>
    );
}