'use strict';

describe('Sponsors E2E Tests:', function() {
	describe('Test Sponsors page', function() {
		it('Should not include new Sponsors', function() {
			browser.get('http://localhost:3000/#!/sponsors');
			expect(element.all(by.repeater('sponsor in sponsors')).count()).toEqual(0);
		});
	});
});
