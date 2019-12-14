module.exports = (stack) => {
	const a = stack.pop();
	stack.push(a * a);
};
