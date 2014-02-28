/*!
 * Plyfe Widgets Library v0.1.9
 * http://plyfe.com/
 *
 * Copyright 2014, Plyfe Inc.
 *
 * Available via the MIT license.
 * http://github.com/plyfe/plyfe-widgets/LICENSE
 *
 * Date: 2014-02-28
 */
(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.Plyfe = {
            amd: false
        };
        root.Plyfe = factory();
    }
})(this, function() {
    var requirejs, require, define;
    (function(undef) {
        var main, req, makeMap, handlers, defined = {}, waiting = {}, config = {}, defining = {}, hasOwn = Object.prototype.hasOwnProperty, aps = [].slice, jsSuffixRegExp = /\.js$/;
        function hasProp(obj, prop) {
            return hasOwn.call(obj, prop);
        }
        function normalize(name, baseName) {
            var nameParts, nameSegment, mapValue, foundMap, lastIndex, foundI, foundStarMap, starI, i, j, part, baseParts = baseName && baseName.split("/"), map = config.map, starMap = map && map["*"] || {};
            if (name && name.charAt(0) === ".") {
                if (baseName) {
                    baseParts = baseParts.slice(0, baseParts.length - 1);
                    name = name.split("/");
                    lastIndex = name.length - 1;
                    if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                        name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, "");
                    }
                    name = baseParts.concat(name);
                    for (i = 0; i < name.length; i += 1) {
                        part = name[i];
                        if (part === ".") {
                            name.splice(i, 1);
                            i -= 1;
                        } else if (part === "..") {
                            if (i === 1 && (name[2] === ".." || name[0] === "..")) {
                                break;
                            } else if (i > 0) {
                                name.splice(i - 1, 2);
                                i -= 2;
                            }
                        }
                    }
                    name = name.join("/");
                } else if (name.indexOf("./") === 0) {
                    name = name.substring(2);
                }
            }
            if ((baseParts || starMap) && map) {
                nameParts = name.split("/");
                for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join("/");
                    if (baseParts) {
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = map[baseParts.slice(0, j).join("/")];
                            if (mapValue) {
                                mapValue = mapValue[nameSegment];
                                if (mapValue) {
                                    foundMap = mapValue;
                                    foundI = i;
                                    break;
                                }
                            }
                        }
                    }
                    if (foundMap) {
                        break;
                    }
                    if (!foundStarMap && starMap && starMap[nameSegment]) {
                        foundStarMap = starMap[nameSegment];
                        starI = i;
                    }
                }
                if (!foundMap && foundStarMap) {
                    foundMap = foundStarMap;
                    foundI = starI;
                }
                if (foundMap) {
                    nameParts.splice(0, foundI, foundMap);
                    name = nameParts.join("/");
                }
            }
            return name;
        }
        function makeRequire(relName, forceSync) {
            return function() {
                return req.apply(undef, aps.call(arguments, 0).concat([ relName, forceSync ]));
            };
        }
        function makeNormalize(relName) {
            return function(name) {
                return normalize(name, relName);
            };
        }
        function makeLoad(depName) {
            return function(value) {
                defined[depName] = value;
            };
        }
        function callDep(name) {
            if (hasProp(waiting, name)) {
                var args = waiting[name];
                delete waiting[name];
                defining[name] = true;
                main.apply(undef, args);
            }
            if (!hasProp(defined, name) && !hasProp(defining, name)) {
                throw new Error("No " + name);
            }
            return defined[name];
        }
        function splitPrefix(name) {
            var prefix, index = name ? name.indexOf("!") : -1;
            if (index > -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }
            return [ prefix, name ];
        }
        makeMap = function(name, relName) {
            var plugin, parts = splitPrefix(name), prefix = parts[0];
            name = parts[1];
            if (prefix) {
                prefix = normalize(prefix, relName);
                plugin = callDep(prefix);
            }
            if (prefix) {
                if (plugin && plugin.normalize) {
                    name = plugin.normalize(name, makeNormalize(relName));
                } else {
                    name = normalize(name, relName);
                }
            } else {
                name = normalize(name, relName);
                parts = splitPrefix(name);
                prefix = parts[0];
                name = parts[1];
                if (prefix) {
                    plugin = callDep(prefix);
                }
            }
            return {
                f: prefix ? prefix + "!" + name : name,
                n: name,
                pr: prefix,
                p: plugin
            };
        };
        function makeConfig(name) {
            return function() {
                return config && config.config && config.config[name] || {};
            };
        }
        handlers = {
            require: function(name) {
                return makeRequire(name);
            },
            exports: function(name) {
                var e = defined[name];
                if (typeof e !== "undefined") {
                    return e;
                } else {
                    return defined[name] = {};
                }
            },
            module: function(name) {
                return {
                    id: name,
                    uri: "",
                    exports: defined[name],
                    config: makeConfig(name)
                };
            }
        };
        main = function(name, deps, callback, relName) {
            var cjsModule, depName, ret, map, i, args = [], callbackType = typeof callback, usingExports;
            relName = relName || name;
            if (callbackType === "undefined" || callbackType === "function") {
                deps = !deps.length && callback.length ? [ "require", "exports", "module" ] : deps;
                for (i = 0; i < deps.length; i += 1) {
                    map = makeMap(deps[i], relName);
                    depName = map.f;
                    if (depName === "require") {
                        args[i] = handlers.require(name);
                    } else if (depName === "exports") {
                        args[i] = handlers.exports(name);
                        usingExports = true;
                    } else if (depName === "module") {
                        cjsModule = args[i] = handlers.module(name);
                    } else if (hasProp(defined, depName) || hasProp(waiting, depName) || hasProp(defining, depName)) {
                        args[i] = callDep(depName);
                    } else if (map.p) {
                        map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                        args[i] = defined[depName];
                    } else {
                        throw new Error(name + " missing " + depName);
                    }
                }
                ret = callback ? callback.apply(defined[name], args) : undefined;
                if (name) {
                    if (cjsModule && cjsModule.exports !== undef && cjsModule.exports !== defined[name]) {
                        defined[name] = cjsModule.exports;
                    } else if (ret !== undef || !usingExports) {
                        defined[name] = ret;
                    }
                }
            } else if (name) {
                defined[name] = callback;
            }
        };
        requirejs = require = req = function(deps, callback, relName, forceSync, alt) {
            if (typeof deps === "string") {
                if (handlers[deps]) {
                    return handlers[deps](callback);
                }
                return callDep(makeMap(deps, callback).f);
            } else if (!deps.splice) {
                config = deps;
                if (config.deps) {
                    req(config.deps, config.callback);
                }
                if (!callback) {
                    return;
                }
                if (callback.splice) {
                    deps = callback;
                    callback = relName;
                    relName = null;
                } else {
                    deps = undef;
                }
            }
            callback = callback || function() {};
            if (typeof relName === "function") {
                relName = forceSync;
                forceSync = alt;
            }
            if (forceSync) {
                main(undef, deps, callback, relName);
            } else {
                setTimeout(function() {
                    main(undef, deps, callback, relName);
                }, 4);
            }
            return req;
        };
        req.config = function(cfg) {
            return req(cfg);
        };
        requirejs._defined = defined;
        define = function(name, deps, callback) {
            if (!deps.splice) {
                callback = deps;
                deps = [];
            }
            if (!hasProp(defined, name) && !hasProp(waiting, name)) {
                waiting[name] = [ name, deps, callback ];
            }
        };
        define.amd = {
            jQuery: true
        };
    })();
    define("../node_modules/almond/almond", function() {});
    define("utils", [ "require", "exports", "module" ], function(require, exports, module) {
        var head = document.getElementsByTagName("head")[0];
        var _undefined;
        function dataAttr(el, name, defval) {
            return el.getAttribute("data-" + name) || defval;
        }
        function buildQueryString(params) {
            var qs = [];
            objForEach(params || {}, function(name) {
                var value = params[name];
                if (value === _undefined) {
                    return;
                }
                var part = encodeURIComponent(camelToDashed(name));
                if (value !== null) {
                    part += "=" + encodeURIComponent(value);
                }
                qs.push(part);
            });
            return qs.join("&");
        }
        function buildUrl(scheme, domain, port, path, params) {
            switch (scheme) {
              case "http":
                port = !port || port === 80 ? "" : ":" + port;
                break;

              case "https":
                port = !port || port === 443 ? "" : ":" + port;
                break;
            }
            var url = scheme + "://" + (domain || "") + port;
            var qs = buildQueryString(params);
            url += (path ? "/" + path : "").replace(/\/{2,}/g, "/");
            url += (qs ? "?" : "") + qs;
            return url;
        }
        var isCorsSupported = false;
        if (window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest()) {
            isCorsSupported = true;
        }
        function objForEach(obj, callback) {
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    callback(name, obj[name]);
                }
            }
        }
        function getElementsByClassName(className, tag) {
            if (document.getElementsByClass) {
                return document.getElementsByClassName(className);
            } else if (document.querySelectorAll) {
                return document.querySelectorAll("." + className);
            }
            var els = document.getElementsByTagName(tag || "*");
            var pattern = new RegExp("\\b" + className + "\\b");
            var foundEls = [];
            for (var i = 0, _len = els.length; i < _len; i++) {
                if (pattern.test(els[i].className)) {
                    foundEls.push(els[i]);
                }
            }
            return foundEls;
        }
        var addEvent = function(obj, name, fn) {
            obj.addEventListener(name, fn, false);
        };
        if (window.attachEvent) {
            addEvent = function(obj, name, fn) {
                var _fn = fn.__attachEventRef = function() {
                    var e = window.event;
                    e.keyCode = e.which;
                    fn(e);
                };
                obj.attachEvent("on" + name, _fn);
            };
        }
        var removeEvent = function(obj, name, fn) {
            obj.removeEventListener(name, fn, false);
        };
        if (window.detachEvent) {
            removeEvent = function(obj, name, fn) {
                obj.detachEvent("on" + name, fn.__attachEventRef);
            };
        }
        var readyCallbacks = [];
        var domLoaded = false;
        function ready(e) {
            if (e && e.type === "readystatechange" && document.readyState !== "complete") {
                return;
            }
            if (domLoaded) {
                return;
            }
            domLoaded = true;
            removeEvent(window, "load", ready);
            removeEvent(document, "readystatechange", ready);
            removeEvent(document, "DOMContentLoaded", ready);
            for (var i = 0; i < readyCallbacks.length; i++) {
                readyCallbacks[i]();
            }
        }
        if (document.readyState === "complete") {
            ready();
        } else {
            addEvent(window, "load", ready);
            addEvent(document, "readystatechange", ready);
            addEvent(document, "DOMContentLoaded", ready);
        }
        function domReady(callback) {
            if (domLoaded) {
                callback();
            } else {
                readyCallbacks.push(callback);
            }
        }
        function setStyles(el, styles) {
            objForEach(styles, function(name, value) {
                el.style[name] = typeof value === "number" ? value + "px" : value;
            });
        }
        function dashedToCamel(input) {
            return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
                return group1.toUpperCase();
            });
        }
        function camelToDashed(input) {
            return input.replace(/([A-Z])/g, function(match, group1) {
                return "-" + group1.toLowerCase();
            });
        }
        function customStyleSheet(css, options) {
            options = options || {};
            var sheet = document.createElement("style");
            sheet.type = "text/css";
            sheet.media = "screen";
            if (options.id) {
                sheet.id = options.id;
            }
            if (sheet.styleSheet) {
                sheet.styleSheet.cssText = css;
            } else {
                sheet.appendChild(document.createTextNode(css));
            }
            head.insertBefore(sheet, head.firstChild);
            return sheet;
        }
        var transitionRuleName = function() {
            var tempDiv = document.createElement("div");
            var vendorPrefixes = [ null, "Moz", "webkit", "Webkit", "Khtml", "O", "ms" ];
            for (var i = 0; i < vendorPrefixes.length; i++) {
                var prefix = vendorPrefixes[i];
                var prop = !prefix ? "transition" : prefix + "Transition";
                if (typeof tempDiv.style[prop] === "string") {
                    return prop;
                }
            }
        }();
        function cssTransition(rule) {
            return transitionRuleName + ": " + rule + ";";
        }
        function uniqueString(size) {
            size = +size || 0;
            var s = "";
            while (s.length < size) {
                s += Math.random().toString(36).substring(2);
            }
            return s.substr(0, size);
        }
        return {
            head: head,
            dataAttr: dataAttr,
            buildQueryString: buildQueryString,
            buildUrl: buildUrl,
            isCorsSupported: isCorsSupported,
            objForEach: objForEach,
            getElementsByClassName: getElementsByClassName,
            addEvent: addEvent,
            removeEvent: removeEvent,
            domReady: domReady,
            setStyles: setStyles,
            dashedToCamel: dashedToCamel,
            camelToDashed: camelToDashed,
            customStyleSheet: customStyleSheet,
            cssTransition: cssTransition,
            uniqueString: uniqueString
        };
    });
    define("settings", [ "require", "exports", "module" ], function(require, exports, module) {
        return {
            api: {
                scheme: "https",
                domain: "plyfe.me",
                port: 443,
                userToken: null
            },
            widget: {
                className: "plyfe-widget"
            }
        };
    });
    define("api", [ "require", "exports", "module", "utils", "settings" ], function(require, exports, module) {
        var utils = require("utils");
        var settings = require("settings");
        var _undefined;
        function buildApiUrl(path) {
            return utils.buildUrl(settings.api.scheme, settings.api.domain, settings.api.port, path);
        }
        function makeApiRequest(method, path, data, options) {
            options = options || {};
            method = method.toUpperCase();
            var url = buildApiUrl(path);
            var req = utils.isCorsSupported ? new XMLHttpRequest() : new JSONPRequest();
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    switch (req.status) {
                      case 0:
                        throw new Error("Request " + url + " returned an invalid HTTP status of 0.");

                      case 200:
                      case 304:
                        if (options.onSuccess) {
                            var data = req.responseText;
                            if (typeof data === "string") {
                                data = JSON.parse(data);
                            }
                            options.onSuccess(data, req.status);
                        }
                        break;
                    }
                }
            };
            if (method === "GET" && data) {
                url += (url.indexOf("?") >= 0 ? "&" : "?") + utils.buildQueryString(data);
            }
            req.open(method, url);
            if (options.withCredentials) {
                req.withCredentials = true;
            }
            if (method === "POST" && data) {
                req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                if (typeof data === "object") {
                    data = utils.buildQueryString(data);
                }
            }
            req.send(data ? data : null);
            return req;
        }
        function JSONPRequest(callbackName) {
            this.el = document.createElement("script");
            this.uniqueCallbackName = callbackName || "plyfeJsonPCallback_" + utils.uniqueString(10);
        }
        JSONPRequest.prototype.setRequestHeader = function() {};
        JSONPRequest.prototype.open = function(method, url) {
            this.method = method;
            this.url = url;
        };
        JSONPRequest.prototype.send = function(data) {
            var self = this;
            window[this.uniqueCallbackName] = function(data) {
                try {
                    delete window[self.uniqueCallbackName];
                } catch (e) {
                    window[self.uniqueCallbackName] = _undefined;
                }
                self.responseText = data;
                self.readyState = 4;
                self.status = data.http_status_code || 200;
                self.onreadystatechange();
            };
            var params = {
                callback: this.uniqueCallbackName,
                http_method: this.method.toUpperCase()
            };
            if (data) {
                params.http_data = data;
            }
            this.el.src = this.url + "?" + utils.buildQueryString(params) + "&" + data;
            utils.head.appendChild(this.el);
            setTimeout(function() {
                try {
                    utils.head.removeChild(self.el);
                } catch (e) {}
            }, 200);
        };
        function get(path, data, options) {
            return makeApiRequest.call(null, "get", path, data, options);
        }
        function post(path, data, options) {
            return makeApiRequest.call(null, "post", path, data, options);
        }
        return {
            get: get,
            post: post,
            JSONPRequest: JSONPRequest,
            buildApiUrl: buildApiUrl
        };
    });
    define("dialog", [ "require", "exports", "module", "utils" ], function(require, exports, module) {
        var utils = require("utils");
        var MODAL_DIALOG_CSS = "" + "#plyfe-modal-container {" + "position: fixed;" + "top: 0;" + "right: 0;" + "bottom: 0;" + "left: 0;" + "visibility: hidden;" + "background-color: transparent;" + utils.cssTransition("background-color 1s, visibility 0s linear 1s") + "}" + "\n" + "#plyfe-modal-container.show {" + "visibility: visible;" + "background-color: rgba(0, 0, 0, 0.5);" + utils.cssTransition("background-color 500ms") + "}" + "\n" + "#plyfe-modal-dialog {" + "position: absolute;" + "top: 20%;" + "left: 50%;" + "margin-left: 150px;" + "width: 300px;" + "opacity: 0;" + "border: 1px solid #DDD;" + "border-radius: 5px;" + "background-color: #EEE;" + utils.cssTransition("opacity 500ms") + "}" + "#plyfe-modal-dialog.ready {" + "opacity: 1" + "}" + "\n" + "#plyfe-modal-iframe {" + "display: block;" + "width: 100%;" + "height: 100%;" + "border: none;" + "overflow: hidden;" + "margin: 1.5%;" + "}";
        utils.customStyleSheet(MODAL_DIALOG_CSS, {
            id: "plyfe-dialog-css"
        });
        var container = document.createElement("div");
        container.id = "plyfe-modal-container";
        var dialog = document.createElement("div");
        dialog.id = "plyfe-modal-dialog";
        container.appendChild(dialog);
        var iframe = document.createElement("iframe");
        iframe.id = "plyfe-modal-iframe";
        iframe.allowtransparency = "true";
        iframe.onload = function() {
            dialog.className = "ready";
        };
        dialog.appendChild(iframe);
        utils.domReady(function() {
            document.body.appendChild(container);
        });
        utils.addEvent(container, "mousedown", function(e) {
            if (e.target === container) {
                close();
            }
        });
        utils.addEvent(document, "keyup", function(e) {
            if (e.keyCode === 27) {
                close();
            }
        });
        function open(src, width, height) {
            width = Math.max(Math.min(+width || 320, document.documentElement.clientWidth), 240);
            height = Math.max(Math.min(+height || 200, document.documentElement.clientWidth), 100);
            close();
            container.className = "show";
            iframe.src = src;
            utils.setStyles(dialog, {
                width: width,
                height: height,
                marginLeft: width / 2
            });
        }
        function close() {
            container.className = "";
            dialog.className = "";
        }
        return {
            open: open,
            close: close
        };
    });
    define("widget", [ "require", "exports", "module", "utils", "settings" ], function(require, exports, module) {
        var utils = require("utils");
        var settings = require("settings");
        var widgets = [];
        var widgetCount = 0;
        var WIDGET_CSS = "" + ".plyfe-widget {" + "opacity: 0;" + utils.cssTransition("opacity 300ms") + "}" + "\n" + ".plyfe-widget.ready {" + "opacity: 1;" + "}" + "\n" + ".plyfe-widget iframe {" + "display: block;" + "width: 100%;" + "height: 100%;" + "border-width: 0;" + "overflow: hidden;" + "}";
        utils.customStyleSheet(WIDGET_CSS, {
            id: "plyfe-widget-css"
        });
        function Widget(el) {
            this.el = el;
            this.venue = utils.dataAttr(el, "venue");
            this.type = utils.dataAttr(el, "type");
            this.id = utils.dataAttr(el, "id");
            var scheme = utils.dataAttr(el, "scheme", settings.api.scheme);
            var domain = utils.dataAttr(el, "domain", settings.api.domain);
            var port = utils.dataAttr(el, "port", settings.api.port);
            if (!this.venue) {
                throw new Error("data-venue attribute required");
            }
            if (!this.type) {
                throw new Error("data-type attribute required");
            }
            if (!this.id) {
                throw new Error("data-id attribute required");
            }
            var path = [ "w", this.venue, this.type, this.id ];
            var params = {
                theme: settings.widget.theme,
                width: utils.dataAttr(el, "width"),
                maxWidth: utils.dataAttr(el, "max-width"),
                minWidth: utils.dataAttr(el, "min-width"),
                height: utils.dataAttr(el, "height"),
                maxHeight: utils.dataAttr(el, "max-height"),
                minHeight: utils.dataAttr(el, "min-height")
            };
            var url = utils.buildUrl(scheme, domain, port, path.join("/"), params);
            var iframeName = "plyfe-" + ++widgetCount;
            var iframe = document.createElement("iframe");
            iframe.onload = function() {
                iframe.parentNode.className += " ready";
            };
            iframe.name = iframeName;
            iframe.src = url;
            this.el.innerHTML = "";
            this.el.appendChild(iframe);
            this.iframe = iframe;
        }
        function createWidget(el) {
            if (!el && el.nodeType === 3) {
                throw new Error("createWidget() must be called with a DOM element");
            }
            if (el.firstChild === null || el.firstChild.nodeName !== "iframe") {
                widgets.push(new Widget(el));
            }
        }
        function destroyWidget(el) {
            if (el.nodeName !== "iframe") {
                el = el.firstChild;
            }
            if (el && el.nodeName === "iframe") {
                for (var i = widgets.length - 1; i >= 0; i--) {
                    var widget = widgets[i];
                    if (widget.iframe === el) {
                        widgets.splice(i, 1);
                        el.parentNode.innerHTML = "";
                    }
                }
            }
        }
        function forEach(callback) {
            for (var i = widgets.length - 1; i >= 0; i--) {
                callback(widgets[i]);
            }
        }
        return {
            create: createWidget,
            distroy: destroyWidget,
            list: widgets,
            forEach: forEach
        };
    });
    define("switchboard", [ "require", "exports", "module", "utils", "dialog", "widget" ], function(require, exports, module) {
        var utils = require("utils");
        var dialog = require("dialog");
        var widget = require("widget");
        var MESSAGE_PREFIX = "plyfe";
        var ORIGIN = "*";
        function pm(win, name, data) {
            if (!name) {
                throw new TypeError("Argument name required");
            }
            win.postMessage("plyfe:" + name + "\n" + JSON.stringify(data), ORIGIN);
        }
        function gotMessage(e) {
            if (!window.JSON) {
                return;
            }
            var payload = e.data;
            var messageForUs = e.origin === ORIGIN && payload.substr(0, MESSAGE_PREFIX.length) === MESSAGE_PREFIX;
            if (messageForUs) {
                var newlinePos = payload.indexOf("\n", MESSAGE_PREFIX.length + 1);
                var name = payload.substr(MESSAGE_PREFIX.length + 1, newlinePos);
                var data = JSON.parse(payload.substr(newlinePos + 1));
                var frames = window.frames;
                routeMessage(name, data, e.source);
            }
        }
        function routeMessage(name, data, sourceFrame) {
            switch (name) {
              case "dialog:open":
                dialog.open(data.src, data.width, data.height);
                break;

              case "dialog:close":
                dialog.close();
                break;

              case "sizechanged":
                widget.forEach(function(wgt) {
                    if (wgt.iframe === sourceFrame) {
                        utils.setStyles(wgt.el, {
                            width: data.width,
                            height: data.height
                        });
                    }
                });
                break;

              case "pusher":
                break;

              case "broadcast":
                widget.forEach(function(wgt) {
                    if (wgt.iframe !== sourceFrame) {
                        pm(wgt.iframe, name, data);
                    }
                });
                break;

              default:
                console.warn("Switchboard recieved a unhandled '" + name + "' message", data);
            }
        }
        utils.addEvent(window, "message", gotMessage);
        return {
            postMessage: pm
        };
    });
    define("main", [ "require", "exports", "module", "utils", "settings", "api", "dialog", "widget", "switchboard" ], function(require, exports, module) {
        var utils = require("utils");
        var settings = require("settings");
        var api = require("api");
        var dialog = require("dialog");
        var widget = require("widget");
        var switchboard = require("switchboard");
        var globalInitFnName = "plyfeAsyncInit";
        var loadedViaRealAMDLoader = !window.Plyfe || window.Plyfe.amd !== false;
        function PlyfeError(message) {
            this.name = "PlyfeError";
            this.message = message || "";
        }
        PlyfeError.prototype = Error.prototype;
        var userToken, widgetDomain, widgetPort, widgetClassName = "plyfe-widget";
        var scripts = document.getElementsByTagName("script");
        for (var i = scripts.length - 1; i >= 0; i--) {
            var script = scripts[i];
            if (/\/plyfe-widgets.*?\.js(\?|#|$)/.test(script.src)) {
                settings.api.userToken = utils.dataAttr(script, "user-token", null);
                settings.api.scheme = utils.dataAttr(script, "scheme", settings.api.scheme);
                settings.api.domain = utils.dataAttr(script, "domain", settings.api.domain);
                settings.api.port = +utils.dataAttr(script, "port") || settings.api.port;
                globalInitFnName = utils.dataAttr(script, "init-name", globalInitFnName);
                break;
            }
        }
        if (!loadedViaRealAMDLoader) {
            utils.domReady(function() {
                if (window[globalInitFnName] && typeof window[globalInitFnName] === "function") {
                    setTimeout(window[globalInitFnName], 0);
                } else if (settings.api.userToken) {
                    login(function() {
                        createWidgets();
                    });
                }
            });
        }
        function createWidgets() {
            var divs = utils.getElementsByClassName(settings.widget.className);
            for (var i = 0; i < divs.length; i++) {
                widget.create(divs[i]);
            }
        }
        function createWidget(el) {
            return widget.create(el);
        }
        function login(callback) {
            if (!settings.api.userToken) {
                throw new PlyfeError("A userToken must be set before login.");
            }
            var options = {
                withCredentials: true
            };
            if (callback) {
                options.onSuccess = callback;
            }
            return api.post("/external_sessions/", {
                auth_token: settings.api.userToken
            }, options);
        }
        return {
            settings: settings,
            createWidgets: createWidgets,
            createWidget: createWidget,
            login: login
        };
    });
    return require("main");
});