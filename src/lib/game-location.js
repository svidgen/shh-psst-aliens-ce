import {
	EMPTY,
	ALIEN,
	HERO,
	PERSON,
	DEAD_PERSON,
	ANGRY_PERSON,
	WOUND,
	DEAD_ALIEN
} from './items';

class GameLocation {
	map;
	x;
	y;
	items;
	visited = false;
	investigated = false;

	constructor(state, x, y, items = []) {
		this.state = state;
		this.map = state.data;
		this.x = x;
		this.y = y;
		this.items = items;
	};

	add(item) {
		this.items.push(item);
	};

	remove(item) {
		const index = this.items.indexOf(item);
		if (index > -1) {
			this.items.splice(index, 1);
		}
	};

	has(item) {
		return this.items.indexOf(item) > -1;
	};

	enter() {
		this.visited = true;
		this.add(HERO);
	};

	leave() {
		this.remove(HERO);
	};

	talk() {
		if (this.has(ALIEN)) {
			// this.state.injur();
			this.remove(ALIEN);
			this.add(WOUND);
		} else if (this.clue) {
			this.investigated = true;
		}
	};

	kill() {
		if (this.has(ALIEN)) {
			this.remove(ALIEN);
			this.add(DEAD_ALIEN);
		} else if (this.clue) {
			this.add(DEAD_PERSON);
			// this.state.addStrike();
		}
	};

	toString() {
		let repr = this.items.join('');
		this.clue ? (repr += this.clue) : undefined;
		return repr;
	};

	get isEmpty() {
		return this.items.length == 0;
	};

	get clue() {
		if (this.has(DEAD_PERSON) || this.isAlien) {
			return;
		}

		const alienCount = this.alienItemCount;
		const murders = this.countNearby(DEAD_PERSON);

		if (alienCount) {	
			if (murders > 0) {
				return ANGRY_PERSON;
			}
			if (this.investigated) {
				return `"${alienCount}"`;
			} else {
				return PERSON;
			}
		} else {
			return;
		}
	};

	get alienItemCount() {
		return this.countNearby(ALIEN)
			+ this.countNearby(DEAD_ALIEN)
			+ this.countNearby(WOUND)
		;
	};

	get isAlien() {
		return (
			this.has(ALIEN) ||
			this.has(DEAD_ALIEN) ||
			this.has(WOUND)
		);
	};

	countNearby(item) {
		let sum = 0;
		for (let x = this.x - 1; x <= this.x + 1; x++) {
			for (let y = this.y - 1; y <= this.y + 1; y++) {
				if (
					this.map[x] &&
					this.map[x][y] &&
					this.map[x][y].has(item)
				) {
					sum++;
				}
			}
		}
		return sum;
	};

};

export { GameLocation };
