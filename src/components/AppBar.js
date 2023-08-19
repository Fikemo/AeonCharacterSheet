import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import useACData from '../hooks/useACData.js';

// icons
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default function CharacterAppBar() {
    const [ACData, setACData] = useACData();
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
            console.log("selected file: ", file);

            fileReader.onload = (e) => {
                const json = JSON.parse(e.target.result);
                console.log("json: ", json);
                setACData(json);
            }
            fileReader.readAsText(file);
        }
    }

    // Proxy the click event to the hidden file input element
    const handleFileUploadButtonClicked = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    return (
        <Box sx={{ flexGrow: 1}}>
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
                        value={ACData.name}
                    />}
                    <input
                        ref={fileInputRef}
                        accept=".json"
                        id="file-upload-button"
                        type="file"
                        style={{display: 'none'}}
                        onChange={handleFileInputChange}
                    />
                    <IconButton
                        color="inherit"
                        aria-label='upload'
                        title="upload"
                        onClick={handleFileUploadButtonClicked}
                    >
                        <FileUploadIcon />
                    </IconButton>
                    <IconButton color="inherit" aria-label='download' title="download">
                        <FileDownloadIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    )
}