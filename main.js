'use strict';

const toggleLoading = (element, isLoading = false) => {
	const method = isLoading ? 'remove' : 'add';
	element.querySelector('.js-loading-img').classList[method]('hidden');
};

const transform = {

	people(data) {
		const returnData = [];
		data.forEach(item => returnData.push({name: item.name}));
		return returnData;
	}

};

const render = {

	people(data, element) {
		data.forEach(item => {
			const nameElement = document.createElement('p');
			nameElement.innerHTML = item.name;
			element.appendChild(nameElement);
		});
	},
	planets(data, element) {
		data.forEach(item => {
			const nameElement = document.createElement('p');
			nameElement.innerHTML = item.name;
			element.appendChild(nameElement);
		});
	},

};

const elements = Array.from(document.querySelectorAll('.js-data')) || null;

const renderData = (element, endpoint, data) => {
	render[endpoint](data, element);
	toggleLoading(element);
};

elements.forEach(element => {
	const endpoint = element.dataset.apiEndpoint;
	fetch(`https://swapi.co/api/${endpoint}`)
		.then(response => response.json())
		.then(data => renderData(element, endpoint, data.results))
		.catch(error => console.log(error));

});
