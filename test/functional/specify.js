const stronglyTyped = require("../../")
const should = require("should")

var Person = stronglyTyped({
    "name": {
        first: "string",
        last: "string"
    },
    "age": "number",
    "favorites": [],
    "height": null,
    "eyeglasses": "boolean"
}, {
    constructor: function () {
        this["species"] = "Homo sapiens"
    },
    validate: function () {
        (function cureEyes(obj) {
            if (obj.eyeglasses) {
                obj.eyeglasses = false
            }
        })(this)
    },
    specify: {
        name: {
            first: {
                regex: /^[a-z]+$/gi,
                length: 10
            },
            last: {
                regex: /^[a-z]+$/gi,
                length: 15
            }
        },
        age: {
            range: ["0-150"],
            lt: 120,
            ge: 10
        },
        height: {
            equal: ["tall", "short"],
            types: ["number"]
        }
    }
}, true)

describe("Strongly typed specifier", function() {
    it("Create object", function() {
        const joe = Person({
            name: {
                first: "Joe",
                last: "Average"
            },
            age: 23,
            favorites: ["beer", "game"],
            height: 13,
            eyeglasses: true,
            eyeColor: "blue" //allowed by [allowUnspecifiedFields] parameter
        })

        should(joe).ok()
    })
})