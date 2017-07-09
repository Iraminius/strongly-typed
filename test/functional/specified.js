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

var person = {}

function createPerson() {
    Person(person)
}

function resetPerson() {
    person = {
        name: {
            first: "Joe",
            last: "Average"
        },
        age: 23,
        favorites: ["beer", "game"],
        height: 13,
        eyeglasses: true,
        eyeColor: "blue" //allowed by [allowUnspecifiedFields] parameter
    }
}

resetPerson()

describe("Strongly typed specifier", function() {
    it("Create object", function() {
        createPerson.should.not.throw(Error)
    })

    it("Doesn't match regex", function() {
        resetPerson()
        person.name.first = "Joe9"
        createPerson.should.throw(Error)
    })

    it("Doesn't match any specified type", function() {
        resetPerson()
        person.height = "test"
        createPerson.should.throw(Error)
    })
})