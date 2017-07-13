/*jshint esversion: 6 */
"use strict";

const objectAssign = require('object-assign');
const postcss = require('postcss');

const defaults = {
  breakpoints: [
    {name: 'xs', max: 767},
    {name: 'sm', min: 768, max: 1023},
    {name: 'md', min: 1024, max: 1199},
    {name: 'lg', min: 1200, max: 1599},
    {name: 'xl', min: 1600}
  ],

  unit: 'px', // rem, em
  prefix: '',

  templates: {
    min: '(min-width: %min%%unit%)',
    max: '(max-width: %max%%unit%)',
    minMax: '(min-width: %min%%unit%) and (max-width: %max%%unit%)'
  }

};

let breakpoints = {};

function generateBreakpoints(values, unit, prefix, templates) {
  let result = [];

  values.forEach(breakpoint => {

    if (!breakpoint.min && breakpoint.max) {
      result.push({
        name: prefix + breakpoint.name,
        selector: templates.max
          .replace('%max%', breakpoint.max)
          .replace(/%unit%/g, unit)
      });
    }
    else if (breakpoint.min && breakpoint.max) {
      result.push({
        name: prefix + breakpoint.name + '-min',
        selector: templates.min
          .replace('%min%', breakpoint.min)
          .replace(/%unit%/g, unit)
      });
      result.push({
        name: prefix + breakpoint.name + '-max',
        selector: templates.max
          .replace('%max%', breakpoint.max)
          .replace(/%unit%/g, unit)
      });
      result.push({
        name: prefix + breakpoint.name,
        selector: templates.minMax
        .replace('%min%', breakpoint.min)
        .replace('%max%', breakpoint.max)
        .replace(/%unit%/g, unit)
      });
    }
    else if (breakpoint.min && !breakpoint.max) {
      result.push({
        name: prefix + breakpoint.name,
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

    breakpoints = generateBreakpoints(options.breakpoints, options.unit, options.prefix, options.templates);

    css.walkAtRules(function (rule) {
      breakpoints.forEach(breakpoint => {
        if (breakpoint.name === rule.name) {
          rule.name = 'media';
          rule.params = breakpoint.selector;
        }
      });
    });
  };

});
