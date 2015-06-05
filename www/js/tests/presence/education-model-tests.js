moduleForModel('education', 'Model/Education', {
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

test('Should return when level has text', function(assert) {
    var education = this.subject();

    Ember.run(function() {
        education.set('level', 'mock_education_level');
        assert.equal(education.get('hasLevel'), true, 'hasLevel is true when level contains text.');

        education.set('level', '');
        assert.equal(education.get('hasLevel'), false, 'hasLevel is false when level does not contain text.');
    });
});

test('Should return when major has text', function(assert) {
    var education = this.subject();

    Ember.run(function() {
        education.set('major', 'mock_education_major');
        assert.equal(education.get('hasMajor'), true, 'hasMajor is true when major contains text.');

        education.set('major', '');
        assert.equal(education.get('hasMajor'), false, 'hasMajor is false when major does not contain text.');
    });
});

test('Should return when minor has text', function(assert) {
    var education = this.subject();

    Ember.run(function() {
        education.set('minor', 'mock_education_minor');
        assert.equal(education.get('hasMinor'), true, 'hasMinor is true when minor contains text.');

        education.set('minor', '');
        assert.equal(education.get('hasMinor'), false, 'hasMinor is false when minor does not contain text.');
    });
});

test('Should return specialization all fields', function(assert) {

    var education = this.subject();

    Ember.run(function() {
        education.set('level', 'level');
        education.set('major', 'major');
        education.set('minor', 'minor');
        assert.equal(education.get('specialization'), 'level, major, system.literal.MinorIn minor', 'specialization contains level, major, and minor');

        education.set('level', '');
        education.set('major', 'major');
        education.set('minor', 'minor');
        assert.equal(education.get('specialization'), 'major, system.literal.MinorIn minor', 'specialization contains major and minor');

        education.set('level', '');
        education.set('major', 'major');
        education.set('minor', '');
        assert.equal(education.get('specialization'), 'major', 'specialization contains major');

        education.set('level', '');
        education.set('major', '');
        education.set('minor', 'minor');
        assert.equal(education.get('specialization'), 'system.literal.MinorIn minor', 'specialization contains minor');

        education.set('level', 'level');
        education.set('major', 'major');
        education.set('minor', '');
        assert.equal(education.get('specialization'), 'level, major', 'specialization contains level and major');

        education.set('level', 'level');
        education.set('major', '');
        education.set('minor', 'minor');
        assert.equal(education.get('specialization'), 'level, system.literal.MinorIn minor', 'specialization contains level and minor');
    });
});

test('Should properly format education date range', function(assert) {

    var education = this.subject();

    Ember.run(function() {
        // CASE #1: empty from, empty to
        education.set('from_month', null);
        education.set('from_year', null);
        education.set('to_month', null);
        education.set('to_year', null);
        assert.equal(education.get('dateFrom'), null, 'should have null DateFrom');
        assert.equal(education.get('dateTo'), null, 'should have null DateTo');
        assert.equal(education.get('dateRange'), '', 'should be an empty date range');

        // CASE #2: empty from, to year
        education.set('from_month', null);
        education.set('from_year', null);
        education.set('to_month', null);
        education.set('to_year', 2016);
        assert.equal(education.get('dateFrom'), null, 'should have null DateFrom');
        assert.equal(education.get('dateTo'), '2016', 'should have DateTo');
        assert.equal(education.get('dateRange'), 'system.literal.To: 2016', 'should be in proper format');

        // CASE #3: empty from, to month & year
        education.set('from_month', null);
        education.set('from_year', null);
        education.set('to_month', 12);
        education.set('to_year', 2016);
        assert.equal(education.get('dateFrom'), null, 'should have null DateFrom');
        assert.equal(education.get('dateTo'), 'system.monthname.12 2016', 'should have DateTo');
        assert.equal(education.get('dateRange'), 'system.literal.To: system.monthname.12 2016', 'should be in proper format');

        // CASE #4: from year, empty to
        education.set('from_month', null);
        education.set('from_year', 2015);
        education.set('to_month', null);
        education.set('to_year', null);
        assert.equal(education.get('dateFrom'), '2015', 'should have DateFrom');
        assert.equal(education.get('dateTo'), null, 'should have null DateTo');
        assert.equal(education.get('dateRange'), '2015 - system.literal.Present', 'should be in proper format');

        // CASE #5: from year, to year
        education.set('from_month', null);
        education.set('from_year', 2015);
        education.set('to_month', null);
        education.set('to_year', 2016);
        assert.equal(education.get('dateFrom'), '2015', 'should have DateFrom');
        assert.equal(education.get('dateTo'), '2016', 'should have DateTo');
        assert.equal(education.get('dateRange'), '2015 - 2016', 'should be in proper format');

        // CASE #6: from year, to month & year
        education.set('from_month', null);
        education.set('from_year', 2015);
        education.set('to_month', 11);
        education.set('to_year', 2016);
        assert.equal(education.get('dateFrom'), '2015', 'should have DateFrom');
        assert.equal(education.get('dateTo'), 'system.monthname.11 2016', 'should have DateTo');
        assert.equal(education.get('dateRange'), '2015 - system.monthname.11 2016', 'should be in proper format');

        // CASE #7: from month & year, empty to
        education.set('from_month', 10);
        education.set('from_year', 2015);
        education.set('to_month', null);
        education.set('to_year', null);
        assert.equal(education.get('dateFrom'), 'system.monthname.10 2015', 'should have DateFrom');
        assert.equal(education.get('dateTo'), null, 'should have null DateTo');
        assert.equal(education.get('dateRange'), 'system.monthname.10 2015 - system.literal.Present', 'should be in proper format');

        // CASE #8: from month & year, to year
        education.set('from_month', 9);
        education.set('from_year', 2015);
        education.set('to_month', null);
        education.set('to_year', 2016);
        assert.equal(education.get('dateFrom'), 'system.monthname.9 2015', 'should have DateFrom');
        assert.equal(education.get('dateTo'), '2016', 'should have DateTo');
        assert.equal(education.get('dateRange'), 'system.monthname.9 2015 - 2016', 'should be in proper format');

        // CASE #9: from month & year, to month & year
        education.set('from_month', 8);
        education.set('from_year', 2015);
        education.set('to_month', 7);
        education.set('to_year', 2016);
        assert.equal(education.get('dateFrom'), 'system.monthname.8 2015', 'should have DateFrom');
        assert.equal(education.get('dateTo'), 'system.monthname.7 2016', 'should have DateTo');
        assert.equal(education.get('dateRange'), 'system.monthname.8 2015 - system.monthname.7 2016', 'should be in proper format');
    });
});
