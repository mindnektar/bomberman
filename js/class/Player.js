(function($) {
    Player = function(player, position, level) {
        this.$player = $('<div id="' + player + '" class="player"></div>');

        this.position = position;
        this.level = level;

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

    Player.prototype.getPositionOnMap = function(modifier) {
        if (!modifier) {
            modifier = {
                left: 0,
                top: 0
            };
        }

        return {
            left: Math.floor((this.position.left + collision.left + modifier.left) / 32),
            right: Math.floor((this.position.left + collision.left + collision.width + modifier.left) / 32),
            top: Math.floor((this.position.top + collision.top + modifier.top) / 32),
            bottom: Math.floor((this.position.top + collision.top + collision.height + modifier.top) / 32)
        };
    };

    Player.prototype.getCenterPositionOnMap = function() {
        var modifier = {
            left: collision.width / 2,
            top: collision.top / 2
        };

        return this.getPositionOnMap(modifier);
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
        var bounds = this.level.getBounds();

        if (this.position.left + collision.left + movement.left < 0) {
            movement.left = 0 - (this.position.left + collision.left);
        }

        if (this.position.left + collision.left + collision.width + movement.left > bounds.left) {
            movement.left = bounds.left - (this.position.left + collision.left + collision.width);
        }

        if (this.position.top + collision.top + movement.top < 0) {
            movement.top = 0 - (this.position.top + collision.top);
        }

        if (this.position.top + collision.top + collision.height + movement.top > bounds.top) {
            movement.top = bounds.top - (this.position.top + collision.top + collision.height);
        }

        return movement;
    };

    Player.prototype._checkTileCollision = function(movement) {
        var positionOnMap = this.getPositionOnMap(),
            newPositionOnMap = this.getPositionOnMap(movement);

        if (
            movement.left < 0 &&
            (
                this.level.map[positionOnMap.top][newPositionOnMap.left] ||
                this.level.map[positionOnMap.bottom][newPositionOnMap.left] ||
                (
                    movement.top &&
                    (
                        (
                            movement.top < 0 && !this.level.map[newPositionOnMap.top][positionOnMap.left] ||
                            movement.top > 0 && !this.level.map[newPositionOnMap.bottom][positionOnMap.left]
                        ) && (
                            this.level.map[newPositionOnMap.top][newPositionOnMap.left] ||
                            this.level.map[newPositionOnMap.bottom][newPositionOnMap.left]
                        )
                    )
                )
            )
        ) {
            movement.left = positionOnMap.left * 32 - (this.position.left + collision.left);
        } else if (
            movement.left > 0 &&
            (
                this.level.map[positionOnMap.top][newPositionOnMap.right] ||
                this.level.map[positionOnMap.bottom][newPositionOnMap.right] ||
                (
                    movement.top &&
                    (
                        (
                            movement.top < 0 && !this.level.map[newPositionOnMap.top][positionOnMap.right] ||
                            movement.top > 0 && !this.level.map[newPositionOnMap.bottom][positionOnMap.right]
                        ) && (
                            this.level.map[newPositionOnMap.top][newPositionOnMap.right] ||
                            this.level.map[newPositionOnMap.bottom][newPositionOnMap.right]
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
                this.level.map[newPositionOnMap.top][positionOnMap.left] ||
                this.level.map[newPositionOnMap.top][positionOnMap.right] ||
                (
                    movement.left &&
                    (
                        (
                            movement.left < 0 && !this.level.map[positionOnMap.top][newPositionOnMap.left] ||
                            movement.left > 0 && !this.level.map[positionOnMap.top][newPositionOnMap.right]
                        ) && (
                            this.level.map[newPositionOnMap.top][newPositionOnMap.left] ||
                            this.level.map[newPositionOnMap.top][newPositionOnMap.right]
                        )
                    )
                )
            )
        ) {
            movement.top = positionOnMap.top * 32 - (this.position.top + collision.top);
        } else if (
            movement.top > 0 &&
            (
                this.level.map[newPositionOnMap.bottom][positionOnMap.left] ||
                this.level.map[newPositionOnMap.bottom][positionOnMap.right] ||
                (
                    movement.left &&
                    (
                        (
                            movement.left < 0 && !this.level.map[positionOnMap.bottom][newPositionOnMap.left] ||
                            movement.left > 0 && !this.level.map[positionOnMap.bottom][newPositionOnMap.right]
                        ) && (
                            this.level.map[newPositionOnMap.bottom][newPositionOnMap.left] ||
                            this.level.map[newPositionOnMap.bottom][newPositionOnMap.right]
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
