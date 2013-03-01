$(function() {
    $.socketio = function(who, events) {
        var socket = io.connect('ws://' + location.host + ':8080').emit('reg', who);

        $.each(events, function(type, handler) {
            socket.on('msg', function(data) {
                if (data.type === type) {
                    delete data.type;
                    handler(data);
                }
            });
        });

        this.emit = function(type, data) {
            data = data || {};
            data.type = type;
            data.who = who;

            socket.emit('msg', data);
        };

        return this;
    }
});
