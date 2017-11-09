'use strict';

const toggleLoading = (element, isLoading = true) => {
	const method = isLoading ? 'add' : 'remove';
	element.querySelector('.js-loading-img').classList[method]('is-visible');
};

var people = {

	transform(data) {
		console.log(data[0]);
		const dataObj = [];
		data.forEach(item => {
			dataObj.push(
				{
					metadata: {
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

const handleError = (error, element) => {
	console.log(error);
	element.innerHTML = 'Sorry, we could not load that data.';
};

const renderData = (element, endpoint, data) => {
	data = window[endpoint]['transform'](data);
	window[endpoint]['render'](data, element);
	toggleLoading(element, false);
};

const elements = Array.from(document.querySelectorAll('.js-data')) || null;

if (elements) {
	elements.forEach(element => {
		toggleLoading(element);
		const endpoint = element.dataset.apiEndpoint;
		fetch(`https://swapi.co/api/${endpoint}`)
		.then(response => response.json())
		.then(data => renderData(element, endpoint, data.results))
		.catch(error => handleError(error, element));

	});
}
