strongly-typed
==============

Strongly-typed JavaScript objects, self-validating, with detailed error reports.

## Support

IE9+ and everything else (same support as `Object.create`)

## Usage

```javascript
var TypeName = stronglyTyped(interface_definition, [prototype], [allowUnspecifiedFields])

```

1. `interface_definition` is a plain object of the expected structure with fields containing strings to match `typeof` in the typed objects.

    Allowed types:
    * "string"
    * "number"
    * "boolean"
    * [] - array type
    
    You can also use `null`, empty `{}` or `!"any expression here"` to indicate that the field must exist, without specifying anything else about it.

1. `prototype` is a place for two functions:
* preValidate - which is executed before validating types
* postValdate - after validating types

1. `allowUnspecifiedFields` if true it allows for inserting other keys then in stronglyTyped definition

_Example_

```javascript
var Person = stronglyTyped({
    "name": {
        first:"string",
        last:"string"
    },
    "age": "number",
    "favorites": [],
    "height": null,
    "eyeglasses": "boolean"
}, {
    preValidate: function() {
        this["species"] = "Homo sapiens"
    },
    postValidate: function() {
        (function cureEyes(obj) {
            if(obj.eyeglasses){
                obj.eyeglasses = false
            }
        })(this)
    }
}, true)

//create instance
var joe = Person({
    name: {
        first:"Joe",
        last:"Average"
    },
    age: 21.5,
    favorites: ["beer","game"],
    height: "tall",
    eyeglasses: true,
    eyeColor: "blue" //allowed by [allowUnspecifiedFields] parameter
})

//check type
Person.created(joe) === true
```

More examples in tests/index.js

## No new keyword

Strongly typed objects are factories, not classes. Because it's better that way. See: https://medium.com/javascript-scene/how-to-fix-the-es6-class-keyword-2d42bb3f4caf

