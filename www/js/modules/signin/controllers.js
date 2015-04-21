App.PersonController = Ember.ArrayController.extend({

    //storage
    employees: [],
    managers: [],
    managersadmins: [],
    employeesadmins: [],

    //counts
    employees_count: function() {
        return this.employees.get('length');
    }.property('@each.isEmployee'),

    managers_count: function() {
        return this.managers.get('length');
    }.property('@each.isManager'),

    managersadmins_count: function() {
        return this.managersadmins.get('length');
    }.property('@each.isManagerAdmin'),

    employeesadmins_count: function() {
        return this.employeesadmins.get('length');
    }.property('@each.isEmployeeAdmin'),

    empty: function() {
        return this.employees.get('length') === 0 && this.managers.get('length') === 0 && this.managersadmins.get('length') === 0 && this.employeesadmins.get('length') === 0;
    }.property('length'),

    //sorted
    sortProperties: ['first_name:asc'],
    sortedEmployees: Ember.computed.sort('employees','sortProperties'),
    sortedManagers: Ember.computed.sort('managers','sortProperties'),
    sortedManagersAdmins: Ember.computed.sort('managersadmins','sortProperties'),
    sortedEmployeesAdmins: Ember.computed.sort('employeesadmins','sortProperties'),
    sortedModel: Ember.computed.sort('model','sortProperties'),

    //communication
    msg_warning: null,

    _linkToProfile: function(person){

        var self = this;
        self.send('resetmsg');

        //var data = { username: person.get('user_name') };
        var data = { username: 'test' };

        var postRequest = App.PostRequest.create({
            endpointRoute: '/login',
            data: JSON.stringify(data)
        });

        var personId = person.get("id");

        var promise = App.post(postRequest);
        promise.then(self.onLoginSuccess(personId), this.onLoginError());
    },

    onLoginSuccess: function(personId) {
        var self = this;
        return function(data, success, response) {
            App.setSessionToken(data.session_token);

            var attemptedTransition = self.get('attemptedTransition');

            if (attemptedTransition) {
                attemptedTransition.retry();
                self.set('attemptedTransition', null);
            } else {
                self.transitionToRoute('profile', personId);
            }
        };
    },

    onLoginError: function() {
        var self = this;

        return function(data) {
            self.set('msg_warning', data.responseJSON.error.message);
        };
    },

    actions: {
        linktoprofile: function(person) {
            this._linkToProfile(person);
        },
        resetmsg: function() {
            var self = this;
            self.set('msg_warning', null);
        }
    }
});

App.EmployeesController = App.PersonController.extend();

App.ManagersController = App.PersonController.extend();

App.ManadminsController = App.PersonController.extend();

App.EmpadminsController = App.PersonController.extend();
