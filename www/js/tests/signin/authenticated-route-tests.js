moduleFor('route:authenticated', 'Route/Authenticated', {
    setup: function() {
        // Additional setup code here
        JsHamcrest.Integration.QUnit();
        JsMockito.Integration.QUnit();
    },
    teardown: function() {
    }
});

test('Should_be_able_to_transition_on_error', function(assert) {
    assert.expect(0);
    var mockedController = mock(App.TenantsCreateController);

    var reason = mock(new Object({
        status: 401
    }));

    // REMARKS: Ember's documentation does not seem to have anything related to a Transition object.
    // Looking at the ember.js, the Transition object is an injected dependency but was not able to find
    // which class exactly was being injected. For now, I am creating my own object and stubbing the abort()
    // function which is invoked when intersecting a transition.
    var transition = mock(new Object({
        templateName: 'login',
        abort: function() {
            return Ember.K;
        }
    }));

    var route = this.subject();
    route.set('controller', mockedController);
    route.redirectToLogin = function(transition) {
        return anything();
    };

    var mockedRoute = mock(App.AuthenticatedRoute);

    var mockedFunc = mockFunction();
    when(mockedFunc).call(mockedRoute.redirectToLogin(transition), anything());

    route.send('error', reason, transition);

    verify(mockedRoute, times(1)).redirectToLogin(transition);
});

