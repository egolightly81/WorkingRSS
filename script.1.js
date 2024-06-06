// Get the content element where articles will be displayed
let content = document.getElementsByTagName('main')[0];

// Function to build and display the RSS feed
function buildFeed(data) {
  // Clear any previous content
  content.innerHTML = '';

  // Create the 'outer' container to hold everything
  let itemsContainer = document.createElement('DIV');

  // For each item, add a title, link, description, and publication date
  data.items.forEach(item => {
    // Create a container to hold title, link, description
    let itemContainer = document.createElement('DIV');
    itemContainer.classList.add('item-container');

    // Create and update the title element
    let itemTitleElement = document.createElement('H2');
    itemTitleElement.innerText = item.title;

    // Create and update the link element
    let itemLinkElement = document.createElement('A');
    itemLinkElement.setAttribute('href', item.link);
    itemLinkElement.setAttribute('target', '_blank'); // Open link in a new tab
    itemLinkElement.innerText = 'Read more';

    // Create and update the description element
    let itemDescriptionElement = document.createElement('P');
    itemDescriptionElement.innerHTML = item.description; // Make sure the content is XSS safe before using innerHTML

    // Create and update the publication date element
    let itemPubDateElement = document.createElement('P');
    itemPubDateElement.innerText = `Published on: ${new Date(item.pubDate).toLocaleString()}`;

    // Add title, description, publication date, and link to the item container
    itemContainer.appendChild(itemTitleElement);
    itemContainer.appendChild(itemDescriptionElement);
    itemContainer.appendChild(itemPubDateElement);
    itemContainer.appendChild(itemLinkElement);

    // Add the item container to the outer container
    itemsContainer.appendChild(itemContainer);
  });

  // Create and add the title of the RSS source
  let titleElement = document.createElement('H1');
  titleElement.innerText = data.feed.title;

  // Add the title and container of article summaries to the main DOM
  content.appendChild(titleElement);
  content.appendChild(itemsContainer);
}

// Function to handle adding a new RSS feed
function onAddRSSClicked(event) {
  let URL = newRSSInput.value;
  newRSSInput.value = "";
  // Setup the XMLHttpRequest object and send the request
  xhr.open('GET', 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(URL));
  xhr.send();
}

// Set up the XMLHttpRequest object
let xhr = new XMLHttpRequest();
xhr.onload = function () {
  // Process the returned data
  if (xhr.status >= 200 && xhr.status < 300) {
    let json = JSON.parse(xhr.responseText);
    console.log(json);
    buildFeed(json);
  } else {
    // Handle the request failure
    console.log('The request failed!');
    content.innerHTML = "The request for a RSS feed failed, please check your URL";
  }
};

// Event listeners for the button and input field
let addFeedButton = document.getElementById("add-feed");
let newRSSInput = document.getElementById("rss-input");

addFeedButton.addEventListener('click', onAddRSSClicked);

// Fetch a default RSS feed on page load
xhr.open('GET', 'https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Fwww.bom.gov.au%2Ffwo%2FIDZ00060.warnings_wa.xml');
xhr.send();
