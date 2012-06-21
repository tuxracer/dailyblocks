var http = require('http');
var fs = require('fs');
var fetch = require('fetch');
var _ = require('lodash');

var imagefeed = [];
var imagePattern = new RegExp('http([^"]+).(jpg|jpeg|png)','i');
var url = "http://www.reddit.com/.json?feed=5e65c7381536233edeb3bb2ce690b27f6937f58b&user=allhoppytimes&limit=100";

imagefeed = [];

scrapeImage = function(url, callback) {
    if ( url.match("reddit.com") ) {
        callback(false);
    } else {
       fetch.fetchUrl(url, function(error, meta, body) {
            var data,
                image,
		imageSize;

            data = body.toString();

            imageMatches = data.match(imagePattern);

            if ( imageMatches ) {
                image = imageMatches[0];
            } else {
                image = false;
            }
		

	    if (image) {
	        fetch.fetchUrl(image, function(error, meta, body) {
			console.log(meta.responseHeaders["content-length"] + ": " + image);
			imageSize = meta.responseHeaders["content-length"];
			
			if (imageSize < 10000) {
				image = false;
				console.log('too small!');
			        callback(false);
			} else {
				callback(image);
			}
			
		});
	    } else {
            	callback(image);
	    }
        });
    }
};

var fetchedImages = 0;


fetchImages = function() {
    imagefeed.forEach(function(item, i) {
        var saveFile = function() {
            fetchedImages++;

            if ( fetchedImages == imagefeed.length ) {
                var imageonlyfeed = _.filter(imagefeed, function(item) {
                    return item.image;
                });

                var withcomments = _.map(imagefeed, function(item) {
                    item.link = item.comments;
                    return item;
                });

                fs.writeFile("reddit.json", JSON.stringify(imageonlyfeed), function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("The file was saved!");
                    }
                });
            }
        };

        if ( !item.image ) {
            scrapeImage(item.link, function(image) {
                if ( image ) {
                    imagefeed[i].image = image;
                }

                saveFile();
            });
        } else {
            saveFile();
        }
    });
};

fetch.fetchUrl(url, function(error, meta, body) {
    var json = JSON.parse(body.toString());

    for (var i = json.data.children.length - 1; i >= 0; i--) {
        var article,
            image,
            imageMatches;

        article = json.data.children[i].data;

        imageMatches = article.url.match(imagePattern);

        if ( imageMatches ) {
            image = article.url;
        } else {
            image = false;
        }

        item = {
                order: i,
                date: article.created,
                title: article.title,
                link: article.url,
                image: image,
                comments: "http://www.reddit.com" + article.permalink,
                viewed: false,
                bookmarked: false
            };

        console.log("Added item " + article.title);
        imagefeed.push(item);

        if ( i === 0 ) {
            console.log("fetching images from URLs now...");
            fetchImages();
        }
    }
});


var options = {
  host: 'www.reddit.com',
  path: '/.json?feed=5e65c7381536233edeb3bb2ce690b27f6937f58b&user=allhoppytimes'
};

var imagefeed = [];

var imagePattern = new RegExp('http([^"]+).(jpg|jpeg|png)','i');

callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
        str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
        var json = JSON.parse(str);

        for (var i = json.data.children.length - 1; i >= 0; i--) {
            var article,
              image,
              imageMatches;

            article = json.data.children[i].data;

            imageMatches = article.url.match(imagePattern);

            if ( imageMatches ) {
                image = article.url;
            } else {
                image = "unknown";
            }

            item = {
                    order: i,
                    date: article.created,
                    title: article.title,
                    link: article.url,
                    image: image,
                    viewed: false,
                    bookmarked: false
                };

            console.log("Added item " + article.title);
            imagefeed.push(item);

            if ( i === 0 ) {
                fetchImages();
            }
        }
    });
};
