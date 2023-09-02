import {
    useState,
    useEffect,
    useRef,
    useReducer,
    useContext,
    createContext,
    forwardRef,
} from "react";

import { styled, useTheme } from "@mui/material/styles";

import Grid2 from "@mui/material/Unstable_Grid2";

import Events from "./Events";

import {
    Autocomplete,
    Box,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    FormHelperText,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    Paper,
    Stack,
    Toolbar,
    Tooltip,
    Typography,
    TextField,
    IconButton,
    InputAdornment,
    Button,
    ButtonGroup,
    Select,
    MenuItem,
    InputLabel,
    useMediaQuery,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    AccordionActions,
} from "@mui/material";

// icons
import {
    AddBoxOutlined,
    AddOutlined,
    RemoveOutlined,
    Delete,
    Info,
    Edit,
    FileUpload,
    FileDownload,
    Clear,
    ExpandMore
} from "@mui/icons-material"

// dice icons
import d4Icon from "./d4.svg";
import d6Icon from "./d6.svg";
import d8Icon from "./d8.svg";
import d10Icon from "./d10.svg";
import d12Icon from "./d12.svg";
import d20Icon from "./d20.svg";

// import data
import defaultCharacter from "./characters/default.json";
import factions from "./sets/factions.json";
import races from "./sets/races.json";
import weapons from "./sets/weapons.json";
import skills from "./sets/skills.json";

export const ACContext = createContext();
const diceHistoryContext = createContext();

const paperElevation = 3;

const reducer = (current, updated) => {
    window.AC.data = { ...current, ...updated };
    localStorage.setItem('ACData', JSON.stringify(window.AC.data));
    return { ...current, ...updated };
}

const CharacterName = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    return (
        <Paper elevation={paperElevation}>
            <FormControl fullWidth>
                <TextField
                    id="name-input"
                    placeholder="Name"
                    value={ACData.name}
                    onChange={(e) => dispatchACData({ name: e.target.value })}
                    InputProps={{
                        style: {
                            fontFamily: "Macondo",
                            fontSize: "2rem"
                        }
                    }}
                />
            </FormControl>
        </Paper>
    )
}

const CharacterImage = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);
    const [image, setImage] = useState(null);

    useEffect(() => {
        Events.on("reset", () => {
            setImage(null);
            dispatchACData({ imageURI: null });
        })

        if (ACData.imageURI && !image) {
            setImage(decodeURIComponent(ACData.imageURI));
        }

        return () => {
            Events.off("reset");
        }

    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();

        reader.onload = (e) => {
            setImage(e.target.result);

            dispatchACData({
                imageURI:
                    encodeURIComponent(e.target.result)
            })
        };

        reader.readAsDataURL(file);
    };

    return (
        <Paper elevation={paperElevation} sx={{ height: 500, p: "16px" }} onClick={() => document.getElementById("image-upload").click()}>
            {image ? (
                <img src={image} alt="Character" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
                <Typography variant="h6" align="center" sx={{ mt: 10 }}>
                    Click to upload an image
                </Typography>
            )}
            <input type="file" id="image-upload" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
        </Paper>
    );
};

const AgeAndRace = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);
    const [tempAge, setTempAge] = useState("0");
    const [editingAge, setEditingAge] = useState(false);

    return (
        <Stack direction="row" spacing={1}>
            <Paper elevation={paperElevation} sx={{ width: "25%" }}>
                <FormControl fullWidth>
                    <FormHelperText>Age</FormHelperText>
                    <TextField
                        id="age-input"
                        type="number"
                        value={editingAge ? tempAge : ACData.age ?? 0}
                        onChange={(e) => { setTempAge(e.target.value) }}
                        onFocus={() => {
                            setEditingAge(true);
                            setTempAge(ACData.age ?? 0);
                        }}
                        onBlur={() => {
                            setEditingAge(false);
                            if (tempAge !== "") {
                                dispatchACData({ age: parseInt(tempAge) });
                            }
                        }}
                    />
                </FormControl>
            </Paper>
            <Paper elevation={paperElevation} sx={{ width: "75%" }}>
                <FormControl fullWidth>
                    <FormHelperText>Race</FormHelperText>
                    <Select
                        id="race-select"
                        value={ACData.race}
                        onChange={(e) => dispatchACData({ race: e.target.value })}
                    >
                        {races.map((race, index) => (
                            <MenuItem key={index} value={race.name}>
                                {race.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>
        </Stack>
    )
}

const Faction = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    return (
        <Paper elevation={paperElevation}>
            <FormControl fullWidth>
                <FormHelperText>Faction</FormHelperText>
                <Select
                    id="faction-select"
                    value={ACData.faction}
                    onChange={(e) => dispatchACData({ faction: e.target.value })}
                >
                    {factions.map((faction, index) => (
                        <MenuItem key={index} value={faction.name}>
                            {faction.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Paper>
    )
}

const Description = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    return (
        <Paper elevation={paperElevation}>
            <FormControl fullWidth>
                <FormHelperText>Description</FormHelperText>
                <TextField
                    id="description-input"
                    multiline
                    placeholder="Description"
                    rows={4}
                    value={ACData.description}
                    onChange={(e) => dispatchACData({ description: e.target.value })}
                />
            </FormControl>
        </Paper>
    )
}

const Health = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);
    const [tempHealth, setTempHealth] = useState("0");
    const [editing, setEditing] = useState(false);

    return (
        <Paper elevation={paperElevation}>
            <FormControl fullWidth>
                <FormHelperText>Health</FormHelperText>
                <TextField
                    id="health-input"
                    type="number"
                    value={editing ? tempHealth : ACData.health ?? 0}
                    onChange={(e) => { setTempHealth(e.target.value) }}
                    onFocus={() => {
                        setEditing(true);
                        setTempHealth(ACData.health ?? 0);
                    }}
                    onBlur={() => {
                        setEditing(false);
                        if (tempHealth !== "") {
                            dispatchACData({ health: parseInt(tempHealth) });
                        }
                    }}
                />
            </FormControl>
        </Paper>
    )
}

const StatBox = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);
    const statName = props.stat;

    const title = statName.charAt(0).toUpperCase() + statName.slice(1);

    const totalStatValue = ACData.stats?.[statName] + ACData.statModifiers?.[statName] ?? 0;

    return (
        <Grid2 xs={4}>
            <Paper elevation={paperElevation}>
                <Stack spacing={0} sx={{ alignItems: "center" }}>
                    <Typography>{title}</Typography>
                    <Divider />
                    <Typography variant="h2">{totalStatValue}</Typography>
                    <TextField
                        id={`${props.stat}-input`}
                        size="small"
                        type="number"
                        value={ACData.stats?.[props.stat] ?? 0}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                dispatchACData({ stats: { ...ACData.stats, [props.stat]: 0 } })
                            }
                            dispatchACData({ stats: { ...ACData.stats, [props.stat]: parseInt(e.target.value) } })
                        }}
                        sx={{ width: "50%" }}
                    />
                </Stack>
            </Paper>
        </Grid2>
    )

}

const StatBoxes = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    return (
        <Grid2 container spacing={1}>
            {Object.keys(ACData.stats).map((stat, index) => {
                return (
                    <StatBox key={index} stat={stat} />
                )
            })}
        </Grid2>
    )
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
                    <FileUpload />
                </IconButton>
            </Tooltip>
        </>
    )
}

/**
 * DownloadButton component that allows the user to download character data as a JSON file.
 * @param {Object} props - The props object that contains the component's properties.
 * @returns {JSX.Element} - The DownloadButton component.
 */
const DownloadButton = (props) => {
    /**
     * Event handler for when the file download button is clicked.
     * Downloads the character data as a JSON file.
     */
    const handleFileDownloadButtonClicked = () => {

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
                <FileDownload />
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
                    Events.emit("reset");
                }}
            >
                <Delete />
            </IconButton>
        </Tooltip>
    )
}

const DieButton = (props) => {
    const [diceHistory, setDiceHistory] = useContext(diceHistoryContext);

    return (
        <Tooltip title={props.title} >
            <IconButton
                onClick={() => {
                    let roll = Math.floor(Math.random() * props.sides) + 1;
                    roll = `${props.title}: ${roll}`;
                    setDiceHistory([roll, ...diceHistory]);
                }}
            >
                <img src={props.icon} alt={props.title} height={24} width={24} />
            </IconButton>
        </Tooltip>
    )
}

const IconButtonRow = (props) => {
    const [diceHistory, setDiceHistory] = useContext(diceHistoryContext);

    return (
        <Paper elevation={paperElevation}>
            <Stack direction="row" spacing={1}>
                <DieButton title="D4" sides={4} icon={d4Icon} />
                <DieButton title="D6" sides={6} icon={d6Icon} />
                <DieButton title="D8" sides={8} icon={d8Icon} />
                <DieButton title="D10" sides={10} icon={d10Icon} />
                <DieButton title="D12" sides={12} icon={d12Icon} />
                <DieButton title="D20" sides={20} icon={d20Icon} />

                <Divider orientation="vertical" flexItem />

                <UploadButton />
                <DownloadButton />
                <ResetButton />
            </Stack>
        </Paper>
    )
}

const DiceHistory = (props) => {
    const [diceHistory, setDiceHistory] = useContext(diceHistoryContext);
    const toolbarRef = useRef(null);

    const clearDiceHistory = () => {
        setDiceHistory([]);
    };

    return (
        <Paper elevation={paperElevation}>
            <Toolbar ref={toolbarRef} >
                <Typography sx={{flexGrow: 1}}>
                    Dice History
                </Typography>
                <Tooltip title="Clear Dice History" >
                    <IconButton onClick={clearDiceHistory}>
                        <Delete />
                    </IconButton>
                </Tooltip>
            </Toolbar>
            <Divider />
            <List sx={{height: "200px", overflow: "auto" }}>
                {diceHistory.map((roll, index) => (
                    <ListItem key={index} dense>
                        <ListItemText primary={roll} />
                    </ListItem>
                ))}
            </List>
        </Paper >
    )
}

const Notes = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    return (
        <Paper elevation={paperElevation}>
            <FormControl fullWidth>
                <FormHelperText>Notes</FormHelperText>
                <TextField
                    id="notes-input"
                    multiline
                    placeholder="Notes"
                    rows={15}
                    value={ACData.notes}
                    onChange={(e) => dispatchACData({ notes: e.target.value })}
                />
            </FormControl>
        </Paper>
    )
}

const SkillDialog = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    const [tempSkill, setTempSkill] = useState({
        name: props.edit ? ACData.skills[props.index].name : "",
        description: props.edit ? ACData.skills[props.index].description : "",
    });

    const handleClose = () => {
        props.onClose();
    };

    const handleAdd = () => {
        dispatchACData({
            skills: [...ACData.skills, tempSkill],
        });
        handleClose();
    };

    const handleEdit = () => {
        dispatchACData({
            skills: ACData.skills.map((s, i) => {
                if (i === props.index) {
                    return tempSkill;
                }
                return s;
            }),
        });
        handleClose();
    }

    useEffect(() => {
        setTempSkill({
            name: props.edit ? ACData.skills[props.index].name : "",
            description: props.edit ? ACData.skills[props.index].description : "",
        })
    }, [props.open])

    return (
        <Dialog open={props.open} onClose={handleClose} fullWidth>
            <DialogTitle>Skill</DialogTitle>
            <DialogContent>
                <TextField
                    id="skill-name-input"
                    label="Name"
                    fullWidth
                    value={tempSkill.name}
                    onChange={(e) => setTempSkill({ ...tempSkill, name: e.target.value })}
                    sx = {{ mt: 1 }}
                />
                <TextField
                    id="skill-description-input"
                    label="Description"
                    fullWidth
                    multiline
                    rows={8}
                    value={tempSkill.description}
                    onChange={(e) => setTempSkill({ ...tempSkill, description: e.target.value })}
                    sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                {props.edit ? <Button onClick={handleEdit}>Save</Button>: <Button onClick={handleAdd}>Add</Button>}
            </DialogActions>
        </Dialog>
    )
}

const StyledAccordion = styled((props) => (
    <Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: "#f5f5f5",
}));

const SkillAccordion = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    const [editDialogOpen, setEditDialogOpen] = useState(false);

    return (
        <StyledAccordion key={props.index}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
            >
                <Typography>{props.skill.name}</Typography>
            </AccordionSummary>
            <StyledAccordionDetails>
                <Typography>{props.skill.description}</Typography>
            </StyledAccordionDetails>
            <AccordionActions sx={{ backgroundColor: "#f5f5f5" }}>
                <SkillDialog
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    edit
                    index={props.index}
                    display="hidden"
                />
                <IconButton
                    title = "Edit Skill"
                    onClick={() => {
                        setEditDialogOpen(true);
                    }}
                >
                    <Edit />
                </IconButton>
                <IconButton
                    title = "Delete Skill"
                    onClick={() => {
                        dispatchACData({
                            skills: ACData.skills.filter((s, i) => i !== props.index),
                        });
                    }}
                >
                    <Delete />
                </IconButton>
            </AccordionActions>
        </StyledAccordion>
    )
}

const Skills = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    const toolbarRef = useRef(null);
    const [skillDialogOpen, setSkillDialogOpen] = useState(false);

    return (
        <Paper elevation={paperElevation}>
            <Toolbar ref={toolbarRef}>
                <Typography sx={{ flexGrow: 1 }}>
                    Skills
                </Typography>
                <Tooltip title="Add Skill" >
                    <IconButton
                        onClick={() => {
                            setSkillDialogOpen(true);
                        }}
                    >
                        <AddOutlined />
                    </IconButton>
                </Tooltip>
                <SkillDialog
                    open={skillDialogOpen}
                    onClose={() => setSkillDialogOpen(false)}
                    edit={false}
                />
            </Toolbar>
            <Divider />
            <div style={{ height: "400px", overflowY: "auto" }}>
                {Object.keys(ACData.skills).map((s, index) => {
                    const skill = ACData.skills[s];

                    return (
                        <SkillAccordion key={index} skill={skill} index={index} />
                    )
                })}
            </div>
        </Paper>
    )
}

const InventoryAccordion = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    const [editDialogOpen, setEditDialogOpen] = useState(false);

    return (
        <StyledAccordion key={props.index}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
            >
                <Typography>{props.item.name}</Typography>
            </AccordionSummary>
            <StyledAccordionDetails>
                <Typography>{props.item.description}</Typography>
            </StyledAccordionDetails>
            <AccordionActions sx={{ backgroundColor: "#f5f5f5" }}>
                <InventoryDialog
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    edit
                    index={props.index}
                    display="hidden"
                />
                <IconButton
                    title = "Edit Item"
                    onClick={() => {
                        setEditDialogOpen(true);
                    }}
                >
                    <Edit />
                </IconButton>
                <IconButton
                    title = "Delete Item"
                    onClick={() => {
                        dispatchACData({
                            inventory: ACData.inventory.filter((s, i) => i !== props.index),
                        });
                    }}
                >
                    <Delete />
                </IconButton>
            </AccordionActions>
        </StyledAccordion>
    )
}

const InventoryDialog = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    const [tempItem, setTempItem] = useState({
        name: props.edit ? ACData.inventory[props.index].name : "",
        description: props.edit ? ACData.inventory[props.index].description : "",
    });

    const handleClose = () => {
        props.onClose();
    };

    const handleAdd = () => {
        dispatchACData({
            inventory: [...ACData.inventory, tempItem],
        });
        handleClose();
    };

    const handleEdit = () => {
        dispatchACData({
            inventory: ACData.inventory.map((s, i) => {
                if (i === props.index) {
                    return tempItem;
                }
                return s;
            }),
        });
        handleClose();
    }

    useEffect(() => {
        setTempItem({
            name: props.edit ? ACData.inventory[props.index].name : "",
            description: props.edit ? ACData.inventory[props.index].description : "",
        })
    }, [props.open])

    return (
        <Dialog open={props.open} onClose={handleClose} fullWidth>
            <DialogTitle>Inventory Item</DialogTitle>
            <DialogContent>
                <TextField
                    id="inventory-item-name-input"
                    label="Name"
                    fullWidth
                    value={tempItem.name}
                    onChange={(e) => setTempItem({ ...tempItem, name: e.target.value })}
                    sx={{ mt: 1 }}
                />
                <TextField
                    id="inventory-item-description-input"
                    label="Description"
                    fullWidth
                    multiline
                    rows={8}
                    value={tempItem.description}
                    onChange={(e) => setTempItem({ ...tempItem, description: e.target.value })}
                    sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                {props.edit ? <Button onClick={handleEdit}>Save</Button> : <Button onClick={handleAdd}>Add</Button>}
            </DialogActions>
        </Dialog>
    )
}

const Inventory = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    const [inventoryDialogOpen, setInventoryDialogOpen] = useState(false);

    return (
        <Paper elevation={paperElevation}>
            <Toolbar>
                <Typography sx={{ flexGrow: 1 }}>
                    Inventory
                </Typography>
                <Tooltip title="Add Item" >
                    <IconButton
                        onClick={() => {
                            setInventoryDialogOpen(true);
                        }}
                    >
                        <AddOutlined />
                    </IconButton>
                </Tooltip>
                <InventoryDialog
                    open={inventoryDialogOpen}
                    onClose={() => setInventoryDialogOpen(false)}
                    edit={false}
                />
            </Toolbar>
            <Divider />
            <div style={{ height: "400px", overflowY: "auto" }}>
                {Object.keys(ACData.inventory).map((s, index) => {
                    const item = ACData.inventory[s];

                    return (
                        <InventoryAccordion key={index} item={item} index={index} />
                    )
                })}
            </div>
        </Paper>
    )
}

const Money = (props) => {
    const [ACData, dispatchACData] = useContext(ACContext);

    return (
        <Grid2 container columnSpacing={1}>
            <Grid2 xs={4}>
                <Paper elevation={paperElevation}>
                    <FormControl fullWidth>
                        <FormHelperText>Gold</FormHelperText>
                        <TextField
                            id="gold-input"
                            type="number"
                            value={ACData.gold ?? 0}
                            onChange={(e) => { dispatchACData({ gold: 
                                e.target.value === "" ? e.target.value : parseInt(e.target.value)
                            }) }}
                            onBlur={(e) => {
                                if (e.target.value === "") {
                                    dispatchACData({ gold: 0 })
                                }
                            }}
                        />
                    </FormControl>
                </Paper>
            </Grid2>
            <Grid2 xs={4}>
                <Paper elevation={paperElevation}>
                    <FormControl fullWidth>
                        <FormHelperText>Silver</FormHelperText>
                        <TextField
                            id="silver-input"
                            type="number"
                            value={ACData.silver ?? 0}
                            onChange={(e) => { dispatchACData({ silver:
                                e.target.value === "" ? e.target.value : parseInt(e.target.value)
                            }) }}
                            onBlur={(e) => {
                                if (e.target.value === "") {
                                    dispatchACData({ silver: 0 })
                                }
                            }}
                        />
                    </FormControl>
                </Paper>
            </Grid2>
            <Grid2 xs={4}>
                <Paper elevation={paperElevation}>
                    <FormControl fullWidth>
                        <FormHelperText>Copper</FormHelperText>
                        <TextField
                            id="copper-input"
                            type="number"
                            value={ACData.copper ?? 0}
                            onChange={(e) => { dispatchACData({ copper:
                                e.target.value === "" ? e.target.value : parseInt(e.target.value)
                            }) }}
                            onBlur={(e) => {
                                if (e.target.value === "") {
                                    dispatchACData({ copper: 0 })
                                }
                            }}
                        />
                    </FormControl>
                </Paper>
            </Grid2>
        </Grid2>
    )
}

export default function App() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [ACData, dispatchACData] = useReducer(reducer, window.AC.data);
    const [diceHistory, setDiceHistory] = useState([]);

    return (
        <ACContext.Provider value={[ACData, dispatchACData]}>
            <Container disableGutters maxWidth={false} sx={{ maxWidth: "2400px" }}>
                <Box sx={{ bgcolor: "lightgray", minHeight: "100vh", p: theme.spacing(1) }}>
                    <Grid2 container spacing={1} >
                        <Grid2 xs={12} md={6} xl={3} >
                            <Stack spacing={1} >
                                <CharacterName />
                                <CharacterImage />
                                <AgeAndRace />
                                <Faction />
                                <Description />
                            </Stack>
                        </Grid2>
                        <Grid2 xs={12} md={6} xl={3} >
                            <Stack spacing={1} >
                                <Health />
                                <StatBoxes />
                                <Skills />
                            </Stack>
                        </Grid2>
                        <Grid2 xs={12} md={6} xl={3} >
                            <Stack spacing={1} >
                                <Money />
                                <Inventory />
                            </Stack>
                        </Grid2>
                        <Grid2 xs={12} md={6} xl={3} >
                            <Stack spacing={1} >
                                <diceHistoryContext.Provider value={[diceHistory, setDiceHistory]}>
                                    <IconButtonRow />
                                    <DiceHistory />
                                </diceHistoryContext.Provider>
                                <Notes />
                            </Stack>
                        </Grid2>
                    </Grid2>
                </Box>
            </Container>
        </ACContext.Provider>
    )
}