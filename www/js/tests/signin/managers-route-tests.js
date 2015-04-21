moduleFor('route:managers', 'Route/SignIn Managers', {
    setup: function() {
        JsHamcrest.Integration.QUnit();
        JsMockito.Integration.QUnit();
    },
    teardown: function() {
        $.mockjax.clear();
        translationMock();
    }
});

test('Should_be_able_to_setup_controller', function(assert) {
    assert.expect(0);
    var dateCreated = new Date();

    var person1 = mock(App.Person);
    when(person1).get('id').thenReturn('f7985a16-d966-4867-6d82-47ccb5ab3ca8');
    when(person1).get('name').thenReturn('Test Person 1');
    when(person1).get('alias').thenReturn('TEST');
    when(person1).get('preferred_locale').thenReturn('en-US');
    when(person1).get('created_at').thenReturn(dateCreated);

    var person2 = mock(App.Person);
    when(person2).get('id').thenReturn('993fa11e-5496-462d-443d-88cab5ab3c11');
    when(person2).get('name').thenReturn('Test Person 2');
    when(person2).get('alias').thenReturn('TEST2');
    when(person2).get('preferred_locale').thenReturn('en-US');
    when(person2).get('created_at').thenReturn(dateCreated);

    var people = [
        person1, person2
    ];

    var mockedFunc = mockFunction();
    var mockedController = mock(App.ManagersController);

    var store = mock(DS.Store);
    when(store).filter('person').thenReturn(people);

    var route = this.subject();
    route.set('store', store);

    route.model(people);

    route.setupController(mockedController);

    verify(mockedController, times(1)).set('managers', people);
    verify(mockedController, times(1)).set('employeesadmins', people);
    verify(mockedController, times(1)).set('managersadmins', people);
    verify(mockedController, times(1)).set('employees', people);
});