(function($, undefined) {
    Input = function() {
        var self = this;

        moveMap[Key.UP] = [0, -1];
        moveMap[Key.RIGHT] = [1, 0];
        moveMap[Key.DOWN] = [0, 1];
        moveMap[Key.LEFT] = [-1, 0];

        this.secondPress = false;

        $(window)
            .keydown(function(e) {
                if (!e.which in Key) {
                    return;
                }

                if (moveMap[e.which] && $.inArray(e.which, direction) === -1) {
                    direction.unshift(e.which);
                    return;
                }

                if (pressed[e.which] === undefined) {
                    pressed[e.which] = true;
                }
            })
            .keyup(function(e) {
                var directionIndex;

                if (!e.which in Key) {
                    return;
                }

                directionIndex = $.inArray(e.which, direction);

                if (moveMap[e.which] && directionIndex !== -1) {
                    direction.splice(directionIndex, 1);
                    return;
                }

                if (pressed[e.which] !== undefined) {
                    delete pressed[e.which];
                }
            });
    };

    Input.prototype.getMovement = function(speed) {
        var movement = {left: 0, top: 0};

        if (moveMap[direction[0]]) {
            movement.left = moveMap[direction[0]][0] * speed;
            movement.top = moveMap[direction[0]][1] * speed;
        }

        return movement;
    };

    Input.prototype.bombDropped = function() {
        if (pressed[Key.BOMB]) {
            pressed[Key.BOMB] = false;

            this.secondPress = lastPress[Key.BOMB] && new Date() - lastPress[Key.BOMB] <= 400;

            lastPress[Key.BOMB] = !this.secondPress ? new Date() : 0;

            return true;
        }

        return false;
    };

    var Key = {
            UP: 87,
            RIGHT: 68,
            DOWN: 83,
            LEFT: 65,
            BOMB: 79
        },

        moveMap = {},
        pressed = {},
        lastPress = {},
        direction = [];

})(jQuery);
