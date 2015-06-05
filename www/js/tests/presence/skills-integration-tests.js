module('Integration/Presence Skills', {

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

test('Should render presence page with skills', function (assert) {

    assert.expect(6);

    var sk1_id = 'sk1';
    var sk1_description = 'Diving';
    var sk1_willing_to_help = 'true';

    var sk2_id = 'sk2';
    var sk2_description = 'Driving';
    var sk2_willing_to_help = 'false';

    var presence = {
        id: 'renderWithSkills',
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
        skills: [
            {
                id: sk1_id,
                description: sk1_description,
                willing_to_help: sk1_willing_to_help
            },
            {
                id: sk2_id,
                description: sk2_description,
                willing_to_help: sk2_willing_to_help
            },
        ]
    };

    Ember.run(function() {
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/renderWithSkills', 200, null, response, 'GET');

        visit('/presences/renderWithSkills');

        andThen(function () {
            assert.equal(currentPath(), 'profile');

            var renderedTitle = $($('#presence_skill_section')[0].children[0]).text().trim();

            if (renderedTitle.indexOf('system.') > 0) {
                assert.equal(renderedTitle, "Missing translation: system.presence.skill");
            } else {
                assert.equal(renderedTitle, "Skills");
            }

            //Verify that the basic fields are being rendered
            //  and the willing to help styling is applied when it is set, and not applied when not set
            assert.ok($($('#skill_' + sk1_id)[0].children[0]).hasClass("shared"), "Should have willing to help");
            assert.equal($('#skill_' + sk1_id).text().trim(), sk1_description);

            assert.notOk($($('#skill_' + sk2_id)[0].children[0]).hasClass("shared"), "Should not have willing to help");
            assert.equal($('#skill_' + sk2_id).text().trim(), sk2_description);
        });
    });
});

test('No Skills', function (assert) {

    assert.expect(3);

    var presence = {
        id: 'noSkills',
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
        skills: []
    };

    Ember.run(function() {
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/noSkills', 200, null, response, 'GET');

        visit('/presences/noSkills');

        andThen(function () {            
            assert.equal(currentPath(), 'profile');

            var renderedTitle = $($('#presence_skill_section')[0].children[0]).text().trim();

            if (renderedTitle.indexOf('system.') > 0) {
                assert.equal(renderedTitle, "Missing translation: system.presence.skill");
            } else {
                assert.equal(renderedTitle, "Skills");
            }

            var renderedExperience = $($('#presence_skill_section')[0].children[1]).text().trim();

            if (renderedExperience.indexOf('system.') > 0) {
                assert.equal(renderedExperience, "Missing translation: system.presence.skill.missing");
            } else {
                assert.equal(renderedExperience, "Come back later to see my skills.");
            }
         });
    });
});

test('Skills sorting order', function (assert) {

    assert.expect(4);

    var sk1_id = 'sk1';
    var sk1_description = 'Lion Taming';

    var sk2_id = 'sk2';
    var sk2_description = 'Reading';

    var sk3_id = 'sk3';
    var sk3_description = 'Diving';

    var presence = {
        id: 'skillsSortOrder',
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
        skills: [
            {
                id: sk1_id,
                description: sk1_description
            },
            {
                id: sk2_id,
                description: sk2_description
            },
            {
                id: sk3_id,
                description: sk3_description
            },
        ]
    };

    Ember.run(function() {
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/skillsSortOrder', 200, null, response, 'GET');

        visit('/presences/skillsSortOrder');

        andThen(function () {
            assert.equal(currentPath(), 'profile');

            //Sort rules:
            //Alphabetically by description

            //Verify sort order
            assert.equal($($('#presence_skill_section')[0].children[1].children[0])[0].id, 'skill_' + sk3_id);
            assert.equal($($('#presence_skill_section')[0].children[1].children[1])[0].id, 'skill_' + sk1_id);
            assert.equal($($('#presence_skill_section')[0].children[1].children[2])[0].id, 'skill_' + sk2_id);
        });
    });
});
