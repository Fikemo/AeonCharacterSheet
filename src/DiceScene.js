import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { threeToCannon, ShapeType } from 'three-to-cannon';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import Events from './Events.js';

const diceMass = 0.1;
const gravity = -50;
const groundFriction = 100;
const models = {}

window.THREE = THREE;

const indexPairs = {
    d4: {
        0: 4,
        1: 2,
        2: 3,
        3: 1,
    },
    d6: {
        0: 1,
        1: 6,
        2: 2,
        3: 5,
        4: 4,
        5: 3,
    },
    d8: {
        0: 3,
        1: 6,
        2: 2,
        3: 1,
        4: 8,
        5: 7,
        6: 5,
        7: 4,
    },
    d10: {
        0: 2,
        1: 8,
        2: 10,
        3: 4,
        4: 6,
        5: 9,
        6: 5,
        7: 3,
        8: 7,
        9: 1,
    },
    d12: {
        0:  5,
        1:  3,
        2:  10,
        3:  8,
        4:  1,
        5:  9,
        6:  4,
        7:  12,
        8:  6,
        9:  2,
        10: 11,
        11: 7,
    },
    d20: {
        0:  5,
        1:  7,
        2:  11,
        3:  19,
        4:  2,
        5:  10,
        6:  14,
        7:  16,
        8:  15,
        9:  12,
        10: 9,
        11: 6,
        12: 13,
        13: 1,
        14: 20,
        15: 8,
        16: 18,
        17: 4,
        18: 17,
        19: 3,
    },
}

const loadModels = () => {
    const loader = new GLTFLoader();
    const diceNames = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
    const URLs = [
        new URL('./assets/d4.glb', import.meta.url),
        new URL('./assets/d6.glb', import.meta.url),
        new URL('./assets/d8.glb', import.meta.url),
        new URL('./assets/d10.glb', import.meta.url),
        new URL('./assets/d12.glb', import.meta.url),
        new URL('./assets/d20.glb', import.meta.url),
    ];
    const LODURLs = [
        new URL('./assets/d4LOD.glb', import.meta.url),
        new URL('./assets/d6LOD.glb', import.meta.url),
        new URL('./assets/d8LOD.glb', import.meta.url),
        new URL('./assets/d10LOD.glb', import.meta.url),
        new URL('./assets/d12LOD.glb', import.meta.url),
        new URL('./assets/d20LOD.glb', import.meta.url),
    ];

    for (let i = 0; i < URLs.length; i++) {
        const URL = URLs[i];
        const LODURL = LODURLs[i];
        const diceName = diceNames[i];
        loader.load(URL + '', (gltf) => {
            const model = gltf.scene.children[0];
            model.name = diceName;
            model.position.set(0, 0, 0);
            model.rotation.set(0, 0, 0);
            models[diceName] = model;
        }, undefined, error => {
            console.error(error);
        }
        );

        loader.load(LODURL + '', (gltf) => {
            const model = gltf.scene.children[0];
            model.name = diceName;
            model.position.set(0, 0, 0);
            model.rotation.set(0, 0, 0);
            models[diceName + 'LOD'] = model;
        });
    }
}

loadModels();

const debugSphereMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
const debugHighestSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

export default class DiceScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 10, 0);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = 0;
        this.renderer.domElement.style.left = 0;
        this.renderer.domElement.style.pointerEvents = 'none';
        document.body.appendChild(this.renderer.domElement);

        // Add Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);

        // Add Directional Light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(-2, 5, -1);
        directionalLight.lookAt(0, 0, 0);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        directionalLight.shadow.mapSize.width = 1024 * 4;
        this.scene.add(directionalLight);

        // Add Overhead Directional Light
        const overheadLight = new THREE.DirectionalLight(0xffffff, 1);
        overheadLight.position.set(0, 5, 0);
        overheadLight.lookAt(0, 0, 0);
        this.scene.add(overheadLight);

        // Cache the dice
        this.dice = [];

        // Create Physics World
        this.physicsWorld = new CANNON.World({
            gravity: new CANNON.Vec3(0, gravity, 0),
            allowSleep: true,
        });

        // Create the Physics Ground Plane
        const groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
            material: new CANNON.Material({ friction: groundFriction }),
        });
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.physicsWorld.addBody(groundBody);

        // Create the Visual Ground Plane
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.receiveShadow = true;
        groundMesh.rotation.x = -Math.PI / 2;
        this.scene.add(groundMesh);

        // Scale the plane to fill the screen

        document.body.appendChild(this.renderer.domElement);

        this.models = models;

        // this.cannonDebugger = new CannonDebugger(this.scene, this.physicsWorld, { color: 0xff0000 });

        this.lastTimestamp = 0;
        this.animate = this.animate.bind(this);
        this.animate(0);
    }

    animate(timestamp) {
        if (this.lastTimestamp === 0) this.lastTimestamp = timestamp;
        const delta = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        // Step the physics world
        this.physicsWorld.step(1 / 60, delta / 1000, 3);
        this.cannonDebugger?.update();

        // Update the dice
        for (const die of this.dice) {
            die.mesh.position.copy(die.body.position);
            die.mesh.quaternion.copy(die.body.quaternion);

            if (die.mesh.children[0] && die.mesh.children[0].children) {
                const child = die.mesh.children[0];
                const grandChildren = child.children;

                // Find grandchild with highest y value
                let highestY = -Infinity;
                let highestYIndex = -1;
                for (let i = 0; i < grandChildren.length; i++) {
                    const grandChild = grandChildren[i];
                    const worldY = grandChild.getWorldPosition(new THREE.Vector3()).y;
                    if (worldY > highestY) {
                        highestY = worldY;
                        highestYIndex = i;
                    }
                }

                // Set the highest grandchild to red
                for (let i = 0; i < grandChildren.length; i++) {
                    const grandChild = grandChildren[i];
                    if (i === highestYIndex) {
                        grandChild.material = debugHighestSphereMaterial;
                    } else {
                        grandChild.material = debugSphereMaterial;
                    }
                }
            }
        }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate);
    }

    throwDie(dieName) {
        const model = this.models[dieName];
        const modelLOD = this.models[dieName + 'LOD'];

        const mesh = model.clone();
        const meshLOD = modelLOD.clone();
        meshLOD.geometry = BufferGeometryUtils.mergeVertices(meshLOD.geometry);

        const meshChild = new THREE.Object3D();
        mesh.add(meshChild);

        switch (dieName) {
            case 'd4':
                meshChild.add(...this.debugSpheresFromVertices(this.generateTetrahedronVertices()));
                break;
            case 'd6':
                meshChild.add(...this.debugSpheresFromVertices(this.generateOctahedronVertices()));
                break;
            case 'd8':
                meshChild.add(...this.debugSpheresFromVertices(this.generateCubeVertices()));
                break;
            case 'd10':
                meshChild.rotateY(Math.PI / 2);
                meshChild.add(...this.debugSpheresFromVertices(this.generatePentagonalPrismVertices(1, 1)));
                break;
            case 'd12':
                meshChild.add(...this.debugSpheresFromVertices(this.generateIcosahedronVertices()));
                break;
            case 'd20':
                meshChild.add(...this.debugSpheresFromVertices(this.generateDodecahedronVertices()));
                break;
            default:
                console.error('Invalid die name');
                return;
        }

        const shape = threeToCannon(meshLOD, {
            type: ShapeType.HULL
        }).shape;
        const body = new CANNON.Body({
            mass: diceMass,
            sleepSpeedLimit: 1,
            sleepTimeLimit: 0.5,
            shape: shape,
            material: new CANNON.Material({ friction: 0.5, restitution: 0.7 }),
        });
        body.quaternion.setFromEuler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        body.position.set(0, 5, 0);
        body.angularVelocity.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        );
        this.physicsWorld.addBody(body);

        mesh.castShadow = true;
        mesh.receiveShadow = false;
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
        this.scene.add(mesh);

        const die = {
            mesh,
            body,
            LOD: meshLOD,
        };

        body.addEventListener('sleep', () => {
            body.type = CANNON.Body.STATIC;

            // Find grandchild with highest y value
            let highestY = -Infinity;
            let highestYIndex = -1;
            const grandChildren = mesh.children[0].children;
            for (let i = 0; i < grandChildren.length; i++) {
                const grandChild = grandChildren[i];
                const worldY = grandChild.getWorldPosition(new THREE.Vector3()).y;
                if (worldY > highestY) {
                    highestY = worldY;
                    highestYIndex = i;
                }
            }

            Events.emit('dieRoll', { value: indexPairs[dieName]?.[highestYIndex] ?? highestYIndex, sides: "D" + dieName.slice(1) });

            setTimeout(() => {
                this.scene.remove(mesh);
                this.physicsWorld.removeBody(body);
                this.dice.splice(this.dice.indexOf(die), 1);
            }, 1000);
        });

        this.dice.push(die);
    }

    generateTetrahedronVertices() {
        if (!this.models.d4LOD) return console.error('No d4LOD model found');

        if (this.tetrahedronVertices) return this.tetrahedronVertices;

        const vertices = [];

        let tetrahedronGeometry = this.models.d4LOD.geometry;
        const tetrahedronVertices = tetrahedronGeometry.attributes.position.array;

        for (let i = 0; i < tetrahedronVertices.length; i += 3) {
            const x = tetrahedronVertices[i];
            const y = tetrahedronVertices[i + 1];
            const z = tetrahedronVertices[i + 2];

            if (vertices.find(vertex => vertex.x === x && vertex.y === y && vertex.z === z)) continue;
            vertices.push(new THREE.Vector3(x, y, z));
        }

        this.tetrahedronVertices = vertices;
        return vertices;
    }

    generateCubeVertices() {
        if (!this.models.d6LOD) return console.error('No d6LOD model found');

        if (this.cubeVertices) return this.cubeVertices;

        const vertices = [];

        let cubeGeometry = this.models.d6LOD.geometry;
        const cubeVertices = cubeGeometry.attributes.position.array;

        for (let i = 0; i < cubeVertices.length; i += 3) {
            const x = cubeVertices[i];
            const y = cubeVertices[i + 1];
            const z = cubeVertices[i + 2];

            if (vertices.find(vertex => vertex.x === x && vertex.y === y && vertex.z === z)) continue;
            vertices.push(new THREE.Vector3(x, y, z));
        }

        this.cubeVertices = vertices;
        return vertices;
    }

    generateOctahedronVertices() {
        if (!this.models.d8LOD) return console.error('No d8LOD model found');

        if (this.octahedronVertices) return this.octahedronVertices;

        const vertices = [];

        let octahedronGeometry = this.models.d8LOD.geometry;
        const octahedronVertices = octahedronGeometry.attributes.position.array;

        for (let i = 0; i < octahedronVertices.length; i += 3) {
            const x = octahedronVertices[i];
            const y = octahedronVertices[i + 1];
            const z = octahedronVertices[i + 2];

            if (vertices.find(vertex => vertex.x === x && vertex.y === y && vertex.z === z)) continue;
            vertices.push(new THREE.Vector3(x, y, z));
        }

        this.octahedronVertices = vertices;
        return vertices;
    }

    generatePentagonalPrismVertices(radius, height) {
        if (this.pentagonalPrismVertices) return this.pentagonalPrismVertices;

        const vertices = [];

        // Calculate the coordinates for the bottom pentagon
        for (let i = 0; i < 5; i++) {
            const angle = (i * 72 * Math.PI) / 180; // 72 degrees between each point
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            vertices.push(new THREE.Vector3(x, -height / 2, y));
        }

        // Calculate the coordinates for the top pentagon with a 36-degree rotation
        for (let i = 0; i < 5; i++) {
            const angle = ((i * 72 + 36) * Math.PI) / 180; // 72 degrees between each point
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            vertices.push(new THREE.Vector3(x, height / 2, y));
        }

        this.pentagonalPrismVertices = vertices;
        return vertices;
    }

    generateDodecahedronVertices() {
        if (!this.models.d12LOD) return console.error('No d12LOD model found');

        if (this.dodecahedronVertices) return this.dodecahedronVertices;

        const vertices = [];

        let dodecahedronGeometry = this.models.d12LOD.geometry;
        const dodecahedronVertices = dodecahedronGeometry.attributes.position.array;

        for (let i = 0; i < dodecahedronVertices.length; i += 3) {
            const x = dodecahedronVertices[i];
            const y = dodecahedronVertices[i + 1];
            const z = dodecahedronVertices[i + 2];

            if (vertices.find(vertex => vertex.x === x && vertex.y === y && vertex.z === z)) continue;
            vertices.push(new THREE.Vector3(x, y, z));
        }

        this.dodecahedronVertices = vertices;
        return vertices;
    }

    generateIcosahedronVertices() {
        if (!this.models.d20LOD) return console.error('No d20LOD model found');

        if (this.icosahedronVertices) return this.icosahedronVertices;

        const vertices = [];

        let icosahedronGeometry = this.models.d20LOD.geometry;
        const icosahedronVertices = icosahedronGeometry.attributes.position.array;

        for (let i = 0; i < icosahedronVertices.length; i += 3) {
            const x = icosahedronVertices[i];
            const y = icosahedronVertices[i + 1];
            const z = icosahedronVertices[i + 2];

            if (vertices.find(vertex => vertex.x === x && vertex.y === y && vertex.z === z)) continue;
            vertices.push(new THREE.Vector3(x, y, z));
        }

        this.icosahedronVertices = vertices;
        return vertices;
    }

    debugSpheresFromVertices(vertices, visible = false) {
        const spheres = [];
        for (const vertex of vertices) {
            const sphere = visible ? new THREE.Mesh(new THREE.SphereGeometry(0.1), debugSphereMaterial) : new THREE.Object3D();
            sphere.position.copy(vertex);
            spheres.push(sphere);
        }

        return spheres;
    }
}