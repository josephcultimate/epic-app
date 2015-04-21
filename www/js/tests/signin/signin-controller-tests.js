var postFunc;

moduleFor('controller:person', 'Controller/SignIn', {

    appSetSessionToken: function(token) {
        Ember.run(function() { App.set("session_token", token); });
    },

    setup: function() {

        postFunc = App.post;
        controller = this.subject();
        JsHamcrest.Integration.QUnit();
        JsMockito.Integration.QUnit();
        this.appSetSessionToken(null);

        App.setSessionToken = this.appSetSessionToken;
    },
    teardown: function() {  //for each test
        $.mockjax.clear();
        translationMock();
        App.setSessionToken = App.defaultSetSessionToken;
        App.post = postFunc;
    }
});

test('Controller_should_exist', function(assert) {
    var controller = this.subject();
    assert.ok(controller);
});

//test('Should_Fail_OnServerError', function(assert) {
//    var person = App.store.create({
//        username: 'test'
//    });
//
//    // REMARKS: When the controller is instantiated, the model hook of the route invokes the
//    // store.find function which causes the application to make an GET request to the server.
//    // Mocking the request before invoking this.subject solves the problem.
//    mockServerCalls('/u/people', 200, null, null, 'GET');
//    var controller = this.subject();
//    controller.transitionToRoute = Ember.K;
//    controller.set('login', person);
//
//    var jsonRequest = JSON.stringify(person.getProperties('username'));
//    var jsonResponse = JSON.stringify({
//        error: {
//            message: 'BOOM!'
//        }
//    });
//
//    mockServerCalls('/login', 500, jsonRequest, jsonResponse);
//
//    Ember.run(function() {
//        controller.send('linktoprofile', person);
//    });
//
//    $.mockjax({
//        url: '/'
//    });
//
//    visit('/');
//    andThen(function(app) {
//        assert.equal(controller.get('msg_warning'), 'BOOM!');
//    });
//});

//test('Check_Controller_linkToProfile', function(assert){
//
//    var person = App.store.create({
//        username: 'test',
//        id: 'IAmATestId'
//    });
//
//    var route, id;
//
//    // REMARKS: When the controller is instantiated, the model hook of the route invokes the
//    // store.find function which causes the application to make an GET request to the server.
//    // Mocking the request before invoking this.subject solves the problem.
//    mockServerCalls('/u/people', 200, null, null, 'GET');
//    var controller = this.subject();
//
//    var tempTransitionToRoute = controller.transitionToRoute;
//    controller.transitionToRoute = function(routeParam, idParam){
//        route = routeParam;
//        id = idParam;
//    };
//
//    controller.set('login', person);
//
//    var dummyToken = 'dummy';
//    var jsonRequest = JSON.stringify(person.getProperties('username'));
//    var jsonResponse = JSON.stringify({"session_token": dummyToken});
//
//    mockServerCalls('/login', 200, jsonRequest, jsonResponse);
//    Ember.run(function() {
//        controller._linkToProfile(person);
//    });
//
//    $.mockjax({
//        url: '/'
//    });
//
//    visit('/');
//    andThen(function(app) {
//        //Assert that transitionToRoute was called with the correct parameters
//        assert.equal(route, "profile");
//        assert.equal(id, "IAmATestId");
//
//        assert.equal(App.get('session_token'), dummyToken, 'LoginController.successfulLogin sets AppController.SessionToken.');
//
//        //Set the transitionToRoute back to the original
//        controller.transitionToRoute = tempTransitionToRoute;
//    });
//});

test('Check_Controller_Counts', function(assert) {
    var people = getPeopleHelper();

    // REMARKS: When the controller is instantiated, the model hook of the route invokes the
    // store.find function which causes the application to make an GET request to the server.
    // Mocking the request before invoking this.subject solves the problem.
    mockServerCalls('/u/people', 200, null, null, 'GET');
    var controller = this.subject();

    controller.set('model',people);

    controller.set('employees',people);
    assert.equal(people.length, controller.get('employees_count'));

    controller.set('managers',people);
    assert.equal(people.length, controller.get('managers_count'));

    controller.set('employeesadmins',people);
    assert.equal(people.length, controller.get('employeesadmins_count'));

    controller.set('managersadmins',people);
    assert.equal(people.length, controller.get('managersadmins_count'));

    assert.equal(controller.get('empty'), false);
});

test('Check_Controller_Sorts', function(assert) {

    var people = getPeopleHelper();

    // REMARKS: When the controller is instantiated, the model hook of the route invokes the
    // store.find function which causes the application to make an GET request to the server.
    // Mocking the request before invoking this.subject solves the problem.
    mockServerCalls('/u/people', 200, null, null, 'GET');
    var controller = this.subject();

    //*** sorted has a callback - it must complete before assert!!!
    var sorted_employees = [];
    var sorted_managers = [];
    var sorted_employeesadmins = [];
    var sorted_managersadmins = [];

    //*** sorted has a callback - it must complete before assert!!!
    Ember.run(function() {
        controller.set('employees',people);
        sorted_employees = controller.get('sortedEmployees');

        controller.set('managers',people);
        sorted_managers = controller.get('sortedManagers');

        controller.set('employeesadmins',people);
        sorted_employeesadmins = controller.get('sortedEmployeesAdmins');

        controller.set('managersadmins',people);
        sorted_managersadmins = controller.get('sortedManagersAdmins');
    });

    var expectedAsLastTestIdx = people.get('length')-1;
    var expectedAsLast ='f7985a16-d966-4867-6d82-47ccb5ab3ca8';

    assert.equal(sorted_employees[expectedAsLastTestIdx].get('id'), expectedAsLast);
    assert.equal(sorted_managers[expectedAsLastTestIdx].get('id'), expectedAsLast);
    assert.equal(sorted_employeesadmins[expectedAsLastTestIdx].get('id'), expectedAsLast);
    assert.equal(sorted_managersadmins[expectedAsLastTestIdx].get('id'), expectedAsLast);
});

test('Should_be_able_to_log_in_with_attempted_transition', function(assert) {

    assert.expect(2);
    var person = App.store.create({
        username: 'test',
        id: 'IAmATestId'
    });

    // REMARKS: When the controller is instantiated, the model hook of the route invokes the
    // store.find function which causes the application to make an GET request to the server.
    // Mocking the request before invoking this.subject solves the problem.
    mockServerCalls('/u/people', 200, null, null, 'GET');
    var controller = this.subject();
    controller.transitionToRoute = Ember.K;

    var transition = Ember.Object.create({
        targetName: 'tenants.index',
        retry: Ember.K
    });

    controller.set('attemptedTransition', transition);
    controller.set('login', person);

    var sessionToken = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJSb2xlIjo1LCJVc2VyIjoidGVzdCIsImV4cCI6MTQyNDI3ODUyNn0.S4QQif1zfR9ZFn2sCcxfzEK9dDOGX9NVQ2cYpO5mPJE6dEKsDQkBl7RPszCv-5sXiSi_snh3QlSqedsO831UdTQGLbrdZBtiER9yWmPSlo2DGvsBLWur91xvVBE3kASRph9OB2RNdWR0bGhVagjh-BoI6gi2IoV9U6hCehBlHuA';

    var response = new Object({
        session_token: sessionToken
    });

    var loginPromise = new Ember.RSVP.Promise(function(resolve, reject) {
       resolve(response);
    });

    // Override post method to return resolved promise
    App.post = function(){
      return loginPromise;
    };

    Ember.run(function() {
        controller._linkToProfile(person);
    });

    assert.equal(controller.get('errorMessage'), undefined);
    assert.equal(controller.get('attemptedTransition'), null);
});

function getPeopleHelper(){
    var person1 = App.store.create({
        id: '993fa11e-5496-462d-443d-88cab5ab3c11',
        first_name: 'Aardvark',
        last_name: 'Aardvark',
        hasFirstName: true
    });

    var person2 = App.store.create({
        id: 'f7985a16-d966-4867-6d82-47ccb5ab3ca8',
        first_name: 'Zebra',
        last_name: 'Zebra',
        hasFirstName: true
    });

    var person3 = App.store.create({
        id: '222fa11e-5496-462d-443d-88cab5ab3c11',
        first_name: 'Gregory',
        last_name: 'Gregory',
        hasFirstName: true
    });

    var person4 = App.store.create({
        id: '888fa11e-5496-462d-443d-88cab5ab3c11',
        first_name: 'Batman',
        last_name: 'Batman',
        hasFirstName: true
    });

    var person5 = App.store.create({
        id: '222fa11e-5496-462d-443d-88cab5ab3c11',
        first_name: 'Caveman',
        last_name: 'Caveman',
        hasFirstName: true
    });

    return [person1, person2, person3, person4, person5];
}
