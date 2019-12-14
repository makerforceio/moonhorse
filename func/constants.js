
const constants = {
	PI: Math.PI,
	E: Math.E,
	LN10: Math.LN10,
	LN2: Math.LN2,
};

/**
 * @openapi
 * /constants:
 *	 get:
 *	   operationId: constants
 *	   description: Get a constant
 *	   x-push-to-stack: 1
 *	   responses:
 *	     '303': { $ref: '#/components/responses/continue' }
 *	     '200': { $ref: '#/components/responses/end' }
 */
module.exports = (stack) => {
	const key = stack.pop();
	stack.push(constants[key]);
};
