import * as React from 'react';
import "./App.css";

import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import CharacterAppBar from './components/AppBar.js';
import TourCard from './components/TourCard.js';

export default function App() {
    return (
        <div className="App">
            <CharacterAppBar />
            <Container maxWidth={false} sx={{marginY: 2}}>
                <Grid2 container spacing={2}>
                    <TourCard />
                    <TourCard />
                    <TourCard />
                    <TourCard />
                </Grid2>
            </Container>
        </div>
    );
}