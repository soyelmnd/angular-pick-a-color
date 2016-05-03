/**
 * pick-a-color directive for AngularJS
 * Written by Chris Jackson
 * MIT License
 *
 * See https://github.com/lauren/pick-a-color for the excellent color picker
 */
angular.module('pickAColor', [])
    .provider("pickAColor", function() {
        this.options = {};

        this.$get = function () {
            var localOptions = angular.copy(this.options);
            return {
                getOptions: function () {
                    return localOptions;
                }
            };
        };

        this.setOptions = function (options) {
            this.options = options;
        };
    })

    .directive('pickAColor', function ($parse, pickAColor) {
        return {
            restrict: 'E',
            compile: function (element, attrs) {
                var model = $parse(attrs.ngModel);

                // Compile the HTML template
                var html = "<input type='text' id='" + attrs.id + "'" +
                    "name='" + attrs.name + "'" +
                    "' class='disabled pick-a-color form-control'>" +
                    "</input>";

                var newElem = $(html);
                element.replaceWith(newElem);

                return function (scope, element, attrs, controller) {
                    // Process options
                    var options = pickAColor.getOptions();
                    if (attrs.inlineDropdown) {
                        options.inlineDropdown = attrs.inlineDropdown == "true";
                    }
                    if (attrs.showSpectrum) {
                        options.showSpectrum = attrs.showSpectrum == "true";
                    }
                    if (attrs.showSavedColors) {
                        options.showSavedColors = attrs.showSavedColors == "true";
                    }
                    if (attrs.saveColorsPerElement) {
                        options.saveColorsPerElement = attrs.saveColorsPerElement == "true";
                    }
                    if (attrs.fadeMenuToggle) {
                        options.fadeMenuToggle = attrs.fadeMenuToggle == "true";
                    }
                    if (attrs.showAdvanced) {
                        options.showAdvanced = attrs.showAdvanced == "true";
                    }
                    if (attrs.showBasicColors) {
                        options.showBasicColors = attrs.showBasicColors == "true";
                    }
                    if (attrs.showHexInput) {
                        options.showHexInput = attrs.showHexInput == "true";
                    }
                    if (attrs.allowBlank) {
                        options.allowBlank = attrs.allowBlank == "true";
                    }

                    scope.$watch(model, function(value) {
                        element.val(model(scope));
                        element.focus();
                        element.blur();
                    });

                    // Set the value before we initialise the picker
                    element.val(model(scope));

                    // Create the 'pick-a-color control
                    element.pickAColor(
                        options
                    );

                    // Handle changes to the value
                    element.on("change", function () {
                        var value = $(this).val();

                        // This probably shouldn't be needed, but currently pick-a-color doesn't close on enter
                        // so we end up with an unvalidated value
                        value = tinycolor(value).toHexString();
                        scope.$apply(function (scope) {
                            // Change bound variable
                            model.assign(scope, value);
                        });
                    });
                };
            }
        };
    });
