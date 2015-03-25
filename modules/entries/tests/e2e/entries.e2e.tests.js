'use strict';

describe('Entries E2E Tests:', function() {
	describe('Test Entries page', function() {
		it('Should not include new Entries', function() {
			browser.get('http://localhost:3000/#!/entries');
			expect(element.all(by.repeater('entry in entries')).count()).toEqual(0);
		});
	});
});
