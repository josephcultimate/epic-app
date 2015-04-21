App.Tenant = DS.Model.extend(Ember.Validations.Mixin, {
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
});