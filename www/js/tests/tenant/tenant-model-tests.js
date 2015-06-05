moduleForModel('tenant', 'Model/Tenant', {
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

test('Model_should_exist', function(assert) {
    assert.expect(1);

    var model = this.subject();

    assert.ok(model);
});

test('Name_is_required', function(assert) {
    assert.expect(2);

    var tenant = this.subject({
        name: null,
        alias: 'TENANT',
        preferred_locale: 'en-US'
    });

    return tenant.validate().then(null,
            function() {
                assert.equal(tenant.get('name'), undefined);
                assert.ok(tenant.get('errors.name').length > 0);
            });
});

test('Name_is_too_short', function(assert) {
    assert.expect(2);

    var tenant = this.subject({
        name: 'FS',
        alias: 'TENANT',
        preferred_locale: 'en-US'
    });

    return tenant.validate().then(null,
            function() {
                assert.equal(tenant.get('name'), 'FS');

                // TODO: We are currently unable to load the localization files - resource not found
                assert.ok(tenant.get('errors.name').length > 0);
            });
});

test('Alias_is_required', function(assert) {
    assert.expect(2);

    var tenant = this.subject({
        name: 'My Tenant',
        alias: null,
        preferred_locale: 'en-US'
    });

    return tenant.validate().then(null,
            function() {
                assert.equal(tenant.get('alias'), undefined);

                // TODO: We are currently unable to load the localization files - resource not found
                assert.ok(tenant.get('errors.alias').length > 0);
            });
});

test('Name_alias_and_locale_were_provided', function(assert) {
    assert.expect(3);

    var tenant = this.subject({
        name: 'My Tenant',
        alias: 'TENANT',
        preferred_locale: 'en-US'
    });

    return tenant.validate().then(function() {
            assert.equal(tenant.get('name'), 'My Tenant');
            assert.equal(tenant.get('alias'), 'TENANT');
            assert.equal(tenant.get('preferred_locale'), 'en-US');
        }, null);
});

test('Should_return_correct_row_id', function(assert) {
    assert.expect(1);

    var expectedTenant = mock(App.Tenant);

    var tenant = this.subject();

    var mockedFunc = mockFunction();
    when(mockedFunc).call(expectedTenant.get('id'), anything()).thenReturn('f7985a16-d966-4867-6d82-47ccb5ab3ca8');

    var rowId = tenant.get('rowId');

    verify(expectedTenant, times(1)).get('id');

    assert.ok(rowId.indexOf('listItem_') > -1);
});

test('Should_return_correct_edit_id', function(assert) {
    assert.expect(1);

    var expectedTenant = mock(App.Tenant);

    var tenant = this.subject();

    var mockedFunc = mockFunction();
    when(mockedFunc).call(expectedTenant.get('id'), anything()).thenReturn('f7985a16-d966-4867-6d82-47ccb5ab3ca8');

    var rowId = tenant.get('editId');

    verify(expectedTenant, times(1)).get('id');

    assert.ok(rowId.indexOf('editTenant_') > -1);
});