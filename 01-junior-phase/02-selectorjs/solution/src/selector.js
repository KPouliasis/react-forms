var traverseDomAndCollectElements = function (matchFunc, startEl) {

    var resultSet = [];

    if (typeof startEl === "undefined") {
        startEl = document.body;
    }

    // your code here
    // traverse the DOM tree and collect matching elements in resultSet
    // use matchFunc to identify matching elements
    if (matchFunc(startEl)) {
        resultSet.push(startEl);
    }

    if (startEl.children.length) {

        [].slice.call(startEl.children).forEach(function (child) {
            var matchingElementsStartingAtChild = traverseDomAndCollectElements(matchFunc, child);
            resultSet = resultSet.concat(matchingElementsStartingAtChild);
        });

    }

    return resultSet;

};


// detect and return the type of selector
// return one of these types: id, class, tag.class, tag
//
var selectorTypeMatcher = function (selector) {
    // your code here
    // selector id: "#picture"
    // selector class: '.picture'
    // selector tag.class 'div.picture'
    // selector tag 'div'
    if (selector[0] === '#') {
        return 'id';
    } else if (selector[0] === '.') {
        return 'class';
    } else {
        // tag or tag.class
        if (selector.indexOf('.') !== -1) {
            return 'tag.class';
        } else {
            return 'tag';
        }
    }
};


// NOTE ABOUT THE MATCH FUNCTION
// remember, the returned matchFunction takes an *element* as a
// parameter and returns true/false depending on if that element
// matches the selector.

var matchFunctionMaker = function (selector) {

    var selectorType = selectorTypeMatcher(selector);
    var matchFunction;
    if (selectorType === "id") {
        // define matchFunction for id
        matchFunction = function (element) {
            return element.id === selector.slice(1);
        };
    } else if (selectorType === "class") {
        // define matchFunction for class
        matchFunction = function (element) {
            var classes = element.className.split(' ');
            return classes.indexOf(selector.slice(1)) !== -1;
        };
    } else if (selectorType === "tag.class") {
        // define matchFunction for tag.class
        matchFunction = function (element) {

            var tag = selector.split('.')[0];
            var theClass = selector.split('.')[1];
            var classes = element.className.split(' ');

            return classes.indexOf(theClass) !== -1
                   && element.tagName.toLowerCase() === tag.toLowerCase();
        };

    } else if (selectorType === "tag") {
        // define matchFunction for tag
        matchFunction = function (element) {
            return element.tagName.toLowerCase() === selector.toLowerCase();
        };
    }
    return matchFunction;
};

var $ = function (selector) {
    var elements;
    var selectorMatchFunc = matchFunctionMaker(selector);
    elements = traverseDomAndCollectElements(selectorMatchFunc);
    return elements;
};
