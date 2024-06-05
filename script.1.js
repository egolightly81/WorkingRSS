// Where do we want to put the articles
let content = document.getElementById('content');

// Function to build the feed
function buildFeed(data) {
  let titleElement = document.createElement('H1');
  titleElement.innerText = data.feed.title;
  content.appendChild(titleElement);

  let itemsContainer = document.createElement('DIV');

  for (let i = 0, t = data.items.length; i < t; ++i) {
    let item = data.items[i];
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
  }

  content.appendChild(itemsContainer);
}

// Function to fetch RSS feed and build the feed
function fetchRSS() {
  let xhr = new XMLHttpRequest();
  let URL = 'https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Fwww.bom.gov.au%2Ffwo%2FIDZ00060.warnings_wa.xml';

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      let json = JSON.parse(xhr.responseText);
      console.log(json);
      buildFeed(json);
    } else {
      console.log('The request failed!');
      content.innerHTML = "The request for the weather warnings RSS feed failed, please check your URL";
    }
  };

  xhr.open('GET', URL);
  xhr.send();
}

// Call the function to fetch and display the RSS feed when the page loads
window.onload = fetchRSS;
