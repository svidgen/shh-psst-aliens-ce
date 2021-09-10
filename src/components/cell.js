const { DomClass } = require('wirejs-dom');
const template = require('./cell.tpl').default;

const Cell = DomClass(template, function Cell() {

});

module.exports = { Cell };