"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DatasourceModel = require("./DatasourceModel");

Object.keys(_DatasourceModel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _DatasourceModel[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _DatasourceModel[key];
    }
  });
});

var _SchemaModel = require("./SchemaModel");

Object.keys(_SchemaModel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _SchemaModel[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _SchemaModel[key];
    }
  });
});

var _TableModel = require("./TableModel");

Object.keys(_TableModel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _TableModel[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _TableModel[key];
    }
  });
});

var _AttributeModel = require("./AttributeModel");

Object.keys(_AttributeModel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _AttributeModel[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _AttributeModel[key];
    }
  });
});

var _ArticleModel = require("./ArticleModel");

Object.keys(_ArticleModel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ArticleModel[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ArticleModel[key];
    }
  });
});
//# sourceMappingURL=index.js.map