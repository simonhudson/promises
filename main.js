'use strict';

const element = document.getElementById('js-data');

const renderData = (data) => {
	element.textContent = 'Complete';
	console.table(data);
};

const getData = (callback) => {
	fetch('https://swapi.co/api/people/')
		.then(response => response.json())
		.then(data => callback(data.results))
		.catch(error => console.log(error));
};

getData(renderData);
