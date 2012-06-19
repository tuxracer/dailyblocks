var FeedParser = require('feedparser'),
    fs = require('fs'),
    request = require('request'),
    async = require('async');

var imagefeed = [];
var imagePattern = new RegExp('http([^"]+).(jpg|jpeg|png)','i');
var added = 0;
var asyncQueue = [];


// Feeds are defined here
var feeds = ["http://www.haironthebrain.com/feed/",
            "http://www.yesstyle.com/blog/category/trend-and-style/feed/",
            "http://blog.forever21.com/feed/",
            "http://www.boston.com/bigpicture/index.xml",
            "http://android.appstorm.net/feed/",
            "http://www.thesfstyle.com/feeds/posts/default",
            "http://androidniceties.tumblr.com/rss",
            "http://webappheaven.com/websites.rss",
            "http://feeds.feedburner.com/smittenkitchen",
            "http://www.thehollywoodgossip.com/categories/celebrity-hairstyles/rss.xml",
            "http://kelseats.com/feed/",
            "http://instagram.heroku.com/users/17620630.atom",
            "http://instagram.heroku.com/users/1206501.atom",
            "http://www.zooborns.com/zooborns/rss.xml",
            "http://www.thatswhyimbroke.com/feed/",
            "http://www.frmheadtotoe.com/feeds/posts/default",
            "http://www.extrapetite.com/feeds/posts/default",
            "http://www.thelittledustprincess.com/feeds/posts/default",
            "http://www.nasa.gov/rss/image_of_the_day.rss",
            "http://sleeplessinsanfrancisco.tumblr.com/rss",
            "http://fuckyeahsf.tumblr.com/rss",
            "http://fuckyeahslowloris.tumblr.com/rss",
            "http://f---yeahsanfrancisco.tumblr.com/rss",
            "http://hollywoodinpics.tumblr.com/rss",
            "http://accidentalchinesehipsters.tumblr.com/rss",
            "http://bayfood.tumblr.com/rss",
            "http://fuckyeaheyegasms.tumblr.com/rss",
            "http://girlsonxbox.tumblr.com/rss",
            "http://gqfashion.tumblr.com/rss",
            "http://bakeitinacake.com/rss",
            "http://betterbooktitles.com/rss",
            "http://animalstalkinginallcaps.tumblr.com/rss",
            "http://feeds.thekitchn.com/apartmenttherapy/thekitchn"];

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

function addArticles (articles, meta) {
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

            if (typeof article.title === "string" && article.title.toLowerCase() == "photo") {
                article.title = "";
            }

            item = {
                order: order,
                date: article.date,
                title: article.title,
                link: article.link,
                image: image,
                viewed: false,
                bookmarked: false
            };

            imagefeed.push(item);
        }
    });

    added = added + 1;
    console.log("Added feed " + meta.title);

    if ( added == feeds.length ) {
        imagefeed = imagefeed.sort(function() { return 0.5 - Math.random() });
        fs.writeFile("feeds.json", JSON.stringify(imagefeed), function(err) {
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
        addArticles(articles, meta);
    }
}

async.series(asyncQueue);
