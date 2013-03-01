$(function() {
    var me = location.href.split('?')[1],

        ws,
        level,
        input,
        players = {};

    (function init() {
        ws = $.socketio(me, {
            position: position,
            dropBomb: dropBomb,
            die: function(data) {
                if (data.who === me) {
                    return;
                }

                players[data.who].die();

                players[data.killer].score.kills++;
            }
        });

        level = new Level();
        level.build('blocktest');

        input = new Input();

        players.blue = new Player('blue', {left: 64, top: 128}, level, onDeath);
        players.red = new Player('red', {left: 256, top: 256}, level, onDeath);

        setInterval(frame, 40);
    })();

    function frame() {
        var movement = input.getMovement(players[me].skills.speed),
            newPosition = players[me].move(movement),
            centerPositionOnMap = players[me].getCenterPositionOnMap();

        if (players[me].dead) {
            return;
        }

        if (input.bombDropped() && !level.isBombOn(centerPositionOnMap.left, centerPositionOnMap.top) && players[me].skills.bombs) {

            players[me].skills.bombs--;

            level.dropBomb(me, players[me].skills.power, centerPositionOnMap, function() {
                players[me].skills.bombs++;
            });

            ws.emit('dropBomb', {position: centerPositionOnMap});
        }

        ws.emit('position', {position: newPosition});
    }

    function position(data) {
        if (data.who === me) {
            return;
        }

        players[data.who].setPosition(data.position);
    }

    function dropBomb(data) {
        if (data.who === me) {
            return;
        }

        level.dropBomb(data.who, players[data.who].skills.power, data.position);
    }

    function onDeath(who) {
        players[who].score.kills++;
        ws.emit('die', {killer: who});
    }
});
