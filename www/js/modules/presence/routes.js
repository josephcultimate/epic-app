App.ProfileRoute = App.AuthenticatedRoute.extend({

    model : function(params) {

        // find presence based on the presence_id provided by the route
        return this.store.fetchById('presence', params.presence_id);
    },

    setupController : function(controller, model) {

        // set the global presence-- we need this for rendering the navigation bar
        App.set('presence', model);
        controller.set('model', model);
    }
});
