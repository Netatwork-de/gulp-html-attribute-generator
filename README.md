gulp-html-attribute-generator
===
[![NPM version][npm-image]][npm-url] 

This gulp tasks generates html attributes base on rules.

## Installation

Install `gulp-html-attribute-generator` using npm into your local repository.

```bash
npm install gulp-html-attribute-generator --save-dev
```
## Usage

Add `gulp-html-attribute-generator` to your HTML build task.

```js
var gulp = require('gulp');
var attrGenerator = require('gulp-html-attribute-generator');

var rules = [
{	
	tagFilter:["button","a"], 	// Provide a list of valid tags 
	attributeFilter:["t"],		// Provide a list of required attributes. At least one must be present

	targetAttribute:"id",		// Name of the target attribute
	overwrite:false,			// Overwrite attribute if exists

	readAttributes:["t"],		// List of attributes fo the value function
	value:(element, t)  => t 	// Value function or static string for the target attribute
}];

gulp.task('build-html', function() {
  return gulp.src("src/**/*.html")
             .pipe(attrGenerator(rules))
             .pipe(gulp.dest("dist"));
});
```

## Rule

- `tagFilter` : string[]

	List of valid tags this rule should be applied to.

- `attributeFilter` : string[]

	List of attributes. At least one musst be present on the html element.
	
- `targetAttribute` : string

	Name of the attribute which should be added or update on the element.
	
- `overwrite` : boolean

	Overwrite the target attribute if it exists.
	
- `readAttributes` : string[]

	List of attributes that should be provided to the value function.

- `value` : function || string

	A function that generates the value or a static string for the target attribute. The first parameter for the function is the target element [Parse5](https://github.com/inikulin/parse5). All other parameters a defined by the readAttributes list.

# License

[Apache 2.0](/license.txt)

[npm-url]: https://npmjs.org/package/gulp-html-attribute-generator
[npm-image]: http://img.shields.io/npm/v/gulp-html-attribute-generator.svg