/*global Backbone, Handlebars, App, _ */
(function() {
    "use strict";
    window.App = {};

    $.get("/feeds.json", function(feeds) {
        var BlocksM = Backbone.Model.extend();

        var BlocksC = Backbone.Collection.extend({
            model: BlocksM,

            initialize: function(data) {
                console.log("Initialized blocks collection");
                this.JSON = { blocks: data };
            }
        });

        var Router = Backbone.Router.extend({
            routes: {
                  "blocks": "blocks",
                  "*actions": "defaultRoute"
            },

            blocks: function() {
                setTimeout(function() {
                    var presenter = new BlocksP();
                },0);
            },

            defaultRoute: function( actions ) {
                document.getElementById("main").innerHTML = "";
                App.hightlightMenu(actions);
            }
        });

        var BlocksP = Backbone.View.extend({
            el: document.getElementById("main"),

            initialize: function() {
                // Cache the rendered version of this template if it hasn't been already
                if (typeof this.rendered === "undefined") {
                    // @TODO Move this crap to the collection
                    // We're sorting the feeds by date and then returning only the first 20
                    var filtered = _.first(_.sortBy(feeds, function(feed) { return new Date(feed.date); }).reverse(), 20);
                    this.collection = new BlocksC(filtered);

                    this.rendered = Handlebars.templates.blocks(this.collection.JSON);
                }

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
                var self = this;

                this.$el.html(this.rendered);

                $("#blocks").masonry({
                  itemSelector: ".block",
                  isFitWidth: true
                });

                // Listen for the load and error events of the block images so we
                // can reset masonry and show a loading indicator
                $(".block-image-container img").each(function() {
                    $(this).load(function() {
                        $(this).addClass("loaded");
                        $("#blocks").masonry("reload");
                    });

                    // Remove the block if there is an error loading its image
                    $(this).error(function() {
                        $(this).parent().parent().remove();
                        $("#blocks").masonry("reload");
                    });
                });
            }
        });

        // Highlight the current menu item
        App.hightlightMenu = function(name) {
            if (name != "defaultRoute") {
                $("a").not('[data-route="' + name + '"]').removeClass("current");
                $('a[data-route="' + name + '"]').addClass("current");
            }
        };

        // Initialize the router
        var router = new Router();
        Backbone.history.start({pushState: true});

        // Highlight the menu item based on the current route
        router.bind("all", function(route) {
            route = route.replace("route:", "");
            App.hightlightMenu(route);
        });

        // Navigate to the route of the menu item selected
        $(".menu a").on("touchclick", function(e) {
            e.preventDefault();
            var route = $(this).data("route");
            router.navigate(route, {trigger: true});
        });
    });
})();
