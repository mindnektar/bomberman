(function($, undefined) {
    Level = function($level) {
        this.$level = $level || $('#level');

        this.map = null;
    };

    Level.prototype.build = function(name, players) {
        var self = this,
            html = '',
            i,
            j,
            k = 0;

        this.map = maps[name];

        this.$level
            .height(this.map.length * 32)
            .width(this.map[0].length * 32);

        $.each(players, function(_, player) {
            player.setPosition({
                left: startPositions[k].left * 32,
                top: (startPositions[k].top - 1) * 32
            });

            self.$level.append(player.$player);

            k++;
        });

        startPositions.splice(k, startPositions.length);

        for (i in this.map) {
            for (j in this.map[i]) {
                if (!this.map[i][j]) {
                    this.map[i][j] = 1;

                    for (k in startPositions) {
                        if ((Math.abs(startPositions[k].left - j) <= 1 && startPositions[k].top == i) ||
                            (Math.abs(startPositions[k].top - i) <= 1 && startPositions[k].left == j)) {
                            this.map[i][j] = 0;
                            break;
                        }
                    }
                }

                html += '<div class="tile ' + tiles[this.map[i][j]] + ' left' + j + ' top' + i + '"></div>';
            }
        }

        bombs = this._dataObject();
        detonations = this._dataObject();
        items = this._dataObject();

        this.$level.append(html);
    };

    Level.prototype.isTraversable = function(x, y) {
        return this.map[y] !== undefined && this.map[y][x] !== undefined && !this.map[y][x] && !this.isBombOn(x, y);
    };

    Level.prototype.isBombOn = function(left, top) {
        if (!bombs[left]) {
            return null;
        }

        return bombs[left][top];
    };

    Level.prototype.isDetonationOn = function(left, top) {
        if (!detonations[left]) {
            return null;
        }

        return detonations[left][top];
    };

    Level.prototype.isItemOn = function(left, top) {
        if (!items[left]) {
            return null;
        }

        return items[left][top];
    };

    Level.prototype.dropBomb = function(player, positionOnMap, onDetonation) {
        var self = this;

        bombs[positionOnMap.left][positionOnMap.top] = new Bomb(
            player,
            {
                left: positionOnMap.left * 32,
                top: positionOnMap.top * 32
            },
            this,
            function(bomb) {
                bombs[positionOnMap.left][positionOnMap.top] = null;

                self._placeDetonations(positionOnMap, bomb);

                onDetonation && onDetonation();
            },
            function() {
                detonations = self._dataObject();
            }
        );

        if (detonations[positionOnMap.left][positionOnMap.top]) {
            bombs[positionOnMap.left][positionOnMap.top].detonate();
        }
    };

    Level.prototype.detonateBombsBy = function(who) {
        $.each(bombs, function(_, row) {
            $.each(row, function(_, bomb) {
                if (bomb && bomb.who === who) {
                    bomb.detonate();
                }
            });
        });
    };

    Level.prototype.dropItem = function(type, left, top) {
        var self = this;

        items[left][top] = new Item(type, left, top, this, function() {
            items[left][top].remove();
            items[left][top] = null;
        });
    };

    Level.prototype.collectItem = function(player, left, top) {
        if (items[left][top]) {
            items[left][top].collect(player);
            items[left][top] = null;
        }
    };

    /* Private */

    Level.prototype._placeDetonations = function(positionOnMap, bomb) {
        var html = '',
            detonation,
            i;

        detonations[positionOnMap.left][positionOnMap.top] = {type: 'center', bomb: bomb};

        html += '<div class="detonation center ' + bomb.who + '" style="left: ' + (positionOnMap.left * 32) + 'px; top: ' + (positionOnMap.top * 32) + 'px;"></div>';

        for (i = 1; i <= bomb.power && positionOnMap.left - i >= 0 && this.map[positionOnMap.top][positionOnMap.left - i] !== 2; i++) {
            detonation = this._handleDetonation(positionOnMap.left - i, positionOnMap.top, 'horizontal', bomb);

            if (!detonation) {
                break;
            }

            html += detonation;
        }

        for (i = 1; i <= bomb.power && positionOnMap.left + i < this.map[0].length && this.map[positionOnMap.top][positionOnMap.left + i] !== 2; i++) {
            detonation = this._handleDetonation(positionOnMap.left + i, positionOnMap.top, 'horizontal', bomb);

            if (!detonation) {
                break;
            }

            html += detonation;
        }

        for (i = 1; i <= bomb.power && positionOnMap.top - i >= 0 && this.map[positionOnMap.top - i][positionOnMap.left] !== 2; i++) {
            detonation = this._handleDetonation(positionOnMap.left, positionOnMap.top - i, 'vertical', bomb);

            if (!detonation) {
                break;
            }

            html += detonation;
        }

        for (i = 1; i <= bomb.power && positionOnMap.top + i < this.map.length && this.map[positionOnMap.top + i][positionOnMap.left] !== 2; i++) {
            detonation = this._handleDetonation(positionOnMap.left, positionOnMap.top + i, 'vertical', bomb);

            if (!detonation) {
                break;
            }

            html += detonation;
        }

        bomb.setDetonations(
            $(html).appendTo(this.$level)
        );
    };

    Level.prototype._handleDetonation = function(left, top, type, bomb) {
        var detonation;

        if (this._breakBlock(left, top, bomb.who)) {
            return null;
        }

        if (items[left][top]) {
            items[left][top].remove();
            items[left][top] = null;
            return null;
        }

        detonation = this.isDetonationOn(left, top);
        if (detonation && (detonation.type === type || detonation.type === 'center')) {
            return null;
        }

        if (bombs[left][top]) {
            bombs[left][top].detonate();
            return null;
        }

        detonations[left][top] = {type: type, bomb: bomb};
        return '<div class="detonation ' + type + ' ' + bomb.who + '" style="left: ' + (left * 32) + 'px; top: ' + (top * 32) + 'px;"></div>';
    };

    Level.prototype._breakBlock = function(left, top, who) {
        var r,
            itemType;

        if (this.map[top] && this.map[top][left] === 1) {
            this.map[top][left] = 0;

            $('.tile.left' + left + '.top' + top)
                .removeClass(tiles[1])
                .addClass(tiles[0]);

            if (who !== me) {
                r = Math.floor(Math.random() * 100);

                if (r < 10) {
                    itemType = 'speed';
                } else if (r < 20) {
                    itemType = 'bombs';
                } else if (r < 30) {
                    itemType = 'power';
                } else if (r < 35) {
                    itemType = 'line';
                } else if (r < 38) {
                    itemType = 'time';
                }

                if (itemType) {
                    this.dropItem(itemType, left, top);

                    ws.emit('dropItem', {itemType: itemType, left: left, top: top});
                }
            }

            return true;
        }

        return false;
    };

    Level.prototype._dataObject = function() {
        var i,
            obj = {};

        for (i = 0; i < this.map[0].length; i++) {
            obj[i] = {};
        }

        return obj;
    };

    var bombs,
        detonations,
        items,

        tiles = {
            0: 'empty',
            1: 'breakable',
            2: 'fixed'
        },

        startPositions = [
            {left: 0, top: 0},
            {left: 18, top: 14},
            {left: 18, top: 0},
            {left: 0, top: 14}
        ],

        maps = {
            empty: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            standard: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        };
})(jQuery);
