const { DomClass } = require('wirejs-dom');

const template = `<sample:copyright>
	<a href='/about.html'>&copy;<span data-id='year'>10k AD</span>
	<span data-id='owner'></span></a>
</sample:copyright>`;

const Copyright = DomClass(template, function _Copyright() {
	this.year = new Date().getFullYear() - 100;
});
