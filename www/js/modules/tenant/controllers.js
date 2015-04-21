App.TenantController = Ember.Controller.extend({
    _enable: function(tenant, enable) {
        // Clear out any error messages.
        this.set('errorMessage', null);
        tenant.set('enabled', enable);

        return tenant.save();
    },
    actions: {
        // Tenant is specified in the action
        disable: function(tenant) {
            var self = this;

            return this._enable(tenant, false).then(function(data) {
                self.transitionToRoute('tenants');
            },
            function(data) {
                self.set('errorMessage', data.responseJSON.error.message);
            });
        },
        // Tenant is specified in the action
        enable: function(tenant) {
            var self = this;

            this._enable(tenant, true).then(function(data) {
                self.transitionToRoute('tenants');
            },
            function(data) {
                self.set('errorMessage', data.responseJSON.error.message);
            });
        }
    }
});

App.TenantsCreateController = Ember.Controller.extend({
    recordSaved: false,
    actions: {
        create: function() {
            var self = this;
            self.set('recordSaved', false);

            // Clear out any error messages.
            self.set('errorMessage', null);

            // Trim the properties to remove any whitespace on either side of the string
            self.tenant.set('name', App.trimString(self.tenant.get('name')));
            self.tenant.set('alias', App.trimString(self.tenant.get('alias')));
            self.tenant.set('preferred_locale', App.trimString(self.tenant.get('preferred_locale')));

            self.tenant.validate().then(
                function () {
                    self.tenant.save().then(function(data) {
                            // reset model
                            self.set('name', null);
                            self.set('alias', null);
                            self.set('preferred_locale', null);
                            self.set('recordSaved', true);

                            self.transitionToRoute('tenants');
                        },
                        function(data){
                            // TODO: Error handling - Display error message
                            self.set('errorMessage', data.responseJSON.error.message);
                            self.set('recordSaved', false);
                        });
                },
                function () {
                    self.set('errorMessage', self.tenant.get('errors.name') + " " + self.tenant.get('errors.alias'));
                });
        },
        reset: function() {
            this.tenant.set('name', null);
            this.tenant.set('alias', null);
            this.tenant.set('preferred_locale', null);

            this.set('errorMessage', null);
        }
    }
});