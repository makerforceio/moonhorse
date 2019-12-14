
const constants = {
	PI: Math.PI,
	E: Math.E,
	LN10: Math.LN10,
	LN2: Math.LN2,
};

module.exports = (stack) => {
	const key = stack.pop();
	stack.push(constants[key]);
};
