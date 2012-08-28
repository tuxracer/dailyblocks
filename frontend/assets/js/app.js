/*global Backbone, Handlebars, App, _ */
(function() {
    "use strict";
    window.App = {
        randomLogoColor: function() {
            var possibleColors,
                randomColor;

            possibleColors = [  "#00949d",
                                "#f04e40",
                                "#4d668a",
                                "#5a641c",
                                "#04a2d7",
                                "#1f013c",
                                "#6b0021",
                                "#fd9836",
                                "#e9dc4a"];

            randomColor = _.shuffle(possibleColors)[0];

            document.getElementById("logo").style.backgroundColor = randomColor;
        },

        // Highlight the current menu item
        highlightMenu: function(name) {
            if (name != "defaultRoute") {
                if (name === "redditR") {
                    name = "blocks/reddit";
                }

                $("a").not('[data-route="' + name + '"]').removeClass("current");
                $('a[data-route="' + name + '"]').addClass("current");
            }
        },

        masonry: function() {
            return window.innerWidth > 630;
        }
    };

    $.get("/reddit.json", function(reddit) {
        window.reddit = reddit;
    });

    $.get("/feeds.json", function(feeds) {
        App.randomLogoColor();

        var BlocksM = Backbone.Model.extend({
            initialize: function() {
                var self = this;

                this.on("change", function() {
                    if (self.hasChanged("viewed")) {
                        // console.log("VIEWED: " + self);
                    }
                });
            }
        });

        var BlocksC = Backbone.Collection.extend({
            model: BlocksM,

            initialize: function(data) {
                console.log("Initialized blocks collection");
            },

            comparator : function(model) {
                return -new Date(model.get("date"));
            },

            unviewed: function(limit) {
                if (typeof limit === "undefined") {
                    limit = 20;
                }

                return _.first(this.where({viewed:false}), limit);
            }
        });

        //window.blocksC = new BlocksC(feeds);

        var Router = Backbone.Router.extend({
            routes: {
                  "blocks": "blocks",
                  "blocks/reddit": "redditR",
                  "*actions": "defaultRoute"
            },

            blocks: function() {
                document.getElementById("main").innerHTML = '<div class="loading"><div></div></div>';
                setTimeout(function() {
                    var presenter = new BlocksContainer({feed: feeds });
                }, 100);

            },

            redditR: function() {
                document.getElementById("main").innerHTML = '<div class="loading"><div></div></div>';

                setTimeout(function() {
                    if ( typeof window.reddit === undefined ) {
                        $.get("/reddit.json", function(reddit) {
                            window.reddit = reddit;

                            var presenter = new BlocksContainer({feed: reddit});
                        });
                    } else {
                        var presenter = new BlocksContainer({feed: reddit});
                    }

                }, 100);
            },

            defaultRoute: function( actions ) {
                document.getElementById("main").innerHTML = "<p style='text-align: center;'>Ready!</p>";
                App.highlightMenu(actions);
            }
        });


        var BlockP = Backbone.View.extend({
            initialize: function() {
                this.render();
            },

            events: {
                "click .block": "toggleInfo"
            },

            toggleInfo: function(event) {
                var $el = $(event.currentTarget);
                console.log($el);
            },

            render: function() {
                var json,
                    template,
                    $image;

                this.model.set({viewed: true});

                json = this.model.toJSON();
                template = Handlebars.templates.block(json);

                this.el.innerHTML = template;

                $image = this.$el.find("img");

                // Listen for the load and error events of the block images so we
                // can reset masonry and show a loading indicator
                $image.load(function() {
                    $(this).addClass("loaded");
                    if ( App.masonry() ) {
                        $("#blocks").masonry("reload");
                    }
                });

                // Remove the block if there is an error loading its image
                $image.error(function() {
                    $(this).parent().parent().remove();

                    if ( App.masonry() ) {
                        $("#blocks").masonry("reload");
                    }
                });
            }
        });

        var BlocksContainer = Backbone.View.extend({
            el: document.getElementById("main"),

            initialize: function() {
                var self,
                    paused;

                self = this;
		
		delete this.collection;
                this.collection = new BlocksC(this.options.feed);
                this.render();
                this.showMore();

                this.paused = false;

                $(window).on("scroll", function(event) {
                    if ( !self.paused && ( window.scrollY + 200 + window.innerHeight > $(document).height() ) ) {
                        setTimeout(function() {
                            self.showMore();
                        }, 100);

                        self.paused = true;

                        setTimeout(function() {
                            self.paused = false;
                        }, 1000);
                    }
                });
            },

            render: function() {
                var template = Handlebars.templates.blocks();
                this.el.innerHTML = template;

                $("#blocks").masonry({
                    itemSelector: ".block",
                    isFitWidth: true
                });
            },

            showMore: function(limit) {
                var self,
                    blocks;

                blocks = this.collection.unviewed(limit);
		
		console.log(blocks);
                _.each(blocks, function(block) {
                    var blockP;
                    blockP = new BlockP({model: block});
                    $("#blocks").append(blockP.$el);
                });
            }
        });

        // Initialize the router
        var router = new Router();
        Backbone.history.start({pushState: true});

        // Highlight the menu item based on the current route
        router.bind("all", function(route) {
            route = route.replace("route:", "");
            App.highlightMenu(route);
        });

        // Navigate to the route of the menu item selected
        $(".menu a").on("touchclick", function(e) {
            e.preventDefault();
            var route = $(this).data("route");
            router.navigate(route, {trigger: true});
        });
    }).error(function() {
        document.getElementById("main").innerHTML = "<p style='text-align: center;'>Error. Try again.</p>";
    });
})();
