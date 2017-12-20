import * as THREE from 'three';

let webrtc;
let gameInstance = null;
let camera, scene, renderer;
let geometry, material, mesh;

function init() {
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
	camera.position.z = 1;

	scene = new THREE.Scene();

	geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
	material = new THREE.MeshNormalMaterial();

	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

function animate() {
	requestAnimationFrame(animate);

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;

	renderer.render(scene, camera);
}

class Game {
	constructor() {
		this.orientationDataHandlers = [];

		init();
		animate();
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
					this.orientationDataHandlers.forEach((handlerFunction) => {
						handlerFunction(messageData.payload);
					});
				}
			});
		}
	}

	addOrientationDataHandler(handlerFunction) {
		this.orientationDataHandlers.push(handlerFunction);
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