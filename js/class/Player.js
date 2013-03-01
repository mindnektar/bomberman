(function($) {
    Player = function(player, position, bounds) {
        this.$player = $('#' + player);

        this.position = position;
        this.bounds = bounds;
    };

    Player.prototype.setPosition = function(position) {
        this.position = position;

        this._putOnMap();

        return this.position;
    };

    Player.prototype.move = function(movement) {
        movement = this._checkBoundsCollision(movement);

        this.position.left += movement.left;
        this.position.top += movement.top;

        this._putOnMap();

        return this.position;
    };

    /* Private */

    Player.prototype._putOnMap = function() {
        var zIndex = this.position.top + collision.top + 1;

        this.$player
            .css(this.position)
            .css({zIndex: zIndex});
    };

    Player.prototype._checkBoundsCollision = function(movement) {
        if (this.position.left + collision.left + movement.left < 0) {
            movement.left = 0 - (this.position.left + collision.left);
        }

        if (this.position.left + collision.left + collision.width + movement.left > this.bounds.left) {
            movement.left = this.bounds.left - (this.position.left + collision.left + collision.width);
        }

        if (this.position.top + collision.top + movement.top < 0) {
            movement.top = 0 - (this.position.top + collision.top);
        }

        if (this.position.top + collision.top + collision.height + movement.top > this.bounds.top) {
            movement.top = this.bounds.top - (this.position.top + collision.top + collision.height);
        }

        return movement;
    };

    var collision = {
        left: 0,
        top: 32,
        width: 32,
        height: 32
    };
})(jQuery);
