String.prototype.replaceAll = function(search, replacement) {
    return this.split(search).join(replacement);
};
$(function() {
    function shuffle(array) {
        for (var n = 0; n < array.length - 1; n++) {
            var k = n + Math.floor(Math.random() * (array.length - n));
            var temp = array[k];
            array[k] = array[n];
            array[n] = temp;
        }
        return array;
    }

    $.each($(".pwa"), function() {
        var $el = $(this);
        
        var containerHeight = $el.height();

        // fixed height to prevent flicker
        if (containerHeight > 0) {
            $el[0].style.height = containerHeight + "px";
        }

        var id = $el.attr("data-pwaId");
        var uid = $el.data('uid');

        var $template = $("#pwaView" + uid);

        var url = page.pwaHost + "json/" + id + ".json";
        
        Moon({
            root: $el[0],
            view: $template.html(),
            ads: [],
            onCreate: function() {
                var self = this;
                // cancel if no valid id found
                if (!id) return;

                
                

                var ads = [];

                fetch(url).then(function(response) {
                    // check for error
                    if (response.status !== 200) {
                        console.log("PWA Status Code: " + response.status);
                        return;
                    }
                    // Examine the text in the response
                    response.json().then(function(data) {
                        ads = shuffle(data.ads);
                        ads = ads.slice(0, data.limit);

                        $el.addClass("-is-loaded");
                        self.update({
                            ads: ads
                        });

                        // set height back to auto
                        // delayed to allow time for ads to render
                        setTimeout(function() {
                            $el[0].style.height = "auto";
                        }, 200);

                        // track the view
                        ads.forEach(function(ad) {
                            dataLayer.push({
                                event: "gaEvent",
                                eventCategory: "Banner Ads",
                                eventAction: "view",
                                eventLabel: ad.name,
                                eventNonInteraction: true
                            });
                        });
                    });
                });
            },
            trackClick: function(event, ad) {
                dataLayer.push({
                    event: "gaEvent",
                    eventCategory: "PWA",
                    eventAction: "click",
                    eventLabel: ad.id
                });

                dataLayer.push({
                    event: "gaEvent",
                    eventCategory: "Banner Ads",
                    eventAction: "click",
                    eventLabel: ad.name
                });
            },
            unquote: function(string) {
                return string.replace("&#039;", "'");
            }
        });
    });
});

// link formatter
$(function() {
    var $links = $("a[data-ad-href]");
    $links.each(function() {
        var $link = $(this);
        var url = $link.attr("data-ad-href");
        url = url
            .split("")
            .reverse()
            .join("");
        url = url.replace("[", "https://");
        url = url.replace("]", "http://");
        url = url.replace("^", "www.");
        url = url.replaceAll(">", "/");
        url = url.replaceAll("|", "=");
        url = url.replaceAll("~", "&");
        $link.attr("href", url);
        $link.removeAttr("data-ad-href");
        $link.removeAttr("rel");
        $link.addClass("pseudo-href");
    });
});
