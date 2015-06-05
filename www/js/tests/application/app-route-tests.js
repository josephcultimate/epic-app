moduleFor('route:application', 'Route/Application', {
});

test('Should clear session_token on logout', function(assert) {
    assert.expect(3);

    var actualRoute = null;
    var expectedRoute = 'employees';

    var sessionToken = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJSb2xlIjo1LCJVc2VyIjoidGVzdCIsImV4cCI6MTQyNDI3ODUyNn0.S4QQif1zfR9ZFn2sCcxfzEK9dDOGX9NVQ2cYpO5mPJE6dEKsDQkBl7RPszCv-5sXiSi_snh3QlSqedsO831UdTQGLbrdZBtiER9yWmPSlo2DGvsBLWur91xvVBE3kASRph9OB2RNdWR0bGhVagjh-BoI6gi2IoV9U6hCehBlHuA';

    App.setSessionToken(sessionToken);
    assert.equal(App.get("session_token"), sessionToken);

    var route = this.subject();
    route.transitionTo = function(route) {
        actualRoute = route;
    };

    route.send("logout");

    assert.equal(App.get("session_token"), null);
    assert.equal(actualRoute, expectedRoute);
});