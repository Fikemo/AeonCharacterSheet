import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const DiceCanvas = () => {
    const canvasRef = useRef();

    useEffect(() => {
        console.log('DiceCanvas component mounted!');
        // Create a scene
        const scene = window.scene;

        // Create a camera
        const camera = window.camera;

        // Create a renderer with a transparent background
        const renderer = window.renderer;

        // Add the renderer canvas to the component
        canvasRef.current.appendChild(renderer.domElement);

        // Set the canvas position to absolute and fill the window
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';

        // Make the canvas non-interactable
        renderer.domElement.style.pointerEvents = 'none';

        // Cleanup
        return () => {
            console.log('DiceCanvas component unmounted!');
        };
    }, []);

    return (<div ref={canvasRef} />);
};

export default DiceCanvas;
