(function($) {
    Bomb = function(player, position, level, onDetonation, onDetonationEnd) {
        var self = this;

        this.who = player.who;
        this.position = position;
        this.power = player.skills.power;
        this.onDetonation = onDetonation;
        this.onDetonationEnd = onDetonationEnd;

        this.$bomb = $('<div class="bomb ' + this.who + '"></div>');

        this.$bomb
            .css(position)
            .appendTo(level.$level);

        if (!player.skills.time) {
            this.timer = setTimeout(function() {
                self.detonate();
            }, 3000);
        }
    };

    Bomb.prototype.detonate = function() {
        var self = this;

        clearTimeout(this.timer);

        this.$bomb.remove();

        this.onDetonation && this.onDetonation(this);

        this.timer = setTimeout(function() {
            self.remove();
        }, 1000);
    };

    Bomb.prototype.remove = function() {
        clearTimeout(this.timer);

        this.$detonations.remove();

        this.onDetonationEnd && this.onDetonationEnd(this);
    };

    Bomb.prototype.setDetonations = function($detonations) {
        this.$detonations = $detonations;
    };
})(jQuery);
