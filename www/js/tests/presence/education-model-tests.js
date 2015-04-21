moduleForModel('education', 'Model/Education', {
    setup: function() {
    },

    teardown: function() {
        $.mockjax.clear();
        translationMock();
    }
});

test('Should_return_when_level_has_text', function(assert) {
    var education = this.subject();

    Ember.run(function() {
        education.set('level', 'mock_education_level');
        assert.equal(education.get('hasLevel'), true, 'hasLevel is true when level contains text.');

        education.set('level', '');
        assert.equal(education.get('hasLevel'), false, 'hasLevel is false when level does not contain text.');
    });
});

test('Should_return_when_major_has_text', function(assert) {
    var education = this.subject();

    Ember.run(function() {
        education.set('major', 'mock_education_major');
        assert.equal(education.get('hasMajor'), true, 'hasMajor is true when major contains text.');

        education.set('major', '');
        assert.equal(education.get('hasMajor'), false, 'hasMajor is false when major does not contain text.');
    });
});

test('Should_return_when_minor_has_text', function(assert) {
    var education = this.subject();

    Ember.run(function() {
        education.set('minor', 'mock_education_minor');
        assert.equal(education.get('hasMinor'), true, 'hasMinor is true when minor contains text.');

        education.set('minor', '');
        assert.equal(education.get('hasMinor'), false, 'hasMinor is false when minor does not contain text.');
    });
});

test('Should_return_specialization_all_fields', function(assert) {
    var education = this.subject();
    var minorPrefix = 'Minor in ';
    Ember.run(function() {
        education.set('level', 'level');
        education.set('major', 'major');
        education.set('minor', 'minor');
        assert.equal(education.get('specialization'), 'level, major, '+minorPrefix+'minor', 'specialization contains level, major, and minor');

        education.set('level', '');
        education.set('major', 'major');
        education.set('minor', 'minor');
        assert.equal(education.get('specialization'), 'major, '+minorPrefix+'minor', 'specialization contains major and minor');

        education.set('level', '');
        education.set('major', 'major');
        education.set('minor', '');
        assert.equal(education.get('specialization'), 'major', 'specialization contains major');

        education.set('level', '');
        education.set('major', '');
        education.set('minor', 'minor');
        assert.equal(education.get('specialization'), minorPrefix+'minor', 'specialization contains minor');

        education.set('level', 'level');
        education.set('major', 'major');
        education.set('minor', '');
        assert.equal(education.get('specialization'), 'level, major', 'specialization contains level and major');

        education.set('level', 'level');
        education.set('major', '');
        education.set('minor', 'minor');
        assert.equal(education.get('specialization'), 'level, '+minorPrefix+'minor', 'specialization contains level and minor');
    });
});
