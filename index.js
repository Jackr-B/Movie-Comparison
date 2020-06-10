// All reusable properties
const autoCompleteConfig = {
	renderOption(movie) {
		// If movie image is N/A set to blank
		const imageSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
		return `
		<img src="${imageSrc}" />
		${movie.Title} (${movie.Year})
	`;
	},
	inputValue(movie) {
		return movie.Title;
	},
	// Search API for the search term
	async fetchData(searchTerm) {
		const response = await axios.get('https://www.omdbapi.com/', {
			params: {
				apikey: '9a2a73fc',
				s: searchTerm
			}
		});

		if (response.data.Error) {
			return [];
		}
		return response.data.Search;
	}
};

// Renders each movie
createAUtoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#left-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
	}
});
createAUtoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#right-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
	}
});

let leftMovie;
let rightMovie;
// Following click of movie search API for information
const onMovieSelect = async (movie, summaryElement, side) => {
	const response = await axios.get('https://www.omdbapi.com/', {
		params: {
			apikey: '9a2a73fc',
			i: movie.imdbID
		}
	});

	summaryElement.innerHTML = movieTemplate(response.data);

	if (side === 'left') {
		leftMovie = response.data;
	} else {
		rightMovie = response.data;
	}

	if (leftMovie && rightMovie) {
		runComparison();
	}
};

const runComparison = () => {
	const leftSideStats = document.querySelectorAll('#left-summary .notification');
	const rightSideStats = document.querySelectorAll('#right-summary .notification');

	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];

		const leftSideValue = parseInt(leftStat.dataset.value);
		const rightSideValue = parseInt(rightStat.dataset.value);

		if (rightSideValue > leftSideValue) {
			leftStat.classList.remove('is-primary');
			leftStat.classList.add('is-warning');
		} else {
			rightStat.classList.remove('is-primary');
			rightStat.classList.add('is-warning');
		}
	});
};

// Format of what information to display for each movie
const movieTemplate = (movieDetail) => {
	// Convert value to a comparable number
	const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
	const metascore = parseInt(movieDetail.Metascore);
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

	// Totals all nominations and awards, removing any strings
	const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
		const value = parseInt(word);

		if (isNaN(value)) {
			return prev;
		} else {
			return prev + value;
		}
	}, 0);

	return `
		<article class="media">
			<figure class="media-left">
				<p class="image">
					<img src="${movieDetail.Poster}"/>
				</p>
			</figure>
			<div class="media-content">
				<div class="content">
					<h1>${movieDetail.Title}</h1>
					<h1>${movieDetail.Genre}</h1>
					<p>${movieDetail.Plot}</p>
				</div>
			</div>
		</article>	
		<article data-value=${awards} class="notification is-primary">
			<p class="title">${movieDetail.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>
		<article data-value=${dollars} class="notification is-primary">
			<p class="title">${movieDetail.BoxOffice}</p>
			<p class="subtitle">Box Office</p>
		</article>
		<article data-value=${metascore} class="notification is-primary">
			<p class="title">${movieDetail.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>
		<article data-value=${imdbRating} class="notification is-primary">
			<p class="title">${movieDetail.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article data-value=${imdbVotes} class="notification is-primary">
			<p class="title">${movieDetail.imdbVotes}</p>
			<p class="subtitle">IMDB Votes</p>
		</article>
	`;
};
