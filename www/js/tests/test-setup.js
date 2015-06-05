Ember.testing = true;

App.rootElement = '#ember-testing';
App.setupForTesting();

/** DEFINE ANY CUSTOM TEST HELPERS BEFORE INVOKING App.injectTestHelpers() **/

App.injectTestHelpers();

setResolver(Ember.DefaultResolver.create({ namespace: App }));

$.mockjaxSettings.logging = false;
$.mockjaxSettings.responseTime = 0;

function translationMock() {
    stubEndpointForHttpRequest('./js/modules/translations/en-us.json', { 'test': 'for verification' }, 200);
}

function translationMockFail(i18n) {
    stubEndpointForHttpRequest('./js/modules/translations/' + i18n + '.json', { 'test': 'for verification' }, 404);
}

function stubEndpointForHttpRequest(url, json, responseStatus) {
    $.mockjax({
        url: url,
        dataType: 'json',
        responseText: json,
        status: responseStatus || 200
    });
}

function mockServerCalls(url, status, data, response, type) {
    if (type === undefined || type === null) {
        type = 'POST';
    }
    $.mockjax({
        url: App.apiHost + url,
        type: type,
        status: status,
        data: data,
        dataType: 'json',
        contentType: 'application/json',
        responseText: response
    });
}
