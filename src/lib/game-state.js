import { Commands } from './commands';
import { GameLocation } from './game-location';
import { ALIEN, DEAD_PERSON, WEAPON, EDGE, WOUND } from './items';

class GameState {

	data = [];
	position = [0,0];
	weaponDurability = 0;

	subscribers = [];

	constructor(init = {}) {
		const defaults = {width: 10, height: 10, density: 0.1};
		Object.assign(this, {...defaults, ...init});

		for (let x = 0; x < this.width; x++) {
			const col = [];
			for (let y = 0; y < this.height; y++) {
				col.push(new GameLocation(this, x, y));
			}
			this.data.push(col);
		}

		this.position = [
			Math.floor(this.width/2),
			Math.floor(this.height/2)
		];
		const [cx,cy] = this.position;

		this.placeAliens();
		// this.placeWeapons();

		this.data[cx][cy].enter();

		// TODO: remove in production!
		console.log(this.toString());
	};

	countItem(item) {
		let count = 0;
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				if (this.data[x][y].has(item)) {
					count++;
				}
			}
		}
		return count;
	};

	get aliens() {
		return this.countItem(ALIEN);
	};

	get murders() {
		return this.countItem(DEAD_PERSON);
	}

	get wounds() {
		return this.countItem(WOUND);
	}

	placeItems(item, density = null) {
		const itemCount = Math.floor(
			this.width * this.height * (density || this.density)
		);
		let itemsPlaced = 0;

		const [cx, cy] = this.position;

		while (itemsPlaced < itemCount) {
			const x = Math.floor(Math.random() * this.width);
			const y = Math.floor(Math.random() * this.height);
			if (!this.data[x][y].isEmpty) {
				// something is already here. try again.
				continue;
			} else if (x === cx && y === cy) {
				// user is here. no aliens in starting square.
				continue;
			} else {
				this.data[x][y].add(item);
				itemsPlaced++;
			}
		}

		return itemsPlaced;
	};

	placeWeapons(density = null) {
		this.placeItems(WEAPON, this.density/3);
	};

	placeAliens(denstity = null) {
		this.placeItems(ALIEN);
	};

	execute(command) {
		const t = this;
		const action = {
			[Commands.UP]: () => { t.move(0, -1); },
			[Commands.DOWN]: () => { t.move(0, 1); },
			[Commands.RIGHT]: () => { t.move(1, 0); },
			[Commands.LEFT]: () => { t.move(-1, 0); },
			[Commands.TALK]: () => { t.talk(); },
			[Commands.KILL]: () => { t.kill(); }
		}[command];
		action && action();
	};

	move(dx, dy) {
		let [x, y] = this.position;
		this.data[x][y].leave();
		x = this.bounded(x + dx, 0, this.width - 1);
		y = this.bounded(y + dy, 0, this.height - 1); 
		this.position = [x, y];
		this.data[x][y].enter();
		this.fireOnChange({name: 'move', dx, dy, x, y});
	};

	talk() {
		const [x,y] = this.position;
		this.data[x][y].talk();
		this.fireOnChange({name: 'talk', x, y});
	};

	kill() {
		const [x,y] = this.position;
		this.data[x][y].kill();
		this.fireOnChange({name: 'kill', x, y});
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

	inBounds(x, y) {
		return !(
			y < 0 ||
			x < 0 ||
			x > (this.width - 1) ||
			y > (this.height - 1)
		);
	};

	/*
	* returns width/height slice around the HERO in y,x format
	*/
	sliceYX(width, height) {
		const rows = [];

		const [cx, cy] = this.position;
		const xdelta = Math.floor((width || this.width) / 2);
		const ydelta = Math.floor((height || this.height) / 2);

		const lowerX = cx - xdelta;
		const upperX = cx + xdelta;
		const lowerY = cy - ydelta;
		const upperY = cy + ydelta;

		for (let y = lowerY; y <= upperY; y++) {
			const row = [];
			for (let x = lowerX; x <= upperX; x++) {
				if (!this.inBounds(x, y)) {
					row.push(EDGE);
				} else {
					row.push(this.data[x][y]);
				}
			}
			rows.push(row);
		}
		return rows;
	};

	mapSlice(width, height, map) {
		const data = this.sliceYX(width, height);
		return data.map(row => {
			return row.map(square => map(square));
		});
	};

	toString(width, height) {
		const data = this.sliceYX(width, height);
		return data.map(row => {
			return row.map(square => square.toString()).join('');
		}).join('\n');
	};
}

export { GameState };
