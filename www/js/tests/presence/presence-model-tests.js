moduleForModel('presence', 'Model/Presence', {
    needs: ['model:certification', 'model:education', 'model:experience', 'model:skill', 'model:hobby'],
    setup: function() {
    },

    teardown: function() {
        $.mockjax.clear();
        translationMock();

        // NOTE: this guarantees that later tests do not get unexpected results; yes, it's that bad!
        App.set('presence', null);
        App.set('user', null);
    }
});

test('Should be able to calculate phone link', function(assert) {

    // we expect 'N' asserts
    assert.expect(2);

    // Website for converting phone number from alpha to numeric
    // http://www.csgnetwork.com/phonenumcvtrev.html
    var numbersOnlyPhone = '1-800-448-5225';
    var numbersAlphaPhone = '1-800-HIT-JACK';

    var presence = this.subject({
        'id': 'mock1',
        'first_name': 'mock_presence_first_name',
        'last_name': 'mock_presence_last_name',
        'email': 'mock_person_email',
        'phone_number': numbersAlphaPhone,
        'position': 'mock_presence_position',
        'location': 'mock_presence_location',
        'picture': 'mock_presence_picture',
        'tenant_id': 'mock_presence_tenant_id',
        'tenant_name': 'mock_presence_tenant_name'
    });

    assert.equal(presence.get('phone_number_link'), 'tel:' + numbersOnlyPhone, 'Phone link returns all numeric.');
    Ember.run(function () {
        presence.set('phone_number', '1-800-GSD-PDIS');
        App.set('presence', presence);
        assert.equal(presence.get('phone_number_link'), 'tel:1-800-473-7347', 'Phone link returns all numeric.');

    });
});

test('Should be able to calculate email link', function(assert) {

    // we expect 'N' asserts
    assert.expect(2);

    var presence = this.subject({
        'id': 'mock1',
        'first_name': 'mock_presence_first_name',
        'last_name': 'mock_presence_last_name',
        'email': 'my@email.com',
        'phone_number': '555-555-5555',
        'position': 'mock_presence_position',
        'location': 'mock_presence_location',
        'picture': 'mock_presence_picture',
        'tenant_id': 'mock_presence_tenant_id',
        'tenant_name': 'mock_presence_tenant_name'
    });

    assert.equal(presence.get('email_link').toString(), 'mailTo:my@email.com', 'Email link returns href.');
    Ember.run(function () {
        presence.set('email', 'another@email.com');
        App.set('presence', presence);
        assert.equal(presence.get('email_link').toString(), 'mailTo:another@email.com', 'Email link returns updated href.');

    });
});

test('Should return empty phone link', function(assert) {

    // we expect 'N' asserts
    assert.expect(1);

    var presence = this.subject({
        'id': 'mock2',
        'first_name': 'mock_presence_first_name',
        'last_name': 'mock_presence_last_name',
        'email': 'mock_person_email',
        'position': 'mock_presence_position',
        'location': 'mock_presence_location',
        'picture': 'mock_presence_picture',
        'tenant_id': 'mock_presence_tenant_id',
        'tenant_name': 'mock_presence_tenant_name'
    });

    assert.equal(presence.get('phone_number_link'), "tel:", 'Phone link is empty when the person phone is undefined.');
});

test('Should check matching user and presence', function(assert) {

    // we expect 'N' asserts
    assert.expect(1);

    var presence = this.subject({
        'id': 'mock3',
        'first_name': 'mock_presence_first_name',
        'last_name': 'mock_presence_last_name',
        'email': 'mock_person_email',
        'position': 'mock_presence_position',
        'location': 'mock_presence_location',
        'picture': 'mock_presence_picture',
        'tenant_id': 'mock_presence_tenant_id',
        'tenant_name': 'mock_presence_tenant_name'
    });

    App.set('presence', presence);
    App.set('user', presence);

    assert.equal(presence.get('matchingUserAndPresence'), true, 'User and presence should match.');
});
