// Get the content element where articles will be displayed
let content = document.getElementsByTagName('content')[0];

// Function to build and display the RSS feed
function buildFeed(data) {
  // Clear any previous content
  content.innerHTML = '';

  // Create the 'outer' container to hold everything
  let itemsContainer = document.createElement('DIV');

  // For each item, add a title, link, and description
  data.items.forEach(item => {
    // Create a container to hold title, link, description
    let itemContainer = document.createElement('DIV');

    // Create and update the link element
    let itemLinkElement = document.createElement('A');
    itemLinkElement.setAttribute('href', item.link);
    itemLinkElement.setAttribute('target', '_blank'); // Open link in a new tab
    itemLinkElement.innerText = item.title;

    // Create and update the title (use link as title, so title is clickable)
    let itemTitleElement = document.createElement('H2');
    itemTitleElement.appendChild(itemLinkElement);

    // Create and update the description
    let itemDescriptionElement = document.createElement('P');
    itemDescriptionElement.innerHTML = item.description; // Make sure the content is XSS safe before using innerHTML

    // Add title and description to the item container
    itemContainer.appendChild(itemTitleElement);
    itemContainer.appendChild(itemDescriptionElement);

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

// Fetch a RSS feed on page load
xhr.open('GET', 'https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Fwww.bom.gov.au%2Ffwo%2FIDZ00060.warnings_wa.xml');
xhr.send();
