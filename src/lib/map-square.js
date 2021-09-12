import { EMPTY, ALIEN, HERO, DEAD, CROSSHAIR, WEAPON, EDGE } from './items';

class MapSquare {
	map;
	x;
	y;
	items;

	constructor(map, x, y, items = []) {
		this.map = map;
		this.x = x;
		this.y = y;
		this.items = items;
	};

	add(item) {
		this.items.push(item);
	};

	toString() {
		return this.hasAlien ? ALIEN : this.clue;
	};

	get isEmpty() {
		return this.items.length == 0;
	};

	get hasAlien() {
		return this.items.indexOf(ALIEN) > -1;
	};

	get clue() {
		const aliens = this.nearbyAliens;
		return aliens ? aliens : EMPTY;
	};

	get nearbyAliens() {
		let sum = 0;
		for (let x = this.x - 1; x <= this.x + 1; x++) {
			for (let y = this.y - 1; y <= this.y + 1; y++) {
				if (this.map[x] && this.map[x][y] && this.map[x][y].hasAlien) {
					sum++;
				}
			}
		}
		return sum;
	};

};

export { MapSquare };
