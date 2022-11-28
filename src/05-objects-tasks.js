/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */

function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.height * this.width;
    },
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */

function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */

function fromJSON(proto, json) {
  const result = JSON.parse(json);
  Object.setPrototypeOf(result, proto);
  return result;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class MySelector {
  constructor() {
    this.builder = {
      element: '',
      id: '',
      class: [],
      attr: '',
      pseudoClass: [],
      pseudoElement: '',
      combineCollector: [],
    };
    this.orderArr = [];
    this.orderErrorText = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
    this.uniqueErrorText = 'Element, id and pseudo-element should not occur more then one time inside the selector';
  }

  element(value) {
    if (this.builder.element) {
      throw new Error(this.uniqueErrorText);
    } else if (this.orderArr.length > 0) {
      throw new Error(this.orderErrorText);
    } else {
      this.builder.element = value;
      this.orderArr.push(1);
      return this;
    }
  }

  id(value) {
    if (this.builder.id) {
      throw new Error(this.uniqueErrorText);
    } else if (this.orderArr.length > 0 && this.orderArr[0] > 2) {
      throw new Error(this.orderErrorText);
    } else {
      this.builder.id = `#${value}`;
      this.orderArr.push(2);
      return this;
    }
  }

  class(value) {
    if (this.orderArr.length > 0 && this.orderArr[0] > 3) {
      throw new Error(this.orderErrorText);
    } else {
      this.builder.class.push(`.${value}`);
      this.orderArr.push(3);
      return this;
    }
  }

  attr(value) {
    if (this.orderArr.length > 0 && this.orderArr[0] > 4) {
      throw new Error(this.orderErrorText);
    } else {
      this.builder.attr = `[${value}]`;
      this.orderArr.push(4);
      return this;
    }
  }

  pseudoClass(value) {
    if (this.orderArr.length > 0 && this.orderArr[0] > 5) {
      throw new Error(this.orderErrorText);
    } else {
      this.builder.pseudoClass.push(`:${value}`);
      this.orderArr.push(5);
      return this;
    }
  }

  pseudoElement(value) {
    if (this.builder.pseudoElement) {
      throw new Error(this.uniqueErrorText);
    } else {
      this.builder.pseudoElement = `::${value}`;
      this.orderArr.push(6);
      return this;
    }
  }

  combine(selector1, combinator, selector2) {
    const first = selector1.stringify();
    this.builder.combineCollector.push(first);
    this.builder.combineCollector.push(combinator);
    const second = selector2.stringify();
    this.builder.combineCollector.push(second);
    return this;
  }

  stringify() {
    let selector = '';
    if (this.builder.combineCollector.length > 0) {
      selector += this.builder.combineCollector.join(' ');
    } else {
      const keys = Object.keys(this.builder);
      keys.forEach((key) => {
        if (this.builder[key]) {
          if (Array.isArray(this.builder[key])) {
            const arrToString = this.builder[key].join('');
            selector += arrToString;
          } else {
            selector += this.builder[key];
          }
        }
      });
    }
    return selector;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new MySelector().element(value);
  },

  id(value) {
    return new MySelector().id(value);
  },

  class(value) {
    return new MySelector().class(value);
  },

  attr(value) {
    return new MySelector().attr(value);
  },

  pseudoClass(value) {
    return new MySelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new MySelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new MySelector().combine(selector1, combinator, selector2);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
