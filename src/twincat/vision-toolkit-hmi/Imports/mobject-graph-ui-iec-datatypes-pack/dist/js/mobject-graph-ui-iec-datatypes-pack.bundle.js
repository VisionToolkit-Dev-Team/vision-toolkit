/**
 * MIT License
 *
 * Copyright (c) 2024 benhar-dev
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('mobject-graph-ui')) :
  typeof define === 'function' && define.amd ? define(['exports', 'mobject-graph-ui'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MobjectGraphUiIecDatatypesPack = {}, global.MobjectGraphUi));
})(this, (function (exports, mobjectGraphUi) { 'use strict';

  /**
   * This file defines two widget classes for use with IEC61131-3 BOOLEAN data types:
   *
   * 1. BooleanControlWidget: This widget allows users to interactively control BOOLEAN values.
   *    - Interaction is straightforward: click the widget to toggle the boolean value between TRUE and FALSE.
   *
   * 2. BooleanDisplayWidget: This read-only widget is used to display BOOLEAN values, showing them as either TRUE or FALSE.
   *
   * Both widgets can be registered for the BOOLEAN data type using the graphFramework as follows:
   * graphFramework.registerWidgetType(BooleanControlWidget, "BOOL");
   * graphFramework.registerWidgetType(BooleanDisplayWidget, "BOOL");
   *
   * These widgets are designed to integrate seamlessly with BOOLEAN data types, offering a simple and effective user
   * interface for displaying and controlling boolean states within the graphFramework environment.
   */

  class BooleanDisplayWidget extends mobjectGraphUi.DisplayWidget {
    constructor(name, parent, options) {
      super(name, parent, options);

      const defaultValue = options?.content?.defaultValue || false;
      const type = options?.content?.datatype?.typeName || "";
      const colorPallet = new mobjectGraphUi.ColorGenerator(type);

      this.ledComponent = new mobjectGraphUi.LedComponent(name, defaultValue, colorPallet);

      this.on("valueChanged", (newValue, oldValue) => {
        this.ledComponent.isActive = newValue;
      });
    }

    computeSize() {
      return this.ledComponent.computeSize();
    }

    draw(ctx, node, widget_width, y, H) {
      this.ledComponent.draw(ctx, node, widget_width, y, H);
    }
  }

  class BooleanControlWidget extends mobjectGraphUi.ControlWidget {
    constructor(name, parent, options) {
      super(name, parent, options);

      const defaultValue = options?.parameter?.defaultValue || false;
      const type = options?.parameter?.datatype?.typeName || "";
      const colorPallet = new mobjectGraphUi.ColorGenerator(type);

      this.checkboxComponent = new mobjectGraphUi.CheckboxComponent(
        name,
        defaultValue,
        colorPallet
      );

      this.on("valueChanged", (newValue, oldValue) => {
        this.checkboxComponent.isChecked = newValue;
      });

      this.checkboxComponent.on("onChange", (isChecked) => {
        this.value = isChecked;
      });
    }

    computeSize() {
      return this.checkboxComponent.computeSize();
    }

    mouse(event, pos, node) {
      this.checkboxComponent.onMouse(event, pos);
    }

    draw(ctx, node, widget_width, y, H) {
      this.checkboxComponent.draw(ctx, node, widget_width, y, H);
    }
  }

  class NumericContent {
    constructor(content) {
      this.content = content;
      this.metadata = new Map(
        (content.metadata ?? []).map((m) => [m.name.toLowerCase(), m.value])
      );
      this.datatype = content.datatype || {};
    }

    get precision() {
      return this.getMetadataOrDefault(
        "precision",
        this.datatype.isFloat ? 2 : 0
      );
    }

    get defaultValue() {
      return this.content?.defaultValue || 0;
    }

    getMetadataOrDefault(key, defaultValue) {
      return this.metadata.get(key.toLowerCase()) || defaultValue;
    }
  }

  class NumericParameter {
    constructor(parameter) {
      this.parameter = parameter;
      this.metadata = new Map(
        (parameter.metadata ?? []).map((m) => [m.name.toLowerCase(), m.value])
      );
      this.datatype = parameter.datatype || {};
    }

    get minimumValue() {
      return this.getMetadataOrDefault(
        "minimumValue",
        this.datatype.minValue || 0
      );
    }

    get maximumValue() {
      return this.getMetadataOrDefault(
        "maximumValue",
        this.datatype.maxValue || 0
      );
    }

    get precision() {
      return this.getMetadataOrDefault(
        "precision",
        this.datatype.isFloat ? 2 : 0
      );
    }

    get onlyOdd() {
      return this.getMetadataOrDefault("onlyOdd", false);
    }

    get onlyEven() {
      return this.getMetadataOrDefault("onlyEven", false);
    }

    get defaultValue() {
      return this.parameter.defaultValue;
    }

    getMetadataOrDefault(key, defaultValue) {
      return this.metadata.get(key.toLowerCase()) || defaultValue;
    }

    getNumberLimiter() {
      // Determine the number constraint based on metadata flags
      let constraint = null;
      if (this.onlyOdd) {
        constraint = "odd";
      } else if (this.onlyEven) {
        constraint = "even";
      }

      // Create and return the NumberLimiter with calculated properties
      return new mobjectGraphUi.NumberLimiter(
        this.minimumValue,
        this.maximumValue,
        this.defaultValue,
        constraint,
        this.precision
      );
    }
  }

  /**
   * This file defines two widget classes for use with IEC61131-3 numeric data types:
   *
   * 1. NumericControlWidget: This editable widget can be used to control numeric values.
   *    It supports various interactions for setting and adjusting values:
   *    - Click the displayed number to manually enter a value using the keyboard.
   *    - Click and drag the displayed number to increment or decrement the value.
   *      Holding the 'Shift' key while dragging will apply a 10x multiplier to the value changes.
   *      Holding both 'Shift' and 'Alt' keys will apply a 100x multiplier.
   *    - Use the arrow keys to increment or decrement the value in small steps.
   *    It also supports additional metadata options to customize its behavior:
   *    - minimumValue: Specifies a minimum value for the widget; if not provided, the data type's minimum value is used.
   *    - maximumValue: Specifies a maximum value for the widget; if not provided, the data type's maximum value is used.
   *    - onlyOdd: A boolean that, when set to true, restricts input to odd numbers only.
   *    - onlyEven: A boolean that, when set to true, restricts input to even numbers only.
   *    - precision: An integer specifying the number of decimal places for float values (e.g., REAL data type),
   *      where 1 represents 1 decimal place.
   *
   * 2. NumericDisplayWidget: This read-only widget is used to display numeric values.
   *    It supports additional metadata options to customize its behavior:
   *    - precision: An integer specifying the number of decimal places for float values (e.g., REAL data type),
   *
   * Both widgets can be registered for specific numeric data types using the graphFramework as follows:
   * graphFramework.registerWidgetType(NumericControlWidget, "INT");
   * graphFramework.registerWidgetType(NumericDisplayWidget, "INT");
   *
   * Example usage and registration demonstrate how these widgets can be integrated with numeric data types
   * such as INT (integer) to enhance user interface interactions within the graphFramework.
   */

  class NumericDisplayWidget extends mobjectGraphUi.DisplayWidget {
    constructor(name, parent, options) {
      super(name, parent, options);

      const numericContent = new NumericContent(options.content);
      const defaultValue = numericContent.defaultValue;
      const precision = numericContent.precision;
      const type = options?.content?.datatype?.typeName || "";
      const colorPallet = new mobjectGraphUi.ColorGenerator(type);

      this.numericDisplayComponent = new mobjectGraphUi.NumericDisplayComponent(
        name,
        defaultValue,
        precision,
        colorPallet
      );

      this.on("valueChanged", (newValue, oldValue) => {
        this.numericDisplayComponent.value = newValue;
      });
    }

    computeSize() {
      return this.numericDisplayComponent.computeSize();
    }

    draw(ctx, node, widget_width, y, H) {
      this.numericDisplayComponent.draw(ctx, node, widget_width, y, H);
    }
  }

  class NumericControlWidget extends mobjectGraphUi.ControlWidget {
    constructor(name, parent, options) {
      super(name, parent, options);

      const numericParameter = new NumericParameter(options.parameter);
      const defaultValue = numericParameter.defaultValue;
      const precision = numericParameter.precision;
      const limiter = numericParameter.getNumberLimiter();
      const type = options?.parameter?.datatype?.typeName || "";
      const colorPallet = new mobjectGraphUi.ColorGenerator(type);

      this.numericInputComponent = new mobjectGraphUi.NumericInputComponent(
        name,
        defaultValue,
        precision,
        limiter,
        colorPallet
      );

      this.on("valueChanged", (newValue, oldValue) => {
        this.numericInputComponent.value = newValue;
      });

      this.numericInputComponent.on("onChange", (value) => {
        this.value = value;
      });
    }

    computeSize() {
      return this.numericInputComponent.computeSize();
    }

    mouse(event, pos, node) {
      this.numericInputComponent.onMouse(event, pos, node);
    }

    draw(ctx, node, widget_width, y, H) {
      this.numericInputComponent.draw(ctx, node, widget_width, y, H);
    }
  }

  class StringDisplayWidget extends mobjectGraphUi.DisplayWidget {
    constructor(name, parent, options) {
      super(name, parent, options);

      const defaultValue = options?.content?.defaultValue || "";
      const type = options?.content?.datatype?.typeName || "";
      const colorPallet = new mobjectGraphUi.ColorGenerator(type);

      this.textDisplayComponent = new mobjectGraphUi.SingleLineTextDisplayComponent(
        name,
        defaultValue,
        colorPallet
      );

      this.on("valueChanged", (newValue, oldValue) => {
        this.textDisplayComponent.text = newValue;
      });
    }

    computeSize() {
      return this.textDisplayComponent.computeSize();
    }

    draw(ctx, node, widget_width, y, H) {
      this.textDisplayComponent.draw(ctx, node, widget_width, y, H);
    }
  }

  class StringControlWidget extends mobjectGraphUi.ControlWidget {
    constructor(name, parent, options) {
      super(name, parent, options);

      const defaultValue = options?.parameter?.defaultValue || "";
      const type = options?.parameter?.datatype?.typeName || "";
      const colorPallet = new mobjectGraphUi.ColorGenerator(type);

      this.textInputComponent = new mobjectGraphUi.SingleLineTextInputComponent(
        name,
        defaultValue,
        colorPallet
      );

      this.on("valueChanged", (newValue, oldValue) => {
        this.textInputComponent.text = newValue;
      });

      this.textInputComponent.on("onChange", (text) => {
        this.value = text;
      });
    }

    computeSize() {
      return this.textInputComponent.computeSize();
    }

    mouse(event, pos, node) {
      this.textInputComponent.onMouse(event, pos);
    }

    draw(ctx, node, widget_width, y, H) {
      this.textInputComponent.draw(ctx, node, widget_width, y, H);
    }
  }

  class EnumDisplayWidget extends mobjectGraphUi.DisplayWidget {
    constructor(name, parent, options) {
      super(name, parent, options);

      const defaultValue = options?.content?.defaultValue || "";
      const type = options?.content?.datatype?.typeName || "";
      const colorPallet = new mobjectGraphUi.ColorGenerator(type);

      this.textDisplayComponent = new mobjectGraphUi.SingleLineTextDisplayComponent(
        name,
        defaultValue,
        colorPallet
      );

      this.on("valueChanged", (newValue, oldValue) => {
        this.textDisplayComponent.text = newValue;
      });
    }

    computeSize() {
      return this.textDisplayComponent.computeSize();
    }

    draw(ctx, node, widget_width, y, H) {
      this.textDisplayComponent.draw(ctx, node, widget_width, y, H);
    }
  }

  class EnumControlWidget extends mobjectGraphUi.ControlWidget {
    constructor(name, parent, options) {
      super(name, parent, options);

      const defaultValue = options?.parameter?.defaultValue || "";
      const enumerations = options?.parameter?.datatype?.enumerations || [];
      const type = options?.parameter?.datatype?.typeName || "";
      const colorPallet = new mobjectGraphUi.ColorGenerator(type);

      this.comboboxComponent = new mobjectGraphUi.ComboboxComponent(
        name,
        defaultValue,
        enumerations,
        colorPallet
      );

      this.on("valueChanged", (newValue, oldValue) => {
        this.comboboxComponent.selection = newValue;
      });

      this.comboboxComponent.on("onChange", (selection) => {
        this.value = selection;
      });
    }

    computeSize() {
      return this.comboboxComponent.computeSize();
    }

    mouse(event, pos, node) {
      this.comboboxComponent.onMouse(event, pos);
    }

    draw(ctx, node, widget_width, y, H) {
      this.comboboxComponent.draw(ctx, node, widget_width, y, H);
    }
  }

  class IecDatatypesPack {
    install(graphFramework = new mobjectGraphUi.GraphFramework(), options) {
      this.registerWidgets(graphFramework, options);
    }

    registerWidgets(graphFramework, options) {
      graphFramework.registerWidgetType(BooleanControlWidget, "BOOL");
      graphFramework.registerWidgetType(BooleanDisplayWidget, "BOOL");
      graphFramework.registerWidgetType(NumericControlWidget, "BYTE");
      graphFramework.registerWidgetType(NumericDisplayWidget, "BYTE");
      graphFramework.registerWidgetType(NumericControlWidget, "WORD");
      graphFramework.registerWidgetType(NumericDisplayWidget, "WORD");
      graphFramework.registerWidgetType(NumericControlWidget, "DWORD");
      graphFramework.registerWidgetType(NumericDisplayWidget, "DWORD");
      graphFramework.registerWidgetType(NumericControlWidget, "LWORD");
      graphFramework.registerWidgetType(NumericDisplayWidget, "LWORD");
      graphFramework.registerWidgetType(NumericControlWidget, "INT");
      graphFramework.registerWidgetType(NumericDisplayWidget, "INT");
      graphFramework.registerWidgetType(NumericControlWidget, "LINT");
      graphFramework.registerWidgetType(NumericDisplayWidget, "LINT");
      graphFramework.registerWidgetType(NumericControlWidget, "DINT");
      graphFramework.registerWidgetType(NumericDisplayWidget, "DINT");
      graphFramework.registerWidgetType(NumericControlWidget, "SINT");
      graphFramework.registerWidgetType(NumericDisplayWidget, "SINT");
      graphFramework.registerWidgetType(NumericControlWidget, "USINT");
      graphFramework.registerWidgetType(NumericDisplayWidget, "USINT");
      graphFramework.registerWidgetType(NumericControlWidget, "UINT");
      graphFramework.registerWidgetType(NumericDisplayWidget, "UINT");
      graphFramework.registerWidgetType(NumericControlWidget, "UDINT");
      graphFramework.registerWidgetType(NumericDisplayWidget, "UDINT");
      graphFramework.registerWidgetType(NumericControlWidget, "ULINT");
      graphFramework.registerWidgetType(NumericDisplayWidget, "ULINT");
      graphFramework.registerWidgetType(NumericControlWidget, "REAL");
      graphFramework.registerWidgetType(NumericDisplayWidget, "REAL");
      graphFramework.registerWidgetType(NumericControlWidget, "LREAL");
      graphFramework.registerWidgetType(NumericDisplayWidget, "LREAL");
      graphFramework.registerWidgetType(StringControlWidget, "STRING");
      graphFramework.registerWidgetType(StringDisplayWidget, "STRING");
      graphFramework.registerWidgetType(EnumControlWidget, "ENUM", "*");
      graphFramework.registerWidgetType(EnumDisplayWidget, "ENUM", "*");
    }
  }

  exports.IecDatatypesPack = IecDatatypesPack;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
