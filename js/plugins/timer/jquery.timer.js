$(function() {
    var defaults = {
            dangerZone: 10,
            seconds: 120,
            timeOver: $.noop
        },

        $timer,

        s,
        remainingSeconds,
        stopTime;

    $.timer = function(opts) {
        (function init() {
            s = $.extend({}, defaults, opts);

            remainingSeconds = s.seconds;
            $timer = $('#timer');

            displayTime();
        })();

        this.start = function() {
            stopTime = false;
            remainingSeconds = s.seconds;
            $timer.removeClass('warning');
            step();
        };

        this.stop = function() {
            stopTime = true;
        };

        this.toggle = function() {
            stopTime = !stopTime;

            if (remainingSeconds === 0) {
                stopTime = true;
            }

            if (!stopTime) {
                setTimeout(step, 1000);
            }
        };

        return this;
    };

    function step() {
        if (stopTime) {
            return;
        }

        displayTime();

        if (remainingSeconds === 0) {
            s.timeOver && s.timeOver();
        } else {
            remainingSeconds--;

            setTimeout(step, 1000);
        }
    }

    function displayTime() {
        var minutes = Math.floor(remainingSeconds / 60) + '',
            seconds = (remainingSeconds % 60) + '';

        while (minutes.length < 2) {
            minutes = '0' + minutes;
        }

        while (seconds.length < 2) {
            seconds = '0' + seconds;
        }

        if (remainingSeconds === s.dangerZone) {
            $timer.addClass('warning');
        }

        $timer.text(minutes + ':' + seconds);
    }
});
