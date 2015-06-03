App.Router.map(function() {

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
    this.route('catchAll', { path: '*path' });
});

App.CatchAllRoute = Ember.Route.extend({
    redirect: function() {
        this.transitionTo('employees');
    }
});

App.IndexRoute = Ember.Route.extend({
    model : function() {
        return this.transitionTo('employees');
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

    actions: {
        transitionToProfile: function(profileId) {
            this.transitionToRoute('profile', profileId);
        },
        transitionToUserProfile: function() {
            var user = App.get('user');
            if (user && user.get('id')) {
                this.transitionToRoute('profile', user.get('id'));
            }
        }
    },

    // ensures window scrolls to top after route transitioned
    currentPathChanged: function () {
        window.scrollTo(0, 0);
    }.observes('currentPath'),

    isLogged: function() {
        return App.isValidSessionToken();
    }.property('App.session_token'),

    NavbarLoggedClass: function() {

        var result = 'navbar navbar-ultipro navbar-fixed-top';

        if (App.session_token) {
            result += ' xs-no-background';
        }

        return result;
    }.property('App.session_token'),

    Presence: function() {
        return App.get('presence');
    }.property('App.presence'),

    SessionToken: function() {
        return App.get('session_token');
    }.property('App.session_token'),

    User: function() {
        return App.get('user');
    }.property('App.session_token', 'App.user'),

    UserId: function() {
        var user = App.get('user');
        if (user) {
            return user.get('id');
        }
        return null;
    }.property('App.session_token', 'App.user')
});
