var appAdapter;
var personAdapter;

module('Application Tests', {
    setup: function () {
        appAdapter = App.ApplicationAdapter.create();
        personAdapter = App.PersonAdapter.create();
        App.overrideLocaleIfTesting = function () {
            Ember.I18n.locale = 'en-us';
        };
    },
    teardown: function () {
        $.mockjax.clear();
        App.overrideLocaleIfTesting = function () { };
    }
});

test('Should_return_undefined_when_trim_string_value_is_undefined', function(assert) {
   assert.expect(1);

    var myString;

    Ember.run(function() {
        var trimmed = App.trimString(myString);

        assert.equal(trimmed, undefined);
    });
});

test('Should_return_undefined_when_trim_string_value_is_null', function(assert) {
    assert.expect(1);

    var myString = null;

    Ember.run(function() {
        var trimmed = App.trimString(myString);

        assert.equal(trimmed, undefined);
    });
});

test('Should_return_string_without_leading_or_trailing_whitespaces', function(assert) {
   assert.expect(3);

    var string1 = '   test';
    var string2 = 'test   ';
    var string3 = '   test   ';

    Ember.run(function() {
        var trimmed1 = App.trimString(string1);
        assert.equal(trimmed1, 'test');

        var trimmed2 = App.trimString(string2);
        assert.equal(trimmed2, 'test');

        var trimmed3 = App.trimString(string3);
        assert.equal(trimmed3, 'test');
    });
});

test('Should_return_undefined_promise_when_post_request_is_undefined', function(assert) {
    assert.expect(1);

    assert.raises(function() {
        App.post(undefined);
    }, Error, 'Must throw error to pass');
});

test('Should_return_undefined_promise_when_post_request_is_null', function(assert) {
   assert.expect(1);

    assert.raises(function() {
        App.post(null);
    }, Error, 'Must throw error to pass');
});

test('Should_return_undefined_promise_when_post_request_endpointRoute_is_undefined', function(assert) {
    assert.expect(1);

    assert.raises(function() {
        var postRequest = App.PostRequest.create({
           endpointRoute: undefined,
            data: undefined
        });

        App.post(postRequest);
    }, Error, 'Must throw error to pass');
});

test('Should_return_undefined_promise_when_post_request_endpointRoute_is_null', function(assert) {
    assert.expect(1);

    assert.raises(function() {
        var postRequest = App.PostRequest.create({
            endpointRoute: null,
            data: undefined
        });

        App.post(postRequest);
    }, Error, 'Must throw error to pass');
});

test('Should_return_resolved_promise', function(assert) {
    assert.expect(1);

    var data = {
      username: 'test'
    };

    var postRequest = App.PostRequest.create({
       endpointRoute: '/test',
        data: JSON.stringify(data)
    });

    var response = new Object({
        error: null
    });

    var jsonRequest = JSON.stringify(data);
    var jsonResponse = JSON.stringify(response);

    mockServerCalls('/test', 200, jsonRequest, jsonResponse);

    assert.will(App.post(postRequest));
});

test('Should_return_rejected_promise', function(assert) {
    assert.expect(1);

    var data = {
        username: 'test'
    };

    var postRequest = App.PostRequest.create({
        endpointRoute: '/test',
        data: JSON.stringify(data)
    });

    var response = new Object({
        error: null
    });

    var jsonRequest = JSON.stringify(data);
    var jsonResponse = JSON.stringify(response);

    mockServerCalls('/test', 400, jsonRequest, jsonResponse);

    assert.wont(App.post(postRequest));
});

test('Should load test translations', function (assert) {
    assert.expect(1);

    var promise = null;

    Ember.run(function () {
        translationMock();
        promise = App.initializeLocalization(Ember.I18n.locale, App, true);
    });

    assert.ok(promise);

    promise.then(function (data) {
        assert.equal(data.test, 'for verification');
    });
});

test('Should set default locale on missing window.navigator', function (assert) {
    assert.expect(1);

    oldGetBrowserLocale  = App.getBrowserLocale;
    App.getBrowserLocale = function() { return undefined; };

    App.setDefaultLocale();

    assert.equal(Ember.I18n.locale, 'en-US');

    App.getBrowserLocale = oldGetBrowserLocale;
});

test('Should load fallback test translations', function (assert) {
    assert.expect(1);

    var promise = null;

    Ember.run(function () {
        translationMockFail('demian');
        translationMock();
        promise = App.initializeLocalization('demian', App, true);
    });

    assert.ok(promise);

    promise.then(function (data) {
        assert.equal(data.test, 'for verification');
    });
});

test('Should_respond_with_test_HTML_template', function(assert) {
    assert.expect(1);

    var template = { name: 'test', path: 'js/tests/application/test.hbs' };

    $.mockjax({
        url: 'js/tests/application/test.hbs',
        type: 'GET',
        status: 200,
        responseText: '<b>Test</b>'
    });

    assert.will(App.compileTemplate(template), '<b>Test</b>');
});

test('Should_retrieve_default_adapter_headers', function(assert) {
    assert.expect(2);

    var expected = App.defaultHeaders();

    assert.deepEqual(appAdapter.get('headers'), expected);
    assert.deepEqual(personAdapter.get('headers'), expected);
});

test('Should_default_session_token_setter_works', function(assert) {
    assert.expect(1);

    //App.reset();

    var expected = 'foo';
    App.setSessionToken(expected);

    assert.equal(App.get('session_token'), expected);
});

test('Should_return_mailTo_link', function(assert) {
    assert.expect(1);

    var input = 'dev-epic@ultimatesoftware.com';
    var expected = 'href="mailTo:dev-epic@ultimatesoftware.com"';

    assert.equal(App.returnSafeMailToHref(input).toString(), expected);
});

test('Should_return_telTo_link', function(assert) {
    assert.expect(1);

    var input = '(716)512-3343';
    var expected = 'href="tel:(716)512-3343"';

    assert.equal(App.returnSafeTelHref(input).toString(), expected);
});
