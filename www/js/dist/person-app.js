var App = Ember.Application.create({
});

/* Define application templates */
App.basepath = "js/modules/";
App.templates = [
    {name: 'components/form-input', path: App.basepath + 'components.hbs'},
    {name: 'components/search-bar', path: App.basepath + 'components/search.hbs'},
    {name: 'application',           path: App.basepath + 'application.hbs'},
    {name: 'persons',               path: App.basepath + 'signin/signin.hbs'},
    {name: 'profile', 				path: App.basepath + 'presence/presence.hbs'},
    {name: 'tenant', 				path: App.basepath + 'tenant/tenant.hbs'},
    {name: 'tenants/create', 		path: App.basepath + 'tenant/create.hbs'},
    {name: 'tenants/index', 		path: App.basepath + 'tenant/tenants.hbs'}
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

/* Initialization task: compile handlebars templates */
App.initializer({
	name: 'compileTemplates',
    before: 'localization',
    initialize: function(container, application) {
        application.deferReadiness();

        // Pre-compile templates
        for	(var index = 0; index < App.templates.length; index++) {
            App.compileTemplate(App.templates[index]);
        }

        application.advanceReadiness();
    }
});

/* Initialization task: determine locale and initialize i18n support */
App.initializer({
    name: "localization",
    initialize: function (container, application) {

        application.deferReadiness();

        // set the default locale
        App.setDefaultLocale();

        // override locale for testing (no-op for prod)
        App.overrideLocaleIfTesting();

        App.initializeLocalization(Ember.I18n.locale, application);

        // REMARKS: Uncomment if you want to log transitions, view lookups, etc. Not recommended for production environment.
        App.enableLogging();
    }
});

/* Application property: REST API host */
App.apiHost = window.location.protocol + '//' + window.location.hostname + ':3001';
App.session_token = null;
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

App.defaultSetSessionToken = function(token) {
    App.set("session_token", token);
};

/*
 * This setter is exposed to enable overriding. During testing, tt is necessary to wrap this setter's
 * body using Ember.run() otherwise JS unit tests fail (on the browser only) with the infamous error
 * indicating that setting the property must be done in a run loop. Setting the property itself is not
 * the problem. The computed properties defined on the ApplicationController, which listen on changes
 * to the application token, are recalculated (asynchronously) every time the application token is set.
 */
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
    return new Ember.Handlebars.SafeString('href="mailTo:' + target + '"');
};

App.returnSafeTelHref = function(target) {
    return new Ember.Handlebars.SafeString('href="tel:' + target + '"');
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

;App.PostRequest = Ember.Object.extend({
    endpointRoute: null,
    data: null
});
;App.Router.map(function() {

    this.route('employees');
    // '#/signin/employees'
    this.route('managers');
    // '#/signin/managers'
    this.route('manadmins');
    // '#/signin/managersadmins'
    this.route('empadmins');
    // '#/signin/employeesadmins'

    this.resource('tenants', function() {// '#/tenants/
        this.route('enabled');
        // '#/tenants/enabled'
        this.route('disabled');
        // '#/tenants/disabled'
        this.route('create');
        // '#/tenants/create'
    });
    this.resource('tenant', {
        path : 'tenants/:tenant_id'
    });
    // '#/tenants/:tenant_id'

    this.resource('profile', {
        path : 'presences/:presence_id'
    });
    // '#/presences/:presence_id'

    // for all other routes, use the catchAll route
    this.route('catchAll', { path: '*:' });
});

App.CatchAllRoute = Ember.Route.extend({
    redirect: function() {
        this.transitionTo('employees');
    }
});

App.IndexRoute = Ember.Route.extend({
    model : function() {
        return this.transitionTo("employees");
    }
});

App.ApplicationRoute = Ember.Route.extend({

    actions : {

        logout : function() {
            this._logout();
        }
    },

    _logout : function() {
        App.setSessionToken(null);
        localStorage.removeItem('token');
        this.transitionTo('employees');
    }
});

App.ApplicationController = Ember.Controller.extend({

    SessionToken : function() {
        return App.get('session_token');
    }.property('App.session_token'),

    NavbarLoggedClass : function() {

        var result = 'navbar navbar-ultipro navbar-fixed-top';

        if (App.session_token) {
            result += ' xs-no-background';
        }

        return result;
    }.property('App.session_token'),

    Presence : function() {
        return App.get('presence');
    }.property('App.presence'),

    //ensures window scrolls to top after route transitioned
    currentPathChanged: function () {
        window.scrollTo(0, 0);
    }.observes('currentPath'),

    actions: {
        searchClear: function() {
            alert('From AppController!');
        }
    }
});
