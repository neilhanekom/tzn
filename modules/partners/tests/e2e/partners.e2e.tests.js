'use strict';

describe('Partners E2E Tests:', function() {
	describe('Test Partners page', function() {
		it('Should not include new Partners', function() {
			browser.get('http://localhost:3000/#!/partners');
			expect(element.all(by.repeater('partner in partners')).count()).toEqual(0);
		});
	});
});
