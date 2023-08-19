import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Typography from '@mui/material/Typography';

import { AccessTime } from "@mui/icons-material"
import { createTheme, ThemeProvider} from "@mui/material"

const theme = createTheme({
    components: {
        MuiTypography: {
            variants: [
                {
                    props: {
                        variant: "body3"
                    },
                    style: {
                        fontSize: 11
                    }
                }
            ]
        }
    }
})

const TourCard = () => {
    return (
        <Grid2 xs={3}>
            <ThemeProvider theme={theme}>
                <Paper elevation={3}>
                    <img
                        className="img"
                        src="https://picsum.photos/200/300"
                        alt="tour"
                    />
                    <Box paddingX={1}>
                        <Typography variant="subtitle1" component="h2">
                            Random
                        </Typography>
                        <Box sx={{display: "flex", alignItems: "center"}}>
                            <AccessTime sx={{width: 12.5}}/>
                            <Typography variant="body3" component="p" marginLeft={0.5}>
                                5 Days
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </ThemeProvider>
        </Grid2>
    )
}

export default TourCard;