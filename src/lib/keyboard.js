import { Commands } from './commands';

const KEYMAP = Object.freeze({
	"ArrowUp": Commands.UP,
	"KeyW": Commands.UP,
	"ArrowDown": Commands.DOWN,	
	"KeyS": Commands.DOWN,
	"ArrowLeft": Commands.LEFT,
	"KeyA": Commands.LEFT,
	"ArrowRight": Commands.RIGHT,
	"KeyD": Commands.RIGHT
});

class KeyBoardDPad {
	eventListener = null;
	subscriber = null;

	connect(subscriber) {
		this.subscriber = subscriber;
		this.eventListener = document.addEventListener(
			'keydown',
			(e) => this.handleKeyDown(e)
		);
	};

	disconnect() {
		document.removeEventListener(this.eventListener);
		this.eventListener = null;
		this.subscriber = null;
	};

	handleKeyDown(e) {
		if (KEYMAP[e.code]) {
			this.subscriber(KEYMAP[e.code]);
		}
	};
};

export default {
	KeyBoardDPad,
	KEYMAP
};