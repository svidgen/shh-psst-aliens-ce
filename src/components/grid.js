const { DomClass } = require('wirejs-dom');
const { Cell } = require('./cell');
const template = require('./grid.tpl').default;

const Grid = DomClass(template, function Grid() {
	this.cells = [];

	if (!this.map) {
		throw new Error("No map provided!");
	}

	this.cells = this.map.toString(5,5);
	this.map.onchange(() => {
		this.cells = this.map.toString(5,5);
	});

	// for (let y = 0; y < this.map.width; y++) {
	// 	for (let x = 0; x < this.width; x++) {
	// 		this.cells.push(new Cell({ value: `[${x},${y}] = ${this.map.data[x][y]}` }));
	// 	}
	// }

});

module.exports = { Grid };
