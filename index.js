/*jshint esversion: 6 */
"use strict";

var objectAssign = require('object-assign');

var postcss = require('postcss');

var defaults = {
  breakpoints: [
    {name: 'xs', max: 767},
    {name: 'sm', min: 768, max: 1023},
    {name: 'md', min: 1024, max: 1199},
    {name: 'lg', min: 1200, max: 1599},
    {name: 'xl', min: 1600}
  ],

  unit: 'px', // rem, em
  prefix: '#'

  // breakpoints: {
  //   xs: {max: 767},
  //   sm: {min: 768, max: 1023},
  //   smMin: {min: 768},
  //   smMax: {max: 1023},
  //   md: {min: 1024, max: 1199},
  //   mdMin: {min: 1024},
  //   mdMax: {max: 1199},
  //   lg: {min: 1200, max: 1599},
  //   lgMin: {min: 1200},
  //   lgMax: {max: 1599},
  //   xl: {min: 1600}
  // }
};

var templates = {
  min: '@media(min-width: %min%%unit%)',
  max: '@media(max-width: %max%%unit%)',
  minMax: '@media(min-width: %min%%unit%) and (max-width: %max%%unit%)'
};


var breakpoints = {};

function generateBreakpoints(values, unit) {
  let result = [];

  values.forEach(breakpoint => {

    if (!breakpoint.min && breakpoint.max) {
      result.push({
        name: breakpoint.name,
        selector: templates.max
          .replace('%max%', breakpoint.max)
          .replace(/%unit%/g, unit)
      });
    }
    else if (breakpoint.min && breakpoint.max) {
      result.push({
        name: breakpoint.name + '-min',
        selector: templates.min
          .replace('%min%', breakpoint.min)
          .replace(/%unit%/g, unit)
      });
      result.push({
        name: breakpoint.name + '-max',
        selector: templates.max
          .replace('%max%', breakpoint.max)
          .replace(/%unit%/g, unit)
      });
      result.push({
        name: breakpoint.name,
        selector: templates.minMax
        .replace('%min%', breakpoint.min)
        .replace('%max%', breakpoint.max)
        .replace(/%unit%/g, unit)
      });
    }
    else if (breakpoint.min && !breakpoint.max) {
      result.push({
        name: breakpoint.name,
        selector: templates.min
          .replace('%min%', breakpoint.min)
          .replace(/%unit%/g, unit)
      });
    }

  });

  return result;
}

module.exports = postcss.plugin('mediaQueryShorthand', function myplugin(options) {

  return function (css) {

    options = objectAssign({}, defaults, options);

    breakpoints = generateBreakpoints(options.breakpoints, options.unit);

    console.log(breakpoints);

    css.walkRules(function (rule) {
      console.log(rule.selector);



      rule.selector.replace()

      // rule.walkDecls(function (decl, i) {
      //
      // });
    });

    // Processing code will be added here

  };

});
