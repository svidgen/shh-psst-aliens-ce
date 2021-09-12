import { defaults } from 'marked';
import { Commands } from './commands';

const EMPTY = ' ';
const ALIEN = 'A';

class GameMap {

	data = [];
	clues = [];
	subscribers = [];
	position = [0,0];

	constructor(init = {}) {
		const defaults = {width: 10, height: 10, density: 0.25};
		Object.assign(this, {...defaults, ...init});

		for (let x = 0; x < this.width; x++) {
			const col = [];
			for (let y = 0; y < this.height; y++) {
				col.push(EMPTY);
			}
			this.data.push(col);
		}

		this.placeAliens();
		this.placeClues();

		// TODO: remove in production!
		console.log(this.toString());
	};

	placeAliens(density = null) {
		let aliens = Math.floor(
			this.width * this.height * (density || this.density)
		);

		while (aliens > 0) {
			const x = Math.floor(Math.random() * this.width);
			const y = Math.floor(Math.random() * this.height);
			if (this.data[x][y] !== EMPTY) {
				// something is already here. try again.
				continue;
			} else {
				this.data[x][y] = ALIEN;
				aliens--;
			}
		}
	};

	placeClues() {
		this.clues = JSON.parse(JSON.stringify(this.data))
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				const aliens = this.aliensNear(x,y);
				this.clues[x][y] = aliens > 0 ? aliens : EMPTY;
			}
		}
	};

	aliensNear(x, y) {
		let sum = 0;
		for (let _x = x - 1; _x <= x + 1; _x++) {
			for (let _y = y - 1; _y <= y + 1; _y++) {
				if (this.data[_x] && this.data[_x][_y] === ALIEN) {
					sum++;
				}
			}
		}
		return sum;
	};

	execute(command) {
		const t = this;
		const action = {
			[Commands.UP]: () => { t.move(0, -1); },
			[Commands.DOWN]: () => { t.move(0, 1); },
			[Commands.RIGHT]: () => { t.move(1, 0); },
			[Commands.LEFT]: () => { t.move(-1, 0); }
		}[command];
		action && action();
	};

	move(dx, dy) {
		let [x, y] = this.position;
		x = this.bounded(x + dx, 0, this.width - 1);
		y = this.bounded(y + dy, 0, this.height - 1); 
		this.position = [x, y];
		this.fireOnChange({name: 'move', dx, dy, x, y});
	};

	bounded(value, min, max) {
		return Math.max(min, Math.min(value, max));
	};

	fireOnChange(event) {
		for (let subscriber of this.subscribers) {
			if (typeof subscriber === 'function') {
				subscriber(event);
			}
		}
	};

	onchange(subscriber) {
		this.subscribers.push(subscriber);
	};

	toString() {
		const rep = [];
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let c = this.data[x][y] === ALIEN ? ALIEN : this.clues[x][y];
				const [cx, xy] = this.position;
				if (cx === x && xy === y) {
					c = `<i><u><b>${c}</b></u></i>`;
				}
				rep.push(c);
			}
			rep.push("\n");
		}
		return rep.join('');
	};
}

export { GameMap };
