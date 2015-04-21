moduleFor('controller:application', 'Controller/Application', {

    appSetSessionToken: function(token) {
        Ember.run(function() { App.set("session_token", token); });
    },

    setup: function() {
        controller = this.subject();
    },

    teardown: function() {
        App.setSessionToken = App.defaultSetSessionToken;
    }
});

test('Should_set_app_computed_properties_via_session_token', function(assert) {

    var sessionToken = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJSb2xlIjo1LCJVc2VyIjoidGVzdCIsImV4cCI6MTQyNDI3ODUyNn0.S4QQif1zfR9ZFn2sCcxfzEK9dDOGX9NVQ2cYpO5mPJE6dEKsDQkBl7RPszCv-5sXiSi_snh3QlSqedsO831UdTQGLbrdZBtiER9yWmPSlo2DGvsBLWur91xvVBE3kASRph9OB2RNdWR0bGhVagjh-BoI6gi2IoV9U6hCehBlHuA';

    var controller = this.subject();

    //App.reset();

    assert.equal(controller.get('SessionToken'), null);
    assert.equal(controller.get('NavbarLoggedClass'), 'navbar navbar-ultipro navbar-fixed-top');
    assert.equal(controller.get('presence'), null);

    App.set("session_token", sessionToken);

    assert.equal(controller.get('SessionToken'), sessionToken);
    assert.equal(controller.get('NavbarLoggedClass'), 'navbar navbar-ultipro navbar-fixed-top xs-no-background');
    assert.equal(controller.get('presence'), null);
});
