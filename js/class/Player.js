(function($) {
    Player = function(player, position) {
        this.$player = $('#' + player);

        this.position = position;
    };

    Player.prototype.setPosition = function(position) {
        this.position = position;

        this.putOnMap();

        return this.position;
    };

    Player.prototype.move = function(movement) {
        this.position.left += movement.left;
        this.position.top += movement.top;

        this.putOnMap();

        return this.position;
    };

    Player.prototype.putOnMap = function() {
        this.$player.css(this.position);
    }
})(jQuery);
