import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import factions from "../sets/factions.json";

// icons
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { ACContext } from "../App.js";

export default function CharacterAppBar() {
    const [ACData, setACData] = React.useContext(ACContext);
    const [editingName, setEditingName] = React.useState(false);

    const fileInputRef = React.useRef(null);

    React.useEffect(() => {
        if (editingName) {
            document.getElementById('name-input').focus();
        }
    }, [editingName]);

    const fileReader = new FileReader();

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // console.log("selected file: ", file);

            fileReader.onload = (e) => {
                const json = JSON.parse(e.target.result);
                setACData(json);
            }
            fileReader.readAsText(file);
        }
    }

    const handleFileUploadButtonClicked = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleFileDownloadButtonClicked = () => {
        // Download window.AC.data as a JSON file
        const jsonData = JSON.stringify(window.AC.data);
        const blob = new Blob([jsonData], {type: 'application/json'});
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
        <Box sx={{ flexGrow: 1, paddingBottom: 2}}>
            <AppBar position="static">
                <Toolbar>
                    {!editingName && <Typography
                        sx={{ flexGrow: 1 }}
                        onClick={() => {
                            setEditingName(true);
                        }}
                    >
                        {ACData.name || 'Enter Character Name'}
                    </Typography>}
                    {editingName && <TextField
                        id="name-input"
                        sx={{flexGrow: 1, color: 'white'}}
                        placeholder='Character Name'
                        inputProps={
                            {style: {color: 'white'}}
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.target.blur();
                            }
                        }}
                        onBlur={(e) => {
                            setACData({...ACData, name: e.target.value});
                            setEditingName(false);
                        }}
                        onChange={(e) => {
                            setACData({...ACData, name: e.target.value});
                        }}
                        value={ACData.name || ''}
                    />}

                    <FormControl sx={{ m: 1, minWidth: 120, width: 300}}>
                        <InputLabel id="faction-select-label" style={{color: 'white'}}>Faction</InputLabel>
                        <Select
                            labelId="faction-select-label"
                            id="faction-select"
                            value={ACData.faction || ''}
                            label="Faction"
                            style={{color: 'white'}}
                            MenuProps={{
                                anchorOrigin: {
                                    vertical: "bottom",
                                    horizontal: "left"
                                },
                                transformOrigin: {
                                    vertical: "top",
                                    horizontal: "left"
                                },
                                getContentAnchorEl: null,
                                PaperProps: {
                                    style: {
                                        maxHeight: 48 * 4.5,
                                        width: 'auto',
                                        color: 'black'
                                    },
                                },
                            }}
                            onChange={(e) => {
                                setACData({...ACData, faction: e.target.value});
                            }}
                        >
                            {Object.keys(factions).map((faction) => {
                                return (
                                    <MenuItem key={faction} value={faction} style={{color: 'black'}}>{faction}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>

                    <input
                        ref={fileInputRef}
                        accept=".json"
                        id="file-upload-button"
                        type="file"
                        style={{display: 'none'}}
                        onChange={handleFileInputChange}
                    />
                    <Tooltip title="Upload">
                        <IconButton
                            color="inherit"
                            aria-label='upload'
                            onClick={handleFileUploadButtonClicked}
                        >
                            <FileUploadIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                        <IconButton
                            color="inherit"
                            aria-label='download'
                            onClick={handleFileDownloadButtonClicked}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
        </Box>
    )
}