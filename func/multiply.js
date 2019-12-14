/**
 * @openapi
 * /multiply:
 *	 get:
 *	   operationId: multiply
 *	   description: Multiplies two numbers
 *	   x-pop-from-stack: 2
 *	   x-push-to-stack: 1
 *	   responses:
 *	     '303': { $ref: '#/components/responses/continue' }
 *	     '200': { $ref: '#/components/responses/end' }
 */
module.exports = (stack) => {
	const b = stack.pop();
	const a = stack.pop();
	stack.push(a * b);
};
