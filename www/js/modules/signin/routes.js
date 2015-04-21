App.AuthenticatedRoute = Ember.Route.extend({

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
