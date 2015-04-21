App.TenantsRoute = App.AuthenticatedRoute.extend({
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