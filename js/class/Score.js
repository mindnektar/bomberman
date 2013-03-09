(function($) {
    Score = function(players) {
        var html = '';

        this.$scoreboard = $('#scoreboard');

        $.each(players, function(who, player) {
            html += '\
                <div class="' + who + '">\
                    <p class="name">' + player.name + '</p>\
                    <p class="score">Score: <span>0</span></p>\
                    <p class="kills">Kills: <span>0</span></p>\
                </div>\
            ';
        });

        this.$scoreboard.html(html);
    };

    Score.prototype.adjustKills = function(player, kills) {
        player.score.kills += kills;

        $('.' + player.who + ' .kills span', this.$scoreboard).text(player.score.kills);
    };
})(jQuery);
