<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Bomberman</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" href="css/main.css" />
    <script type="text/javascript" src="js/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js"></script>
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/plugins/socketio/jquery.socketio.js"></script>
    <script type="text/javascript" src="js/class/Input.js"></script>
    <script type="text/javascript" src="js/class/Level.js"></script>
    <script type="text/javascript" src="js/class/Player.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
</head>
<body>

<div class="wrapper">
    <div id="level">
        <div id="blue" class="player"></div>
        <div id="red" class="player"></div>
    </div>
</div>

</body>
</html>
