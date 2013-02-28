$(function() {
    var me = location.href.split('?')[1],

        players = {
            blue: $('#blue'),
            red: $('#red')
        },

        pressed = {blue: {}, red: {}},
        ws,
        moveMap = {},

        Key = {
            UP: 87,
            RIGHT: 68,
            DOWN: 83,
            LEFT: 65
        },

        speed = 4;

    (function init() {
        ws = $.socketio(me, input);

        moveMap[Key.UP] = [0, -1];
        moveMap[Key.RIGHT] = [1, 0];
        moveMap[Key.DOWN] = [0, 1];
        moveMap[Key.LEFT] = [-1, 0];

        $(window)
            .keydown(function(e) {
                if (!moveMap[e.which]) {
                    return;
                }

                if (!pressed[me][e.which]) {
                    pressed[me][e.which] = true;
                }
            })
            .keyup(function(e) {
                if (!moveMap[e.which]) {
                    return;
                }

                if (pressed[me][e.which]) {
                    delete pressed[me][e.which];
                }
            });

        setInterval(frame, 40);
    })();

    function frame() {
        emit();

        $.each(pressed, function(player, keys) {
            var movement = {x: 0, y: 0};

            $.each(keys, function(key) {console.log(key);
                if (moveMap[key]) {
                    movement.x = moveMap[key][0] * speed;
                    movement.y = moveMap[key][1] * speed;
                }
            });

            players[player].css({
                left: '+=' + movement.x,
                top: '+=' + movement.y
            });
        });
    }

    function input(data) {
        if (data.who === me) {
            return;
        }

        pressed[data.who] = data.keys;
    }

    function emit() {
        ws.emit({who: me, keys: pressed[me]});
    }
});
