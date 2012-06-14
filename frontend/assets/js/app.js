/*global Backbone, Handlebars, App */
(function() {
    "use strict";
    window.App = {};

    $.get("/articles.json", function(blocksJSON) {
        var BlocksM = Backbone.Model.extend({
            initialize: function() {
                console.log("New model");
            }
        });

        var BlocksC = Backbone.Collection.extend({
            model: BlocksM,

            initialize: function(data) {
                console.log("Initialized blocks collection");
                this.JSON = { blocks: data };
            }
        });

        var blocks = new BlocksC(blocksJSON);

        var Router = Backbone.Router.extend({
            routes: {
                "*actions": "products"
            },

            products: function(id) {
                //document.getElementById("main").innerHTML = '<div class="loading">Loading...</div>';
                if (typeof id === "undefined") {
                    id = "all";
                    //var presenter = new ProductPresenter();
                }
                console.log("viewing product: " + id);

                setTimeout(function() {
                    var presenter = new BlocksP();
                },5);
            },

            faqs: function() {
                document.getElementById("main").innerHTML = '<div class="loading">Loading...</div>';
                var presenter = new FaqsPresenter();
            },

            alerts: function() {
                document.getElementById("main").innerHTML = '<div class="loading">Loading...</div>';
                var presenter = new AlertsPresenter();
            },

            contactus: function() {
                document.getElementById("main").innerHTML = '<div class="loading">Loading...</div>';
                var presenter = new ContactusPresenter();
            },

            catalog: function() {
                document.getElementById("main").innerHTML = '<div class="loading">Loading...</div>';
                var presenter = new CatalogPresenter();
            },

            defaultRoute: function( actions ) {
                document.getElementById("main").innerHTML = '<div class="loading">Loading...</div>';
                console.log( "DEFAULT ROUTE: " + actions );
                var presenter = new HomePresenter();
            }
        });

        var BlocksP = Backbone.View.extend({
            el: document.getElementById("main"),

            initialize: function() {
                // Cache the rendered version of this template if it hasn't been already
                if (typeof this.rendered === "undefined") {
                    this.rendered = Handlebars.templates.blocks(blocks.JSON);
                }

                this.render();
            },

            events: {
                "click .block": "toggleInfo"
            },

            toggleInfo: function(event) {
                var $el = $(event.currentTarget);
                console.log(this);
                console.log($el);
            },

            lazyLoad: function() {
                var self = this;
                var queue = [];

                $("#products .not-loaded").each(function() {
                    var view = window.innerHeight + $("#products").offset().top + window.scrollY;

                    if ( view > $(this).offset().top  ) {
                        queue.push($(this));
                    }
                });

                queue = queue.reverse();

                if ( window.innerWidth < 600 ) {
                    queue = queue.splice(0,1);
                } else {
                    queue = queue.splice(0,5);
                }


                for (var i = queue.length - 1; i >= 0; i--) {
                    var imgSrc = queue[i].data("src");
                    queue[i].attr("src", imgSrc);
                    //queue[i].parent("div").parent("div").css("outline","1px solid magenta");
                    //console.log(imgSrc);
                    //console.log(queue[i].parent("div").parent("div"));
                }
            },

            render: function() {
                var self = this;

                this.$el.html(this.rendered);

                console.log( this );

                setTimeout(function() {
                    $("#products").masonry({
                        itemSelector : ".product",
                        isFitWidth: true
                    });

                    $("#products .not-loaded").each(function() {
                        $(this).load(function() {
                            $(this).removeClass("not-loaded");
                        });
                    });

                    //self.lazyLoad();
                },5);


                var previousScroll = 0;

                /*
                var doLazyLoad = setInterval(function() {
                    if ( document.getElementsByClassName("not-loaded").length > 0 ) {
                        if ( window.scrollY != self.previousScroll ) {
                            self.lazyLoad();
                            self.previousScroll = window.scrollY;
                        } else {
                            console.log(self.previousScroll);
                        }
                    } else {
                        clearInterval(doLazyLoad);
                    }
                }, 2000);
                */
            }
        });


        var HomePresenter = Backbone.View.extend({
            el: document.getElementById("main"),

            initialize: function() {
                /*this.collection = new ProductCollection();
                this.collection.bind("reset", this.render, this);
                this.collection.fetch(); */
                this.render();
            },

            events: {
                "click .product": "toggleInfo"
            },

            toggleInfo: function(event) {
                var $el = $(event.currentTarget);
                console.log(this);
                console.log($el);
            },

            render: function() {
                var self = this;

                var result = Handlebars.templates.home();
                this.$el.html(result);

                $.get("/assets/images/loading_2.gif");

            }
        });

        var FaqsPresenter = Backbone.View.extend({
            el: document.getElementById("main"),

            initialize: function() {
                this.render();
            },

            render: function() {
                var self = this;

                /*$.get("/assets/templates/faqs.handlebars", function(source) {
                    var template = Handlebars.compile(source);
                    var result = template();

                    self.$el.html(result);
                });*/
                var result = Handlebars.templates.faqs();
                self.$el.html(result);
            }
        });

        var AlertsPresenter = Backbone.View.extend({
            el: document.getElementById("main"),

            initialize: function() {
                this.render();
            },

            render: function() {
                var self = this;

                /*$.get("/assets/templates/alerts.handlebars", function(source) {
                    var template = Handlebars.compile(source);
                    var result = template();

                    self.$el.html(result);
                });*/

                var result = Handlebars.templates.alerts();
                self.$el.html(result);
            }
        });

        var ContactusPresenter = Backbone.View.extend({
            el: document.getElementById("main"),

            initialize: function() {
                this.render();
            },

            render: function() {
                var self = this;

                /*$.get("/assets/templates/contactus.handlebars", function(source) {
                    var template = Handlebars.compile(source);
                    var result = template();

                    self.$el.html(result);
                });*/
                var result = Handlebars.templates.contactus();
                self.$el.html(result);
            }
        });

        var CatalogPresenter = Backbone.View.extend({
            el: document.getElementById("main"),

            initialize: function() {
                this.render();
            },

            render: function() {
                var self = this;

                /*$.get("/assets/templates/catalog.handlebars", function(source) {
                    var template = Handlebars.compile(source);
                    var result = template();

                    self.$el.html(result);
                }); */
                var result = Handlebars.templates.catalog();
                self.$el.html(result);
            }
        });


        var router = new Router();
        Backbone.history.start({pushState: true});

        App.hightlightMenu = function(name) {
            $("a").not('[data-route="' + name + '"]').removeClass("current");
            $('a[data-route="' + name + '"]').addClass("current");
        };

        router.bind("all", function(route) {
            route = route.replace("route:", "");
            App.hightlightMenu(route);
        });

        App.hightlightMenu(Backbone.history.fragment);

        $("a").on("touchclick", function(e) {
            e.preventDefault();
            var route = $(this).data("route");
            router.navigate(route, {trigger: true});
        });
    });
})();