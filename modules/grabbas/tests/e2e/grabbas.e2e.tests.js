'use strict';

describe('Grabbas E2E Tests:', function() {
	describe('Test Grabbas page', function() {
		it('Should not include new Grabbas', function() {
			browser.get('http://localhost:3000/#!/grabbas');
			expect(element.all(by.repeater('grabba in grabbas')).count()).toEqual(0);
		});
	});
});
