'use strict';

var people = {

	dataStore: null,

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

	render(element) {
		const list = document.createElement('ul');
		element.appendChild(list);
		this.dataStore.forEach(item => {
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

	dataStore: null,

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

	render(element) {
		this.dataStore.forEach(item => {
			const nameElement = document.createElement('p');
			nameElement.innerHTML = item.name;
			element.appendChild(nameElement);
		});
	}

};

var films = {

	dataStore: null,

	transform(data) {
		return data
	},

	render(element) {
		this.dataStore.forEach(item => {
			const titleElement = document.createElement('p');
			titleElement.innerHTML = `${item.title} (${item.release_date.slice(0, 4)})`;
			element.appendChild(titleElement);
		});
	}

};

const hasDataStore = endpoint => !!window[endpoint].dataStore;

const endpointElements = endpoint => Array.from(document.querySelectorAll(`[data-api-endpoint="${endpoint}"]`));

const toggleLoading = (element, isLoading = true) => {
	const method = isLoading ? 'add' : 'remove';
	element.querySelector('.js-loading').classList[method]('is-visible');
};

const renderData = (element, endpoint) => window[endpoint].render(element);

const handleSuccess = (endpoint, data) => {
	endpointElements(endpoint).forEach(element => {
		renderData(element, endpoint);
		toggleLoading(element, false);
	});
};

const handleError = (endpoint, error) => endpointElements(endpoint).forEach(element => element.innerHTML = 'Sorry, we could not load that data.');

const dataElements = Array.from(document.querySelectorAll('.js-data')) || null;

if (dataElements) {
	const endpoints = [];

	dataElements.forEach(element => {
		const endpoint = element.dataset.apiEndpoint;
		if (endpoints.indexOf(endpoint) < 0) endpoints.push(endpoint);
		toggleLoading(element);
	});

	endpoints.forEach(endpoint => {
		console.log(`fetching ${endpoint}`);
		fetch(`https://swapi.co/api/${endpoint}`)
			.then(response => response.json())
			.then(data => window[endpoint].transform(data.results))
			.then(data => window[endpoint].dataStore = data)
			.then(data => handleSuccess(endpoint, data))
			.catch(error => handleError(endpoint, error));
	});

}
