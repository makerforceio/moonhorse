/**
 * @openapi
 * /stack/duplicate:
 *	 get:
 *	   operationId: stackDuplicate 
 *	   description: Duplicates the current item in the stack
 *	   x-pop-from-stack: 0
 *	   x-push-to-stack: 1
 *	   responses:
 *	     '303': { $ref: '#/components/responses/continue' }
 *	     '200': { $ref: '#/components/responses/end' }
 */
module.exports = (stack) => {
	const a = stack.pop();
	stack.push(a);
	stack.push(a);
};
