App.PresenceSerializer = DS.ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        educations: { embedded: 'always' },
        experiences: { embedded: 'always' }
    }
});

App.Presence = DS.Model.extend(Ember.Validations.Mixin, {
    //id: DS.attr('string'),
    first_name: DS.attr('string'),
    last_name: DS.attr('string'),
    phone_number: DS.attr('string'),
    email: DS.attr('string'),
    position: DS.attr('string'),
    location: DS.attr('string'),
    picture: DS.attr('string'),
    tenant_id: DS.attr('string'),
    tenant_name: DS.attr('string'),
    about: DS.attr('string'),
    educations: DS.hasMany('education'),
    experiences: DS.hasMany('experience'),

    // Valid phone URIs do not contain alpha characters
    // @See http://tools.ietf.org/html/rfc3966 section 5.1.2.  Alphabetic Characters Corresponding to Digits
    phone_number_link: function() {

        var phone = (this.get('phone_number') || "");
        return this.phoneToNumeric(phone);
    }.property('phone_number'),





    /*
     * @Precondition: phone only contains alpha-numeric characters, special characters '(', ')', '-', and white space
     */
    phoneToNumeric: function(phone) {

        var atoi = {
            'A': '2',
            'B': '2',
            'C': '2',
            'D': '3',
            'E': '3',
            'F': '3',
            'G': '4',
            'H': '4',
            'I': '4',
            'J': '5',
            'K': '5',
            'L': '5',
            'M': '6',
            'N': '6',
            'O': '6',
            'P': '7',
            'Q': '7',
            'R': '7',
            'S': '7',
            'T': '8',
            'U': '8',
            'V': '8',
            'W': '9',
            'X': '9',
            'Y': '9',
            'Z': '9'
        };

        var result = "";

        var reference = phone.toLocaleUpperCase().replace(' ', '');
        var len = reference.length;

        for (var i = 0; i < len; i++) {

            // map alpha characters to the respective numeric; use other characters as-is
            result += atoi[reference[i]] ? atoi[reference[i]] : reference[i];
        }

        return result;
    }
});

App.Education = DS.Model.extend(Ember.Validations.Mixin, {
    school: DS.attr('string'),
    level: DS.attr('string'),
    major: DS.attr('string'),
    minor: DS.attr('string'),
    description: DS.attr('string'),

    // helper reflection properties
    hasLevel: function() {
        return this.get('level') !== undefined && this.get('level') !== '';
    }.property('level'),
    hasMajor: function() {
        return this.get('major') !== undefined && this.get('major') !== '';
    }.property('major'),
    hasMinor: function() {
        return this.get('minor') !== undefined && this.get('minor') !== '';
    }.property('minor'),

    specialization: function() {
        var s = "";

        if (this.get('hasLevel')) {
            s = s + this.get('level');
        }

        if (this.get('hasMajor') && this.get('hasLevel')) {
            s = s + ', ';
        }
        if (this.get('hasMajor')) {
            s = s + this.get('major');
        }

        if (this.get('hasMinor') && (this.get('hasLevel') || this.get('hasMajor'))) {
            s = s + ', ';
        }
        if (this.get('hasMinor')) {
            s = s + 'Minor in ' + this.get('minor');
        }

        return s;
    }.property('level', 'major', 'minor')
});

App.Experience = DS.Model.extend(Ember.Validations.Mixin, {
    company: DS.attr('string'),
    job_title: DS.attr('string'),
    location: DS.attr('string'),
    description: DS.attr('string')
});