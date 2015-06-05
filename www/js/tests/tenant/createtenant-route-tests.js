moduleFor('route:tenants.create', 'Route/CreateTenant', {
    setup: function() {
        // Additional setup code here
        JsHamcrest.Integration.QUnit();
        JsMockito.Integration.QUnit();
    },
    teardown: function() {
    }
});

test('Should_be_able_to_setup_controller', function(assert) {
    assert.expect(0);
    var dateCreated = new Date();
    var tenant = mock(DS.Model.extend(Ember.Validations.Mixin));
    when(tenant).get('id').thenReturn('f7985a16-d966-4867-6d82-47ccb5ab3ca8');
    when(tenant).get('name').thenReturn('Test Tenant');
    when(tenant).get('alias').thenReturn('TEST');
    when(tenant).get('preferred_locale').thenReturn('en-US');
    when(tenant).get('enabled').thenReturn(false);
    when(tenant).get('created_at').thenReturn(dateCreated);

    var mockedFunc = mockFunction();
    var mockedController = mock(App.TenantsCreateController);

    var route = this.subject();

    when(mockedController).set('tenant', tenant);
    when(mockedController).set('recordSaved', false);
    when(mockedController).set('errorMessage', null);
    when(mockedController).send('reset');

    route.setupController(mockedController, tenant);

    verify(mockedController, times(1)).set('tenant', tenant);
    verify(mockedController, times(1)).set('recordSaved', false);
    verify(mockedController, times(1)).set('errorMessage', null);
    verify(mockedController, times(1)).send('reset');
});

test('Should_be_able_to_set_model', function(assert) {
   assert.expect(0);

    var dateCreated = new Date();
    var expectedTenant = mock(DS.Model.extend(Ember.Validations.Mixin));
    when(expectedTenant).get('enabled').thenReturn(true);
    when(expectedTenant).get('created_at').thenReturn(dateCreated);

    var store = mock(DS.Store);
    when(store).createRecord('tenant').thenReturn(expectedTenant);

    var route = this.subject();
    route.set('store', store);

    route.model();

    verify(store, times(1)).createRecord('tenant');
});

test('Should_be_able_to_abort_transition', function(assert) {
    assert.expect(0);
    var mockedController = mock(App.TenantsCreateController);
    when(mockedController).get('recordSaved').thenReturn(false);

    // REMARKS: Ember's documentation does not seem to have anything related to a Transition object. Looking at the ember.js, the Transition object is an injected dependency but was not able to find
    // which class exactly was being injected. For now, I am creating my own object and stubbing the abort() function which is invoked when intersecting a transition.
    var transition = mock(new Object({
       abort: function() {
           return Ember.K;
       }
    }));
    when(transition).abort();

    // REMARKS: Mock the window.confirm function to prevent prompt window
    window.confirm = function(confirmString) {
      return false;
    };

    var route = this.subject();
    route.set('controller', mockedController);

    var mockedFunc = mockFunction();
    when(mockedFunc).call(window.confirm('Are you sure you want to abandon progress?'), anything()).thenReturn(false);

    route.send('willTransition', transition);

    verify(transition, times(1)).abort();
});

test('Should_be_able_to_allow_transition', function(assert) {
    assert.expect(0);
    var dateCreated = new Date();
    var tenant = mock(DS.Model.extend(Ember.Validations.Mixin));
    when(tenant).get('name').thenReturn('Test Tenant');
    when(tenant).get('alias').thenReturn('TEST');
    when(tenant).get('preferred_locale').thenReturn('en-US');
    when(tenant).deleteRecord();

    var mockedController = mock(App.TenantsCreateController);
    when(mockedController).get('recordSaved').thenReturn(false);

    // REMARKS: Ember's documentation does not seem to have anything related to a Transition object. Looking at the ember.js, the Transition object is an injected dependency but was not able to find
    // which class exactly was being injected. For now, I am creating my own object and stubbing the abort() function which is invoked when intersecting a transition.
    var transition = mock(new Object({
        abort: function() {
            return Ember.K;
        }
    }));

    // REMARKS: Mock the window.confirm function to prevent prompt window
    window.confirm = function(confirmString) {
        return true;
    };

    var route = this.subject();
    route.set('controller', mockedController);
    route.set('currentModel', tenant);

    var mockedFunc = mockFunction();
    when(mockedFunc).call(window.confirm('Are you sure you want to abandon progress?'), anything()).thenReturn(true);

    route.send('willTransition', transition);

    verify(tenant, times(1)).deleteRecord();
});