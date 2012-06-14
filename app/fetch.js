var FeedParser = require('feedparser'),
    fs = require('fs'),
    request = require('request'),
    async = require('async');



var imagefeed = [];

var imagePattern = new RegExp('([^"]+).(jpg|jpeg|png)','i');

var added = 0;

/*parser.on('article', function (article){
    "use strict";
    //console.log("got article");
    //console.log('Got article: %s', JSON.stringify(article));
});*/

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

    console.log(added);

    //console.log(imagefeed);
    if ( added == 4 ) {
        imagefeed = imagefeed.sort(randOrd());
        fs.writeFile("articles.json", JSON.stringify(imagefeed), function(err) {
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
        console.log("adding articles");
        addArticles(articles);
    }
}
/*
parser.parseFile("pretty.rss", function() {
    myCallback();
    parser.parseFile("full.rss", myCallback);
});
*/
async.series([
    function (callback) {
        "use strict";
        //console.log(FeedParser);
        var parser = new FeedParser();
        //parser.parseFile("full.rss", myCallback);
        parser.parseUrl("http://www.haironthebrain.com/feed/", myCallback);
        callback();
    },
    function (callback) {
        "use strict";
        var parser = new FeedParser();
        parser.parseUrl("http://www.yesstyle.com/blog/category/trend-and-style/feed/", myCallback);
        callback();
    },
    function (callback) {
        "use strict";
        var parser = new FeedParser();
        parser.parseUrl("http://cuteoverload.com/feed/", myCallback);
        callback();
    },
    function (callback) {
        "use strict";
        var parser = new FeedParser();
        parser.parseUrl("http://asianmodelsblog.blogspot.com/feeds/posts/default", myCallback);
        callback();
    }
]);

//parser.parseFile("full.rss", myCallback);
//parser.parseFile("pretty.rss", myCallback);


//parser.parseUrl('http://feeds.gawker.com/gawker/full', myCallback);
//
//parser.parseFile("articles.json");