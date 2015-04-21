moduleForModel('presence', 'Model/Presence', {
    needs: ['model:education', 'model:experience'],
    setup: function() {
    },

    teardown: function() {
        $.mockjax.clear();
        translationMock();
    }
});

test('Should_be_able_to_calculate_phone_link', function(assert) {

    // we expect 'N' asserts
    assert.expect(1);

    var numbersOnlyPhone = '1-800-448-5225';
    var numbersAlphaPhone = '1-800-HIT-JACK';

    var presence = this.subject({
        'id': 'mock_presence_id',
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

    assert.equal(presence.get('phone_number_link'), numbersOnlyPhone, 'Phone link returns all numeric.');
});

test('Should_return_empty_phone_link', function(assert) {

    // we expect 'N' asserts
    assert.expect(1);

    var presence = this.subject({
        'id': 'mock_presence_id',
        'first_name': 'mock_presence_first_name',
        'last_name': 'mock_presence_last_name',
        'email': 'mock_person_email',
        'position': 'mock_presence_position',
        'location': 'mock_presence_location',
        'picture': 'mock_presence_picture',
        'tenant_id': 'mock_presence_tenant_id',
        'tenant_name': 'mock_presence_tenant_name'
    });

    assert.equal(presence.get('phone_number_link'), "", 'Phone link is empty when the person phone is undefined.');
});

