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
                    //this.map[i][j] = 1;

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

    Level.prototype.dropBomb = function(who, power, positionOnMap, onDetonation) {
        var self = this;

        bombs[positionOnMap.left][positionOnMap.top] = new Bomb(
            who,
            power,
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
                self._removeDetonations();
            }
        );
    };

    /* Private */

    Level.prototype._placeDetonations = function(positionOnMap, bomb) {
        var html = '',
            detonation,
            i;

        detonations[positionOnMap.left][positionOnMap.top] = bomb;

        html += '<div class="detonation ' + bomb.who + '" style="left: ' + (positionOnMap.left * 32) + 'px; top: ' + (positionOnMap.top * 32) + 'px;"></div>';

        for (i = 1; i <= bomb.power && positionOnMap.left - i >= 0 && this.map[positionOnMap.top][positionOnMap.left - i] !== 2; i++) {
            detonation = this._handleDetonation(positionOnMap.left - i, positionOnMap.top, bomb);

            if (!detonation) {
                break;
            }

            html += detonation;
        }

        for (i = 1; i <= bomb.power && positionOnMap.left + i < this.map[0].length && this.map[positionOnMap.top][positionOnMap.left + i] !== 2; i++) {
            detonation = this._handleDetonation(positionOnMap.left + i, positionOnMap.top, bomb);

            if (!detonation) {
                break;
            }

            html += detonation;
        }

        for (i = 1; i <= bomb.power && positionOnMap.top - i >= 0 && this.map[positionOnMap.top - i][positionOnMap.left] !== 2; i++) {
            detonation = this._handleDetonation(positionOnMap.left, positionOnMap.top - i, bomb);

            if (!detonation) {
                break;
            }

            html += detonation;
        }

        for (i = 1; i <= bomb.power && positionOnMap.top + i < this.map.length && this.map[positionOnMap.top + i][positionOnMap.left] !== 2; i++) {
            detonation = this._handleDetonation(positionOnMap.left, positionOnMap.top + i, bomb);

            if (!detonation) {
                break;
            }

            html += detonation;
        }

        bomb.setDetonations(
            $(html).appendTo(this.$level)
        );
    };

    Level.prototype._handleDetonation = function(left, top, bomb) {
        if (this._breakBlock(left, top)) {
            return null;
        }

        if (bombs[left][top]) {
            bombs[left][top].detonate();
        }

        detonations[left][top] = bomb;
        return '<div class="detonation ' + bomb.who + '" style="left: ' + (left * 32) + 'px; top: ' + (top * 32) + 'px;"></div>';
    };

    Level.prototype._removeDetonations = function() {
        detonations = this._dataObject();
    };

    Level.prototype._breakBlock = function(left, top) {
        if (this.map[top] && this.map[top][left] === 1) {
            this.map[top][left] = 0;

            $('.left' + left + '.top' + top)
                .removeClass(tiles[1])
                .addClass(tiles[0]);

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

        tiles = {
            0: 'empty',
            1: 'breakable',
            2: 'fixed'
        },

        startPositions = [
            {left: 0, top: 0},
            {left: 18, top: 14}
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
