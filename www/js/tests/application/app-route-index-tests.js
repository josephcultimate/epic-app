moduleFor('route:index', 'Route/Application Index', {
});

test('Should redirect to the employees route when trying to transition to the index route', function(assert) {
    assert.expect(1);

    var actualRoute = null;
    var expectedRoute = 'employees';

    var route = this.subject();
    route.transitionTo = function(route) {
        actualRoute = route;
    };

    route.model({foo: "bar"});

    assert.equal(actualRoute, expectedRoute);
});
