/**
 * The actual value should be an array and it must contain at least one value
 * that matches the given value or matcher.
 */
JsHamcrest.Matchers.hasItem = JsHamcrest.EqualTo(function(matcher) {
  return new JsHamcrest.SimpleMatcher({
    matches: function(actual) {
      // Should be an array
      if (!(actual instanceof Array)) {
        return false;
      }

      for (var i = 0; i < actual.length; i++) {
        if (matcher.matches(actual[i])) {
          return true;
        }
      }
      return false;
    },

    describeTo: function(description) {
      description.append('array contains item ')
          .appendDescriptionOf(matcher);
      }
  });
});

/**
 * The actual value should be an array and the given values or matchers must
 * match at least one item.
 */
JsHamcrest.Matchers.hasItems = function() {
  var items = [];
  for (var i = 0; i < arguments.length; i++) {
    items.push(JsHamcrest.Matchers.hasItem(arguments[i]));
  }
  return JsHamcrest.Matchers.allOf(items);
};

/**
 * The actual value should be an array and the given value or matcher must
 * match all items.
 */
JsHamcrest.Matchers.everyItem = JsHamcrest.EqualTo(function(matcher) {
  return new JsHamcrest.SimpleMatcher({
    matches: function(actual) {
      // Should be an array
      if (!(actual instanceof Array)) {
        return false;
      }

      for (var i = 0; i < actual.length; i++) {
        if (!matcher.matches(actual[i])) {
          return false;
        }
      }
      return true;
    },

    describeTo: function(description) {
      description.append('every item ')
          .appendDescriptionOf(matcher);
    }
  });
});

/**
 * The given array must contain the actual value.
 */
JsHamcrest.Matchers.isIn = function() {
  var equalTo = JsHamcrest.Matchers.equalTo;

  var args = arguments;
  if (args[0] instanceof Array) {
    args = args[0];
  }

  return new JsHamcrest.SimpleMatcher({
    matches: function(actual) {
      for (var i = 0; i < args.length; i++) {
        if (equalTo(args[i]).matches(actual)) {
          return true;
        }
      }
      return false;
    },

    describeTo: function(description) {
      description.append('one of ').appendLiteral(args);
    }
  });
};

/**
 * Alias to 'isIn' matcher.
 */
JsHamcrest.Matchers.oneOf = JsHamcrest.Matchers.isIn;

/**
 * The actual value should be an array and it must be empty to be successful.
 */
JsHamcrest.Matchers.empty = function() {
  return new JsHamcrest.SimpleMatcher({
    matches: function(actual) {
      return actual.length === 0;
    },

    describeTo: function(description) {
      description.append('empty');
    }
  });
};

/**
 * The length of the actual value value must match the given value or matcher.
 */
JsHamcrest.Matchers.hasSize = JsHamcrest.EqualTo(function(matcher) {
  var getSize = function(actual) {
    var size = actual.length;
    if (size === undefined && typeof actual === 'object') {
      size = 0;
      for (var key in actual)
        size++;
    }
    return size;
  };

  return new JsHamcrest.SimpleMatcher({
    matches: function(actual) {
      return matcher.matches(getSize(actual));
    },

    describeTo: function(description) {
      description.append('has size ').appendDescriptionOf(matcher);
    },

    describeValueTo: function(actual, description) {
      description.append(getSize(actual));
    }
  });
});

JsHamcrest.Matchers.equivalentMap = function(expected) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual)
        {
            if(JsHamcrest.retreiveEntityMatcherFunction(actual) === JsHamcrest.areMapsEquivalent &&
                    JsHamcrest.retreiveEntityMatcherFunction(expected) === JsHamcrest.areMapsEquivalent)
            {
                return JsHamcrest.areMapsEquivalent(expected, actual);
            }

            return false; //The passed in objects aren't maps.
        },

        describeTo: function(description) {
            description.append('map equivalent to ').appendLiteral(expected);
        }
    });
};

JsHamcrest.Matchers.equivalentArray = function(expected) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual)
        {
            if (expected instanceof Array && actual instanceof Array)
            {
                return JsHamcrest.areArraysEquivalent(expected, actual);
            }

            return false; //The passed in objects aren't Arrays.
        },

        describeTo: function(description) {
            description.append('array equivalent to ').appendLiteral(expected);
        }
    });
};
