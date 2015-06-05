module('Integration/Presence Experiences', {

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

test('Should render presence page with experiences', function (assert) {

    assert.expect(10);

    var exp1_id = 'exp1';
    var exp1_job_title = 'Scuba diver';
    var exp1_company = 'Rescue Scuba Diver';
    var exp1_location = 'Florida';
    var exp1_fromMonth = '1';
    var exp1_fromYear = '1991';
    var exp1_toMonth = '2';
    var exp1_toYear = '1992';
    var exp1_description = 'I rescue people by diving';

    var exp2_id = 'exp2';
    var exp2_job_title = 'Lion trainer';
    var exp2_company = 'Toronto Zoo';
    var exp2_location = 'Toronto Canada';
    var exp2_fromMonth = '3';
    var exp2_fromYear = '1992';
    var exp2_toMonth = '4';
    var exp2_toYear = '1993';
    var exp2_description = 'I tame lions in Canada';

    var presence = {
        id: 'renderWithExperiences',
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
        experiences: [
            {
                id: exp1_id,
                job_title: exp1_job_title,
                company: exp1_company,
                location: exp1_location,
                description: exp1_description,
                from_month: exp1_fromMonth,
                from_year: exp1_fromYear,
                to_month: exp1_toMonth,
                to_year: exp1_toYear
            },
            {
                id: exp2_id,
                job_title: exp2_job_title,
                company: exp2_company,
                location: exp2_location,
                description: exp2_description,
                from_month: exp2_fromMonth,
                from_year: exp2_fromYear,
                to_month: exp2_toMonth,
                to_year: exp2_toYear
            },
        ]
    };

    Ember.run(function() {
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/renderWithExperiences', 200, null, response, 'GET');

        visit('/presences/renderWithExperiences');

        andThen(function () {
            assert.equal(currentPath(), 'profile');

            var renderedTitle = $($('#presence_experience_section')[0].children[0]).text();

            if (renderedTitle.indexOf('system.') > 0) {
                assert.equal(renderedTitle, " Missing translation: system.presence.experience");
            } else {
                assert.equal(renderedTitle, " Work Experience");
            }

            //Verify that the basic fields are being rendered
            assert.equal($('#presence_experience_title', '#elementId_' + exp1_id).text(), exp1_job_title);
            assert.equal($('#presence_experience_company', '#elementId_' + exp1_id).text(), exp1_company);
            assert.equal($('#presence_experience_location', '#elementId_' + exp1_id).text(), Month[exp1_fromMonth] + " " + exp1_fromYear + " - " + Month[exp1_toMonth] + " " + exp1_toYear + " | " + exp1_location);
            assert.equal($('#presence_experience_description', '#elementId_' + exp1_id).text(), exp1_description);

            assert.equal($('#presence_experience_title', '#elementId_' + exp2_id).text(), exp2_job_title);
            assert.equal($('#presence_experience_company', '#elementId_' + exp2_id).text(), exp2_company);
            assert.equal($('#presence_experience_location', '#elementId_' + exp2_id).text(), Month[exp2_fromMonth] + " " + exp2_fromYear + " - " + Month[exp2_toMonth] + " " + exp2_toYear + " | " + exp2_location);
            assert.equal($('#presence_experience_description', '#elementId_' + exp2_id).text(), exp2_description);
        });
    });
});

test('Experience without a location', function (assert) {

    assert.expect(4);

    var exp1_id = 'noLocation';
    var exp1_job_title = 'Developer';
    var exp1_company = 'Electric Company';
    var exp1_fromMonth = '3';
    var exp1_fromYear = '1993';
    var exp1_toMonth = '4';
    var exp1_toYear = '1994';
    var exp1_description = 'I worked from home - no location!';

    var presence = {
        id: 'experienceWithoutLocation',
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
        experiences: [
            {
                id: exp1_id,
                job_title: exp1_job_title,
                company: exp1_company,
                description: exp1_description,
                from_month: exp1_fromMonth,
                from_year: exp1_fromYear,
                to_month: exp1_toMonth,
                to_year: exp1_toYear
            }
        ]
    };

    Ember.run(function(){
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/experienceWithoutLocation', 200, null, response, 'GET');

        visit('/presences/experienceWithoutLocation');

        andThen(function () {
            assert.equal($('#presence_experience_title', '#elementId_' + exp1_id).text(), exp1_job_title);
            assert.equal($('#presence_experience_company', '#elementId_' + exp1_id).text(), exp1_company);
            //Should not see the | divider, since no location
            assert.equal($('#presence_experience_location', '#elementId_' + exp1_id).text(), Month[exp1_fromMonth] + " " + exp1_fromYear + " - " + Month[exp1_toMonth] + " " + exp1_toYear);
            assert.equal($('#presence_experience_description', '#elementId_' + exp1_id).text(), exp1_description);
        });
    });
});

test('Experience without a date', function (assert) {

    assert.expect(4);

    var exp1_id = 'expNoDate';
    var exp1_job_title = 'Janitor';
    var exp1_company = 'Nortel';
    var exp1_location = 'Somewhere in United States';
    var exp1_description = 'I did this job too long ago to even bother trying to find the dates again';

    var presence = {
        id: 'experienceNoDate',
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
        experiences: [
            {
                id: exp1_id,
                job_title: exp1_job_title,
                company: exp1_company,
                description: exp1_description,
                location: exp1_location
            }
        ]
    };

    Ember.run(function(){
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/experienceNoDate', 200, null, response, 'GET');

        visit('/presences/experienceNoDate');

        andThen(function () {
            assert.equal($('#presence_experience_title', '#elementId_' + exp1_id).text(), exp1_job_title);
            assert.equal($('#presence_experience_company', '#elementId_' + exp1_id).text(), exp1_company);
            //Should not see the | divider, since no date
            assert.equal($('#presence_experience_location', '#elementId_' + exp1_id).text(), exp1_location);
            assert.equal($('#presence_experience_description', '#elementId_' + exp1_id).text(), exp1_description);
        });
    });
});

test('Experience without a to date', function (assert) {

    assert.expect(4);

    var exp1_id = 'experienceWithoutToDate';
    var exp1_job_title = 'Janitor';
    var exp1_company = 'Amazon';
    var exp1_fromMonth = '3';
    var exp1_fromYear = '1993';
    var exp1_location = 'United States';
    var exp1_description = 'I think im still working on this job!';

    var presence = {
        id: 'experienceWithoutToDate',
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
        experiences: [
            {
                id: exp1_id,
                job_title: exp1_job_title,
                company: exp1_company,
                description: exp1_description,
                location: exp1_location,
                from_month: exp1_fromMonth,
                from_year: exp1_fromYear
            }
        ]
    };

    Ember.run(function(){
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/experienceWithoutToDate', 200, null, response, 'GET');

        visit('/presences/experienceWithoutToDate');

        andThen(function () {
            assert.equal($('#presence_experience_title', '#elementId_' + exp1_id).text(), exp1_job_title);
            assert.equal($('#presence_experience_company', '#elementId_' + exp1_id).text(), exp1_company);
            //Should see from date - Present | Location
            assert.equal($('#presence_experience_location', '#elementId_' + exp1_id).text(), Month[exp1_fromMonth] + " " + exp1_fromYear + " - Present | " + exp1_location);
            assert.equal($('#presence_experience_description', '#elementId_' + exp1_id).text(), exp1_description);
        });
    });
});

test('Experience without a from date', function (assert) {

    assert.expect(4);

    var exp1_id = 'experienceWithoutFromDate';
    var exp1_job_title = 'Janitor';
    var exp1_company = 'Amazon';
    var exp1_toMonth = '3';
    var exp1_toYear = '1993';
    var exp1_location = 'United States';
    var exp1_description = 'I think im still working on this job!';

    var presence = {
        id: 'experienceWithoutFromDate',
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
        experiences: [
            {
                id: exp1_id,
                job_title: exp1_job_title,
                company: exp1_company,
                description: exp1_description,
                location: exp1_location,
                to_month: exp1_toMonth,
                to_year: exp1_toYear
            }
        ]
    };

    Ember.run(function(){
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/experienceWithoutFromDate', 200, null, response, 'GET');

        visit('/presences/experienceWithoutFromDate');

        andThen(function () {
            assert.equal($('#presence_experience_title', '#elementId_' + exp1_id).text(), exp1_job_title);
            assert.equal($('#presence_experience_company', '#elementId_' + exp1_id).text(), exp1_company);
            //Should see To: toDate | Location
            assert.equal($('#presence_experience_location', '#elementId_' + exp1_id).text(), "To: " + Month[exp1_toMonth] + " " + exp1_toYear + " | " + exp1_location);
            assert.equal($('#presence_experience_description', '#elementId_' + exp1_id).text(), exp1_description);
        });
    });
});

test('No Experiences', function (assert) {

    assert.expect(3);

    var presence = {
        id: 'noExperiences',
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

        mockServerCalls('/api/presences/noExperiences', 200, null, response, 'GET');

        visit('/presences/noExperiences');

        andThen(function () {            
            assert.equal(currentPath(), 'profile');

            var renderedTitle = $($('#presence_experience_section')[0].children[0]).text();

            if (renderedTitle.indexOf('system.') > 0) {
                assert.equal(renderedTitle, " Missing translation: system.presence.experience");
            } else {
                assert.equal(renderedTitle, " Work Experience");
            }

            var renderedExperience = $($('#presence_experience_section')[0].children[1]).text().trim();

            if (renderedExperience.indexOf('system.') > 0) {
                assert.equal(renderedExperience, "Missing translation: system.presence.experience.missing");
            } else {
                assert.equal(renderedExperience, "Come back later to see my experience.");
            }
        });
    });
});

test('Experience sorting order', function (assert) {

    assert.expect(9);

    var exp1_id = 'exp1';
    var exp1_job_title = 'Scuba diver';
    var exp1_company = 'Rescue Scuba Diver';
    var exp1_location = 'Florida';
    var exp1_fromMonth = '1';
    var exp1_fromYear = '1991';
    var exp1_toMonth = '2';
    var exp1_toYear = '1992';
    var exp1_description = 'I rescue people by diving';

    var exp2_id = 'exp2';
    var exp2_job_title = 'Lion trainer';
    var exp2_company = 'Toronto Zoo';
    var exp2_location = 'Toronto Canada';
    var exp2_fromMonth = '3';
    var exp2_fromYear = '1992';
    var exp2_toMonth = '4';
    var exp2_toYear = '1993';
    var exp2_description = 'I tame lions in Canada';

    var exp3_id = 'exp3';
    var exp3_job_title = 'Developer';
    var exp3_company = 'Electric Company';
    var exp3_description = 'I dont remember the dates anymore (or location)!';

    var exp4_id = 'exp4';
    var exp4_job_title = 'Lion feeder';
    var exp4_company = 'Toronto Zoo';
    var exp4_fromMonth = '3';
    var exp4_fromYear = '1994';
    var exp4_description = 'I still work in this job!';

    var exp5_id = 'exp5';
    var exp5_job_title = 'Developer';
    var exp5_company = 'Dynamic Programming Company';
    var exp5_description = 'I dont remember the dates anymore (or location)... Again!';

    var exp6_id = 'exp6';
    var exp6_job_title = 'Llama feeder';
    var exp6_company = 'Toronto Zoo';
    var exp6_fromMonth = '4';
    var exp6_fromYear = '1994';
    var exp6_description = 'I still work in this job also!';

    var exp7_id = 'exp7';
    var exp7_job_title = 'Llama feeder';
    var exp7_company = 'A toronto Zoo';
    var exp7_fromMonth = '3';
    var exp7_fromYear = '1994';
    var exp7_description = 'I still work in this job also!!!';

    var exp8_id = 'exp8';
    var exp8_job_title = 'Scuba diver';
    var exp8_company = 'A Rescue Scuba Diver Company';
    var exp8_location = 'Florida';
    var exp8_fromMonth = '1';
    var exp8_fromYear = '1991';
    var exp8_toMonth = '2';
    var exp8_toYear = '1992';
    var exp8_description = 'I rescue people by diving';

    var presence = {
        id: 'experienceSortOrder',
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
        experiences: [
            {
                id: exp1_id,
                job_title: exp1_job_title,
                company: exp1_company,
                location: exp1_location,
                description: exp1_description,
                from_month: exp1_fromMonth,
                from_year: exp1_fromYear,
                to_month: exp1_toMonth,
                to_year: exp1_toYear
            },
            {
                id: exp2_id,
                job_title: exp2_job_title,
                company: exp2_company,
                location: exp2_location,
                description: exp2_description,
                from_month: exp2_fromMonth,
                from_year: exp2_fromYear,
                to_month: exp2_toMonth,
                to_year: exp2_toYear
            },
            {
                id: exp3_id,
                job_title: exp3_job_title,
                company: exp3_company,
                description: exp3_description
            },
            {
                id: exp4_id,
                job_title: exp4_job_title,
                company: exp4_company,
                description: exp4_description,
                from_month: exp4_fromMonth,
                from_year: exp4_fromYear
            },
            {
                id: exp5_id,
                job_title: exp5_job_title,
                company: exp5_company,
                description: exp5_description
            },
            {
                id: exp6_id,
                job_title: exp6_job_title,
                company: exp6_company,
                description: exp6_description,
                from_month: exp6_fromMonth,
                from_year: exp6_fromYear
            },
            {
                id: exp7_id,
                job_title: exp7_job_title,
                company: exp7_company,
                description: exp7_description,
                from_month: exp7_fromMonth,
                from_year: exp7_fromYear
            },
            {
                id: exp8_id,
                job_title: exp8_job_title,
                company: exp8_company,
                location: exp8_location,
                description: exp8_description,
                from_month: exp8_fromMonth,
                from_year: exp8_fromYear,
                to_month: exp8_toMonth,
                to_year: exp8_toYear
            },
        ]
    };

    Ember.run(function() {
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/experienceSortOrder', 200, null, response, 'GET');

        visit('/presences/experienceSortOrder');

        andThen(function () {
            assert.equal(currentPath(), 'profile');

            //Sort rules:
            //Work Experience with From, but no To (sorted by most recent From)
            //Work Experience with To (From field is ignored for sorting purposes, sorted by most recent To)
            //Work Experience with neither From nor To (sorted alphabetically by company name, deterministically)

            //Verify sort order - should be:
            //1. exp6 - no to date = still working here, most recent present job
            //2. exp7 - no to date = still working here, tied for 2nd most recent present job, company name starts with 'A'
            //3. exp4 - no to date = still working here, tied for 2nd most recent present job, company name starts with 'T'
            //4. exp2 - most recent To date
            //5. exp8 - tied for 2nd most recent To date, company starts with 'A'
            //6. exp1 - tied for 2nd most recent To date, company starts with 'R'
            //7. exp5 - no dates, company starts with 'D'
            //8. exp3 - no dates, company starts with 'E'
            assert.equal($($('#presence_experience_section')[0].children[1].children[0])[0].id, 'elementId_' + exp6_id);
            assert.equal($($('#presence_experience_section')[0].children[1].children[1])[0].id, 'elementId_' + exp7_id);
            assert.equal($($('#presence_experience_section')[0].children[1].children[2])[0].id, 'elementId_' + exp4_id);
            assert.equal($($('#presence_experience_section')[0].children[1].children[3])[0].id, 'elementId_' + exp2_id);
            assert.equal($($('#presence_experience_section')[0].children[1].children[4])[0].id, 'elementId_' + exp8_id);
            assert.equal($($('#presence_experience_section')[0].children[1].children[5])[0].id, 'elementId_' + exp1_id);
            assert.equal($($('#presence_experience_section')[0].children[1].children[6])[0].id, 'elementId_' + exp5_id);
            assert.equal($($('#presence_experience_section')[0].children[1].children[7])[0].id, 'elementId_' + exp3_id);
        });
    });
});
