$(function() {
    var me = location.href.split('?')[1],

        players = {
            blue: $('#blue'),
            red: $('#red')
        },

        pressed = {},
        ws,
        moveMap = {},

        Key = {
            UP: 87,
            RIGHT: 68,
            DOWN: 83,
            LEFT: 65
        },

        pos = {
            blue: {
                left: 128,
                top: 128
            },
            red: {
                left: 800,
                top: 640
            }
        },

        speed = 4;

    (function init() {
        ws = $.socketio(me, {
            position: position
        });

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

        setInterval(frame, 40);
    })();

    function frame() {
        var movement = {left: 0, top: 0};

        $.each(pressed, function(key) {
            if (moveMap[key]) {
                movement.left = moveMap[key][0] * speed;
                movement.top = moveMap[key][1] * speed;
            }
        });

        pos[me].left += movement.left;
        pos[me].top += movement.top;

        moveOnMap(me);

        ws.emit('position', {position: pos[me]});
    }

    function position(data) {
        if (data.who === me) {
            return;
        }

        pos[data.who] = data.position;

        moveOnMap(data.who);
    }

    function moveOnMap(player) {
        players[player].css(pos[player]);
    }
});
