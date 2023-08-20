import * as React from 'react';
import "./App.css";
import { styled } from '@mui/material/styles';

// Components
import CharacterAppBar from './components/AppBar.js';

// Layout
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

// Inputs
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

// icons
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

const PlaceholderColumn = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    backgroundColor: "lightgray",
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function StatBox(props) {
    const height = "90px"
    return (
        <Grid2 xs={12}>
            <Box sx={{border:"1px solid black", height: height, display: "flex", justifyContent:"center", alignItems:"center"}}>
                <Typography sx={{fontSize: height}}>
                    {window.AC.data.stats.strength}
                </Typography>
            </Box>
        </Grid2>
    )
}

export default function App() {
    return (
        <div className="App">
            <CharacterAppBar />
            <Box sx={{border:"1px solid black", marginX:"1%"}}>
                <Grid2 container spacing={1}>
                    <Grid2 xs={12} sm={6} lg={3}>
                        <Box sx={{border:"1px solid black", margin:"1%"}}>
                            <Grid2 container spacing={0}>
                                <Grid2 xs={9}>
                                    <Box sx={{height: "100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                                        <AddBoxOutlinedIcon color="" sx={{height:"50%", width: "50%"}}/>
                                    </Box>
                                </Grid2>
                                <Grid2 xs={3}>
                                    <Grid2 container spacing={0}>
                                        <StatBox />
                                        <StatBox />
                                        <StatBox />
                                        <StatBox />
                                        <StatBox />
                                        <StatBox />
                                    </Grid2>
                                </Grid2>
                            </Grid2>
                        </Box>
                    </Grid2>
                    <Grid2 xs={12} sm={6} lg={3}>
                        <Box sx={{border:"1px solid black", margin:"1%"}}>
                            
                        </Box>
                    </Grid2>
                    <Grid2 xs={12} sm={6} lg={3}>
                        <Box sx={{border:"1px solid black", margin:"1%"}}>
                            
                        </Box>
                    </Grid2>
                    <Grid2 xs={12} sm={6} lg={3}>
                        <Box sx={{border:"1px solid black", margin:"1%"}}>
                            
                        </Box>
                    </Grid2>
                </Grid2>
            </Box>
        </div>
    );
}