moduleFor('route:catchAll', 'Route/Application CatchAll', {
    setup: function() {
        JsMockito.Integration.QUnit();
    }
});

test('Should redirect to the employees route when trying to transition to an unknown route', function(assert) {
    assert.expect(1);

    var actualRoute = null;
    var expectedRoute = 'employees';

    var route = this.subject();
    route.transitionTo = function(route) {
        actualRoute = route;
    };

    route.redirect();

    assert.equal(actualRoute, expectedRoute);
});
