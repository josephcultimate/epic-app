moduleFor('route:tenants.index', 'Route/Tenants Index', {
    setup: function() {
        // Additional setup code here
        JsHamcrest.Integration.QUnit();
        JsMockito.Integration.QUnit();
    },
    teardown: function() {
    }
});

test('Should_be_able_to_set_model', function(assert) {
    assert.expect(0);

    var dateCreated = new Date();

    var tenant1 = mock(DS.Model.extend(Ember.Validations.Mixin));
    when(tenant1).get('id').thenReturn('f7985a16-d966-4867-6d82-47ccb5ab3ca8');
    when(tenant1).get('name').thenReturn('Test Tenant');
    when(tenant1).get('alias').thenReturn('TEST');
    when(tenant1).get('preferred_locale').thenReturn('en-US');
    when(tenant1).get('created_at').thenReturn(dateCreated);

    var tenant2 = mock(DS.Model.extend(Ember.Validations.Mixin));
    when(tenant2).get('id').thenReturn('993fa11e-5496-462d-443d-88cab5ab3c11');
    when(tenant2).get('name').thenReturn('Test Tenant 2');
    when(tenant2).get('alias').thenReturn('TEST2');
    when(tenant2).get('preferred_locale').thenReturn('en-US');
    when(tenant2).get('created_at').thenReturn(dateCreated);

    var tenants = [
        tenant1, tenant2
    ];

    var route = this.subject();

    var mockedFunc = mockFunction();
    var mockedRoute = mock(App.TenantsIndexRoute);
    when(mockedFunc).call(mockedRoute.modelFor('tenants'), anything()).thenReturn(tenants);

    route.model();

    verify(mockedRoute, times(1)).modelFor('tenants');
});