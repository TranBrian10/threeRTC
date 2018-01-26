import * as THREE from 'three';
import * as CANNON from 'cannon';

let webrtc;
let gameInstance = null;
let camera, scene, renderer;
let world;
let timeStep = 1/60;

function initCannon() {
	world = new CANNON.World();
	world.gravity.set(0, 0, 0);
	world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 10;

	var sphere1 = initSphereCannon(world, 2, new CANNON.Vec3(0, 0, 100), 2000);
	sphere1.angularVelocity.set(0, 1, 0);

	var sphere2 = initSphereCannon(world, 2, new CANNON.Vec3(0, 0, 0), 1);
	sphere2.angularVelocity.set(0, -1, 0);
	sphere2.applyImpulse(new CANNON.Vec3(0, 0, 60), new CANNON.Vec3(0, 0, 0));
}

function initSphereCannon(world, radius, pos, mass) {
	var sphereBody = new CANNON.Body({
		mass, // kg
		position: pos,
		shape: new CANNON.Sphere(radius)
	});

	world.addBody(sphereBody);

	return sphereBody;
}

function init() {
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
	camera.translateZ(100);
	camera.updateMatrixWorld(true);

	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(1000));

	const cameraPivotPos = new THREE.Vector3(0, -30, -45); // Relative to the camera
	const worldPivotPos = camera.localToWorld(cameraPivotPos);

	const handPivot = new THREE.Object3D();
	handPivot.name = 'handPivot';
	handPivot.position.set(worldPivotPos.x, worldPivotPos.y, worldPivotPos.z);
	scene.add(handPivot);

	initBat(handPivot, 55);

	const spherePivot = new THREE.Object3D();
	spherePivot.name = 'spherePivot';
	spherePivot.position.set(0, 0, 0);
	scene.add(spherePivot);

	initSphere(spherePivot, 2, 'sphere1');

	initSphere(spherePivot, 2, 'sphere2');

	const handRotationHandler = createHandRotationHandler(handPivot);
	this.addOrientationDataHandler(handRotationHandler);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

function createHandRotationHandler(pivot) {
	return function(orientationData) {
		const degToRadRatio = Math.PI / 180;
		pivot.rotation.set(orientationData.beta * degToRadRatio, orientationData.gamma * degToRadRatio, orientationData.alpha * degToRadRatio);
	};
}

function initBat(pivot, length) {
	const geometry = new THREE.CylinderGeometry(2, 2, length, 30);
	const material = new THREE.MeshNormalMaterial({ wireframe: true });
	const batMesh = new THREE.Mesh(geometry, material);

	batMesh.name = 'batty';
	batMesh.translateY(length / 2);
	pivot.add(batMesh);
}

function initSphere(pivot, radius, name) {
	const geometry = new THREE.SphereGeometry(radius, 32, 32);
	const material = new THREE.MeshNormalMaterial({ wireframe: true });
	const sphereMesh = new THREE.Mesh(geometry, material);

	sphereMesh.name = name;
	pivot.add(sphereMesh);
}

function animate() {
	requestAnimationFrame(animate);

	updatePhysics();

	renderer.render(scene, camera);
}

function updatePhysics() {

	// Step the physics world
	world.step(timeStep);

	// Copy coordinates from Cannon.js to Three.js
	var bodies = world.bodies;

	var sphereMesh1 = scene.getObjectByName('spherePivot').getObjectByName('sphere1');
	sphereMesh1.position.copy(bodies[0].position);
	sphereMesh1.quaternion.copy(bodies[0].quaternion);

	var sphereMesh2 = scene.getObjectByName('spherePivot').getObjectByName('sphere2');
	sphereMesh2.position.copy(bodies[1].position);
	sphereMesh2.quaternion.copy(bodies[1].quaternion);
}

class Game {
	constructor() {
		this.orientationDataHandlers = [];
		this.alphaOffset = 0;
		this.betaOffset = 0;

		init.call(this);
		initCannon.call(this);
		animate.call(this);
	}

	setWebrtc(webrtcObject) {
		if (webrtc !== webrtcObject) {
			webrtc = webrtcObject;

			const controller = webrtc.getPeers()[0];
			if (!controller.enableDataChannels) {
				console.warn('Controller peer does not have data channels enabled');
				return;
			}

			const dc = controller.getDataChannel('orientationData');
			if (dc.readyState !== 'open') {
				console.warn('Data channel \'orientationData\' is not open');
				return;
			}

			controller.on('channelMessage', (peer, channelName, messageData) => {
				if (messageData.type === 'controllerOrientation') {
					this.callOrientationDataHandlers(messageData.payload);
				}
				else if (messageData.type === 'controllerCalibrate') {
					this.calibrate(messageData.payload);
					this.callOrientationDataHandlers(messageData.payload);
				}
			});
		}
	}

	normalizeOrientationData(orientationData) {
		orientationData.beta += 180; // map (-180, 180) to (0, 360)

		// Shift values based on calibration values
		orientationData.beta = (orientationData.beta - this.betaOffset + 360) % 360;
		orientationData.alpha = (orientationData.alpha - this.alphaOffset + 360) % 360;
	}

	addOrientationDataHandler(handlerFunction) {
		this.orientationDataHandlers.push(handlerFunction);
	}

	callOrientationDataHandlers(orientationData) {
		this.normalizeOrientationData(orientationData);

		this.orientationDataHandlers.forEach((handlerFunction) => {
			handlerFunction(orientationData);
		});
	}

	calibrate(orientationData) {
		const mappedBeta = orientationData.beta + 180; // map (-180, 180) to (0, 360)

		this.alphaOffset = orientationData.alpha;
		this.betaOffset = 90 - mappedBeta;
	}

	static getInstance() {
		if (gameInstance === null) {
			gameInstance = new Game();
			return gameInstance;
		}

		return gameInstance;
	}
}

export default Game;