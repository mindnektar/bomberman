(function($) {
    Bomb = function(who, power, position, level, onDetonation, onDetonationEnd) {
        var self = this;

        this.$bomb = $('<div class="bomb ' + who + '"></div>');
        this.$bomb
            .css(position)
            .appendTo(level.$level);

        this.power = power;
        this.onDetonation = onDetonation;
        this.onDetonationEnd = onDetonationEnd;

        this.timer = setTimeout(function() {
            self.detonate();
        }, 3000);
    };

    Bomb.prototype.detonate = function() {
        var self = this;

        clearTimeout(this.timer);

        this.$bomb.remove();

        this.onDetonation && this.onDetonation();

        this.timer = setTimeout(function() {
            self.remove();
        }, 1000);
    };

    Bomb.prototype.remove = function() {
        clearTimeout(this.timer);

        this.onDetonationEnd && this.onDetonationEnd();
    };
})(jQuery);
