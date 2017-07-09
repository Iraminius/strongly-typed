const stronglyTyped = require("../../")
const should = require("should")

describe("Check types for strongly-typed", function () {

    //var describedValues = [ "string", "number", "boolean", [], { key: "string" } ]
    var values = [ "Joe", 13, true, [ "beer", "games" ], { key: "string"}]

    values.forEach( function(value) {
        var type = typeof(value)
        var valueDescription = type

        if(Array.isArray(value)) {
            valueDescription = "array"
        }

        if(type === "object") {
            type = value
        }

        describe("Check " + valueDescription + " type", function () {

            var valueTyped = stronglyTyped({
                "value": type
            })

            it("Accept " + valueDescription + " value for " + valueDescription + " typed field", function () {
                (() => {
                    valueTyped({
                        "value": value
                    })
                }).should.not.throw(Error)
            })

            describe("Doesn't accept other values for " + valueDescription + " typed field", function () {
                values.forEach( function (otherValue) {
                    if(value !== otherValue){
                        otherValueDescription = typeof(otherValue)
                        if(Array.isArray(otherValue)) {
                            otherValueDescription = "array"
                        }

                        it("Doesn't accept " + otherValueDescription + " value", function() {
                            (() => {
                                valueTyped({
                                    "value": otherValue
                                })
                            }).should.throw(Error)
                        })
                    }
                })
            })
        })
    })
})

describe("Check extra fields", function() {

    it("Allow extra fields", function() {
        var extraTyped = stronglyTyped({}, {}, true)

        (() => {
            extraTyped({
                "extra": "test extra field"
            })
        }).should.not.throw(Error)
    })
})