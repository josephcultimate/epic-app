moduleFor('route:person', 'Route/SignIn', {
    setup: function() {
        JsHamcrest.Integration.QUnit();
        JsMockito.Integration.QUnit();
    },
    teardown: function() {
        $.mockjax.clear();
        translationMock();
    }
});

test('Should_set_model', function(assert) {
    var people = GetPeepsHelper();

    var store = mock(DS.Store);
    when(store).fetchAll('person').thenReturn(people);

    var route = this.subject();
    route.set('store', store);

    route.model();

    verify(store, times(1)).fetchAll('person');
    assert.deepEqual(people,store.fetchAll('person'));
});

test('Should_render_template', function(assert) {
    assert.expect(0);

    var route = this.subject();
    route.render = function(route, options){};

    var mockedController = mock(Ember.Controller);
    var options = {
        controller: mockedController
    };

    var mockedFunc = mockFunction();

    var mockedPersonRoute = mock(App.PersonRoute);
    when(mockedFunc).call(mockedPersonRoute.render('persons/index', options), anything());
    route.renderTemplate(mockedController);
    verify(mockedPersonRoute, times(1)).render('persons/index', options);
});

test('Should_setup_controller', function(assert) {
    assert.expect(0);

    var people = GetPeepsHelper();

    var mockedController = mock(App.PersonController);

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

test('should_filter_by_role', function(assert) {
    var people = GetPeepsHelper();
    var route = this.subject();
    var store = mock(DS.Store);

    route.set('store', store);

    when(store).filter('person').thenReturn(people[0]);
    assert.ok(route._filterByRole(1));

    when(store).filter('person').thenReturn(people[1]);
    assert.ok(route._filterByRole(2));

    when(store).filter('person').thenReturn(people[2]);
    assert.ok(route._filterByRole(4));

    when(store).filter('person').thenReturn(people[3]);
    assert.ok(route._filterByRole(8));
});

test('should_filter_by_role_callback', function(assert) {

    var route = this.subject();

    for (var i = 1; i < 16; i++) {

        var cb = route._getFilterCallback(i);

        var pass = mock(App.Person);
        when(pass).get('roles').thenReturn(i);

        var fail = mock(App.Person);
        when(fail).get('roles').thenReturn(0);

        assert.equal(cb(pass), true);
        assert.equal(cb(fail), false);
    }
});

test('should_filterByRoleHelper', function(assert){
    var people = GetPeepsHelper();

    var route = this.subject();

    assert.ok(route._filterByRoleHelper(people[0],1));
    assert.ok(route._filterByRoleHelper(people[1],2));
    assert.ok(route._filterByRoleHelper(people[2],4));
    assert.ok(route._filterByRoleHelper(people[3],8));
});

function GetPeepsHelper(){
    var dateCreated = new Date();

    var peep1 = mock(App.Person);
    when(peep1).get('id').thenReturn('f7985a16-d966-4867-6d82-47ccb5ab3ca8');
    when(peep1).get('first_name').thenReturn('Empoloyee');
    when(peep1).get('roles').thenReturn(1);
    when(peep1).get('created_at').thenReturn(dateCreated);

    var peep2 = mock(App.Person);
    when(peep2).get('id').thenReturn('g7985a16-d966-4867-6d82-47ccb5ab3ca8');
    when(peep2).get('first_name').thenReturn('Manager');
    when(peep2).get('roles').thenReturn(2);
    when(peep2).get('created_at').thenReturn(dateCreated);

    var peep3 = mock(App.Person);
    when(peep3).get('id').thenReturn('h7985a16-d966-4867-6d82-47ccb5ab3ca8');
    when(peep3).get('first_name').thenReturn('Administrator');
    when(peep3).get('roles').thenReturn(4);
    when(peep3).get('created_at').thenReturn(dateCreated);

    var peep4 = mock(App.Person);
    when(peep4).get('id').thenReturn('i7985a16-d966-4867-6d82-47ccb5ab3ca8');
    when(peep4).get('first_name').thenReturn('SystemAdmin');
    when(peep4).get('roles').thenReturn(8);
    when(peep4).get('created_at').thenReturn(dateCreated);

    return  [peep1, peep2, peep3, peep4];
}