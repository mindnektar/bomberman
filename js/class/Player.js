(function($) {
    Player = function(player, position, level) {
        this.$player = $('<div id="' + player + '" class="player"></div>');

        this.position = position;
        this.level = level;

        this.skills = {
            bombs: 3,
            power: 1,
            speed: 4
        };

        this.score = {
            wins: 0,
            kills: 0
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
        var pos = this.getPositionOnMap(),
            newPos = this.getPositionOnMap(movement),
            newMovement = $.extend({}, movement),
            trav;

        if (movement.left < 0) {
            trav = {
                topLeft: this.level.isTraversable(newPos.left, pos.top),
                bottomLeft: this.level.isTraversable(newPos.left, pos.bottom)
            };

            if (!trav.topLeft || !trav.bottomLeft) {
                newMovement.left = pos.left * 32 - (this.position.left + collision.left);

                if (newMovement.left + this.skills.speed < 0) {
                    newMovement.left = -this.skills.speed;
                }

                if (!movement.top && newMovement.left > -this.skills.speed) {
                    if (!trav.topLeft && trav.bottomLeft) {
                        newMovement.top = newMovement.left + this.skills.speed;
                    }

                    if (trav.topLeft && !trav.bottomLeft) {
                        newMovement.top = -(newMovement.left + this.skills.speed);
                    }
                }
            }
        } else if (movement.left > 0) {
            trav = {
                topRight: this.level.isTraversable(newPos.right, pos.top),
                bottomRight: this.level.isTraversable(newPos.right, pos.bottom)
            };

            if (!trav.topRight || !trav.bottomRight) {
                newMovement.left = pos.right * 32 - (this.position.left + collision.left - 3);

                if (newMovement.left - this.skills.speed > 0) {
                    newMovement.left = this.skills.speed;
                }

                if (!movement.top && newMovement.left < this.skills.speed) {
                    if (!trav.topRight && trav.bottomRight) {
                        newMovement.top = newMovement.left + this.skills.speed;
                    }

                    if (trav.topRight && !trav.bottomRight) {
                        newMovement.top = -(newMovement.left + this.skills.speed);
                    }
                }
            }
        } else if (movement.top < 0) {
            trav = {
                topLeft: this.level.isTraversable(pos.left, newPos.top),
                topRight: this.level.isTraversable(pos.right, newPos.top)
            };

            if (!trav.topLeft || !trav.topRight) {
                newMovement.top = pos.top * 32 - (this.position.top + collision.top);

                if (newMovement.top + this.skills.speed < 0) {
                    newMovement.top = -this.skills.speed;
                }

                if (!movement.left && newMovement.top > -this.skills.speed) {
                    if (!trav.topLeft && trav.topRight) {
                        newMovement.left = newMovement.top + this.skills.speed;
                    }

                    if (trav.topLeft && !trav.topRight) {
                        newMovement.left = -(newMovement.top + this.skills.speed);
                    }
                }
            }
        } else if (movement.top > 0) {
            trav = {
                bottomLeft: this.level.isTraversable(pos.left, newPos.bottom),
                bottomRight: this.level.isTraversable(pos.right, newPos.bottom)
            };

            if (!trav.bottomLeft || !trav.bottomRight) {
                newMovement.top = pos.bottom * 32 - (this.position.top + collision.top - 3);

                if (newMovement.top - this.skills.speed > 0) {
                    newMovement.top = this.skills.speed;
                }

                if (!movement.left && newMovement.top < this.skills.speed) {
                    if (!trav.bottomLeft && trav.bottomRight) {
                        newMovement.left = newMovement.top + this.skills.speed;
                    }

                    if (trav.bottomLeft && !trav.bottomRight) {
                        newMovement.left = -(newMovement.top + this.skills.speed);
                    }
                }
            }
        }

        return newMovement;
    };

    var collision = {
        left: 2,
        top: 34,
        width: 28,
        height: 28
    };
})(jQuery);
