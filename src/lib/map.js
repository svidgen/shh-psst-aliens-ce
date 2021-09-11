const EMPTY = ' ';

class GameMap {

	data = [];
	clues = [];
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
				this.data[x][y] = 'A';
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
				if (this.data[_x] && this.data[_x][_y] === 'A') {
					sum++;
				}
			}
		}
		return sum;
	};

	toString() {
		const rep = [];
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				rep.push(this.data[x][y] === 'A' ? 'A' : this.clues[x][y]);
			}
			rep.push("\n");
		}
		return rep.join('');
	};
}

export default { GameMap };
