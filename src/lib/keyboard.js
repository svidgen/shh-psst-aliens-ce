import { Commands } from './commands';

const KEYMAP = Object.freeze({
	"ArrowUp": Commands.UP,
	"KeyW": Commands.UP,
	"ArrowDown": Commands.DOWN,	
	"KeyS": Commands.DOWN,
	"ArrowLeft": Commands.LEFT,
	"KeyA": Commands.LEFT,
	"ArrowRight": Commands.RIGHT,
	"KeyD": Commands.RIGHT,
	"KeyT": Commands.TALK,
	"KeyK": Commands.KILL
});

class KeyBoardDPad {
	eventListener = null;
	subscriber = null;

	connect(subscriber) {
		if (this.subscriber) this.disconnect();
		this.subscriber = subscriber;
		this.eventListener = (e) => this.handleKeyDown(e);
		document.addEventListener(
			'keydown',
			this.eventListener	
		);
	};

	disconnect() {
		if (this.eventListener) {
			document.removeEventListener('keydown', this.eventListener);
			this.eventListener = null;
			this.subscriber = null;
		}
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