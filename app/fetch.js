var FeedParser = require('feedparser');
var fs = require('fs');
var request = require('request');

var parser = new FeedParser();

var imagefeed = [];

var imagePattern = new RegExp('([^"]+).(jpg|jpeg|png)','i');

parser.on('article', function (article){
    "use strict";
    //console.log("got article");
  //console.log('Got article: %s', JSON.stringify(article));
});

function myCallback (error, meta, articles){
    "use strict";
    if (error) {
        console.error(error);
    } else {
        //console.log('Feed info');
        //console.log('%s - %s - %s', meta.title, meta.link, meta.xmlUrl);
        //console.log('Articles');
        /*articles.forEach(function (article){
        var item = {
        date: article.date,
        title: article.title,
        link: article.link,
        description: article.description
        };
        imagefeed.push(article);
        });

        console.log(imagefeed.length);

        fs.writeFile("articles.json", JSON.stringify(imagefeed), function(err) {
        if (err) {
        console.log(err);
        } else {
        console.log("The file was saved!");
        }
        });
        */
        articles.forEach(function(article) {
            var image,
                item;

            image = article.description.match(imagePattern)[0];

            if ( image ) {
                item = {
                    date: article.date,
                    title: article.title,
                    link: article.link,
                    image: image
                };

                imagefeed.push(item);
            }


        });

        console.log(imagefeed);

        fs.writeFile("articles.json", JSON.stringify(imagefeed), function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
    }
}

parser.parseFile("full.rss", myCallback);

//parser.parseUrl('http://feeds.gawker.com/gawker/full', myCallback);
//
//parser.parseFile("articles.json");