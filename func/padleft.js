/**
 * @openapi
 * /padleft:
 *	 get:
 *	   operationId: padleft
 *	   description: Pad left!
 *	   x-pop-from-stack: 3
 *	   x-push-to-stack: 1
 *	   responses:
 *	     '303': { $ref: '#/components/responses/continue' }
 *	     '200': { $ref: '#/components/responses/end' }
 */
module.exports = (stack) => {
	const c = stack.pop();
	const b = stack.pop();
	const a = stack.pop();
	stack.push(a.padStart(b, c));
};
