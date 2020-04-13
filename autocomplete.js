const createAUtoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
	// HTML search box display
	root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

	// Selectors
	const input = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const resultsWrapper = root.querySelector('.results');

	const onInput = async (event) => {
		const items = await fetchData(event.target.value);

		// Removes dropdown box if search is cleared
		if (!items.length) {
			dropdown.classList.remove('is-active');
			return;
		}

		// Sets initial value of HTML to blank
		resultsWrapper.innerHTML = '';
		dropdown.classList.add('is-active');

		// loop through movies and display as an anchor
		for (let item of items) {
			const option = document.createElement('a');

			// Adds each option to the dropdown list
			option.classList.add('dropdown-item');
			option.innerHTML = renderOption(item);

			// Update input text to match movie clicked
			option.addEventListener('click', () => {
				dropdown.classList.remove('is-active');
				input.value = inputValue(item);
				onOptionSelect(item);
			});

			resultsWrapper.appendChild(option);
		}
	};

	input.addEventListener('input', debounce(onInput, 500));

	// Close dropdown if user clicks outside of root
	document.addEventListener('click', (event) => {
		if (!root.contains(event.target)) {
			dropdown.classList.remove('is-active');
		}
	});
};
