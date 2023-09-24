import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { threeToCannon, ShapeType } from 'three-to-cannon';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

const diceMass = 100;
const gravity = -80;
const models = {}

window.THREE = THREE;

const loadModels = () => {
    const loader = new GLTFLoader();

    //d4
    const d4URL = new URL('./assets/d4.glb', import.meta.url);
    loader.load(
        // resource URL
        d4URL + '',
        // called when the resource is loaded
        (gltf) => {
            models.d4 = gltf.scene.children[0];
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error(error)
        }
    );

    const d4LODURL = new URL('./assets/d4LOD.glb', import.meta.url);
    loader.load(
        // resource URL
        d4LODURL + '',
        // called when the resource is loaded
        (object) => {
            models.d4LOD = object.scene.children[0];
            console.log(object);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error(error)
        }
    );

    //d6
    const d6URL = new URL('./assets/d6.glb', import.meta.url);
    loader.load(
        // resource URL
        d6URL + '',
        // called when the resource is loaded
        (gltf) => {
            models.d6 = gltf.scene.children[0];
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error(error)
        }
    );

    const d6LODURL = new URL('./assets/d6LOD.glb', import.meta.url);
    loader.load(
        // resource URL
        d6LODURL + '',
        // called when the resource is loaded
        (object) => {
            models.d6LOD = object.scene.children[0];
            console.log(object);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error(error)
        }
    );

    //d8
    const d8URL = new URL('./assets/d8.glb', import.meta.url);
    loader.load(
        // resource URL
        d8URL + '',
        // called when the resource is loaded
        (gltf) => {
            models.d8 = gltf.scene.children[0];
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error(error)
        }
    );

    const d8LODURL = new URL('./assets/d8LOD.glb', import.meta.url);
    loader.load(
        // resource URL
        d8LODURL + '',
        // called when the resource is loaded
        (object) => {
            models.d8LOD = object.scene.children[0];
            console.log(object);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error(error)
        }
    );

    //d10
    const d10URL = new URL('./assets/d10.glb', import.meta.url);
    loader.load(
        // resource URL
        d10URL + '',
        // called when the resource is loaded
        (gltf) => {
            models.d10 = gltf.scene.children[0];
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error(error)
        }
    );

    const d10LODURL = new URL('./assets/d10LOD.glb', import.meta.url);
    loader.load(
        // resource URL
        d10LODURL + '',
        // called when the resource is loaded
        (object) => {
            models.d10LOD = object.scene.children[0];
            console.log(object);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error(error)
        }
    );

    //d12
    const d12URL = new URL('./assets/d12.glb', import.meta.url);
    loader.load(
        // resource URL
        d12URL + '',
        // called when the resource is loaded
        (gltf) => {
            models.d12 = gltf.scene.children[0];
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error(error)
        }
    );

    const d12LODURL = new URL('./assets/d12LOD.glb', import.meta.url);
    loader.load(
        // resource URL
        d12LODURL + '',
        // called when the resource is loaded
        (object) => {
            models.d12LOD = object.scene.children[0];
            console.log(object);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error(error)
        }
    );

    //d20
    const d20URL = new URL('./assets/d20.glb', import.meta.url);
    loader.load(
        // resource URL
        d20URL + '',
        // called when the resource is loaded
        (gltf) => {
            models.d20 = gltf.scene.children[0];
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error(error)
        }
    );

    const d20LODURL = new URL('./assets/d20LOD.glb', import.meta.url);
    loader.load(
        // resource URL
        d20LODURL + '',
        // called when the resource is loaded
        (object) => {
            models.d20LOD = object.scene.children[0];
            console.log(object);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error(error)
        }
    );
}

loadModels();

const debugSphereMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
const debugSpecialSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

export default class DiceSceneCOPY {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.y = 10;
        this.camera.rotation.x = -Math.PI / 2;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
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

        // Add orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight();
        directionalLight.position.set(-2, 5, -1);
        directionalLight.lookAt(0, 0, 0);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;

        this.scene.add(ambientLight);
        this.scene.add(directionalLight);

        // Cache the dice
        this.dice = [];

        // Create a physics world
        this.physicsWorld = new CANNON.World({
            gravity: new CANNON.Vec3(0, gravity, 0),
            allowSleep: true,
        });

        // Create a ground plane
        const groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
            material: new CANNON.Material({ friction: 10 }),
        })
        // rotate ground body by 90 degrees
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        // increase the friction of the ground plane
        this.physicsWorld.addBody(groundBody);
        this.cannonDebugger = new CannonDebugger(this.scene, this.physicsWorld, { color: 0x0ff0000 });

        // create a visual ground plane
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        // Transparent material so we can see the shadow
        const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.receiveShadow = true;
        groundMesh.rotation.x = -Math.PI / 2;
        this.scene.add(groundMesh);

        // Scale the plane to fill the screen
        const scale = window.innerHeight / 10;
        groundMesh.scale.set(scale, scale, scale);

        // Four wall planes
        // const rightWallBody = new CANNON.Body({
        //     type: CANNON.Body.STATIC,
        //     shape: new CANNON.Plane(),
        // });
        // rightWallBody.quaternion.setFromEuler(0, -Math.PI / 2, 0);
        // rightWallBody.position.x = 5;
        // this.physicsWorld.addBody(rightWallBody);

        // const leftWallBody = new CANNON.Body({
        //     type: CANNON.Body.STATIC,
        //     shape: new CANNON.Plane(),
        // });
        // leftWallBody.quaternion.setFromEuler(0, Math.PI / 2, 0);
        // leftWallBody.position.x = -5;
        // this.physicsWorld.addBody(leftWallBody);

        // const topWallBody = new CANNON.Body({
        //     type: CANNON.Body.STATIC,
        //     shape: new CANNON.Plane(),
        // });
        // topWallBody.position.z = -5;
        // this.physicsWorld.addBody(topWallBody);

        // const bottomWallBody = new CANNON.Body({
        //     type: CANNON.Body.STATIC,
        //     shape: new CANNON.Plane(),
        // });
        // bottomWallBody.quaternion.setFromEuler(0, Math.PI, 0);
        // bottomWallBody.position.z = 5;
        // this.physicsWorld.addBody(bottomWallBody);

        document.body.appendChild(this.renderer.domElement);

        this.models = models;

        this.lastTimestamp = 0;
        this.animate = this.animate.bind(this);
        this.animate();

    }

    animate(timestamp) {
        requestAnimationFrame(this.animate);

        if (this.lastTimestamp === 0) {
            this.lastTimestamp = timestamp;
        }
        const delta = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        if (this.cube && this.cube.isSpinning) {
            this.cube.rotation.x += this.cube.xSpinDirection * this.cube.spinSpeed * delta / 1000;
            this.cube.rotation.y += this.cube.ySpinDirection * this.cube.spinSpeed * delta / 1000;

            setTimeout(() => {
                this.cube.isSpinning = false;
            }, 1000);
        } else if (this.cube) {
            // Find the face that is closest to the camera
        }

        // Step the physics world
        this.physicsWorld.fixedStep();
        // Update the cannon debugger
        this.cannonDebugger?.update();

        for (const die of this.dice) {
            die.position.copy(die.body.position);
            die.quaternion.copy(die.body.quaternion);

            // If the die has stopped moving, set it to static
            if (die.body.velocity.length() < 0.01 && die.body.angularVelocity.length() < 0.01) {
                if (!die.stoppedMoving) {

                }

                die.stoppedMoving = true;
            }

            if (die.children.length > 0) {
                const child = die.children[0];
                const grandChildren = child.children;

                // Get grandchild with highest world y value
                let maxY = -Infinity;
                let maxIndex = 0;
                for (let i = 0; i < grandChildren.length; ++i) {
                    const grandChild = grandChildren[i];
                    const worldY = grandChild.getWorldPosition(new THREE.Vector3()).y;
                    if (worldY > maxY) {
                        maxY = worldY;
                        maxIndex = i;
                    }
                }
                for (let i = 0; i < grandChildren.length; ++i) {
                    const grandChild = grandChildren[i];
                    if (i === maxIndex) {
                        grandChild.material = debugSpecialSphereMaterial;
                    } else {
                        grandChild.material = debugSphereMaterial;
                    }
                }
            }
        }

        this.controls.update();

        this.renderer.render(this.scene, this.camera);
    }

    createShapeFromGeometry(geometry) {
        const position = geometry.attributes.position.array;
        const geomFaces = geometry.index.array;

        const vertices = [];
        for (let i = 0; i < position.length; i += 3) {
            const x = position[i];
            const y = position[i + 1];
            const z = position[i + 2];
            vertices.push(new CANNON.Vec3(x, y, z));
        }
        const faces = [];
        for (let i = 0; i < geomFaces.length; i += 3) {
            faces.push([geomFaces[i], geomFaces[i + 1], geomFaces[i + 2]]);
        }

        return new CANNON.ConvexPolyhedron({ vertices, faces });
    }

    spawnPhysicalDie(mesh) {
        if (this.dice.length > 10 || !mesh || !mesh.body) return;
        const body = mesh.body;
        body.position.set(0, 5, 0);

        // Give the die a random rotation
        const x = Math.random() * 2 * Math.PI;
        const y = Math.random() * 2 * Math.PI;
        const z = Math.random() * 2 * Math.PI;
        body.quaternion.setFromEuler(x, y, z);
        // Give the die a random spin and velocity
        body.angularVelocity.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
        // body.velocity.set((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20);

        this.dice.push(mesh);
        this.scene.add(mesh);
        this.physicsWorld.addBody(body);

        // setTimeout(() => {
        //     // Remove and delete the icosahedron
        //     this.scene.remove(mesh);
        //     this.physicsWorld.removeBody(body);
        //     this.dice.splice(this.dice.indexOf(mesh), 1);
        // }, 5000);
    }

    spawnPhysicalTetrahedron() {
        if (this.dice.length > 10) return;

        // Create a visual tetrahedron
        let geometry = new THREE.TetrahedronGeometry();
        geometry = BufferGeometryUtils.mergeVertices(geometry);
        const material = new THREE.MeshLambertMaterial();
        const tetrahedronMesh = new THREE.Mesh(geometry, material);
        tetrahedronMesh.castShadow = true;

        // Create a physical tetrahedron
        const tetraShape = this.createShapeFromGeometry(geometry);

        const tetrahedronBody = new CANNON.Body({
            mass: diceMass,
            shape: tetraShape,
            collisionFilterGroup: 2,
            collisionFilterMask: 1,
        });

        // Link the visual tetrahedron to the physical tetrahedron
        tetrahedronMesh.body = tetrahedronBody;
        // Link the physical tetrahedron to the visual tetrahedron
        tetrahedronBody.visualref = tetrahedronMesh;

        this.spawnPhysicalDie(tetrahedronMesh);
    }

    spawnPhysicalCube() {
        if (this.dice.length > 10) return;

        // Create a physical cube and set it at y = 10
        const cubeBody = new CANNON.Body({
            mass: diceMass,
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
            collisionFilterGroup: 2,
            collisionFilterMask: 1,
        });

        // Create a visual cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshLambertMaterial();
        const cubeMesh = new THREE.Mesh(geometry, material);
        cubeMesh.castShadow = true;

        // Link the visual cube to the physical cube
        cubeMesh.body = cubeBody;
        // Link the physical cube to the visual cube
        cubeBody.visualref = cubeMesh;

        this.spawnPhysicalDie(cubeMesh);
    }

    spawnPhysicalOctahedron() {
        if (this.dice.length > 10) return;

        // Create a visual octahedron
        let geometry = new THREE.OctahedronGeometry();
        geometry = BufferGeometryUtils.mergeVertices(geometry);
        const material = new THREE.MeshLambertMaterial();
        const octahedronMesh = new THREE.Mesh(geometry, material);
        octahedronMesh.castShadow = true;

        // Create a physical octahedron
        const octaShape = this.createShapeFromGeometry(geometry);

        const octahedronBody = new CANNON.Body({
            mass: diceMass,
            shape: octaShape,
            collisionFilterGroup: 2,
            collisionFilterMask: 1,
        });

        // Link the visual octahedron to the physical octahedron
        octahedronMesh.body = octahedronBody;
        // Link the physical octahedron to the visual octahedron
        octahedronBody.visualref = octahedronMesh;

        this.spawnPhysicalDie(octahedronMesh);
    }

    spawnPhysicalDodecahedron() {
        if (this.dice.length > 10) return;

        // Create a visual dodecahedron
        let geometry = new THREE.DodecahedronGeometry();
        geometry = BufferGeometryUtils.mergeVertices(geometry);
        const material = new THREE.MeshLambertMaterial();
        const dodecahedronMesh = new THREE.Mesh(geometry, material);
        dodecahedronMesh.castShadow = true;

        // Create a physical dodecahedron
        const dodecaShape = this.createShapeFromGeometry(geometry);

        const dodecahedronBody = new CANNON.Body({
            mass: diceMass,
            shape: dodecaShape,
            collisionFilterGroup: 2,
            collisionFilterMask: 1,
        });

        // Link the visual dodecahedron to the physical dodecahedron
        dodecahedronMesh.body = dodecahedronBody;
        // Link the physical dodecahedron to the visual dodecahedron
        dodecahedronBody.visualref = dodecahedronMesh;

        this.spawnPhysicalDie(dodecahedronMesh);
    }

    spawnPhysicalIcosahedron() {
        if (this.dice.length > 10) return;

        // Create a visual icosahedron
        let geometry = new THREE.IcosahedronGeometry(1, 0);
        geometry = BufferGeometryUtils.mergeVertices(geometry);
        const material = new THREE.MeshLambertMaterial();
        const icosahedronMesh = new THREE.Mesh(geometry, material);
        icosahedronMesh.castShadow = true;

        // Create a physical icosahedron
        const icosaShape = this.createShapeFromGeometry(geometry);

        const icosahedronBody = new CANNON.Body({
            mass: diceMass,
            shape: icosaShape,
            collisionFilterGroup: 2,
            collisionFilterMask: 1,
        });

        // Link the visual icosahedron to the physical icosahedron
        icosahedronMesh.body = icosahedronBody;
        // Link the physical icosahedron to the visual icosahedron
        icosahedronBody.visualref = icosahedronMesh;

        this.spawnPhysicalDie(icosahedronMesh);
    }

    spawnPhysicalPentagonalTrapezohedron() {
        const sides = 10;
        const radius = 1;
        const vertices = [
            [0, 0, 1],
            [0, 0, -1],
        ].flat();

        for (let i = 0; i < sides; ++i) {
            const b = (i * Math.PI * 2) / sides;
            vertices.push(-Math.cos(b), -Math.sin(b), 0.105 * (i % 2 ? 1 : -1));
        }

        const faces = [
            [0, 2, 3],
            [0, 3, 4],
            [0, 4, 5],
            [0, 5, 6],
            [0, 6, 7],
            [0, 7, 8],
            [0, 8, 9],
            [0, 9, 10],
            [0, 10, 11],
            [0, 11, 2],
            [1, 3, 2],
            [1, 4, 3],
            [1, 5, 4],
            [1, 6, 5],
            [1, 7, 6],
            [1, 8, 7],
            [1, 9, 8],
            [1, 10, 9],
            [1, 11, 10],
            [1, 2, 11],
        ].flat();

        const args = [vertices, faces, radius, 0];
        let geometry = new THREE.PolyhedronGeometry(...args);
        geometry = BufferGeometryUtils.mergeVertices(geometry);
        const material = new THREE.MeshLambertMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;

        const shape = this.createShapeFromGeometry(geometry);

        const body = new CANNON.Body({
            mass: diceMass,
            shape: shape,
            collisionFilterGroup: 2,
            collisionFilterMask: 1,
        });

        // Link the visual mesh to the physical body
        mesh.body = body;
        // Link the physical body to the visual mesh
        body.visualref = mesh;

        this.dice.push(mesh);
        console.log(mesh);

        this.spawnPhysicalDie(mesh);
    }

    spawnD4FromModel(callback) {
        if (this.dice.length > 10) return;

        const d4 = models.d4.clone();
        d4.castShadow = true;
        const d4Child = new THREE.Object3D();
        d4.add(d4Child);
        d4Child.add(...this.debugSheresFromVertices(this.generateTetrahedronVertices()));
        const d4LOD = models.d4LOD.clone();

        // const shapeLOD = this.createShapeFromGeometry(d4LOD.geometry);
        const shapeLOD = threeToCannon(d4LOD, { type: ShapeType.HULL }).shape;

        const bodyLOD = new CANNON.Body({
            mass: diceMass,
            shape: shapeLOD,
            sleepSpeedLimit: 1.0,
            sleepTimeLimit: 0.5,
            // collisionFilterGroup: 2,
            // collisionFilterMask: 1,
        });

        bodyLOD.addEventListener('sleep', (e) => {
            const indexMatchUps = [
                1,
                2,
                3,
                4
            ]

            e.target.shapes[0].computeWorldFaceNormals(e.target.quaternion);
            // Find the world face normal that is pointed most down
            const worldFaceNormals = e.target.shapes[0].worldFaceNormals;
            let maxDot = 0;
            let maxFace = null;
            let maxIndex = 0;
            for (let i = 0; i < worldFaceNormals.length; ++i) {
                const face = worldFaceNormals[i];
                const dot = face.dot(new CANNON.Vec3(0, -1, 0));
                if (dot > maxDot) {
                    maxDot = dot;
                    maxFace = face;
                    maxIndex = i;
                }
            }
            console.log(maxFace, maxIndex, indexMatchUps[maxIndex]);

            if (callback) {
                callback(indexMatchUps[maxIndex]);
            }

            setTimeout(() => {
                // Remove and delete the icosahedron
                this.scene.remove(d4);
                this.physicsWorld.removeBody(bodyLOD);
                this.dice.splice(this.dice.indexOf(d4), 1);
            }, 1000);
        });

        // Link the visual mesh to the physical body
        d4.body = bodyLOD;
        // Link the physical body to the visual mesh
        bodyLOD.visualref = d4;

        console.log(d4);

        this.spawnPhysicalDie(d4);
    }

    spawnD6FromModel(callback) {
        if (this.dice.length > 10) return;

        const d6 = models.d6.clone();
        const d6Child = new THREE.Object3D();
        d6.add(d6Child);
        d6Child.add(...this.debugSheresFromVertices(this.generateOctahedronVertices()));
        d6.castShadow = true;
        const d6LOD = models.d6LOD.clone();

        // const shapeLOD = this.createShapeFromGeometry(d6LOD.geometry);
        const shapeLOD = threeToCannon(d6LOD, { type: ShapeType.HULL }).shape;

        const bodyLOD = new CANNON.Body({
            mass: diceMass,
            shape: shapeLOD,
            sleepSpeedLimit: 1.0,
            sleepTimeLimit: 0.5,
            // collisionFilterGroup: 2,
            // collisionFilterMask: 1,
        });

        bodyLOD.addEventListener('sleep', (e) => {
            const indexMatchUps = [
                1,
                2,
                3,
                4,
                5,
                6
            ]

            e.target.shapes[0].computeWorldFaceNormals(e.target.quaternion);
            // Find the world face normal that is pointed the most up
            const worldFaceNormals = e.target.shapes[0].worldFaceNormals;
            let maxDot = 0;
            let maxFace = null;
            let maxIndex = 0;
            for (let i = 0; i < worldFaceNormals.length; ++i) {
                const face = worldFaceNormals[i];
                const dot = face.dot(new CANNON.Vec3(0, 1, 0));
                if (dot > maxDot) {
                    maxDot = dot;
                    maxFace = face;
                    maxIndex = i;
                }
            }
            console.log(maxFace, maxIndex, indexMatchUps[maxIndex]);

            if (callback) {
                callback(indexMatchUps[maxIndex]);
            }

            setTimeout(() => {
                // Remove and delete the icosahedron
                this.scene.remove(d6);
                this.physicsWorld.removeBody(bodyLOD);
                this.dice.splice(this.dice.indexOf(d6), 1);
            }, 1000);
        });

        // Link the visual mesh to the physical body
        d6.body = bodyLOD;
        // Link the physical body to the visual mesh
        bodyLOD.visualref = d6;

        console.log(d6);

        this.spawnPhysicalDie(d6);
    }

    spawnD8FromModel(callback) {
        if (this.dice.length > 10) return;

        const d8 = models.d8.clone();
        d8.castShadow = true;
        const d8LOD = models.d8LOD.clone();

        // const shapeLOD = this.createShapeFromGeometry(d8LOD.geometry);
        const shapeLOD = threeToCannon(d8LOD, { type: ShapeType.HULL }).shape;

        const bodyLOD = new CANNON.Body({
            mass: diceMass,
            shape: shapeLOD,
            sleepSpeedLimit: 1.0,
            sleepTimeLimit: 0.5,
        });

        bodyLOD.addEventListener('sleep', (e) => {
            const indexMatchUps = [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8
            ]

            e.target.shapes[0].computeWorldFaceNormals(e.target.quaternion);
            // Find the world face normal that is pointed the most up
            const worldFaceNormals = e.target.shapes[0].worldFaceNormals;
            let maxDot = 0;
            let maxFace = null;
            let maxIndex = 0;
            for (let i = 0; i < worldFaceNormals.length; ++i) {
                const face = worldFaceNormals[i];
                const dot = face.dot(new CANNON.Vec3(0, 1, 0));
                if (dot > maxDot) {
                    maxDot = dot;
                    maxFace = face;
                    maxIndex = i;
                }
            }
            console.log(maxFace, maxIndex, indexMatchUps[maxIndex]);

            if (callback) {
                callback(indexMatchUps[maxIndex]);
            }

            setTimeout(() => {
                // Remove and delete the icosahedron
                this.scene.remove(d8);
                this.physicsWorld.removeBody(bodyLOD);
                this.dice.splice(this.dice.indexOf(d8), 1);
            }, 1000);
        });

        // Link the visual mesh to the physical body
        d8.body = bodyLOD;
        // Link the physical body to the visual mesh
        bodyLOD.visualref = d8;

        console.log(d8);

        this.spawnPhysicalDie(d8);
    }

    spawnD10FromModel(callback) {
        if (this.dice.length > 10) return;

        const d10 = models.d10.clone();
        const d10Child = new THREE.Object3D();
        d10.add(d10Child);
        d10Child.rotateY(Math.PI / 2);
        d10Child.add(...this.debugSheresFromVertices(this.generatePentagonalPrismVertices()));
        d10.castShadow = true;
        const d10LOD = models.d10LOD.clone();

        // const shapeLOD = this.createShapeFromGeometry(d10LOD.geometry);
        const shapeLOD = threeToCannon(d10LOD, { type: ShapeType.HULL }).shape;

        const bodyLOD = new CANNON.Body({
            mass: diceMass,
            shape: shapeLOD,
            sleepSpeedLimit: 1.0,
            sleepTimeLimit: 0.5,
            // collisionFilterGroup: 2,
            // collisionFilterMask: 1,
        });

        bodyLOD.addEventListener('sleep', (e) => {
            // Get bodyLOD.visualref.children[0].children and find the one that has the greatest world y value
            let maxIndex = 0;
            let maxWorldY = 0;
            for (let i = 0; i < e.target.visualref.children[0].children.length; ++i) {
                const child = e.target.visualref.children[0].children[i];
                const childWorldPosition = new THREE.Vector3();
                child.getWorldPosition(childWorldPosition);
                if (childWorldPosition.y > maxWorldY) {
                    maxWorldY = childWorldPosition.y;
                    maxIndex = i;
                }
            }
            console.log(maxIndex + 1);

            if (callback) {
                callback(maxIndex + 1);
            }

            setTimeout(() => {
                // Remove and delete the icosahedron
                this.scene.remove(d10);
                this.physicsWorld.removeBody(bodyLOD);
                this.dice.splice(this.dice.indexOf(d10), 1);
            }, 1000);
        });

        // Link the visual mesh to the physical body
        d10.body = bodyLOD;
        // Link the physical body to the visual mesh
        bodyLOD.visualref = d10;

        console.log(d10);

        this.spawnPhysicalDie(d10);
    }

    spawnD12FromModel(callback) {
        if (this.dice.length > 10) return;

        const d12 = models.d12.clone();
        d12.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })));
        d12.castShadow = true;
        const d12LOD = models.d12LOD.clone();

        // const shapeLOD = this.createShapeFromGeometry(d12LOD.geometry);
        const shapeLOD = threeToCannon(d12LOD, { type: ShapeType.HULL }).shape;

        const bodyLOD = new CANNON.Body({
            mass: diceMass,
            shape: shapeLOD,
            sleepSpeedLimit: 1.0,
            sleepTimeLimit: 0.5,
        });

        bodyLOD.addEventListener('sleep', (e) => {
            const indexMatchUps = [
                1,
                2,
                3,
                4,
                5,
                6,
                12,
                11,
                10,
                9,
                8,
                7
            ]

            e.target.shapes[0].computeWorldFaceNormals(e.target.quaternion);
            // Find the world face normal that is pointed the most up
            const worldFaceNormals = e.target.shapes[0].worldFaceNormals;
            let maxDot = 0;
            let maxFace = null;
            let maxIndex = 0;
            for (let i = 0; i < worldFaceNormals.length; ++i) {
                const face = worldFaceNormals[i];
                const dot = face.dot(new CANNON.Vec3(0, 1, 0));
                if (dot > maxDot) {
                    maxDot = dot;
                    maxFace = face;
                    maxIndex = i;
                }
            }
            console.log(maxFace, maxIndex, indexMatchUps[maxIndex]);

            if (callback) {
                callback(indexMatchUps[maxIndex]);
            }

            setTimeout(() => {
                // Remove and delete the icosahedron
                this.scene.remove(d12);
                this.physicsWorld.removeBody(bodyLOD);
                this.dice.splice(this.dice.indexOf(d12), 1);
            }, 1000);
        });

        // Link the visual mesh to the physical body
        d12.body = bodyLOD;
        // Link the physical body to the visual mesh
        bodyLOD.visualref = d12;

        console.log(d12);

        this.spawnPhysicalDie(d12);
    }

    spawnD20FromModel(callback) {
        if (this.dice.length > 10) return;

        const d20 = models.d20.clone();
        let dodecaGeo = new THREE.DodecahedronGeometry();
        dodecaGeo = BufferGeometryUtils.mergeVertices(dodecaGeo);
        const dodecaChild = new THREE.Mesh(dodecaGeo, new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }));
        dodecaChild.rotation.set(0.5133996817049744, 0.21886045276075416, -0.12181136135847638);
        d20.add(dodecaChild);
        dodecaChild.add(...this.debugSheresFromVertices(this.generateDodecahedronVertices()));
        d20.castShadow = true;
        const d20LOD = models.d20LOD.clone();

        // const shape = this.createShapeFromGeometry(d20.geometry);
        // const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
        // const shapeLOD = this.createShapeFromGeometry(d20LOD.geometry);
        const shapeLOD = threeToCannon(d20LOD, { type: ShapeType.HULL }).shape;
        // const shapeLOD = new CANNON.Sphere(1);

        // const body = new CANNON.Body({
        //     mass: diceMass,
        //     shape: shape,
        //     collisionFilterGroup: 1,
        //     collisionFilterMask: 1,
        // });

        const bodyLOD = new CANNON.Body({
            mass: diceMass,
            shape: shapeLOD,
            sleepSpeedLimit: 1.0,
            sleepTimeLimit: 0.5,
            collisionFilterGroup: 2,
            collisionFilterMask: 1 | 2,
        });

        bodyLOD.addEventListener('sleep', (e) => {
            const midPoints = this.generateIcosaPoints();

            bodyLOD.visualref.updateMatrixWorld();

            const maxPoint = new THREE.Vector3();
            let maxIndex = 0;
            for (let i = 0; i < midPoints.length; ++i) {
                const midpoint = midPoints[i];
                midpoint.applyMatrix4(bodyLOD.visualref.matrixWorld);

                if (midpoint.y > maxPoint.y) {
                    maxPoint.copy(midpoint);
                    maxIndex = i;
                }
            }

            if (callback) {
                callback(maxIndex + 1);
            }

            // Get body.visualref's children[0].children and find the index of the one with the greatest y value in world space
            let maxChild = null;
            let maxChildIndex = 0;
            for (let i = 0; i < bodyLOD.visualref.children[0].children.length; ++i) {
                const child = bodyLOD.visualref.children[0].children[i];
                child.updateMatrixWorld();
                const childWorldPos = new THREE.Vector3();
                child.getWorldPosition(childWorldPos);
                if (childWorldPos.y > maxChild?.y || !maxChild) {
                    maxChild = childWorldPos;
                    maxChildIndex = i;
                }
            }
            console.log(maxChild, maxChildIndex);

            setTimeout(() => {
                // Remove and delete the icosahedron
                this.scene.remove(d20);
                this.physicsWorld.removeBody(bodyLOD);
                this.dice.splice(this.dice.indexOf(d20), 1);
            }, 1000);
        });

        // body.addBody(bodyLOD);

        // Link the visual mesh to the physical body
        d20.body = bodyLOD;
        // Link the physical body to the visual mesh
        bodyLOD.visualref = d20;

        console.log(d20);

        this.spawnPhysicalDie(d20);
    }

    loadGLTF() {
        const loader = new GLTFLoader();

        const url = new URL('./assets/d20.glb', import.meta.url)
        loader.load(
            // resource URL
            url + '',
            // called when the resource is loaded
            (gltf) => {
                console.log(gltf);
                // gltf.scene.scale.set(10, 10, 10);
                gltf.scene.rotation.x = -Math.PI / 2;
                window.scene?.scene?.add(gltf.scene);

                // Create physics for gltf
                const shape = this.createShapeFromGeometry(gltf.scene.children[0].geometry);
                const body = new CANNON.Body({
                    mass: diceMass,
                    shape: shape,
                    collisionFilterGroup: 2,
                    collisionFilterMask: 1,
                });

                // Link the visual mesh to the physical body
                gltf.scene.children[0].body = body;
                // Link the physical body to the visual mesh
                body.visualref = gltf.scene.children[0];

                this.dice.push(gltf.scene.children[0]);

                this.spawnPhysicalDie(gltf.scene.children[0]);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            },
            (error) => {
                console.error(error)
            }
        );

        //     const loader = new FBXLoader();

        //     // Create a material that uses a texture
        //     const textureURL = new URL('./assets/rpg-dice-set-pbr-game-ready-model/textures/RPGDiceSet_d.png', import.meta.url);
        //     const normalURL = new URL('./assets/rpg-dice-set-pbr-game-ready-model/textures/RPGDiceSet_n.png', import.meta.url);
        //     const texture = new THREE.TextureLoader().load(textureURL+'');
        //     const normalMap = new THREE.TextureLoader().load(normalURL+'');
        //     const material = new THREE.MeshLambertMaterial({
        //         map: texture,
        //         normalMap: normalMap,
        //     });

        //     const url = new URL('./assets/rpg-dice-set-pbr-game-ready-model/source/sm_DiceSet_02.fbx', import.meta.url);
        //     loader.load(
        //         // resource URL
        //         url+'',
        //         // called when the resource is loaded
        //         (object) => {
        //             console.log(object);
        //             object.traverse((child) => {
        //                 if (child instanceof THREE.Mesh) {
        //                     child.material = material;
        //                     child.castShadow = true;
        //                 }
        //             })


        //             window.scene?.scene?.add(object);
        //         },
        //         (xhr) => {
        //             console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        //         },
        //         (error) => {
        //             console.error(error)
        //         }
        //     );
    }

    debugSheresFromVertices(vertices) {
        const spheres = [];
        for (const vertex of vertices) {
            const geometry = new THREE.SphereGeometry(0.1, 8, 8);
            const material = new THREE.MeshLambertMaterial();
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.copy(vertex);
            spheres.push(sphere);
        }

        return spheres;
    }

    generatePentagonalPrismVertices(height = 1, radius = 1) {
        const vertices = [];

        // Calculate the coordinates for the bottom pentagon
        for (let i = 0; i < 5; i++) {
            const angle = (i * 72 * Math.PI) / 180; // 72 degrees between each point
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            vertices.push(new THREE.Vector3(x, -height / 2, y));
        }

        // Calculate the coordinates for the top pentagon with a 54-degree rotation
        for (let i = 0; i < 5; i++) {
            const angle = ((i * 72 + 36) * Math.PI) / 180; // 54-degree rotation
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            vertices.push(new THREE.Vector3(x, height / 2, y));
        }

        // Create vertices for the sides of the prism
        for (let i = 0; i < 5; i++) {
            const nextIndex = (i + 1) % 5; // Wrap around to connect the last point to the first
            const bottomVertex1 = vertices[i];
            const bottomVertex2 = vertices[nextIndex];
            const topVertex1 = vertices[i + 5];
            const topVertex2 = vertices[nextIndex + 5];

            vertices.push(bottomVertex1, bottomVertex2, topVertex1);
            vertices.push(bottomVertex2, topVertex2, topVertex1);
        }

        return vertices;
    }

    generateTetrahedronVertices() {
        const vertices = [
            new THREE.Vector3(1, 1, 1),
            new THREE.Vector3(1, -1, -1),
            new THREE.Vector3(-1, 1, -1),
            new THREE.Vector3(-1, -1, 1)
        ];

        return vertices;
    }

    generateOctahedronVertices() {
        const vertices = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, -1, 0),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, -1)
        ];

        return vertices;
    }

    generateDodecahedronVertices() {
        // Generate the vertices and faces of a dodecahedron
        const phi = (1 + Math.sqrt(5)) / 2;

        const vertices = [
            new THREE.Vector3(1, 1, 1),
            new THREE.Vector3(1, 1, -1),
            new THREE.Vector3(1, -1, 1),
            new THREE.Vector3(1, -1, -1),
            new THREE.Vector3(-1, 1, 1),
            new THREE.Vector3(-1, 1, -1),
            new THREE.Vector3(-1, -1, 1),
            new THREE.Vector3(-1, -1, -1),
            new THREE.Vector3(0, 1 / phi, phi),
            new THREE.Vector3(0, 1 / phi, -phi),
            new THREE.Vector3(0, -1 / phi, phi),
            new THREE.Vector3(0, -1 / phi, -phi),
            new THREE.Vector3(phi, 0, 1 / phi),
            new THREE.Vector3(phi, 0, -1 / phi),
            new THREE.Vector3(-phi, 0, 1 / phi),
            new THREE.Vector3(-phi, 0, -1 / phi),
            new THREE.Vector3(1 / phi, phi, 0),
            new THREE.Vector3(1 / phi, -phi, 0),
            new THREE.Vector3(-1 / phi, phi, 0),
            new THREE.Vector3(-1 / phi, -phi, 0)
        ];

        return vertices;
    }

    generateDodecaPoints() {
        const midpoints = [];

        // Define the vertices of a dodecahedron
        const phi = (1 + Math.sqrt(5)) / 2;

        const vertices = [
            new THREE.Vector3(1, 1, 1),
            new THREE.Vector3(1, 1, -1),
            new THREE.Vector3(1, -1, 1),
            new THREE.Vector3(1, -1, -1),
            new THREE.Vector3(-1, 1, 1),
            new THREE.Vector3(-1, 1, -1),
            new THREE.Vector3(-1, -1, 1),
            new THREE.Vector3(-1, -1, -1),
            new THREE.Vector3(0, 1 / phi, phi),
            new THREE.Vector3(0, 1 / phi, -phi),
            new THREE.Vector3(0, -1 / phi, phi),
            new THREE.Vector3(0, -1 / phi, -phi),
            new THREE.Vector3(phi, 0, 1 / phi),
            new THREE.Vector3(phi, 0, -1 / phi),
            new THREE.Vector3(-phi, 0, 1 / phi),
            new THREE.Vector3(-phi, 0, -1 / phi),
            new THREE.Vector3(1 / phi, phi, 0),
            new THREE.Vector3(1 / phi, -phi, 0),
            new THREE.Vector3(-1 / phi, phi, 0),
            new THREE.Vector3(-1 / phi, -phi, 0)
        ];

        // Define the faces of a dodecahedron
        const faces = [
            [0, 8, 9, 4, 16],
            [0, 12, 1, 18, 8],
            [0, 16, 2, 17, 12],
            [1, 13, 3, 19, 18],
            [1, 12, 17, 6, 13],
            [2, 16, 4, 14, 10],
            [2, 10, 5, 15, 17],
            [3, 11, 7, 19, 13],
            [3, 13, 6, 9, 11],
            [4, 9, 6, 17, 15],
            [4, 15, 5, 14, 16],
            [5, 10, 14, 7, 11],
            [5, 11, 9, 8, 10],
            [6, 2, 10, 8, 9],
            [7, 14, 4, 15, 19],
            [7, 19, 15, 17, 6],
            [12, 0, 18, 19, 3],
            [12, 3, 11, 8, 1],
            [13, 1, 18, 0, 6],
            [14, 5, 10, 2, 7]
        ];

        // Calculate and store the midpoint for each face
        for (const face of faces) {
            const a = vertices[face[0]];
            const b = vertices[face[1]];
            const c = vertices[face[2]];
            const d = vertices[face[3]];
            const e = vertices[face[4]];

            const midpoint = new THREE.Vector3(
                (a.x + b.x + c.x + d.x + e.x) / 5,
                (a.y + b.y + c.y + d.y + e.y) / 5,
                (a.z + b.z + c.z + d.z + e.z) / 5
            );

            midpoints.push(midpoint);
        }

        // Generate a sphere of radius 0.01 at each midpoint
        for (const midpoint of midpoints) {
            const geometry = new THREE.SphereGeometry(0.1, 8, 8);
            const material = new THREE.MeshLambertMaterial();
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.copy(midpoint);
            sphere.castShadow = true;
            this.scene.add(sphere);
        }

        return midpoints;
    }

    generateIcosaPoints() {
        const midpoints = [];

        // Define the vertices of an icosahedron
        const t = (1.0 + Math.sqrt(5.0)) / 2.0;

        const vertices = [
            new THREE.Vector3(-1, t, 0),
            new THREE.Vector3(1, t, 0),
            new THREE.Vector3(-1, -t, 0),
            new THREE.Vector3(1, -t, 0),
            new THREE.Vector3(0, -1, t),
            new THREE.Vector3(0, 1, t),
            new THREE.Vector3(0, -1, -t),
            new THREE.Vector3(0, 1, -t),
            new THREE.Vector3(t, 0, -1),
            new THREE.Vector3(t, 0, 1),
            new THREE.Vector3(-t, 0, -1),
            new THREE.Vector3(-t, 0, 1)
        ];

        // Define the faces of an icosahedron
        const faces = [
            [0, 11, 5],
            [0, 5, 1],
            [0, 1, 7],
            [0, 7, 10],
            [0, 10, 11],
            [1, 5, 9],
            [5, 11, 4],
            [11, 10, 2],
            [10, 7, 6],
            [7, 1, 8],
            [3, 9, 4],
            [3, 4, 2],
            [3, 2, 6],
            [3, 6, 8],
            [3, 8, 9],
            [4, 9, 5],
            [2, 4, 11],
            [6, 2, 10],
            [8, 6, 7],
            [9, 8, 1]
        ];

        // Calculate and store the midpoint for each face
        for (const face of faces) {
            const a = vertices[face[0]];
            const b = vertices[face[1]];
            const c = vertices[face[2]];

            const midpoint = new THREE.Vector3(
                (a.x + b.x + c.x) / 3,
                (a.y + b.y + c.y) / 3,
                (a.z + b.z + c.z) / 3
            );

            midpoints.push(midpoint);
        }

        return midpoints;
    }
}