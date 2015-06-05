moduleFor('controller:application', 'Controller/Application', {
    setup: function() {
        JsMockito.Integration.QUnit();
    }
});

test('Should set computed properties via session token', function(assert) {
    assert.expect(12);

    var sessionToken = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJSb2xlIjo1LCJVc2VyIjoidGVzdCIsImV4cCI6MTQyNDI3ODUyNn0.S4QQif1zfR9ZFn2sCcxfzEK9dDOGX9NVQ2cYpO5mPJE6dEKsDQkBl7RPszCv-5sXiSi_snh3QlSqedsO831UdTQGLbrdZBtiER9yWmPSlo2DGvsBLWur91xvVBE3kASRph9OB2RNdWR0bGhVagjh-BoI6gi2IoV9U6hCehBlHuA';

    var controller = this.subject();

    assert.equal(controller.get('isLogged'), false);
    assert.equal(controller.get('NavbarLoggedClass'), 'navbar navbar-ultipro navbar-fixed-top');
    assert.equal(controller.get('Presence'), null);
    assert.equal(controller.get('SessionToken'), null);
    assert.equal(controller.get('User'), null);
    assert.equal(controller.get('UserId'), null);

    App.set("session_token", sessionToken);

    assert.equal(controller.get('isLogged'), true);
    assert.equal(controller.get('NavbarLoggedClass'), 'navbar navbar-ultipro navbar-fixed-top xs-no-background');
    assert.equal(controller.get('Presence'), null);
    assert.equal(controller.get('SessionToken'), sessionToken);
    assert.equal(controller.get('User'), null);
    assert.equal(controller.get('UserId'), null);
});

test('Should transition to profile when transitionToProfile action is sent', function(assert) {
    assert.expect(2);

    var expectedRoute = 'profile';
    var expectedProfileId = 'profileId';

    var actualRoute = null;
    var actualProfileId = null;

    var controller = this.subject();

    controller.transitionToRoute = function(route, param1) {
        actualRoute = route;
        actualProfileId = param1;
    };

    Ember.run(function() {
        controller.send('transitionToProfile', 'profileId');
    });

    assert.equal(actualRoute, expectedRoute);
    assert.equal(actualProfileId, expectedProfileId);
});

test('Should transition to profile when transitionToUserProfile action is sent', function(assert) {
    assert.expect(2);

    var expectedProfileId = 'f7985a16-d966-4867-6d82-47ccb5ab3ca8';
    var expectedRoute = 'profile';

    var actualRoute = null;
    var actualProfileId = null;

    var mockUser = mock(App.Person);
    when(mockUser).get('id').thenReturn(expectedProfileId);

    App.set('user', mockUser);

    var controller = this.subject();

    controller.transitionToRoute = function(route, param1) {
        actualRoute = route;
        actualProfileId = param1;
    };

    Ember.run(function() {
        controller.send('transitionToUserProfile');
    });

    assert.equal(actualRoute, expectedRoute);
    assert.equal(actualProfileId, expectedProfileId);
});
