moodule.exports = (stack) => {
	const a = stack.pop();
	const b = stack.pop();
	stack.push(a + b);
};
