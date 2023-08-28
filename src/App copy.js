import {
    useState,
    useEffect,
    useRef,
    useReducer,
    useContext,
    createContext,
    useId,
} from 'react';
import "./App.css";
import { styled } from '@mui/material/styles';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Components
import Tooltip from '@mui/material/Tooltip';

import Grid2 from "@mui/material/Unstable_Grid2"

// Layout
import {
    Autocomplete,
    Box,
    Card,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormHelperText,
    Grid,
    List,
    Paper,
    Stack,
    SvgIcon,
    Toolbar
} from '@mui/material';

// Inputs
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
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
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Dice Icons
import d4Icon from "./d4.svg";
import d6Icon from "./d6.svg";
import d8Icon from "./d8.svg";
import d10Icon from "./d10.svg";
import d12Icon from "./d12.svg";
import d20Icon from "./d20.svg";

import defaultCharacter from "./characters/default.json";
import factions from "./sets/factions.json"
import races from "./sets/races.json"
import weapons from "./sets/weapons.json"

export const ACContext = createContext();

const paperElevation = 5;

const AddInventoryItemDialog = ({ open, onClose }) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    const [newItem, setNewItem] = useState({});

    const handleAddItem = () => {
        console.log(newItem)
        dispatchACData({ inventory: [...ACData.inventory, newItem] });
        onClose();
    }

    const inventoryOptions = [];
    for (const weaponType in weapons) {
        for (const weapon in weapons[weaponType]) {
            weapons[weaponType][weapon].type = weaponType;
            weapons[weaponType][weapon].label = weapons[weaponType][weapon].name;
            inventoryOptions.push(weapons[weaponType][weapon]);
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Item</DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <DialogContentText>
                        Add an item to your inventory.
                    </DialogContentText>
                    <Autocomplete
                        id="item-select"
                        options={inventoryOptions}
                        renderInput={(params) => <TextField {...params} label="Item" />}
                        blurOnSelect
                        freeSolo
                        onChange={(event, value) => {
                            console.log(value);
                            setNewItem(value);
                        }}
                        onInputChange={(event, value) => {
                            if (!inventoryOptions.includes(value)) {
                            setNewItem({ name: value });
                            }
                        }}
                    />

                    <TextField
                        id="item-notes"
                        label="Notes"
                        fullWidth
                        multiline
                        rows={4}
                        value={newItem.notes ?? ""}
                        onChange={(event) => {
                            setNewItem({ ...newItem, notes: event.target.value });
                        }}
                    />
                </Stack>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={handleAddItem} >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    )
};

const InventoryItem = ({item, onRemove}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    }

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    }

    const addSpacesAndCapitalize = (str) => {
        if (typeof str !== 'string') return;
        return str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase());
    }

    return (
        <Card sx={{marginY: "2px"}}>
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                <Typography sx={{flexGrow: 1, margin: "16px"}}>{item.name}</Typography>
                <IconButton
                    onClick={handleDialogOpen}
                >
                    <InfoIcon />
                </IconButton>
                <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
                    <DialogTitle>{item.name}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {addSpacesAndCapitalize(item.type)}
                        </DialogContentText>
                        <DialogContentText>
                            {item.notes}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <IconButton
                    onClick={(event) => {
                        onRemove(item);
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        </Card>
    )
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

const reducer = (current, update) => {
    window.AC.data = { ...current, ...update };
    localStorage.setItem('ACData', JSON.stringify(window.AC.data));
    return { ...current, ...update };
}

const UploadButton = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    const characterFileReader = new FileReader();
    const fileInputRef = useRef(null);

    return (
        <>
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
        </>
    )
}

const DownloadButton = (props) => {
    const handleFileDownloadButtonClicked = () => {
        // Download window.AC.data as a JSON file
        const jsonData = JSON.stringify(window.AC.data);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${window.AC.data.name}.json`;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return (
        <Tooltip title="Download Character" >
            <IconButton
                onClick={handleFileDownloadButtonClicked}
            >
                <FileDownloadIcon />
            </IconButton>
        </Tooltip>
    )
}

const ResetButton = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    return (
        <Tooltip title="Reset Character" >
            <IconButton
                onClick={(event) => {
                    dispatchACData(defaultCharacter);
                }}
            >
                <DeleteIcon />
            </IconButton>
        </Tooltip>
    )
}

const Inventory = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
    const handleOpenAddItemDialog = () => {
        setOpenAddItemDialog(true);
    }
    const handleCloseAddItemDialog = () => {
        setOpenAddItemDialog(false);
    }

    const removeItem = (item) => {
        const newInventory = ACData.inventory.filter((inventoryItem) => {
            return inventoryItem !== item;
        });
        dispatchACData({ inventory: newInventory });
    }

    const inventoryItems = ACData.inventory?.map((item, index) => {
        return (
            <InventoryItem key={index} item={item} onRemove={removeItem} />
        )
    })

    return (
        <Paper elevation={paperElevation} sx={{ height: "max(40%, 200px)", display: "flex", flexDirection: "column" }}>
            <AddInventoryItemDialog
                open={openAddItemDialog}
                onClose={handleCloseAddItemDialog}
            />
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Inventory
                </Typography>
                <IconButton onClick={handleOpenAddItemDialog}>
                    <AddOutlinedIcon />
                </IconButton>
            </Toolbar>
            <Divider />
            <List sx={{ overflow: "auto" }}>
                {inventoryItems}
            </List>
        </Paper>
    )
}

export default function App() {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const height100 = isLargeScreen ? "100%" : "auto";
    const height100vh = isLargeScreen ? "100vh" : "auto";

    const [ACData, dispatchACData] = useReducer(reducer, window.AC.data);

    const [selectedImage, setSelectedImage] = useState(null);

    const handleOpenFileInput = () => {
        const fileInput = document.getElementById("fileInput");
        fileInput.click();
    }

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setSelectedImage(URL.createObjectURL(file));
    }

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
                                    <IconButton
                                        onClick={handleOpenFileInput}
                                        sx={{ width: "100%", height: "100%", aspectRatio: 1 }}
                                    >
                                        {selectedImage ?
                                            (<img
                                                src={selectedImage}
                                                alt="character"
                                                style={{ width: "100%", height: "100%", objectFit: "contain" }} />)
                                            : (<AddBoxOutlinedIcon sx={{width:"100%", height: "100%"}}/>)
                                        }
                                        <input
                                            type="file"
                                            id='fileInput'
                                            accept=".png, .jpg, .jpeg"
                                            style={{ display: "none" }}
                                            onChange={handleFileInputChange}
                                        />
                                    </IconButton>
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
                                    <FormHelperText>Health</FormHelperText>
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
                        <Stack spacing={1} sx={{ height: height100 }}>
                            {/**Inventory */}
                            <Inventory />
                        </Stack>
                    </Grid2>
                    <Grid2 xs={12} md={6} lg={3} >
                        <Stack spacing={1} sx={{ height: height100 }}>
                            {/**Upload, download, reset, dice */}
                            <Paper elevation={paperElevation}>
                                <UploadButton />
                                <DownloadButton />
                                <ResetButton />
                                <Tooltip title="D4">
                                    <IconButton>
                                        <img src={d4Icon} alt="d4" height={24} width={24} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="D6">
                                    <IconButton>
                                        <img src={d6Icon} alt="d6" height={24} width={24} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="D8">
                                    <IconButton>
                                        <img src={d8Icon} alt="d8" height={24} width={24} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="D10">
                                    <IconButton>
                                        <img src={d10Icon} alt="d10" height={24} width={24} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="D12">
                                    <IconButton>
                                        <img src={d12Icon} alt="d12" height={24} width={24} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="D20">
                                    <IconButton>
                                        <img src={d20Icon} alt="d20" height={24} width={24} />
                                    </IconButton>
                                </Tooltip>
                            </Paper>
                            {/**Notes */}
                            <Paper elevation={paperElevation}>
                                <FormControl fullWidth>
                                    <FormHelperText>Notes</FormHelperText>
                                    <TextField
                                        multiline
                                        rows={30}
                                        fullWidth
                                        id="notes"
                                        placeholder='Notes'
                                        value={ACData.notes}
                                        onChange={(event) => {
                                            dispatchACData({ notes: event.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Paper>
                        </Stack>
                    </Grid2>
                </Grid2>
            </Box>
        </ACContext.Provider>
    );
}