$(function() {
    var level,
        input,
        score,
        timer,
        players = {
            blue: null,
            red: null,
            yellow: null,
            green: null,
            orange: null,
            pink: null,
            purple: null,
            darkblue: null
        };

    (function init() {
        me = location.href.split('?')[1];

        ws = $.socketio(me, {
            position: position,
            dropBomb: dropBomb,
            detonateAll: detonateAll,
            dropItem: dropItem,
            collectItem: collectItem,
            die: die
        });

        input = new Input();

        level = new Level();

        $.each(players, function(who, _) {
            players[who] = new Player(who, level, onDeath);
        });

        level.build('empty', players);

        score = new Score(players);

        timer = $.timer({
            timeOver: function() {
                level.suddenDeath();
            }
        });
        timer.start();

        setInterval(frame, 40);
    })();

    function frame() {
        var movement = input.getMovement(players[me].skills.speed);

        ws.emit('position', {position: players[me].move(movement)});

        if (players[me].dead) {
            return;
        }

        if (input.bombDropped()) {
            if (input.secondPress && players[me].skills.line) {
                players[me].dropLine();
            } else {
                players[me].dropBomb();
            }
        }

        if (input.hitSpecialKey()) {
            if (players[me].skills.time) {
                level.detonateBombsBy(me);
                ws.emit('detonateAll');
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

        level.dropBomb(players[data.who], data.position);
    }

    function detonateAll(data) {
        if (data.who === me) {
            return;
        }

        level.detonateBombsBy(data.who);
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

    function die(data) {
        if (data.who === me) {
            return;
        }

        players[data.who].die(data);
    }

    function onDeath(data) {
        if (data.killer) {
            score.adjustKills(players[data.killer], data.who === data.killer ? -1 : 1);
        }

        score.removePlayer(data.who);
    }
});
