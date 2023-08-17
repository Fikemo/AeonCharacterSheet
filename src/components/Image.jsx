import React from 'react'

export default function Image({classes, value, onChange, name}) {
    function importImage(event) {
        console.log(event);
        if (event.target.files.length > 0) {
            console.log(event.target.files);
            if (event.target.files[0].size > 2000000) {
                window.alert("File size must be less than 2MB");
                return;
            }

            const fr = new FileReader();

            fr.onload = function (e) {
                if (e.target?.result && typeof e.target.result === "string") {
                    onChange(name, e.target.result);
                }
            }

            fr.readsAsDataURL(event.target.files[0]);
        }
    }

    let newClasses = "d-and-d-image";
    if (classes) {
        newClasses += classes;
    }

    const elementId = "d-and-d-image-" + name;

    return (
        <div
            className={newClasses}
            style = {{
                backgroundImage: value ? `url(${value})` : undefined
            }}
            onClick={()=>document.getElementById(elementId)?.click()}
        >
            <input
                style={{display: "none"}}
                type="file"
                id={elementId}
                accept="image/*"
                onChange={(e)=>importImage(e)}
            />
        </div>
    )
}