$(function() {
    var me = location.href.split('?')[1],

        ws,
        level,
        input,
        players = {};

    (function init() {
        var bounds;

        ws = $.socketio(me, {
            position: position
        });

        level = new Level();
        level.build('blocktest');

        input = new Input();

        players.blue = new Player('blue', {left: 64, top: 128}, level);
        players.red = new Player('red', {left: 256, top: 256}, level);

        setInterval(frame, 40);
    })();

    function frame() {
        var movement = input.getMovement(players[me].skills.speed),
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
