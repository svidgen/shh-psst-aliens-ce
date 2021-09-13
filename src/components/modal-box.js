const { DomClass } = require('wirejs-dom');
const template = require('./modal-box.tpl').default;

const ModalBox = DomClass(template, function() {
	const _t = this;
	this.restartButton.onclick = () => {
		_t.parentNode.removeChild(_t);
		_t.onclose();
	};
});

export { ModalBox };