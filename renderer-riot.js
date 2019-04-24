String.prototype.replaceAll = function (search, replacement) {
    return this.split(search).join(replacement);
};

var pwa = {};

$(function () {
    function shuffle(array) {
        for (var n = 0; n < array.length - 1; n++) {
            var k = n + Math.floor(Math.random() * (array.length - n));
            var temp = array[k];
            array[k] = array[n];
            array[n] = temp;
        }
        return array;
    }

    $.each($(".pwa"), function () {
        var $el = $(this);

        var containerHeight = $el.height();

        // fixed height to prevent flicker
        if (containerHeight > 0) {
            $el[0].style.height = containerHeight + "px";
        }

        var id = $el.attr("data-pwaId");
        pwa[id] = {};
        var url = "https://pwa.niagarafallstourism.com/json/" + id + ".json";
        var uid = $el.data('uid');

        var $template = $("#pwaView" + uid);

        fetch(url).then(function (response) {
            // check for error
            if (response.status !== 200) {
                console.log("PWA Status Code: " + response.status);
                return;
            }
            // Examine the text in the response
            response.json().then(function (data) {
                ads = shuffle(data.ads);
                ads = ads.slice(0, data.limit);

                // $el.addClass("-is-loaded");
                // self.update({
                //     ads: ads
                // });

                pwa[id].items = ads;
                var data = {};
                data.items = ads;
                console.log('pwa' + uid);
                riot.mount('pwa' + uid, data);
                // set height back to auto
                // delayed to allow time for ads to render
                // setTimeout(function () {
                //     $el[0].style.height = "auto";
                // }, 200);

                // track the view
                // ads.forEach(function (ad) {
                //     dataLayer.push({
                //         event: "gaEvent",
                //         eventCategory: "Banner Ads",
                //         eventAction: "view",
                //         eventLabel: ad.name,
                //         eventNonInteraction: true
                //     });
                // });
            });
        });
    });
});

// pseudo link formatter
$(function () {
    var $links = $("a[data-ad-href]");
    $links.each(function () {
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
