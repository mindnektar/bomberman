$(function() {
    $.socketio = function(who, callback) {
        var socket = io.connect('ws://' + location.host + ':8080').emit('reg', who);

        socket.on('msg', callback);

        this.emit = function(data) {
            socket.emit('msg', data);
        };

        return this;
    }
});
