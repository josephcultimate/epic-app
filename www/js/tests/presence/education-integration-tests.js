module('Integration/Presence education', {

    setup: function () {
        JsHamcrest.Integration.QUnit();
        JsMockito.Integration.QUnit();
        Ember.run(function() {
            App.advanceReadiness();
        });
        Ember.I18n.locale = "en-us";
    },

    teardown: function () {
        $('.ember-view').hide();

        Ember.run(function(){
            App.set('presence', null);
            App.set('user', null);
        });
    }
});

var Month = ["" ,"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

test('Should render presence page with educations', function (assert) {

    assert.expect(10);

    var edu1_id = 'edu1';
    var edu1_level = 'Masters';
    var edu1_school = 'University of Toronto';
    var edu1_major = 'Science';
    var edu1_minor = 'Arts';
    var edu1_fromMonth = '1';
    var edu1_fromYear = '1991';
    var edu1_toMonth = '2';
    var edu1_toYear = '1992';
    var edu1_description = 'I got a masters in science and a minors in arts here!';

    var edu2_id = 'edu2';
    var edu2_level = 'Masters';
    var edu2_school = 'University of Waterloo';
    var edu2_major = 'Computer Science';
    var edu2_minor = 'Arts';
    var edu2_fromMonth = '3';
    var edu2_fromYear = '1992';
    var edu2_toMonth = '4';
    var edu2_toYear = '1993';
    var edu2_description = 'I enjoyed my time at Waterloo';

    var presence = {
        id: 'renderWitheducations',
        first_name: 'John',
        last_name: 'Smith',
        phone_number: '(954) 555-9098',
        email: 'john@smith.org',
        position: 'Librarian',
        major: 'Miami, FL',
        picture: '',
        tenant_id: '12345',
        tenant_name: 'Smithonian Museum',
        about: 'John Smith is an alright person.',
        certifications: [],
        exp: [],
        educations: [
            {
                id: edu1_id,
                level: edu1_level,
                school: edu1_school,
                major: edu1_major,
                minor: edu1_minor,
                description: edu1_description,
                from_month: edu1_fromMonth,
                from_year: edu1_fromYear,
                to_month: edu1_toMonth,
                to_year: edu1_toYear
            },
            {
                id: edu2_id,
                level: edu2_level,
                school: edu2_school,
                major: edu2_major,
                minor: edu2_minor,
                description: edu2_description,
                from_month: edu2_fromMonth,
                from_year: edu2_fromYear,
                to_month: edu2_toMonth,
                to_year: edu2_toYear
            },
        ]
    };

    Ember.run(function() {
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/renderWitheducations', 200, null, response, 'GET');

        visit('/presences/renderWitheducations');

        andThen(function () {
            assert.equal(currentPath(), 'profile');

            var renderedTitle = $($('#presence_education_section')[0].children[0]).text();

            if (renderedTitle.indexOf('system.') > 0) {
                assert.equal(renderedTitle, " Missing translation: system.presence.education");
            } else {
                assert.equal(renderedTitle, " Education");
            }

            //Verify that the basic fields are being rendered
            assert.equal($('#presence_education_specialization', '#elementId_' + edu1_id).text(), edu1_level + ", " + edu1_major + ", Minor in " + edu1_minor);
            assert.equal($('#presence_education_school', '#elementId_' + edu1_id).text(), edu1_school);
            assert.equal($('#presence_education_dates', '#elementId_' + edu1_id).text(), Month[edu1_fromMonth] + " " + edu1_fromYear + " - " + Month[edu1_toMonth] + " " + edu1_toYear);
            assert.equal($('#presence_education_description', '#elementId_' + edu1_id).text(), edu1_description);

            assert.equal($('#presence_education_specialization', '#elementId_' + edu2_id).text(), edu2_level + ", " + edu2_major + ", Minor in " + edu2_minor);
            assert.equal($('#presence_education_school', '#elementId_' + edu2_id).text(), edu2_school);
            assert.equal($('#presence_education_dates', '#elementId_' + edu2_id).text(), Month[edu2_fromMonth] + " " + edu2_fromYear + " - " + Month[edu2_toMonth] + " " + edu2_toYear);
            assert.equal($('#presence_education_description', '#elementId_' + edu2_id).text(), edu2_description);
        });
    });
});

test('Education without a major', function (assert) {

    assert.expect(4);

    var edu1_id = 'nomajor';
    var edu1_level = 'PhD';
    var edu1_school = 'Electric school';
    var edu1_minor = 'Arts';
    var edu1_fromMonth = '3';
    var edu1_fromYear = '1993';
    var edu1_toMonth = '4';
    var edu1_toYear = '1994';
    var edu1_description = 'I didnt get a major only a minor!';

    var presence = {
        id: 'educationWithoutmajor',
        first_name: 'John',
        last_name: 'Smith',
        phone_number: '(954) 555-9098',
        email: 'john@smith.org',
        position: 'Librarian',
        major: 'Miami, FL',
        picture: '',
        tenant_id: '12345',
        tenant_name: 'Smithonian Museum',
        about: 'John Smith is an alright person.',
        certifications: [],
        experiences: [],
        educations: [
            {
                id: edu1_id,
                level: edu1_level,
                school: edu1_school,
                minor: edu1_minor,
                description: edu1_description,
                from_month: edu1_fromMonth,
                from_year: edu1_fromYear,
                to_month: edu1_toMonth,
                to_year: edu1_toYear
            }
        ]
    };

    Ember.run(function(){
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/educationWithoutmajor', 200, null, response, 'GET');

        visit('/presences/educationWithoutmajor');

        andThen(function () {
            assert.equal($('#presence_education_specialization', '#elementId_' + edu1_id).text(), edu1_level + ", Minor in " + edu1_minor);
            assert.equal($('#presence_education_school', '#elementId_' + edu1_id).text(), edu1_school);
            assert.equal($('#presence_education_dates', '#elementId_' + edu1_id).text(), Month[edu1_fromMonth] + " " + edu1_fromYear + " - " + Month[edu1_toMonth] + " " + edu1_toYear);
            assert.equal($('#presence_education_description', '#elementId_' + edu1_id).text(), edu1_description);
        });
    });
});

test('Education without a minor', function (assert) {

    assert.expect(4);

    var edu1_id = 'noMinor';
    var edu1_level = 'PhD';
    var edu1_school = 'Electric school';
    var edu1_major = 'Arts';
    var edu1_fromMonth = '3';
    var edu1_fromYear = '1993';
    var edu1_toMonth = '4';
    var edu1_toYear = '1994';
    var edu1_description = 'No minor!';

    var presence = {
        id: 'educationWithoutMinor',
        first_name: 'John',
        last_name: 'Smith',
        phone_number: '(954) 555-9098',
        email: 'john@smith.org',
        position: 'Librarian',
        major: 'Miami, FL',
        picture: '',
        tenant_id: '12345',
        tenant_name: 'Smithonian Museum',
        about: 'John Smith is an alright person.',
        certifications: [],
        experiences: [],
        educations: [
            {
                id: edu1_id,
                level: edu1_level,
                school: edu1_school,
                major: edu1_major,
                description: edu1_description,
                from_month: edu1_fromMonth,
                from_year: edu1_fromYear,
                to_month: edu1_toMonth,
                to_year: edu1_toYear
            }
        ]
    };

    Ember.run(function(){
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/educationWithoutMinor', 200, null, response, 'GET');

        visit('/presences/educationWithoutMinor');

        andThen(function () {
            assert.equal($('#presence_education_specialization', '#elementId_' + edu1_id).text(), edu1_level + ", " + edu1_major);
            assert.equal($('#presence_education_school', '#elementId_' + edu1_id).text(), edu1_school);
            assert.equal($('#presence_education_dates', '#elementId_' + edu1_id).text(), Month[edu1_fromMonth] + " " + edu1_fromYear + " - " + Month[edu1_toMonth] + " " + edu1_toYear);
            assert.equal($('#presence_education_description', '#elementId_' + edu1_id).text(), edu1_description);
        });
    });
});

test('Education without a date', function (assert) {

    assert.expect(4);

    var edu1_id = 'eduNoDate';
    var edu1_level = 'Masters';
    var edu1_school = 'University of Toronto';
    var edu1_major = 'Science';
    var edu1_minor = 'Arts';
    var edu1_description = 'I forgot all my dates!';

    var presence = {
        id: 'educationNoDate',
        first_name: 'John',
        last_name: 'Smith',
        phone_number: '(954) 555-9098',
        email: 'john@smith.org',
        position: 'Librarian',
        major: 'Miami, FL',
        picture: '',
        tenant_id: '12345',
        tenant_name: 'Smithonian Museum',
        about: 'John Smith is an alright person.',
        certifications: [],
        experiences: [],
        educations: [
            {
                id: edu1_id,
                level: edu1_level,
                school: edu1_school,
                major: edu1_major,
                minor: edu1_minor,
                description: edu1_description
            }
        ]
    };

    Ember.run(function(){
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/educationNoDate', 200, null, response, 'GET');

        visit('/presences/educationNoDate');

        andThen(function () {
            assert.equal($('#presence_education_specialization', '#elementId_' + edu1_id).text(), edu1_level + ", " + edu1_major + ", Minor in " + edu1_minor);
            assert.equal($('#presence_education_school', '#elementId_' + edu1_id).text(), edu1_school);
            assert.equal($('#presence_education_dates', '#elementId_' + edu1_id).text(), "");
            assert.equal($('#presence_education_description', '#elementId_' + edu1_id).text(), edu1_description);
        });
    });
});

test('Education without a to date', function (assert) {

    assert.expect(4);

    var edu1_id = 'educationWithoutToDate';
    var edu1_level = 'PhD';
    var edu1_school = 'University of Waterloo';
    var edu1_fromMonth = '3';
    var edu1_fromYear = '1993';
    var edu1_major = 'Science';
    var edu1_minor = 'Arts';
    var edu1_description = 'Still studying!!';

    var presence = {
        id: 'educationWithoutToDate',
        first_name: 'John',
        last_name: 'Smith',
        phone_number: '(954) 555-9098',
        email: 'john@smith.org',
        position: 'Librarian',
        major: 'Miami, FL',
        picture: '',
        tenant_id: '12345',
        tenant_name: 'Smithonian Museum',
        about: 'John Smith is an alright person.',
        certifications: [],
        experiences: [],
        educations: [
            {
                id: edu1_id,
                level: edu1_level,
                school: edu1_school,
                description: edu1_description,
                major: edu1_major,
                minor: edu1_minor,
                from_month: edu1_fromMonth,
                from_year: edu1_fromYear
            }
        ]
    };

    Ember.run(function(){
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/educationWithoutToDate', 200, null, response, 'GET');

        visit('/presences/educationWithoutToDate');

        andThen(function () {
            assert.equal($('#presence_education_specialization', '#elementId_' + edu1_id).text(), edu1_level + ", " + edu1_major + ", Minor in " + edu1_minor);
            assert.equal($('#presence_education_school', '#elementId_' + edu1_id).text(), edu1_school);
            //Should see from date - Present
            assert.equal($('#presence_education_dates', '#elementId_' + edu1_id).text(), Month[edu1_fromMonth] + " " + edu1_fromYear + " - Present");
            assert.equal($('#presence_education_description', '#elementId_' + edu1_id).text(), edu1_description);
        });
    });
});

test('Education without a from date', function (assert) {

    assert.expect(4);

    var edu1_id = 'educationWithoutFromDate';
    var edu1_level = 'PhD';
    var edu1_school = 'University of Waterloo';
    var edu1_toMonth = '3';
    var edu1_toYear = '1993';
    var edu1_major = 'Science';
    var edu1_minor = 'Arts';
    var edu1_description = 'Forgot when I started!';

    var presence = {
        id: 'educationWithoutFromDate',
        first_name: 'John',
        last_name: 'Smith',
        phone_number: '(954) 555-9098',
        email: 'john@smith.org',
        position: 'Librarian',
        major: 'Miami, FL',
        picture: '',
        tenant_id: '12345',
        tenant_name: 'Smithonian Museum',
        about: 'John Smith is an alright person.',
        certifications: [],
        experiences: [],
        educations: [
            {
                id: edu1_id,
                level: edu1_level,
                school: edu1_school,
                description: edu1_description,
                major: edu1_major,
                minor: edu1_minor,
                to_month: edu1_toMonth,
                to_year: edu1_toYear
            }
        ]
    };

    Ember.run(function(){
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/educationWithoutFromDate', 200, null, response, 'GET');

        visit('/presences/educationWithoutFromDate');

        andThen(function () {
            assert.equal($('#presence_education_specialization', '#elementId_' + edu1_id).text(), edu1_level + ", " + edu1_major + ", Minor in " + edu1_minor);
            assert.equal($('#presence_education_school', '#elementId_' + edu1_id).text(), edu1_school);
            //Should see To: ToDate
            assert.equal($('#presence_education_dates', '#elementId_' + edu1_id).text(), "To: " + Month[edu1_toMonth] + " " + edu1_toYear);
            assert.equal($('#presence_education_description', '#elementId_' + edu1_id).text(), edu1_description);
        });
    });
});

test('No Educations', function (assert) {

    assert.expect(3);

    var presence = {
        id: 'noEducations',
        first_name: 'John',
        last_name: 'Smith',
        phone_number: '(954) 555-9098',
        email: 'john@smith.org',
        position: 'Librarian',
        location: 'Miami, FL',
        picture: '',
        tenant_id: '12345',
        tenant_name: 'Smithonian Museum',
        about: 'John Smith is an alright person.',
        certifications: [],
        educations: [],
        experiences: []
    };

    Ember.run(function(){
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/noEducations', 200, null, response, 'GET');

        visit('/presences/noEducations');

        andThen(function () {            
            assert.equal(currentPath(), 'profile');

            var renderedTitle = $($('#presence_education_section')[0].children[0]).text();

            if (renderedTitle.indexOf('system.') > 0) {
                assert.equal(renderedTitle, " Missing translation: system.presence.education");
            } else {
                assert.equal(renderedTitle, " Education");
            }

            var renderedEducation = $($('#presence_education_section')[0].children[1]).text().trim();

            if (renderedEducation.indexOf('system.') > 0) {
                assert.equal(renderedEducation, "Missing translation: system.presence.education.missing");
            } else {
                assert.equal(renderedEducation, "Come back later to see my education.");
            }
        });
    });
});

test('Education sorting order', function (assert) {

    assert.expect(9);

    var edu1_id = 'edu1';
    var edu1_school = 'Rescue Scuba Diver School';
    var edu1_fromMonth = '1';
    var edu1_fromYear = '1991';
    var edu1_toMonth = '2';
    var edu1_toYear = '1992';

    var edu2_id = 'edu2';
    var edu2_school = 'Toronto Zoo School';
    var edu2_fromMonth = '3';
    var edu2_fromYear = '1992';
    var edu2_toMonth = '4';
    var edu2_toYear = '1993';

    var edu3_id = 'edu3';
    var edu3_school = 'Electric school';

    var edu4_id = 'edu4';
    var edu4_school = 'Toronto Zoo School';
    var edu4_fromMonth = '3';
    var edu4_fromYear = '1994';

    var edu5_id = 'edu5';
    var edu5_school = 'Dynamic Programming school';

    var edu6_id = 'edu6';
    var edu6_school = 'Toronto Zoo School';
    var edu6_fromMonth = '4';
    var edu6_fromYear = '1994';

    var edu7_id = 'edu7';
    var edu7_school = 'A toronto Zoo School';
    var edu7_fromMonth = '3';
    var edu7_fromYear = '1994';

    var edu8_id = 'edu8';
    var edu8_school = 'A Rescue Scuba Diver school';
    var edu8_fromMonth = '1';
    var edu8_fromYear = '1991';
    var edu8_toMonth = '2';
    var edu8_toYear = '1992';
    
    var presence = {
        id: 'educationSortOrder',
        first_name: 'John',
        last_name: 'Smith',
        phone_number: '(954) 555-9098',
        email: 'john@smith.org',
        position: 'Librarian',
        location: 'Miami, FL',
        picture: '',
        tenant_id: '12345',
        tenant_name: 'Smithonian Museum',
        about: 'John Smith is an alright person.',
        certifications: [],
        experiences: [],
        educations: [
            {
                id: edu1_id,
                school: edu1_school,
                from_month: edu1_fromMonth,
                from_year: edu1_fromYear,
                to_month: edu1_toMonth,
                to_year: edu1_toYear
            },
            {
                id: edu2_id,
                school: edu2_school,
                from_month: edu2_fromMonth,
                from_year: edu2_fromYear,
                to_month: edu2_toMonth,
                to_year: edu2_toYear
            },
            {
                id: edu3_id,
                school: edu3_school
            },
            {
                id: edu4_id,
                school: edu4_school,
                from_month: edu4_fromMonth,
                from_year: edu4_fromYear
            },
            {
                id: edu5_id,
                school: edu5_school
            },
            {
                id: edu6_id,
                school: edu6_school,
                from_month: edu6_fromMonth,
                from_year: edu6_fromYear
            },
            {
                id: edu7_id,
                school: edu7_school,
                from_month: edu7_fromMonth,
                from_year: edu7_fromYear
            },
            {
                id: edu8_id,
                school: edu8_school,
                from_month: edu8_fromMonth,
                from_year: edu8_fromYear,
                to_month: edu8_toMonth,
                to_year: edu8_toYear
            },
        ]
    };

    Ember.run(function() {
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/educationSortOrder', 200, null, response, 'GET');

        visit('/presences/educationSortOrder');

        andThen(function () {
            assert.equal(currentPath(), 'profile');

            //Sort rules:
            //Education with From, but no To (sorted by most recent From)
            //Education with To (From field is ignored for sorting purposes, sorted by most recent To)
            //Education with neither From nor To (sorted alphabetically by school name, deterministically)

            //Verify sort order - should be:
            //1. edu6 - no to date = still studying here, most recent present school
            //2. edu7 - no to date = still studying here, tied for 2nd most recent present education, school name starts with 'A'
            //3. edu4 - no to date = still studying here, tied for 2nd most recent present education, school name starts with 'T'
            //4. edu2 - most recent To date
            //5. edu8 - tied for 2nd most recent To date, school starts with 'A'
            //6. edu1 - tied for 2nd most recent To date, school starts with 'R'
            //7. edu5 - no dates, school starts with 'D'
            //8. edu3 - no dates, school starts with 'E'
            assert.equal($($('#presence_education_section')[0].children[1].children[0])[0].id, 'elementId_' + edu6_id);
            assert.equal($($('#presence_education_section')[0].children[1].children[1])[0].id, 'elementId_' + edu7_id);
            assert.equal($($('#presence_education_section')[0].children[1].children[2])[0].id, 'elementId_' + edu4_id);
            assert.equal($($('#presence_education_section')[0].children[1].children[3])[0].id, 'elementId_' + edu2_id);
            assert.equal($($('#presence_education_section')[0].children[1].children[4])[0].id, 'elementId_' + edu8_id);
            assert.equal($($('#presence_education_section')[0].children[1].children[5])[0].id, 'elementId_' + edu1_id);
            assert.equal($($('#presence_education_section')[0].children[1].children[6])[0].id, 'elementId_' + edu5_id);
            assert.equal($($('#presence_education_section')[0].children[1].children[7])[0].id, 'elementId_' + edu3_id);
        });
    });
});
