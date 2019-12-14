moodule.exports = (stack) => {
	const b = stack.pop();
	const a = stack.pop();
	stack.push(a / b);
};
