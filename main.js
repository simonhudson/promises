'use strict';

var people = {

	self: this,

	transform: function(data) {
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

	render: {

		links(element, endpoint) {
			const list = document.createElement('ul');
			element.appendChild(list);
			window[endpoint].dataStore.forEach(item => {
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
			return element;
		},

		_default(element, endpoint) {
			const list = document.createElement('ul');
			element.appendChild(list);
			window[endpoint].dataStore.forEach(item => {
				const listItem = document.createElement('li');
				listItem.textContent = item.name;
				list.appendChild(listItem);
			});
			return element;
		}

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

	render: {
		_default(element, endpoint) {
			window[endpoint].dataStore.forEach(item => {
				const nameElement = document.createElement('p');
				nameElement.innerHTML = item.name;
				element.appendChild(nameElement);
			});
			return element;
		}
	}

};

var films = {

	transform(data) {
		return data
	},

	render: {
		_default(element, endpoint) {
			window[endpoint].dataStore.forEach(item => {
				const titleElement = document.createElement('p');
				titleElement.innerHTML = `${item.title} (${item.release_date.slice(0, 4)})`;
				element.appendChild(titleElement);
			});
			return element;
		}
	}

};
const dataElements = Array.from(document.querySelectorAll('.js-data')) || null;
const endpointElements = endpoint => Array.from(document.querySelectorAll(`[data-api-endpoint="${endpoint}"]`));
const endpoints = [];

const hasDataStore = endpoint => !!window[endpoint].dataStore;

const toggleLoading = (element, isLoading = true) => {
	const method = isLoading ? 'add' : 'remove';
	element.querySelector('.js-loading').classList[method]('is-visible');
};

const renderData = (element, endpoint) => {
	const view = element.dataset.renderView || '_default';
	window[endpoint].render[view](element, endpoint);
};

const handleSuccess = (endpoint, data) => {
	endpointElements(endpoint).forEach(element => {
		renderData(element, endpoint);
		toggleLoading(element, false);
	});
};

const handleError = (endpoint, error) => endpointElements(endpoint).forEach(element => element.innerHTML = 'Sorry, we could not load that data.');

if (dataElements) {

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
