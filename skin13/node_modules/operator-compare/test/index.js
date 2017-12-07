var should = require('should');

var compare = require('../src/Compare');

describe('Compare', function() {

	it('should return true if first argument is greater than the second one', function() {
		compare(5, '>', 1).should.be.true;
		compare(5, '>', 5).should.be.false;
		compare(5, '>', 10).should.be.false;
	});

	it('should return true if first argument is greater or the same like the second one', function() {
		compare(5, '>=', 1).should.be.true;
		compare(5, '>=', 5).should.be.true;
		compare(5, '>=', 10).should.be.false;
	});

	it('should return true if first argument is smaller than the second one', function() {
		compare(5, '<', 1).should.be.false;
		compare(5, '<', 5).should.be.false;
		compare(5, '<', 10).should.be.true;
	});

	it('should return true if first argument is smaller or the same like the second one', function() {
		compare(5, '<=', 1).should.be.false;
		compare(5, '<=', 5).should.be.true;
		compare(5, '<=', 10).should.be.true;
	});

	it('should return true if arguments are same', function() {
		compare(5, '=', 1).should.be.false;
		compare(5, '=', 5).should.be.true;
		compare(5, '==', 1).should.be.false;
		compare(5, '==', 5).should.be.true;
	});

	it('should return true if arguments are not same', function() {
		compare(5, '!', 1).should.be.true;
		compare(5, '!', 5).should.be.false;
		compare(5, '!=', 1).should.be.true;
		compare(5, '!=', 5).should.be.false;
		compare(5, '<>', 1).should.be.true;
		compare(5, '<>', 5).should.be.false;
	});

	it('should throw error if operator is unknown', function() {
		(function() { compare(5, 'do something', 1); }).should.throw();
	});

});
