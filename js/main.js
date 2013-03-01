$(function() {
    var me = location.href.split('?')[1],

        speed = 4,

        ws,
        level,
        input,
        players = {};

    (function init() {
        ws = $.socketio(me, {
            position: position
        });

        level = new Level();
        level.build('empty');

        input = new Input();

        players.blue = new Player('blue', {left: 128, top: 128});
        players.red = new Player('red', {left: 256, top: 256});

        setInterval(frame, 40);
    })();

    function frame() {
        var movement = input.getMovement(speed),
            newPosition = players[me].move(movement);

        ws.emit('position', {position: newPosition});
    }

    function position(data) {
        if (data.who === me) {
            return;
        }

        players[data.who].setPosition(data.position);
    }
});
