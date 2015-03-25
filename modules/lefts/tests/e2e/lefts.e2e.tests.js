'use strict';

describe('Lefts E2E Tests:', function() {
	describe('Test Lefts page', function() {
		it('Should not include new Lefts', function() {
			browser.get('http://localhost:3000/#!/lefts');
			expect(element.all(by.repeater('left in lefts')).count()).toEqual(0);
		});
	});
});
