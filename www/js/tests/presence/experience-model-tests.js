moduleForModel('experience', 'Model/Experience', {
    setup: function() {
    },

    teardown: function() {
        $.mockjax.clear();
        translationMock();
    }
});