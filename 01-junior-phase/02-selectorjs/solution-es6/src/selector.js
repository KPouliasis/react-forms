const traverseDomAndCollectElements = function (matchFunc, startEl = document.body) {

    let resultSet = [];

    if (matchFunc(startEl)) {
        resultSet.push(startEl);
    }

    if (startEl.children.length) {

        // http://www.2ality.com/2014/05/es6-array-methods.html
        Array.from(startEl.children).forEach(function (child) {
            const matchingElementsStartingAtChild = traverseDomAndCollectElements(matchFunc, child);
            resultSet = resultSet.concat(matchingElementsStartingAtChild);
        });

    }

    return resultSet;

};


const selectorTypeMatcher = function (selector) {
    if (selector[0] === '#') {
        return 'id';
    } else if (selector[0] === '.') {
        return 'class';
    } else {
        if (selector.indexOf('.') !== -1) {
            return 'tag.class';
        } else {
            return 'tag';
        }
    }
};


const matchFunctionMaker = function (selector) {

    const selectorType = selectorTypeMatcher(selector);
    let matchFunction;

    if (selectorType === "id") {

        matchFunction = function (element) {
            return element.id === selector.slice(1);
        };

    } else if (selectorType === "class") {

        matchFunction = function (element) {
            const classes = element.className.split(' ');
            return classes.indexOf(selector.slice(1)) !== -1;
        };

    } else if (selectorType === "tag.class") {

        matchFunction = function (element) {

            const tag = selector.split('.')[0];
            const theClass = selector.split('.')[1];
            const classes = element.className.split(' ');

            return classes.indexOf(theClass) !== -1
                   && element.tagName.toLowerCase() === tag.toLowerCase();
        };

    } else if (selectorType === "tag") {

        matchFunction = function (element) {
            return element.tagName.toLowerCase() === selector.toLowerCase();
        };

    }

    return matchFunction;

};

const $ = function (selector) {
    const selectorMatchFunc = matchFunctionMaker(selector);
    return traverseDomAndCollectElements(selectorMatchFunc);
};
