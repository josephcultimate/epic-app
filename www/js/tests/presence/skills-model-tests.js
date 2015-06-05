moduleForModel('skill', 'Model/Skill', {
    setup: function() {
    },

    teardown: function() {
        $.mockjax.clear();
    }
});

test('Should use correct translation keys and proper format', function(assert) {
    var skill = this.subject();

    Ember.run(function() {
        skill.set('description', 'Scuba Diving');
        skill.set('willing_to_help', 'true');
        assert.equal(skill.get('showWillingToHelp'), true, 'Show willing to help');

        skill.set('description', 'Coding');
        skill.set('willing_to_help', 'false');
        assert.equal(skill.get('showWillingToHelp'), null, 'Not show willing to help');
    });
});