var App = Ember.Application.create({
});

/* Define application templates */
App.basepath = "js/modules/";
App.templates = [
    {name: 'components/form-input',         path: App.basepath + 'components.hbs'},
    {name: 'components/search-bar',         path: App.basepath + 'components/search.hbs'},
    {name: 'components/search-result',      path: App.basepath + 'components/searchResult.hbs'},
    {name: 'application',                   path: App.basepath + 'application.hbs'},
    {name: 'persons',                       path: App.basepath + 'signin/signin.hbs'},
    {name: 'profile', 				        path: App.basepath + 'presence/presence.hbs'},
    {name: 'tenant', 				        path: App.basepath + 'tenant/tenant.hbs'},
    {name: 'tenants/create', 		        path: App.basepath + 'tenant/create.hbs'},
    {name: 'tenants/index', 		        path: App.basepath + 'tenant/tenants.hbs'}
];

// default locale computation: try to retrieve window.navigator locale information or use a default
App.getBrowserLocale = function() {
    return window.navigator.userLanguage || window.navigator.language;
};

// default locale computation: try to retrieve window.navigator locale information or use a default
App.setDefaultLocale = function() {
    Ember.I18n.locale = App.getBrowserLocale() || 'en-US';
};

// entry point for testing to override the locale
App.overrideLocaleIfTesting =  function () {};


/* ===== INITIALIZATION ===== */
/* (1) initialize phonegap */
App.initializer({
    name: 'phonegap',
    before: 'compileTemplates',
    initialize: function(container, application) {
        application.deferReadiness();
        alert('initializing phonegap');
        document.addEventListener('deviceready', App.onDeviceReady, false);
    }
});

/* (2) compile handlebars templates */
App.initializer({
    name: 'compileTemplates',
    before: 'localization',
    initialize: function(container, application) {
        application.deferReadiness();

        alert('initializing compileTemplates');
        // Pre-compile templates
        for	(var index = 0; index < App.templates.length; index++) {
            App.compileTemplate(App.templates[index]);
        }

        application.advanceReadiness();
    }
});

/* (3) determine locale and initialize i18n support */
App.initializer({
    name: "localization",
    initialize: function (container, application) {

        application.deferReadiness();

        alert('initializing localization');

        // set the default locale
        App.setDefaultLocale();

        // override locale for testing (no-op for prod)
        App.overrideLocaleIfTesting();

        App.initializeLocalization(Ember.I18n.locale, application);

        // REMARKS: Uncomment if you want to log transitions, view lookups, etc. Not recommended for production environment.
        App.enableLogging();
    }
});


/* ===== PHONE GAP ===== */
App.onDeviceReady = function() {
    App.receivedEvent();
    var pushNotification = window.plugins.pushNotification;
    console.log("test log" + pushNotification);
    var push = new PushNotifications(pushNotification);
    App.advanceReadiness();
};

App.receivedEvent = function() {
    console.log('Received Event: ');
};

/* Application property: REST API host */
App.apiHost = 'http://10.50.15.67:3001';
alert('App.apiHost: '+App.apiHost);
//-->> DO NOT USE THIS:::::  App.apiHost = window.location.pathname && window.location.pathname.length > 1 ? window.location.protocol + '//' + window.location.hostname + ':3001' + window.location.pathname.substr(0, window.location.pathname.length - 1) : window.location.protocol + '//' + window.location.hostname + ':3001';
//-->> DO NOT USE THIS:::::  App.windowPathName = window.location.pathname && window.location.pathname.length > 1 ? window.location.pathname : '';

App.session_token = null;
App.user = null;

App.normalizeRelativePath = function(path) {
    var pathname = App.windowPathName;

    if (pathname && pathname.length > 1) {
        return pathname.substr(0, pathname.length - 1) + path;
    }
    return path;
};

App.defaultHeaders = function() {
    return {
        'Accept': 'application/json',
        'Authorization': Ember.get('App.session_token') || 'Bearer None'
    };
};

/* Application custom DataStore adapter: REST API */
App.ApplicationAdapter = DS.RESTAdapter.extend({
    namespace: 'api',
    host: App.apiHost,
    headers: function() {
        return App.defaultHeaders();
    }.property("App.session_token")
});

/* TODO: drop this adapter
/* Application custom DataStore adapter: Backdoor to support login story (ULTI-159022) */
App.PersonAdapter = DS.RESTAdapter.extend({
    namespace: 'u', //u=unauthorized
    host: App.apiHost,
    headers: function() {
        return App.defaultHeaders();
    }.property("App.session_token")
});

// TODO: Implement multiple custom adapters for multiple models
/* Configure DS.Store and DS.RESTAdapter */
App.store = DS.Store.extend({
    // Using custom ApplicationAdapter
    adapter: App.ApplicationAdapter
});

/* Application functions */
App.compileTemplate = function(template) {
  return App.getTemplate(template, App.loadTemplate);
};

App.loadTemplate = function(templateName, templateBody) {
    Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(templateBody);
};

App.getTemplate = function (template, callback){
    return $.ajax({
        url: template.path,
        type: 'GET',
        success: function (response) {
            callback(template.name, response);
        }
    });
};

App.advanceReadinessIfNotTesting = function(application, testMode) {

    if (testMode !== true) {
        application.advanceReadiness();
    }
};

App.initializeLocalization = function(language, application, testMode){
    var deferred = Ember.$.Deferred();

    Ember.$.getJSON('./js/modules/translations/' + language.toLowerCase() + '.json')
        .done(function(data){
            Ember.I18n.translations = data;
            deferred.resolve(data);

            App.advanceReadinessIfNotTesting(application, testMode);
        })
        .fail(function(e){
            console.log(e);
            // if we fail to load a language, get english
            Ember.$.getJSON('./js/modules/translations/en-us.json', function(data){
                Ember.I18n.translations = data;
                deferred.resolve(data);

                App.advanceReadinessIfNotTesting(application, testMode);
            });
        });

    return deferred.promise();
};

/* Helper function...: API post */
App.post = function (postRequest, onSuccess, onError) {
    if (postRequest === undefined || postRequest === null) {
        throw new Error("Request is null or undefined");
    } else if (postRequest.get('endpointRoute') === undefined || postRequest.get('endpointRoute') === null) {
        throw new Error("Request missing endpoint route");
    }

    Ember.$.ajaxSetup({
        headers: App.defaultHeaders()
    });

    var request = Ember.$.post(App.apiHost + postRequest.get('endpointRoute'), postRequest.get('data'));

    return request;
};

App.defaultSetDisplayPresence = function(model) {

    App.set('presence', model);

    var user = App.get('user');
    if (user === null && model !== null && App.isValidSessionToken()) {
        App.set('user', model);
    }
};

App.defaultSetSessionToken = function(token) {
    App.set('session_token', token);

    if (!App.isValidSessionToken()) {
        App.resetState();
    }
};

App.isValidSessionToken = function() {
    var token = App.get('session_token');
    return !(typeof token === 'undefined' || token === null || token === 'Bearer None');
};

App.resetState = function() {
    App.set('presence', null);
    App.set('user', null);
};

/*
 * These setters are exposed to enable overriding. During testing, tt is necessary to wrap their bodies
 * using Ember.run() otherwise JS unit tests fail (on the browser only) with an infamous error indicating
 * that setting the property must be done in a run loop. Setting these properties is not the problem.
 */
App.setDisplayPresence = App.defaultSetDisplayPresence;
App.setSessionToken = App.defaultSetSessionToken;

App.trimString = function(value) {
    if (value === undefined || value === null) {
        return undefined;
    }

    return value.trim();
};

App.enableLogging = function() {
    // REMARKS: Uncomment if you need to turn on advanced logging.
    //App.reopen({
    //    LOG_TRANSITIONS: true,
    //    LOG_TRANSITIONS_INTERNAL: true,
    //    LOG_VIEW_LOOKUPS: true,
    //    LOG_ACTIVE_GENERATION: true,
    //    LOG_RESOLVER: true,
    //    LOG_BINDINGS: true,
    //    RAISE_ON_DEPRECATION: true,
    //    LOG_STACKTRACE_ON_DEPRECATION: true
    //});
};

/**
 * Handlebar Helpers
 */

App.returnSafeMailToHref = function(target) {
    return new Ember.Handlebars.SafeString('mailTo:' + target);
};

App.returnSafeTelHref = function(target) {
    return new Ember.Handlebars.SafeString('tel:' + target);
};

Ember.Handlebars.registerBoundHelper('linkToMail', App.returnSafeMailToHref);

Ember.Handlebars.registerBoundHelper('linkToTel', App.returnSafeTelHref);

App.ValidationMessageComponent = Ember.Component.extend({

    // use these classes
    classNames: ['row'],

    classNameBindings: ['isDisplayXS:visible-xs:hidden-xs', 'isDisplayXS:epic_validation-message-row'],

    // property
    isDisplayXS: true,

    // actions
    actions: {
        resetmsg: function() {
            this.set('message','');
        }
    }
});

/* END OF APP.JS */