moduleForModel('certification', 'Model/Certification', {    
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

    var certification = this.subject();

    Ember.run(function(){
        certification.set('achieved_day', null);
        certification.set('achieved_month', null);
        certification.set('achieved_year', 2015);
        certification.set('expire_day', null);
        certification.set('expire_month', null);
        certification.set('expire_year', null);
        assert.equal(certification.get('duration'), 'system.literal.achieved: 2015', 'Should be using correct translation keys and proper format');

        certification.set('achieved_day', null);
        certification.set('achieved_month', 3);
        certification.set('achieved_year', 2015);
        certification.set('expire_day', null);
        certification.set('expire_month', null);
        certification.set('expire_year', null);
        assert.equal(certification.get('duration'), 'system.literal.achieved: system.monthname.3 2015', 'Should be using correct translation keys and proper format');

        certification.set('achieved_day', 1);
        certification.set('achieved_month', 3);
        certification.set('achieved_year', 2015);
        certification.set('expire_day', null);
        certification.set('expire_month', null);
        certification.set('expire_year', null);
        assert.equal(certification.get('duration'), 'system.literal.achieved: system.monthname.3 1, 2015', 'Should be using correct translation keys and proper format');

        certification.set('achieved_day', null);
        certification.set('achieved_month', null);
        certification.set('achieved_year', null);
        certification.set('expire_day', null);
        certification.set('expire_month', null);
        certification.set('expire_year', 2020);
        assert.equal(certification.get('duration'), 'system.literal.expire: 2020', 'Should be using correct translation keys and proper format');

        certification.set('achieved_day', null);
        certification.set('achieved_month', null);
        certification.set('achieved_year', null);
        certification.set('expire_day', null);
        certification.set('expire_month', 3);
        certification.set('expire_year', 2020);
        assert.equal(certification.get('duration'), 'system.literal.expire: system.monthname.3 2020', 'Should be using correct translation keys and proper format');

        certification.set('achieved_day', null);
        certification.set('achieved_month', null);
        certification.set('achieved_year', null);
        certification.set('expire_day', 1);
        certification.set('expire_month', 3);
        certification.set('expire_year', 2020);
        assert.equal(certification.get('duration'), 'system.literal.expire: system.monthname.3 1, 2020', 'Should be using correct translation keys and proper format');

        certification.set('achieved_day', 1);
        certification.set('achieved_month', 3);
        certification.set('achieved_year', 2015);
        certification.set('expire_day', 1);
        certification.set('expire_month', 3);
        certification.set('expire_year', 2020);
        assert.equal(certification.get('duration'), 'system.monthname.3 1, 2015 - system.monthname.3 1, 2020', 'Should be using correct translation keys and proper format');
    });
});