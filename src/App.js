import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

export default function App() {
  return (
    <div>
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button 
                variant="contained"
                color="primary"
                onClick={() => console.log("Save")}
                startIcon={<SaveIcon />}
            >
                Save
            </Button>
            <Button 
                variant="contained"
                color="error"
                onClick={() => console.log("Discard")}
                startIcon={<DeleteIcon />}
            >
                Discard
            </Button>
        </ButtonGroup>
    </div>
  );
}
