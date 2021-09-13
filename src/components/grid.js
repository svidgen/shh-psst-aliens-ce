const { DomClass } = require('wirejs-dom');
const { Cell } = require('./cell');
const { GridRow } = require('./grid-row');
const template = require('./grid.tpl').default;

const Grid = DomClass(template, function Grid() {

	if (!this.state) {
		throw new Error("No map provided!");
	}

	this.cells = this.state.mapSlice(5, 5, i => new Cell({item: i}));
	this.state.onchange(() => {
		this.cells = this.state.mapSlice(5, 5, i => new Cell({item: i})).map(row => {
			return new GridRow({cells: row});
		});
	});

	// for (let y = 0; y < this.map.width; y++) {
	// 	for (let x = 0; x < this.width; x++) {
	// 		this.cells.push(new Cell({ value: `[${x},${y}] = ${this.map.data[x][y]}` }));
	// 	}
	// }

});

module.exports = { Grid };
