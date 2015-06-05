module('Integration/Presence Hobbies', {

    setup: function () {
        JsHamcrest.Integration.QUnit();
        JsMockito.Integration.QUnit();
        Ember.run(function() {
            App.advanceReadiness();
        });
    },

    teardown: function () {
        $('.ember-view').hide();
                
        Ember.run(function(){
            App.set('presence', null);
            App.set('user', null);
        });
    }
});

test('Should render presence page with hobbies', function (assert) {

    assert.expect(4);

    var hob1_id = 'hob1';
    var hob1_name = 'Scuba diving!';

    var hob2_id = 'hob2';
    var hob2_name = 'Bowling?!';

    var presence = {
        id: 'renderWithHobbies',
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
        experiences: [],
        hobbies: [
            {
                id: hob1_id,
                name: hob1_name
            },
            {
                id: hob2_id,
                name: hob2_name
            },
        ]
    };

    Ember.run(function() {
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/renderWithHobbies', 200, null, response, 'GET');

        visit('/presences/renderWithHobbies');

        andThen(function () {
            assert.equal(currentPath(), 'profile');

            var renderedTitle = $($('#presence_hobbies_section')[0].children[0]).text().trim();

            if (renderedTitle.indexOf('system.') > 0) {
                assert.equal(renderedTitle, "Missing translation: system.presence.hobbies");
            } else {
                assert.equal(renderedTitle, "Hobbies");
            }

            //Verify that the names of the hobbies are being rendered
            assert.equal($('#hobby_' + hob1_id).text().trim(), hob1_name);
            assert.equal($('#hobby_' + hob2_id).text().trim(), hob2_name);
        });
    });
});

test('No Hobbies', function (assert) {

    assert.expect(3);

    var presence = {
        id: 'noHobbies',
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

        mockServerCalls('/api/presences/noHobbies', 200, null, response, 'GET');

        visit('/presences/noHobbies');

        andThen(function () {            
            assert.equal(currentPath(), 'profile');

            var renderedTitle = $($('#presence_hobbies_section')[0].children[0]).text().trim();

            if (renderedTitle.indexOf('system.') > 0) {
                assert.equal(renderedTitle, "Missing translation: system.presence.hobbies");
            } else {
                assert.equal(renderedTitle, "Hobbies");
            }

            var renderedExperience = $($('#presence_hobbies_section')[0].children[1]).text().trim();

            if (renderedExperience.indexOf('system.') > 0) {
                assert.equal(renderedExperience, "Missing translation: system.presence.hobbies.missing");
            } else {
                assert.equal(renderedExperience, "Come back later to see my hobbies.");
            }
        });
    });
});

test('Hobbies sorting order', function (assert) {

    assert.expect(4);

    var hob1_id = 'hob1';
    var hob1_name = 'Scuba diving!';

    var hob2_id = 'hob2';
    var hob2_name = 'Bowling?!';

    var hob3_id = 'hob3';
    var hob3_name = 'Jumping?';

    var presence = {
        id: 'hobbiesSortOrder',
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
        experiences: [],
        hobbies: [
            {
                id: hob1_id,
                name: hob1_name
            },
            {
                id: hob2_id,
                name: hob2_name
            },
            {
                id: hob3_id,
                name: hob3_name
            },
        ]
    };

    Ember.run(function() {
        App.setSessionToken('Bearer AnyTokenWillDo');

        App.set('user', presence);
        App.set('presence', presence);

        var response = JSON.stringify({presence: presence});

        mockServerCalls('/api/presences/hobbiesSortOrder', 200, null, response, 'GET');

        visit('/presences/hobbiesSortOrder');

        andThen(function () {
            assert.equal(currentPath(), 'profile');

            //Sort rules:
            //Sort by hobby name alphabetically

            //Verify sort order
            assert.equal($($('#presence_hobbies_section')[0].children[1].children[0])[0].id, 'hobby_' + hob2_id);
            assert.equal($($('#presence_hobbies_section')[0].children[1].children[1])[0].id, 'hobby_' + hob3_id);
            assert.equal($($('#presence_hobbies_section')[0].children[1].children[2])[0].id, 'hobby_' + hob1_id);
        });
    });
});
