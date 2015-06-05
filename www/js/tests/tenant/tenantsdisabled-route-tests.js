moduleFor('route:tenants.disabled', 'Route/Tenants Disabled', {
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
        tenant1
    ];

    var route = this.subject();
    var store = mock(DS.Store);
    when(store).filter('tenant', anything(tenant1)).thenReturn(tenants);

    route.set('store', store);

    route.model();

    verify(store, times(1)).filter('tenant', anything(tenant1));
});

test('Should_be_able_to_apply_filter', function(assert) {
    assert.expect(1);

    var dateCreated = new Date();

    var tenant1 = mock(DS.Model.extend(Ember.Validations.Mixin));
    when(tenant1).get('id').thenReturn('f7985a16-d966-4867-6d82-47ccb5ab3ca8');
    when(tenant1).get('name').thenReturn('Test Tenant');
    when(tenant1).get('alias').thenReturn('TEST');
    when(tenant1).get('preferred_locale').thenReturn('en-US');
    when(tenant1).get('created_at').thenReturn(dateCreated);
    when(tenant1).get('enabled').thenReturn(false);

    var route = this.subject();

    var result = route._applyFilter(tenant1);
    assert.ok(result);
});

test('Should_be_able_to_render_template', function(assert) {
    assert.expect(0);

    var route = this.subject();
    var mockedRoute = mock(App.TenantsDisabledRoute);
    // REMARKS: Stubbing render function on Route. We only care about the function being invoked - not about what Ember is doing internally.
    route.render = function(route, options){
    };

    var mockedController = mock(Ember.Controller);

    var options = {
        controller: mockedController
    };

    var mockedFunc = mockFunction();
    when(mockedFunc).call(mockedRoute.render('tenants/index', options), anything());

    route.renderTemplate(mockedController);

    verify(mockedRoute, times(1)).render('tenants/index', options);
});