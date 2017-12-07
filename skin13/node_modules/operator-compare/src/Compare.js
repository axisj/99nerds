module.exports = function(left, operator, right) {
	switch (operator) {
		case '>': return left > right;
		case '>=': return left >= right;
		case '<': return left < right;
		case '<=': return left <= right;
		case '=':
		case '==': return left === right;
		case '!':
		case '!=':
		case '<>': return left !== right;
		default:
			throw new Error('Unknown operator ' + operator + '.', '^.');
	}
};
