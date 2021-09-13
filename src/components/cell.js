const { DomClass } = require('wirejs-dom');
const template = require('./cell.tpl').default;

const Cell = DomClass(template, function Cell() {
	this.value = this.item.toString(true);
});

module.exports = { Cell };