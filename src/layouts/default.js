const wirejs = require('wirejs-dom');
require('./default.css');

const game = require('../components/game');
console.log(game);

// expose DomClass to later scripts.
Object.assign(window, wirejs);

// because this script is intended to be loaded at the top, and DomClass
// doesn't currently handle this, we need to bless() the document async (after the DOM is built).
// we may even want to do this repeatedly over the course of a few seconds to
// allow for "settling". (it should be safe to call "bless" repeatedly.)

function init() {
	document.readyState === 'complete' ?
		wirejs.bless(document) :
		setTimeout(init, 1);
}

setTimeout(init, 1);
