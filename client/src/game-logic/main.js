import * as THREE from 'three';

let webrtc;
let gameInstance = null;
let camera, scene, renderer;

function init() {
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
	camera.translateZ(100);
	camera.updateMatrixWorld(true);

	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(1000));

	const cameraPivotPos = new THREE.Vector3(0, -30, -45); // Relative to the camera
	const worldPivotPos = camera.localToWorld(cameraPivotPos);

	const handPivot = new THREE.Object3D();
	handPivot.position.set(worldPivotPos.x, worldPivotPos.y, worldPivotPos.z);
	scene.add(handPivot);

	initBat(handPivot, 55);

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

	batMesh.translateY(length / 2);
	pivot.add(batMesh);
}

function animate() {
	requestAnimationFrame(animate);

	//mesh.rotation.x += 0.01;
	//mesh.rotation.y += 0.02;

	renderer.render(scene, camera);
}

class Game {
	constructor() {
		this.orientationDataHandlers = [];
		this.alphaOffset = 0;
		this.betaOffset = 0;

		init.call(this);
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