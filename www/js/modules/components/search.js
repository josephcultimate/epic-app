App.SearchBarComponent = Ember.Component.extend({

    // we must declare component dependencies
    needs: ['component:search-result'],

    // keyboard constants
    KEY_DOWN: 40,
    KEY_ENTER: 13,
    KEY_ESCAPE: 27,
    KEY_UP: 38,

    // constants to synchronize the component
    BOUNCE_DELAY: 300,
    INITIAL_BLUR_DELAY: 300,
    INCREMENTAL_BLUR_DELAY: 100,

    // constants: abstract internal states
    STATE_S0: 0, // focus: N; size: SM; place holder: displayTextS0; widgets(s): gray search; search text: none
    STATE_S1: 1, // focus: Y; size: LG; place holder: displayTextS1; widgets(s): green search; search text: none
    STATE_S2: 2, // focus: Y; size: LG; place holder: search text (len  < 2); widgets(s): green search, cancel, search results; search text: typed text
    STATE_S3: 3, // focus: Y; size: LG; place holder: search text (len >= 2); widgets(s): green search, cancel; search text: typed text
    STATE_S4: 4, // focus: N; size: SM; place holder: collapsed search text; button(s): gray search; search text: typed text

    MAX_DATA_SIZE: 15,      // max number of search results loaded
    MAX_DISPLAY_SIZE: 6,    // max number of search results in view port
    MIN_SEARCH_TEXT: 2,     // min number of characters that trigger a search request

    // constants to help manage the active result index
    MIN_RESULT_INDEX: 0,
    DEFAULT_RESULT_INDEX: -1,

    // currently active search result index
    activeIndex: this.DEFAULT_RESULT_INDEX,

    // delays blurring the search control, to allow proper handling of click event handlers on search icons
    blur: function() {

        // mark as blurring
        this.set('isBlurring', true);

        var forceBlur = this.get('forceBlur');
        var keepFocus = this.get('keepFocus');

        if (keepFocus) {
            this.htmlSearchFocus();
        } else {
            this.set('hasFocus', false);
            if (forceBlur) {
                this.htmlSearchBlur();
            }
        }

        this.set('forceBlur', false);
        this.set('keepFocus', false);
        this.set('isWidgetAction', false);

        // clear the blurring flag
        this.set('isBlurring', false);
    },

    blurShouldDelay: function() {

        // short-circuit
        if (this.get('isBlurring')) {
            return false;
        }

        // if the component is not in a valid state, bail out
        if (this.isDestroying || this.isDestroyed) {
            return false;
        }

        // when not working, no delay is necessary-- blur and exit
        if (!this.get('isWorking')) {
            this.blur();
            return false;
        }

        return true;
    },

    // use these classes
    classNames: ['navbar-form', 'navbar-right', 'search-container'],

    // use each of these classes if the respective boolean property is true
    classNameBindings: ['isExpanded:expanded', 'isLogged:logged'],

    // delegates the delay mechanism to Ember.run.later(...)
    delay: function(func, delay) {
        Ember.run.later(func, delay);
    },

    // delays blurring the search control, to allow proper handling of click event handlers on search icons
    delayedBlur: function() {

        if (!this.blurShouldDelay()) {
            return;
        }

        // delay for INCREMENTAL_BLUR_DELAY ms and try again
        var self = this;
        this.delay((function() {
            self.delayedBlur();
        }), self.INCREMENTAL_BLUR_DELAY);
    },

    // begins a delayed blur interaction
    delayedBlurBegin: function(forceDelay) {

        if (!forceDelay && !this.blurShouldDelay()) {
            return;
        }

        // delay for INITIAL_BLUR_DELAY ms and try again
        var self = this;
        this.delay((function() {
            self.delayedBlur();
        }), self.INITIAL_BLUR_DELAY);
    },

    // I18N constant: standard search placeholder text
    displayTextS0: function() {
        return Ember.I18n.t('system.search.placeholder');
    },

    // I18N constant: standard expanded search placeholder text
    displayTextS1: function() {
        return Ember.I18n.t('system.search.placeholder.expanded');
    },

    doSearchCancel: function() {
        var searchText = this.get('searchText');

        if (!searchText) {
            this.set('forceBlur', true);
            this.delayedBlurBegin(false);
        } else {
            this.doSearchClear();
        }
    },

    doSearchClear: function() {
        this.set('searchText', '');
        this.set('searchResults', []);
    },

    doSearchEnter: function () {
        this.set('hasFocus', true);
        this.doSearchExecute();
    },

    doSearchExecute: function () {

        var state = this.get('searchState');
        var searchText = (this.get('searchText') || '').trim();

        if (state == this.STATE_S3) {
            this.doSearchRequest(searchText);
        }
    },

    doSearchExit: function() {
        this.delayedBlurBegin(true);
    },

    // initiates a search request in the background
    doSearchRequest: function (searchPhrase) {

        this.set('isWorking', true);
        this.set('searchResults', []);
        this.setActiveIndex(this.DEFAULT_RESULT_INDEX);

        var payload = {
            "searchText": searchPhrase
        };

        var postRequest = App.PostRequest.create({
            endpointRoute: '/api/presences/search',
            data: JSON.stringify(payload)
        });

        var promise = App.post(postRequest);
        promise.then(this.onSearchSuccess(), this.onSearchError());
    },

    doSelectIndex: function (newIndex) {

        var results = this.get('searchResults');
        var currentIndex = this.get('activeIndex');

        if (newIndex !== currentIndex) {

            // deselect the current result
            if (currentIndex > this.DEFAULT_RESULT_INDEX && currentIndex < results.length) {
                var oldResult = results[currentIndex];
                oldResult.set('isActive', false);
            }

            // set the new current result
            if (newIndex > this.DEFAULT_RESULT_INDEX && newIndex < results.length) {
                var newResult = results[newIndex];
                newResult.set('isActive', true);
                this.setActiveIndex(newIndex);
                this.htmlEnsureVisible(newIndex);
            }
        }
    },

    // transitions to the profile associated with the selected/clicked search result
    doTransitionToProfile: function(profileId) {

        var target = this.get('targetObject');
        target.send('transitionToProfile', profileId);

        this.doSearchClear();
        this.set('forceBlur', true);
        this.set('keepFocus', false);
        this.blur();
    },

    // determines if the widget currently has focus
    hasFocus: false,

    // results are visible only when state is S3 **and** one or more results are available
    hasVisibleSearchResults: function() {
        var state = this.get('searchState');
        var results = this.get('searchResults');
        return (state == this.STATE_S3) && results && results.length > 0;
    }.property('searchResults', 'searchState'),

    // inspects the DOM structure for search results and makes sure the active result is fully visible
    htmlEnsureVisible: function(index) {

        // element is the search results div
        var $element = $(this.$().children()[1]);

        // child points to the active search result entry container div
        var parent = $element[0];
        var result = $element.children()[index];

        var scroll = parent.scrollTop;
        var height = parent.clientHeight;
        var offset = result.offsetTop;
        var frame = result.clientHeight;

        var isAboveView = (offset < scroll);
        var isBelowView = (offset + frame > scroll + height);

        if (isAboveView) {
            parent.scrollTop = offset;
        } else if (isBelowView) {
            parent.scrollTop = (offset + frame) - height;
        }
    },

    htmlSearchBlur: function() {
        this.$().find('#search').blur();
    },

    htmlSearchFocus: function() {
        this.$().find('#search').focus();
    },

    // the component is collapsed when the widget does not have focus
    isCollapsed: function() {
        var state = this.get('searchState');
        return (state == this.STATE_S0) || (state == this.STATE_S4);
    }.property('searchState'),

    // the component is expanded when the widget has focus
    isExpanded: function() {
        var state = this.get('searchState');
        return (state == this.STATE_S1) || (state == this.STATE_S2) || (state == this.STATE_S3);
    }.property('searchState'),

    // the component is expanded and dirty when the widget has focus and non-empty search text
    isExpandedDirty: function() {
        var state = this.get('searchState');
        var isWorking = this.get('isWorking');
        return !isWorking && ((state == this.STATE_S2) || (state == this.STATE_S3));
    }.property('searchState','isWorking'),

    isLogged: function() {
        var token = App.get('session_token');
        return typeof token !== "undefined" && token !== null && token !== 'Bearer None';
    }.property('App.session_token'),

    // indicates whether an ongoing action handler was triggered via a widget interaction
    isWidgetAction: false,

    keepFocus: false,

    keyDown: function(event) {

        var keyCode = event.which || event.keyCode;

        var results = this.get('searchResults');
        var currentIndex = this.get('activeIndex');
        var newIndex = currentIndex;

        if (keyCode === this.KEY_UP) {

            if (currentIndex > this.MIN_RESULT_INDEX) {
                newIndex = currentIndex - 1;
            }
        } else if (keyCode === this.KEY_DOWN) {

            if (currentIndex < results.length - 1) {
                newIndex = currentIndex + 1;
            }
        }

        if (currentIndex !== newIndex) {
            this.doSelectIndex(newIndex);
            event.preventDefault();

        } else if (keyCode === this.KEY_ENTER) {

            // find the currently active result
            if (currentIndex > this.DEFAULT_RESULT_INDEX && currentIndex < results.length) {
                var currentResult = results[currentIndex];
                this.doTransitionToProfile(currentResult.get('id'));
            }
            event.preventDefault();

        } else if (keyCode === this.KEY_ESCAPE) {

            this.doSearchCancel();
            event.preventDefault();
        }
    },

    // place holder text depends on the component's state
    placeholderText: function() {

        var hasFocus = this.get('hasFocus');

        if (!hasFocus) {
            return this.get('displayTextS0')();
        }

        return this.get('displayTextS1')();

    }.property('hasFocus'),

    onSearchSuccess: function() {
        var self = this;
        return function(data, success, response) {

            self.set('isWorking', false);
            var results = [];

            if (data.presences) {
                var presences = data.presences;
                var presencesLength = presences.length;

                for (i = 0; i < presencesLength; i++) {
                    results.push(Ember.Object.create(presences[i]));
                    results[i].set('isActive', i === 0);
                    results[i].set('index', i);
                }

                if (presencesLength > 0) {
                    self.setActiveIndex(0);
                }
            }

            self.set('searchResults', results);
        };
    },

    onSearchError: function() {
        var self = this;
        return function(data) {
            self.set('isWorking', false);
            self.set('keepFocus', false);
            self.set('searchResults', []);
        };
    },

    onSearchTextChanged: function() {
        Ember.run.debounce(this, this.doSearchExecute, this.BOUNCE_DELAY);
    }.observes('searchText'),

    // current search results
    searchResults: [],

    // current internal search state
    searchState: function() {

        var hasFocus = this.get('hasFocus');
        var searchText = (this.get('searchText') || '').trim();

        if (!hasFocus && searchText === '') {
            return this.STATE_S0;
        }

        if (hasFocus && searchText === '') {
            return this.STATE_S1;
        }

        // all remaining states should update the search
        this.set('searchResults', []);

        if (hasFocus && searchText !== '') {
            if (searchText.length < this.MIN_SEARCH_TEXT) {
                return this.STATE_S2;
            }
            return this.STATE_S3;
        }

        return this.STATE_S4;

    }.property('hasFocus', 'searchText'),

    // search text typed by the user
    searchText: '',

    setActiveIndex: function(value) {
        this.set('activeIndex', value);
    },

    actions: {
        searchClear: function() {

            this.set('isWidgetAction', true);
            this.set('keepFocus', true);
            this.doSearchClear();
        },

        searchEnter: function() {

            this.set('isWidgetAction', false);
            this.set('keepFocus', false);
            this.doSearchEnter();
        },

        searchExit: function() {

            this.set('isWidgetAction', false);
            this.set('keepFocus', false);
            this.doSearchExit();
        },

        selectIndex: function (newIndex) {

            this.set('keepFocus', false);
            this.doSelectIndex(newIndex);
        },

        transitionToProfile: function(profileId) {

            this.set('isWidgetAction', true);
            this.set('keepFocus', false);
            this.doTransitionToProfile(profileId);
        },

        transitionToProfileByIndex: function() {

            this.set('isWidgetAction', true);
            this.set('keepFocus', false);

            var index = this.get('activeIndex');
            if (index !== this.DEFAULT_RESULT_INDEX) {
                var results = this.get('searchResults') || [];
                if (results.length > index) {
                    this.doTransitionToProfile(results[index].get('id'));
                }
            }
        }
    }
});
