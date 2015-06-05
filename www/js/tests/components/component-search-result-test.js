moduleForComponent('search-result', 'Components/Search Result', {

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

test('Should mark search string', function(assert) {

    assert.expect(4);

    var component = this.subject();

    var searchText0 = 'zz';
    var searchText1 = 'em';

    var markText1 = 'Demian Lessa';                 // middle of first word
    var markText2 = 'Emily Powers';                 // start of first word
    var markText3 = 'Emily Saint Remy Anthem';      // start, middle, and end words in of phrase

    var expected1 = 'D[em]ian Lessa';
    var expected2 = '[Em]ily Powers';
    var expected3 = '[Em]ily Saint R[em]y Anth[em]';

    var pre = '[';
    var post = ']';

    var result0 = component.markText(markText1, searchText0, pre, post);
    var result1 = component.markText(markText1, searchText1, pre, post);
    var result2 = component.markText(markText2, searchText1, pre, post);
    var result3 = component.markText(markText3, searchText1, pre, post);

    assert.equal(result0, markText1);
    assert.equal(result1, expected1);
    assert.equal(result2, expected2);
    assert.equal(result3, expected3);
});

test('Should set marked text from display name', function(assert) {

    assert.expect(1);

    var component = this.subject();
    component.set('data', Ember.Object.create({
        id: 'id',
        first_name: 'Demian',
        last_name: 'Lessa'
    }));

    component.set('searchText', 'em');

    component.set('MARK_PRE', '[');
    component.set('MARK_POST', ']');

    var result0 = component.get('displayName');

    assert.equal(result0, 'D[em]ian Lessa');
});

test('Should update active index on mouse over', function(assert) {

    assert.expect(2);

    var actualAction = '';
    var actualParam1 = '';

    var component = this.subject();

    component.set('data', Ember.Object.create({
        id: 'id',
        first_name: 'Demian',
        last_name: 'Lessa',
        index: 666
    }));

    var mockTarget = mock(App.ApplicationController);
    when(mockTarget).send(anything(), anything()).then(function(action, param1) {
        actualAction = action;
        actualParam1 = param1;
    });
    component.set('targetObject', mockTarget);

    component.mouseEnter();

    assert.equal(actualAction, 'selectIndex');
    assert.equal(actualParam1, 666);
});

test('Should set picture link', function(assert) {

    assert.expect(2);

    var oldPathName = App.get('windowPathName');
    App.set('windowPathName', '');

    var component1 = this.subject();
    component1.set('data', Ember.Object.create({
        id: 'id1',
        first_name: 'Demian',
        last_name: 'Lessa',
        index: 666
    }));
    var picLink1 = component1.get('pictureLink');

    var component2 = this.subject();
    component2.set('data', Ember.Object.create({
        id: 'id2',
        first_name: 'Demian',
        last_name: 'Lessa',
        picture: 'foo.png',
        index: 666
    }));
    var picLink2 = component2.get('pictureLink');

    assert.equal(picLink1, '/assets/person_40x40.png');
    assert.equal(picLink2, 'foo.png');

    App.set('windowPathName', oldPathName);
});

test('Should set resultClass', function(assert) {

    assert.expect(2);

    var component1 = this.subject();
    component1.set('data', Ember.Object.create({
        id: 'id1',
        first_name: 'Demian',
        last_name: 'Lessa',
        isActive: true,
        index: 666
    }));
    var class1 = component1.get('resultClass');

    var component2 = this.subject();
    component2.set('data', Ember.Object.create({
        id: 'id2',
        first_name: 'Demian',
        last_name: 'Lessa',
        isActive: false,
        index: 666
    }));
    var class2 = component2.get('resultClass');

    assert.equal(class1, 'list-group-item active');
    assert.equal(class2, 'list-group-item');
});

test('Should set rowId', function(assert) {

    assert.expect(1);

    var component1 = this.subject();
    component1.set('data', Ember.Object.create({
        id: 'id',
        first_name: 'Demian',
        last_name: 'Lessa',
        isActive: true,
        index: 666
    }));
    var rowId = component1.get('rowId');

    assert.equal(rowId, 'searchResult_id');
});

test('Should transition to profile', function(assert) {

    assert.expect(2);

    var actualAction = '';
    var actualParam1 = '';

    var component = this.subject();

    component.set('data', Ember.Object.create({
        id: 'id',
        first_name: 'Demian',
        last_name: 'Lessa',
        index: 666
    }));

    var mockTarget = mock(App.ApplicationController);
    when(mockTarget).send(anything(), anything()).then(function(action, param1) {
        actualAction = action;
        actualParam1 = param1;
    });
    component.set('targetObject', mockTarget);

    component.send('transitionToProfile');

    assert.equal(actualAction, 'transitionToProfile');
    assert.equal(actualParam1, 'id');
});
