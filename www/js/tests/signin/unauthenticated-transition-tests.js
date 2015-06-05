//test('Should_transition_to_login_if_not_authenticated', function(assert) {
//
//    assert.expect(1);
//
//    Ember.run(function() {
//        App.setSessionToken(null);
//    });
//
//    mockServerCalls('/u/people', 200, null, null, 'GET');
//
//    visit('/presences/testId');
//    andThen(function(app) {
//        assert.ok(find('#signin_title'));
//    });
//});
