(function($) {
    Item = function(type, left, top, level, onCollect) {
        this.type = type;
        this.left = left;
        this.top = top;
        this.onCollect = onCollect;

        this.$item = $('<div class="item ' + type + '"></div>');
        this.$item
            .css({
                left: left * 32,
                top: top * 32
            })
            .text(contentByType[type])
            .appendTo(level.$level);
    };

    Item.prototype.collect = function(player) {
        switch (this.type) {
            case 'bomb':
            case 'power':
            case 'speed':
                player.skills[this.type]++;
                break;
        }

        this.onCollect && this.onCollect();

        ws.emit('collectItem', {left: this.left, top: this.top});
    };

    Item.prototype.remove = function() {
        this.$item.remove();
    };

    var contentByType = {
        bombs: 'B',
        power: 'P',
        speed: 'S'
    }
})(jQuery);
