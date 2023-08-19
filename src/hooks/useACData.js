import React from "react";

const useACData = () => {
    const [ACData, setACData] = React.useState(window.AC.data);

    React.useEffect(() => {
        window.AC.data = ACData;
    }, [ACData]);

    return [ACData, setACData];
}

export default useACData;