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

        var isCartEmpty = $('#total').length == 0;
        var getTip = function() {
            var tip = $('#CartGratuity');
            if (tip.length == 0) {
                return $TIP;
            }
            else
            {
                return tip.val() / 100;
            }
        };

        var changing = 0;

        var forceChange = function(fn) {
            changing++;
            fn();
            changing--;
        };

        var onCartChange = function() {
            if (changing == 0) {
                requestAnimationFrame(function() {
                    isCartEmpty = $('#total').length == 0;
                    console.log('CHANGE!', isCartEmpty);
                    updateBudget();
                    changing--;
                });
            changing++;
            }
        };

        var observer = new MutationObserver(onCartChange);
        observer.observe($('#cart').get(0), { attributes: true, childList: true, characterData: true });

        var updateBudget = function() {
            var formatDollars = function(dollars) {
                dollars = dollars.toFixed(2);
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
                console.log("You Pay", over);

                forceChange(function() {
                    $('.youPay, .yourBudget').remove();
                    $('#total').append('<p class="yourBudget"><strong>Your Budget<span>$' + formatDollars($BUDGET) + '</span></strong></p>');
                    $('#total').append('<p class="youPay"><strong>You Pay<span>' + over + '</span></strong></p>');
                });

                return $BUDGET - amount;
            })();

            var getCost = function(amount) { return budget - (amount * (1 + $TAX) * (1 + getTip())); }

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

                        var details = 'budget left:';
                        if (cost < 0) {
                            details = 'over budget by:'
                        }
                        t.append('<div class="costDetails">'
                                + '<i style="font-style: italic !important; padding-right: 1em;">' + details + '</i>'
                                + " $"
                                + formattedCost
                                + '</div>');
                    }
                });
        }

        updateBudget();
    })(jQuery.sub());
})();
