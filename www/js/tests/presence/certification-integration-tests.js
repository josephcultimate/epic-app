module('Integration/Presence Certifications', {

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

test('Should render presence page with certifications', function (assert) {

    assert.expect(11);

    var cert1_id = '1';
    var cert1_name = 'Scuba Certification';
    var cert1_description = 'Rescue Scuba Diver';
    var cert1_achieved_day = 1;
    var cert1_achieved_month = 3;
    var cert1_achieved_year = 2015;
    var cert1_duration = "Date of Achievement: March 1, 2015";

    var cert2_id = '2';
    var cert2_name = 'Microsoft Visual Basic';
    var cert2_description = 'Advanced Programming';
    var cert2_achieved_day = 1;
    var cert2_achieved_month = 3;
    var cert2_achieved_year = 2015;
    var cert2_expire_day = 1;
    var cert2_expire_month = 3;
    var cert2_expire_year = 2020;
    var cert2_duration = "March 1, 2015 - March 1, 2020";
	
	var cert3_id = '3';
    var cert3_name = 'Certification without Description';
    var cert3_expire_day = 1;
    var cert3_expire_month = 3;
    var cert3_expire_year = 2020;
    var cert3_duration = "Expiration: March 1, 2020";

    var presence = {
        id: '766e012d-463f-42ea-6c89-d6c94c4befce',
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
        certifications: [
            {
                id: cert1_id,
                name: cert1_name,
                description: cert1_description,
                achieved_day: cert1_achieved_day,
                achieved_month: cert1_achieved_month,
                achieved_year: cert1_achieved_year
            },
            {
                id: cert2_id,
                name: cert2_name,
				description: cert2_description,
                achieved_day: cert2_achieved_day,
                achieved_month: cert2_achieved_month,
                achieved_year: cert2_achieved_year,
                expire_day: cert2_expire_day,
                expire_month: cert2_expire_month,
                expire_year: cert2_expire_year
            },
            {
                id: cert3_id,
                name: cert3_name,
                expire_day: cert3_expire_day,
                expire_month: cert3_expire_month,
                expire_year: cert3_expire_year
            }
        ],
        educations: [],
        experiences: []
    };
    
    Ember.run(function() {
        App.setSessionToken('Bearer AnyTokenWillDo');
    	App.set('user', presence);
    	App.set('presence', presence);

    	var response = JSON.stringify({presence: presence});

    	mockServerCalls('/api/presences/766e012d-463f-42ea-6c89-d6c94c4befce', 200, null, response, 'GET');

    	visit('/presences/766e012d-463f-42ea-6c89-d6c94c4befce');

    	andThen(function () {
    		assert.equal(currentPath(), 'profile');

    		var renderedTitle = $($('#presence_certification_section')[0].children[0]).text();

    		if (renderedTitle.indexOf('system.') > 0) {
    			assert.equal(renderedTitle, " Missing translation: system.presence.certification");
    		} else {
    			assert.equal(renderedTitle, " Licenses and Certifications");
    		}

    		assert.equal($('#presence_certification_name', '#elementId_1').text(), cert1_name);
            assert.equal($('#presence_certification_duration', '#elementId_1').text(), cert1_duration);
            assert.equal($('#presence_certification_description', '#elementId_1').text(), cert1_description);

            assert.equal($('#presence_certification_name', '#elementId_2').text(), cert2_name);
            assert.equal($('#presence_certification_duration', '#elementId_2').text(), cert2_duration);
            assert.equal($('#presence_certification_description', '#elementId_2').text(), cert2_description);

            assert.equal($('#presence_certification_name', '#elementId_3').text(), cert3_name);
            assert.equal($('#presence_certification_duration', '#elementId_3').text(), cert3_duration);
            assert.equal($('#presence_certification_description', '#elementId_3').text(), "");
    	});
    });
});

test('Certification without an expire date', function (assert) {

    assert.expect(5);

    var cert1_id = 'noExpireDate';
    var cert1_name = 'No Expire Date';
    var cert1_description = 'Rescue Scuba Diver';
    var cert1_achieved_day = 1;
    var cert1_achieved_month = 3;
    var cert1_achieved_year = 2015;
    var cert1_duration = "Date of Achievement: March 1, 2015";

    var presence = {
        id: 'certificationWithoutExpireDate',
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
        certifications: [
            {
                id: cert1_id,
                name: cert1_name,
                description: cert1_description,
                achieved_day: cert1_achieved_day,
                achieved_month: cert1_achieved_month,
                achieved_year: cert1_achieved_year
            }
        ],
        educations: [],
        experiences: []
    };

    Ember.run(function(){
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/certificationWithoutExpireDate', 200, null, response, 'GET');

        visit('/presences/certificationWithoutExpireDate');

        andThen(function () {
            assert.equal(currentPath(), 'profile');

            var renderedTitle = $($('#presence_certification_section')[0].children[0]).text();

            if (renderedTitle.indexOf('system.') > 0) {
                assert.equal(renderedTitle, " Missing translation: system.presence.certification");
            } else {
                assert.equal(renderedTitle, " Licenses and Certifications");
            }

            assert.equal($('#presence_certification_name', '#elementId_' + cert1_id).text(), cert1_name);
            assert.equal($('#presence_certification_duration', '#elementId_' + cert1_id).text(), cert1_duration);
            assert.equal($('#presence_certification_description', '#elementId_' + cert1_id).text(), cert1_description);
        });
    });
});

test('Certification without an achieve date', function (assert) {

    assert.expect(5);

    var cert1_id = 'noAchieveDate';
    var cert1_name = 'certificationWithoutAchieveDate';
    var cert1_expire_day = 1;
    var cert1_expire_month = 3;
    var cert1_expire_year = 2020;
    var cert1_duration = "Expiration: March 1, 2020";

    var presence = {
        id: 'certificationWithoutAchieveDate',
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
        certifications: [
            {
                id: cert1_id,
                name: cert1_name,
                expire_day: cert1_expire_day,
                expire_month: cert1_expire_month,
                expire_year: cert1_expire_year
            }
        ],
        educations: [],
        experiences: []
    };

    Ember.run(function(){
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/certificationWithoutAchieveDate', 200, null, response, 'GET');

        visit('/presences/certificationWithoutAchieveDate');

        andThen(function () {
            assert.equal(currentPath(), 'profile');

            var renderedTitle = $($('#presence_certification_section')[0].children[0]).text();

            if (renderedTitle.indexOf('system.') > 0) {
                assert.equal(renderedTitle, " Missing translation: system.presence.certification");
            } else {
                assert.equal(renderedTitle, " Licenses and Certifications");
            }

            assert.equal($('#presence_certification_name', '#elementId_' + cert1_id).text(), cert1_name);
            assert.equal($('#presence_certification_duration', '#elementId_' + cert1_id).text(), cert1_duration);
            assert.equal($('#presence_certification_description', '#elementId_' + cert1_id).text(), "");
        });
    });
});

test('Certification without a date', function (assert) {

    assert.expect(5);

    var cert1_id = 'certNoDate';
    var cert1_name = 'certificationWithoutAchieveDate';

    var presence = {
        id: 'certificationWithoutADate',
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
        certifications: [
            {
                id: cert1_id,
                name: cert1_name
            }
        ],
        educations: [],
        experiences: []
    };

    Ember.run(function(){
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/certificationWithoutADate', 200, null, response, 'GET');

        visit('/presences/certificationWithoutADate');

        andThen(function () {
            assert.equal(currentPath(), 'profile');

            var renderedTitle = $($('#presence_certification_section')[0].children[0]).text();

            if (renderedTitle.indexOf('system.') > 0) {
                assert.equal(renderedTitle, " Missing translation: system.presence.certification");
            } else {
                assert.equal(renderedTitle, " Licenses and Certifications");
            }

            assert.equal($('#presence_certification_name', '#elementId_' + cert1_id).text(), cert1_name);
            assert.equal($('#presence_certification_duration', '#elementId_' + cert1_id).text(), "");
            assert.equal($('#presence_certification_description', '#elementId_' + cert1_id).text(), "");
        });
    });
});

test('No certifications', function (assert) {

    assert.expect(3);

    var presence = {
        id: 'noCertifications',
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

        mockServerCalls('/api/presences/noCertifications', 200, null, response, 'GET');

        visit('/presences/noCertifications');

        andThen(function () {
            assert.equal(currentPath(), 'profile');

            var renderedTitle = $($('#presence_certification_section')[0].children[0]).text();

            if (renderedTitle.indexOf('system.') > 0) {
                assert.equal(renderedTitle, " Missing translation: system.presence.certification");
            } else {
                assert.equal(renderedTitle, " Licenses and Certifications");
            }

            var renderedCertification = $($('#presence_certification_section')[0].children[1]).text().trim();

            if (renderedCertification.indexOf('system.') > 0) {
                assert.equal(renderedCertification, "Missing translation: system.presence.certification.missing");
            } else {
                assert.equal(renderedCertification, "Come back later to see my licenses and certifications.");
            }
        });
    });
});

test('Certification sorting - Dates and No Dates', function (assert) {

    assert.expect(3);

    var cert1_id = 'cert1';
    var cert1_name = 'Advanced Microsoft Visual Basic';
    var cert1_achieved_day = 1;
    var cert1_achieved_month = 1;
    var cert1_achieved_year = 2015;
    var cert1_expire_day = 1;
    var cert1_expire_month = 2;
    var cert1_expire_year = 2015;

    var cert2_id = 'cert2';
    var cert2_name = 'Basic Microsoft Visual Basic';
    var cert2_achieved_day = null;
    var cert2_achieved_month = null;
    var cert2_achieved_year = null;
    var cert2_expire_day = null;
    var cert2_expire_month = null;
    var cert2_expire_year = null;

    var presence = {
        id: 'certificationSortDatesNoDates',
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
        educations: [],
        experiences: [],
        certifications: [
            {
                id: cert1_id,
                name: cert1_name,
                achieved_day: cert1_achieved_day,
                achieved_month: cert1_achieved_month,
                achieved_year: cert1_achieved_year,
                expire_day: cert1_expire_day,
                expire_month: cert1_expire_month,
                expire_year: cert1_expire_year
            },
            {
                id: cert2_id,
                name: cert2_name,
                achieved_day: cert2_achieved_day,
                achieved_month: cert2_achieved_month,
                achieved_year: cert2_achieved_year,
                expire_day: cert2_expire_day,
                expire_month: cert2_expire_month,
                expire_year: cert2_expire_year
            }
        ]
    };

    Ember.run(function() {
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/certificationSortDatesNoDates', 200, null, response, 'GET');

        visit('/presences/certificationSortDatesNoDates');

        andThen(function () {
            assert.equal(currentPath(), 'profile');

            //Sort rules:
            //I will see the License and Cert ordered by Expire year (farthest year from the present goes first).
            //  If same year. use month. if same month use day.
            //If License and Cert does not have an expire year it should show up first. 
            //  Sort determistically (alphabetical by License name) as shown in the mockup 

            //Verify sort order - should be:
            // cert2 - no dates - cert name starts with 'B'
            // cert1 - has expiry date
            assert.equal($($('#presence_certification_section')[0].children[1].children[0])[0].id, 'elementId_' + cert2_id);
            assert.equal($($('#presence_certification_section')[0].children[1].children[1])[0].id, 'elementId_' + cert1_id);
        });
    });
});

test('Certification sorting - no expiry dates', function (assert) {

    assert.expect(5);

    var cert1_id = 'cert1';
    var cert1_name = 'Basic Microsoft Visual Basic';
    var cert1_achieved_day = null;
    var cert1_achieved_month = null;
    var cert1_achieved_year = null;
    var cert1_expire_day = null;
    var cert1_expire_month = null;
    var cert1_expire_year = null;

    var cert2_id = 'cert2';
    var cert2_name = 'Advanced Microsoft Visual Basic';
    var cert2_achieved_day = null;
    var cert2_achieved_month = null;
    var cert2_achieved_year = null;
    var cert2_expire_day = null;
    var cert2_expire_month = null;
    var cert2_expire_year = null;

    var cert3_id = 'cert3';
    var cert3_name = 'Dog Training';
    var cert3_achieved_day = 1;
    var cert3_achieved_month = 1;
    var cert3_achieved_year = 2015;
    var cert3_expire_day = null;
    var cert3_expire_month = null;
    var cert3_expire_year = null;

    var cert4_id = 'cert4';
    var cert4_name = 'Cat calling';
    var cert4_achieved_day = 1;
    var cert4_achieved_month = 1;
    var cert4_achieved_year = 2015;
    var cert4_expire_day = null;
    var cert4_expire_month = null;
    var cert4_expire_year = null;

    var presence = {
        id: 'certificationSortNoExpiryDates',
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
        educations: [],
        experiences: [],
        certifications: [
            {
                id: cert1_id,
                name: cert1_name,
                achieved_day: cert1_achieved_day,
                achieved_month: cert1_achieved_month,
                achieved_year: cert1_achieved_year,
                expire_day: cert1_expire_day,
                expire_month: cert1_expire_month,
                expire_year: cert1_expire_year
            },
            {
                id: cert2_id,
                name: cert2_name,
                achieved_day: cert2_achieved_day,
                achieved_month: cert2_achieved_month,
                achieved_year: cert2_achieved_year,
                expire_day: cert2_expire_day,
                expire_month: cert2_expire_month,
                expire_year: cert2_expire_year
            },
            {
                id: cert3_id,
                name: cert3_name,
                achieved_day: cert3_achieved_day,
                achieved_month: cert3_achieved_month,
                achieved_year: cert3_achieved_year,
                expire_day: cert3_expire_day,
                expire_month: cert3_expire_month,
                expire_year: cert3_expire_year
            },            
            {
                id: cert4_id,
                name: cert4_name,
                achieved_day: cert4_achieved_day,
                achieved_month: cert4_achieved_month,
                achieved_year: cert4_achieved_year,
                expire_day: cert4_expire_day,
                expire_month: cert4_expire_month,
                expire_year: cert4_expire_year
            }
        ]
    };

    Ember.run(function() {
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/certificationSortNoExpiryDates', 200, null, response, 'GET');

        visit('/presences/certificationSortNoExpiryDates');

        andThen(function () {
            assert.equal(currentPath(), 'profile');

            //Sort rules:
            //I will see the License and Cert ordered by Expire year (farthest year from the present goes first).
            //  If same year. use month. if same month use day.
            //If License and Cert does not have an expire year it should show up first. 
            //  Sort determistically (alphabetical by License name) as shown in the mockup 

            //Verify sort order - should be:
            // cert2 - no dates - cert name starts with 'A'
            // cert1 - no dates - cert name starts with 'B'
            // cert4 - no expire date - cert name starts with 'C'
            // cert3 - no expire date - cert name starts with 'D'
            assert.equal($($('#presence_certification_section')[0].children[1].children[0])[0].id, 'elementId_' + cert2_id);
            assert.equal($($('#presence_certification_section')[0].children[1].children[1])[0].id, 'elementId_' + cert1_id);
            assert.equal($($('#presence_certification_section')[0].children[1].children[2])[0].id, 'elementId_' + cert4_id);
            assert.equal($($('#presence_certification_section')[0].children[1].children[3])[0].id, 'elementId_' + cert3_id);
        });
    });
});

test('Certification sorting - with expiry dates', function (assert) {

    assert.expect(9);

    var cert1_id = 'cert1';
    var cert1_name = 'Advanced Microsoft Visual Basic';
    var cert1_achieved_day = 1;
    var cert1_achieved_month = 1;
    var cert1_achieved_year = 2015;
    var cert1_expire_day = 1;
    var cert1_expire_month = 2;
    var cert1_expire_year = 2015;

    var cert2_id = 'cert2';
    var cert2_name = 'Advanced Microsoft Visual Basic';
    var cert2_achieved_day = 1;
    var cert2_achieved_month = 1;
    var cert2_achieved_year = 2015;
    var cert2_expire_day = 1;
    var cert2_expire_month = 3;
    var cert2_expire_year = 2015;

    var cert3_id = 'cert3';
    var cert3_name = 'Advanced Microsoft Visual Basic';
    var cert3_achieved_day = 1;
    var cert3_achieved_month = 1;
    var cert3_achieved_year = 2015;
    var cert3_expire_day = 1;
    var cert3_expire_month = 1;
    var cert3_expire_year = 2015;

    var cert4_id = 'cert4';
    var cert4_name = 'Basic Microsoft Visual Basic';
    var cert4_achieved_day = null;
    var cert4_achieved_month = null;
    var cert4_achieved_year = null;
    var cert4_expire_day = 1;
    var cert4_expire_month = 1;
    var cert4_expire_year = 2014;

    var cert5_id = 'cert5';
    var cert5_name = 'Advanced Microsoft Visual Basic';
    var cert5_achieved_day = 1;
    var cert5_achieved_month = 1;
    var cert5_achieved_year = 2015;
    var cert5_expire_day = 1;
    var cert5_expire_month = 1;
    var cert5_expire_year = 2014;

    var cert6_id = 'cert6';
    var cert6_name = 'Advanced Microsoft Visual Basic';
    var cert6_achieved_day = null;
    var cert6_achieved_month = null;
    var cert6_achieved_year = null;
    var cert6_expire_day = 2;
    var cert6_expire_month = 1;
    var cert6_expire_year = 2015;

    var cert7_id = 'cert7';
    var cert7_name = 'Advanced Microsoft Visual Basic';
    var cert7_achieved_day = null;
    var cert7_achieved_month = null;
    var cert7_achieved_year = null;
    var cert7_expire_day = null;
    var cert7_expire_month = 2;
    var cert7_expire_year = 2015;

    var cert8_id = 'cert8';
    var cert8_name = 'Advanced Microsoft Visual Basic';
    var cert8_achieved_day = 1;
    var cert8_achieved_month = 1;
    var cert8_achieved_year = 2015;
    var cert8_expire_day = null;
    var cert8_expire_month = null;
    var cert8_expire_year = 2015;

    var presence = {
        id: 'certificationSortWithExpiryDates',
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
        educations: [],
        experiences: [],
        certifications: [
            {
                id: cert1_id,
                name: cert1_name,
                achieved_day: cert1_achieved_day,
                achieved_month: cert1_achieved_month,
                achieved_year: cert1_achieved_year,
                expire_day: cert1_expire_day,
                expire_month: cert1_expire_month,
                expire_year: cert1_expire_year
            },
            {
                id: cert2_id,
                name: cert2_name,
                achieved_day: cert2_achieved_day,
                achieved_month: cert2_achieved_month,
                achieved_year: cert2_achieved_year,
                expire_day: cert2_expire_day,
                expire_month: cert2_expire_month,
                expire_year: cert2_expire_year
            },
            {
                id: cert3_id,
                name: cert3_name,
                achieved_day: cert3_achieved_day,
                achieved_month: cert3_achieved_month,
                achieved_year: cert3_achieved_year,
                expire_day: cert3_expire_day,
                expire_month: cert3_expire_month,
                expire_year: cert3_expire_year
            },
            {
                id: cert4_id,
                name: cert4_name,
                achieved_day: cert4_achieved_day,
                achieved_month: cert4_achieved_month,
                achieved_year: cert4_achieved_year,
                expire_day: cert4_expire_day,
                expire_month: cert4_expire_month,
                expire_year: cert4_expire_year
            },
            {
                id: cert5_id,
                name: cert5_name,
                achieved_day: cert5_achieved_day,
                achieved_month: cert5_achieved_month,
                achieved_year: cert5_achieved_year,
                expire_day: cert5_expire_day,
                expire_month: cert5_expire_month,
                expire_year: cert5_expire_year
            },
            {
                id: cert6_id,
                name: cert6_name,
                achieved_day: cert6_achieved_day,
                achieved_month: cert6_achieved_month,
                achieved_year: cert6_achieved_year,
                expire_day: cert6_expire_day,
                expire_month: cert6_expire_month,
                expire_year: cert6_expire_year
            },
            {
                id: cert7_id,
                name: cert7_name,
                achieved_day: cert7_achieved_day,
                achieved_month: cert7_achieved_month,
                achieved_year: cert7_achieved_year,
                expire_day: cert7_expire_day,
                expire_month: cert7_expire_month,
                expire_year: cert7_expire_year
            },            
            {
                id: cert8_id,
                name: cert8_name,
                achieved_day: cert8_achieved_day,
                achieved_month: cert8_achieved_month,
                achieved_year: cert8_achieved_year,
                expire_day: cert8_expire_day,
                expire_month: cert8_expire_month,
                expire_year: cert8_expire_year
            }
        ]
    };

    Ember.run(function() {
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/certificationSortWithExpiryDates', 200, null, response, 'GET');

        visit('/presences/certificationSortWithExpiryDates');

        andThen(function () {
            assert.equal(currentPath(), 'profile');

            //Sort rules:
            //I will see the License and Cert ordered by Expire year (farthest year from the present goes first).
            //  If same year. use month. if same month use day.
            //If License and Cert does not have an expire year it should show up first. 
            //  Sort determistically (alphabetical by License name) as shown in the mockup 

            //Verify sort order - should be:
            // cert2 - expire: day 1 month 3 year 2015
            // cert1 - expire: day 1 month 2 year 2015
            // cert7- expire: no day month 2 year 2015
            // cert6 - expire: day 2 month 1 year 2015
            // cert3 - expire: day 1 month 1 year 2015
            // cert8- expire: no day no month year 2015
            // cert5 - expire: day 1 month 1 year 2014 - cert name starts with 'A'
            // cert4- expire: day 1 month 1 year 2014 - cert name starts with 'B'
            assert.equal($($('#presence_certification_section')[0].children[1].children[0])[0].id, 'elementId_' + cert2_id);
            assert.equal($($('#presence_certification_section')[0].children[1].children[1])[0].id, 'elementId_' + cert1_id);
            assert.equal($($('#presence_certification_section')[0].children[1].children[2])[0].id, 'elementId_' + cert7_id);
            assert.equal($($('#presence_certification_section')[0].children[1].children[3])[0].id, 'elementId_' + cert6_id);
            assert.equal($($('#presence_certification_section')[0].children[1].children[4])[0].id, 'elementId_' + cert3_id);
            assert.equal($($('#presence_certification_section')[0].children[1].children[5])[0].id, 'elementId_' + cert8_id);
            assert.equal($($('#presence_certification_section')[0].children[1].children[6])[0].id, 'elementId_' + cert5_id);
            assert.equal($($('#presence_certification_section')[0].children[1].children[7])[0].id, 'elementId_' + cert4_id);
        });
    });
});
