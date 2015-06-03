App.Person = DS.Model.extend(Ember.Validations.Mixin, {
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


