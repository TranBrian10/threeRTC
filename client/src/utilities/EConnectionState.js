const EConnectionState = Object.freeze({
	DISCONNECTED: 0,
	JOINING_ROOM: 1,
	WAITING_FOR_PEER: 2,
	CONNECTED: 3
});

export default EConnectionState;