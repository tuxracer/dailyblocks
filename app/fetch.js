var FeedParser = require('feedparser'),
    fs = require('fs'),
    request = require('request'),
    async = require('async');

var imagefeed = [];
var imagePattern = new RegExp('([^"]+).(jpg|jpeg|png)','i');
var added = 0;
var asyncQueue = [];


// Feeds are defined here
var feeds = ["http://www.haironthebrain.com/feed/",
            "http://www.yesstyle.com/blog/category/trend-and-style/feed/",
            "http://cuteoverload.com/feed/",
            "http://asianmodelsblog.blogspot.com/feeds/posts/default",
            "http://blog.forever21.com/feed/",
            "http://www.boston.com/bigpicture/index.xml",
            "http://android.appstorm.net/feed/",
            "http://www.thesfstyle.com/feeds/posts/default",
            "http://androidniceties.tumblr.com/rss",
            "http://webappheaven.com/websites.rss",
            "http://feeds.feedburner.com/smittenkitchen"];


// Queue up the functions
feeds.forEach(function(feedUrl) {
    var asyncFunction = function(callback) {
            var parser = new FeedParser();
            parser.parseUrl(feedUrl, myCallback);
            callback();
        };

    asyncQueue.push(asyncFunction);
});

function randOrd () {
    return (Math.round(Math.random())-0.5);
}

function addArticles (articles) {
    "use strict";

    var order = 0;

    articles.forEach(function(article) {
        var image,
            imageMatches,
            item;

        imageMatches = article.description.match(imagePattern);

        if ( imageMatches ) {
            image = imageMatches[0];
            order = order + 1;

            item = {
                order: order,
                date: article.date,
                title: article.title,
                link: article.link,
                image: image
            };

            imagefeed.push(item);
        }
    });

    added = added + 1;
    console.log("Added feed " + added);

    if ( added == feeds.length ) {
        imagefeed = imagefeed.sort(function() { return 0.5 - Math.random() });
        fs.writeFile("/var/apps/dailyblocks/frontend/articles.json", JSON.stringify(imagefeed), function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
    }
}

function myCallback (error, meta, articles){
    "use strict";

    var order = 0;

    if (error) {
        console.error(error);
    } else {
        addArticles(articles);
    }
}

async.series(asyncQueue);