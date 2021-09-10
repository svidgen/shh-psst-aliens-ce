const EMPTY = ' ';

class GameMap {
	data = [];

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

		console.log(this.toString());
	}

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
				this.data[x][y] = 'A';
				aliens--;
			}
		}
	}

	toString() {
		const rep = [];
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				rep.push(this.data[x][y]);
			}
			rep.push("\n");
		}
		return rep.join('');
	};
}

module.exports = { GameMap };