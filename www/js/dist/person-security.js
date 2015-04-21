App.LoginController = Ember.Controller.extend({

    _setSessionToken: function(sessionToken) {
        App.setSessionToken(sessionToken);
        this.set('token', sessionToken);
    },

    _reset: function() {
        if (this.login) {
            this.login.set('username', null);
        }

        this.set('errorMessage', null);
    },

    _login: function() {
        var self = this;

        // Clear out any error messages.
        self.set('errorMessage', null);

        // Trim the properties to remove any whitespace on either side of the string
        self.login.set('username', App.trimString(self.login.get('username')));

        self.login.validate().then(
            function () {
                var postRequest = App.PostRequest.create({
                    endpointRoute: '/login',
                    data: JSON.stringify(self.login.getProperties('username'))
                });

                var promise = App.post(postRequest);
                promise.then(self.onLoginSuccess(), self.onLoginError());
            },
            function () {
                self.set('errorMessage', self.login.get('errors.username'));
            });
    },

    // TODO: Investigate why response header ("Authorization") cannot be retrieved. It seems that on cross-domain requests, the AJAX response does not contain the headers.
    onLoginSuccess: function() {
        var self = this;
        return function(data, success, response) {

            self._setSessionToken(data.session_token);

            var attemptedTransition = self.get('attemptedTransition');

            if (attemptedTransition) {
                attemptedTransition.retry();
                self.set('attemptedTransition', null);
            } else {
                self.transitionToRoute('index');
            }
        };
    },

    onLoginError: function() {
        var self = this;
        return function(data) {
            self.set('errorMessage', data.responseJSON.error.message);
        };
    },

    token: localStorage.token,

    tokenChanged: function(){
        localStorage.token = this.get('token');
    }.observes("token"),

    actions: {
        submit: function () {
            this._login();
        },
        reset: function() {
            this._reset();
        }
    }
});;App.Login = Ember.Object.extend(Ember.Validations.Mixin, {
   username: null
});

App.Login.reopen({
   validations: {
       username: {
           presence: {
               message: 'Username is required'
           },
           length: {
               minimum: 4   // TODO: Define minimum length for username
           }
       }
   }
});;App.AuthenticatedRoute = Ember.Route.extend({
    beforeModel: function(transition) {
        if (!App.get("session_token")) {
            this.redirectToLogin(transition);
        }
    },
    redirectToLogin: function(transition) {
        var loginController = this.controllerFor('login');
        loginController.set('attemptedTransition', transition);
        this.transitionTo('login');
    },
    actions: {
        error: function(reason, transition){
            if(reason.status === 401){
                this.redirectToLogin(transition);
            }
        }
    }
});

App.LoginRoute = Ember.Route.extend({
    model: function() {
        return App.Login.create();
    },
    setupController: function(controller, login) {
        controller.set('login', login);
        controller.send('reset');
    }
});