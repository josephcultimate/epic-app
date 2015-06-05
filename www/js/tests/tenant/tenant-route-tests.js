moduleFor('route:tenant', 'Route/Tenant', {
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

    var tenant = mock(DS.Model.extend(Ember.Validations.Mixin));
    when(tenant).get('id').thenReturn('f7985a16-d966-4867-6d82-47ccb5ab3ca8');
    when(tenant).get('name').thenReturn('Test Tenant');
    when(tenant).get('alias').thenReturn('TEST');
    when(tenant).get('preferred_locale').thenReturn('en-US');
    when(tenant).get('created_at').thenReturn(dateCreated);

    var params = {
      tenant_id: tenant.get('id')
    };

    var store = mock(DS.Store);
    when(store).fetchById('tenant', params.tenant_id).thenReturn(tenant);

    var route = this.subject();
    route.set('store', store);

    route.model(params);

    verify(store, times(1)).fetchById('tenant', params.tenant_id);
});