// Where do we want to put the articles
let content = document.getElementsByTagName('content')[0];

// In order to communicate with the server, we must first define an
// XMLHttpRequest object (XHR).
let xhr = new XMLHttpRequest();

// Setup our listener to process completed (asynchronous) requests
xhr.onload = function () {
  // Process our return data
  if (xhr.status >= 200 && xhr.status < 300) {
    let json = JSON.parse(xhr.responseText);
    console.log(json);
    buildFeed(json);
  } else {
    // What to do when the request fails
    console.log('The request failed!');
    content.innerHTML = "The request for an RSS feed failed. Please check your URL.";
  }
};

// Function to handle the "Add Feed" button click event
function onAddRSSClicked(event) {
  event.preventDefault(); // Prevent form submission (if using a form)
  
  let URL = newRSSInput.value.trim(); // Get the input URL
  if (URL === '') {
    alert('Please enter a valid RSS feed URL.');
    return;
  }

  // Update the XHR URL and send the request
  xhr.open('GET', 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(URL));
  xhr.send();
}

// Find the elements in the HTML
let addFeedButton = document.getElementById("add-feed");
let newRSSInput = document.getElementById("rss-input");

// Add event listener for the "Add Feed" button
addFeedButton.addEventListener('click', onAddRSSClicked);

// Function to build the feed based on JSON data
function buildFeed(data) {
  // Create the 'outer' container to hold everything
  let itemsContainer = document.createElement('DIV');

  // Loop through each item in the data and create HTML elements
  data.items.forEach(item => {
    let itemContainer = document.createElement('DIV');

    let itemLinkElement = document.createElement('A');
    itemLinkElement.setAttribute('href', item.link);
    itemLinkElement.innerText = item.title;

    let itemTitleElement = document.createElement('H2');
    itemTitleElement.appendChild(itemLinkElement);

    let itemDescriptionElement = document.createElement('P');
    itemDescriptionElement.innerHTML = item.description;

    itemContainer.appendChild(itemTitleElement);
    itemContainer.appendChild(itemDescriptionElement);

    itemsContainer.appendChild(itemContainer);
  });

  // Create and add the RSS feed title to the content
  let titleElement = document.createElement('H1');
  titleElement.innerText = data.feed.title;

  content.appendChild(titleElement);
  content.appendChild(itemsContainer);
}
