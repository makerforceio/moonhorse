/**
 * @openapi
 * /add:
 *	 get:
 *	   operationId: add
 *	   description: Adds two numbers together
 *	   x-pop-from-stack: 2
 *	   x-push-to-stack: 1
 */
module.exports = (stack) => {
	const b = stack.pop();
	const a = stack.pop();
	stack.push(a + b);
};
