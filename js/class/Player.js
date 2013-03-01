(function($) {
    Player = function(player, position, level) {
        this.$player = $('<div id="' + player + '" class="player"></div>');

        this.position = position;
        this.bounds = level.getBounds();
        this.map = level.map;

        this.skills = {
            bombs: 1,
            speed: 4
        };

        this._putOnMap();

        level.$level.append(this.$player);
    };

    Player.prototype.setPosition = function(position) {
        this.position = position;

        this._putOnMap();

        return this.position;
    };

    Player.prototype.move = function(movement) {
        movement = this._checkBoundsCollision(movement);
        movement = this._checkTileCollision(movement);

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

    Player.prototype._checkTileCollision = function(movement) {
        var newLeft = this.position.left + movement.left,
            newTop = this.position.top + movement.top,

            positionOnMap = {
                left: Math.floor((this.position.left + collision.left) / 32),
                right: Math.floor((this.position.left + collision.left + collision.width) / 32),
                top: Math.floor((this.position.top + collision.top) / 32),
                bottom: Math.floor((this.position.top + collision.top + collision.height) / 32)
            },

            newPositionOnMap = {
                left: Math.floor((newLeft + collision.left) / 32),
                right: Math.floor((newLeft + collision.left + collision.width) / 32),
                top: Math.floor((newTop + collision.top) / 32),
                bottom: Math.floor((newTop + collision.top + collision.height) / 32)
            };

        if (
            movement.left < 0 &&
            (
                this.map[positionOnMap.top][newPositionOnMap.left] ||
                this.map[positionOnMap.bottom][newPositionOnMap.left] ||
                (
                    movement.top &&
                    (
                        (
                            movement.top < 0 && !this.map[newPositionOnMap.top][positionOnMap.left] ||
                            movement.top > 0 && !this.map[newPositionOnMap.bottom][positionOnMap.left]
                        ) && (
                            this.map[newPositionOnMap.top][newPositionOnMap.left] ||
                            this.map[newPositionOnMap.bottom][newPositionOnMap.left]
                        )
                    )
                )
            )
        ) {
            movement.left = positionOnMap.left * 32 - (this.position.left + collision.left);
        } else if (
            movement.left > 0 &&
            (
                this.map[positionOnMap.top][newPositionOnMap.right] ||
                this.map[positionOnMap.bottom][newPositionOnMap.right] ||
                (
                    movement.top &&
                    (
                        (
                            movement.top < 0 && !this.map[newPositionOnMap.top][positionOnMap.right] ||
                            movement.top > 0 && !this.map[newPositionOnMap.bottom][positionOnMap.right]
                        ) && (
                            this.map[newPositionOnMap.top][newPositionOnMap.right] ||
                            this.map[newPositionOnMap.bottom][newPositionOnMap.right]
                        )
                    )
                )
            )
        ) {
            movement.left = positionOnMap.right * 32 - (this.position.left + collision.left - 3);
        }

        if (
            movement.top < 0 &&
            (
                this.map[newPositionOnMap.top][positionOnMap.left] ||
                this.map[newPositionOnMap.top][positionOnMap.right] ||
                (
                    movement.left &&
                    (
                        (
                            movement.left < 0 && !this.map[positionOnMap.top][newPositionOnMap.left] ||
                            movement.left > 0 && !this.map[positionOnMap.top][newPositionOnMap.right]
                        ) && (
                            this.map[newPositionOnMap.top][newPositionOnMap.left] ||
                            this.map[newPositionOnMap.top][newPositionOnMap.right]
                        )
                    )
                )
            )
        ) {
            movement.top = positionOnMap.top * 32 - (this.position.top + collision.top);
        } else if (
            movement.top > 0 &&
            (
                this.map[newPositionOnMap.bottom][positionOnMap.left] ||
                this.map[newPositionOnMap.bottom][positionOnMap.right] ||
                (
                    movement.left &&
                    (
                        (
                            movement.left < 0 && !this.map[positionOnMap.bottom][newPositionOnMap.left] ||
                            movement.left > 0 && !this.map[positionOnMap.bottom][newPositionOnMap.right]
                        ) && (
                            this.map[newPositionOnMap.bottom][newPositionOnMap.left] ||
                            this.map[newPositionOnMap.bottom][newPositionOnMap.right]
                        )
                    )
                )
            )
        ) {
            movement.top = positionOnMap.bottom * 32 - (this.position.top + collision.top - 3);
        }

        return movement;
    };

    var collision = {
        left: 2,
        top: 34,
        width: 28,
        height: 28
    };
})(jQuery);
