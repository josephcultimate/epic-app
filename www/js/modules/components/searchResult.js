App.SearchResultComponent = Ember.Component.extend({

    MARK_PRE: '<span class=\'matching-search-text\'>',
    MARK_POST: '</span>',

    displayName: function() {

        var data = this.get('data');
        var searchText = this.get('searchText');
        var fullName = data ? data.get('first_name') + ' ' + data.get('last_name') : '';

        return this.markText(fullName, searchText, this.MARK_PRE, this.MARK_POST);

    }.property('data'),

    markText: function(source, replace, markPre, markPost) {

        // TODO: make sure the source string is SAFE!!!

        var matches = [];

        var regex = new RegExp(replace, 'gi');

        // test returns true for every match in source;
        // each call to test tries to match the regex beyond the previous match in the string
        while (regex.test(source)) {
            matches.push(regex.lastIndex);
        }

        var matchesLen = matches.length;
        if (matchesLen === 0) {
            return source;
        }

        var match = '';
        var fragments = [];
        var replaceLen = replace.length;

        var work = source;
        var workLen = work.length;

        // matches[i] is the position in source immediately after the i-th regex match
        for (i = matchesLen - 1; i >= 0; i--) {

            // not the last match
            if (i < matchesLen - 1) {
                // push the substring between this and the next match
                fragments.push(work.substring(matches[i], matches[i+1] - replaceLen));
            }

            // last match, but may not need to process
            else if (matches[i] < workLen) {
                // push the substring between this match and the end of the string
                fragments.push(work.substring(matches[i], workLen));
            }

            // string fragment that was matched by the regex
            match = work.substring(matches[i] - replaceLen, matches[i]);

            // push the marked match
            fragments.push(markPre + match + markPost);

            // the first match
            if (i === 0) {
                // push the substring from the start to the first match
                fragments.push(work.substring(0, matches[i] - replaceLen));
            }
        }

        return fragments.reverse().join('');
    },

    mouseEnter: function() {
        var data = this.get('data');
        var target = this.get('targetObject');
        target.send('selectIndex', data.get('index'));
    },

    pictureLink: function() {
        var data = this.get('data');
        var normalized = App.normalizeRelativePath('/assets/person_40x40.png');
        return data && data.get('picture') ? data.get('picture') : normalized;
    }.property('data'),

    resultClass: function() {
        var data = this.get('data');
        return 'list-group-item' + (data.get('isActive') ? ' active' : '');
    }.property('data.isActive'),

    rowId: function() {
        var data = this.get('data');
        return 'searchResult_' + data.get('id');
    }.property('data'),

    actions: {
        transitionToProfile: function() {
            var data = this.get('data');
            var target = this.get('targetObject');
            target.send('transitionToProfile', data.get('id'));
        }
    }
});