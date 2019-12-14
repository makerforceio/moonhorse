const { format } = require('util');

const specifiers = ['%s', '%d', '%i', '%f', '%j', '%o', '%O']; // See https://nodejs.org/api/util.html#util_util_format_format_args

/**
 * @openapi
 * /printf:
 *	 get:
 *	   operationId: printf
 *	   description: Uses Node.js util.format style format strings to produce a string
 *	   x-pop-from-stack: unknown
 *	   x-push-to-stack: 1
 *	   responses:
 *	     '303': { $ref: '#/components/responses/continue' }
 *	     '200': { $ref: '#/components/responses/end' }
 */
module.exports = (stack) => {
	const string = stack.pop();
	const count = specifiers
		.map(s => string.match(new RegExp(s, 'g')))
		.map(m => (m || []).length)
		.reduce((a, m) => a + m, 0);
	const args = [];
	for (let i = 0; i < count; i++) {
		args.push(stack.pop());
	}
	stack.push(format(string, ...args));
};
