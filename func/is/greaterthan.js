/**
 * @openapi
 * /is/greaterthan:
 *	 get:
 *	   operationId: isGreaterthan
 *	   description: Produces true if previous is greater than next
 *	   x-pop-from-stack: 2
 *	   x-push-to-stack: 1
 *	   responses:
 *	     '303': { $ref: '#/components/responses/continue' }
 *	     '200': { $ref: '#/components/responses/end' }
 */
module.exports = (stack) => {
	const b = stack.pop();
	const a = stack.pop();
	stack.push(a > b);
};
