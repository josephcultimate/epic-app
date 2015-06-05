moduleForModel('person', 'Model/SignIn', {
    setup: function() {

    },
    teardown: function() {
        $.mockjax.clear();
        translationMock();
    }
});

test('Should_Pass_NoFirstName', function(assert) {
    var person = this.subject({
        username: 'test',
        last_name: 'Duck'
    });

    assert.equal(person.get('hasFirstName'), false);
    assert.equal(person.get('fullname'), 'Duck');
});

test('Should_Pass_FirstName', function(assert) {
    var person = this.subject({
        username: 'test',
        first_name: 'DarkWing',
        last_name: 'Duck'
    });

    assert.equal(person.get('hasFirstName'), true);
    assert.equal(person.get('fullname'), 'DarkWing Duck');
});

test('Should_Pass_EmployeeRole', function(assert) {
    var person = this.subject({
        username: 'test',
        roles: 1
    });

    assert.equal(person.get('isEmployee'), true);
    assert.equal(person.get('isManagerAdmin'), false);
});

test('Should_Pass_EmployeeAdminRoles', function(assert) {
    var person = this.subject({
        username: 'test',
        roles: 5
    });

    assert.equal(person.get('isEmployee'), true);
    assert.equal(person.get('isAdministrator'), true);
    assert.equal(person.get('isEmployeeAdmin'), true);
    assert.equal(person.get('isManager'), false);
    assert.equal(person.get('isManagerAdmin'), false);
});

test('Should_Pass_MangerRole', function(assert) {
    var person = this.subject({
        username: 'test',
        roles: 3
    });

    assert.equal(person.get('isManager'), true);
    assert.equal(person.get('isManagerAdmin'), false);
});

test('Should_Pass_MangerAdminRoles', function(assert) {
    var person = this.subject({
        username: 'test',
        roles: 6
    });

    assert.equal(person.get('isManager'), true);
    assert.equal(person.get('isAdministrator'), true);
    assert.equal(person.get('isManagerAdmin'), true);
    assert.equal(person.get('isEmployee'), false);
    assert.equal(person.get('isEmployeeAdmin'), false);
});

test('Should_Pass_AdminRole', function(assert) {
    var person = this.subject({
        username: 'test',
        roles: 4
    });

    assert.equal(person.get('isAdministrator'), true);
    assert.equal(person.get('isManagerAdmin'), false);
});

test('Should_Pass_RowId', function(assert) {
    var person = this.subject({
        username: 'test',
        id: 'MyIdIsNotUnique'
    });

    assert.equal(person.get('rowId'), 'listItem_MyIdIsNotUnique');
});

test('Should_Pass_NoPhoto', function(assert) {
    var person = this.subject({
        username: 'test'
    });

    assert.equal(person.get('pictureLink'), App.normalizeRelativePath('/assets/person_40x40.png'));
});

test('Should_Pass_HasPhoto', function(assert) {
    var person = this.subject({
        username: 'test',
        picture: 'MyPictureIsPretty'
    });

    assert.equal(person.get('pictureLink'), 'MyPictureIsPretty');
});

test('Should_Pass_isInRole', function(assert){
    var person = this.subject({
        username: 'test',
        roles: 1
    });

    assert.equal(person.get('roles'), 1);
});