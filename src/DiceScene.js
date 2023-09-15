import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

export default class DiceScene {
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

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
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
            gravity: new CANNON.Vec3(0, -9.82, 0),
            broadphase: new CANNON.NaiveBroadphase(),
            allowSleep: true,
        });

        // Create a ground plane
        const groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            // infinite geometric plane
            shape: new CANNON.Plane(),
        })
        // rotate ground body by 90 degrees
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.physicsWorld.addBody(groundBody);
        // this.cannonDebugger = new CannonDebugger(this.scene, this.physicsWorld, { color: 0x0ff0000 });

        // create a visual ground plane
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        // Transparent material so we can see the shadow
        const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.receiveShadow = true;
        groundMesh.rotation.x = -Math.PI / 2;
        this.scene.add(groundMesh);

        // Four wall planes
        const rightWallBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        });
        rightWallBody.quaternion.setFromEuler(0, -Math.PI / 2, 0);
        rightWallBody.position.x = 5;
        this.physicsWorld.addBody(rightWallBody);

        const leftWallBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        });
        leftWallBody.quaternion.setFromEuler(0, Math.PI / 2, 0);
        leftWallBody.position.x = -5;
        this.physicsWorld.addBody(leftWallBody);

        const topWallBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        });
        topWallBody.position.z = -5;
        this.physicsWorld.addBody(topWallBody);

        const bottomWallBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        });
        bottomWallBody.quaternion.setFromEuler(0, Math.PI, 0);
        bottomWallBody.position.z = 5;
        this.physicsWorld.addBody(bottomWallBody);

        document.body.appendChild(this.renderer.domElement);

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
                    // Create a 0.01 sized cube for each face
                    const faceCubePositions = [
                        [0, 0, 0.5],
                        [0, 0, -0.5],
                        [0, 0.5, 0],
                        [0, -0.5, 0],
                        [0.5, 0, 0],
                        [-0.5, 0, 0],
                    ];
                    for (const [i, position] of faceCubePositions.entries()) {
                        const faceCube = new THREE.Object3D();
                        faceCube.position.set(...position);
                        faceCube.quaternion.copy(die.body.quaternion);
                        die.add(faceCube);
                    }

                    // Find the face cube with the greatest y position in world space (the top face)
                    let topFaceCube = die.children[0];
                    let topFaceCubeIndex = 0;
                    for (const faceCube of die.children) {
                        faceCube.position.copy(faceCube.getWorldPosition(new THREE.Vector3()));
                        if (faceCube.position.y > topFaceCube.position.y) {
                            topFaceCube = faceCube;
                            topFaceCubeIndex = die.children.indexOf(faceCube);
                        }
                    }
                    console.log(topFaceCube, topFaceCubeIndex);
                }

                die.stoppedMoving = true;
            }
        }

        this.renderer.render(this.scene, this.camera);
    }

    spawnDie() {
        if (this.cube && !this.cube.endedSpinning) return;
        if (this.cube) {
            // remove and delete the old cube
            this.scene.remove(this.cube);
            this.cube = undefined;
        }

        const colors = [
            0x00ff00,
            0xff0000,
            0x0000ff,
            0xffff00,
            0xff00ff,
            0x00ffff,
        ]

        const materials = colors.map(color => new THREE.MeshLambertMaterial({ color }));

        const geometry = new THREE.BoxGeometry();
        const cube = new THREE.Mesh(geometry, materials);
        this.scene.add(cube);

        cube.isSpinning = true;
        // Random speed between 8 and 12
        cube.spinSpeed = Math.random() * 8 + 8;
        cube.xSpinDirection = Math.random() > 0.5 ? 1 : -1;
        cube.ySpinDirection = Math.random() > 0.5 ? 1 : -1;

        this.cube = cube;

        setTimeout(() => {
            // Remove and delete the cube
            this.scene.remove(cube);
            this.cube = undefined;
        }, 3000);

        return cube;
    }

    spawnDTwenty() {
        if (this.cube && !this.cube.endedSpinning) return;
        if (this.cube) {
            // remove and delete the old cube
            this.scene.remove(this.cube);
            this.cube = undefined;
        }

        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const geometry = new THREE.DodecahedronGeometry();
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

        cube.isSpinning = true;
        // Random speed between 8 and 12
        cube.spinSpeed = Math.random() * 8 + 8;
        cube.xSpinDirection = Math.random() > 0.5 ? 1 : -1;
        cube.ySpinDirection = Math.random() > 0.5 ? 1 : -1;

        this.cube = cube;

        setTimeout(() => {
            // Remove and delete the cube
            this.scene.remove(cube);
            this.cube = undefined;
        }, 3000);

        return cube;
    }

    spawnPhysicalCube() {
        if (this.dice.length > 10) return;

        // Create a physical cube and set it at y = 10
        const cubeBody = new CANNON.Body({
            mass: 5,
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
        });
        cubeBody.position.set(0, 5, 0);
        this.physicsWorld.addBody(cubeBody);

        // Give the cube a random spin and velocity
        cubeBody.angularVelocity.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
        cubeBody.velocity.set((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20);

        // Create a visual cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshLambertMaterial();
        const cubeMesh = new THREE.Mesh(geometry, material);
        cubeMesh.castShadow = true;
        this.scene.add(cubeMesh);

        // Link the visual cube to the physical cube
        cubeMesh.body = cubeBody;
        // Link the physical cube to the visual cube
        cubeBody.visualref = cubeMesh;

        this.dice.push(cubeMesh);
        console.log(cubeMesh);

        setTimeout(() => {
            // Remove and delete the cube
            this.scene.remove(cubeMesh);
            this.physicsWorld.removeBody(cubeBody);
            this.dice.splice(this.dice.indexOf(cubeMesh), 1);
        }, 5000);
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

        // Give the icosahedron a random spin and velocity
        body.angularVelocity.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
        body.velocity.set((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20);

        this.dice.push(mesh);
        this.scene.add(mesh);
        this.physicsWorld.addBody(body);

        setTimeout(() => {
            // Remove and delete the icosahedron
            this.scene.remove(mesh);
            this.physicsWorld.removeBody(body);
            this.dice.splice(this.dice.indexOf(mesh), 1);
        }, 5000);
    }

    spawnPhysicalIcosahedron() {
        if (this.dice.length > 10) return;

        // Create a visual icosahedron
        let geometry = new THREE.IcosahedronGeometry(1, 0);
        geometry = BufferGeometryUtils.mergeVertices(geometry);
        const material = new THREE.MeshLambertMaterial();
        const icosahedronMesh = new THREE.Mesh(geometry, material);
        icosahedronMesh.castShadow = true;
        this.scene.add(icosahedronMesh);

        // Create a physical icosahedron
        function createIcosahedronShape() {
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
        const icosaShape = createIcosahedronShape()

        const icosahedronBody = new CANNON.Body({
            mass: 5,
            shape: icosaShape,
            collisionFilterGroup: 2,
            collisionFilterMask: 1,
        });

        icosahedronBody.position.set(0, 5, 0);
        this.physicsWorld.addBody(icosahedronBody);

        // Give the icosahedron a random spin and velocity
        icosahedronBody.angularVelocity.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
        icosahedronBody.velocity.set((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20);

        // Link the visual icosahedron to the physical icosahedron
        icosahedronMesh.body = icosahedronBody;
        // Link the physical icosahedron to the visual icosahedron
        icosahedronBody.visualref = icosahedronMesh;

        this.dice.push(icosahedronMesh);
        console.log(icosahedronMesh);

        setTimeout(() => {
            // Remove and delete the icosahedron
            this.scene.remove(icosahedronMesh);
            this.physicsWorld.removeBody(icosahedronBody);
            this.dice.splice(this.dice.indexOf(icosahedronMesh), 1);
        }, 5000);
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
        this.scene.add(mesh);

        const position = geometry.attributes.position.array;
        const geomFaces = geometry.index.array;

        const newVerts = [];
        for (let i = 0; i < position.length; i += 3) {
            const x = position[i];
            const y = position[i + 1];
            const z = position[i + 2];
            newVerts.push(new CANNON.Vec3(x, y, z));
        }

        const newFaces = [];
        for (let i = 0; i < geomFaces.length; i += 3) {
            newFaces.push([geomFaces[i], geomFaces[i + 1], geomFaces[i + 2]]);
        }

        const body = new CANNON.Body({
            mass: 5,
            shape: new CANNON.ConvexPolyhedron({
                vertices: newVerts,
                faces: newFaces,
            }),
            collisionFilterGroup: 2,
            collisionFilterMask: 1,
        });

        body.position.set(0, 5, 0);
        this.physicsWorld.addBody(body);

        // Give the body a random spin and velocity
        body.angularVelocity.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
        body.velocity.set((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20);

        // Link the visual mesh to the physical body
        mesh.body = body;
        // Link the physical body to the visual mesh
        body.visualref = mesh;

        this.dice.push(mesh);
        console.log(mesh);

        setTimeout(() => {
            // Remove and delete the mesh
            this.scene.remove(mesh);
            this.physicsWorld.removeBody(body);
            this.dice.splice(this.dice.indexOf(mesh), 1);
        }, 5000);
    }
}