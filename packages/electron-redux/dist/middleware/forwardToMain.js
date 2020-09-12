"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.forwardToMainWithParams = void 0;

var _electron = require("electron");

var _validateAction = _interopRequireDefault(require("../helpers/validateAction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// eslint-disable-next-line consistent-return, no-unused-vars
var forwardToMainWithParams = function forwardToMainWithParams() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (store) {
    return function (next) {
      return function (action) {
        var _params$blacklist = params.blacklist,
            blacklist = _params$blacklist === void 0 ? [] : _params$blacklist,
            id = params.id;
        if (!(0, _validateAction["default"])(action)) return next(action);
        if (action.meta && action.meta.scope === 'local') return next(action);

        if (blacklist.some(function (rule) {
          return rule.test(action.type);
        })) {
          return next(action);
        }

        var mainAction = action;

        if (id) {
          next(action);
          mainAction = _objectSpread(_objectSpread({}, action), {}, {
            meta: _objectSpread(_objectSpread({}, action.meta), {}, {
              id: id
            })
          });
          window.electronReduxId = id;
        } // stop action in-flight


        _electron.ipcRenderer.send('redux-action', mainAction);
      };
    };
  };
};

exports.forwardToMainWithParams = forwardToMainWithParams;
var forwardToMain = forwardToMainWithParams({
  blacklist: [/^@@/, /^redux-form/]
});
var _default = forwardToMain;
exports["default"] = _default;