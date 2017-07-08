function validate(obj, desc, parent, specified) {
    if (!desc) {
        return []
    }
    parent = parent || "";
    var errors = [];
    Object.keys(desc).forEach(function (key) {
        var descriptionVal = desc[key];

        if (specified && specified[key]) {
            if (specified[key]["equal"]) {
                if (descriptionVal !== null && !specified[key]["equal"].some(function (equal) {
                        if (typeof (equal) !== descriptionVal) {
                            throw new TypeError(key + ": specified value not match the type")
                        }
                        return (obj[key] === equal)
                    })) {
                    throw new TypeError(key + ": not match any specified value")
                }
            }
            if (descriptionVal === "string") {
                if (specified[key]["length"] && obj[key].length > specified[key]["length"]) {
                    throw new TypeError(key + ": value is too long")
                }
                if (specified[key]["regex"] && !(new RegExp(specified[key]["regex"]).test(obj[key]))) {
                    throw new TypeError(key + ": problem with matching regex")
                }
            } else if (descriptionVal === "number") {
                if (specified[key]["range"]) {
                    if (!specified[key]["range"].some(function (range) {
                            return (obj[key] >= range.split("-")[0] && obj[key] <= range.split("-")[1])
                        })) {
                        throw new TypeError(key + ": not in range")
                    }
                }
                if (specified[key]["gt"] && obj[key] <= specified[key]["gt"]) {
                    throw new TypeError(key + ": less then expected")
                }
                if (specified[key]["ge"] && obj[key] < specified[key]["ge"]) {
                    throw new TypeError(key + ": less then expected")
                }
                if (specified[key]["lt"] && obj[key] >= specified[key]["lt"]) {
                    throw new TypeError(key + ": greater then expected")
                }
                if (specified[key]["le"] && obj[key] > specified[key]["le"]) {
                    throw new TypeError(key + ": greater then expected")
                }
            } else if (descriptionVal === null) {
                if (specified[key]["equal"]) {
                    if (!specified[key]["equal"].some(function (equal) {
                            return (obj[key] === equal)
                        })) {
                        if (specified[key]["types"]) {
                            var typeErrors = 0
                            specified[key]["types"].forEach(function (type) {
                                delete specified[key]["equal"]
                                if(validate({[key]: obj[key]}, {[key]: type}, "", specified).length > 0){
                                    typeErrors++
                                }
                            })
                            if(typeErrors === specified[key]["types"].length){
                                throw new TypeError(key + ": not match any specified value")
                            }
                        } else {
                            throw new TypeError(key + ": not match any specified value")
                        }
                    }
                }
            }
        }

        if (typeof descriptionVal === "string") {
            if (typeof obj[key] !== descriptionVal) {
                errors.push(parent + key + ":" + (typeof obj[key]));
            }
        } else {
            if (Array.isArray(descriptionVal)) {
                if (!Array.isArray(obj[key])) {
                    errors.push(parent + key + ":notArray");
                }
            } else {
                if (obj.hasOwnProperty(key)) {
                    errors = errors.concat(validate(obj[key], descriptionVal, parent + key + ".", specified[key]));
                } else {
                    errors.push(parent + key + ":missing");
                }
            }
        }

    });
    return errors;
}

module.exports = function (desc, proto, allowExtras) {
    var StronglyTyped = function StronglyTyped(obj) {
        var self = Object.create(StronglyTyped.prototype, {
            validate: {
                value: function validateType() {
                    var errors = validate(this, desc, "", StronglyTyped.prototype.specify);
                    if (errors.length > 0) {
                        throw new TypeError("Incorrect values for fields: " + errors.join());
                    }
                    if (StronglyTyped.prototype.validate) {
                        return StronglyTyped.prototype.validate.call(this);
                    }
                }
            }
        });
        Object.keys(obj).forEach(function (key) {
            if (allowExtras || desc.hasOwnProperty(key)) {
                self[key] = obj[key];
            } else {
                throw new TypeError("Unexpected field " + key);
            }
        });
        if (StronglyTyped.prototype.constructor && StronglyTyped.prototype.constructor.apply) {
            StronglyTyped.prototype.constructor.apply(self, arguments)
        }
        self.validate();
        return self;
    };
    StronglyTyped.prototype = proto || {};
    Object.defineProperty(StronglyTyped, "created", {
        value: function (obj) {
            return StronglyTyped.prototype.isPrototypeOf(obj);
        }
    });
    return StronglyTyped;
};