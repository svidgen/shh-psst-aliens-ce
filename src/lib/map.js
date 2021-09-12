import { defaults } from 'marked';
import { Commands } from './commands';

const EMPTY = '&nbsp;';
const ALIEN = '👽';
const HERO = '⛄';
const EDGE = '#'

class GameMap {

	data = [];
	clues = [];
	subscribers = [];
	position = [0,0];

	constructor(init = {}) {
		const defaults = {width: 10, height: 10, density: 0.1};
		Object.assign(this, {...defaults, ...init});

		for (let x = 0; x < this.width; x++) {
			const col = [];
			for (let y = 0; y < this.height; y++) {
				col.push(EMPTY);
			}
			this.data.push(col);
		}

		this.position = [
			Math.floor(this.width/2),
			Math.floor(this.height/2)
		];

		this.placeAliens();
		this.placeClues();

		// TODO: remove in production!
		console.log(this.toString());
	};

	placeAliens(density = null) {
		let aliens = Math.floor(
			this.width * this.height * (density || this.density)
		);

		const [cx, cy] = this.position;

		while (aliens > 0) {
			const x = Math.floor(Math.random() * this.width);
			const y = Math.floor(Math.random() * this.height);
			if (this.data[x][y] !== EMPTY) {
				// something is already here. try again.
				continue;
			} else if (x === cx && y === cy) {
				// user is here. no aliens in starting square.
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

	toString(width, height) {
		const xdelta = Math.floor((width || this.width) / 2);
		const ydelta = Math.floor((height || this.height) / 2);
		const rep = [];
		const [cx, cy] = this.position;

		/*
		const lowerX = Math.max(0, cx - xdelta);
		const lowerY = Math.max(0, cy - ydelta);
		const upperX = Math.min(this.width - 1, cx + xdelta);
		const upperY = Math.min(this.height - 1, cy + ydelta);
		*/

		const lowerX = cx - xdelta;
		const upperX = cx + xdelta;
		const lowerY = cy - ydelta;
		const upperY = cy + ydelta;

		console.log(lowerX, lowerY, upperX, upperY);
		for (let y = lowerY; y <= upperY; y++) {
			for (let x = lowerX; x <= upperX; x++) {
				if (y<0 || x<0 || x>(this.width-1) || y>(this.height-1)) {
					rep.push(EDGE);
				} else {
					let c = this.data[x][y] === ALIEN ? ALIEN : this.clues[x][y];
					if (cx === x && cy === y) {
						// c = `<i><u><b>${c}</b></u></i>`;
						c = `<b>${HERO}</b>`;
					}
					rep.push(c);
				}
			}
			rep.push("\n");
		}
		return rep.join('');
	};
}

export { GameMap };
