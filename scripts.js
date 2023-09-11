{
    "source": {
        "include": [".C:\Users\P50\MyCodeSpaceProjects\interactive-web-apps\IWA19\scripts.js"],
        "exclude": ["node_modules/"]
    },
    "opts": {
        "destination": "out/"
    }
}


import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

/**
 * An Object literal which includes all the HTML elements that are referenced in
 * the Javascript script and modules codebase. The elements are structured
 * within sub-Object literals in order to create separation based on the type of
 * function/ purpose they serve in the app. This object literal structure allows
 * for Destructuring Assignment to be performed on it as well, which will result
 * in cleaner and more readable code.
 *
 */
const html = {
	header: {
		search: document.querySelector("[data-header-search]"),
		settings: document.querySelector("[data-header-settings]"),
	},
	list: {
		dialog: document.querySelector("[data-list-active]"),
		items: document.querySelector("[data-list-items]"),
		message: document.querySelector("[data-list-message]"),
		title: document.querySelector("[data-list-title]"),
		blur: document.querySelector("[data-list-blur]"),
		image: document.querySelector("[data-list-image]"),
		subtitle: document.querySelector("[data-list-subtitle]"),
		description: document.querySelector("[data-list-description]"),
		button: document.querySelector("[data-list-button]"),
		close: document.querySelector("[data-list-close]"),
	},
	search: {
		dialog: document.querySelector("[data-search-overlay]"),
		form: document.querySelector("[data-search-form]"),
		title: document.querySelector("[data-search-title]"),
		genres: document.querySelector("[data-search-genres]"),
		authors: document.querySelector("[data-search-authors]"),
		cancel: document.querySelector("[data-search-cancel]"),
		search: document.querySelector('button[form="search"]'),
	},
	settings: {
		dialog: document.querySelector("[data-settings-overlay]"),
		form: document.querySelector("[data-settings-form]"),
		theme: document.querySelector("[data-settings-theme]"),
		cancel: document.querySelector("[data-settings-cancel]"),
		save: document.querySelector('button[form="settings"]'),
	},
};

const {
	header: { search: searchButton, settings: settingsButton },
	list: {
		dialog: listDialog,
		items: listItems,
		message: message,
		title: title,
		blur: blur,
		image: bookImage,
		subtitle: subtitle,
		description: description,
		button: listButton,
		close: closeList,
	},
	search: {
		dialog: searchDialog,
		form: searchForm,
		title: searchTitle,
		genres: searchGenres,
		authors: searchAuthors,
		cancel: cancelSearch,
	},
	settings: {
		dialog: settingsDialog,
		form: settingsForm,
		theme: settingsTheme,
		cancel: cancelSettings,
		save: saveSettings,
	},
} = html;

/**
 * An Event Handler callback function that is triggered when the `searchButton`
 * or `cancelSearch` HTML button elements are fired by a click EventListener.
 * When called, the function checks whether or not the `searchDialog` is open or
 * not, if it's not, the `showModal()` method is used to display it as modal on
 * the screen, otherwise it is closed.
 */
const handleToggleSearch = () => {
	const searchDialogOpen = searchDialog.open;

	if (!searchDialogOpen) searchDialog.showModal();
	if (searchDialogOpen) searchDialog.close();
};

/**
 * This Event Handler callback function works exactly the same as the
 * {@link handleToggleSearch} funtion. However, the dialog element that is being
 * worked on is the {@link settingsDialog}, which will be displayed as a modal
 * or closed based on the triggering of the {@link settingsButton} or
 * {@link cancelSettings} button elements.
 *
 *
 */
const handleToggleSettings = () => {
	const settingsDialogOpen = settingsDialog.open;

	if (!settingsDialogOpen) settingsDialog.showModal();
	if (settingsDialogOpen) settingsDialog.close();
};

/**
 * An event handler callback function is triggered when the {@link saveSettings}
 * submit form button is clicked via an EventListener. When invoked, the
 * function retrieves the {@link settingsTheme} value (either 'night' or 'day')
 * and performs a conditional check on it. If one of these values was indeed
 * selected by the user, it is then used as a key to retrieve the corresponding
 * CSS RGB color styles for the dark and light themes from the {@link css}
 * object literal. The CSS property values are subsequently parsed individually into the
 * `CSSStyleDeclaration.setProperty()` method as the new values. The CSS
 * properties (`--color-dark` or `--color-light`) are then updated accordingly
 * using this method, effectively toggling the app's theme between 'night' and
 * 'day.'
 *
 * @param {*} event
 */
const handleToggleTheme = (event) => {
	event.preventDefault();

	const css = {
		day: { dark: "10, 10, 20", light: "255, 255, 255" },
		night: { dark: "255, 255, 255", light: "10, 10, 20" },
	};

	const nightThemeSelected = settingsTheme.value === "night";
	let value = undefined;

	if (nightThemeSelected) value = "night";
	if (!nightThemeSelected) value = "day";

	const styleDeclaration = document.styleSheets[0].cssRules[0].style;

	if (value) {
		styleDeclaration.setProperty("--color-dark", css[value].dark);
		styleDeclaration.setProperty("--color-light", css[value].light);
	}

	settingsDialog.close();
};

searchButton.addEventListener("click", handleToggleSearch);
cancelSearch.addEventListener("click", handleToggleSearch);

settingsButton.addEventListener("click", handleToggleSettings);
cancelSettings.addEventListener("click", handleToggleSettings);

saveSettings.addEventListener("click", handleToggleTheme);

const matches = books;
let page = 1;
const range = [0, BOOKS_PER_PAGE];

if (!books && !Array.isArray(books)) throw new Error("Source required");
if (!range && range.length < 2)
	throw new Error("Range must be an array with two numbers");

/**
 * When called, the {@link range} array's values are updated accordingly. By
 * default the range array is set to `[0, BOOKS_PER_PAGE]`, and with each call
 * the numbers are incremented by the {@link BOOKS_PER_PAGE} value.
 */
const updateRange = () => {
	let startNumber = range[0];
	let endNumber = range[1];

	range[0] = startNumber + BOOKS_PER_PAGE;
	range[1] = endNumber + BOOKS_PER_PAGE;
};

/**
 * An event handler callback function triggered by a click of the
 * {@link listButton}. When called, it extracts a specific range of book entries
 * (elements) from the {@link source} book array. Using a `for...of` loop, it
 * extracts each book's (`id`, `title`, `author`, and `image`) values. A button
 * element is created, and the values are parsed as `class` or `data` attributes
 * and `innerHTML` content. Each button created during the iteration is then
 * appended to the {@link fragment} document fragment. After the iteration is
 * complete, the {@link fragment} is appended to the {@link listItems}, and the
 * added books are reflected to the user. The function also increments the
 * {@link page} by 1 and calls the {@link updateRange} function to update the
 * range for the next call.
 *
 * @param {Array} source The books array or a reference to the array from which
 * a portion of its elements (book entries) will be extracted using the
 * `slice()` method.
 *
 * @param {Array} indexRange An array with 2 numbers to be passed to the
 * `slice()` method as the start and end indexes.
 *
 * @param {number} pageNum The current page number of the app (default is 1). With
 * each function call (click of the {@link listButton}), the page variable is
 * incremented by 1.
 */
const createPreviewsFragment = (source, indexRange, pageNum) => {
	const fragment = document.createDocumentFragment();
	const extracted = source.slice(indexRange[0], indexRange[1]);

	for (const { id, title, author, image } of extracted) {
		const authorId = author;

		const buttonElement = document.createElement("button");
		buttonElement.classList.add("preview");
		buttonElement.setAttribute("data-preview", id);

		buttonElement.innerHTML = /* html */ `
			<img
				class="preview__image"
				src="${image}"
			/>
	
			<div class="preview__info">
				<h3 class="preview__title">${title}</h3>
				<div class="preview__author">${authors[authorId]}</div>
			</div>
		`;

		fragment.appendChild(buttonElement);
	}

	listItems.appendChild(fragment);

	page = pageNum + 1;
	updateRange();
	updateRemainingBooks();
};

/**
 * Performs a conditional check to determine the number of books remaining. This
 * is achieved by obtaining the original book count from the {@link matches}
 * array, which references the original {@link books} array. This value is
 * compared against the number of books loaded in the app, based on the
 * {@link page} number multiplied by the fixed {@link BOOKS_PER_PAGE} value. The
 * result is then appended on the {@link listButton} HTML text and is reflected
 * to the user. If there aren't anymore books remaining the function will invoke
 * the {@link disableListButton} function.
 *
 */
const updateRemainingBooks = () => {
	const checkBooks = matches.length - [page * BOOKS_PER_PAGE];
	const remainingBooks = checkBooks > 0 ? checkBooks : 0;

	listButton.innerHTML = /* html */ `
		<span>Show more</span>, 
		<span class="list__remaining">(${remainingBooks})</span>
	`;

	if (remainingBooks === 0) disableListButton();
};

/**
 * The function disables the {@link listButton} when invoked by the
 * {@link updateRemainingBooks} function. This will only occur when there are
 * zero books remaining to load in the app.
 */
const disableListButton = () => {
	listButton.disabled = true;
};

/*
 * When the app loads, the function is manually called and creates the first
 * page's books, Thereafter, the function is called via a click EventListener.
 */
createPreviewsFragment(matches, range, page);

listButton.addEventListener("click", () => {
	createPreviewsFragment(matches, range, page);
});

/**
 * Accepts an object literal containing a collection of genres, in this case, the
 * {@link genres} object. The function first creates a main `option` element,
 * which serves as the default option visible to the user when the {@link searchDialog}
 * is displayed, and adds it to a document fragment. Next, the genres object is
 * iterated over, and the same process of creating an `option` element is followed.
 * However, with each iteration, the `option` element's `value` attribute and its
 * HTML text are set to the genre's name (property value) before being added to the
 * document fragment. After iterating through the parsed genres object, the document
 * fragment is appended to the {@link searchGenres} HTML element.
 *
 * @param {Object} genresSourceObj The genres object containing a list of genres
 * (properties), where each key represents a unique ID and its corresponding value
 * represents the name of the genre. These will be iterated over via a `for...of`
 * loop in the function's logic.
 */
const createGenresFragment = (genresSourceObj) => {
	const fragment = document.createDocumentFragment();

	const mainOptionElement = document.createElement("option");
	mainOptionElement.value = "any";
	mainOptionElement.textContent = "All Genres";
	fragment.appendChild(mainOptionElement);

	for (const [, genreName] of Object.entries(genresSourceObj)) {
		const optionElement = document.createElement("option");
		optionElement.value = genreName.toLowerCase();
		optionElement.textContent = genreName;

		fragment.appendChild(optionElement);
	}

	searchGenres.appendChild(fragment);
};

/*
 * When the app loads, the function is manually called and the genres field
 * under the search dialog is prepended accordingly.
 */
createGenresFragment(genres);

/**
 * Accepts an object literal containing a collection of authors, in this case,
 * the {@link authors} object. The function works the same way as the
 * {@link createGenresFragment} function with respect to creating a document
 * fragment of `option` elements, before appending the document fragment to the
 * {@link searchAuthors} HTML element.
 *
 * @param {object} authorsSourceObj The authors object containing a list of
 * authors (properties), where each key represents a unique ID and its
 * corresponding value represents the name of the genre. These will be iterated
 * over via a `for...of` loop in the function's logic.
 */
const createAuthorsFragment = (authorsSourceObj) => {
	const fragment = document.createDocumentFragment();

	const mainOptionElement = document.createElement("option");
	mainOptionElement.value = "any";
	mainOptionElement.textContent = "All Authors";
	fragment.appendChild(mainOptionElement);

	for (const [, authorName] of Object.entries(authorsSourceObj)) {
		const optionElement = document.createElement("option");
		optionElement.value = authorName.toLowerCase();
		optionElement.textContent = authorName;

		fragment.appendChild(optionElement);
	}

	searchAuthors.appendChild(fragment);
};

/*
 * When the app loads, the function is manually called and the authors field
 * under the search dialog is updated accordingly.
 */
createAuthorsFragment(authors);

/**
 * The callback function is triggered by a click event listener when any of the
 * book element previews from the {@link listItems} is clicked. Before the
 * {@link listDialog} is displayed using the `showModal()` method, the function
 * performs some logic to find the `preview id` of the button element.
 * Afterward, the `books` object is iterated over to find the unique id of the
 * clicked book. Once found, the unpopulated {@link title}, {@link subtitle},
 * {@link description}, {@link bookImage}, {@link blur}, and {@link} child
 * elements of the dialog element are updated with the clicked book's data
 * before the dialog is shown to the user. If the function doesn't find the
 * clicked book in the `books` object, it exits via the return keyword.
 *
 * @param {Event} event
 */
const handleOpenBookDialog = (event) => {
	const pathArray = event.composedPath();
	let activeBook = undefined;

	for (const node of pathArray) {
		if (activeBook) break;

		const dataKeyExists = "preview" in node.dataset;
		const previewId = dataKeyExists && node.dataset.preview;

		for (const book of books) {
			if (book.id === previewId) activeBook = book;
		}
	}

	if (!activeBook) return;

	const publishYear = new Date(activeBook.published).getFullYear();
	const author = authors[activeBook.author];

	title.textContent = activeBook.title;
	subtitle.textContent = `${author} ${publishYear}`;
	description.textContent = activeBook.description;
	bookImage.setAttribute("src", activeBook.image);
	blur.setAttribute("src", activeBook.image);

	listDialog.showModal();
};

listItems.addEventListener("click", handleOpenBookDialog);

/**
 * An event handler callback function triggered when the {@link closeList}
 * cancel button element in the {@link listDialog} book preview dialog is
 * clicked, firing a click event listener.
 */
const handleCloseBookDialog = () => {
	listDialog.close();
};

closeList.addEventListener("click", handleCloseBookDialog);
