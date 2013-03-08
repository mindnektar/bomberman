$(function() {
    var level,
        input,
        players = {
            blue: null,
            red: null
            //yellow: null,
            //green: null
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
        var movement = input.getMovement(players[me].skills.speed);

        ws.emit('position', {position: players[me].move(movement)});

        if (players[me].dead) {
            return;
        }

        if (input.bombDropped()) {
            if (input.secondPress) {
                players[me].dropLine();
            } else {
                players[me].dropBomb();
            }
        }
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
