const { DomClass } = require('wirejs-dom');
const { Grid } = require('./grid')
const { GameState } = require('../lib/game-state');
const { ModalBox } = require('./modal-box');
const { KeyBoardDPad } = require('../lib/keyboard').default;
const { Commands } = require('../lib/commands');
const template = require('./game.tpl').default;

const Game = DomClass(template, function Game() {
	const _t = this;
	this.dpad = new KeyBoardDPad();

	this.init = function() {
		const state = new GameState({width: 17, height: 17, density: 0.1});
		this.grid = new Grid({state});

		this.dpad.disconnect();
		this.dpad.connect(command => state.execute(command));

		this.talkButton.onclick = function() {
			state.execute(Commands.TALK);
		};

		this.killButton.onclick = function() {
			state.execute(Commands.KILL);
		};

		this.upButton.onclick = function() {
			state.execute(Commands.UP);
		};

		this.downButton.onclick = function() {
			state.execute(Commands.DOWN);
		};

		this.leftButton.onclick = function() {
			state.execute(Commands.LEFT);
		};

		this.rightButton.onclick = function() {
			state.execute(Commands.RIGHT);
		};

		state.onchange(() => {
			if (state.wounds >= 3) {
				_t.loseGame("Sorry, you died!")
			} else if (state.murders >= 3) {
				_t.loseGame("Sorry, you killed too many people!")
			} else if (state.aliens == 0) {
				_t.winGame();
			}
		});
	};



	this.endGame = function(message) {
		this.dpad.disconnect();
		this.showModal(message);

		this.talkButton.onclick = null;
		this.killButton.onclick = null;
		this.upButton.onclick = null;
		this.downButton.onclick = null;
		this.leftButton.onclick = null;
		this.rightButton.onclick = null;
	};

	this.loseGame = function(message) {
		this.endGame(message);
	};

	this.winGame = function() {
		this.endGame("Congratulations! You killed all the aliens!");
	};

	this.showModal = function(message) {
		const modal = new ModalBox({message});
		document.body.appendChild(modal);
		modal.onclose = () => this.init();
	};

	this.init();
	
});

module.exports = { Game };