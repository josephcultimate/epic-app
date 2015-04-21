moduleFor('route:application', 'Route/Application', {
    appSetSessionToken: function(token) {
        Ember.run(function() { App.set("session_token", token); });
    },

    setup: function() {
        // Additional setup code here

        this.appSetSessionToken(null);

        App.setSessionToken = this.appSetSessionToken;

        JsHamcrest.Integration.QUnit();
        JsMockito.Integration.QUnit();
    },

    teardown: function() {
        App.setSessionToken = App.defaultSetSessionToken;
    }
});

test('Should_clear_session_token_on_logout', function(assert) {
    assert.expect(2);

    var route = this.subject();
    route.transitionTo = Ember.K;

    var sessionToken = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJSb2xlIjo1LCJVc2VyIjoidGVzdCIsImV4cCI6MTQyNDI3ODUyNn0.S4QQif1zfR9ZFn2sCcxfzEK9dDOGX9NVQ2cYpO5mPJE6dEKsDQkBl7RPszCv-5sXiSi_snh3QlSqedsO831UdTQGLbrdZBtiER9yWmPSlo2DGvsBLWur91xvVBE3kASRph9OB2RNdWR0bGhVagjh-BoI6gi2IoV9U6hCehBlHuA';

    var mockedApp = mock(App);
    when(mockedApp).get('session_token').thenReturn(sessionToken);

    var mockedFunc = mockFunction();
    when(mockedFunc).call(mockedApp.set('session_token', sessionToken), anything());

    App.setSessionToken(sessionToken);

    verify(mockedApp, times(1)).set('session_token', sessionToken);

    assert.equal(mockedApp.get("session_token"), sessionToken);

    when(mockedApp).get('session_token').thenReturn(null);
    route.send("logout");

    assert.equal(mockedApp.get("session_token"), null);
});
