'use strict';

describe('Ads E2E Tests:', function() {
	describe('Test Ads page', function() {
		it('Should not include new Ads', function() {
			browser.get('http://localhost:3000/#!/ads');
			expect(element.all(by.repeater('ad in ads')).count()).toEqual(0);
		});
	});
});
