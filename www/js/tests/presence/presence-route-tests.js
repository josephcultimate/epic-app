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
    assert.expect(2);

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

    var sessionToken = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJSb2xlIjo1LCJVc2VyIjoidGVzdCIsImV4cCI6MTQyNDI3ODUyNn0.S4QQif1zfR9ZFn2sCcxfzEK9dDOGX9NVQ2cYpO5mPJE6dEKsDQkBl7RPszCv-5sXiSi_snh3QlSqedsO831UdTQGLbrdZBtiER9yWmPSlo2DGvsBLWur91xvVBE3kASRph9OB2RNdWR0bGhVagjh-BoI6gi2IoV9U6hCehBlHuA';

    var route = this.subject();
    route.set('store', store);

    Ember.run(function() {
        // pretend we just logged in
        App.setSessionToken(sessionToken);

        var controller = mock(Ember.Controller);
        route.setupController(controller, presence);

        assert.equal(App.get('presence'), presence, 'Route.setupController sets App presence correctly.');
        assert.equal(App.get('user'), presence, 'Route.setupController sets App user correctly.');
    });
});
