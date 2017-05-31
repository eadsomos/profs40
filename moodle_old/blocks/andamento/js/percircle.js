(function($, undefined) {
    "use strict";

    $.fn.percircle = function(options) {
        // default options
        var defaultOptions = {
            animate: true
        };
        
        // extend with any provided options
        if (!options) options = {};
        $.extend(options, defaultOptions);
        
        var rotationMultiplier = 3.6;

        // for each element matching selector
        return this.each(function(){
            var percircle = $(this);
            var progressBarColor = '';

            // When user tries adding a custom progress bar color, the text color should be updated as well.
            var changeTextColor = function (context, color) {
              // Change color text the same with progress bar color
              percircle.on('mouseover', function(){
                context.children('span').css('color', color);
              });

              percircle.on('mouseleave', function(){
                context.children('span').attr('style', '');
              });
            };

            // add percircle class for styling
            if (!percircle.hasClass('percircle')) percircle.addClass('percircle');
            // apply options
            if (typeof(percircle.attr('data-animate')) !== 'undefined') options.animate = percircle.attr('data-animate') == 'true';
            if (options.animate) percircle.addClass('animate');
            
            if (typeof(percircle.attr('data-color')) !== 'undefined') {
                options.progressBarColor = percircle.attr('data-color');
                progressBarColor = "style='border-color: "+ options.progressBarColor +"'";
                changeTextColor($(this), options.progressBarColor);
            } else {
                if (typeof options.progressBarColor !== 'undefined'){
                    progressBarColor = "style='border-color: "+ options.progressBarColor +"'";
                    changeTextColor($(this), options.progressBarColor);
                }
            }

            var percent = percircle.attr('data-percent') || options.percent || 0;
            var perclock = percircle.attr('data-perclock') || options.perclock || 0;
            var perdown = percircle.attr('data-perdown') || options.perdown || 0;
            if (percent) {
                if (percent > 50) percircle.addClass('gt50');
                var text = percircle.attr('data-text') || options.text || percent + '%';

                $('<span>'+text+'</span>').appendTo(percircle);
                // add divs for structure
                $('<div class="slice"><div class="bar" '+progressBarColor+'></div><div class="fill" '+progressBarColor+'></div></div>').appendTo(percircle);
                if (percent > 50)
                $('.bar', percircle).css({
                  '-webkit-transform' : 'rotate(180deg)',
                  '-moz-transform'    : 'rotate(180deg)',
                  '-ms-transform'     : 'rotate(180deg)',
                  '-o-transform'      : 'rotate(180deg)',
                  'transform'         : 'rotate(180deg)'
                });
                var rotationDegrees = rotationMultiplier * percent;
                // set timeout causes the animation to be visible on load
                setTimeout(function(){
                    $('.bar', percircle).css({
                      '-webkit-transform' : 'rotate(' + rotationDegrees + 'deg)',
                      '-moz-transform'    : 'rotate(' + rotationDegrees + 'deg)',
                      '-ms-transform'     : 'rotate(' + rotationDegrees + 'deg)',
                      '-o-transform'      : 'rotate(' + rotationDegrees + 'deg)',
                      'transform'         : 'rotate(' + rotationDegrees + 'deg)'
                    });
                }, 0);
            } else if(perclock){
                if (!percircle.hasClass('perclock')) percircle.addClass('perclock');
                
                setInterval(function(){ 
                    var d = new Date(); // without params it defaults to "now"
                    var text = getPadded(d.getHours()) + ":" + getPadded(d.getMinutes()) + ":" + getPadded(d.getSeconds());
                    
                    percircle.html('<span>'+text+'</span>');
                    // add divs for structure
                    $('<div class="slice"><div class="bar" '+progressBarColor+'></div><div class="fill" '+progressBarColor+'></div></div>').appendTo(percircle);
                    
                    var seconds = d.getSeconds();
                    if (seconds === 0) percircle.removeClass('gt50');
                    if (seconds > 30){
                        percircle.addClass('gt50');
                        $('.bar', percircle).css({
                          '-webkit-transform' : 'rotate(180deg);scale(1,3)',
                          '-moz-transform'    : 'rotate(180deg);scale(1,3)',
                          '-ms-transform'     : 'rotate(180deg);scale(1,3)',
                          '-o-transform'      : 'rotate(180deg);scale(1,3)',
                          'transform'         : 'rotate(180deg);scale(1,3)'
                        });
                    }
                    
                    var rotationDegrees = 6 * seconds;  // temporary clockwise rotation value
                    $('.bar', percircle).css({
                      '-webkit-transform' : 'rotate(' + rotationDegrees + 'deg)',
                      '-moz-transform'    : 'rotate(' + rotationDegrees + 'deg)',
                      '-ms-transform'     : 'rotate(' + rotationDegrees + 'deg)',
                      '-o-transform'      : 'rotate(' + rotationDegrees + 'deg)',
                      'transform'         : 'rotate(' + rotationDegrees + 'deg)'
                    });
                }, 1000);
            } else if(perdown) {
                var secs = percircle.attr('data-secs') || options.secs;
                var timeUpText = percircle.attr('data-timeUpText') || options.timeUpText;
                var reset = percircle[0].hasAttribute('data-reset') || options.reset;

                if (timeUpText.length > 8) timeUpText='the end';

                var counter;

                if (reset) {
                  percircle.on("click", timerReset);
                }

                function timer() {
                  secs-=1;

                  if (secs > 30) percircle.addClass('gt50');
                  if (secs < 30) percircle.removeClass('gt50');

                  timerUpdate();

                  if (secs <= 0) {
                    timerStop();
                    percircle.html('<span>'+timeUpText+'</span>');
                    return;
                  }
                }

                function timerStart() {
                  counter = setInterval(timer, 1000);
                }

                function timerStop() {
                  clearInterval(counter);
                }

                function timerReset() {
                  timerStop();

                  secs = options.secs;
                  timerUpdate();

                  timerStart();
                }

                function timerUpdate() {
                  percircle.html('<span>'+secs+'</span>');
                  // add divs for structure
                  $('<div class="slice"><div class="bar" '+progressBarColor+'></div><div class="fill" '+progressBarColor+'></div></div>').appendTo(percircle);

                  var rotationDegrees = 6 * secs;  // temporary clockwise rotation value
                  $('.bar', percircle).css({
                    '-webkit-transform' : 'rotate(' + rotationDegrees + 'deg)',
                    '-moz-transform'    : 'rotate(' + rotationDegrees + 'deg)',
                    '-ms-transform'     : 'rotate(' + rotationDegrees + 'deg)',
                    '-o-transform'      : 'rotate(' + rotationDegrees + 'deg)',
                    'transform'         : 'rotate(' + rotationDegrees + 'deg)'
                  });
                }

                // Initialize timer
                timerStart();
            }
        });
    };
	
	// move to another file - functions
	
	// display a presentable format of current time
	var getPadded = function(val){
		return val < 10 ? ('0' + val) : val;
	};
});
