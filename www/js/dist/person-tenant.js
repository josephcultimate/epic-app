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
});;App.Tenant = DS.Model.extend(Ember.Validations.Mixin, {
    name: DS.attr('string'),
    alias: DS.attr('string'),
    created_at: DS.attr('date'),
    enabled: DS.attr('boolean'),
    preferred_locale: DS.attr('string'),

    // Computed properties used for setting the id of UI elements - WORK AROUND until we are able to concatenate strings when binding attributes in Ember
    rowId: function() {
        return 'listItem_' + this.get('id');
    }.property('id'),
    editId: function() {
        return 'editTenant_' + this.get('id');
    }.property('id')
});

App.Tenant.reopen({
   validations: {
       name: {
           presence: {
               message: 'Name is required'
           },
           length: {
               minimum: 5
               // TODO: Research how to override message property
           }
       },
       alias: {
           presence: {
               message: 'Alias is required'
           }
       }
   }
});;App.TenantsRoute = App.AuthenticatedRoute.extend({
    model: function () {
        return this.store.fetchAll('tenant');
    }
});

App.TenantsIndexRoute = App.AuthenticatedRoute.extend({
    model: function () {
        return this.modelFor('tenants');
    }
});

App.TenantsEnabledRoute = App.AuthenticatedRoute.extend({
    _applyFilter: function(tenant) {
        return tenant.get('enabled') === true;
    },
    model: function(){
        return this.store.filter('tenant', this._applyFilter);
    },
    renderTemplate: function(controller) {
        this.render('tenants/index', { controller: controller });
    }
});

App.TenantsDisabledRoute = App.AuthenticatedRoute.extend({
    _applyFilter: function(tenant) {
        return tenant.get('enabled') === false;
    },
    model: function(){
        return this.store.filter('tenant', this._applyFilter);
    },
    renderTemplate: function(controller) {
        this.render('tenants/index', { controller: controller });
    }
});

App.TenantsCreateRoute = App.AuthenticatedRoute.extend({
    model: function() {
      return this.store.createRecord('tenant', {
          enabled: true,
          created_at: new Date()
      });
    },
    setupController: function(controller, tenant) {
        controller.set('tenant', tenant);
        controller.set('recordSaved', false);
        controller.set('errorMessage', null);
        controller.send('reset');
    },
    actions: {
        willTransition: function(transition) {
            var recordSaved = this.controller.get('recordSaved');

            if (recordSaved === false) {
                if (!confirm("Are you sure you want to abandon progress?")) {
                    transition.abort();
                } else {
                    var tenant = this.get('currentModel');
                    tenant.deleteRecord();
                }
            }
        }
    }
});

App.TenantRoute = App.AuthenticatedRoute.extend({
    model: function (params) {
        return this.store.fetchById('tenant', params.tenant_id);
    }
});