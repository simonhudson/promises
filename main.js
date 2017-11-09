'use strict';


var people = {

	transform(data) {
		const dataObj = [];
		data.forEach(item => {
			dataObj.push(
				{
					metadata: {
						created: item.created,
						edited: item.edited,
						url: item.url
					},
					name: item.name
				}
			)
		});
		return dataObj;
	},

	render(data, element) {
		const list = document.createElement('ul');
		element.appendChild(list);
		data.forEach(item => {
			const listItem = document.createElement('li');
			const link = document.createElement('a');
			const attributes = [
				{
					attr: 'href',
					value: item.metadata.url
				}
			];
			attributes.forEach(attribute => link.setAttribute(attribute.attr, attribute.value));
			link.textContent = item.name;
			listItem.appendChild(link);
			list.appendChild(listItem);
		});
	}

};

var planets = {

	transform(data) {
		const dataObj = [];
		data.forEach(item => {
			dataObj.push(
				{
					name: item.name
				}
			)
		});
		return dataObj;
	},

	render(data, element) {
		data.forEach(item => {
			const nameElement = document.createElement('p');
			nameElement.innerHTML = item.name;
			element.appendChild(nameElement);
		});
	}

};

const toggleLoading = (element, isLoading = true) => {
	const method = isLoading ? 'add' : 'remove';
	element.querySelector('.js-loading-img').classList[method]('is-visible');
};

const renderData = (element, endpoint, data) => window[endpoint]['render'](data, element);

const handleSuccess = (element, endpoint, data) => {
	renderData(element, endpoint, data);
	toggleLoading(element, false);
};

const handleError = (error, element) => element.innerHTML = 'Sorry, we could not load that data.';

const elements = Array.from(document.querySelectorAll('.js-data')) || null;

if (elements) {
	elements.forEach(element => {
		const endpoint = element.dataset.apiEndpoint;
		toggleLoading(element);
		fetch(`https://swapi.co/api/${endpoint}`)
			.then(response => response.json())
			.then(data => window[endpoint]['transform'](data.results))
			.then(data => handleSuccess(element, endpoint, data))
			.catch(error => handleError(error, element));

	});
}
