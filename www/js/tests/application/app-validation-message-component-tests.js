moduleForComponent('validation-message', 'Components/Validation Message');

test('Should_reset_validation_component_message', function(assert) {
    assert.expect(2);

    var component = this.subject();

    var expected = 'dummy_error';
    component.set('message', expected);
    assert.equal(component.get('message'), expected);

    component.send('resetmsg');
    assert.equal(component.get('message'), '');
});
