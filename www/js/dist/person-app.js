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

App.initializer({
    name: 'phonegap',
    after: 'compileTemplates',
    initialize: function(container, application) {
        application.deferReadiness();
        alert('phonegap initialize');
        document.addEventListener('deviceready', App.onDeviceReady, false);
        application.advanceReadiness();
    }
});

App.onDeviceReady = function() {
    App.receivedEvent();
    var pushNotification = window.plugins.pushNotification;
    alert("push " + pushNotification);
    console.log("test log" + pushNotification);
    var push = new PushNotifications(pushNotification);
};

App.receivedEvent = function() {
    alert('event received');
    console.log('Received Event: ');
};

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
App.apiHost = 'http://10.50.52.72:3001';
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
;var PushNotifications = (function () {
    function PushNotifications(push) {
        this.pushNotification = push;
        this.setup();
    }
    PushNotifications.prototype.setup = function () {
        if (device.platform == 'android' || device.platform == 'Android') {
            console.log(device);
            this.pushNotification.register(this.successHandler, this.errorHandler, {
                "senderID": "750800674534",
                "ecb": "onNotificationGcm"
            });
        } else {
            this.pushNotification.register(this.tokenHandler, this.errorHandler, {
                "badge": "true",
                "sound": "true",
                "alert": "true",
                "ecb": "onNotificationApn"
            });
        }
    };

    PushNotifications.prototype.successHandler = function (result) {
        console.log(result);
        alert('result = ' + result);
    };

    PushNotifications.prototype.errorHandler = function (error) {
        alert('error = ' + error);
    };

    PushNotifications.prototype.tokenHandler = function (result) {
        // Your iOS push server needs to know the token before it can push to this device
        // here is where you might want to send it the token for later use.
        alert('device token = ' + result);
    };

    // iOS
    PushNotifications.prototype.onNotificationApn = function (event) {
        if (event.alert) {
            navigator.notification.alert(event.alert);
        }

        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }

        if (event.badge) {
            this.pushNotification.setApplicationIconBadgeNumber(this.successHandler, this.errorHandler, event.badge);
        }
    };

    return PushNotifications;
})();


function onNotificationGcm(e) {
    console.log('onNotificationGcm: ' + JSON.stringify(e));

    $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");

                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                console.log("regID = " + e.regid);
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground) {
                $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                // if the notification contains a soundname, play it.
                alert("Ultimate + GO + Push Notifications == AWESOME" + e.payload.message);
            } else {
                if (e.coldstart) {
                    $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                } else {
                    $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                }
            }

            $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            break;

        case 'error':
            $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
            break;

        default:
            $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
    }
};App.Router.map(function() {

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
