(function($) {
    Bomb = function(who, position, level, onDetonate) {
        var self = this;

        this.$bomb = $('<div class="bomb ' + who + '"></div>');
        this.$bomb
            .css(position)
            .appendTo(level.$level);

        this.onDetonate = onDetonate;

        this.timer = setTimeout(function() {
            self.detonate();
        }, 4000);
    };

    Bomb.prototype.detonate = function() {
        clearTimeout(this.timer);

        this.$bomb.remove();

        this.onDetonate && this.onDetonate();
    };
})(jQuery);
