// Where do we want to put the articles
let content = document.getElementsByTagName('content')[0];


// In order to communicate with the server, we must first define an
// XMLHttpRequest object (XHR). This object is what allows us to connect to the
// server without refreshing the browser; it is the core of any Ajax application.
// As we'd expect, Internet Explorer defines the XHR object differently than other
// browsers, such as Firefox and Safari. We can use object detection to determine
// what browser the JavaScript is running in, and thus define the XHR object
// appropriately.
//
// if (window.ActiveXObject) //IE
//        xhr = new ActiveXObject("Microsoft.XMLHTTP");
//    else if (window.XMLHttpRequest) //other
//        xhr = new XMLHttpRequest();
//    else
//        alert("your browser does not support AJAX");
//
// Again the concept is more important, that is we can request infromaiton
// from a service/server.  So we will ignore the cross browser compatibility.
//
// Set up our HTTP request
let xhr = new XMLHttpRequest();




// Setup our listener to process completed (asynchronous) requests
// Again , not worrying about (very) 'older' browsers.  onload() replaces
// onreadystatechange().  This simplifies the code. We know that we received
// a successful response if xhr.status is between 200 and 300. Any other status
// code means that we didn't receive the response properly.
xhr.onload = function () {
  // Process our return data
  if (xhr.status >= 200 && xhr.status < 300) {
    json = JSON.parse(xhr.responseText);
    console.log(json);
    buildFeed(json);
  } else {
    // What do when the request fails
    console.log('The request failed!');
    content.innerHTML = "The request for a RSS feed failed, please check your URL";
  }
};




// We set up the XHR object by calling xhr.open(). This function can takes two
// to five  arguments: the first is the method we use to fetch the file from
// the server, the second is the name of the file we are fetching, and the
// third is set to true (the default) if we want the response to be received
// asynchronously, and the fourth and fifth arguments can be a user name and
// password. As we are not going to send any request data to the server, a
// GET request is sufficient.
//
// The name of the RSS XML file is later taken directly from the input textbox
// on the form but a default feed is provided here.  Lastly, we use the default
// option of an asynchronous response so that we don't have to "wait" for the
// file to be received--we know when it is available by defining a function that
// is called when the receiving is complete.
//
// Create and send a GET request
// The first argument is the post type (GET, POST, PUT, DELETE, etc.)
// The second argument is the endpoint URL
// Asynchronous request, so not waiting
xhr.open('GET', 'https://api.rss2json.com/v1/api.json?rss_url=https://hacks.mozilla.org/rss');
xhr.send();


// Perhaps Google for some locally relevant RSS feeds.
// Here are some other RSS feeds:
//    BBC world news	     http://feeds.bbci.co.uk/news/world/rss.xml
//    CBN world news	     http://www.cbn.com/cbnnews/world/feed/
//    Reuters world news	http://feeds.reuters.com/Reuters/worldNews
//    Hacker News          https://news.ycombinator.com/rss
//
// Some feeds include HMTL which may cause problems
//
// Note:  Since we are using the 'file//' protocol, most browsers/servers can
//        detect cross origin, that is a script executing in the browser, not
//        from the server, the same source (google CORB for more info).
//        We wouldn't get this error, if using a server, that is the HTTPS
//        (or HTTP) protocol.
//        Some servers, can set the header infromation to allow to cros-origin
//        scripts but most don't.  So to overcome this problem we use the
//        https://api.rss2json.com api.  Basically this runs our request on a
//        server and then sends us the result.  It works because the headers
//        form rss2json have be set to allow this.
//
//        Not very important, the lesson is more about understanding how to
//        make a request.










// The following JavaScript is 'part' of todays lessons.  The concepts below
// have already either bene implements in previous examples, or are a different
// way to do something we have already discussed.  The JavaScript is provide
// for self-study and review.
//
// Last time we use a 'template' this time we will build the DOM fragment
// and insert into the DOM tree.  RSS feeds follow a similar structure
// Each has has a title, link and description fields.  The following
// funciton creates the corresponding HTML5 elements and inserts
// them into the DOM tree.
function buildFeed(data) {
  // Create the 'outer' container to hold everything
  let itemsContainer = document.createElement('DIV');

  // for each item add a title, link, and description
  for (let i = 0, t = data.items.length; i < t; ++i) {
    let item = data.items[i];  // get the item
    // create a element to contain, title, link, description
    let itemContainer = document.createElement('DIV');

    // create and update the link element
    let itemLinkElement = document.createElement('A');
    itemLinkElement.setAttribute('href', item.link);
    itemLinkElement.innerText = item.title;

    // create and update the title (use link as title, so title is clickable)
    let itemTitleElement = document.createElement('H2');
    itemTitleElement.appendChild(itemLinkElement);

    // create and update the description.
    // TODO: make sure the content is XSS safe before using innerHTML
    let itemDescriptionElement = document.createElement('P');
    itemDescriptionElement.innerHTML = item.description;

    // elements have been updated, lets add each to the inner container
    itemContainer.appendChild(itemTitleElement);
    itemContainer.appendChild(itemDescriptionElement);

    // lets add the inner container to outer container
    itemsContainer.appendChild(itemContainer);
  }

  // So the RSS feed is complete, lets build a title RSS source
  let titleElement = document.createElement('H1');
  titleElement.innerText = data.feed.title;

  // We have the RSS titles, and a container of article summaries
  // lets add them to the main DOM.
  content.appendChild(titleElement);
  content.appendChild(itemsContainer);
}





// The following gets the ADD RSS button to work.  This is a very similar
// process that we did in the ToDo applicaiton.  Find the elements in
// the HTML, then write a function to handle the element/event, then add
// the event listener.
let addFeedButton = document.getElementById("add-feed");
let newRSSInput = document.getElementById("rss-input");

// Every time we add a task, save the task to local storage
function onAddRSSClicked(event) {
  let URL = newRSSInput.value;
  newRSSInput.value = "";
  // The following will be explained in class
  xhr.open('GET', 'https://api.rss2json.com/v1/api.json?rss_url=' + URL);
  xhr.send();
}

addFeedButton.addEventListener('click', onAddRSSClicked);
