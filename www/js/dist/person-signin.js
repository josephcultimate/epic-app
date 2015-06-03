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
;App.Person = DS.Model.extend(Ember.Validations.Mixin, {
    user_name: DS.attr('string'),
    password: DS.attr('string'),
    first_name: DS.attr('string'),
    last_name: DS.attr('string'),
    email: DS.attr('string'),
    position: DS.attr('string'),
    location: DS.attr('string'),
    phone_number: DS.attr('string'),
    roles: DS.attr('number'),
    preferred_locale: DS.attr('string'),
    created_at: DS.attr('date'),
    enabled: DS.attr('boolean'),
    picture: DS.attr('string'),
    direct_reports: DS.attr('string'),
    about: DS.attr('string'),

    // Roles are bits ORed together from ./Product/src/ultimatesoftware/com/domain/security/authenticatedUser.go
    role_none: 0,
    role_user: 1,
    role_manager: 2,
    role_admin: 4,
    role_systemadmin: 8,

    hasFirstName: function() {
        return (typeof(this.get('first_name')) != 'undefined' && this.get('first_name').length > 0);
    }.property('first_name'),

    fullname: function() {
        return (this.get('hasFirstName')) ? (this.get('first_name') + ' ' + this.get('last_name')) : (this.get('last_name'));
    }.property('first_name','last_name'),

    // Computed properties used for setting the id of UI elements - WORK AROUND until we are able to concatenate strings when binding attributes in Ember
    rowId: function() {
        return 'listItem_' + this.get('id');
    }.property('id'),

    isEmployee: function() {
        return this.isInRole(this.role_user);
    }.property('roles'),

    isManager: function() {
        return this.isInRole(this.role_manager);
    }.property('roles'),

    isAdministrator: function() {
        return this.isInRole(this.role_admin);
    }.property('roles'),

    isManagerAdmin: function() {
        return this.isInRole(this.role_manager) && this.isInRole(this.role_admin);
    }.property('roles'),

    isEmployeeAdmin: function() {
        return this.isInRole(this.role_user) && this.isInRole(this.role_admin);
    }.property('roles'),

    isInRole: function(roles){
        return (this.get('roles') & roles) === roles;
    },

    pictureLink: function() {
        var normalized = App.normalizeRelativePath("/assets/person_40x40.png");
        return (this.get('picture') && this.get('picture') !== '') ? this.get('picture') : normalized;
    }.property('picture')
});


;App.AuthenticatedRoute = Ember.Route.extend({

    beforeModel: function(transition) {
        if (!App.get("session_token")) {
            this.redirectToLogin(transition);
        }
    },

    redirectToLogin: function(transition) {
        var signinController = this.controllerFor('person');
        signinController.set('attemptedTransition', transition);
        this.transitionTo('employees');
    },

    actions: {
        error: function(reason, transition){
            if(reason.status === 401){
                this.redirectToLogin(transition);
            }
        }
    }
});

App.PersonRoute = Ember.Route.extend({

    model: function(){
        return this.store.fetchAll('person');
    },

    renderTemplate: function(controller) {
        this.render('persons', {controller: controller});
    },

    setupController: function(controller) {
        controller.send('resetmsg');
        controller.set('employees', this._filterByRole(1));
        controller.set('managers', this._filterByRole(2));
        controller.set('managersadmins', this._filterByRole(6));
        controller.set('employeesadmins', this._filterByRole(5));
    },

    _filterByRole: function(role){
        var self = this;
        return self.store.filter('person', this._getFilterCallback(role));
    },

    _filterByRoleHelper: function(person, role){
        return person.get('roles') === role;
        //return person.isInRole(role);
    },

    _getFilterCallback: function(role) {
        var self = this;
        return function(person) {
            return self._filterByRoleHelper(person, role);
        };
    }
});

App.ManagersRoute = App.PersonRoute.extend({
    setupController: function(controller) {
        this._super(controller);
        controller.set('model', controller.managers);
    }
});

App.ManadminsRoute = App.PersonRoute.extend({
    setupController: function(controller) {
        this._super(controller);
        controller.set('model', controller.managersadmins);
    }
});

App.EmployeesRoute = App.PersonRoute.extend({
    setupController: function(controller) {
        this._super(controller);
        controller.set('model', controller.employees);
    }
});

App.EmpadminsRoute = App.PersonRoute.extend({
    setupController: function(controller) {
        this._super(controller);
        controller.set('model', controller.employeesadmins);
    }
});
