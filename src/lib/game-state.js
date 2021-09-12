import { Commands } from './commands';
import { MapSquare } from './map-square';
import { EMPTY, ALIEN, HERO, DEAD, CROSSHAIR, WEAPON, EDGE } from './items';

class GameState {

	map = [];
	subscribers = [];
	position = [0,0];

	constructor(init = {}) {
		const defaults = {width: 10, height: 10, density: 0.1};
		Object.assign(this, {...defaults, ...init});

		for (let x = 0; x < this.width; x++) {
			const col = [];
			for (let y = 0; y < this.height; y++) {
				col.push(new MapSquare(this.map, x, y));
			}
			this.map.push(col);
		}

		this.position = [
			Math.floor(this.width/2),
			Math.floor(this.height/2)
		];

		this.placeAliens();

		// TODO: remove in production!
		console.log(this.toString());
	};

	placeAliens(density = null) {
		let alienCount = Math.floor(
			this.width * this.height * (density || this.density)
		);

		const [cx, cy] = this.position;

		while (alienCount > 0) {
			const x = Math.floor(Math.random() * this.width);
			const y = Math.floor(Math.random() * this.height);
			if (!this.map[x][y].isEmpty) {
				// something is already here. try again.
				continue;
			} else if (x === cx && y === cy) {
				// user is here. no aliens in starting square.
				continue;
			} else {
				this.map[x][y].add(ALIEN);
				alienCount--;
			}
		}
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
		const rep = [];

		const [cx, cy] = this.position;
		const xdelta = Math.floor((width || this.width) / 2);
		const ydelta = Math.floor((height || this.height) / 2);

		const lowerX = cx - xdelta;
		const upperX = cx + xdelta;
		const lowerY = cy - ydelta;
		const upperY = cy + ydelta;

		for (let y = lowerY; y <= upperY; y++) {
			for (let x = lowerX; x <= upperX; x++) {
				if (y<0 || x<0 || x>(this.width-1) || y>(this.height-1)) {
					rep.push(EDGE);
				} else {
					let c;
					if (cx === x && cy === y) {
						// c = `<i><u><b>${c}</b></u></i>`;
						c = `<b>${HERO}</b>`;
					} else {
						c = this.map[x][y].toString();
					}
					rep.push(c);
				}
			}
			rep.push("\n");
		}
		return rep.join('');
	};
}

export { GameState };
