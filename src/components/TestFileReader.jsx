import React from "react"
import EV from "../Events.js";
import {AC} from "../index.js";

export default function TestFileReader() {
    // create a button that when clicked, reads a file
    // and displays the contents of the file in the console
    // https://developer.mozilla.org/en-US/docs/Web/API/FileReader

    let fileReader = new FileReader();

    const handleFileRead = (e) => {
        const content = fileReader.result;
        console.log(content);

        AC.setFromJson(content);
        EV.emit("dataChanged");
    }

    const handleFileChosen = (file) => {
        if (!file) return;
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
    }

    return (
        <div>
            <input type="file"
                id="file"
                className="input-file"
                accept=".json"
                onChange={e => handleFileChosen(e.target.files[0])}
            />
        </div>
    )
}