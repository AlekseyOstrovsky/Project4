"use strict";

let resultsList = document.querySelector('.search__results');
let resultsNumber = document.querySelector('.search__form-result');
let searchform = document.querySelector('.search__form');
let resultsTotal = 0;

searchform.onsubmit = function(event) {
	event.preventDefault();
	let query = searchform.name.value;
	if (query == '') {
		alert('Введите поисковый запрос');
		return;
	}
	getGitRepos(query).then(result => showResponse(result));
}

async function getGitRepos(query) {
	let githubResponse = await fetch(`https://api.github.com/search/repositories?q=${query}`);
	if (githubResponse.status == 200) {
		return githubResponse.json();
	} else {		
		return null;
	}
}

function showResponse(result) {
	resultsTotal = result.total_count;
	if (result == null) {
		showNull(err);
	} else {
		if (resultsTotal == 0) {
			showNull();
		} else {
			showResults(result,10);
		}		
	}
}

function showNull(err = false) {
	resultsNumber.textContent = 'Найдено: 0'
	if (err) {		
		resultsList.innerHTML = 'Ошибка...'
	} else {
		resultsList.innerHTML = 'Ничего не найдено...'
	}
}

function showResults(obj, max) {
	resultsNumber.textContent = `Найдено: ${resultsTotal}`
	resultsList.innerHTML = '';
	let i=0;
	while ( i < Math.min(resultsTotal, max) ) {
		showOneResult(obj.items[i]);
		i++;
	}
}

function showOneResult(elem) {
	let newDiv = document.createElement('div');
	newDiv.className = 'search__result-body';
	newDiv.innerHTML = `<div class="search__result-header"><a href="${elem.owner.html_url}" target="_blank">${elem.owner.login}</a>
	&nbsp;/&nbsp;<a href="${elem.html_url}" target="_blank">${elem.name}</a></div>
	<div class="search__result-counters">language: ${elem.language}; stars: ${elem.stargazers_count}; 
	forks: ${elem.forks_count}</div><div class="search__result-description">${elem.description}</div>`;
	resultsList.append(newDiv);
}