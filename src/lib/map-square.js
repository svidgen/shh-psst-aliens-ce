import {
	EMPTY,
	ALIEN,
	HERO,
	DEAD,
	CROSSHAIR,
	WEAPON,
	EDGE,
	HIDDEN
} from './items';

class MapSquare {
	map;
	x;
	y;
	items;
	visited = false;

	constructor(state, x, y, items = []) {
		this.state = state;
		this.map = state.map;
		this.x = x;
		this.y = y;
		this.items = items;
	};

	add(item) {
		this.items.push(item);
	};

	has(item) {
		return this.items.indexOf(item) > -1;
	};

	visit() {
		this.visited = true;
	};

	toString() {
		return this.visited ? (this.has(ALIEN) ? ALIEN : this.clue) : HIDDEN;
	};

	get isEmpty() {
		return this.items.length == 0;
	};

	get clue() {
		const aliens = this.nearbyAliens;
		return aliens ? aliens : EMPTY;
	};

	get nearbyAliens() {
		let sum = 0;
		for (let x = this.x - 1; x <= this.x + 1; x++) {
			for (let y = this.y - 1; y <= this.y + 1; y++) {
				if (
					this.map[x] &&
					this.map[x][y] &&
					this.map[x][y].has(ALIEN)
				) {
					sum++;
				}
			}
		}
		return sum;
	};

};

export { MapSquare };
