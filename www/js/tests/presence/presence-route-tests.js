moduleFor('route:profile', 'Route/Presence', {

    setup: function() {
        JsHamcrest.Integration.QUnit();
        JsMockito.Integration.QUnit();
    },

    teardown: function() {
        $.mockjax.clear();
        translationMock();
    }
});

test('Should_be_able_to_set_model', function(assert) {

    // we expect 'N' asserts
    assert.expect(1);

    var numbersOnlyPhone = '1-800-448-5225';
    var numbersAlphaPhone = '1-800-HIT-JACK';

    var presence = mock(DS.Model.extend(Ember.Validations.Mixin));
    when(presence).get('id').thenReturn('mock_presence_id');
    when(presence).get('first_name').thenReturn('mock_presence_first_name');
    when(presence).get('last_name').thenReturn('mock_presence_last_name');
    when(presence).get('person_email').thenReturn('mock_person_email');
    when(presence).get('person_phone').thenReturn(numbersAlphaPhone);
    when(presence).get('position').thenReturn('mock_presence_position');
    when(presence).get('location').thenReturn('mock_presence_location');
    when(presence).get('picture').thenReturn('mock_presence_picture');
    when(presence).get('tenant_id').thenReturn('mock_presence_tenant_id');
    when(presence).get('tenant_name').thenReturn('mock_presence_tenant_name');
    when(presence).get('about').thenReturn('mock_presence_about');

    var store = mock(DS.Store);
    when(store).fetchById('presence', presence.id).thenReturn(presence);

    var route = this.subject();
    route.set('store', store);

    var model = route.model({presence_id: presence.id});

    assert.equal(model, presence, 'Route returns the correct presence.');
});

test('Should_be_able_to_setup_controller', function(assert) {

    // we expect 'N' asserts
    assert.expect(1);

    var presence = mock(DS.Model.extend(Ember.Validations.Mixin));
    when(presence).get('id').thenReturn('mock_presence_id');
    when(presence).get('first_name').thenReturn('mock_presence_first_name');
    when(presence).get('last_name').thenReturn('mock_presence_last_name');
    when(presence).get('person_email').thenReturn('mock_person_email');
    when(presence).get('person_phone').thenReturn('mock_person_phone');
    when(presence).get('position').thenReturn('mock_presence_position');
    when(presence).get('location').thenReturn('mock_presence_location');
    when(presence).get('picture').thenReturn('mock_presence_picture');
    when(presence).get('tenant_id').thenReturn('mock_presence_tenant_id');
    when(presence).get('tenant_name').thenReturn('mock_presence_tenant_name');
    when(presence).get('about').thenReturn('mock_presence_about');

    var store = mock(DS.Store);
    when(store).find('presence', presence.id).thenReturn(presence);

    var route = this.subject();
    route.set('store', store);

    Ember.run(function() {
        var controller = mock(Ember.Controller);
        route.setupController(controller, presence);

        assert.equal(App.get('presence'), presence, 'Route.setupController sets App presence correctly.');
    });
});
