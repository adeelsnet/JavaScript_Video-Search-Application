const searchField = document.querySelector('#query');
const icon = document.querySelector('#search-btn');
const searchForm = document.querySelector('#search-form');
const results = document.querySelector('#results');
const buttonGroup = document.querySelector('#buttons');

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
});

function search() {
    // Clear
    results.innerHTML = '';
    buttonGroup.innerHTML = '';

    // What are we searching?
    let query = searchField.value;

    getApiResults(query);
}

function nextPage() {
    const nextButton = document.querySelector('#next-button');
    let token = nextButton.dataset.token;
    let query = nextButton.dataset.query;

    // Clear Results
    results.innerHTML = '';
    buttonGroup.innerHTML = '';

    getApiResults(query, token);
}

function prevPage() {
    const prevButton = document.querySelector('#prev-button');
    let token = prevButton.dataset.token;
    let query = prevButton.dataset.query;

    // Clear Results
    results.innerHTML = '';
    buttonGroup.innerHTML = '';

    getApiResults(query, token);
}

function getApiResults(query, token) {
    let data = {};
    if (!token) {
        // console.log("No Token");
        data = { part: 'snippet, id', q: query, type: 'video', key: 'Your Key' }
    } else {
        console.log("Has Token");
        data = { part: 'snippet, id', q: query, type: 'video', pageToken: token, key: 'Your Key' }
    }
    // Run GET Request on API
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/search',
        data,
        type: 'GET',
        dataType: 'jsonp', // "xml", "json"
        success: function(data) {
            let nextPageToken = data.nextPageToken;
            let prevPageToken = data.prevPageToken;

            data.items.forEach(function(item) {
                // Get Output
                let output = getOutput(item);
                // Display Results
                results.innerHTML += output;
            });

            let buttons = getButtons(prevPageToken, nextPageToken, query);
            buttonGroup.innerHTML = buttons;
        },
        error: function(jqXHR, textStatus, ex) {
            alert(`${textStatus}, ${ex}, ${jqXHR.responseText}`);
        }
    });
}

function getOutput(item) {
    let videoId = item.id.videoId;
    let title = item.snippet.title;
    let description = item.snippet.description;
    let thumbUrl = item.snippet.thumbnails.high.url;
    let channelTitle = item.snippet.channelTitle;
    let videoDate = item.snippet.publishedAt;

    // Build Output String
    let output = `<li>` +
        `<div class='list-left'>` +
        `<img src='${thumbUrl}'>` +
        `</div>` +
        `<div class='list-right'>` +
        `<h3><a data-fancybox class='fancybox fancybox.iframe' href='http://www.youtube.com/embed/${videoId}'>${title}</a></h3>` +
        `<small>By <span class='cTitle'>${channelTitle}</span> on ${videoDate}</small>` +
        `<p>${description}</p>` +
        `</div>` +
        `</li>`

    return output;
}

function getButtons(prevPageToken, nextPageToken, query) {

    if (!prevPageToken) {
        return `<div class='button-container'>` +
            `<button id='next-button' class='paging-button' data-token='${nextPageToken}' data-query='${query}' onclick='nextPage();'>Next Page</button> ` +
            `</div>`;
    } else {
        return `<div class='button-container'>` +
            `<button id='prev-button' class='paging-button' data-token='${prevPageToken}' data-query='${query}' onclick='prevPage();'>Prev Page</button> ` +
            `<button id='next-button' class='paging-button' data-token='${nextPageToken}' data-query='${query}' onclick='nextPage();'>Next Page</button> ` +
            `</div>`;
    }
}