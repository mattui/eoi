(function () {
    function loadScript(url, callback) {
        var script = document.createElement("script")
        script.type = "text/javascript";

        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function () {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    loadScript("http://code.jquery.com/jquery-2.1.4.min.js", function () {
        (function($) {
            var BUDGET = 15.00;
            var TAX = 0.083;
            var TIP = 0.1;
            var getLimit = function() { return BUDGET/(1 + TAX)/(1 + TIP); }

            $('em').each(function() {
                var t = $(this), $limit = getLimit(), $pos = t.text().indexOf("$");
                if ($pos > -1 && parseFloat(t.text().substring($pos + 1)) > $limit) {
                    t.parent().parent().fadeTo(1, 0.5);
                }
            });
        })(jQuery.noConflict());
    });
})();
