moduleFor('controller:tenants.create', 'Controller/CreateTenant', {
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

test('Should_be_able_to_reset_fields', function(assert) {
    assert.expect(1);

    var tenant = mock(DS.Model.extend(Ember.Validations.Mixin));
    when(tenant).get('name').thenReturn('Test Tenant');
    when(tenant).get('alias').thenReturn('TEST');
    when(tenant).get('preferred_locale').thenReturn('en-US');

    var controller = this.subject();
    controller.set('tenant', tenant);

    var mockedFunc = mockFunction();
    var mockedController = mock(App.TenantsCreateController);

    when(tenant).set('name', null);
    when(tenant).set('alias', null);
    when(tenant).set('preferred_locale', null);
    when(mockedFunc).call(mockedController.set('errorMessage', null), anything());

    assert.deepEqual(controller.get('tenant'), tenant);

    controller.send('reset');

    verify(tenant, times(1)).set('name', null);
    verify(tenant, times(1)).set('alias', null);
    verify(tenant, times(1)).set('preferred_locale', null);
    verify(mockedController, times(1)).set('errorMessage', null);
});

test('Should_not_be_able_to_create_tenant_with_empty_name_and_alias_after_trimming_values', function(assert) {
    assert.expect(1);

    var tenant = mock(DS.Model.extend(Ember.Validations.Mixin));
    when(tenant).get('name').thenReturn('      ');
    when(tenant).get('alias').thenReturn('     ');
    when(tenant).get('preferred_locale').thenReturn('');
    when(tenant).get('errors.name').thenReturn('Name is required');
    when(tenant).get('errors.alias').thenReturn('Alias is required');

    var controller = this.subject();
    controller.set('tenant', tenant);

    var mockedFunc = mockFunction();
    var mockedController = mock(App.TenantsCreateController);
    var mockedApp = mock(App);

    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
        reject(null);
    });
    when(tenant).validate().thenReturn(promise);
    when(tenant).set('name', '');
    when(tenant).set('alias', '');
    when(tenant).set('preferred_locale', '');
    when(mockedFunc).call(mockedController.set('recordSaved', false), anything());
    when(mockedFunc).call(mockedController.set('errorMessage', null), anything());
    when(mockedFunc).call(mockedApp.trimString(tenant.get('name')), anything()).thenReturn('');
    when(mockedFunc).call(mockedApp.trimString(tenant.get('alias')), anything()).thenReturn('');
    when(mockedFunc).call(mockedApp.trimString(tenant.get('preferred_locale')), anything()).thenReturn('');
    when(mockedFunc).call(mockedController.set('errorMessage', tenant.get('errors.name') + " " + tenant.get('errors.alias')), anything());

    assert.deepEqual(controller.get('tenant'), tenant);

    controller.send('create');

    verify(mockedController, times(1)).set('recordSaved', false);
    verify(mockedController, times(1)).set('errorMessage', null);
    verify(mockedApp, times(1)).trimString(tenant.get('name'));
    verify(tenant, times(1)).set('name', '');
    verify(mockedApp, times(1)).trimString(tenant.get('alias'));
    verify(tenant, times(1)).set('alias', '');
    verify(mockedApp, times(1)).trimString(tenant.get('preferred_locale'));
    verify(tenant, times(1)).set('preferred_locale', '');
    verify(tenant, times(1)).validate();
    verify(mockedController, times(1)).set('errorMessage', tenant.get('errors.name') + " " + tenant.get('errors.alias'));
});

test('Should_be_able_to_create_tenant', function(assert) {
    assert.expect(1);

    var dateCreated = new Date();
    var tenant = mock(DS.Model.extend(Ember.Validations.Mixin));
    when(tenant).get('id').thenReturn('f7985a16-d966-4867-6d82-47ccb5ab3ca8');
    when(tenant).get('name').thenReturn('Test Tenant');
    when(tenant).get('alias').thenReturn('TEST');
    when(tenant).get('preferred_locale').thenReturn('en-US');
    when(tenant).get('created_at').thenReturn(dateCreated);
    when(tenant).set('enabled', false);

    var mockedFunc = mockFunction();
    var mockedController = mock(App.TenantsCreateController);
    var mockedApp = mock(App);

    var response = new Object({
        message: 'Created'
    });

    var jsonResponse = JSON.stringify(response);

    var validationPromise = new Ember.RSVP.Promise(function(resolve, reject) {
       resolve(null);
    });

    var savePromise = new Ember.RSVP.Promise(function(resolve, reject) {
       resolve(jsonResponse);
    });
    when(tenant).validate().thenReturn(validationPromise);
    when(tenant).save().thenReturn(savePromise);

    var controller = this.subject();
    controller.transitionToRoute = Ember.K;
    controller.set('tenant', tenant);

    var store = mock(DS.Store);
    controller.set('store', store);

    assert.deepEqual(controller.get('tenant'), tenant);

    when(tenant).set('name', tenant.get('name'));
    when(tenant).set('alias', tenant.get('alias'));
    when(tenant).set('preferred_locale', tenant.get('preferred_locale'));
    when(mockedFunc).call(mockedController.set('recordSaved', false), anything());
    when(mockedFunc).call(mockedController.set('errorMessage', null), anything());
    when(mockedFunc).call(mockedApp.trimString(tenant.get('name')), anything()).thenReturn(tenant.get('name'));
    when(mockedFunc).call(mockedApp.trimString(tenant.get('alias')), anything()).thenReturn(tenant.get('alias'));
    when(mockedFunc).call(mockedApp.trimString(tenant.get('preferred_locale')), anything()).thenReturn(tenant.get('preferred_locale'));
    when(mockedFunc).call(mockedController.set('name', null), anything());
    when(mockedFunc).call(mockedController.set('alias', null), anything());
    when(mockedFunc).call(mockedController.set('preferred_locale', null), anything());
    when(mockedFunc).call(mockedController.set('recordSaved', true), anything());
    when(mockedFunc).call(mockedController.transitionToRoute('tenants'), anything());

    Ember.run(function() {
        controller.send('create');
    });

    verify(mockedController, times(1)).set('recordSaved', false);
    verify(mockedController, times(1)).set('errorMessage', null);
    verify(mockedApp, times(1)).trimString(tenant.get('name'));
    verify(tenant, times(1)).set('name', tenant.get('name'));
    verify(mockedApp, times(1)).trimString(tenant.get('alias'));
    verify(tenant, times(1)).set('alias', tenant.get('alias'));
    verify(mockedApp, times(1)).trimString(tenant.get('preferred_locale'));
    verify(tenant, times(1)).set('preferred_locale', tenant.get('preferred_locale'));
    verify(tenant, times(1)).validate();
    verify(tenant, times(1)).save();
    verify(mockedController, times(1)).set('name', null);
    verify(mockedController, times(1)).set('alias', null);
    verify(mockedController, times(1)).set('preferred_locale', null);
    verify(mockedController, times(1)).set('recordSaved', true);
    verify(mockedController, times(1)).transitionToRoute('tenants');
});

test('Should_not_be_able_to_create_tenant', function(assert) {
    assert.expect(1);

    var dateCreated = new Date();
    var tenant = mock(DS.Model.extend(Ember.Validations.Mixin));
    when(tenant).get('id').thenReturn('f7985a16-d966-4867-6d82-47ccb5ab3ca8');
    when(tenant).get('name').thenReturn('Test Tenant');
    when(tenant).get('alias').thenReturn('TEST');
    when(tenant).get('preferred_locale').thenReturn('en-US');
    when(tenant).get('created_at').thenReturn(dateCreated);
    when(tenant).set('enabled', false);

    var mockedFunc = mockFunction();
    var mockedController = mock(App.TenantsCreateController);
    var mockedApp = mock(App);

    var error = new Object({
        message: 'Unable to create tenant'
    });

    var response = new Object({
        error: error
    });

    var data = {
        responseJSON: response
    };

    var validationPromise = new Ember.RSVP.Promise(function(resolve, reject) {
        resolve(null);
    });

    var savePromise = new Ember.RSVP.Promise(function(resolve, reject) {
        reject(data);
    });
    when(tenant).validate().thenReturn(validationPromise);
    when(tenant).save().thenReturn(savePromise);

    var controller = this.subject();
    controller.transitionToRoute = Ember.K;
    controller.set('tenant', tenant);

    var store = mock(DS.Store);
    controller.set('store', store);

    assert.deepEqual(controller.get('tenant'), tenant);

    when(tenant).set('name', tenant.get('name'));
    when(tenant).set('alias', tenant.get('alias'));
    when(tenant).set('preferred_locale', tenant.get('preferred_locale'));
    when(mockedFunc).call(mockedController.set('recordSaved', false), anything());
    when(mockedFunc).call(mockedController.set('errorMessage', null), anything());
    when(mockedFunc).call(mockedApp.trimString(tenant.get('name')), anything()).thenReturn(tenant.get('name'));
    when(mockedFunc).call(mockedApp.trimString(tenant.get('alias')), anything()).thenReturn(tenant.get('alias'));
    when(mockedFunc).call(mockedApp.trimString(tenant.get('preferred_locale')), anything()).thenReturn(tenant.get('preferred_locale'));
    when(mockedFunc).call(mockedController.set('errorMessage', response.error.message), anything());
    when(mockedFunc).call(mockedController.set('recordSaved', false), anything());

    Ember.run(function() {
        controller.send('create');
    });

    verify(mockedController, times(2)).set('recordSaved', false);
    verify(mockedController, times(1)).set('errorMessage', null);
    verify(mockedApp, times(1)).trimString(tenant.get('name'));
    verify(tenant, times(1)).set('name', tenant.get('name'));
    verify(mockedApp, times(1)).trimString(tenant.get('alias'));
    verify(tenant, times(1)).set('alias', tenant.get('alias'));
    verify(mockedApp, times(1)).trimString(tenant.get('preferred_locale'));
    verify(tenant, times(1)).set('preferred_locale', tenant.get('preferred_locale'));
    verify(tenant, times(1)).validate();
    verify(tenant, times(1)).save();
    verify(mockedController, times(1)).set('errorMessage', response.error.message);
});