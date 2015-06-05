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

        var changing = false;

        $('#cart').bind('DOMSubtreeModified', function(e) {
            if (!changing) {
                requestAnimationFrame(function() {
                    isCartEmpty = $('#total').length == 0;
                    console.log('CHANGE!', isCartEmpty);
                    updateBudget();
                    changing = false;
                });
            }
            changing = true;
        });

        var updateBudget = function() {
            var formatDollars = function(dollars) {
                var dpos = dollars.toString().indexOf('.');
                if (dpos == -1) {
                    return dollars + '.00';
                }
                else if (dollars.toString().length - dpos < 3) {
                    return dollars + '0';
                }
                return dollars;
            };
            var budget = (function() {
                if (isCartEmpty) return $BUDGET;

                var total = $(":contains('Grand Total')");
                var totalText = total.children('span').text();
                var amount = parseFloat(totalText.substring(totalText.indexOf("$") + 1));
                console.log("Grand Total", amount);
                var over = '$' + (amount > $BUDGET ? formatDollars(Math.abs($BUDGET - amount)) : formatDollars(0));
                changing = true;
                total.parent().parent().append("<p><strong>You Pay<span>" + over + "</span></strong></p>");
                changing = false;
                console.log("You Pay", over);
                return $BUDGET - amount;
            })();

            var getCost = function(amount) { return budget - (amount * (1 + $TAX) * (1 + $TIP)); }

            $('em')
                .each(function() {
                    var t = $(this), $pos = t.text().indexOf("$");
                    t.find('.costDetails').remove();
                    if ($pos > -1) {
                        var amount = parseFloat(t.text().substring($pos + 1));
                        var cost = getCost(amount);
                        var formattedCost = formatDollars(Math.abs((cost).toFixed(2)));

                        t
                            .css('text-align', 'right')
                            .parent()
                            .css('height', '3em')
                            .css('background-color', cost < 0 ? 'rgba(256,0,0,0.1)' : 'rgba(0,256,0,0.1)')
                            .css('border', cost < 0 ? '1px solid red' : '1px solid green');

                        var details = 'extra';
                        if (cost < 0) {
                            details = 'over'
                        }
                        t.append('<div class="costDetails">'
                                + details
                                + " $"
                                + formattedCost
                                + '</div>');
                    }
                });
        }

        updateBudget();
    })(jQuery.sub());
})();
