/**
 * @openapi
 * /square:
 *	 get:
 *	   operationId: square
 *	   description: Squares a number
 *	   x-pop-from-stack: 1
 *	   x-push-to-stack: 1
 *	   responses:
 *	     '303': { $ref: '#/components/responses/continue' }
 *	     '200': { $ref: '#/components/responses/end' }
 */
module.exports = (stack) => {
	const a = stack.pop();
	stack.push(a * a);
};
