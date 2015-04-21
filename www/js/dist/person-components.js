App.SearchBarComponent = Ember.Component.extend({

    // constants: standard display texts
    DISPLAY_TEXT_S0: "Search", // TODO: i18n
    DISPLAY_TEXT_S1: "Search by people name, skills, location", // TODO: i18n

    // constants: abstract internal states
    STATE_S0: 0, // focus: N; size: SM; place holder: DISPLAY_TEXT_S0; button(s): gray search; search text: none
    STATE_S1: 1, // focus: Y; size: LG; place holder: DISPLAY_TEXT_S1; button(s): green search; search text: none
    STATE_S2: 2, // focus: Y; size: LG; place holder: search text; button(s): green search, cancel; search text: typed text
    STATE_S3: 3, // focus: N; size: SM; place holder: collapsed search text; button(s): gray search; search text: typed text

    // reference to a controller, to allow communicating out
    controller: null,

    // use these classes
    classNames: ['navbar-form', 'navbar-right', 'search-container'],

    // use each of these classes if the respective boolean property is true
    classNameBindings: ['isExpanded:expanded'],

    // determines if the widget currently has focus
    hasFocus: false,

    // the component is collapsed when the widget does not have focus
    isCollapsed: function() {
        var ss = this.get('searchState');
        return (ss == this.STATE_S0) || (ss == this.STATE_S3);
    }.property('searchState'),

    // the component is expanded when the widget has focus
    isExpanded: function() {
        var ss = this.get('searchState');
        return (ss == this.STATE_S1) || (ss == this.STATE_S2);
    }.property('searchState'),

    // the component is expanded and dirty when the widget has focus and non-empty search text
    isExpandedDirty: function() {
        var ss = this.get('searchState');
        return (ss == this.STATE_S2);
    }.property('searchState'),

    // internal state of the component
    searchState: function() {

        var hasFocus = this.get('hasFocus');
        var searchText = this.get('searchText');

        if (!hasFocus && searchText === "") {
            return this.STATE_S0;
        }

        if (hasFocus && searchText === "") {
            return this.STATE_S1;
        }

        if (hasFocus && searchText !== "") {
            return this.STATE_S2;
        }

        return this.STATE_S3;

    }.property('hasFocus', 'searchText'),

    // search text is typed by the user
    searchText: "",

    // place holder text depends on the component's state
    placeholderText: function() {

        var hasFocus = this.get('hasFocus');

        if (!hasFocus) {
            return this.DISPLAY_TEXT_S0;
        }

        return this.DISPLAY_TEXT_S1;

    }.property('hasFocus'),

    searchClear: function () {
        this.set('searchText', "");
    },

    searchExecute: function () {
        alert("Performing search");
    },

    actions: {

        searchClear: function () {
            this.set('searchText', "");
        },

        searchEnter: function () {
            this.set('hasFocus', true);
        },

        searchExecute: function () {
            alert("Performing search");
        },

        searchExit: function () {
            this.set('hasFocus', false);
        }
    }
});