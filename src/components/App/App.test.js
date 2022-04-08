import React from 'react';
import { shallow, mount } from 'enzyme';
import App from './App';
import { storeData } from '../../helpers/localStorage';

describe('App Component', () => {
	let wrapper;

	it('passes shallow render', () => {
		wrapper = shallow(<App />);
		expect(wrapper).not.toBeNull();
	});

	it('passes full render', () => {
		wrapper = mount(<App />);

		// Input weight
		const inputWeight = wrapper.find('input[name="weight"]');
		inputWeight.simulate('change', {
			target: { name: 'weight', value: '71' },
		});

		// Input height
		const inputHeight = wrapper.find('input[name="height"]');
		inputHeight.simulate('change', {
			target: { name: 'height', value: '179' },
		});

		// Get submit btn and check that it exists
		const submitBmiBtn = wrapper.find('#bmi-btn');
		expect(submitBmiBtn.exists()).toBeTruthy();

		// Click submit btn
		submitBmiBtn.simulate('click');

		// Check results by checking a new card appeared
		const cards = wrapper.find('.card-content');
		expect(cards.length).toBe(1);

		// Title should contain 'BMI: ' and '22.16'
		expect(cards.first().find('.card-title').props().children).toEqual([
			'BMI: ',
			'22.16',
		]);
	});

	it('handles item deletion', () => {
		// store sample data
		const sampleData = [
			{
				weight: '68',
				height: '175',
				date: '4/9/2022',
				bmi: '22.20',
				id: '9c8eb716-ecd0-4db6-85fe-4561672b1cab',
			},
		];
		storeData('data', sampleData);

		wrapper = mount(<App />);

		const deleteBtn = wrapper.find('.delete-btn').first();
		deleteBtn.simulate('click');

		const cards = wrapper.find('.card-content');
		expect(cards.length).toBe(0);

		localStorage.removeItem('data');
	});
});
