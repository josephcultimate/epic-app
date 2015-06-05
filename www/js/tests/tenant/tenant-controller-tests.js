moduleFor('controller:tenant', 'Controller/Tenant', {
    setup: function() {
        // Additional setup code here
        JsHamcrest.Integration.QUnit();
        JsMockito.Integration.QUnit();
    },
    teardown: function() {
        $.mockjax.clear();
        translationMock();
    }
});

test('Should_be_able_to_disable_tenant', function(assert) {
    assert.expect(1);
    var dateCreated = new Date();

    var response = new Object({
        message: 'Disabled'
    });

    var jsonResponse = JSON.stringify(response);

    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
        resolve(jsonResponse);
    });

    var expectedTenant = mock(DS.Model);
    when(expectedTenant).get('id').thenReturn('f7985a16-d966-4867-6d82-47ccb5ab3ca8');
    when(expectedTenant).get('name').thenReturn('Test Tenant');
    when(expectedTenant).get('alias').thenReturn('TEST');
    when(expectedTenant).get('preferred_locale').thenReturn('en-US');
    when(expectedTenant).get('enabled').thenReturn(false);
    when(expectedTenant).get('created_at').thenReturn(dateCreated);
    when(expectedTenant).set('enabled', false);
    when(expectedTenant).save().thenReturn(promise);

    var controller = this.subject();
    controller.transitionToRoute = Ember.K;

    var mockedFunc = mockFunction();
    var mockedController = mock(App.TenantController);
    when(mockedFunc).call(mockedController._enable(expectedTenant, false), anything()).thenReturn(promise);
    when(mockedFunc).call(mockedController.set('errorMessage', null), anything());
    when(mockedFunc).call(mockedController.transitionToRoute('tenants'), anything());

    var store = mock(DS.Store);
    controller.set('store', store);
    controller.set('model', expectedTenant);

    assert.deepEqual(controller.get('model'), expectedTenant);

    controller.send('disable', expectedTenant);

    verify(mockedController, times(1))._enable(expectedTenant, false);
    verify(mockedController, times(1)).set('errorMessage', null);
    verify(expectedTenant, times(1)).set('enabled', false);
    verify(expectedTenant, times(1)).save();
    verify(mockedController, times(1)).transitionToRoute('tenants');
});

test('Should_not_be_able_to_disable_tenant', function(assert) {
    assert.expect(1);
    var dateCreated = new Date();

    var error = new Object({
        message: 'Unable to disable tenant'
    });

    var response = new Object({
        error: error
    });

    var data = {
        responseJSON: response
    };

    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
        reject(data);
    });

    var expectedTenant = mock(DS.Model);
    when(expectedTenant).get('id').thenReturn('f7985a16-d966-4867-6d82-47ccb5ab3ca8');
    when(expectedTenant).get('name').thenReturn('Test Tenant');
    when(expectedTenant).get('alias').thenReturn('TEST');
    when(expectedTenant).get('preferred_locale').thenReturn('en-US');
    when(expectedTenant).get('enabled').thenReturn(false);
    when(expectedTenant).get('created_at').thenReturn(dateCreated);
    when(expectedTenant).set('enabled', false);
    when(expectedTenant).save().thenReturn(promise);

    var controller = this.subject();
    controller.transitionToRoute = Ember.K;

    var mockedFunc = mockFunction();
    var mockedController = mock(App.TenantController);

    when(mockedFunc).call(mockedController._enable(expectedTenant, false), anything()).thenReturn(promise);
    when(mockedFunc).call(mockedController.set('errorMessage', null), anything());
    when(mockedFunc).call(mockedController.set('errorMessage', response.error.message), anything());

    var store = mock(DS.Store);
    controller.set('store', store);
    controller.set('model', expectedTenant);

    assert.deepEqual(controller.get('model'), expectedTenant);

    controller.send('disable', expectedTenant);

    verify(mockedController, times(1))._enable(expectedTenant, false);
    verify(mockedController, times(1)).set('errorMessage', null);
    verify(expectedTenant, times(1)).set('enabled', false);
    verify(expectedTenant, times(1)).save();
    verify(mockedController, times(1)).set('errorMessage', response.error.message);
});

test('Should_be_able_to_enable_tenant', function(assert) {
    assert.expect(1);
    var dateCreated = new Date();

    var response = new Object({
        message: 'Enabled'
    });

    var jsonResponse = JSON.stringify(response);

    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
        resolve(jsonResponse);
    });

    var expectedTenant = mock(DS.Model);
    when(expectedTenant).get('id').thenReturn('f7985a16-d966-4867-6d82-47ccb5ab3ca8');
    when(expectedTenant).get('name').thenReturn('Test Tenant');
    when(expectedTenant).get('alias').thenReturn('TEST');
    when(expectedTenant).get('preferred_locale').thenReturn('en-US');
    when(expectedTenant).get('enabled').thenReturn(true);
    when(expectedTenant).get('created_at').thenReturn(dateCreated);
    when(expectedTenant).set('enabled', true);
    when(expectedTenant).save().thenReturn(promise);

    var controller = this.subject();
    controller.transitionToRoute = Ember.K;

    var mockedFunc = mockFunction();
    var mockedController = mock(App.TenantController);
    when(mockedFunc).call(mockedController._enable(expectedTenant, true), anything()).thenReturn(promise);
    when(mockedFunc).call(mockedController.set('errorMessage', null), anything());
    when(mockedFunc).call(mockedController.transitionToRoute('tenants'), anything());

    var store = mock(DS.Store);
    controller.set('store', store);
    controller.set('model', expectedTenant);

    assert.deepEqual(controller.get('model'), expectedTenant);

    controller.send('enable', expectedTenant);

    verify(mockedController, times(1))._enable(expectedTenant, true);
    verify(mockedController, times(1)).set('errorMessage', null);
    verify(expectedTenant, times(1)).set('enabled', true);
    verify(expectedTenant, times(1)).save();
    verify(mockedController, times(1)).transitionToRoute('tenants');
});

test('Should_not_be_able_to_enable_tenant', function(assert) {
    assert.expect(1);
    var dateCreated = new Date();

    var error = new Object({
        message: 'Unable to enable tenant'
    });

    var response = new Object({
        error: error
    });

    var data = {
        responseJSON: response
    };

    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
        reject(data);
    });

    var expectedTenant = mock(DS.Model);
    when(expectedTenant).get('id').thenReturn('f7985a16-d966-4867-6d82-47ccb5ab3ca8');
    when(expectedTenant).get('name').thenReturn('Test Tenant');
    when(expectedTenant).get('alias').thenReturn('TEST');
    when(expectedTenant).get('preferred_locale').thenReturn('en-US');
    when(expectedTenant).get('enabled').thenReturn(true);
    when(expectedTenant).get('created_at').thenReturn(dateCreated);
    when(expectedTenant).set('enabled', true);
    when(expectedTenant).save().thenReturn(promise);

    var controller = this.subject();
    controller.transitionToRoute = Ember.K;

    var mockedFunc = mockFunction();
    var mockedController = mock(App.TenantController);

    when(mockedFunc).call(mockedController._enable(expectedTenant, true), anything()).thenReturn(promise);
    when(mockedFunc).call(mockedController.set('errorMessage', null), anything());
    when(mockedFunc).call(mockedController.set('errorMessage', response.error.message), anything());

    var store = mock(DS.Store);
    controller.set('store', store);
    controller.set('model', expectedTenant);

    assert.deepEqual(controller.get('model'), expectedTenant);

    controller.send('enable', expectedTenant);

    verify(mockedController, times(1))._enable(expectedTenant, true);
    verify(mockedController, times(1)).set('errorMessage', null);
    verify(expectedTenant, times(1)).set('enabled', true);
    verify(expectedTenant, times(1)).save();
    verify(mockedController, times(1)).set('errorMessage', response.error.message);
});