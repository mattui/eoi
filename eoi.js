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

    (function($) {
        var $BUDGET = 15.00;
        var $TAX = 0.083;
        var $TIP = 0.1;

        var getLimit = function() { return $BUDGET/(1 + $TAX)/(1 + $TIP); }
        var isCartEmpty = $('#total').length == 0;

        /*
        var timer = setInterval(function() {
            if (!isCartEmpty()) console.log('cart not empty');
        }, 500);
        */

        var changing = false;

        $('#cart').bind('DOMSubtreeModified', function(e) {
            if (!changing) {
                requestAnimationFrame(function() {
                    isCartEmpty = $('#total').length == 0;
                    console.log('CHANGE!', isCartEmpty);
                    changing = false;
                });
            }
            changing = true;
        });

        var updateBudget = function() {
            var getCost = function(amount) { return budget - (amount * (1 + $TAX) * (1 + $TIP)); }
            $('em').each(function() {
                var t = $(this), $pos = t.text().indexOf("$");
                if ($pos > -1) {
                    var amount = parseFloat(t.text().substring($pos + 1));
                    var cost = getCost(amount);
                    if (cost < 0) {
                        t.parent().parent().fadeTo(1, 0.5);
                        t.append('<span style="padding-left: 2em;">+$' + (-1 * cost).toFixed(2) + '</span>');
                    }
                }
            });
        }

        updateBudget();
    })(jQuery.sub());
})();
