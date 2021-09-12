const Commands = Object.freeze({
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4
});

const commandToName = function(command) {
	for (let name in Commands) {
		if (Commands[name] === command) {
			return name;
		}
	}
};

export {
	Commands,
	commandToName
};