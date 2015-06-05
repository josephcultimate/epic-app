moduleForComponent('search-bar', 'Components/Search Bar', {

    setup: function() {
        this.appPost = App.post;
        JsHamcrest.Integration.QUnit();
        JsMockito.Integration.QUnit();
    },
    teardown: function() {
        App.post = this.appPost;
        $.mockjax.clear();
    }
});

var displayTextS0 = 'displayTextS0';
var displayTextS1 = 'displayTextS1';

function assertState(assert, component, state, searchText, keepFocus, isWorking) {

    var actualHasFocus = component.get('hasFocus');
    var actualIsCollapsed = component.get('isCollapsed');
    var actualIsExpanded = component.get('isExpanded');
    var actualIsExpandedDirty = component.get('isExpandedDirty');
    var actualIsLogged = component.get('isLogged');
    var actualKeepFocus = component.get('keepFocus');
    var actualPlaceholderText = component.get('placeholderText');
    var actualSearchState = component.get('searchState');
    var actualSearchText = component.get('searchText');

    if (state == component.STATE_S0) {
        assert.equal(actualHasFocus, false);
        assert.equal(actualIsCollapsed, true);
        assert.equal(actualIsExpanded, false);
        assert.equal(actualIsExpandedDirty, false);
        assert.equal(actualIsLogged, false);
        assert.equal(actualKeepFocus, keepFocus);
        assert.equal(actualPlaceholderText, displayTextS0);
        assert.equal(actualSearchState, state);
        assert.equal(actualSearchText, searchText);
    }
    else if (state === component.STATE_S1) {
        assert.equal(actualHasFocus, true);
        assert.equal(actualIsCollapsed, false);
        assert.equal(actualIsExpanded, true);
        assert.equal(actualIsExpandedDirty, false);
        assert.equal(actualIsLogged, false);
        assert.equal(actualKeepFocus, keepFocus);
        assert.equal(actualPlaceholderText, displayTextS1);
        assert.equal(actualSearchState, state);
        assert.equal(actualSearchText, searchText);
    }
    else if (state === component.STATE_S2 || state === component.STATE_S3) {
        assert.equal(actualHasFocus, true);
        assert.equal(actualIsCollapsed, false);
        assert.equal(actualIsExpanded, true);
        assert.equal(actualIsExpandedDirty, !isWorking);
        assert.equal(actualIsLogged, false);
        assert.equal(actualKeepFocus, keepFocus);
        assert.equal(actualPlaceholderText, displayTextS1);
        assert.equal(actualSearchState, state);
        assert.equal(actualSearchText, searchText);
    }
    else if (state == component.STATE_S4) {
        assert.equal(actualHasFocus, false);
        assert.equal(actualIsCollapsed, true);
        assert.equal(actualIsExpanded, false);
        assert.equal(actualIsExpandedDirty, false);
        assert.equal(actualIsLogged, false);
        assert.equal(actualKeepFocus, keepFocus);
        assert.equal(actualPlaceholderText, displayTextS0);
        assert.equal(actualSearchState, state);
        assert.equal(actualSearchText, searchText);
    }
}

function createEvent(keyCode) {
    return {'keyCode': keyCode, 'preventDefault': function() {}};
}

function createComponent(test, searchResults) {

    var component = test.subject();

    // when testing, the delay function is pass-through
    component.set('delay', function(func, delay) { Ember.run(function() { func(); }); });

    // replace the texts to bypass translation
    component.set('displayTextS0', function() { return displayTextS0; });
    component.set('displayTextS1', function() { return displayTextS1; });

    // no network traffic, thanks
    var oldSearchRequest = component.set('oldDoSearchRequest', component.get('doSearchRequest'));

    component.set('doSearchRequest', function(searchPhrase) {

        App.post = function() {
            return new Ember.RSVP.Promise(function(resolve, reject) {
                if (searchResults) {
                    resolve(searchResults);
                } else {
                    reject(searchResults);
                }
            });
        };

        component.oldDoSearchRequest(searchPhrase);
    });

    // when testing, the ensureVisible function is pass-through
    component.set('htmlEnsureVisible', function() { });

    // replace html interaction related functions
    component.set('htmlSearchBlur', function() { });
    component.set('htmlSearchFocus', function() { });

    return component;
}

test('Should initialize with state S0', function(assert) {
    assert.expect(9);

    // create a properly initialized component
    var component = createComponent(this);

    // state transitions: => S0
    assertState(assert, component, component.STATE_S0, '', false, false);
});

test('Should be able to transition from S0 to S1', function(assert) {
    assert.expect(9);

    // create a properly initialized component
    var component = createComponent(this);

    // send a 'searchEnter' action and observe what happens...
    component.send('searchEnter');

    // state transitions: => S0 => S1
    assertState(assert, component, component.STATE_S1, '', false, false);
});

test('Should be able to transition from S0 to S1 and back to S0', function(assert) {
    assert.expect(9);

    // create a properly initialized component
    var component = createComponent(this);

    // send a 'searchEnter' action...
    component.send('searchEnter');

    // then send a 'searchExit' action and observe what happens...
    component.send('searchExit');

    // state transitions: => S0 => S1 => S0
    assertState(assert, component, component.STATE_S0, '', false, false);
});

test('Should be able to transition from S0 to S1 to S2', function(assert) {
    assert.expect(18);

    var searchPhraseShort = 'F';
    var searchPhraseLong = 'FirstName SecondName';

    // create a properly initialized component
    var component = createComponent(this);

    // send a 'searchEnter' action...
    component.send('searchEnter');

    // then enter a short search phrase
    component.set('searchText', searchPhraseShort);

    // state transitions: => S0 => S1 => S2
    assertState(assert, component, component.STATE_S2, searchPhraseShort, false, false);

    // then enter a long search phrase
    component.set('searchText', searchPhraseLong);

    // state transitions: => S0 => S1 => S3
    assertState(assert, component, component.STATE_S3, searchPhraseLong, false, false);
});

test('Should be able to transition from S0 to S1 to S2 and back to S1', function(assert) {
    assert.expect(9);

    var searchPhrase = 'FirstName SecondName';

    // create a properly initialized component
    var component = createComponent(this);

    // send a 'searchEnter' action...
    component.send('searchEnter');

    // then enter a search phrase...
    component.set('searchText', searchPhrase);

    // then send a 'searchClear' action
    component.send('searchClear');

    // state transitions: => S0 => S1 => S2 => S1
    assertState(assert, component, component.STATE_S1, '', true, false);
});

test('Should be able to transition from S0 to S1 to S3 to S4', function(assert) {
    assert.expect(9);

    var searchPhrase = 'FirstName SecondName';

    // create a properly initialized component
    var component = createComponent(this);

    // send a 'searchEnter' action...
    component.send('searchEnter');

    // then enter a search phrase...
    component.set('searchText', searchPhrase);

    // then send a 'searchExit' action
    component.send('searchExit');

    // state transitions: => S0 => S1 => S3 => S4
    assertState(assert, component, component.STATE_S4, searchPhrase, false, false);
});

test('Should be able to transition from S0 to S1 to S3 to S4 and back to S3', function(assert) {
    assert.expect(9);

    var searchResults = {
        presences: [
            {
                id: 'PresenceId',
                first_name: 'FirstName',
                last_name: 'LastName'
            },
        ]
    };

    var searchPhrase = 'FirstName SecondName';

    // create a properly initialized component
    var component = createComponent(this, searchResults);

    // send a 'searchEnter' action...
    component.send('searchEnter');

    // then enter a search phrase...
    component.set('searchText', searchPhrase);

    // then send a 'searchExit' action...
    component.send('searchExit');

    // then send a 'searchEnter' action again
    component.send('searchEnter');

    // state transitions: => S0 => S1 => S3 => S4 => S3
    assertState(assert, component, component.STATE_S3, searchPhrase, false, true);
});

test('Should be able to transition from S0 to S1 to S3 and perform successful search', function(assert) {
    assert.expect(12);

    var actualAction = null;
    var actualParam1 = null;
    var expectedParam1 = 'SearchResponseIdentifier';
    var searchPhrase = 'FirstName SecondName';
    var searchResults = {
        presences: [
            {
                id: 'SearchResponseIdentifier',
                first_name: 'FirstName',
                last_name: 'LastName'
            },
        ]
    };

    // create a properly initialized component
    var component = createComponent(this, searchResults);

    // force rendering-- needed by the forced blurring triggered by ESC
    //equal(this.$().attr('class'), "ember-view navbar-form navbar-right search-container");

    // send a 'searchEnter' action...
    Ember.run(function() {
        component.send('searchEnter');
    });

    // then enter a search phrase... note that this has side effects!
    Ember.run(function() {
        component.set('searchText', searchPhrase);
    });

    // mock the target on which transitionTo action is to be sent after a successful search
    var mockTarget = mock(App.ApplicationController);
    when(mockTarget).send('transitionToProfile', anything()).then(function(action, param1) {
        actualAction = action;
        actualParam1 = param1;
    });
    component.set('targetObject', mockTarget);

    Ember.run(function() {
        // then execute the search
        component.doSearchExecute();
    });

    // at this point, we must have some visible results!
    assert.equal(true, component.get('hasVisibleSearchResults'));

    // hit ENTER on the active search result
    Ember.run(function() {
        component.keyDown(createEvent(component.KEY_ENTER));
    });

    // simulate the natural exit after a search success
    Ember.run(function() {
        component.send('searchExit');
    });

    // state transitions: => S0 => S1 => S3 => P (~S0)
    assertState(assert, component, component.STATE_S0, '', false, true);
    assert.equal(actualAction, 'transitionToProfile');
    assert.equal(actualParam1, expectedParam1);
});

test('Should be able to transition from S0 to S1 to S3 and perform failed search', function(assert) {
    assert.expect(9);

    var searchPhrase = 'FirstName SecondName';

    // create a properly initialized component
    var component = createComponent(this);

    // send a 'searchEnter' action...
    component.send('searchEnter');

    // then enter a search phrase...
    component.set('searchText', searchPhrase);

    // the post request returns a failure response
    App.post = function() {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            reject();
        });
    };

    Ember.run(function() {
        // then execute the search
        component.doSearchExecute();
    });

    // state transitions: => S0 => S1 => S3
    assertState(assert, component, component.STATE_S3, searchPhrase, false, false);
});

test('Should be able to transition from S0 to S1 and back to S0 via ESC', function(assert) {
    assert.expect(10);

    // create a properly initialized component
    var component = createComponent(this);

    // force rendering-- needed by the forced blurring triggered by ESC
    equal(this.$().attr('class'), "ember-view navbar-form navbar-right search-container");

    Ember.run(function() {

        // send a 'searchEnter' action...
        component.send('searchEnter');

        // then send an ESC key
        component.keyDown(createEvent(component.KEY_ESCAPE));

        // state transitions: => S0 => S1 => S0
        assertState(assert, component, component.STATE_S0, '', false, false);
    });
});

test('Should be able to transition from S0 to S1 to S3 and back to S1 via ESC', function(assert) {
    assert.expect(9);

    var searchPhrase = 'FirstName SecondName';

    // create a properly initialized component
    var component = createComponent(this);

    // send a 'searchEnter' action...
    component.send('searchEnter');

    // then enter a search phrase...
    component.set('searchText', searchPhrase);

    // then send an ESC key
    component.keyDown(createEvent(component.KEY_ESCAPE));

    // state transitions: => S0 => S1 => S2 => S1
    assertState(assert, component, component.STATE_S1, '', false, false);
});

test('Should be able to transition from S0 to S1 to S3 and perform failed search via ENTER', function(assert) {
    assert.expect(9);

    var searchPhrase = 'FirstName SecondName';

    // create a properly initialized component, with an actual delayed blur
    var component = createComponent(this);

    // the post request returns a failure response
    App.post = function() {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            reject();
        });
    };

    Ember.run(function() {
        // send a 'searchEnter' action...
        component.send('searchEnter');
    });

    Ember.run(function() {
        // then enter a search phrase...
        component.set('searchText', searchPhrase);
    });

    Ember.run(function() {
        // then execute the search
        component.doSearchExecute();
    });

    // state transitions: => S0 => S1 => S3.
    assertState(assert, component, component.STATE_S3, searchPhrase, false, false);
});

test('Should be able to delay blur', function(assert) {

    var didDelayBlur = 0;

    // create a properly initialized component
    var component = createComponent(this);

    component.blurShouldDelay = function() {
        didDelayBlur++;
        return didDelayBlur <= 2;
    };

    component.delayedBlurBegin();
    assert.equal(didDelayBlur, 3, "Should have delayed blur twice.");
});

test('Should be able to transition from S0 to S1 to S3 and select index and transition to profile by index', function(assert) {
    assert.expect(22);

    var expectedParam1 = 'SecondSearchResponseIdentifier';
    var searchPhrase = 'FirstName SecondName';
    var searchResults = {
        presences: [
            {
                id: 'SearchResponseIdentifier',
                first_name: 'FirstName',
                last_name: 'LastName'
            },
            {
                id: 'SecondSearchResponseIdentifier',
                first_name: 'SecondFirstName',
                last_name: 'SecondLastName'
            },
        ]
    };

    // create a properly initialized component
    var component = createComponent(this, searchResults);

    // force rendering-- needed by the forced blurring triggered by ESC
    //equal(this.$().attr('class'), "ember-view navbar-form navbar-right search-container");

    // send a 'searchEnter' action...
    Ember.run(function() {
        component.send('searchEnter');
    });

    // then enter a search phrase... note that this has side effects!
    Ember.run(function() {
        component.set('searchText', searchPhrase);
    });

    Ember.run(function() {
        // then execute the search
        component.doSearchExecute();
    });

    // at this point, we must have some visible results!
    assert.equal(true, component.get('hasVisibleSearchResults'));

    // simulate selecting the second result
    Ember.run(function() {
        component.send('selectIndex', 1);
    });

    // state transitions: => S0 => S1 => S3 => P (~S0)
    assertState(assert, component, component.STATE_S3, searchPhrase, false, false);

    // at this point, the second search result should be active
    assert.equal(1, component.get('activeIndex'));

    // mock the target on which transitionTo action is to be sent after a successful search
    var mockTarget = mock(App.ApplicationController);
    when(mockTarget).send('transitionToProfile', anything()).then(function(action, param1) {
        actualAction = action;
        actualParam1 = param1;
    });
    component.set('targetObject', mockTarget);

    // transition to the currently active profile
    Ember.run(function() {
        component.send('transitionToProfileByIndex');
    });

    // state transitions: => S0 => S1 => S3 => P (~S0)
    assertState(assert, component, component.STATE_S0, '', false, true);
    assert.equal(actualAction, 'transitionToProfile');
    assert.equal(actualParam1, expectedParam1);
});
