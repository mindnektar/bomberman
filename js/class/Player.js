(function($) {
    Player = function(player, level, onDeath) {
        this.$player = $('<div id="' + player + '" class="player"></div>');

        this.level = level;
        this.onDeath = onDeath;

        this.skills = {
            bombs: 1,
            power: 1,
            speed: 4
        };

        this.score = {
            wins: 0,
            kills: 0
        };

        this.dead = false;
    };

    Player.prototype.setPosition = function(position) {
        this.position = position;

        this._putOnMap();

        return this.position;
    };

    Player.prototype.getPositionOnMap = function(modifier, coll) {
        if (!modifier) {
            modifier = {
                left: 0,
                top: 0
            };
        }

        coll = coll || collision;

        return {
            left: Math.floor((this.position.left + coll.left + modifier.left) / 32),
            right: Math.floor((this.position.left + coll.left + coll.width + modifier.left) / 32),
            top: Math.floor((this.position.top + coll.top + modifier.top) / 32),
            bottom: Math.floor((this.position.top + coll.top + coll.height + modifier.top) / 32)
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
        if (this.dead) {
            return this.position;
        }

        this._checkDetonationCollision(movement);
        this._checkItemCollision(movement);
        movement = this._checkTileCollision(movement);

        this.position.left += movement.left;
        this.position.top += movement.top;

        this._putOnMap();

        return this.position;
    };

    Player.prototype.die = function() {
        this.$player.fadeOut(1000);

        this.dead = true;
    };

    /* Private */

    Player.prototype._putOnMap = function() {
        var zIndex = this.position.top + collision.top + 1;

        this.$player
            .css(this.position)
            .css({zIndex: zIndex});
    };

    Player.prototype._checkDetonationCollision = function(movement) {
        var self = this,
            coll = {
                left: 8,
                top: 40,
                width: 16,
                height: 16
            },
            newPos = this.getPositionOnMap(movement, coll),
            detonations = {
                topLeft: this.level.isDetonationOn(newPos.left, newPos.top),
                topRight: this.level.isDetonationOn(newPos.right, newPos.top),
                bottomRight: this.level.isDetonationOn(newPos.right, newPos.bottom),
                bottomLeft: this.level.isDetonationOn(newPos.left, newPos.bottom)
            };

        $.each(detonations, function(_, detonation) {
            if (detonation) {
                self._kill(detonation.bomb.who);
                return false;
            }
        });
    };

    Player.prototype._checkItemCollision = function(movement) {
        var self = this,
            newPos = this.getPositionOnMap(movement),
            items = {
                topLeft: this.level.isItemOn(newPos.left, newPos.top),
                topRight: this.level.isItemOn(newPos.right, newPos.top),
                bottomRight: this.level.isItemOn(newPos.right, newPos.bottom),
                bottomLeft: this.level.isItemOn(newPos.left, newPos.bottom)
            };

        $.each(items, function(_, item) {
            if (item) {
                item.collect(self);
                ws.emit('collectItem', {left: item.left, top: item.top});
                return false;
            }
        });
    };

    Player.prototype._checkTileCollision = function(movement) {
        var pos = this.getPositionOnMap(),
            newPos = this.getPositionOnMap(movement),
            trav;

        if (movement.left < 0) {
            trav = {
                topLeft: this.level.isTraversable(newPos.left, pos.top),
                bottomLeft: this.level.isTraversable(newPos.left, pos.bottom)
            };

            if (!trav.topLeft || !trav.bottomLeft) {
                movement.left = pos.left * 32 - (this.position.left + collision.left);

                if (movement.left + this.skills.speed < 0) {
                    movement.left = -this.skills.speed;
                }

                if (movement.left > -this.skills.speed) {
                    if (!trav.topLeft && trav.bottomLeft) {
                        movement.top = movement.left + this.skills.speed;
                    }

                    if (trav.topLeft && !trav.bottomLeft) {
                        movement.top = -(movement.left + this.skills.speed);
                    }
                }
            }
        } else if (movement.left > 0) {
            trav = {
                topRight: this.level.isTraversable(newPos.right, pos.top),
                bottomRight: this.level.isTraversable(newPos.right, pos.bottom)
            };

            if (!trav.topRight || !trav.bottomRight) {
                movement.left = pos.right * 32 - (this.position.left + collision.left - 3);

                if (movement.left - this.skills.speed > 0) {
                    movement.left = this.skills.speed;
                }

                if (movement.left < this.skills.speed) {
                    if (!trav.topRight && trav.bottomRight) {
                        movement.top = movement.left + this.skills.speed;
                    }

                    if (trav.topRight && !trav.bottomRight) {
                        movement.top = -(movement.left + this.skills.speed);
                    }
                }
            }
        } else if (movement.top < 0) {
            trav = {
                topLeft: this.level.isTraversable(pos.left, newPos.top),
                topRight: this.level.isTraversable(pos.right, newPos.top)
            };

            if (!trav.topLeft || !trav.topRight) {
                movement.top = pos.top * 32 - (this.position.top + collision.top);

                if (movement.top + this.skills.speed < 0) {
                    movement.top = -this.skills.speed;
                }

                if (movement.top > -this.skills.speed) {
                    if (!trav.topLeft && trav.topRight) {
                        movement.left = movement.top + this.skills.speed;
                    }

                    if (trav.topLeft && !trav.topRight) {
                        movement.left = -(movement.top + this.skills.speed);
                    }
                }
            }
        } else if (movement.top > 0) {
            trav = {
                bottomLeft: this.level.isTraversable(pos.left, newPos.bottom),
                bottomRight: this.level.isTraversable(pos.right, newPos.bottom)
            };

            if (!trav.bottomLeft || !trav.bottomRight) {
                movement.top = pos.bottom * 32 - (this.position.top + collision.top - 3);

                if (movement.top - this.skills.speed > 0) {
                    movement.top = this.skills.speed;
                }

                if (movement.top < this.skills.speed) {
                    if (!trav.bottomLeft && trav.bottomRight) {
                        movement.left = movement.top + this.skills.speed;
                    }

                    if (trav.bottomLeft && !trav.bottomRight) {
                        movement.left = -(movement.top + this.skills.speed);
                    }
                }
            }
        }

        return movement;
    };

    Player.prototype._kill = function(who) {
        this.die();

        this.onDeath && this.onDeath(who);
    };

    var collision = {
        left: 2,
        top: 34,
        width: 28,
        height: 28
    };
})(jQuery);
