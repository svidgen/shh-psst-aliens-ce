const { DomClass } = require('wirejs-dom');
const { Grid } = require('./grid')
const { GameMap } = require('../lib/map');
const template = require('./game.tpl').default;

console.log('template', template);

const Game = DomClass(template, function Game() {
	const map = new GameMap({width: 20, height: 20});
	this.grid = new Grid({map});
});

module.exports = { Game };
