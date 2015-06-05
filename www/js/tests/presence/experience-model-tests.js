moduleForModel('experience', 'Model/Experience', {
    setup: function() {
        oldEmberI18nt = Ember.I18n.t;

        //Mocking ember translations to just return the translation key name for testing
        Ember.I18n.t = function(keyName){return keyName;};
    },

    teardown: function() {
        Ember.I18n.t = oldEmberI18nt;
        $.mockjax.clear();
    }
});

var oldEmberI18nt;

test('Should use correct translation keys and proper format', function(assert) {
    var experience = this.subject();

    Ember.run(function() {
        experience.set('location', 'Florida');
        experience.set('from_month', null);
        experience.set('from_year', null);
        experience.set('to_month', null);
        experience.set('to_year', null);
        assert.equal(experience.get('durationAndLocation'), 'Florida', 'Only location');

        experience.set('location', '');
        experience.set('from_month', null);
        experience.set('from_year', null);
        experience.set('to_month', null);
        experience.set('to_year', '2010');
        assert.equal(experience.get('durationAndLocation'), 'system.literal.To: 2010', 'Only to year');

        experience.set('location', '');
        experience.set('from_month', null);
        experience.set('from_year', null);
        experience.set('to_month', '1');
        experience.set('to_year', '2010');
        assert.equal(experience.get('durationAndLocation'), 'system.literal.To: system.monthname.1 2010', 'Only to date');

        experience.set('location', '');
        experience.set('from_month', null);
        experience.set('from_year', '2011');
        experience.set('to_month', null);
        experience.set('to_year', null);
        assert.equal(experience.get('durationAndLocation'), '2011 - system.literal.Present', 'Only from year');
        
        experience.set('location', '');
        experience.set('from_month', '2');
        experience.set('from_year', '2011');
        experience.set('to_month', null);
        experience.set('to_year', null);
        assert.equal(experience.get('durationAndLocation'), 'system.monthname.2 2011 - system.literal.Present', 'Only from date');

        experience.set('location', '');
        experience.set('from_month', '2');
        experience.set('from_year', '2011');
        experience.set('to_month', '3');
        experience.set('to_year', '2012');
        assert.equal(experience.get('durationAndLocation'), 'system.monthname.2 2011 - system.monthname.3 2012', 'Only dates');

        experience.set('location', 'Weston');
        experience.set('from_month', '3');
        experience.set('from_year', '2012');
        experience.set('to_month', '4');
        experience.set('to_year', '2013');
        assert.equal(experience.get('durationAndLocation'), 'system.monthname.3 2012 - system.monthname.4 2013 | Weston', 'Dates and location should be formatted');
    });
});