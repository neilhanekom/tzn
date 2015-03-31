'use strict';

describe('Advertisements E2E Tests:', function() {
	describe('Test Advertisements page', function() {
		it('Should not include new Advertisements', function() {
			browser.get('http://localhost:3000/#!/advertisements');
			expect(element.all(by.repeater('advertisement in advertisements')).count()).toEqual(0);
		});
	});
});
