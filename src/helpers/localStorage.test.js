import { getData, storeData } from './localStorage';

const KEY = 'test';

describe('localStorage helpers', () => {
	beforeEach(() => {
		localStorage.removeItem(KEY);
	});

	describe('getData', () => {
		it('returns null when no data is stored', () => {
			expect(getData(KEY)).toBe(null);
		});

		it('returns some stored data', () => {
			localStorage.setItem(KEY, '{"msg":"hello"}');
			expect(getData(KEY)).toEqual({ msg: 'hello' });
		});

		it('returns undefined if broken JSON data is stored', () => {
			localStorage.setItem(KEY, '{"msg":"hel');
			expect(getData(KEY)).toBe(undefined);
		});
	});

	describe('storeData', () => {
		it('stores some data', () => {
			storeData(KEY, { msg: 'hello' })
			expect(localStorage.getItem(KEY)).toBe('{"msg":"hello"}');
		});

		it('fails to store some data', () => {
			// circular
			const obj = {};
			obj.obj = obj;
			storeData(KEY, obj)
			expect(localStorage.getItem(KEY)).toBe(null);
		});
	})
});
