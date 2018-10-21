$(window).ready(function() {
    $(window).resize(function() {
        $('.dialog').each(function() {
            $(this).css({
                'top': ($(window).height() - $(this).height()) / 2 + 'px',
                'left': ($(window).width() - $(this).width()) / 2 + 'px'
            });
        });
        $('.dialog.dialog-default .dialog-content')
    });
});