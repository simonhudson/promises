'use strict';

const renderData = (data) => {
	console.table(data);
};

const getData = () => {
	fetch('https://swapi.co/api/people/')
		.then(response => response.json())
		.then(data => renderData(data.results))
		.catch(error => console.log(error));
};

getData();
console.log(1);
console.log(2);
