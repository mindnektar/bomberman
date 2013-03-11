(function($) {
    Score = function(players) {
        var html = '';

        this.$scoreboard = $('#scoreboard');
        this.remainingPlayers = 0;

        $.each(players, function(who, player) {
            html += '\
                <div class="' + who + '">\
                    <p class="name">' + player.name + '</p>\
                    <p class="score">Score: <span>0</span></p>\
                    <p class="kills">Kills: <span>0</span></p>\
                </div>\
            ';

            this.remainingPlayers++;
        });

        this.$scoreboard.html(html);
    };

    Score.prototype.adjustKills = function(player, kills) {
        player.score.kills += kills;

        $('.' + player.who + ' .kills span', this.$scoreboard).text(player.score.kills);
    };

    Score.prototype.removePlayer = function(who) {
        $('.' + who, this.$scoreboard).addClass('dead');

        this.remainingPlayers--;

        if (this.remainingPlayers === 1) {

        }
    };
})(jQuery);
