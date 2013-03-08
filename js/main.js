$(function() {
    var level,
        input,
        players = {
            blue: null,
            red: null
        };

    (function init() {
        me = location.href.split('?')[1];

        ws = $.socketio(me, {
            position: position,
            dropBomb: dropBomb,
            dropItem: dropItem,
            collectItem: collectItem,
            die: function(data) {
                if (data.who === me) {
                    return;
                }

                players[data.who].die();

                players[data.killer].score.kills++;
            }
        });

        input = new Input();

        level = new Level();

        $.each(players, function(who, _) {
            players[who] = new Player(who, level, onDeath);
        });

        level.build('empty', players);

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

    function dropItem(data) {
        if (data.who === me) {
            return;
        }

        level.dropItem(data.itemType, data.left, data.top);
    }

    function collectItem(data) {
        if (data.who === me) {
            return;
        }

        level.collectItem(players[data.who], data.left, data.top);
    }

    function onDeath(who) {
        players[who].score.kills++;
        ws.emit('die', {killer: who});
    }
});
