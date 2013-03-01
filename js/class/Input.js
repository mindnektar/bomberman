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

                if (!pressed[e.which]) {
                    pressed[e.which] = true;
                }
            })
            .keyup(function(e) {
                if (!moveMap[e.which]) {
                    return;
                }

                if (pressed[e.which]) {
                    delete pressed[e.which];
                }
            });
    };

    Input.prototype.getMovement = function(speed) {
        var movement = {left: 0, top: 0};

        $.each(pressed, function(key) {
            if (moveMap[key]) {
                movement.left = moveMap[key][0] * speed;
                movement.top = moveMap[key][1] * speed;
            }
        });

        return movement;
    };

    var Key = {
            UP: 87,
            RIGHT: 68,
            DOWN: 83,
            LEFT: 65
        },

        moveMap = {},
        pressed = {};

})(jQuery);
