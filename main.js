'use strict';

const toggleLoading = (element, isLoading = true) => {
	const method = isLoading ? 'add' : 'remove';
	element.querySelector('.js-loading-img').classList[method]('is-visible');
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

const handleError = (error, element) => {
	console.log(error);
	element.innerHTML = 'Sorry, we could not load that data.';
};

const elements = Array.from(document.querySelectorAll('.js-data')) || null;

const renderData = (element, endpoint, data) => {
	render[endpoint](data, element);
	toggleLoading(element, false);
};

elements.forEach(element => {
	toggleLoading(element);
	const endpoint = element.dataset.apiEndpoint;
	fetch(`https://swapi.co/api/${endpoint}`)
		.then(response => response.json())
		.then(data => renderData(element, endpoint, data.results))
		.catch(error => handleError(error, element));

});
