const { DomClass } = require('wirejs-dom');
const { Grid } = require('./grid')
const { GameState } = require('../lib/game-state');
const { KeyBoardDPad } = require('../lib/keyboard').default;
const { Commands } = require('../lib/commands');
const template = require('./game.tpl').default;

const Game = DomClass(template, function Game() {
	const map = new GameState({width: 20, height: 20, density: 0.1});
	this.grid = new Grid({map});

	this.dpad = new KeyBoardDPad();
	this.dpad.connect(command => map.execute(command));
});

module.exports = { Game };
