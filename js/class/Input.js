(function($) {
    Input = function() {
        moveMap[Key.UP] = [0, -1];
        moveMap[Key.RIGHT] = [1, 0];
        moveMap[Key.DOWN] = [0, 1];
        moveMap[Key.LEFT] = [-1, 0];

        $(window)
            .keydown(function(e) {
                if (!moveMap[e.which]) {
                    return;
                }

                if ($.inArray(e.which, direction) === -1) {
                    direction.unshift(e.which);
                }
            })
            .keyup(function(e) {
                var directionIndex;

                if (!moveMap[e.which]) {
                    return;
                }

                directionIndex = $.inArray(e.which, direction);

                if (directionIndex !== -1) {
                    direction.splice(directionIndex, 1);
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

    var Key = {
            UP: 87,
            RIGHT: 68,
            DOWN: 83,
            LEFT: 65
        },

        moveMap = {},
        direction = [];

})(jQuery);
