(function($) {
    Input = function() {
        moveMap[Key.UP] = [0, -1];
        moveMap[Key.RIGHT] = [1, 0];
        moveMap[Key.DOWN] = [0, 1];
        moveMap[Key.LEFT] = [-1, 0];

        $(window)
            .keydown(function(e) {
                if (!e.which in Key) {
                    return;
                }

                if (!pressed[e.which]) {
                    pressed[e.which] = true;
                }
            })
            .keyup(function(e) {
                if (!e.which in Key) {
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
                movement.left = movement.left || moveMap[key][0] * speed;
                movement.top = movement.top || moveMap[key][1] * speed;
            }
        });

        return movement;
    };

    Input.prototype.bombDropped = function() {
        return pressed[Key.BOMB];
    };

    var Key = {
            UP: 87,
            RIGHT: 68,
            DOWN: 83,
            LEFT: 65,
            BOMB: 79
        },

        moveMap = {},
        pressed = {};

})(jQuery);
