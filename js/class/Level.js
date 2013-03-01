(function($) {
    Level = function($level) {
        this.$level = $level || $('#level');

        this.map = null;
    };

    Level.prototype.build = function(name) {
        var html = '',
            i, j;

        this.map = maps[name];

        for (i in this.map) {
            for (j in this.map[i]) {
                html += '<div class="tile ' + tiles[this.map[i][j]] + '"></div>';
            }
        }

        bombs = this._dataObject();
        detonations = this._dataObject();

        this.$level.append(html);
    };

    Level.prototype.getBounds = function() {
        return {
            left: this.map[0].length * 32,
            top: this.map.length * 32
        }
    };


    Level.prototype.isTraversable = function(x, y) {
        return !this.map[y][x] && !this.isBombOn(x, y);
    };

    Level.prototype.isBombOn = function(left, top) {
        return bombs[left] && bombs[left][top];
    };

    Level.prototype.isDetonationOn = function(left, top) {
        return detonations[left] && detonations[left][top];
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
            function() {
                var html = '',
                    i;

                bombs[positionOnMap.left][positionOnMap.top] = null;

                detonations[positionOnMap.left][positionOnMap.top] = who;

                html += '<div class="detonation ' + who + '" style="left: ' + (positionOnMap.left * 32) + 'px; top: ' + (positionOnMap.top * 32) + 'px;"></div>';

                for (i = 1; i <= power && !self.map[positionOnMap.top][positionOnMap.left - i]; i++) {
                    detonations[positionOnMap.left - i][positionOnMap.top] = who;
                    html += '<div class="detonation ' + who + '" style="left: ' + ((positionOnMap.left - i) * 32) + 'px; top: ' + (positionOnMap.top * 32) + 'px;"></div>';
                }

                for (i = 1; i <= power && !self.map[positionOnMap.top][positionOnMap.left + i]; i++) {
                    detonations[positionOnMap.left + i][positionOnMap.top] = who;
                    html += '<div class="detonation ' + who + '" style="left: ' + ((positionOnMap.left + i) * 32) + 'px; top: ' + (positionOnMap.top * 32) + 'px;"></div>';
                }

                for (i = 1; i <= power && !self.map[positionOnMap.top - i][positionOnMap.left]; i++) {
                    detonations[positionOnMap.left][positionOnMap.top - i] = who;
                    html += '<div class="detonation ' + who + '" style="left: ' + (positionOnMap.left * 32) + 'px; top: ' + ((positionOnMap.top - i) * 32) + 'px;"></div>';
                }

                for (i = 1; i <= power && !self.map[positionOnMap.top + i][positionOnMap.left]; i++) {
                    detonations[positionOnMap.left][positionOnMap.top + i] = who;
                    html += '<div class="detonation ' + who + '" style="left: ' + (positionOnMap.left * 32) + 'px; top: ' + ((positionOnMap.top + i) * 32) + 'px;"></div>';
                }

                self.$level.append(html);

                onDetonation && onDetonation();
            },
            function() {
                detonations = self._dataObject();

                $('.detonation', self.$level).remove();
            }
        );
    };

    /* Private */

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

        maps = {
            empty: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            blocktest: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        };
})(jQuery);
