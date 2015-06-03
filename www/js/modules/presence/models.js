App.PresenceSerializer = DS.ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        certifications: { embedded: 'always' },
        educations: { embedded: 'always' },
        experiences: { embedded: 'always' },
        skills: {embedded: 'always' },
        hobbies: {embedded: 'always' }
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
    certifications: DS.hasMany('certification'),
    educations: DS.hasMany('education'),
    experiences: DS.hasMany('experience'),
    skills: DS.hasMany('skill'),
    hobbies: DS.hasMany('hobbies'),

    // Valid phone URIs do not contain alpha characters
    // @See http://tools.ietf.org/html/rfc3966 section 5.1.2.  Alphabetic Characters Corresponding to Digits
    phone_number_link: function() {
        var phone = this.get('phone_number') || '';
        return App.returnSafeTelHref(this.phoneToNumeric(phone));
    }.property('phone_number'),

    email_link: function() {
        var email = this.get('email') || '';
        return App.returnSafeMailToHref(email);
    }.property('email'),

    // determine if the logged user and the displayed presence match
    matchingUserAndPresence: function() {

        var user = App.get('user'),
            presence = App.get('presence');

        return user && presence && user.id === presence.id;
    }.property('App.user', 'App.presence'),

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
    },

    pictureLink: function() {
        var normalized = App.normalizeRelativePath("/assets/person_114x114.png");
        return (this.get('picture') && this.get('picture') !== '') ? this.get('picture') : normalized;
    }.property('picture'),

    rowId: function() {
        return 'elementId_' + this.get('id');
    }.property('id'),
});

App.Certification = DS.Model.extend(Ember.Validations.Mixin, {
    name: DS.attr('string'),
    description: DS.attr('string'),
    achieved_day: DS.attr('number', {defaultValue: 0}),
    achieved_month: DS.attr('number', {defaultValue: 0}),
    achieved_year: DS.attr('number', {defaultValue: 0}),
    expire_day: DS.attr('number', {defaultValue: 0}),
    expire_month: DS.attr('number', {defaultValue: 0}),
    expire_year: DS.attr('number', {defaultValue: 0}),

    achievedDate: function() {
        var hasDay = this.get('hasAchievedDay');
        var hasMonth = this.get('hasAchievedMonth');
        var hasYear = this.get('hasAchievedYear');

        if (hasYear) {
            var year = this.get('achieved_year');

            if (hasMonth) {
                var month = this.get('achieved_month');

                if (hasDay) {
                    return this.translateMonthName(month) + ' ' + this.get('achieved_day') + ', ' + year;
                }

                return this.translateMonthName(month) + ' ' + year;
            }

            return year;
        }

        return null;

    }.property('achieved_day', 'achieved_month', 'achieved_year'),

    expireDate: function() {
        var hasDay = this.get('hasExpireDay');
        var hasMonth = this.get('hasExpireMonth');
        var hasYear = this.get('hasExpireYear');

        if (hasYear) {
            var year = this.get('expire_year');

            if (hasMonth) {
                var month = this.get('expire_month');

                if (hasDay) {
                    return this.translateMonthName(month) + ' ' + this.get('expire_day') + ', ' + year;
                }

                return this.translateMonthName(month) + ' ' + year;
            }

            return year;
        }

        return null;

    }.property('expire_day', 'expire_month', 'expire_year'),

    duration: function() {
        var achievedDate = this.get('achievedDate');
        var expireDate = this.get('expireDate');

        if (achievedDate && expireDate) {
            return achievedDate + ' - ' + expireDate;
        }

        if (!achievedDate && expireDate) {
            return this.translateExpire() + ': ' + expireDate;
        }

        if (achievedDate && !expireDate) {
            return this.translateAchieved() + ': ' + achievedDate;
        }

        return '';
    }.property('achievedDate', 'expireDate'),

    hasAchievedDay: function() {
        var value = this.get('achieved_day');

        return value && value > 0;
    }.property('achieved_day'),

    hasAchievedMonth: function() {
        var value = this.get('achieved_month');

        return value && value > 0;
    }.property('achieved_month'),

    hasAchievedYear: function() {
        var value = this.get('achieved_year');

        return value && value > 0;
    }.property('achieved_year'),

    hasExpireDay: function() {
        var value = this.get('expire_day');

        return value && value > 0;
    }.property('expire_day'),

    hasExpireMonth: function() {
        var value = this.get('expire_month');

        return value && value > 0;
    }.property('expire_month'),

    hasExpireYear: function() {
        var value = this.get('expire_year');

        return value && value > 0;
    }.property('expire_year'),

    translateMonthName: function(value) {
        return Ember.I18n.t('system.monthname.'+ value);
    },

    translateAchieved: function() {
        return Ember.I18n.t('system.literal.achieved');
    },

    translateExpire: function() {
        return Ember.I18n.t('system.literal.expire');
    },

    rowId: function() {
        return 'elementId_' + this.get('id');
    }.property('id')
});

App.Education = DS.Model.extend(Ember.Validations.Mixin, {
    school: DS.attr('string'),
    level: DS.attr('string'),
    major: DS.attr('string'),
    minor: DS.attr('string'),
    description: DS.attr('string'),
    from_month: DS.attr('number', {defaultValue: 0}),
    from_year: DS.attr('number', {defaultValue: 0}),
    to_month: DS.attr('number', {defaultValue: 0}),
    to_year: DS.attr('number', {defaultValue: 0}),

    dateFrom: function() {

        var hasMonth = this.get('hasFromMonth');
        var hasYear = this.get('hasFromYear');

        if (hasYear) {
            var fromYear = this.get('from_year');
            if (hasMonth) {
                return this.translateMonthName(this.get('from_month')) + ' ' + fromYear;
            }
            return fromYear;
        }

        return null;
    }.property('from_month','from_year'),

    dateRange: function() {

        var dateFrom = this.get('dateFrom');
        var dateTo = this.get('dateTo');

        if (dateFrom && dateTo) {
            return dateFrom + ' - ' + dateTo;
        }

        if (!dateFrom && dateTo) {
            return this.translateTo()  + ': ' + dateTo;
        }

        if (dateFrom && !dateTo) {
            return dateFrom + ' - ' + this.translatePresent();
        }

        return '';
    }.property('dateFrom','dateTo'),

    dateTo: function() {

        var hasMonth = this.get('hasToMonth');
        var hasYear = this.get('hasToYear');

        if (hasYear) {
            var toYear = this.get('to_year');
            if (hasMonth) {
                return this.translateMonthName(this.get('to_month')) + ' ' + toYear;
            }
            return toYear;
        }

        return null;
    }.property('to_month','to_year'),

    hasFromMonth: function() {
        var value = this.get('from_month');
        return value && value > 0;
    }.property('from_month'),

    hasFromYear: function() {
        var value = this.get('from_year');
        return value && value > 0;
    }.property('from_year'),

    hasLevel: function() {
        return this.get('level') !== undefined && this.get('level') !== '';
    }.property('level'),

    hasMajor: function() {
        return this.get('major') !== undefined && this.get('major') !== '';
    }.property('major'),

    hasMinor: function() {
        return this.get('minor') !== undefined && this.get('minor') !== '';
    }.property('minor'),

    hasToMonth: function() {
        var value = this.get('to_month');
        return value && value > 0;
    }.property('to_month'),

    hasToYear: function() {
        var value = this.get('to_year');
        return value && value > 0;
    }.property('to_year'),

    rowId: function() {
        return 'elementId_' + this.get('id');
    }.property('id'),

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
            s = s + this.translateMinorIn() + ' ' + this.get('minor');
        }

        return s;
    }.property('level', 'major', 'minor'),

    translateMonthName: function(value) {
        return Ember.I18n.t('system.monthname.'+ value);
    },

    translatePresent: function() {
        return Ember.I18n.t('system.literal.Present');
    },

    translateTo: function() {
        return Ember.I18n.t('system.literal.To');
    },

    translateMinorIn: function() {
        return Ember.I18n.t('system.literal.MinorIn');
    }
});

App.Experience = DS.Model.extend(Ember.Validations.Mixin, {
    company: DS.attr('string'),
    job_title: DS.attr('string'),
    location: DS.attr('string'),
    description: DS.attr('string'),
    from_month: DS.attr('string'),
    from_year: DS.attr('string'),
    to_month: DS.attr('string'),
    to_year: DS.attr('string'),

    rowId: function() {
        return 'elementId_' + this.get('id');
    }.property('id'),

    hasLocation: function() {
        return this.get('location') !== undefined && this.get('location') !== '';
    }.property('location'),

    fromDate: function() {
        var hasMonth = this.get('from_month') !== undefined && this.get('from_month') > 0;
        var hasYear = this.get('from_year') !== undefined && this.get('from_year') > 0;

        if (hasMonth && hasYear) {
            return Ember.I18n.t('system.monthname.'+ this.get('from_month')) + ' ' + this.get('from_year');
        }

        if (!hasMonth && hasYear) {
            return this.get('from_year');
        }

        if (!hasYear) {
            return null;
        }
    }.property('from_year','from_month'),

    toDate: function() {
        var hasMonth = this.get('to_month') !== undefined && this.get('to_month') > 0;
        var hasYear = this.get('to_year') !== undefined && this.get('to_year') > 0;

        if (hasMonth && hasYear) {
            return Ember.I18n.t('system.monthname.'+ this.get('to_month')) + ' ' + this.get('to_year');
        }

        if (!hasMonth && hasYear) {
            return this.get('to_year');
        }

        if (!hasYear) {
            return null;
        }
    }.property('to_year','to_month'),

    durationAndLocation: function() {
        var s = "";

        var fromDate = this.get('fromDate');
        var toDate = this.get('toDate');

        if (fromDate) {
            s = s + fromDate;
        }

        if (!fromDate && toDate) {
            s = s + Ember.I18n.t('system.literal.To') + ": ";
        }

        if (fromDate && toDate) {
            s = s + ' - ';
        }

        if (fromDate && !toDate) {
            s = s + ' - ' + Ember.I18n.t('system.literal.Present');
        }

        if (toDate) {
            s = s + toDate;
        }

        if (this.get('hasLocation') && (fromDate || toDate)) {
            s = s + ' | ';
        }

        if (this.get('hasLocation')) {
            s = s + this.get('location');
        }

        return s;
    }.property('fromDate', 'toDate')
});

App.Skill = DS.Model.extend(Ember.Validations.Mixin, {
    description: DS.attr('string'),
    willing_to_help: DS.attr('string'),

    showWillingToHelp: function() {
        if (this.get('willing_to_help') === 'true') {
            return true;
        }
        return null;
    }.property('willing_to_help'),

    rowId: function() {
        return 'skill_' + this.get('id');
    }.property('id')
});

App.Hobby = DS.Model.extend(Ember.Validations.Mixin, {
    name: DS.attr('string'),

    rowId: function() {
        return 'hobby_' + this.get('id');

    }.property('id')
});
