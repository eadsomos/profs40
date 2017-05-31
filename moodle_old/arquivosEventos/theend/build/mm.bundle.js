// (C) Copyright 2015 Martin Dougiamas
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var assignFinalId;
var userFinalId;
var ret = "var inicial";
angular.module('mm', ['ionic', 'mm.core', 'mm.core.comments', 'mm.core.contentlinks', 'mm.core.course', 'mm.core.courses', 'mm.core.fileuploader', 'mm.core.login', 'mm.core.question', 'mm.core.settings', 'mm.core.sharedfiles', 'mm.core.sidemenu', 'mm.core.textviewer', 'mm.core.user', 'mm.addons.calendar', 'mm.addons.competency', 'mm.addons.coursecompletion', 'mm.addons.files', 'mm.addons.frontpage', 'mm.addons.grades', 'mm.addons.messages', 'mm.addons.notes', 'mm.addons.notifications', 'mm.addons.participants', 'mm.addons.pushnotifications', 'mm.addons.remotestyles', 'mm.addons.mod_assign', 'mm.addons.mod_book', 'mm.addons.mod_chat', 'mm.addons.mod_choice', 'mm.addons.mod_folder', 'mm.addons.mod_forum', 'mm.addons.mod_glossary', 'mm.addons.mod_imscp', 'mm.addons.mod_label', 'mm.addons.mod_lti', 'mm.addons.mod_page', 'mm.addons.mod_pense', 'mm.addons.mod_saiba', 'mm.addons.mod_proposta', 'mm.addons.mod_estudo', 'mm.addons.mod_webaula', 'mm.addons.mod_textos', 'mm.addons.mod_quiz', 'mm.addons.mod_resource', 'mm.addons.mod_scorm', 'mm.addons.mod_survey', 'mm.addons.mod_url', 'mm.addons.mod_wiki', 'mm.addons.qbehaviour_adaptive', 'mm.addons.qbehaviour_adaptivenopenalty', 'mm.addons.qbehaviour_deferredcbm', 'mm.addons.qbehaviour_deferredfeedback', 'mm.addons.qbehaviour_immediatecbm', 'mm.addons.qbehaviour_immediatefeedback', 'mm.addons.qbehaviour_informationitem', 'mm.addons.qbehaviour_interactive', 'mm.addons.qbehaviour_interactivecountback', 'mm.addons.qbehaviour_manualgraded', 'mm.addons.qtype_calculated', 'mm.addons.qtype_calculatedmulti', 'mm.addons.qtype_calculatedsimple', 'mm.addons.qtype_ddimageortext', 'mm.addons.qtype_ddmarker', 'mm.addons.qtype_ddwtos', 'mm.addons.qtype_description', 'mm.addons.qtype_essay', 'mm.addons.qtype_gapselect', 'mm.addons.qtype_match', 'mm.addons.qtype_multianswer', 'mm.addons.qtype_multichoice', 'mm.addons.qtype_numerical', 'mm.addons.qtype_randomsamatch', 'mm.addons.qtype_shortanswer', 'mm.addons.qtype_truefalse', 'ngCordova', 'angular-md5', 'pascalprecht.translate', 'ngAria', 'oc.lazyLoad',
    'ngIOS9UIWebViewPatch', 'ckeditor'])
.run(["$ionicPlatform", function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
}]);

angular.module('mm.core', ['pascalprecht.translate'])
.constant('mmCoreSessionExpired', 'mmCoreSessionExpired')
.constant('mmCoreUserDeleted', 'mmCoreUserDeleted')
.constant('mmCoreSecondsYear', 31536000)
.constant('mmCoreSecondsDay', 86400)
.constant('mmCoreSecondsHour', 3600)
.constant('mmCoreSecondsMinute', 60)
.constant('mmCoreDownloaded', 'downloaded')
.constant('mmCoreDownloading', 'downloading')
.constant('mmCoreNotDownloaded', 'notdownloaded')
.constant('mmCoreOutdated', 'outdated')
.constant('mmCoreNotDownloadable', 'notdownloadable')
.constant('mmCoreWifiDownloadThreshold', 104857600)
.constant('mmCoreDownloadThreshold', 10485760)
.config(["$stateProvider", "$provide", "$ionicConfigProvider", "$httpProvider", "$mmUtilProvider", "$mmLogProvider", "$compileProvider", "$mmInitDelegateProvider", "mmInitDelegateMaxAddonPriority", function($stateProvider, $provide, $ionicConfigProvider, $httpProvider, $mmUtilProvider,
        $mmLogProvider, $compileProvider, $mmInitDelegateProvider, mmInitDelegateMaxAddonPriority) {
    $ionicConfigProvider.platform.android.tabs.position('bottom');
    $provide.decorator('$ionicPlatform', ['$delegate', '$window', function($delegate, $window) {
        $delegate.isTablet = function() {
            var mq = 'only screen and (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1)';
            return $window.matchMedia(mq).matches;
        };
        return $delegate;
    }]);
        $provide.decorator('$log', ['$delegate', $mmLogProvider.logDecorator]);
    $stateProvider
        .state('redirect', {
            url: '/redirect',
            params: {
                siteid: null,
                state: null,
                params: null
            },
            cache: false,
            controller: ["$scope", "$state", "$stateParams", "$mmSite", "$mmSitesManager", "$ionicHistory", function($scope, $state, $stateParams, $mmSite, $mmSitesManager, $ionicHistory) {
                $ionicHistory.nextViewOptions({disableBack: true});
                function loadSiteAndGo() {
                    $mmSitesManager.loadSite($stateParams.siteid).then(function() {
                        $state.go($stateParams.state, $stateParams.params);
                    }, function() {
                        $state.go('mm_login.sites');
                    });
                }
                $scope.$on('$ionicView.enter', function() {
                    if ($mmSite.isLoggedIn()) {
                        if ($stateParams.siteid && $stateParams.siteid != $mmSite.getId()) {
                            $mmSitesManager.logout().then(function() {
                                loadSiteAndGo();
                            });
                        } else {
                            $state.go($stateParams.state, $stateParams.params);
                        }
                    } else {
                        if ($stateParams.siteid) {
                            loadSiteAndGo();
                        } else {
                            $state.go('mm_login.sites');
                        }
                    }
                });
            }]
        });
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? $mmUtilProvider.param(data) : data;
    }];
    function addProtocolIfMissing(list, protocol) {
        if (list.indexOf(protocol) == -1) {
            list = list.replace('https?', 'https?|' + protocol);
        }
        return list;
    }
    var hreflist = $compileProvider.aHrefSanitizationWhitelist().source,
        imglist = $compileProvider.imgSrcSanitizationWhitelist().source;
    hreflist = addProtocolIfMissing(hreflist, 'file');
    hreflist = addProtocolIfMissing(hreflist, 'tel');
    hreflist = addProtocolIfMissing(hreflist, 'mailto');
    hreflist = addProtocolIfMissing(hreflist, 'geo');
    hreflist = addProtocolIfMissing(hreflist, 'filesystem');
    imglist = addProtocolIfMissing(imglist, 'filesystem');
    imglist = addProtocolIfMissing(imglist, 'file');
    imglist = addProtocolIfMissing(imglist, 'cdvfile');
    moment.relativeTimeThreshold('M', 12);
    moment.relativeTimeThreshold('d', 31);
    moment.relativeTimeThreshold('h', 24);
    moment.relativeTimeThreshold('m', 60);
    moment.relativeTimeThreshold('s', 60);
    $compileProvider.aHrefSanitizationWhitelist(hreflist);
    $compileProvider.imgSrcSanitizationWhitelist(imglist);
    $mmInitDelegateProvider.registerProcess('mmAppInit', '$mmApp.initProcess', mmInitDelegateMaxAddonPriority + 400, true);
    $mmInitDelegateProvider.registerProcess('mmUpdateManager', '$mmUpdateManager.check', mmInitDelegateMaxAddonPriority + 300, true);
    $mmInitDelegateProvider.registerProcess('mmFSClearTmp', '$mmFS.clearTmpFolder', mmInitDelegateMaxAddonPriority + 150, false);
}])
.run(["$ionicPlatform", "$ionicBody", "$window", "$mmEvents", "$mmInitDelegate", "mmCoreEventKeyboardShow", "mmCoreEventKeyboardHide", function($ionicPlatform, $ionicBody, $window, $mmEvents, $mmInitDelegate, mmCoreEventKeyboardShow, mmCoreEventKeyboardHide) {
    $mmInitDelegate.executeInitProcesses();
    $ionicPlatform.ready(function() {
        var checkTablet = function() {
            $ionicBody.enableClass($ionicPlatform.isTablet(), 'tablet');
        };
        ionic.on('resize', checkTablet, $window);
        checkTablet();
        $window.addEventListener('native.keyboardshow', function(e) {
            $mmEvents.trigger(mmCoreEventKeyboardShow, e);
        });
        $window.addEventListener('native.keyboardhide', function(e) {
            $mmEvents.trigger(mmCoreEventKeyboardHide, e);
        });
    });
}]);

angular.module('mm.core')
.constant('mmAddonManagerComponent', 'mmAddonManager')
.factory('$mmAddonManager', ["$log", "$injector", "$ocLazyLoad", "$mmFilepool", "$mmSite", "$mmFS", "$mmLang", "$mmSitesManager", "$q", "$mmUtil", "mmAddonManagerComponent", "mmCoreNotDownloaded", function($log, $injector, $ocLazyLoad, $mmFilepool, $mmSite, $mmFS, $mmLang, $mmSitesManager, $q,
            $mmUtil, mmAddonManagerComponent, mmCoreNotDownloaded) {
    $log = $log.getInstance('$mmAddonManager');
    var self = {},
        instances = {},
        remoteAddonsFolderName = 'remoteaddons',
        remoteAddonFilename = 'addon.js',
        remoteAddonCssFilename = 'styles.css',
        pathWildcardRegex = /\$ADDONPATH\$/g,
        headEl = angular.element(document.querySelector('head')),
        loadedAddons = [],
        loadedModules = [];
        self.downloadRemoteAddon = function(addon, siteId) {
        siteId = siteId || $mmSite.getId();
        var name = self.getRemoteAddonName(addon),
            dirPath = self.getRemoteAddonDirectoryPath(addon),
            revision = addon.filehash,
            file = {
                filename: name + '.zip',
                fileurl: addon.fileurl
            };
        return $mmFilepool.getPackageStatus(siteId, mmAddonManagerComponent, name, revision, 0).then(function(status) {
            if (status !== $mmFilepool.FILEDOWNLOADED) {
                return $mmFilepool.downloadPackage(siteId, [file], mmAddonManagerComponent, name, revision, 0).then(function() {
                    return $mmFS.removeDir(dirPath).catch(function() {});
                }).then(function() {
                    return $mmFilepool.getFilePathByUrl(siteId, addon.fileurl);
                }).then(function(zipPath) {
                    return $mmFS.unzipFile(zipPath, dirPath).then(function() {
                        return $mmFilepool.removeFileByUrl(siteId, addon.fileurl).catch(function() {});
                    });
                }).then(function() {
                    return $mmFS.getDir(dirPath);
                }).then(function(dir) {
                    var absoluteDirPath = $mmFS.getInternalURL(dir);
                    if (absoluteDirPath.slice(-1) == '/') {
                        absoluteDirPath = absoluteDirPath.substring(0, absoluteDirPath.length - 1);
                    }
                    var addonMainFile = $mmFS.concatenatePaths(dirPath, remoteAddonFilename);
                    return $mmFS.replaceInFile(addonMainFile, pathWildcardRegex, absoluteDirPath);
                }).catch(function() {
                    return self.setRemoteAddonStatus(addon, status).then(function() {
                        return $q.reject();
                    });
                });
            }
        });
    };
        self.downloadRemoteAddons = function(siteId) {
        siteId = siteId || $mmSite.getId();
        var downloaded = {},
            preSets = {};
        return $mmSitesManager.getSite(siteId).then(function(site) {
            preSets.getFromCache = 0;
            return site.read('tool_mobile_get_plugins_supporting_mobile', {}, preSets).then(function(data) {
                var promises = [];
                angular.forEach(data.plugins, function(addon) {
                    promises.push(self.downloadRemoteAddon(addon, siteId).then(function() {
                        downloaded[addon.addon]= addon;
                    }));
                });
                return $mmUtil.allPromises(promises).then(function() {
                    return downloaded;
                }).catch(function() {
                    return downloaded;
                });
            });
        });
    };
        self.get = function(name) {
        if (self.isAvailable(name)) {
            return instances[name];
        }
    };
        self.getRemoteAddonDirectoryPath = function(addon, siteId) {
        siteId = siteId || $mmSite.getId();
        var subPath = remoteAddonsFolderName + '/' + self.getRemoteAddonName(addon);
        return $mmFS.concatenatePaths($mmFilepool.getFilepoolFolderPath(siteId), subPath);
    };
        self.getRemoteAddonName = function(addon) {
        return addon.component + '_' + addon.addon;
    };
        self.hasRemoteAddonsLoaded = function() {
        return loadedAddons.length;
    };
        self.isAvailable = function(name) {
        if (!name) {
            return false;
        }
        if (instances[name]) {
            return true;
        }
        try {
            instances[name] = $injector.get(name);
            return true;
        } catch(ex) {
            $log.warn('Service not available: '+name);
            return false;
        }
    };
        self.loadRemoteAddon = function(addon) {
        var dirPath = self.getRemoteAddonDirectoryPath(addon),
            absoluteDirPath;
        return $mmFS.getDir(dirPath).then(function(dir) {
            absoluteDirPath = $mmFS.getInternalURL(dir);
            return $mmFS.getDir($mmFS.concatenatePaths(dirPath, 'lang')).then(function() {
                return $mmLang.registerLanguageFolder($mmFS.concatenatePaths(absoluteDirPath, 'lang'));
            }).catch(function() {
            }).then(function() {
                return $ocLazyLoad.load($mmFS.concatenatePaths(absoluteDirPath, remoteAddonFilename));
            }).then(function() {
                loadedAddons.push(addon);
                return $mmFS.getFile($mmFS.concatenatePaths(dirPath, remoteAddonCssFilename)).then(function(file) {
                    headEl.append('<link class="remoteaddonstyles" rel="stylesheet" href="' + $mmFS.getInternalURL(file) + '">');
                }).catch(function() {});
            });
        }, function() {
            return self.setRemoteAddonStatus(addon, mmCoreNotDownloaded).then(function() {
                return $q.reject();
            });
        });
    };
        self.loadRemoteAddons = function(addons) {
        var promises = [];
        loadedModules = $ocLazyLoad.getModules();
        angular.forEach(addons, function(addon) {
            self.setRemoteAddonLoadPromise(addons, addon);
            if (addon.loadPromise) {
                promises.push(addon.loadPromise);
            }
        });
        return $mmUtil.allPromises(promises);
    };
        self.setRemoteAddonLoadPromise = function(addons, addon, dependants) {
        if (typeof addon.loadPromise != 'undefined') {
            return;
        }
        dependants = dependants || [];
        var promises = [],
            stop = false;
        angular.forEach(addon.dependencies, function(dependency) {
            if (stop) {
                return;
            }
            if (dependency == addon.addon) {
                return;
            }
            if (dependants.indexOf(dependency) != -1) {
                stop = true;
                return;
            }
            if (!addons[dependency]) {
                if (dependency.indexOf('mm.addons.') == -1) {
                    dependency = 'mm.addons.' + dependency;
                }
                if (loadedModules.indexOf(dependency) == -1) {
                    stop = true;
                }
            } else {
                self.setRemoteAddonLoadPromise(addons, addons[dependency], dependants.concat(addon.addon));
                if (!addons[dependency].loadPromise) {
                    stop = true;
                } else {
                    promises.push(addons[dependency].loadPromise);
                }
            }
        });
        if (!stop) {
            addon.loadPromise = $q.all(promises).then(function() {
                return self.loadRemoteAddon(addon);
            });
        } else {
            addon.loadPromise = false;
        }
    };
        self.setRemoteAddonStatus = function(addon, status, siteId) {
        siteId = siteId || $mmSite.getId();
        var name = self.getRemoteAddonName(addon),
            revision = addon.filehash;
        return $mmFilepool.storePackageStatus(siteId, mmAddonManagerComponent, name, status, revision, 0);
    };
    return self;
}])
.run(["$mmAddonManager", "$mmEvents", "mmCoreEventLogin", "mmCoreEventLogout", "mmCoreEventRemoteAddonsLoaded", "$mmSite", "$window", function($mmAddonManager, $mmEvents, mmCoreEventLogin, mmCoreEventLogout, mmCoreEventRemoteAddonsLoaded, $mmSite, $window) {
    $mmEvents.on(mmCoreEventLogin, function() {
        var siteId = $mmSite.getId();
        $mmAddonManager.downloadRemoteAddons(siteId).then(function(addons) {
            return $mmAddonManager.loadRemoteAddons(addons).finally(function() {
                if ($mmSite.getId() == siteId && $mmAddonManager.hasRemoteAddonsLoaded()) {
                    $mmEvents.trigger(mmCoreEventRemoteAddonsLoaded);
                }
            });
        });
    });
    $mmEvents.on(mmCoreEventLogout, function() {
        if ($mmAddonManager.hasRemoteAddonsLoaded()) {
            $window.location.reload();
        }
    });
}]);

angular.module('ngIOS9UIWebViewPatch', ['ng']).config(["$provide", function($provide) {
  $provide.decorator('$browser', ['$delegate', '$window', function($delegate, $window) {
    if (isIOS9UIWebView($window.navigator.userAgent)) {
      return applyIOS9Shim($delegate);
    }
    return $delegate;
    function isIOS9UIWebView(userAgent) {
      return /(iPhone|iPad|iPod).* OS 9_\d/.test(userAgent) && !/Version\/9\./.test(userAgent);
    }
    function applyIOS9Shim(browser) {
      var pendingLocationUrl = null;
      var originalUrlFn= browser.url;
      browser.url = function() {
        if (arguments.length) {
          pendingLocationUrl = arguments[0];
          return originalUrlFn.apply(browser, arguments);
        }
        return pendingLocationUrl || originalUrlFn.apply(browser, arguments);
      };
      window.addEventListener('popstate', clearPendingLocationUrl, false);
      window.addEventListener('hashchange', clearPendingLocationUrl, false);
      function clearPendingLocationUrl() {
        pendingLocationUrl = null;
      }
      return browser;
    }
  }]);
}]);
angular.module('mm.core')
.provider('$mmApp', ["$stateProvider", function($stateProvider) {
        var DBNAME = 'MoodleMobile',
        dbschema = {
            stores: []
        },
        dboptions = {
            autoSchema: true
        };
        this.registerStore = function(store) {
        if (typeof(store.name) === 'undefined') {
            console.log('$mmApp: Error: store name is undefined.');
            return;
        } else if (storeExists(store.name)) {
            console.log('$mmApp: Error: store ' + store.name + ' is already defined.');
            return;
        }
        dbschema.stores.push(store);
    };
        this.registerStores = function(stores) {
        var self = this;
        angular.forEach(stores, function(store) {
            self.registerStore(store);
        });
    };
        function storeExists(name) {
        var exists = false;
        angular.forEach(dbschema.stores, function(store) {
            if (store.name === name) {
                exists = true;
            }
        });
        return exists;
    }
    this.$get = ["$mmDB", "$cordovaNetwork", "$log", "$injector", "$ionicPlatform", "$timeout", "$q", function($mmDB, $cordovaNetwork, $log, $injector, $ionicPlatform, $timeout, $q) {
        $log = $log.getInstance('$mmApp');
        var db,
            self = {},
            ssoAuthenticationDeferred;
                self.createState = function(name, config) {
            $log.debug('Adding new state: '+name);
            $stateProvider.state(name, config);
        };
                self.closeKeyboard = function() {
            if (typeof cordova != 'undefined' && cordova.plugins && cordova.plugins.Keyboard && cordova.plugins.Keyboard.close) {
                cordova.plugins.Keyboard.close();
                return true;
            }
            return false;
        };
                self.getDB = function() {
            if (typeof db == 'undefined') {
                db = $mmDB.getDB(DBNAME, dbschema, dboptions);
            }
            return db;
        };
                self.getSchema = function() {
            return dbschema;
        };
                self.initProcess = function() {
            return $ionicPlatform.ready();
        };
                self.isDevice = function() {
            return !!window.device;
        };
                self.isOnline = function() {
            var online = typeof navigator.connection === 'undefined' || $cordovaNetwork.isOnline();
            if (!online && navigator.onLine) {
                online = true;
            }
            return online;
        };
                self.isNetworkAccessLimited = function() {
            if (typeof navigator.connection === 'undefined') {
                return false;
            }
            var type = $cordovaNetwork.getNetwork();
            var limited = [Connection.CELL_2G, Connection.CELL_3G, Connection.CELL_4G, Connection.CELL];
            return limited.indexOf(type) > -1;
        };
                self.isReady = function() {
            var promise = $injector.get('$mmInitDelegate').ready();
            return promise.$$state.status === 1;
        };
                self.openKeyboard = function() {
            if (typeof cordova != 'undefined' && cordova.plugins && cordova.plugins.Keyboard && cordova.plugins.Keyboard.show) {
                cordova.plugins.Keyboard.show();
                return true;
            }
            return false;
        };
                self.ready = function() {
            return $injector.get('$mmInitDelegate').ready();
        };
                self.startSSOAuthentication = function() {
            var cancelPromise;
            ssoAuthenticationDeferred = $q.defer();
            cancelPromise = $timeout(function() {
                self.finishSSOAuthentication();
            }, 10000);
            ssoAuthenticationDeferred.promise.finally(function() {
                $timeout.cancel(cancelPromise);
            });
        };
                self.finishSSOAuthentication = function() {
            ssoAuthenticationDeferred && ssoAuthenticationDeferred.resolve();
            ssoAuthenticationDeferred = undefined;
        };
                self.isSSOAuthenticationOngoing = function() {
            return !!ssoAuthenticationDeferred;
        };
                self.waitForSSOAuthentication = function() {
            if (ssoAuthenticationDeferred) {
                return ssoAuthenticationDeferred.promise;
            }
            return $q.when();
        };
        return self;
    }];
}]);

angular.module('mm.core')
.constant('mmCoreConfigStore', 'config')
.config(["$mmAppProvider", "mmCoreConfigStore", function($mmAppProvider, mmCoreConfigStore) {
    var stores = [
        {
            name: mmCoreConfigStore,
            keyPath: 'name'
        }
    ];
    $mmAppProvider.registerStores(stores);
}])
.factory('$mmConfig', ["$q", "$log", "$mmApp", "mmCoreConfigStore", function($q, $log, $mmApp, mmCoreConfigStore) {
    $log = $log.getInstance('$mmConfig');
    var self = {};
        self.get = function(name, defaultValue) {
        return $mmApp.getDB().get(mmCoreConfigStore, name).then(function(entry) {
            return entry.value;
        }).catch(function() {
            if (typeof defaultValue != 'undefined') {
                return defaultValue;
            } else {
                return $q.reject();
            }
        });
    };
        self.set = function(name, value) {
        return $mmApp.getDB().insert(mmCoreConfigStore, {name: name, value: value});
    };
        self.delete = function(name) {
        return $mmApp.getDB().remove(mmCoreConfigStore, name);
    };
    return self;
}]);

angular.module('mm.core')
.factory('$mmDB', ["$q", "$log", function($q, $log) {
    $log = $log.getInstance('$mmDB');
    var self = {},
        dbInstances = {};
        function applyOrder(query, order, reverse) {
        if (order) {
            query = query.order(order);
            if (reverse) {
                query = query.reverse();
            }
        }
        return query;
    }
        function applyWhere(query, where) {
        if (where && where.length > 0) {
            query = query.where.apply(query, where);
        }
        return query;
    }
        function callDBFunction(db, func) {
        var deferred = $q.defer();
        try {
            if (typeof(db) != 'undefined') {
                db[func].apply(db, Array.prototype.slice.call(arguments, 2)).then(function(result) {
                    if (typeof(result) == 'undefined') {
                        deferred.reject();
                    } else {
                        deferred.resolve(result);
                    }
                });
            } else {
                deferred.reject();
            }
        } catch(ex) {
            $log.error('Error executing function '+func+' to DB '+db.getName());
            $log.error(ex.name+': '+ex.message);
            deferred.reject();
        }
        return deferred.promise;
    }
        function callCount(db, store, where) {
        var deferred = $q.defer(),
            query;
        try {
            if (typeof(db) != 'undefined') {
                query = db.from(store);
                query = applyWhere(query, where);
                query.count().then(function(count) {
                    deferred.resolve(count);
                }, function() {
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }
        } catch(ex) {
            $log.error('Error querying db '+db.getName()+'. '+ex.name+': '+ex.message);
            deferred.reject();
        }
        return deferred.promise;
    }
        function callWhere(db, store, field_name, op, value, op2, value2) {
        var deferred = $q.defer();
        try {
            if (typeof(db) != 'undefined') {
                db.from(store).where(field_name, op, value, op2, value2).list().then(function(list) {
                    deferred.resolve(list);
                }, function() {
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }
        } catch(ex) {
            $log.error('Error querying db '+db.getName()+'. '+ex.name+': '+ex.message);
            deferred.reject();
        }
        return deferred.promise;
    }
        function callWhereEqual(db, store, field_name, value) {
        var deferred = $q.defer();
        try {
            if (typeof(db) != 'undefined') {
                db.from(store).where(field_name, '=', value).list().then(function(list) {
                    deferred.resolve(list);
                }, function() {
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }
        } catch(ex) {
            $log.error('Error getting where equal from db '+db.getName()+'. '+ex.name+': '+ex.message);
            deferred.reject();
        }
        return deferred.promise;
    }
        function callEach(db, store, callback) {
        var deferred = $q.defer();
        callDBFunction(db, 'values', store, undefined, 99999999).then(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                callback(entries[i]);
            }
            deferred.resolve();
        }, function() {
            deferred.reject();
        });
        return deferred.promise;
    }
        function doQuery(db, store, where, order, reverse, limit) {
        var deferred = $q.defer(),
            query;
        try {
            if (typeof(db) != 'undefined') {
                query = db.from(store);
                query = applyWhere(query, where);
                query = applyOrder(query, order, reverse);
                query.list(limit).then(function(list) {
                    deferred.resolve(list);
                }, function() {
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }
        } catch(ex) {
            $log.error('Error querying ' + store + ' on ' + db.getName() + '. ' + ex.name + ': ' + ex.message);
            deferred.reject();
        }
        return deferred.promise;
    }
        function doUpdate(db, store, values, where) {
        var deferred = $q.defer(),
            query;
        try {
            if (typeof(db) != 'undefined') {
                query = db.from(store);
                query = applyWhere(query, where);
                query.patch(values).then(function(count) {
                    deferred.resolve(count);
                }, function() {
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }
        } catch(ex) {
            $log.error('Error querying ' + store + ' on ' + db.getName() + '. ' + ex.name + ': ' + ex.message);
            deferred.reject();
        }
        return deferred.promise;
    }
        self.getDB = function(name, schema, options) {
        if (typeof dbInstances[name] === 'undefined') {
            var isSafari = !ionic.Platform.isIOS() && !ionic.Platform.isAndroid() && navigator.userAgent.indexOf('Safari') != -1
                            && navigator.userAgent.indexOf('Chrome') == -1 && navigator.userAgent.indexOf('Firefox') == -1;
            if (typeof IDBObjectStore == 'undefined' || typeof IDBObjectStore.prototype.count == 'undefined' || isSafari) {
                if (typeof options.mechanisms == 'undefined') {
                    options.mechanisms = ['websql', 'sqlite', 'localstorage', 'sessionstorage', 'userdata', 'memory'];
                } else {
                    var position = options.mechanisms.indexOf('indexeddb');
                    if (position != -1) {
                        options.mechanisms.splice(position, 1);
                    }
                }
            }
            var db = new ydn.db.Storage(name, schema, options);
            dbInstances[name] = {
                                getName: function() {
                    return db.getName();
                },
                                get: function(store, id) {
                    return callDBFunction(db, 'get', store, id);
                },
                                getAll: function(store) {
                    return callDBFunction(db, 'values', store, undefined, 99999999);
                },
                                count: function(store, where) {
                    return callCount(db, store, where);
                },
                                insert: function(store, value, id) {
                    return callDBFunction(db, 'put', store, value, id);
                },
                                insertSync: function(store, value) {
                    if (db) {
                        try {
                            db.put(store, value);
                            return true;
                        } catch(ex) {
                            $log.error('Error executing function sync put to DB '+db.getName());
                            $log.error(ex.name+': '+ex.message);
                        }
                    }
                    return false;
                },
                                query: function(store, where, order, reverse, limit) {
                    return doQuery(db, store, where, order, reverse, limit);
                },
                                remove: function(store, id) {
                    return callDBFunction(db, 'remove', store, id);
                },
                                removeAll: function(store) {
                    return callDBFunction(db, 'clear', store);
                },
                                update: function(store, values, where) {
                    return doUpdate(db, store, values, where);
                },
                                where: function(store, field_name, op, value, op2, value2) {
                    return callWhere(db, store, field_name, op, value, op2, value2);
                },
                                whereEqual: function(store, field_name, value) {
                    return callWhereEqual(db, store, field_name, value);
                },
                                each: function(store, callback) {
                    return callEach(db, store, callback);
                },
                                close: function() {
                    db.close();
                    db = undefined;
                },
                                onReady: function(cb) {
                    db.onReady(cb);
                },
                                getType: function() {
                    return db.getType();
                }
            };
        }
        return dbInstances[name];
    };
        self.deleteDB = function(name) {
        var deferred = $q.defer();
        function deleteDB() {
            delete dbInstances[name];
            $q.when(ydn.db.deleteDatabase(name)).then(deferred.resolve, deferred.reject);
        }
        if (typeof dbInstances[name] != 'undefined') {
            dbInstances[name].onReady(deleteDB);
        } else {
            deleteDB();
        }
        return deferred.promise;
    };
    return self;
}]);

angular.module('mm.core')
.factory('$mmEmulatorManager', ["$log", "$q", "$http", "$mmFS", "$window", function($log, $q, $http, $mmFS, $window) {
    $log = $log.getInstance('$mmEmulatorManager');
    var self = {};
        self.loadHTMLAPI = function() {
        if ($mmFS.isAvailable()) {
            $log.debug('Stop loading HTML API, it was already loaded or the environment doesn\'t need it.');
            return $q.when();
        }
        var deferred = $q.defer(),
            basePath;
        $log.debug('Loading HTML API.');
        $window.requestFileSystem  = $window.requestFileSystem || $window.webkitRequestFileSystem;
        $window.resolveLocalFileSystemURL = $window.resolveLocalFileSystemURL || $window.webkitResolveLocalFileSystemURL;
        $window.LocalFileSystem = {
            PERSISTENT: 1
        };
        $window.FileTransfer = function() {};
        $window.FileTransfer.prototype.download = function(url, filePath, successCallback, errorCallback) {
            $http.get(url, {responseType: 'blob'}).then(function(data) {
                if (!data || !data.data) {
                    errorCallback();
                } else {
                    filePath = filePath.replace(basePath, '');
                    filePath = filePath.replace(/%20/g, ' ');
                    $mmFS.writeFile(filePath, data.data).then(function(e) {
                        successCallback(e);
                    }).catch(function(error) {
                        errorCallback(error);
                    });
                }
            }).catch(function(error) {
                errorCallback(error);
            });
        };
        $window.zip = {
            unzip: function(source, destination, callback, progressCallback) {
                source = source.replace(basePath, '');
                source = source.replace(/%20/g, ' ');
                destination = destination.replace(basePath, '');
                destination = destination.replace(/%20/g, ' ');
                $mmFS.readFile(source, $mmFS.FORMATARRAYBUFFER).then(function(data) {
                    var zip = new JSZip(data),
                        promises = [];
                    angular.forEach(zip.files, function(file, name) {
                        var filepath = $mmFS.concatenatePaths(destination, name),
                            type;
                        if (!file.dir) {
                            type = $mmFS.getMimeType($mmFS.getFileExtension(name));
                            promises.push($mmFS.writeFile(filepath, new Blob([file.asArrayBuffer()], {type: type})));
                        } else {
                            promises.push($mmFS.createDir(filepath));
                        }
                    });
                    return $q.all(promises).then(function() {
                        callback(0);
                    });
                }).catch(function() {
                    callback(-1);
                });
            }
        };
        $window.webkitStorageInfo.requestQuota(PERSISTENT, 500 * 1024 * 1024, function(granted) {
            $window.requestFileSystem(PERSISTENT, granted, function(entry) {
                basePath = entry.root.toURL();
                $mmFS.setHTMLBasePath(basePath);
                deferred.resolve();
            }, deferred.reject);
        }, deferred.reject);
        return deferred.promise;
    };
    return self;
}])
.config(["$mmInitDelegateProvider", "mmInitDelegateMaxAddonPriority", function($mmInitDelegateProvider, mmInitDelegateMaxAddonPriority) {
    if (!ionic.Platform.isWebView()) {
        $mmInitDelegateProvider.registerProcess('mmEmulator', '$mmEmulatorManager.loadHTMLAPI',
                mmInitDelegateMaxAddonPriority + 500, true);
    }
}]);

angular.module('mm.core')
.constant('mmCoreEventKeyboardShow', 'keyboard_show')
.constant('mmCoreEventKeyboardHide', 'keyboard_hide')
.constant('mmCoreEventSessionExpired', 'session_expired')
.constant('mmCoreEventLogin', 'login')
.constant('mmCoreEventLogout', 'logout')
.constant('mmCoreEventLanguageChanged', 'language_changed')
.constant('mmCoreEventSiteAdded', 'site_added')
.constant('mmCoreEventSiteUpdated', 'site_updated')
.constant('mmCoreEventSiteDeleted', 'site_deleted')
.constant('mmCoreEventQueueEmpty', 'filepool_queue_empty')
.constant('mmCoreEventCompletionModuleViewed', 'completion_module_viewed')
.constant('mmCoreEventUserDeleted', 'user_deleted')
.constant('mmCoreEventPackageStatusChanged', 'filepool_package_status_changed')
.constant('mmCoreEventSectionStatusChanged', 'section_status_changed')
.constant('mmCoreEventRemoteAddonsLoaded', 'remote_addons_loaded')
.factory('$mmEvents', ["$log", "md5", function($log, md5) {
    $log = $log.getInstance('$mmEvents');
    var self = {},
        observers = {},
        uniqueEvents = {},
        uniqueEventsData = {};
        self.on = function(eventName, callBack) {
        if (uniqueEvents[eventName]) {
            callBack(uniqueEventsData[eventName]);
            return {
                id: -1,
                off: function() {}
            };
        }
        var observerID;
        if (typeof(observers[eventName]) === 'undefined') {
            observers[eventName] = {};
        }
        while (typeof(observerID) === 'undefined') {
            var candidateID = md5.createHash(Math.random().toString());
            if (typeof(observers[eventName][candidateID]) === 'undefined') {
                observerID = candidateID;
            }
        }
        $log.debug('Observer ' + observerID + ' listening to event '+eventName);
        observers[eventName][observerID] = callBack;
        var observer = {
            id: observerID,
            off: function() {
                $log.debug('Disable observer ' + observerID + ' for event '+eventName);
                delete observers[eventName][observerID];
            }
        };
        return observer;
    };
        self.trigger = function(eventName, data) {
        $log.debug('Event ' + eventName + ' triggered.');
        var affected = observers[eventName];
        for (var observerName in affected) {
            if (typeof(affected[observerName]) === 'function') {
                affected[observerName](data);
            }
        }
    };
        self.triggerUnique = function(eventName, data) {
        if (uniqueEvents[eventName]) {
            $log.debug('Unique event ' + eventName + ' ignored because it was already triggered.');
        } else {
            $log.debug('Unique event ' + eventName + ' triggered.');
            uniqueEvents[eventName] = true;
            uniqueEventsData[eventName] = data;
            var affected = observers[eventName];
            angular.forEach(affected, function(callBack) {
                if (typeof callBack === 'function') {
                    callBack(data);
                }
            });
        }
    };
    return self;
}]);

angular.module('mm.core')
.constant('mmFilepoolQueueProcessInterval', 0)
.constant('mmFilepoolFolder', 'filepool')
.constant('mmFilepoolStore', 'filepool')
.constant('mmFilepoolQueueStore', 'files_queue')
.constant('mmFilepoolLinksStore', 'files_links')
.constant('mmFilepoolPackagesStore', 'filepool_packages')
.constant('mmFilepoolWifiDownloadThreshold', 20971520)
.constant('mmFilepoolDownloadThreshold', 2097152)
.config(["$mmAppProvider", "$mmSitesFactoryProvider", "mmFilepoolStore", "mmFilepoolLinksStore", "mmFilepoolQueueStore", "mmFilepoolPackagesStore", function($mmAppProvider, $mmSitesFactoryProvider, mmFilepoolStore, mmFilepoolLinksStore, mmFilepoolQueueStore,
            mmFilepoolPackagesStore) {
    var siteStores = [
        {
            name: mmFilepoolStore,
            keyPath: 'fileId',
            indexes: []
        },
        {
            name: mmFilepoolLinksStore,
            keyPath: ['fileId', 'component', 'componentId'],
            indexes: [
                {
                    name: 'fileId',
                },
                {
                    name: 'component',
                },
                {
                    name: 'componentAndId',
                    generator: function(obj) {
                        return [obj.component, obj.componentId];
                    }
                }
            ]
        },
        {
            name: mmFilepoolPackagesStore,
            keyPath: 'id',
            indexes: [
                {
                    name: 'component',
                },
                {
                    name: 'componentId',
                },
                {
                    name: 'status',
                }
            ]
        }
    ];
    var appStores = [
        {
            name: mmFilepoolQueueStore,
            keyPath: ['siteId', 'fileId'],
            indexes: [
                {
                    name: 'siteId',
                },
                {
                    name: 'sortorder',
                    generator: function(obj) {
                        var sortorder = parseInt(obj.added, 10),
                            priority = 999 - Math.max(0, Math.min(parseInt(obj.priority || 0, 10), 999)),
                            padding = "000";
                        sortorder = "" + sortorder;
                        priority = "" + priority;
                        priority = padding.substring(0, padding.length - priority.length) + priority;
                        sortorder = priority + '-' + sortorder;
                        return sortorder;
                    }
                }
            ]
        }
    ];
    $mmAppProvider.registerStores(appStores);
    $mmSitesFactoryProvider.registerStores(siteStores);
}])
.factory('$mmFilepool', ["$q", "$log", "$timeout", "$mmApp", "$mmFS", "$mmWS", "$mmSitesManager", "$mmEvents", "md5", "mmFilepoolStore", "mmFilepoolLinksStore", "mmFilepoolQueueStore", "mmFilepoolFolder", "mmFilepoolQueueProcessInterval", "mmCoreEventQueueEmpty", "mmCoreDownloaded", "mmCoreDownloading", "mmCoreNotDownloaded", "mmCoreOutdated", "mmCoreNotDownloadable", "mmFilepoolPackagesStore", "mmCoreEventPackageStatusChanged", "$mmText", "$mmUtil", "mmFilepoolWifiDownloadThreshold", "mmFilepoolDownloadThreshold", function($q, $log, $timeout, $mmApp, $mmFS, $mmWS, $mmSitesManager, $mmEvents, md5, mmFilepoolStore,
        mmFilepoolLinksStore, mmFilepoolQueueStore, mmFilepoolFolder, mmFilepoolQueueProcessInterval, mmCoreEventQueueEmpty,
        mmCoreDownloaded, mmCoreDownloading, mmCoreNotDownloaded, mmCoreOutdated, mmCoreNotDownloadable, mmFilepoolPackagesStore,
        mmCoreEventPackageStatusChanged, $mmText, $mmUtil, mmFilepoolWifiDownloadThreshold, mmFilepoolDownloadThreshold) {
    $log = $log.getInstance('$mmFilepool');
    var self = {},
        tokenRegex = new RegExp('(\\?|&)token=([A-Za-z0-9]+)'),
        queueState,
        urlAttributes = [
            tokenRegex,
            new RegExp('(\\?|&)forcedownload=[0-1]')
        ],
        revisionRegex = new RegExp('/content/([0-9]+)/'),
        queueDeferreds = {},
        packagesPromises = {},
        filePromises = {},
        sizeCache = {};
    var QUEUE_RUNNING = 'mmFilepool:QUEUE_RUNNING',
        QUEUE_PAUSED = 'mmFilepool:QUEUE_PAUSED';
    var ERR_QUEUE_IS_EMPTY = 'mmFilepoolError:ERR_QUEUE_IS_EMPTY',
        ERR_FS_OR_NETWORK_UNAVAILABLE = 'mmFilepoolError:ERR_FS_OR_NETWORK_UNAVAILABLE',
        ERR_QUEUE_ON_PAUSE = 'mmFilepoolError:ERR_QUEUE_ON_PAUSE';
        self.FILEDOWNLOADED = 'downloaded';
    self.FILEDOWNLOADING = 'downloading';
    self.FILENOTDOWNLOADED = 'notdownloaded';
    self.FILEOUTDATED = 'outdated';
        function getSiteDb(siteId) {
        return $mmSitesManager.getSiteDb(siteId);
    }
        self._addFileLink = function(siteId, fileId, component, componentId) {
        if (!component) {
            return $q.reject();
        }
        componentId = self._fixComponentId(componentId);
        return getSiteDb(siteId).then(function(db) {
            return db.insert(mmFilepoolLinksStore, {
                fileId: fileId,
                component: component,
                componentId: componentId
            });
        });
    };
        self.addFileLinkByUrl = function(siteId, fileUrl, component, componentId) {
        return self._fixPluginfileURL(siteId, fileUrl).then(function(fileUrl) {
            var fileId = self._getFileIdByUrl(fileUrl);
            return self._addFileLink(siteId, fileId, component, componentId);
        });
    };
        self._addFileLinks = function(siteId, fileId, links) {
        var promises = [];
        angular.forEach(links, function(link) {
            promises.push(self._addFileLink(siteId, fileId, link.component, link.componentId));
        });
        return $q.all(promises);
    };
        self._addFileToPool = function(siteId, fileId, data) {
        var values = angular.copy(data) || {};
        values.fileId = fileId;
        return getSiteDb(siteId).then(function(db) {
            return db.insert(mmFilepoolStore, values);
        });
    };
        self.addToQueueByUrl = function(siteId, fileUrl, component, componentId, timemodified, filePath, priority) {
        var db = $mmApp.getDB(),
            fileId,
            now = new Date(),
            link,
            revision,
            queueDeferred;
        if (!$mmFS.isAvailable()) {
            return $q.reject();
        }
        return $mmSitesManager.getSite(siteId).then(function(site) {
            if (!site.canDownloadFiles()) {
                return $q.reject();
            }
            return self._fixPluginfileURL(siteId, fileUrl).then(function(fileUrl) {
                timemodified = timemodified || 0;
                revision = self.getRevisionFromUrl(fileUrl);
                fileId = self._getFileIdByUrl(fileUrl);
                priority = priority || 0;
                if (typeof component !== 'undefined') {
                    link = {
                        component: component,
                        componentId: self._fixComponentId(componentId)
                    };
                }
                queueDeferred = self._getQueueDeferred(siteId, fileId, false);
                return db.get(mmFilepoolQueueStore, [siteId, fileId]).then(function(fileObject) {
                    var foundLink = false,
                        update = false;
                    if (fileObject) {
                        if (fileObject.priority < priority) {
                            update = true;
                            fileObject.priority = priority;
                        }
                        if (revision && fileObject.revision !== revision) {
                            update = true;
                            fileObject.revision = revision;
                        }
                        if (timemodified && fileObject.timemodified !== timemodified) {
                            update = true;
                            fileObject.timemodified = timemodified;
                        }
                        if (filePath && fileObject.path !== filePath) {
                            update = true;
                            fileObject.path = filePath;
                        }
                        if (link) {
                            angular.forEach(fileObject.links, function(fileLink) {
                                if (fileLink.component == link.component && fileLink.componentId == link.componentId) {
                                    foundLink = true;
                                }
                            });
                            if (!foundLink) {
                                update = true;
                                fileObject.links.push(link);
                            }
                        }
                        if (update) {
                            $log.debug('Updating file ' + fileId + ' which is already in queue');
                            return db.insert(mmFilepoolQueueStore, fileObject).then(function() {
                                return self._getQueuePromise(siteId, fileId);
                            });
                        }
                        $log.debug('File ' + fileId + ' already in queue and does not require update');
                        if (queueDeferred) {
                            return queueDeferred.promise;
                        } else {
                            return self._getQueuePromise(siteId, fileId);
                        }
                    } else {
                        return addToQueue();
                    }
                }, function() {
                    return addToQueue();
                });
                function addToQueue() {
                    $log.debug('Adding ' + fileId + ' to the queue');
                    return db.insert(mmFilepoolQueueStore, {
                        siteId: siteId,
                        fileId: fileId,
                        added: now.getTime(),
                        priority: priority,
                        url: fileUrl,
                        revision: revision,
                        timemodified: timemodified,
                        path: filePath,
                        links: link ? [link] : []
                    }).then(function() {
                        self.checkQueueProcessing();
                        return self._getQueuePromise(siteId, fileId);
                    });
                }
            });
        });
    };
        self.checkQueueProcessing = function() {
        if (!$mmFS.isAvailable() || !$mmApp.isOnline()) {
            queueState = QUEUE_PAUSED;
            return;
        } else if (queueState === QUEUE_RUNNING) {
            return;
        }
        queueState = QUEUE_RUNNING;
        self._processQueue();
    };
        self.clearAllPackagesStatus = function(siteId) {
        var promises = [];
        $log.debug('Clear all packages status for site ' + siteId);
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var db = site.getDb();
            return db.getAll(mmFilepoolPackagesStore).then(function(entries) {
                angular.forEach(entries, function(entry) {
                    promises.push(db.remove(mmFilepoolPackagesStore, entry.id).then(function() {
                        self._triggerPackageStatusChanged(siteId, entry.component, entry.componentId, mmCoreNotDownloaded);
                    }));
                });
                return $q.all(promises);
            });
        });
    };
        self.clearFilepool = function(siteId) {
        return getSiteDb(siteId).then(function(db) {
            return db.removeAll(mmFilepoolStore);
        });
    };
        self.componentHasFiles = function(siteId, component, componentId) {
        return getSiteDb(siteId).then(function(db) {
            var where;
            if (typeof componentId !== 'undefined') {
                where = ['componentAndId', '=', [component, self._fixComponentId(componentId)]];
            } else {
                where = ['component', '=', component];
            }
            return db.count(mmFilepoolLinksStore, where).then(function(count) {
                if (count > 0) {
                    return true;
                }
                return $q.reject();
            });
        });
    };
        self.determinePackagesStatus = function(current, packagestatus) {
        if (!current) {
            current = mmCoreNotDownloadable;
        }
        if (packagestatus === mmCoreNotDownloaded) {
            return mmCoreNotDownloaded;
        } else if (packagestatus === mmCoreDownloaded && current === mmCoreNotDownloadable) {
            return mmCoreDownloaded;
        } else if (packagestatus === mmCoreDownloading && (current === mmCoreNotDownloadable || current === mmCoreDownloaded)) {
            return mmCoreDownloading;
        } else if (packagestatus === mmCoreOutdated && current !== mmCoreNotDownloaded) {
            return mmCoreOutdated;
        }
        return current;
    };
        self._downloadOrPrefetchPackage = function(siteId, fileList, prefetch, component, componentId, revision, timemod, dirPath) {
        var packageId = self.getPackageId(component, componentId);
        if (packagesPromises[siteId] && packagesPromises[siteId][packageId]) {
            return packagesPromises[siteId][packageId];
        } else if (!packagesPromises[siteId]) {
            packagesPromises[siteId] = {};
        }
        revision = revision || self.getRevisionFromFileList(fileList);
        timemod = timemod || self.getTimemodifiedFromFileList(fileList);
        var dwnPromise,
            deleted = false;
        dwnPromise = self.storePackageStatus(siteId, component, componentId, mmCoreDownloading).then(function() {
            var promises = [],
                deferred = $q.defer(),
                packageLoaded = 0;
            angular.forEach(fileList, function(file) {
                var path,
                    promise,
                    fileLoaded = 0;
                if (dirPath) {
                    path = file.filename;
                    if (file.filepath !== '/') {
                        path = file.filepath.substr(1) + path;
                    }
                    path = $mmFS.concatenatePaths(dirPath, path);
                }
                if (prefetch) {
                    promise = self.addToQueueByUrl(siteId, file.fileurl, component, componentId, file.timemodified, path);
                } else {
                    promise = self.downloadUrl(siteId, file.fileurl, false, component, componentId, file.timemodified, path);
                }
                promises.push(promise.then(undefined, undefined, function(progress) {
                    if (progress && progress.loaded) {
                        packageLoaded = packageLoaded + (progress.loaded - fileLoaded);
                        fileLoaded = progress.loaded;
                        deferred.notify({
                            packageDownload: true,
                            loaded: packageLoaded,
                            fileProgress: progress
                        });
                    }
                }));
            });
            $q.all(promises).then(function() {
                return self.storePackageStatus(siteId, component, componentId, mmCoreDownloaded, revision, timemod);
            }).catch(function() {
                return self.setPackagePreviousStatus(siteId, component, componentId).then(function() {
                    return $q.reject();
                });
            }).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }).finally(function() {
            delete packagesPromises[siteId][packageId];
            deleted = true;
        });
        if (!deleted) {
            packagesPromises[siteId][packageId] = dwnPromise;
        }
        return dwnPromise;
    };
        self.downloadPackage = function(siteId, fileList, component, componentId, revision, timemodified, dirPath) {
        return self._downloadOrPrefetchPackage(siteId, fileList, false, component, componentId, revision, timemodified, dirPath);
    };
        self.downloadUrl = function(siteId, fileUrl, ignoreStale, component, componentId, timemodified, filePath) {
        var fileId,
            revision,
            promise;
        if ($mmFS.isAvailable()) {
            return self._fixPluginfileURL(siteId, fileUrl).then(function(fixedUrl) {
                fileUrl = fixedUrl;
                timemodified = timemodified || 0;
                revision = self.getRevisionFromUrl(fileUrl);
                fileId = self._getFileIdByUrl(fileUrl);
                return self._restoreOldFileIfNeeded(siteId, fileId, fileUrl, filePath);
            }).then(function() {
                return self._hasFileInPool(siteId, fileId).then(function(fileObject) {
                    if (typeof fileObject === 'undefined') {
                        return self._downloadForPoolByUrl(siteId, fileUrl, revision, timemodified, filePath);
                    } else if (self._isFileOutdated(fileObject, revision, timemodified) && $mmApp.isOnline() && !ignoreStale) {
                        return self._downloadForPoolByUrl(siteId, fileUrl, revision, timemodified, filePath, fileObject);
                    }
                    if (filePath) {
                        promise = self._getInternalUrlByPath(filePath);
                    } else {
                        promise = self._getInternalUrlById(siteId, fileId);
                    }
                    return promise.then(function(response) {
                        return response;
                    }, function() {
                        return self._downloadForPoolByUrl(siteId, fileUrl, revision, timemodified, filePath, fileObject);
                    });
                }, function() {
                    return self._downloadForPoolByUrl(siteId, fileUrl, revision, timemodified, filePath);
                })
                .then(function(response) {
                    if (typeof component !== 'undefined') {
                        self._addFileLink(siteId, fileId, component, componentId);
                    }
                    self._notifyFileDownloaded(siteId, fileId);
                    return response;
                }, function(err) {
                    self._notifyFileDownloadError(siteId, fileId);
                    return $q.reject(err);
                });
            });
        } else {
            return $q.reject();
        }
    };
        self._downloadForPoolByUrl = function(siteId, fileUrl, revision, timemodified, filePath, poolFileObject) {
        var fileId = self._getFileIdByUrl(fileUrl),
            addExtension = typeof filePath == "undefined",
            pathPromise = filePath ? $q.when(filePath) : self._getFilePath(siteId, fileId);
        return pathPromise.then(function(filePath) {
            if (poolFileObject && poolFileObject.fileId !== fileId) {
                $log.error('Invalid object to update passed');
                return $q.reject();
            }
            var downloadId = self.getFileDownloadId(fileUrl, filePath),
                deleted = false,
                promise;
            if (filePromises[siteId] && filePromises[siteId][downloadId]) {
                return filePromises[siteId][downloadId];
            } else if (!filePromises[siteId]) {
                filePromises[siteId] = {};
            }
            promise = $mmSitesManager.getSite(siteId).then(function(site) {
                if (!site.canDownloadFiles()) {
                    return $q.reject();
                }
                return $mmWS.downloadFile(fileUrl, filePath, addExtension).then(function(fileEntry) {
                    var now = new Date(),
                        data = poolFileObject || {};
                    data.downloaded = now.getTime();
                    data.stale = false;
                    data.url = fileUrl;
                    data.revision = revision;
                    data.timemodified = timemodified;
                    data.path = fileEntry.path;
                    data.extension = fileEntry.extension;
                    return self._addFileToPool(siteId, fileId, data).then(function() {
                        return fileEntry.toURL();
                    });
                });
            }).finally(function() {
                delete filePromises[siteId][downloadId];
                deleted = true;
            });
            if (!deleted) {
                filePromises[siteId][downloadId] = promise;
            }
            return promise;
        });
    };
        self._fixComponentId = function(componentId) {
        var id = parseInt(componentId, 10);
        if (isNaN(id)) {
            if (typeof componentId == 'undefined' || componentId === null) {
                return -1;
            } else {
                return componentId;
            }
        }
        return id;
    };
        self._fixPluginfileURL = function(siteId, fileUrl) {
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.fixPluginfileURL(fileUrl);
        });
    };
        self._getFileLinks = function(siteId, fileId) {
        return getSiteDb(siteId).then(function(db) {
            return db.query(mmFilepoolLinksStore, ['fileId', '=', fileId]);
        });
    };
        self.getFileDownloadId = function(fileUrl, filePath) {
        return md5.createHash(fileUrl + '###' + filePath);
    };
        self._getFileEventName = function(siteId, fileId) {
        return 'mmFilepoolFile:'+siteId+':'+fileId;
    };
        self.getFileEventNameByUrl = function(siteId, fileUrl) {
        return self._fixPluginfileURL(siteId, fileUrl).then(function(fileUrl) {
            var fileId = self._getFileIdByUrl(fileUrl);
            return self._getFileEventName(siteId, fileId);
        });
    };
        self.getPackageDownloadPromise = function(siteId, component, componentId) {
        var packageId = self.getPackageId(component, componentId);
        if (packagesPromises[siteId] && packagesPromises[siteId][packageId]) {
            return packagesPromises[siteId][packageId];
        }
    };
        self.getPackageId = function(component, componentId) {
        return md5.createHash(component + '#' + self._fixComponentId(componentId));
    };
        self.getPackagePreviousStatus = function(siteId, component, componentId) {
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var db = site.getDb(),
                packageId = self.getPackageId(component, componentId);
            return db.get(mmFilepoolPackagesStore, packageId).then(function(entry) {
                return entry.previous || mmCoreNotDownloaded;
            }, function() {
                return mmCoreNotDownloaded;
            });
        });
    };
        self.getPackageStatus = function(siteId, component, componentId, revision, timemodified) {
        revision = revision || 0;
        timemodified = timemodified || 0;
        componentId = self._fixComponentId(componentId);
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var db = site.getDb(),
                packageId = self.getPackageId(component, componentId);
            return db.get(mmFilepoolPackagesStore, packageId).then(function(entry) {
                if (entry.status === mmCoreDownloaded) {
                    if (revision != entry.revision || timemodified > entry.timemodified) {
                        entry.status = mmCoreOutdated;
                        entry.updated = new Date().getTime();
                        db.insert(mmFilepoolPackagesStore, entry).then(function() {
                            self._triggerPackageStatusChanged(siteId, component, componentId, mmCoreOutdated);
                        });
                    }
                } else if (entry.status === mmCoreOutdated) {
                    if (revision === entry.revision && timemodified === entry.timemodified) {
                        entry.status = mmCoreDownloaded;
                        entry.updated = new Date().getTime();
                        db.insert(mmFilepoolPackagesStore, entry).then(function() {
                            self._triggerPackageStatusChanged(siteId, component, componentId, mmCoreDownloaded);
                        });
                    }
                }
                return entry.status;
            }, function() {
                return mmCoreNotDownloaded;
            });
        });
    };
        self.getPackageTimemodified = function(siteId, component, componentId) {
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var db = site.getDb(),
                packageId = self.getPackageId(component, componentId);
            return db.get(mmFilepoolPackagesStore, packageId).then(function(entry) {
                return entry.timemodified;
            }, function() {
                return -1;
            });
        });
    };
        self._getQueueDeferred = function(siteId, fileId, create) {
        if (typeof create == 'undefined') {
            create = true;
        }
        if (!queueDeferreds[siteId]) {
            if (!create) {
                return;
            }
            queueDeferreds[siteId] = {};
        }
        if (!queueDeferreds[siteId][fileId]) {
            if (!create) {
                return;
            }
            queueDeferreds[siteId][fileId] = $q.defer();
        }
        return queueDeferreds[siteId][fileId];
    };
        self._getQueuePromise = function(siteId, fileId, create) {
        return self._getQueueDeferred(siteId, fileId, create).promise;
    };
        self._hasFileInPool = function(siteId, fileId) {
        return getSiteDb(siteId).then(function(db) {
            return db.get(mmFilepoolStore, fileId).then(function(fileObject) {
                if (typeof fileObject === 'undefined') {
                    return $q.reject();
                }
                return fileObject;
            });
        });
    };
        self._hasFileInQueue = function(siteId, fileId) {
        return $mmApp.getDB().get(mmFilepoolQueueStore, [siteId, fileId]).then(function(fileObject) {
            if (typeof fileObject === 'undefined') {
                return $q.reject();
            }
            return fileObject;
        });
    };
        self.getDirectoryUrlByUrl = function(siteId, fileUrl) {
        if ($mmFS.isAvailable()) {
            return self._fixPluginfileURL(siteId, fileUrl).then(function(fileUrl) {
                var fileId = self._getFileIdByUrl(fileUrl);
                return $mmFS.getDir(self._getFilePath(siteId, fileId, false)).then(function(dirEntry) {
                    return dirEntry.toURL();
                });
            });
        }
        return $q.reject();
    };
        self._getFileIdByUrl = function(fileUrl) {
        var url = self._removeRevisionFromUrl(fileUrl),
            filename;
        url = $mmText.decodeHTML(decodeURIComponent(url));
        if (url.indexOf('/webservice/pluginfile') !== -1) {
            angular.forEach(urlAttributes, function(regex) {
                url = url.replace(regex, '');
            });
        }
        filename = self._guessFilenameFromUrl(url);
        return filename + '_' + md5.createHash('url:' + url);
    };
        self._getNonReadableFileIdByUrl = function(fileUrl) {
        var url = self._removeRevisionFromUrl(fileUrl),
            candidate,
            extension = '';
        if (url.indexOf('/webservice/pluginfile') !== -1) {
            angular.forEach(urlAttributes, function(regex) {
                url = url.replace(regex, '');
            });
            candidate = $mmText.guessExtensionFromUrl(url);
            if (candidate && candidate !== 'php') {
                extension = '.' + candidate;
            }
        }
        return md5.createHash('url:' + url) + extension;
    };
        self._getFileUrlByUrl = function(siteId, fileUrl, mode, component, componentId, timemodified, checkSize) {
        var fileId,
            revision;
        if (typeof checkSize == 'undefined') {
            checkSize = true;
        }
        return self._fixPluginfileURL(siteId, fileUrl).then(function(fixedUrl) {
            fileUrl = fixedUrl;
            timemodified = timemodified || 0;
            revision = self.getRevisionFromUrl(fileUrl);
            fileId = self._getFileIdByUrl(fileUrl);
            return self._restoreOldFileIfNeeded(siteId, fileId, fileUrl);
        }).then(function() {
            return self._hasFileInPool(siteId, fileId).then(function(fileObject) {
                var response,
                    fn;
                if (typeof fileObject === 'undefined') {
                    addToQueueIfNeeded();
                    response = fileUrl;
                } else if (self._isFileOutdated(fileObject, revision, timemodified) && $mmApp.isOnline()) {
                    addToQueueIfNeeded();
                    response = fileUrl;
                } else {
                    if (mode === 'src') {
                        fn = self._getInternalSrcById;
                    } else {
                        fn = self._getInternalUrlById;
                    }
                    response = fn(siteId, fileId).then(function(internalUrl) {
                        return internalUrl;
                    }, function() {
                        $log.debug('File ' + fileId + ' not found on disk');
                        self._removeFileById(siteId, fileId);
                        addToQueueIfNeeded();
                        if ($mmApp.isOnline()) {
                            return fileUrl;
                        }
                        return $q.reject();
                    });
                }
                return response;
            }, function() {
                addToQueueIfNeeded();
                return fileUrl;
            });
        });
        function addToQueueIfNeeded() {
            var promise;
            if (checkSize) {
                if (!$mmApp.isOnline()) {
                    return;
                }
                if (typeof sizeCache[fileUrl] != 'undefined') {
                    promise = $q.when(sizeCache[fileUrl]);
                } else {
                    promise = $mmWS.getRemoteFileSize(fileUrl);
                }
                promise.then(function(size) {
                    if (size > 0) {
                        sizeCache[fileUrl] = size;
                        var isWifi = !$mmApp.isNetworkAccessLimited();
                        if (size <= mmFilepoolDownloadThreshold || (isWifi && size <= mmFilepoolWifiDownloadThreshold)) {
                            self.addToQueueByUrl(siteId, fileUrl, component, componentId, timemodified);
                        }
                    }
                });
            } else {
                self.addToQueueByUrl(siteId, fileUrl, component, componentId, timemodified);
            }
        }
    };
        self.getFilepoolFolderPath = function(siteId) {
        return $mmFS.getSiteFolder(siteId) + '/' + mmFilepoolFolder;
    };
        self._getFilePath = function(siteId, fileId, extension) {
        var path = $mmFS.getSiteFolder(siteId) + '/' + mmFilepoolFolder + '/' + fileId;
        if (typeof extension == 'undefined') {
            return self._hasFileInPool(siteId, fileId).then(function(fileObject) {
                if (fileObject.extension) {
                    path += '.' + fileObject.extension;
                }
                return path;
            }).catch(function() {
                return path;
            });
        } else {
            if (extension) {
                path += '.' + extension;
            }
            return path;
        }
    };
        self.getFilePathByUrl = function(siteId, fileUrl) {
        return self._fixPluginfileURL(siteId, fileUrl).then(function(fileUrl) {
            var fileId = self._getFileIdByUrl(fileUrl);
            return self._getFilePath(siteId, fileId);
        });
    };
        self.getFileStateByUrl = function(siteId, fileUrl, timemodified) {
        var fileId,
            revision;
        return self._fixPluginfileURL(siteId, fileUrl).then(function(fixedUrl) {
            fileUrl = fixedUrl;
            timemodified = timemodified || 0;
            revision = self.getRevisionFromUrl(fileUrl);
            fileId = self._getFileIdByUrl(fileUrl);
            return self._restoreOldFileIfNeeded(siteId, fileId, fileUrl);
        }).then(function() {
            return self._hasFileInQueue(siteId, fileId).then(function() {
                return mmCoreDownloading;
            }, function() {
                return self._hasFileInPool(siteId, fileId).then(function(fileObject) {
                    if (self._isFileOutdated(fileObject, revision, timemodified)) {
                        return mmCoreOutdated;
                    } else {
                        return mmCoreDownloaded;
                    }
                }, function() {
                    return mmCoreNotDownloaded;
                });
            });
        });
    };
        self._getInternalSrcById = function(siteId, fileId) {
        if ($mmFS.isAvailable()) {
            return self._getFilePath(siteId, fileId).then(function(path) {
                return $mmFS.getFile(path).then(function(fileEntry) {
                    return $mmFS.getInternalURL(fileEntry);
                });
            });
        }
        return $q.reject();
    };
        self._getInternalUrlById = function(siteId, fileId) {
        if ($mmFS.isAvailable()) {
            return self._getFilePath(siteId, fileId).then(function(path) {
                return $mmFS.getFile(path).then(function(fileEntry) {
                    return fileEntry.toURL();
                });
            });
        }
        return $q.reject();
    };
        self._getInternalUrlByPath = function(filePath) {
        if ($mmFS.isAvailable()) {
            return $mmFS.getFile(filePath).then(function(fileEntry) {
                return fileEntry.toURL();
            });
        }
        return $q.reject();
    };
        self.getPackageDirPathByUrl = function(siteId, url) {
        return self._fixPluginfileURL(siteId, url).then(function(fixedUrl) {
            var fileId = self._getNonReadableFileIdByUrl(fixedUrl);
            return self._getFilePath(siteId, fileId, false);
        });
    };
        self.getPackageDirUrlByUrl = function(siteId, url) {
        if ($mmFS.isAvailable()) {
            return self._fixPluginfileURL(siteId, url).then(function(fixedUrl) {
                var fileId = self._getNonReadableFileIdByUrl(fixedUrl);
                return $mmFS.getDir(self._getFilePath(siteId, fileId, false)).then(function(dirEntry) {
                    return dirEntry.toURL();
                });
            });
        }
        return $q.reject();
    };
        self.getRevisionFromFileList = function(files) {
        var revision = 0;
        angular.forEach(files, function(file) {
            if (file.fileurl) {
                var r = self.getRevisionFromUrl(file.fileurl);
                if (r > revision) {
                    revision = r;
                }
            }
        });
        return revision;
    };
        self.getRevisionFromUrl = function(url) {
        var matches = url.match(revisionRegex);
        if (matches && typeof matches[1] != 'undefined') {
            return parseInt(matches[1]);
        }
    };
        self.getSrcByUrl = function(siteId, fileUrl, component, componentId, timemodified, checkSize) {
        return self._getFileUrlByUrl(siteId, fileUrl, 'src', component, componentId, timemodified, checkSize);
    };
        self.getTimemodifiedFromFileList = function(files) {
        var timemod = 0;
        angular.forEach(files, function(file) {
            if (file.timemodified > timemod) {
                timemod = file.timemodified;
            }
        });
        return timemod;
    };
        self.getUrlByUrl = function(siteId, fileUrl, component, componentId, timemodified, checkSize) {
        return self._getFileUrlByUrl(siteId, fileUrl, 'url', component, componentId, timemodified, checkSize);
    };
        self._guessFilenameFromUrl = function(fileUrl) {
        var filename = '';
        if (fileUrl.indexOf('/webservice/pluginfile') !== -1) {
            var params = $mmUtil.extractUrlParams(fileUrl);
            if (params.file) {
                filename = params.file.substr(params.file.lastIndexOf('/') + 1);
            } else {
                filename = $mmText.getLastFileWithoutParams(fileUrl);
            }
        } else if ($mmUtil.isGravatarUrl(fileUrl)) {
            filename = 'gravatar_' + $mmText.getLastFileWithoutParams(fileUrl);
        } else if ($mmUtil.isThemeImageUrl(fileUrl)) {
            var matches = fileUrl.match(/clean\/core\/([^\/]*)\//);
            if (matches && matches[1]) {
                filename = matches[1];
            }
            filename = 'default_' + filename + '_' + $mmText.getLastFileWithoutParams(fileUrl);
        } else {
            filename = $mmText.getLastFileWithoutParams(fileUrl);
        }
        var position = filename.lastIndexOf('.');
        if (position != -1) {
            filename = filename.substr(0, position);
        }
        return $mmText.removeSpecialCharactersForFiles(filename);
    };
        self.invalidateAllFiles = function(siteId) {
        return getSiteDb(siteId).then(function(db) {
            return db.getAll(mmFilepoolStore).then(function(items) {
                var promises = [];
                angular.forEach(items, function(item) {
                    item.stale = true;
                    promises.push(db.insert(mmFilepoolStore, item));
                });
                return $q.all(promises);
            });
        });
    };
        self.invalidateFileByUrl = function(siteId, fileUrl) {
        return self._fixPluginfileURL(siteId, fileUrl).then(function(fileUrl) {
            var fileId = self._getFileIdByUrl(fileUrl);
            return getSiteDb(siteId).then(function(db) {
                return db.get(mmFilepoolStore, fileId).then(function(fileObject) {
                    if (!fileObject) {
                        return;
                    }
                    fileObject.stale = true;
                    return db.insert(mmFilepoolStore, fileObject);
                });
            });
        });
    };
        self.invalidateFilesByComponent = function(siteId, component, componentId) {
        var where;
        if (typeof componentId !== 'undefined') {
            where = ['componentAndId', '=', [component, self._fixComponentId(componentId)]];
        } else {
            where = ['component', '=', component];
        }
        return getSiteDb(siteId).then(function(db) {
            return db.query(mmFilepoolLinksStore, where).then(function(items) {
                var promise,
                    promises = [];
                angular.forEach(items, function(item) {
                    promise = db.get(mmFilepoolStore, item.fileId).then(function(fileEntry) {
                        if (!fileEntry) {
                            return;
                        }
                        fileEntry.stale = true;
                        return db.insert(mmFilepoolStore, fileEntry);
                    });
                    promises.push(promise);
                });
                return $q.all(promises);
            });
        });
    };
        self.isFileDownloadingByUrl = function(siteId, fileUrl) {
        return self._fixPluginfileURL(siteId, fileUrl).then(function(fileUrl) {
            fileId = self._getFileIdByUrl(fileUrl);
            return self._hasFileInQueue(siteId, fileId);
        });
    };
        self._isFileOutdated = function(fileObject, revision, timemodified) {
        return fileObject.stale || revision > fileObject.revision || timemodified > fileObject.timemodified;
    };
        self._notifyFileDownloaded = function(siteId, fileId) {
        $mmEvents.trigger(self._getFileEventName(siteId, fileId), {success: true});
    };
        self._notifyFileDownloadError = function(siteId, fileId) {
        $mmEvents.trigger(self._getFileEventName(siteId, fileId), {success: false});
    };
        self.prefetchPackage = function(siteId, fileList, component, componentId, revision, timemodified, dirPath) {
        return self._downloadOrPrefetchPackage(siteId, fileList, true, component, componentId, revision, timemodified, dirPath);
    };
        self._processQueue = function() {
        var deferred = $q.defer(),
            promise;
        if (queueState !== QUEUE_RUNNING) {
            deferred.reject(ERR_QUEUE_ON_PAUSE);
            promise = deferred.promise;
        } else if (!$mmFS.isAvailable() || !$mmApp.isOnline()) {
            deferred.reject(ERR_FS_OR_NETWORK_UNAVAILABLE);
            promise = deferred.promise;
        } else {
            promise = self._processImportantQueueItem();
        }
        promise.then(function() {
            $timeout(self._processQueue, mmFilepoolQueueProcessInterval);
        }, function(error) {
            if (error === ERR_FS_OR_NETWORK_UNAVAILABLE) {
                $log.debug('Filesysem or network unavailable, pausing queue processing.');
            } else if (error === ERR_QUEUE_IS_EMPTY) {
                $log.debug('Queue is empty, pausing queue processing.');
                $mmEvents.trigger(mmCoreEventQueueEmpty);
            }
            queueState = QUEUE_PAUSED;
        });
    };
        self._processImportantQueueItem = function() {
        return $mmApp.getDB().query(mmFilepoolQueueStore, undefined, 'sortorder', undefined, 1)
        .then(function(items) {
            var item = items.pop();
            if (!item) {
                return $q.reject(ERR_QUEUE_IS_EMPTY);
            }
            return self._processQueueItem(item);
        }, function() {
            return $q.reject(ERR_QUEUE_IS_EMPTY);
        });
    };
        self._processQueueItem = function(item) {
        var siteId = item.siteId,
            fileId = item.fileId,
            fileUrl = item.url,
            revision = item.revision,
            timemodified = item.timemodified,
            filePath = item.path,
            links = item.links || [];
        $log.debug('Processing queue item: ' + siteId + ', ' + fileId);
        return getSiteDb(siteId).then(function(db) {
            return db.get(mmFilepoolStore, fileId).then(function(fileObject) {
                if (fileObject && !self._isFileOutdated(fileObject, revision, timemodified)) {
                    $log.debug('Queued file already in store, ignoring...');
                    self._addFileLinks(siteId, fileId, links);
                    self._removeFromQueue(siteId, fileId).finally(function() {
                        self._treatQueueDeferred(siteId, fileId, true);
                    });
                    self._notifyFileDownloaded(siteId, fileId);
                    return;
                }
                return download(siteId, fileUrl, fileObject, links);
            }, function() {
                return download(siteId, fileUrl, undefined, links);
            });
        }, function() {
            $log.debug('Item dropped from queue due to site DB not retrieved: ' + fileUrl);
            return self._removeFromQueue(siteId, fileId).catch(function() {}).finally(function() {
                self._treatQueueDeferred(siteId, fileId, false);
                self._notifyFileDownloadError(siteId, fileId);
            });
        });
                function download(siteId, fileUrl, fileObject, links) {
            return self._restoreOldFileIfNeeded(siteId, fileId, fileUrl, filePath).then(function() {
                return self._downloadForPoolByUrl(siteId, fileUrl, revision, timemodified, filePath, fileObject).then(function() {
                    var promise;
                    self._addFileLinks(siteId, fileId, links);
                    promise = self._removeFromQueue(siteId, fileId);
                    self._treatQueueDeferred(siteId, fileId, true);
                    self._notifyFileDownloaded(siteId, fileId);
                    return promise.catch(function() {});
                }, function(errorObject) {
                    var dropFromQueue = false;
                    if (typeof errorObject !== 'undefined' && errorObject.source === fileUrl) {
                        if (errorObject.code === 1) {
                            dropFromQueue = true;
                        } else if (errorObject.code === 2) {
                            dropFromQueue = true;
                        } else if (errorObject.code === 3) {
                            dropFromQueue = true;
                        } else if (errorObject.code === 4) {
                        } else if (errorObject.code === 5) {
                            dropFromQueue = true;
                        } else {
                            dropFromQueue = true;
                        }
                    } else {
                        dropFromQueue = true;
                    }
                    if (dropFromQueue) {
                        var promise;
                        $log.debug('Item dropped from queue due to error: ' + fileUrl);
                        promise = self._removeFromQueue(siteId, fileId);
                        return promise.catch(function() {}).finally(function() {
                            self._treatQueueDeferred(siteId, fileId, false);
                            self._notifyFileDownloadError(siteId, fileId);
                        });
                    } else {
                        self._treatQueueDeferred(siteId, fileId, false);
                        self._notifyFileDownloadError(siteId, fileId);
                        return $q.reject();
                    }
                }, function(progress) {
                    if (queueDeferreds[siteId] && queueDeferreds[siteId][fileId]) {
                        queueDeferreds[siteId][fileId].notify(progress);
                    }
                });
            });
        }
    };
        self._removeFromQueue = function(siteId, fileId) {
        return $mmApp.getDB().remove(mmFilepoolQueueStore, [siteId, fileId]);
    };
        self._removeFileById = function(siteId, fileId) {
        return getSiteDb(siteId).then(function(db) {
            var p1, p2, p3;
            p1 = db.remove(mmFilepoolStore, fileId);
            p2 = db.where(mmFilepoolLinksStore, 'fileId', '=', fileId).then(function(entries) {
                return $q.all(entries.map(function(entry) {
                    return db.remove(mmFilepoolLinksStore, [entry.fileId, entry.component, entry.componentId]);
                }));
            });
            if ($mmFS.isAvailable()) {
                p3 = self._getFilePath(siteId, fileId).then(function(path) {
                    return $mmFS.removeFile(path);
                });
            } else {
                p3 = $q.when();
            }
            return $q.all([p1, p2, p3]);
        });
    };
        self.removeFilesByComponent = function(siteId, component, componentId) {
        var where;
        if (typeof componentId !== 'undefined') {
            where = ['componentAndId', '=', [component, self._fixComponentId(componentId)]];
        } else {
            where = ['component', '=', component];
        }
        return getSiteDb(siteId).then(function(db) {
            return db.query(mmFilepoolLinksStore, where);
        }).then(function(items) {
            return $q.all(items.map(function(item) {
                return self._removeFileById(siteId, item.fileId);
            }));
        });
    };
        self.removeFileByUrl = function(siteId, fileUrl) {
        return self._fixPluginfileURL(siteId, fileUrl).then(function(fileUrl) {
            var fileId = self._getFileIdByUrl(fileUrl);
            return self._restoreOldFileIfNeeded(siteId, fileId, fileUrl).then(function() {
                return self._removeFileById(siteId, fileId);
            });
        });
    };
        self._removeRevisionFromUrl = function(url) {
        return url.replace(revisionRegex, '/content/0/');
    };
        self._fillExtensionInFile = function(fileObject, siteId) {
        var extension;
        if (typeof fileObject.extension != 'undefined') {
            return;
        }
        return getSiteDb(siteId).then(function(db) {
            extension = $mmFS.getFileExtension(fileObject.path);
            if (!extension) {
                fileObject.stale = true;
                $log.debug('Staled file with no extension ' + fileObject.fileId);
                return db.insert(mmFilepoolStore, fileObject);
            }
            var fileId = fileObject.fileId;
            fileObject.fileId = $mmFS.removeExtension(fileId);
            fileObject.extension = extension;
            return db.insert(mmFilepoolStore, fileObject).then(function() {
                if (fileObject.fileId == fileId) {
                    $log.debug('Removed extesion ' + extension + ' from file ' + fileObject.fileId);
                    return $q.when();
                }
                return db.query(mmFilepoolLinksStore, ['fileId', '=', fileId]).then(function(entries) {
                    return $q.all(entries.map(function(linkEntry) {
                        linkEntry.fileId = fileObject.fileId;
                        return db.insert(mmFilepoolLinksStore, linkEntry).then(function() {
                            $log.debug('Removed extesion ' + extension + ' from file links ' + linkEntry.fileId);
                            return db.remove(mmFilepoolLinksStore, [fileId, linkEntry.component, linkEntry.componentId]);
                        });
                    }));
                }).finally(function() {
                    $log.debug('Removed extesion ' + extension + ' from file ' + fileObject.fileId);
                    return db.remove(mmFilepoolStore, fileId);
                });
            });
        });
    };
        self.fillMissingExtensionInFiles = function(siteId) {
        $log.debug('Fill missing extensions in files of ' + siteId);
        return getSiteDb(siteId).then(function(db) {
            return db.getAll(mmFilepoolStore).then(function(fileObjects) {
                var promises = [];
                angular.forEach(fileObjects, function(fileObject) {
                    promises.push(self._fillExtensionInFile(fileObject, siteId));
                });
                return $q.all(promises);
            });
        });
    };
        self.treatExtensionInQueue = function() {
        var appDB;
        $log.debug('Treat extensions in queue');
        appDB = $mmApp.getDB();
        return appDB.getAll(mmFilepoolQueueStore).then(function(fileObjects) {
            var promises = [];
            angular.forEach(fileObjects, function(fileObject) {
                var fileId = fileObject.fileId;
                fileObject.fileId = $mmFS.removeExtension(fileId);
                if (fileId == fileObject.fileId) {
                    return;
                }
                promises.push(appDB.insert(mmFilepoolQueueStore, fileObject).then(function() {
                    $log.debug('Removed extesion from queued file ' + fileObject.fileId);
                    return self._removeFromQueue(fileObject.siteId, fileId);
                }));
            });
            return $q.all(promises);
        });
    };
        self._restoreOldFileIfNeeded = function(siteId, fileId, fileUrl, filePath) {
        var fileObject,
            oldFileId = self._getNonReadableFileIdByUrl(fileUrl);
        if (fileId == oldFileId) {
            return $q.when();
        }
        return self._hasFileInPool(siteId, fileId).catch(function() {
            return self._hasFileInPool(siteId, oldFileId).then(function(entry) {
                fileObject = entry;
                if (filePath) {
                    return $q.when();
                } else {
                    return self._getFilePath(siteId, oldFileId).then(function(oldPath) {
                        return self._getFilePath(siteId, fileId).then(function(newPath) {
                            return $mmFS.copyFile(oldPath, newPath);
                        });
                    });
                }
            }).then(function() {
                return self._addFileToPool(siteId, fileId, fileObject);
            }).then(function() {
                return self._getFileLinks(siteId, fileId).then(function(links) {
                    var promises = [];
                    angular.forEach(links, function(link) {
                        promises.push(self._addFileLink(siteId, fileId, link.component, link.componentId));
                    });
                    return $q.all(promises);
                });
            }).then(function() {
                return self._removeFileById(siteId, oldFileId);
            }).catch(function() {
            });
        });
    };
        self.setPackagePreviousStatus = function(siteId, component, componentId) {
        $log.debug('Set previous status for package ' + component + ' ' + componentId);
        componentId = self._fixComponentId(componentId);
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var db = site.getDb(),
                packageId = self.getPackageId(component, componentId);
            return db.get(mmFilepoolPackagesStore, packageId).then(function(entry) {
                entry.status = entry.previous || mmCoreNotDownloaded;
                entry.updated = new Date().getTime();
                $log.debug('Set status \'' + entry.status + '\' for package ' + component + ' ' + componentId);
                return db.insert(mmFilepoolPackagesStore, entry).then(function() {
                    self._triggerPackageStatusChanged(siteId, component, componentId, entry.status);
                    return entry.status;
                });
            });
        });
    };
        self.shouldDownloadBeforeOpen = function(url, size) {
        if (size >= 0 && size <= mmFilepoolDownloadThreshold) {
            return $q.when();
        }
        return $mmUtil.getMimeType(url).then(function(mimetype) {
            if (mimetype.indexOf('video') != -1 || mimetype.indexOf('audio') != -1) {
                return $q.reject();
            }
        });
    };
        self.storePackageStatus = function(siteId, component, componentId, status, revision, timemodified) {
        $log.debug('Set status \'' + status + '\' for package ' + component + ' ' + componentId);
        componentId = self._fixComponentId(componentId);
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var db = site.getDb(),
                packageId = self.getPackageId(component, componentId);
            return db.get(mmFilepoolPackagesStore, packageId).then(function(entry) {
                if (typeof revision == 'undefined') {
                    revision = entry.revision;
                }
                if (typeof timemodified == 'undefined') {
                    timemodified = entry.timemodified;
                }
                return entry.status;
            }).catch(function() {
                return undefined;
            }).then(function(previousStatus) {
                revision = revision || 0;
                timemodified = timemodified || 0;
                var promise;
                if (previousStatus === status) {
                    promise = $q.when();
                } else {
                    promise = db.insert(mmFilepoolPackagesStore, {
                        id: packageId,
                        component: component,
                        componentId: componentId,
                        status: status,
                        previous: previousStatus,
                        revision: revision,
                        timemodified: timemodified,
                        updated: new Date().getTime()
                    });
                }
                return promise.then(function() {
                    self._triggerPackageStatusChanged(siteId, component, componentId, status);
                });
            });
        });
    };
        self._treatQueueDeferred = function(siteId, fileId, resolve) {
        if (queueDeferreds[siteId] && queueDeferreds[siteId][fileId]) {
            if (resolve) {
                queueDeferreds[siteId][fileId].resolve();
            } else {
                queueDeferreds[siteId][fileId].reject();
            }
            delete queueDeferreds[siteId][fileId];
        }
    };
        self._triggerPackageStatusChanged = function(siteId, component, componentId, status) {
        var data = {
            siteid: siteId,
            component: component,
            componentId: self._fixComponentId(componentId),
            status: status
        };
        $mmEvents.trigger(mmCoreEventPackageStatusChanged, data);
    };
    return self;
}])
.run(["$log", "$ionicPlatform", "$timeout", "$mmFilepool", function($log, $ionicPlatform, $timeout, $mmFilepool) {
    $log = $log.getInstance('$mmFilepool');
    $ionicPlatform.ready(function() {
        $timeout($mmFilepool.checkQueueProcessing, 1000);
    });
}]);

angular.module('mm.core')
.constant('mmFsSitesFolder', 'sites')
.constant('mmFsTmpFolder', 'tmp')
.factory('$mmFS', ["$ionicPlatform", "$cordovaFile", "$log", "$q", "$http", "$cordovaZip", "$mmText", "mmFsSitesFolder", "mmFsTmpFolder", function($ionicPlatform, $cordovaFile, $log, $q, $http, $cordovaZip, $mmText, mmFsSitesFolder, mmFsTmpFolder) {
    $log = $log.getInstance('$mmFS');
    var self = {},
        initialized = false,
        basePath = '',
        isHTMLAPI = false,
        extToMime = {},
        mimeToExt = {};
    $http.get('core/assets/mimetypes.json').then(function(response) {
        extToMime = response.data;
    }, function() {
    });
    $http.get('core/assets/mimetoext.json').then(function(response) {
        mimeToExt = response.data;
    }, function() {
    });
    self.FORMATTEXT         = 0;
    self.FORMATDATAURL      = 1;
    self.FORMATBINARYSTRING = 2;
    self.FORMATARRAYBUFFER  = 3;
        self.setHTMLBasePath = function(path) {
        isHTMLAPI = true;
        basePath = path;
    };
        self.usesHTMLAPI = function() {
        return isHTMLAPI;
    };
        self.init = function() {
        var deferred = $q.defer();
        if (initialized) {
            deferred.resolve();
            return deferred.promise;
        }
        $ionicPlatform.ready(function() {
            if (ionic.Platform.isAndroid()) {
                basePath = cordova.file.externalApplicationStorageDirectory;
            } else if (ionic.Platform.isIOS()) {
                basePath = cordova.file.documentsDirectory;
            } else if (!self.isAvailable() || basePath === '') {
                $log.error('Error getting device OS.');
                deferred.reject();
                return;
            }
            initialized = true;
            $log.debug('FS initialized: '+basePath);
            deferred.resolve();
        });
        return deferred.promise;
    };
        self.isAvailable = function() {
        return typeof window.resolveLocalFileSystemURL !== 'undefined' && typeof FileTransfer !== 'undefined';
    };
        self.getFile = function(path) {
        path = self.removeStartingSlash(path);
        return self.init().then(function() {
            $log.debug('Get file: '+path);
            return $cordovaFile.checkFile(basePath, path);
        });
    };
        self.getDir = function(path) {
        path = self.removeStartingSlash(path);
        return self.init().then(function() {
            $log.debug('Get directory: '+path);
            return $cordovaFile.checkDir(basePath, path);
        });
    };
        self.getSiteFolder = function(siteId) {
        return mmFsSitesFolder + '/' + siteId;
    };
        function create(isDirectory, path, failIfExists, base) {
        path = self.removeStartingSlash(path);
        return self.init().then(function() {
            base = base || basePath;
            if (path.indexOf('/') == -1) {
                if (isDirectory) {
                    $log.debug('Create dir ' + path + ' in ' + base);
                    return $cordovaFile.createDir(base, path, !failIfExists);
                } else {
                    $log.debug('Create file ' + path + ' in ' + base);
                    return $cordovaFile.createFile(base, path, !failIfExists);
                }
            } else {
                var firstDir = path.substr(0, path.indexOf('/'));
                var restOfPath = path.substr(path.indexOf('/') + 1);
                $log.debug('Create dir ' + firstDir + ' in ' + base);
                return $cordovaFile.createDir(base, firstDir, true).then(function(newDirEntry) {
                    return create(isDirectory, restOfPath, failIfExists, newDirEntry.toURL());
                }, function(error) {
                    $log.error('Error creating directory ' + firstDir + ' in ' + base);
                    return $q.reject(error);
                });
            }
        });
    }
        self.createDir = function(path, failIfExists) {
        failIfExists = failIfExists || false;
        return create(true, path, failIfExists);
    };
        self.createFile = function(path, failIfExists) {
        failIfExists = failIfExists || false;
        return create(false, path, failIfExists);
    };
        self.removeDir = function(path) {
        path = self.removeStartingSlash(path);
        return self.init().then(function() {
            $log.debug('Remove directory: ' + path);
            return $cordovaFile.removeRecursively(basePath, path);
        });
    };
        self.removeFile = function(path) {
        path = self.removeStartingSlash(path);
        return self.init().then(function() {
            $log.debug('Remove file: ' + path);
            return $cordovaFile.removeFile(basePath, path);
        });
    };
        self.removeFileByFileEntry = function(fileEntry) {
        var deferred = $q.defer();
        fileEntry.remove(deferred.resolve, deferred.reject);
        return deferred.promise;
    };
        self.getDirectoryContents = function(path) {
        path = self.removeStartingSlash(path);
        $log.debug('Get contents of dir: ' + path);
        return self.getDir(path).then(function(dirEntry) {
            var deferred = $q.defer();
            var directoryReader = dirEntry.createReader();
            directoryReader.readEntries(deferred.resolve, deferred.reject);
            return deferred.promise;
        });
    };
        function getSize(entry) {
        var deferred = $q.defer();
        if (entry.isDirectory) {
            var directoryReader = entry.createReader();
            directoryReader.readEntries(function(entries) {
                var promises = [];
                for (var i = 0; i < entries.length; i++) {
                    promises.push(getSize(entries[i]));
                }
                $q.all(promises).then(function(sizes) {
                    var directorySize = 0;
                    for (var i = 0; i < sizes.length; i++) {
                        var fileSize = parseInt(sizes[i]);
                        if (isNaN(fileSize)) {
                            deferred.reject();
                            return;
                        }
                        directorySize += fileSize;
                    }
                    deferred.resolve(directorySize);
                }, deferred.reject);
            }, deferred.reject);
        } else if (entry.isFile) {
            entry.file(function(file) {
                deferred.resolve(file.size);
            }, deferred.reject);
        }
        return deferred.promise;
    }
        self.getDirectorySize = function(path) {
        path = self.removeStartingSlash(path);
        $log.debug('Get size of dir: ' + path);
        return self.getDir(path).then(function(dirEntry) {
           return getSize(dirEntry);
        });
    };
        self.getFileSize = function(path) {
        path = self.removeStartingSlash(path);
        $log.debug('Get size of file: ' + path);
        return self.getFile(path).then(function(fileEntry) {
           return getSize(fileEntry);
        });
    };
        self.getFileObjectFromFileEntry = function(entry) {
        $log.debug('Get file object of: ' + entry.fullPath);
        var deferred = $q.defer();
        entry.file(function(file) {
            deferred.resolve(file);
        }, deferred.reject);
        return deferred.promise;
    };
        self.calculateFreeSpace = function() {
        if (ionic.Platform.isIOS() || isHTMLAPI) {
            if (window.requestFileSystem) {
                var iterations = 0,
                    maxIterations = 50,
                    deferred = $q.defer();
                function calculateByRequest(size, ratio) {
                    var deferred = $q.defer();
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, size, function() {
                        iterations++;
                        if (iterations > maxIterations) {
                            deferred.resolve(size);
                            return;
                        }
                        calculateByRequest(size * ratio, ratio).then(deferred.resolve);
                    }, function() {
                        deferred.resolve(size / ratio);
                    });
                    return deferred.promise;
                }
                calculateByRequest(1048576, 1.3).then(function(size) {
                    iterations = 0;
                    maxIterations = 10;
                    calculateByRequest(size, 1.1).then(deferred.resolve);
                });
                return deferred.promise;
            } else {
                return $q.reject();
            }
        } else {
            return $cordovaFile.getFreeDiskSpace().then(function(size) {
                return size * 1024;
            });
        }
    };
        self.normalizeFileName = function(filename) {
        filename = decodeURIComponent(filename);
        return filename;
    };
        self.readFile = function(path, format) {
        path = self.removeStartingSlash(path);
        format = format || self.FORMATTEXT;
        $log.debug('Read file ' + path + ' with format '+format);
        switch (format) {
            case self.FORMATDATAURL:
                return $cordovaFile.readAsDataURL(basePath, path);
            case self.FORMATBINARYSTRING:
                return $cordovaFile.readAsBinaryString(basePath, path);
            case self.FORMATARRAYBUFFER:
                return $cordovaFile.readAsArrayBuffer(basePath, path);
            default:
                return $cordovaFile.readAsText(basePath, path);
        }
    };
        self.readFileData = function(fileData, format) {
        format = format || self.FORMATTEXT;
        $log.debug('Read file from file data with format '+format);
        var deferred = $q.defer();
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            if (evt.target.result !== undefined || evt.target.result !== null) {
                deferred.resolve(evt.target.result);
            } else if (evt.target.error !== undefined || evt.target.error !== null) {
                deferred.reject(evt.target.error);
            } else {
                deferred.reject({code: null, message: 'READER_ONLOADEND_ERR'});
            }
        };
        switch (format) {
            case self.FORMATDATAURL:
                reader.readAsDataURL(fileData);
                break;
            case self.FORMATBINARYSTRING:
                reader.readAsBinaryString(fileData);
                break;
            case self.FORMATARRAYBUFFER:
                reader.readAsArrayBuffer(fileData);
                break;
            default:
                reader.readAsText(fileData);
        }
        return deferred.promise;
    };
        self.writeFile = function(path, data) {
        path = self.removeStartingSlash(path);
        $log.debug('Write file: ' + path);
        return self.init().then(function() {
            return self.createFile(path).then(function(fileEntry) {
                if (isHTMLAPI && typeof data == 'string') {
                    var type = self.getMimeType(self.getFileExtension(path));
                    data = new Blob([data], {type: type || 'text/plain'});
                }
                return $cordovaFile.writeFile(basePath, path, data, true).then(function() {
                    return fileEntry;
                });
            });
        });
    };
        self.getExternalFile = function(fullPath) {
        return $cordovaFile.checkFile(fullPath, '');
    };
        self.removeExternalFile = function(fullPath) {
        var directory = fullPath.substring(0, fullPath.lastIndexOf('/') );
        var filename = fullPath.substr(fullPath.lastIndexOf('/') + 1);
        return $cordovaFile.removeFile(directory, filename);
    };
        self.getBasePath = function() {
        return self.init().then(function() {
            if (basePath.slice(-1) == '/') {
                return basePath;
            } else {
                return basePath + '/';
            }
        });
    };
        self.getBasePathToDownload = function() {
        return self.init().then(function() {
            if (ionic.Platform.isIOS()) {
                return $cordovaFile.checkDir(basePath, '').then(function(dirEntry) {
                    return dirEntry.toInternalURL();
                });
            } else {
                return basePath;
            }
        });
    };
        self.getTmpFolder = function() {
        return mmFsTmpFolder;
    };
        self.moveFile = function(originalPath, newPath) {
        originalPath = self.removeStartingSlash(originalPath);
        newPath = self.removeStartingSlash(newPath);
        return self.init().then(function() {
            if (isHTMLAPI) {
                var commonPath = basePath,
                    dirsA = originalPath.split('/'),
                    dirsB = newPath.split('/');
                for (var i = 0; i < dirsA.length; i++) {
                    var dir = dirsA[i];
                    if (dirsB[i] === dir) {
                        dir = dir + '/';
                        commonPath = self.concatenatePaths(commonPath, dir);
                        originalPath = originalPath.replace(dir, '');
                        newPath = newPath.replace(dir, '');
                    } else {
                        break;
                    }
                }
                return $cordovaFile.moveFile(commonPath, originalPath, commonPath, newPath);
            } else {
                return $cordovaFile.moveFile(basePath, originalPath, basePath, newPath);
            }
        });
    };
        self.copyFile = function(from, to) {
        from = self.removeStartingSlash(from);
        to = self.removeStartingSlash(to);
        return self.init().then(function() {
            if (isHTMLAPI) {
                var commonPath = basePath,
                    dirsA = from.split('/'),
                    dirsB = to.split('/');
                for (var i = 0; i < dirsA.length; i++) {
                    var dir = dirsA[i];
                    if (dirsB[i] === dir) {
                        dir = dir + '/';
                        commonPath = self.concatenatePaths(commonPath, dir);
                        from = from.replace(dir, '');
                        to = to.replace(dir, '');
                    } else {
                        break;
                    }
                }
                return $cordovaFile.copyFile(commonPath, from, commonPath, to);
            } else {
                var toFile = self.getFileAndDirectoryFromPath(to);
                if (toFile.directory == '') {
                    return $cordovaFile.copyFile(basePath, from, basePath, to);
                } else {
                    return self.createDir(toFile.directory).then(function() {
                        return $cordovaFile.copyFile(basePath, from, basePath, to);
                    });
                }
            }
        });
    };
        self.getFileAndDirectoryFromPath = function(path) {
        var file = {
            directory: '',
            name: ''
        };
        file.directory = path.substring(0, path.lastIndexOf('/') );
        file.name = path.substr(path.lastIndexOf('/') + 1);
        return file;
    };
        self.concatenatePaths = function(leftPath, rightPath) {
        if (!leftPath) {
            return rightPath;
        } else if (!rightPath) {
            return leftPath;
        }
        var lastCharLeft = leftPath.slice(-1),
            firstCharRight = rightPath.charAt(0);
        if (lastCharLeft === '/' && firstCharRight === '/') {
            return leftPath + rightPath.substr(1);
        } else if(lastCharLeft !== '/' && firstCharRight !== '/') {
            return leftPath + '/' + rightPath;
        } else {
            return leftPath + rightPath;
        }
    };
        self.getInternalURL = function(fileEntry) {
        if (isHTMLAPI) {
            return fileEntry.toURL();
        }
        return fileEntry.toInternalURL();
    };
        self.getFileIcon = function(filename) {
        var ext = self.getFileExtension(filename),
            icon;
        if (ext && extToMime[ext] && extToMime[ext].icon) {
            icon = extToMime[ext].icon + '-64.png';
        } else {
            icon = 'unknown-64.png';
        }
        return 'img/files/' + icon;
    };
        self.getFolderIcon = function() {
        return 'img/files/folder-64.png';
    };
        self.getFileExtension = function(filename) {
        var dot = filename.lastIndexOf("."),
            ext;
        if (dot > -1) {
            ext = filename.substr(dot + 1).toLowerCase();
        }
        return ext;
    };
        self.getMimeType = function(extension) {
        if (extToMime[extension] && extToMime[extension].type) {
            return extToMime[extension].type;
        }
    };
        self.getExtension = function(mimetype, url) {
        if (mimetype == 'application/x-forcedownload' || mimetype == 'application/forcedownload') {
            return $mmText.guessExtensionFromUrl(url);
        }
        var extensions = mimeToExt[mimetype];
        if (extensions && extensions.length) {
            if (extensions.length > 1 && url) {
                var candidate = $mmText.guessExtensionFromUrl(url);
                if (extensions.indexOf(candidate) != -1) {
                    return candidate;
                }
            }
            return extensions[0];
        }
        return undefined;
    };
        self.removeExtension = function(path) {
        var index = path.lastIndexOf('.');
        if (index > -1) {
            return path.substr(0, index);
        }
        return path;
    };
        self.addBasePathIfNeeded = function(path) {
        if (path.indexOf(basePath) > -1) {
            return path;
        } else {
            return self.concatenatePaths(basePath, path);
        }
    };
        self.removeBasePath = function(path) {
        if (path.indexOf(basePath) > -1) {
            return path.replace(basePath, '');
        } else {
            return false;
        }
    };
        self.unzipFile = function(path, destFolder) {
        path = self.removeStartingSlash(path);
        return self.getFile(path).then(function(fileEntry) {
            destFolder = self.addBasePathIfNeeded(destFolder || self.removeExtension(path));
            return $cordovaZip.unzip(fileEntry.toURL(), destFolder);
        });
    };
        self.replaceInFile = function(path, search, newValue) {
        return self.readFile(path).then(function(content) {
            if (typeof content == 'undefined' || content === null || !content.replace) {
                return $q.reject();
            }
            if (content.match(search)) {
                content = content.replace(search, newValue);
                return self.writeFile(path, content);
            }
        });
    };
        self.getMetadata = function(fileEntry) {
        if (!fileEntry || !fileEntry.getMetadata) {
            return $q.reject();
        }
        var deferred = $q.defer();
        fileEntry.getMetadata(deferred.resolve, deferred.reject);
        return deferred.promise;
    };
        self.getMetadataFromPath = function(path, isDir) {
        path = self.removeStartingSlash(path);
        var fn = isDir ? self.getDir : self.getFile;
        return fn(path).then(function(entry) {
            return self.getMetadata(entry);
        });
    };
        self.removeStartingSlash = function(path) {
        if (path[0] == '/') {
            return path.substr(1);
        }
        return path;
    };
        function copyOrMoveExternalFile(from, to, copy) {
        return self.getExternalFile(from).then(function(fileEntry) {
            var dirAndFile = self.getFileAndDirectoryFromPath(to);
            return self.createDir(dirAndFile.directory).then(function(dirEntry) {
                var deferred = $q.defer();
                if (copy) {
                    fileEntry.copyTo(dirEntry, dirAndFile.name, deferred.resolve, deferred.reject);
                } else {
                    fileEntry.moveTo(dirEntry, dirAndFile.name, deferred.resolve, deferred.reject);
                }
                return deferred.promise;
            });
        });
    }
        self.copyExternalFile = function(from, to) {
        return copyOrMoveExternalFile(from, to, true);
    };
        self.moveExternalFile = function(from, to) {
        return copyOrMoveExternalFile(from, to, false);
    };
        self.getUniqueNameInFolder = function(dirPath, fileName, defaultExt) {
        return self.getDirectoryContents(dirPath).then(function(entries) {
            var files = {},
                fileNameWithoutExtension = self.removeExtension(fileName),
                extension = self.getFileExtension(fileName) || defaultExt,
                newName,
                number = 1;
            fileNameWithoutExtension = $mmText.removeSpecialCharactersForFiles(decodeURIComponent(fileNameWithoutExtension));
            angular.forEach(entries, function(entry) {
                files[entry.name] = entry;
            });
            if (extension) {
                extension = '.' + extension;
            } else {
                extension = '';
            }
            newName = fileNameWithoutExtension + extension;
            if (typeof files[newName] == 'undefined') {
                return newName;
            } else {
                do {
                    newName = fileNameWithoutExtension + '(' + number + ')' + extension;
                    number++;
                } while (typeof files[newName] != 'undefined');
                return newName;
            }
        }).catch(function() {
            return $mmText.removeSpecialCharactersForFiles(decodeURIComponent(fileName));
        });
    };
        self.clearTmpFolder = function() {
        return self.removeDir(mmFsTmpFolder);
    };
    return self;
}]);

angular.module('mm.core')
.factory('$mmGroups', ["$log", "$q", "$mmSite", "$mmSitesManager", function($log, $q, $mmSite, $mmSitesManager) {
    $log = $log.getInstance('$mmGroups');
    var self = {};
    self.NOGROUPS       = 0;
    self.SEPARATEGROUPS = 1;
    self.VISIBLEGROUPS  = 2;
        self.getActivityAllowedGroups = function(cmid, userid, siteId) {
        userid = userid || $mmSite.getUserId();
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var params = {
                    cmid: cmid,
                    userid: userid
                },
                preSets = {
                    cacheKey: getActivityAllowedGroupsCacheKey(cmid, userid)
                };
            return site.read('core_group_get_activity_allowed_groups', params, preSets).then(function(response) {
                if (!response || !response.groups) {
                    return $q.reject();
                }
                return response.groups;
            });
        });
    };
        function getActivityAllowedGroupsCacheKey(cmid, userid) {
        return 'mmGroups:allowedgroups:' + cmid + ':' + userid;
    }
        self.getActivityGroupMode = function(cmid, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var params = {
                    cmid: cmid
                },
                preSets = {
                    cacheKey: getActivityGroupModeCacheKey(cmid)
                };
            return site.read('core_group_get_activity_groupmode', params, preSets).then(function(response) {
                if (!response || typeof response.groupmode == 'undefined') {
                    return $q.reject();
                }
                return response.groupmode;
            });
        });
    };
        function getActivityGroupModeCacheKey(cmid) {
        return 'mmGroups:groupmode:' + cmid;
    }
        self.getUserGroups = function(courses, refresh, siteid, userid) {
        var promises = [],
            groups = [],
            deferred = $q.defer();
        angular.forEach(courses, function(course) {
            var courseid;
            if (typeof course == 'object') {
                courseid = course.id;
            } else {
                courseid = course;
            }
            var promise = self.getUserGroupsInCourse(courseid, refresh, siteid, userid).then(function(coursegroups) {
                groups = groups.concat(coursegroups);
            });
            promises.push(promise);
        });
        $q.all(promises).finally(function() {
            deferred.resolve(groups);
        });
        return deferred.promise;
    };
        self.getUserGroupsInCourse = function(courseid, refresh, siteid, userid) {
        siteid = siteid || $mmSite.getId();
        return $mmSitesManager.getSite(siteid).then(function(site) {
            var presets = {},
                data = {
                    userid: userid || site.getUserId(),
                    courseid: courseid
                };
            if (refresh) {
                presets.getFromCache = false;
            }
            return site.read('core_group_get_course_user_groups', data, presets).then(function(response) {
                if (response && response.groups) {
                    return response.groups;
                } else {
                    return $q.reject();
                }
            });
        });
    };
        self.invalidateActivityAllowedGroups = function(cmid, userid) {
        userid = userid || $mmSite.getUserId();
        return $mmSite.invalidateWsCacheForKey(getActivityAllowedGroupsCacheKey(cmid, userid));
    };
        self.invalidateActivityGroupMode = function(cmid) {
        return $mmSite.invalidateWsCacheForKey(getActivityGroupModeCacheKey(cmid));
    };
    return self;
}]);

angular.module('mm.core')
.constant('mmInitDelegateDefaultPriority', 100)
.constant('mmInitDelegateMaxAddonPriority', 599)
.provider('$mmInitDelegate', ["mmInitDelegateDefaultPriority", function(mmInitDelegateDefaultPriority) {
    var initProcesses = {},
        self = {};
        self.registerProcess = function(name, callable, priority, blocking) {
        priority = typeof priority === 'undefined' ? mmInitDelegateDefaultPriority : priority;
        if (typeof initProcesses[name] !== 'undefined') {
            console.log('$mmInitDelegateProvider: Process \'' + name + '\' already defined.');
            return;
        }
        console.log('$mmInitDelegateProvider: Registered process \'' + name + '\'.');
        initProcesses[name] = {
            blocking: blocking,
            callable: callable,
            name: name,
            priority: priority
        };
    };
    self.$get = ["$q", "$log", "$injector", "$mmUtil", function($q, $log, $injector, $mmUtil) {
        $log = $log.getInstance('$mmInitDelegate');
        var self = {},
            readiness;
                function prepareProcess(data) {
            return function() {
                var promise,
                    fn;
                $log.debug('Executing init process \'' + data.name + '\'');
                try {
                    fn = $mmUtil.resolveObject(data.callable);
                } catch (e) {
                    $log.error('Could not resolve object of init process \'' + data.name + '\'. ' + e);
                    return;
                }
                try {
                    promise = fn($injector);
                } catch (e) {
                    $log.error('Error while calling the init process \'' + data.name + '\'. ' + e);
                    return;
                }
                return promise;
            };
        }
                self.executeInitProcesses = function() {
            var ordered = [],
                promises = [],
                dependency = $q.when();
            if (typeof readiness === 'undefined') {
                readiness = $q.defer();
            }
            angular.forEach(initProcesses, function(data) {
                ordered.push(data);
            });
            ordered.sort(function(a, b) {
                return b.priority - a.priority;
            });
            angular.forEach(ordered, function(data) {
                var promise;
                promise = dependency.finally(prepareProcess(data));
                promises.push(promise);
                if (data.blocking) {
                    dependency = promise;
                }
            });
            $mmUtil.allPromises(promises).finally(readiness.resolve);
        };
                self.ready = function() {
            if (typeof readiness === 'undefined') {
                readiness = $q.defer();
            }
            return readiness.promise;
        };
        return self;
    }];
    return self;
}]);

angular.module('ionic').directive('ionRadioFix', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    transclude: true,
    template:
      '<label class="item item-radio">' +
        '<input type="radio" name="radio-group">' +
        '<div class="radio-content">' +
          '<div class="item-content disable-pointer-events" ng-transclude></div>' +
          '<i class="radio-icon disable-pointer-events icon ion-checkmark"></i>' +
        '</div>' +
      '</label>',
    compile: function(element, attr) {
      if (attr.icon) {
        var iconElm = element.find('i');
        iconElm.removeClass('ion-checkmark').addClass(attr.icon);
      }
      var input = element.find('input');
      angular.forEach({
          'name': attr.name,
          'value': attr.value,
          'disabled': attr.disabled,
          'ng-value': attr.ngValue,
          'ng-model': attr.ngModel,
          'ng-disabled': attr.ngDisabled,
          'ng-change': attr.ngChange,
          'ng-required': attr.ngRequired,
          'required': attr.required
      }, function(value, name) {
        if (angular.isDefined(value)) {
            input.attr(name, value);
          }
      });
      return function(scope, element, attr) {
        scope.getValue = function() {
          return scope.ngValue || attr.value;
        };
      };
    }
  };
});
angular.module('mm.core')
.factory('$mmLang', ["$translate", "$translatePartialLoader", "$mmConfig", "$cordovaGlobalization", "$q", "mmCoreConfigConstants", function($translate, $translatePartialLoader, $mmConfig, $cordovaGlobalization, $q, mmCoreConfigConstants) {
    var self = {},
        fallbackLanguage = 'en',
        currentLanguage;
        self.registerLanguageFolder = function(path) {
        $translatePartialLoader.addPart(path);
        var promises = [];
        promises.push($translate.refresh(currentLanguage));
        if (currentLanguage !== fallbackLanguage) {
            promises.push($translate.refresh(fallbackLanguage));
        }
        return $q.all(promises);
    };
        self.getCurrentLanguage = function() {
        if (typeof currentLanguage != 'undefined') {
            return $q.when(currentLanguage);
        }
        return $mmConfig.get('current_language').then(function(language) {
            return language;
        }, function() {
            try {
                return $cordovaGlobalization.getPreferredLanguage().then(function(result) {
                    var language = result.value.toLowerCase();
                    if (language.indexOf('-') > -1) {
                        if (mmCoreConfigConstants.languages && typeof mmCoreConfigConstants.languages[language] == 'undefined') {
                            language = language.substr(0, language.indexOf('-'));
                        }
                    }
                    return language;
                }, function() {
                    return mmCoreConfigConstants.default_lang || fallbackLanguage;
                });
            } catch(err) {
                return mmCoreConfigConstants.default_lang || fallbackLanguage;
            }
        }).then(function(language) {
            currentLanguage = language;
            return language;
        });
    };
        self.changeCurrentLanguage = function(language) {
        var p1 = $translate.use(language),
            p2 = $mmConfig.set('current_language', language);
        moment.locale(language);
        currentLanguage = language;
        return $q.all([p1, p2]);
    };
        self.translateAndReject = function(errorkey) {
        return $translate(errorkey).then(function(errorMessage) {
            return $q.reject(errorMessage);
        }, function() {
            return $q.reject(errorkey);
        });
    };
        self.translateAndRejectDeferred = function(deferred, errorkey) {
        $translate(errorkey).then(function(errorMessage) {
            deferred.reject(errorMessage);
        }, function() {
            deferred.reject(errorkey);
        });
    };
    return self;
}])
.config(["$translateProvider", "$translatePartialLoaderProvider", function($translateProvider, $translatePartialLoaderProvider) {
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '{part}/{lang}.json'
    });
    $translatePartialLoaderProvider.addPart('build/lang');
    $translateProvider.fallbackLanguage('en');
    $translateProvider.preferredLanguage('en');
}])
.run(["$ionicPlatform", "$translate", "$mmLang", function($ionicPlatform, $translate, $mmLang) {
    $ionicPlatform.ready(function() {
        $mmLang.getCurrentLanguage().then(function(language) {
            $translate.use(language);
            moment.locale(language);
        });
    });
}]);
angular.module('mm.core')
.constant('mmCoreNotificationsSitesStore', 'notification_sites')
.constant('mmCoreNotificationsComponentsStore', 'notification_components')
.constant('mmCoreNotificationsTriggeredStore', 'notifications_triggered')
.config(["$mmAppProvider", "mmCoreNotificationsSitesStore", "mmCoreNotificationsComponentsStore", "mmCoreNotificationsTriggeredStore", function($mmAppProvider, mmCoreNotificationsSitesStore, mmCoreNotificationsComponentsStore,
        mmCoreNotificationsTriggeredStore) {
    var stores = [
        {
            name: mmCoreNotificationsSitesStore,
            keyPath: 'id',
            indexes: [
                {
                    name: 'code',
                }
            ]
        },
        {
            name: mmCoreNotificationsComponentsStore,
            keyPath: 'id',
            indexes: [
                {
                    name: 'code',
                }
            ]
        },
        {
            name: mmCoreNotificationsTriggeredStore,
            keyPath: 'id',
            indexes: []
        }
    ];
    $mmAppProvider.registerStores(stores);
}])
.factory('$mmLocalNotifications', ["$log", "$cordovaLocalNotification", "$mmApp", "$q", "mmCoreNotificationsSitesStore", "mmCoreNotificationsComponentsStore", "mmCoreNotificationsTriggeredStore", function($log, $cordovaLocalNotification, $mmApp, $q,
        mmCoreNotificationsSitesStore, mmCoreNotificationsComponentsStore, mmCoreNotificationsTriggeredStore) {
    $log = $log.getInstance('$mmLocalNotifications');
    var self = {},
        observers = {},
        codes = {};
    var codeRequestsQueue = {};
        function getCode(store, id) {
        var db = $mmApp.getDB(),
            key = store + '#' + id;
        if (typeof codes[key] != 'undefined') {
            return $q.when(codes[key]);
        }
        return db.get(store, id).then(function(entry) {
            var code = parseInt(entry.code);
            codes[key] = code;
            return code;
        }, function() {
            return db.query(store, undefined, 'code', true).then(function(entries) {
                var newCode = 0;
                if (entries.length > 0) {
                    newCode = parseInt(entries[0].code) + 1;
                }
                return db.insert(store, {id: id, code: newCode}).then(function() {
                    codes[key] = newCode;
                    return newCode;
                });
            });
        });
    }
        function getSiteCode(siteid) {
        return requestCode(mmCoreNotificationsSitesStore, siteid);
    }
        function getComponentCode(component) {
        return requestCode(mmCoreNotificationsComponentsStore, component);
    }
        function getUniqueNotificationId(notificationid, component, siteid) {
        if (!siteid || !component) {
            return $q.reject();
        }
        return getSiteCode(siteid).then(function(sitecode) {
            return getComponentCode(component).then(function(componentcode) {
                return (sitecode * 100000000 + componentcode * 10000000 + parseInt(notificationid)) % 2147483647;
            });
        });
    }
        function processNextRequest() {
        var nextKey = Object.keys(codeRequestsQueue)[0],
            request,
            promise;
        if (typeof nextKey == 'undefined') {
            return;
        }
        request = codeRequestsQueue[nextKey];
        if (angular.isObject(request) && typeof request.store != 'undefined' && typeof request.id != 'undefined') {
            promise = getCode(request.store, request.id).then(function(code) {
                angular.forEach(request.promises, function(p) {
                    p.resolve(code);
                });
            }, function(error) {
                angular.forEach(request.promises, function(p) {
                    p.reject(error);
                });
            });
        } else {
            promise = $q.when();
        }
        promise.finally(function() {
            delete codeRequestsQueue[nextKey];
            processNextRequest();
        });
    }
        function requestCode(store, id) {
        var deferred = $q.defer(),
            key = store+'#'+id,
            isQueueEmpty = Object.keys(codeRequestsQueue).length == 0;
        if (typeof codeRequestsQueue[key] != 'undefined') {
            codeRequestsQueue[key].promises.push(deferred);
        } else {
            codeRequestsQueue[key] = {
                store: store,
                id: id,
                promises: [deferred]
            };
        }
        if (isQueueEmpty) {
            processNextRequest();
        }
        return deferred.promise;
    }
        self.cancel = function(id, component, siteid) {
        return getUniqueNotificationId(id, component, siteid).then(function(uniqueId) {
            return $cordovaLocalNotification.cancel(uniqueId);
        });
    };
        self.cancelSiteNotifications = function(siteid) {
        if (!self.isAvailable()) {
            return $q.when();
        } else if (!siteid) {
            return $q.reject();
        }
        return $cordovaLocalNotification.getAllScheduled().then(function(scheduled) {
            var ids = [];
            angular.forEach(scheduled, function(notif) {
                if (typeof notif.data == 'string') {
                    notif.data = JSON.parse(notif.data);
                }
                if (typeof notif.data == 'object' && notif.data.siteid === siteid) {
                    ids.push(notif.id);
                }
            });
            return $cordovaLocalNotification.cancel(ids);
        });
    };
        self.isAvailable = function() {
        return window.plugin && window.plugin.notification && window.plugin.notification.local ? true: false;
    };
        self.isTriggered = function(notification) {
        return $mmApp.getDB().get(mmCoreNotificationsTriggeredStore, notification.id).then(function(stored) {
            var notifTime = notification.at.getTime() / 1000;
            return stored.at === notifTime;
        }, function() {
            return false;
        });
    };
        self.notifyClick = function(data) {
        var component = data.component;
        if (component) {
            var callback = observers[component];
            if (typeof callback == 'function') {
                callback(data);
            }
        }
    };
        self.registerClick = function(component, callback) {
        $log.debug("Register observer '"+component+"' for notification click.");
        observers[component] = callback;
    };
        self.removeTriggered = function(id) {
        return $mmApp.getDB().remove(mmCoreNotificationsTriggeredStore, id);
    };
        self.schedule = function(notification, component, siteid) {
        return getUniqueNotificationId(notification.id, component, siteid).then(function(uniqueId) {
            notification.id = uniqueId;
            notification.data = notification.data || {};
            notification.data.component = component;
            notification.data.siteid = siteid;
            notification.icon = notification.icon || 'res://icon';
            notification.smallIcon = notification.smallIcon || 'res://icon';
            return self.isTriggered(notification).then(function(triggered) {
                if (!triggered) {
                    self.removeTriggered(notification.id);
                    return $cordovaLocalNotification.schedule(notification);
                }
            });
        });
    };
        self.trigger = function(notification) {
        var id = parseInt(notification.id);
        if (!isNaN(id)) {
            return $mmApp.getDB().insert(mmCoreNotificationsTriggeredStore, {
                id: id,
                at: parseInt(notification.at)
            });
        } else {
            return $q.reject();
        }
    };
    return self;
}])
.run(["$rootScope", "$log", "$mmLocalNotifications", "$mmEvents", "mmCoreEventSiteDeleted", function($rootScope, $log, $mmLocalNotifications, $mmEvents, mmCoreEventSiteDeleted) {
    $log = $log.getInstance('$mmLocalNotifications');
    $rootScope.$on('$cordovaLocalNotification:trigger', function(e, notification, state) {
        $mmLocalNotifications.trigger(notification);
    });
    $rootScope.$on('$cordovaLocalNotification:click', function(e, notification, state) {
        if (notification && notification.data) {
            $log.debug('Notification clicked: '+notification.data);
            var data = JSON.parse(notification.data);
            $mmLocalNotifications.notifyClick(data);
        }
    });
    $mmEvents.on(mmCoreEventSiteDeleted, function(site) {
        if (site) {
            $mmLocalNotifications.cancelSiteNotifications(site.id);
        }
    });
}]);

angular.module('mm.core')
.constant('mmCoreLogEnabledDefault', true)
.constant('mmCoreLogEnabledConfigName', 'debug_enabled')
.provider('$mmLog', ["mmCoreLogEnabledDefault", function(mmCoreLogEnabledDefault) {
    var isEnabled = mmCoreLogEnabledDefault,
        self = this;
    function prepareLogFn(logFn, className) {
        className = className || '';
        var enhancedLogFn = function() {
            if (isEnabled) {
                var args = Array.prototype.slice.call(arguments),
                    now  = moment().format('l LTS');
                args[0] = now + ' ' + className + ': ' + args[0];
                logFn.apply(null, args);
            }
        };
        enhancedLogFn.logs = [];
        return enhancedLogFn;
    }
        self.logDecorator = function($log) {
        var _$log = (function($log) {
            return {
                log   : $log.log,
                info  : $log.info,
                warn  : $log.warn,
                debug : $log.debug,
                error : $log.error
            };
        })($log);
        var getInstance = function(className) {
            return {
                log   : prepareLogFn(_$log.log, className),
                info  : prepareLogFn(_$log.info, className),
                warn  : prepareLogFn(_$log.warn, className),
                debug : prepareLogFn(_$log.debug, className),
                error : prepareLogFn(_$log.error, className)
            };
        };
        $log.log   = prepareLogFn($log.log);
        $log.info  = prepareLogFn($log.info);
        $log.warn  = prepareLogFn($log.warn);
        $log.debug = prepareLogFn($log.debug);
        $log.error = prepareLogFn($log.error);
        $log.getInstance = getInstance;
        return $log;
    };
    this.$get = ["$mmConfig", "mmCoreLogEnabledDefault", "mmCoreLogEnabledConfigName", function($mmConfig, mmCoreLogEnabledDefault, mmCoreLogEnabledConfigName) {
        var self = {};
                self.init = function() {
            $mmConfig.get(mmCoreLogEnabledConfigName).then(function(enabled) {
                isEnabled = enabled;
            }, function() {
                isEnabled = mmCoreLogEnabledDefault;
            });
        }
                self.enabled = function(flag) {
            $mmConfig.set(mmCoreLogEnabledConfigName, flag);
            isEnabled = flag;
        };
                self.isEnabled = function() {
            return isEnabled;
        };
        return self;
    }];
}])
.run(["$mmLog", function($mmLog) {
    $mmLog.init();
}]);

angular.module('mm.core')
.factory('$mmSite', ["$mmSitesManager", "$mmSitesFactory", function($mmSitesManager, $mmSitesFactory) {
    var self = {},
        siteMethods = $mmSitesFactory.getSiteMethods();
    angular.forEach(siteMethods, function(method) {
        self[method] = function() {
            var currentSite = $mmSitesManager.getCurrentSite();
            if (typeof currentSite == 'undefined') {
                return undefined;
            } else {
                return currentSite[method].apply(currentSite, arguments);
            }
        };
    });
        self.isLoggedIn = function() {
        var currentSite = $mmSitesManager.getCurrentSite();
        return typeof currentSite != 'undefined' && typeof currentSite.token != 'undefined' && currentSite.token != '';
    };
    return self;
}]);

angular.module('mm.core')
.value('mmCoreWSPrefix', 'local_mobile_')
.constant('mmCoreWSCacheStore', 'wscache')
.config(["$mmSitesFactoryProvider", "mmCoreWSCacheStore", function($mmSitesFactoryProvider, mmCoreWSCacheStore) {
    var stores = [
        {
            name: mmCoreWSCacheStore,
            keyPath: 'id',
            indexes: [
                {
                    name: 'key'
                }
            ]
        }
    ];
    $mmSitesFactoryProvider.registerStores(stores);
}])
.provider('$mmSitesFactory', function() {
        var siteSchema = {
            stores: []
        },
        dboptions = {
            autoSchema: true
        };
        this.registerStore = function(store) {
        if (typeof(store.name) === 'undefined') {
            console.log('$mmSite: Error: store name is undefined.');
            return;
        } else if (storeExists(store.name)) {
            console.log('$mmSite: Error: store ' + store.name + ' is already defined.');
            return;
        }
        siteSchema.stores.push(store);
    };
        this.registerStores = function(stores) {
        var self = this;
        angular.forEach(stores, function(store) {
            self.registerStore(store);
        });
    };
        function storeExists(name) {
        var exists = false;
        angular.forEach(siteSchema.stores, function(store) {
            if (store.name === name) {
                exists = true;
            }
        });
        return exists;
    }
    this.$get = ["$http", "$q", "$mmWS", "$mmDB", "$log", "md5", "$mmApp", "$mmLang", "$mmUtil", "$mmFS", "mmCoreWSCacheStore", "mmCoreWSPrefix", "mmCoreSessionExpired", "$mmEvents", "mmCoreEventSessionExpired", "mmCoreUserDeleted", "mmCoreEventUserDeleted", "$mmText", "$translate", "mmCoreConfigConstants", function($http, $q, $mmWS, $mmDB, $log, md5, $mmApp, $mmLang, $mmUtil, $mmFS, mmCoreWSCacheStore,
            mmCoreWSPrefix, mmCoreSessionExpired, $mmEvents, mmCoreEventSessionExpired, mmCoreUserDeleted, mmCoreEventUserDeleted,
            $mmText, $translate, mmCoreConfigConstants) {
        $log = $log.getInstance('$mmSite');
                var deprecatedFunctions = {
            "core_grade_get_definitions": "core_grading_get_definitions",
            "moodle_course_create_courses": "core_course_create_courses",
            "moodle_course_get_courses": "core_course_get_courses",
            "moodle_enrol_get_users_courses": "core_enrol_get_users_courses",
            "moodle_file_get_files": "core_files_get_files",
            "moodle_file_upload": "core_files_upload",
            "moodle_group_add_groupmembers": "core_group_add_group_members",
            "moodle_group_create_groups": "core_group_create_groups",
            "moodle_group_delete_groupmembers": "core_group_delete_group_members",
            "moodle_group_delete_groups": "core_group_delete_groups",
            "moodle_group_get_course_groups": "core_group_get_course_groups",
            "moodle_group_get_groupmembers": "core_group_get_group_members",
            "moodle_group_get_groups": "core_group_get_groups",
            "moodle_message_send_instantmessages": "core_message_send_instant_messages",
            "moodle_notes_create_notes": "core_notes_create_notes",
            "moodle_role_assign": "core_role_assign_role",
            "moodle_role_unassign": "core_role_unassign_role",
            "moodle_user_create_users": "core_user_create_users",
            "moodle_user_delete_users": "core_user_delete_users",
            "moodle_user_get_course_participants_by_id": "core_user_get_course_user_profiles",
            "moodle_user_get_users_by_courseid": "core_enrol_get_enrolled_users",
            "moodle_user_get_users_by_id": "core_user_get_users_by_id",
            "moodle_user_update_users": "core_user_update_users",
            "moodle_webservice_get_siteinfo": "core_webservice_get_site_info",
        };
        var self = {};
                function Site(id, siteurl, token, infos) {
            this.id = id;
            this.siteurl = siteurl;
            this.token = token;
            this.infos = infos;
            if (this.id) {
                this.db = $mmDB.getDB('Site-' + this.id, siteSchema, dboptions);
            }
        }
                Site.prototype.getId = function() {
            return this.id;
        };
                Site.prototype.getURL = function() {
            return this.siteurl;
        };
                Site.prototype.getToken = function() {
            return this.token;
        };
                Site.prototype.getInfo = function() {
            return this.infos;
        };
                Site.prototype.getDb = function() {
            return this.db;
        };
                Site.prototype.getUserId = function() {
            if (typeof this.infos != 'undefined' && typeof this.infos.userid != 'undefined') {
                return this.infos.userid;
            } else {
                return undefined;
            }
        };
                Site.prototype.setId = function(id) {
            this.id = id;
            this.db = $mmDB.getDB('Site-' + this.id, siteSchema, dboptions);
        };
                Site.prototype.setToken = function(token) {
            this.token = token;
        };
                Site.prototype.setInfo = function(infos) {
            this.infos = infos;
        };
                Site.prototype.canAccessMyFiles = function() {
            var infos = this.getInfo();
            return infos && (typeof infos.usercanmanageownfiles === 'undefined' || infos.usercanmanageownfiles);
        };
                Site.prototype.canDownloadFiles = function() {
            var infos = this.getInfo();
            return infos && infos.downloadfiles;
        };
                Site.prototype.canUseAdvancedFeature = function(feature, whenUndefined) {
            var infos = this.getInfo(),
                canUse = true;
            whenUndefined = (typeof whenUndefined === 'undefined') ? true : whenUndefined;
            if (typeof infos.advancedfeatures === 'undefined') {
                canUse = whenUndefined;
            } else {
                angular.forEach(infos.advancedfeatures, function(item) {
                    if (item.name === feature && parseInt(item.value, 10) === 0) {
                        canUse = false;
                    }
                });
            }
            return canUse;
        };
                Site.prototype.canUploadFiles = function() {
            var infos = this.getInfo();
            return infos && infos.uploadfiles;
        };
                Site.prototype.fetchSiteInfo = function() {
            var deferred = $q.defer(),
                site = this;
            var preSets = {
                getFromCache: 0,
                saveToCache: 0
            };
            site.read('core_webservice_get_site_info', {}, preSets).then(deferred.resolve, function(error) {
                site.read('moodle_webservice_get_siteinfo', {}, preSets).then(deferred.resolve, function(error) {
                    deferred.reject(error);
                });
            });
            return deferred.promise;
        };
                Site.prototype.read = function(method, data, preSets) {
            preSets = preSets || {};
            if (typeof(preSets.getFromCache) === 'undefined') {
                preSets.getFromCache = 1;
            }
            if (typeof(preSets.saveToCache) === 'undefined') {
                preSets.saveToCache = 1;
            }
            if (typeof(preSets.sync) === 'undefined') {
                preSets.sync = 0;
            }
            return this.request(method, data, preSets);
        };
                Site.prototype.write = function(method, data, preSets) {
            preSets = preSets || {};
            if (typeof(preSets.getFromCache) === 'undefined') {
                preSets.getFromCache = 0;
            }
            if (typeof(preSets.saveToCache) === 'undefined') {
                preSets.saveToCache = 0;
            }
            if (typeof(preSets.sync) === 'undefined') {
                preSets.sync = 0;
            }
            return this.request(method, data, preSets);
        };
                Site.prototype.request = function(method, data, preSets, retrying) {
            var site = this,
                initialToken = site.token;
            data = data || {};
            method = site.getCompatibleFunction(method);
            if (site.getInfo() && !site.wsAvailable(method, false)) {
                if (site.wsAvailable(mmCoreWSPrefix + method, false)) {
                    $log.info("Using compatibility WS method '" + mmCoreWSPrefix + method + "'");
                    method = mmCoreWSPrefix + method;
                } else {
                    $log.error("WS function '" + method + "' is not available, even in compatibility mode.");
                    return $mmLang.translateAndReject('mm.core.wsfunctionnotavailable');
                }
            }
            preSets = angular.copy(preSets) || {};
            preSets.wstoken = site.token;
            preSets.siteurl = site.siteurl;
            data.moodlewssettingfilter = preSets.filter === false ? false : true;
            return getFromCache(site, method, data, preSets).catch(function() {
                var wsPreSets = angular.copy(preSets);
                delete wsPreSets.getFromCache;
                delete wsPreSets.saveToCache;
                delete wsPreSets.omitExpires;
                delete wsPreSets.cacheKey;
                delete wsPreSets.emergencyCache;
                delete wsPreSets.getCacheUsingCacheKey;
                return $mmWS.call(method, data, wsPreSets).then(function(response) {
                    if (preSets.saveToCache) {
                        saveToCache(site, method, data, response, preSets.cacheKey);
                    }
                    return angular.copy(response);
                }).catch(function(error) {
                    if (error === mmCoreSessionExpired) {
                        if (initialToken !== site.token && !retrying) {
                            return site.request(method, data, preSets, true);
                        } else if ($mmApp.isSSOAuthenticationOngoing()) {
                            return $mmApp.waitForSSOAuthentication().then(function() {
                                return site.request(method, data, preSets, true);
                            });
                        }
                        $mmEvents.trigger(mmCoreEventSessionExpired, site.id);
                        error = $translate.instant('mm.core.lostconnection');
                    } else if (error === mmCoreUserDeleted) {
                        $mmEvents.trigger(mmCoreEventUserDeleted, {siteid: site.id, params: data});
                        return $mmLang.translateAndReject('mm.core.userdeleted');
                    } else if (typeof preSets.emergencyCache !== 'undefined' && !preSets.emergencyCache) {
                        $log.debug('WS call ' + method + ' failed. Emergency cache is forbidden, rejecting.');
                        return $q.reject(error);
                    }
                    $log.debug('WS call ' + method + ' failed. Trying to use the emergency cache.');
                    preSets.omitExpires = true;
                    preSets.getFromCache = true;
                    return getFromCache(site, method, data, preSets).catch(function() {
                        return $q.reject(error);
                    });
                });
            });
        };
                Site.prototype.wsAvailable = function(method, checkPrefix) {
            checkPrefix = (typeof checkPrefix === 'undefined') ? true : checkPrefix;
            if (typeof this.infos == 'undefined') {
                return false;
            }
            for (var i = 0; i < this.infos.functions.length; i++) {
                var f = this.infos.functions[i];
                if (f.name == method) {
                    return true;
                }
            }
            if (checkPrefix) {
                return this.wsAvailable(mmCoreWSPrefix + method, false);
            }
            return false;
        };
                Site.prototype.uploadFile = function(uri, options) {
            if (!options.fileArea) {
                if (parseInt(this.infos.version, 10) >= 2016052300) {
                    options.fileArea = 'draft';
                } else {
                    options.fileArea = 'private';
                }
            }
            return $mmWS.uploadFile(uri, options, {
                siteurl: this.siteurl,
                token: this.token
            });
        };
                Site.prototype.invalidateWsCache = function() {
            var db = this.db;
            if (!db) {
                return $q.reject();
            }
            $log.debug('Invalidate all the cache for site: '+ this.id);
            return db.getAll(mmCoreWSCacheStore).then(function(entries) {
                if (entries && entries.length > 0) {
                    return invalidateWsCacheEntries(db, entries);
                }
            });
        };
                Site.prototype.invalidateWsCacheForKey = function(key) {
            var db = this.db;
            if (!db || !key) {
                return $q.reject();
            }
            $log.debug('Invalidate cache for key: '+key);
            return db.whereEqual(mmCoreWSCacheStore, 'key', key).then(function(entries) {
                if (entries && entries.length > 0) {
                    return invalidateWsCacheEntries(db, entries);
                }
            });
        };
                Site.prototype.invalidateWsCacheForKeyStartingWith = function(key) {
            var db = this.db;
            if (!db || !key) {
                return $q.reject();
            }
            $log.debug('Invalidate cache for key starting with: '+key);
            return db.where(mmCoreWSCacheStore, 'key', '^', key).then(function(entries) {
                if (entries && entries.length > 0) {
                    return invalidateWsCacheEntries(db, entries);
                }
            });
        };
                Site.prototype.fixPluginfileURL = function(url) {
            return $mmUtil.fixPluginfileURL(url, this.token);
        };
                Site.prototype.deleteDB = function() {
            return $mmDB.deleteDB('Site-' + this.id);
        };
                Site.prototype.deleteFolder = function() {
            if ($mmFS.isAvailable()) {
                var siteFolder = $mmFS.getSiteFolder(this.id);
                return $mmFS.removeDir(siteFolder).catch(function() {
                });
            } else {
                return $q.when();
            }
        };
                Site.prototype.getSpaceUsage = function() {
            if ($mmFS.isAvailable()) {
                var siteFolderPath = $mmFS.getSiteFolder(this.id);
                return $mmFS.getDirectorySize(siteFolderPath).catch(function() {
                    return 0;
                });
            } else {
                return $q.when(0);
            }
        };
                Site.prototype.getDocsUrl = function(page) {
            var release = this.infos.release ? this.infos.release : undefined;
            return $mmUtil.getDocsUrl(release, page);
        };
                Site.prototype.checkLocalMobilePlugin = function(retrying) {
            var siteurl = this.siteurl,
                self = this,
                service = mmCoreConfigConstants.wsextservice;
            if (!service) {
                return $q.when({code: 0});
            }
            return $http.post(siteurl + '/local/mobile/check.php', {service: service}).then(function(response) {
                var data = response.data;
                if (typeof data != 'undefined' && data.errorcode === 'requirecorrectaccess') {
                    if (!retrying) {
                        self.siteurl = $mmText.addOrRemoveWWW(siteurl);
                        return self.checkLocalMobilePlugin(true);
                    } else {
                        return $q.reject(data.error);
                    }
                } else if (typeof data == 'undefined' || typeof data.code == 'undefined') {
                    return {code: 0, warning: 'mm.login.localmobileunexpectedresponse'};
                }
                var code = parseInt(data.code, 10);
                if (data.error) {
                    switch (code) {
                        case 1:
                            return $mmLang.translateAndReject('mm.login.siteinmaintenance');
                        case 2:
                            return $mmLang.translateAndReject('mm.login.webservicesnotenabled');
                        case 3:
                            return {code: 0};
                        case 4:
                            return $mmLang.translateAndReject('mm.login.mobileservicesnotenabled');
                        default:
                            return $mmLang.translateAndReject('mm.core.unexpectederror');
                    }
                } else {
                    return {code: code, service: service};
                }
            }, function() {
                return {code: 0};
            });
        };
                Site.prototype.checkIfAppUsesLocalMobile = function() {
            var appUsesLocalMobile = false;
            angular.forEach(this.infos.functions, function(func) {
                if (func.name.indexOf(mmCoreWSPrefix) != -1) {
                    appUsesLocalMobile = true;
                }
            });
            return appUsesLocalMobile;
        };
                Site.prototype.checkIfLocalMobileInstalledAndNotUsed = function() {
            var appUsesLocalMobile = this.checkIfAppUsesLocalMobile();
            if (appUsesLocalMobile) {
                return $q.reject();
            }
            return this.checkLocalMobilePlugin().then(function(data) {
                if (typeof data.service == 'undefined') {
                    return $q.reject();
                }
                return data;
            });
        };
                Site.prototype.containsUrl = function(url) {
            if (!url) {
                return false;
            }
            var siteurl = $mmText.removeProtocolAndWWW(this.siteurl);
            url = $mmText.removeProtocolAndWWW(url);
            return url.indexOf(siteurl) == 0;
        };
                function invalidateWsCacheEntries(db, entries) {
            var promises = [];
            angular.forEach(entries, function(entry) {
                entry.expirationtime = 0;
                var promise = db.insert(mmCoreWSCacheStore, entry);
                promises.push(promise);
            });
            return $q.all(promises);
        }
                Site.prototype.getCompatibleFunction = function(method) {
            if (typeof deprecatedFunctions[method] !== "undefined") {
                if (this.wsAvailable(deprecatedFunctions[method])) {
                    $log.warn("You are using deprecated Web Services: " + method +
                        " you must replace it with the newer function: " + deprecatedFunctions[method]);
                    return deprecatedFunctions[method];
                } else {
                    $log.warn("You are using deprecated Web Services. " +
                        "Your remote site seems to be outdated, consider upgrade it to the latest Moodle version.");
                }
            } else if (!this.wsAvailable(method)) {
                for (var oldFunc in deprecatedFunctions) {
                    if (deprecatedFunctions[oldFunc] === method && this.wsAvailable(oldFunc)) {
                        $log.warn("Your remote site doesn't support the function " + method +
                            ", it seems to be outdated, consider upgrade it to the latest Moodle version.");
                        return oldFunc;
                    }
                }
            }
            return method;
        };
                function getFromCache(site, method, data, preSets) {
            var result,
                db = site.db,
                deferred = $q.defer(),
                id,
                promise;
            if (!db) {
                deferred.reject();
                return deferred.promise;
            } else if (!preSets.getFromCache) {
                deferred.reject();
                return deferred.promise;
            }
            id = md5.createHash(method + ':' + JSON.stringify(data));
            if (preSets.getCacheUsingCacheKey) {
                promise = db.whereEqual(mmCoreWSCacheStore, 'key', preSets.cacheKey).then(function(entries) {
                    if (entries.length == 0) {
                        return db.get(mmCoreWSCacheStore, id);
                    }
                    return entries[0];
                });
            } else {
                promise = db.get(mmCoreWSCacheStore, id);
            }
            promise.then(function(entry) {
                var now = new Date().getTime();
                preSets.omitExpires = preSets.omitExpires || !$mmApp.isOnline();
                if (!preSets.omitExpires) {
                    if (now > entry.expirationtime) {
                        $log.debug('Cached element found, but it is expired');
                        deferred.reject();
                        return;
                    }
                }
                if (typeof entry != 'undefined' && typeof entry.data != 'undefined') {
                    var expires = (entry.expirationtime - now) / 1000;
                    $log.info('Cached element found, id: ' + id + ' expires in ' + expires + ' seconds');
                    deferred.resolve(entry.data);
                    return;
                }
                deferred.reject();
            }, function() {
                deferred.reject();
            });
            return deferred.promise;
        }
                function saveToCache(site, method, data, response, cacheKey) {
            var db = site.db,
                id = md5.createHash(method + ':' + JSON.stringify(data)),
                cacheExpirationTime = mmCoreConfigConstants.cache_expiration_time,
                entry = {
                        id: id,
                        data: response
                    };
            if (!db) {
                return $q.reject();
            } else {
                cacheExpirationTime = isNaN(cacheExpirationTime) ? 300000 : cacheExpirationTime;
                entry.expirationtime = new Date().getTime() + cacheExpirationTime;
                if (cacheKey) {
                    entry.key = cacheKey;
                }
                return db.insert(mmCoreWSCacheStore, entry);
            }
        }
                self.makeSite = function(id, siteurl, token, infos) {
            return new Site(id, siteurl, token, infos);
        };
                self.getSiteMethods = function() {
            var methods = [];
            for (var name in Site.prototype) {
                methods.push(name);
            }
            return methods;
        };
        return self;
    }];
});

angular.module('mm.core')
.constant('mmCoreSitesStore', 'sites')
.constant('mmCoreCurrentSiteStore', 'current_site')
.config(["$mmAppProvider", "mmCoreSitesStore", "mmCoreCurrentSiteStore", function($mmAppProvider, mmCoreSitesStore, mmCoreCurrentSiteStore) {
    var stores = [
        {
            name: mmCoreSitesStore,
            keyPath: 'id'
        },
        {
            name: mmCoreCurrentSiteStore,
            keyPath: 'id'
        }
    ];
    $mmAppProvider.registerStores(stores);
}])
.factory('$mmSitesManager', ["$http", "$q", "$mmSitesFactory", "md5", "$mmLang", "$mmApp", "$mmUtil", "$mmEvents", "$state", "$translate", "mmCoreSitesStore", "mmCoreCurrentSiteStore", "mmCoreEventLogin", "mmCoreEventLogout", "$log", "mmCoreWSPrefix", "mmCoreEventSiteUpdated", "mmCoreEventSiteAdded", "mmCoreEventSessionExpired", "mmCoreEventSiteDeleted", "$mmText", "mmCoreConfigConstants", function($http, $q, $mmSitesFactory, md5, $mmLang, $mmApp, $mmUtil, $mmEvents, $state,
            $translate, mmCoreSitesStore, mmCoreCurrentSiteStore, mmCoreEventLogin, mmCoreEventLogout, $log, mmCoreWSPrefix,
            mmCoreEventSiteUpdated, mmCoreEventSiteAdded, mmCoreEventSessionExpired, mmCoreEventSiteDeleted, $mmText,
            mmCoreConfigConstants) {
    $log = $log.getInstance('$mmSitesManager');
    var self = {},
        services = {},
        sessionRestored = false,
        currentSite,
        sites = {};
        self.getDemoSiteData = function(siteurl) {
        var demoSites = mmCoreConfigConstants.demo_sites;
        if (typeof demoSites != 'undefined' && typeof demoSites[siteurl] != 'undefined') {
            return demoSites[siteurl];
        }
    };
        self.checkSite = function(siteurl, protocol) {
        siteurl = $mmUtil.formatURL(siteurl);
        if (!$mmUtil.isValidURL(siteurl)) {
            return $mmLang.translateAndReject('mm.login.invalidsite');
        } else if (!$mmApp.isOnline()) {
            return $mmLang.translateAndReject('mm.core.networkerrormsg');
        } else {
            protocol = protocol || "https://";
            siteurl = siteurl.replace(/^http(s)?\:\/\//i, protocol);
            return self.siteExists(siteurl).catch(function() {
                var treatedUrl = $mmText.addOrRemoveWWW(siteurl);
                return self.siteExists(treatedUrl).then(function() {
                    siteurl = treatedUrl;
                });
            }).then(function() {
                var temporarySite = $mmSitesFactory.makeSite(undefined, siteurl);
                return temporarySite.checkLocalMobilePlugin().then(function(data) {
                    siteurl = temporarySite.getURL();
                    services[siteurl] = data.service;
                    return {siteurl: siteurl, code: data.code, warning: data.warning};
                });
            }, function() {
                if (siteurl.indexOf("https://") === 0) {
                    return self.checkSite(siteurl, "http://");
                } else{
                    return $mmLang.translateAndReject('mm.core.cannotconnect');
                }
            });
        }
    };
        self.siteExists = function(siteurl) {
        var url = siteurl + '/login/token.php';
        if (!ionic.Platform.isWebView()) {
            url = url + '?username=a&password=b&service=c';
        }
        return $http.get(url, {timeout: 30000});
    };
        self.getUserToken = function(siteurl, username, password, service, retry) {
        retry = retry || false;
        if (!$mmApp.isOnline()) {
            return $mmLang.translateAndReject('mm.core.networkerrormsg');
        }
        if (!service) {
            service = determineService(siteurl);
        }
        var loginurl = siteurl + '/login/token.php';
        var data = {
            username: username,
            password: password,
            service: service
        };
        return $http.post(loginurl, data).then(function(response) {
            var data = response.data;
            if (typeof data == 'undefined') {
                return $mmLang.translateAndReject('mm.core.cannotconnect');
            } else {
                if (typeof data.token != 'undefined') {
                    return {token: data.token, siteurl: siteurl};
                } else {
                    if (typeof data.error != 'undefined') {
                        if (!retry && data.errorcode == "requirecorrectaccess") {
                            siteurl = $mmText.addOrRemoveWWW(siteurl);
                            return self.getUserToken(siteurl, username, password, service, true);
                        } else {
                            return $q.reject(data.error);
                        }
                    } else {
                        return $mmLang.translateAndReject('mm.login.invalidaccount');
                    }
                }
            }
        }, function() {
            return $mmLang.translateAndReject('mm.core.cannotconnect');
        });
    };
        self.newSite = function(siteurl, token) {
        var candidateSite = $mmSitesFactory.makeSite(undefined, siteurl, token);
        return candidateSite.fetchSiteInfo().then(function(infos) {
            if (isValidMoodleVersion(infos)) {
                var validation = validateSiteInfo(infos);
                if (validation === true) {
                    var siteid = self.createSiteID(infos.siteurl, infos.username);
                    self.addSite(siteid, siteurl, token, infos);
                    candidateSite.setId(siteid);
                    candidateSite.setInfo(infos);
                    currentSite = candidateSite;
                    self.login(siteid);
                    $mmEvents.trigger(mmCoreEventSiteAdded, siteid);
                } else {
                    return $translate(validation.error, validation.params).then(function(error) {
                        return $q.reject(error);
                    });
                }
            } else {
                return $mmLang.translateAndReject('mm.login.invalidmoodleversion');
            }
        });
    };
        self.createSiteID = function(siteurl, username) {
        return md5.createHash(siteurl + username);
    };
        function determineService(siteurl) {
        siteurl = siteurl.replace("https://", "http://");
        if (services[siteurl]) {
            return services[siteurl];
        }
        siteurl = siteurl.replace("http://", "https://");
        if (services[siteurl]) {
            return services[siteurl];
        }
        return mmCoreConfigConstants.wsservice;
    }
        function isValidMoodleVersion(infos) {
        if (!infos) {
            return false;
        }
        var minVersion = 2012120300,
            minRelease = "2.4";
        if (infos.version) {
            var version = parseInt(infos.version);
            if (!isNaN(version)) {
                return version >= minVersion;
            }
        }
        if (infos.release) {
            var matches = infos.release.match(/^([\d|\.]*)/);
            if (matches && matches.length > 1) {
                return matches[1] >= minRelease;
            }
        }
        var appUsesLocalMobile = false;
        angular.forEach(infos.functions, function(func) {
            if (func.name.indexOf(mmCoreWSPrefix) != -1) {
                appUsesLocalMobile = true;
            }
        });
        return appUsesLocalMobile;
    }
        function validateSiteInfo(infos) {
        if (!infos.firstname || !infos.lastname) {
            var moodleLink = '<a mm-link href="' + infos.siteurl + '">' + infos.siteurl + '</a>';
            return {error: 'mm.core.requireduserdatamissing', params: {'$a': moodleLink}};
        }
        return true;
    }
        self.addSite = function(id, siteurl, token, infos) {
        return $mmApp.getDB().insert(mmCoreSitesStore, {
            id: id,
            siteurl: siteurl,
            token: token,
            infos: infos
        });
    };
        self.loadSite = function(siteid) {
        $log.debug('Load site '+siteid);
        return self.getSite(siteid).then(function(site) {
            currentSite = site;
            self.login(siteid);
            return site.checkIfLocalMobileInstalledAndNotUsed().then(function() {
                $mmEvents.trigger(mmCoreEventSessionExpired, siteid);
            }, function() {
                self.updateSiteInfo(siteid).finally(function() {
                    var infos = site.getInfo(),
                        validation = validateSiteInfo(infos);
                    if (validation !== true) {
                        self.logout();
                        $state.go('mm_login.sites');
                        $translate(validation.error, validation.params).then(function(error) {
                            $mmUtil.showErrorModal(error);
                        });
                    }
                });
            });
        });
    };
        self.getCurrentSite = function() {
        return currentSite;
    };
        self.deleteSite = function(siteid) {
        $log.debug('Delete site '+siteid);
        if (typeof currentSite != 'undefined' && currentSite.id == siteid) {
            self.logout();
        }
        return self.getSite(siteid).then(function(site) {
            return site.deleteDB().then(function() {
                delete sites[siteid];
                return $mmApp.getDB().remove(mmCoreSitesStore, siteid).then(function() {
                    return site.deleteFolder();
                }, function() {
                    return site.deleteFolder();
                }).then(function() {
                    $mmEvents.trigger(mmCoreEventSiteDeleted, site);
                });
            });
        });
    };
        self.hasNoSites = function() {
        return $mmApp.getDB().count(mmCoreSitesStore).then(function(count) {
            if (count > 0) {
                return $q.reject();
            }
        });
    };
        self.hasSites = function() {
        return $mmApp.getDB().count(mmCoreSitesStore).then(function(count) {
            if (count == 0) {
                return $q.reject();
            }
        });
    };
        self.getSite = function(siteId) {
        if (!siteId) {
            return $q.reject();
        } else if (currentSite && currentSite.getId() === siteId) {
            return $q.when(currentSite);
        } else if (typeof sites[siteId] != 'undefined') {
            return $q.when(sites[siteId]);
        } else {
            return $mmApp.getDB().get(mmCoreSitesStore, siteId).then(function(data) {
                var site = $mmSitesFactory.makeSite(siteId, data.siteurl, data.token, data.infos);
                sites[siteId] = site;
                return site;
            });
        }
    };
        self.getSiteDb = function(siteId) {
        return self.getSite(siteId).then(function(site) {
            return site.getDb();
        });
    };
        self.getSites = function(ids) {
        return $mmApp.getDB().getAll(mmCoreSitesStore).then(function(sites) {
            var formattedSites = [];
            angular.forEach(sites, function(site) {
                if (!ids || ids.indexOf(site.id) > -1) {
                    formattedSites.push({
                        id: site.id,
                        siteurl: site.siteurl,
                        fullname: site.infos.fullname,
                        sitename: site.infos.sitename,
                        avatar: site.infos.userpictureurl
                    });
                }
            });
            return formattedSites;
        });
    };
        self.getSitesIds = function() {
        return $mmApp.getDB().getAll(mmCoreSitesStore).then(function(sites) {
            var ids = [];
            angular.forEach(sites, function(site) {
                ids.push(site.id);
            });
            return ids;
        });
    };
        self.login = function(siteid) {
        return $mmApp.getDB().insert(mmCoreCurrentSiteStore, {
            id: 1,
            siteid: siteid
        }).then(function() {
            $mmEvents.trigger(mmCoreEventLogin);
        });
    };
        self.logout = function() {
        currentSite = undefined;
        return $mmApp.getDB().remove(mmCoreCurrentSiteStore, 1).finally(function() {
            $mmEvents.trigger(mmCoreEventLogout);
        });
    };
        self.restoreSession = function() {
        if (sessionRestored) {
            return $q.reject();
        }
        sessionRestored = true;
        return $mmApp.getDB().get(mmCoreCurrentSiteStore, 1).then(function(current_site) {
            var siteid = current_site.siteid;
            $log.debug('Restore session in site '+siteid);
            return self.loadSite(siteid);
        }, function() {
            return $q.reject();
        });
    };
        self.updateSiteToken = function(siteurl, username, token) {
        var siteid = self.createSiteID(siteurl, username);
        return self.getSite(siteid).then(function(site) {
            site.token = token;
            return $mmApp.getDB().insert(mmCoreSitesStore, {
                id: siteid,
                siteurl: site.getURL(),
                token: token,
                infos: site.getInfo()
            });
        });
    };
        self.updateSiteInfo = function(siteid) {
        return self.getSite(siteid).then(function(site) {
            return site.fetchSiteInfo().then(function(infos) {
                site.setInfo(infos);
                return $mmApp.getDB().insert(mmCoreSitesStore, {
                    id: siteid,
                    siteurl: site.getURL(),
                    token: site.getToken(),
                    infos: infos
                }).finally(function() {
                    $mmEvents.trigger(mmCoreEventSiteUpdated, siteid);
                });
            });
        });
    };
        self.updateSiteInfoByUrl = function(siteurl, username) {
        var siteid = self.createSiteID(siteurl, username);
        return self.updateSiteInfo(siteid);
    };
        self.getSiteIdsFromUrl = function(url, prioritize, username) {
        if (prioritize && currentSite && currentSite.containsUrl(url)) {
            if (!username || currentSite.getInfo().username == username) {
                return $q.when([currentSite.getId()]);
            }
        }
        if (!url.match(/^https?:\/\//i)) {
            if (url.match(/^[^:]{2,10}:\/\//i)) {
                return $q.when([]);
            } else {
                if (currentSite) {
                    return $q.when([currentSite.getId()]);
                } else {
                    return $q.when([]);
                }
            }
        }
        return $mmApp.getDB().getAll(mmCoreSitesStore).then(function(sites) {
            var ids = [];
            angular.forEach(sites, function(site) {
                if (!sites[site.id]) {
                    sites[site.id] = $mmSitesFactory.makeSite(site.id, site.siteurl, site.token, site.infos);
                }
                if (sites[site.id].containsUrl(url)) {
                    if (!username || sites[site.id].getInfo().username == username) {
                        ids.push(site.id);
                    }
                }
            });
            return ids;
        }).catch(function() {
            return [];
        });
    };
        self.getStoredCurrentSiteId = function() {
        return $mmApp.getDB().get(mmCoreCurrentSiteStore, 1).then(function(current_site) {
            return current_site.siteid;
        });
    };
    return self;
}]);

angular.module('mm.core')
.factory('$mmText', ["$q", "$mmLang", "$translate", "$state", function($q, $mmLang, $translate, $state) {
    var self = {},
        extensionRegex = new RegExp('^[a-z0-9]+$'),
        element = document.createElement('div');
        self.buildMessage = function(messages) {
        var result = '';
        angular.forEach(messages, function(message) {
            if (message) {
                result = result + '<p>' + message + '</p>';
            }
        });
        return result;
    };
        self.bytesToSize = function(bytes, precision) {
        if (typeof bytes == 'undefined' || bytes < 0) {
            return $translate.instant('mm.core.notapplicable');
        }
        if (typeof precision == 'undefined' || precision < 0) {
            precision = 2;
        }
        var keys = ['mm.core.sizeb', 'mm.core.sizekb', 'mm.core.sizemb', 'mm.core.sizegb', 'mm.core.sizetb'];
        var units = $translate.instant(keys);
        var posttxt = 0;
        if (bytes >= 1024) {
            while (bytes >= 1024) {
                posttxt++;
                bytes = bytes / 1024;
            }
            bytes = Number(Math.round(bytes+'e+'+precision) + 'e-'+precision);
        }
        return $translate.instant('mm.core.humanreadablesize', {size: Number(bytes), unit: units[keys[posttxt]]});
    };
        self.cleanTags = function(text, singleLine) {
        text = text.replace(/(<([^>]+)>)/ig,"");
        text = angular.element('<p>').html(text).text();
        text = self.replaceNewLines(text, singleLine ? ' ' : '<br />');
        return text;
    };
        self.replaceNewLines = function(text, newValue) {
        return text.replace(/(?:\r\n|\r|\n)/g, newValue);
    };
        self.formatText = function(text, clean, singleLine, shortenLength) {
        return self.treatMultilangTags(text).then(function(formatted) {
            if (clean) {
                formatted = self.cleanTags(formatted, singleLine);
            }
            if (shortenLength && parseInt(shortenLength) > 0) {
                formatted = self.shortenText(formatted, parseInt(shortenLength));
            }
            return formatted;
        });
    };
        self.shortenText = function(text, length) {
        if (text.length > length) {
            text = text.substr(0, length);
            var lastWordPos = text.lastIndexOf(' ');
            if (lastWordPos > 0) {
                text = text.substr(0, lastWordPos);
            }
            text += '&hellip;';
        }
        return text;
    };
        self.expandText = function(title, text, replaceLineBreaks) {
        if (text.length > 0) {
            $state.go('site.mm_textviewer', {
                title: title,
                content: text,
                replacelinebreaks: replaceLineBreaks
            });
        }
    };
        self.treatMultilangTags = function(text) {
        if (!text) {
            return $q.when('');
        }
        return $mmLang.getCurrentLanguage().then(function(language) {
            var currentLangRe = new RegExp('<(?:lang|span)[^>]+lang="' + language + '"[^>]*>(.*?)<\/(?:lang|span)>', 'g'),
                anyLangRE = /<(?:lang|span)[^>]+lang="[a-zA-Z0-9_-]+"[^>]*>(.*?)<\/(?:lang|span)>/g;
            if (!text.match(currentLangRe)) {
                var matches = text.match(anyLangRE);
                if (matches && matches[0]) {
                    language = matches[0].match(/lang="([a-zA-Z0-9_-]+)"/)[1];
                    currentLangRe = new RegExp('<(?:lang|span)[^>]+lang="' + language + '"[^>]*>(.*?)<\/(?:lang|span)>', 'g');
                } else {
                    return text;
                }
            }
            text = text.replace(currentLangRe, '$1');
            text = text.replace(anyLangRE, '');
            return text;
        });
    };
        self.escapeHTML = function(text) {
        if (typeof text == 'undefined' || text === null || (typeof text == 'number' && isNaN(text))) {
            return '';
        } else if (typeof text != 'string') {
            return '' + text;
        }
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };
        self.decodeHTML = function(text) {
        if (typeof text == 'undefined' || text === null || (typeof text == 'number' && isNaN(text))) {
            return '';
        } else if (typeof text != 'string') {
            return '' + text;
        }
        return text
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&nbsp;/g, ' ');
    };
        self.decodeHTMLEntities = function(text) {
        if (text && typeof text === 'string') {
            element.innerHTML = text;
            text = element.textContent;
            element.textContent = '';
        }
        return text;
    };
        self.addOrRemoveWWW = function(url) {
        if (typeof url == 'string') {
            if (url.match(/http(s)?:\/\/www\./)) {
                url = url.replace('www.', '');
            } else {
                url = url.replace('https://', 'https://www.');
                url = url.replace('http://', 'http://www.');
            }
        }
        return url;
    };
        self.removeProtocolAndWWW = function(url) {
        url = url.replace(/.*?:\/\//g, '');
        url = url.replace(/^www./, '');
        return url;
    };
        self.getUsernameFromUrl = function(url) {
        if (url.indexOf('@') > -1) {
            var withoutProtocol = url.replace(/.*?:\/\//, ''),
                matches = withoutProtocol.match(/[^@]*/);
            if (matches && matches.length && !matches[0].match(/[\/|?]/)) {
                return matches[0];
            }
        }
    };
        self.removeSpecialCharactersForFiles = function(text) {
        return text.replace(/[#:\/\?\\]+/g, '_');
    };
        self.getLastFileWithoutParams = function(url) {
        var filename = url.substr(url.lastIndexOf('/') + 1);
        if (filename.indexOf('?') != -1) {
            filename = filename.substr(0, filename.indexOf('?'));
        }
        return filename;
    };
        self.guessExtensionFromUrl = function(fileUrl) {
        var split = fileUrl.split('.'),
            candidate,
            extension,
            position;
        if (split.length > 1) {
            candidate = split.pop().toLowerCase();
            position = candidate.indexOf('?');
            if (position > -1) {
                candidate = candidate.substr(0, position);
            }
            if (extensionRegex.test(candidate)) {
                extension = candidate;
            }
        }
        return extension;
    };
        self.twoDigits = function(num) {
        if (num < 10) {
            return '0' + num;
        } else {
            return '' + num;
        }
    };
        self.escapeForRegex = function(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
        self.countWords = function(text) {
        text = text.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        text = text.replace(/<\/?(?!\!)[^>]*>/gi, '');
        text = self.decodeHTMLEntities(text);
        text = text.replace(/_/gi, " ");
        text = text.replace(/[\'"’-]/gi, "");
        text = text.replace(/([0-9])[.,]([0-9])/gi, '$1$2');
        return text.split(/\w\b/gi).length - 1;
    };
        self.getTextPluginfileUrl = function(files) {
        if (files && files.length) {
            var fileURL = files[0].fileurl;
            return fileURL.substr(0, Math.max(fileURL.lastIndexOf('/'), fileURL.lastIndexOf('%2F')));
        }
        return false;
    };
        self.replacePluginfileUrls = function(text, files) {
        if (text) {
            var fileURL = self.getTextPluginfileUrl(files);
            if (fileURL) {
                return text.replace(/@@PLUGINFILE@@/g, fileURL);
            }
        }
        return text;
    };
        self.restorePluginfileUrls = function(text, files) {
        if (text) {
            var fileURL = self.getTextPluginfileUrl(files);
            if (fileURL) {
                return text.replace(new RegExp(self.escapeForRegex(fileURL), 'g'), '@@PLUGINFILE@@');
            }
        }
        return text;
    };
    return self;
}]);

angular.module('mm.core')
.constant('mmCoreVersionApplied', 'version_applied')
.factory('$mmUpdateManager', ["$log", "$q", "$mmConfig", "$mmSitesManager", "$mmFS", "$cordovaLocalNotification", "$mmLocalNotifications", "$mmApp", "$mmEvents", "mmCoreSitesStore", "mmCoreVersionApplied", "mmCoreEventSiteAdded", "mmCoreEventSiteUpdated", "mmCoreEventSiteDeleted", "$injector", "$mmFilepool", "mmCoreCourseModulesStore", "mmFilepoolLinksStore", "mmFilepoolPackagesStore", "mmCoreConfigConstants", function($log, $q, $mmConfig, $mmSitesManager, $mmFS, $cordovaLocalNotification, $mmLocalNotifications,
            $mmApp, $mmEvents, mmCoreSitesStore, mmCoreVersionApplied, mmCoreEventSiteAdded, mmCoreEventSiteUpdated,
            mmCoreEventSiteDeleted, $injector, $mmFilepool, mmCoreCourseModulesStore, mmFilepoolLinksStore,
            mmFilepoolPackagesStore, mmCoreConfigConstants) {
    $log = $log.getInstance('$mmUpdateManager');
    var self = {},
        sitesFilePath = 'migration/sites.json';
        self.check = function() {
        var promises = [],
            versionCode = mmCoreConfigConstants.versioncode;
        return $mmConfig.get(mmCoreVersionApplied, 0).then(function(versionApplied) {
            if (versionCode >= 391 && versionApplied < 391) {
                promises.push(migrateMM1Sites());
                promises.push(clearAppFolder().catch(function() {}));
            }
            if (versionCode >= 2003 && versionApplied < 2003) {
                promises.push(cancelAndroidNotifications());
            }
            if (versionCode >= 2003) {
                setStoreSitesInFile();
            }
            if (versionCode >= 2007 && versionApplied < 2007) {
                promises.push(migrateModulesStatus());
            }
            if (versionCode >= 2013 && versionApplied < 2013) {
                promises.push(migrateFileExtensions());
            }
            return $q.all(promises).then(function() {
                return $mmConfig.set(mmCoreVersionApplied, versionCode);
            }).catch(function() {
                $log.error('Error applying update from ' + versionApplied + ' to ' + versionCode);
            });
        });
    };
        function clearAppFolder() {
        if ($mmFS.isAvailable()) {
            return $mmFS.getDirectoryContents('').then(function(entries) {
                var promises = [];
                angular.forEach(entries, function(entry) {
                    var canDeleteAndroid = ionic.Platform.isAndroid() && entry.name !== 'cache' && entry.name !== 'files';
                    var canDeleteIOS = ionic.Platform.isIOS() && entry.name !== 'NoCloud';
                    if (canDeleteIOS || canDeleteAndroid) {
                        promises.push($mmFS.removeDir(entry.name));
                    }
                });
                return $q.all(promises);
            });
        } else {
            return $q.when();
        }
    }
        function migrateMM1Sites() {
        var sites = localStorage.getItem('sites'),
            promises = [];
        if (sites) {
            sites = sites.split(',');
            angular.forEach(sites, function(siteid) {
                if (!siteid) {
                    return;
                }
                $log.debug('Migrating site from MoodleMobile 1: ' + siteid);
                var site = localStorage.getItem('sites-'+siteid),
                    infos;
                if (site) {
                    try {
                        site = JSON.parse(site);
                    } catch(ex) {
                        $log.warn('Site ' + siteid + ' data is invalid. Ignoring.');
                        return;
                    }
                    infos = angular.copy(site);
                    delete infos.id;
                    delete infos.token;
                    promises.push($mmSitesManager.addSite(site.id, site.siteurl, site.token, infos));
                } else {
                    $log.warn('Site ' + siteid + ' not found in local storage. Ignoring.');
                }
            });
        }
        return $q.all(promises).then(function() {
            if (sites) {
                localStorage.clear();
            }
        });
    }
        function cancelAndroidNotifications() {
        if ($mmLocalNotifications.isAvailable() && ionic.Platform.isAndroid()) {
            return $cordovaLocalNotification.cancelAll().catch(function() {
                $log.error('Error cancelling Android notifications.');
            });
        }
        return $q.when();
    }
        function setStoreSitesInFile() {
        $mmEvents.on(mmCoreEventSiteAdded, storeSitesInFile);
        $mmEvents.on(mmCoreEventSiteUpdated, storeSitesInFile);
        $mmEvents.on(mmCoreEventSiteDeleted, storeSitesInFile);
        storeSitesInFile();
    }
        function getSitesStoredInFile() {
        if ($mmFS.isAvailable()) {
            return $mmFS.readFile(sitesFilePath).then(function(sites) {
                try {
                    sites = JSON.parse(sites);
                } catch (ex) {
                    sites = [];
                }
                return sites;
            }).catch(function() {
                return [];
            });
        } else {
            return $q.when([]);
        }
    }
        function storeSitesInFile() {
        if ($mmFS.isAvailable()) {
            return $mmApp.getDB().getAll(mmCoreSitesStore).then(function(sites) {
                angular.forEach(sites, function(site) {
                    site.token = 'private';
                });
                return $mmFS.writeFile(sitesFilePath, JSON.stringify(sites));
            });
        } else {
            return $q.when();
        }
    }
        function deleteSitesFile() {
        if ($mmFS.isAvailable()) {
            return $mmFS.removeFile(sitesFilePath);
        } else {
            return $q.when();
        }
    }
        function migrateModulesStatus() {
        var components = [];
        components.push($injector.get('mmaModBookComponent'));
        components.push($injector.get('mmaModImscpComponent'));
        components.push($injector.get('mmaModPageComponent'));
        components.push($injector.get('mmaModPenseComponent'));
        components.push($injector.get('mmaModPropostaComponent'));
        components.push($injector.get('mmaModSaibaComponent'));
        components.push($injector.get('mmaModTextosComponent'));
        components.push($injector.get('mmaModWebaulaComponent'));
        components.push($injector.get('mmaModEstudoComponent'));
        components.push($injector.get('mmaModResourceComponent'));
        return $mmSitesManager.getSitesIds().then(function(sites) {
            var promises = [];
            angular.forEach(sites, function(siteId) {
                promises.push(migrateSiteModulesStatus(siteId, components));
            });
            return $q.all(promises);
        });
    }
        function migrateSiteModulesStatus(siteId, components) {
        $log.debug('Migrate site modules status from site ' + siteId);
        return $mmSitesManager.getSiteDb(siteId).then(function(db) {
            return db.getAll(mmCoreCourseModulesStore).then(function(entries) {
                var promises = [];
                angular.forEach(entries, function(entry) {
                    if (!parseInt(entry.id)) {
                        return;
                    }
                    promises.push(determineComponent(db, entry.id, components).then(function(component) {
                        if (component) {
                            entry.component = component;
                            entry.componentId = entry.id;
                            entry.id = $mmFilepool.getPackageId(component, entry.id);
                            promises.push(db.insert(mmFilepoolPackagesStore, entry));
                        }
                    }));
                });
                return $q.all(promises).then(function() {
                    return db.removeAll(mmCoreCourseModulesStore).catch(function() {
                    });
                });
            });
        });
    }
        function migrateFileExtensions() {
        return $mmSitesManager.getSitesIds().then(function(sites) {
            var promises = [];
            angular.forEach(sites, function(siteId) {
                promises.push($mmFilepool.fillMissingExtensionInFiles(siteId));
            });
            promises.push($mmFilepool.treatExtensionInQueue());
            return $q.all(promises);
        });
    }
        function determineComponent(db, componentId, components) {
        var promises = [],
            component;
        angular.forEach(components, function(c) {
            if (c) {
                promises.push(db.query(mmFilepoolLinksStore, ['componentAndId', '=', [c, componentId]]).then(function(items) {
                    if (items.length) {
                        component = c;
                    }
                }).catch(function() {
                }));
            }
        });
        return $q.all(promises).then(function() {
            return component;
        });
    }
    return self;
}]);

angular.module('mm.core')
.factory('$mmURLDelegate', ["$log", function($log) {
    $log = $log.getInstance('$mmURLDelegate');
    var observers = {},
        self = {};
        self.register = function(name, callback) {
        $log.debug("Register observer '"+name+"' for custom URL.");
        observers[name] = callback;
    };
        self.notify = function(url) {
        var treated = false;
        angular.forEach(observers, function(callback, name) {
            if (!treated && typeof(callback) === 'function') {
                treated = callback(url);
            }
        });
    };
    return self;
}])
.run(["$mmURLDelegate", "$log", function($mmURLDelegate, $log) {
    window.handleOpenURL = function(url) {
        $log.debug('App launched by URL.');
        $mmURLDelegate.notify(url);
    };
}]);

angular.module('mm.core')
.provider('$mmUtil', ["mmCoreSecondsYear", "mmCoreSecondsDay", "mmCoreSecondsHour", "mmCoreSecondsMinute", function(mmCoreSecondsYear, mmCoreSecondsDay, mmCoreSecondsHour, mmCoreSecondsMinute) {
    var self = this,
        provider = this;
        self.param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += self.param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += self.param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null) query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };
    this.$get = ["$ionicLoading", "$ionicPopup", "$injector", "$translate", "$http", "$log", "$q", "$mmLang", "$mmFS", "$timeout", "$mmApp", "$mmText", "mmCoreWifiDownloadThreshold", "mmCoreDownloadThreshold", "$ionicScrollDelegate", "$mmWS", "$cordovaInAppBrowser", "$mmConfig", "mmCoreSettingsRichTextEditor", function($ionicLoading, $ionicPopup, $injector, $translate, $http, $log, $q, $mmLang, $mmFS, $timeout, $mmApp,
                $mmText, mmCoreWifiDownloadThreshold, mmCoreDownloadThreshold, $ionicScrollDelegate, $mmWS, $cordovaInAppBrowser,
                $mmConfig, mmCoreSettingsRichTextEditor) {
        $log = $log.getInstance('$mmUtil');
        var self = {},
            matchesFn,
            inputSupportKeyboard = ['date', 'datetime', 'datetime-local', 'email', 'month', 'number', 'password',
                'search', 'tel', 'text', 'time', 'url', 'week'];
                self.formatURL = function(url) {
            url = url.trim();
            if (! /^http(s)?\:\/\/.*/i.test(url)) {
                url = "https://" + url;
            }
            url = url.replace(/^http/i, 'http');
            url = url.replace(/^https/i, 'https');
            url = url.replace(/\/$/, "");
            return url;
        };
                self.resolveObject = function(object, instantiate) {
            var toInject,
                resolved;
            instantiate = angular.isUndefined(instantiate) ? false : instantiate;
            if (angular.isFunction(object) || angular.isObject(object)) {
                resolved = object;
            } else if (angular.isString(object)) {
                toInject = object.split('.');
                resolved = $injector.get(toInject[0]);
                if (toInject.length > 1) {
                    resolved = resolved[toInject[1]];
                }
            }
            if (angular.isFunction(resolved) && instantiate) {
                resolved = resolved();
            }
            if (typeof resolved === 'undefined') {
                throw new Error('Unexpected argument object passed');
            }
            return resolved;
        };
                self.isDownloadableUrl = function(url) {
            return self.isPluginFileUrl(url) || self.isThemeImageUrl(url) || self.isGravatarUrl(url);
        };
                self.isGravatarUrl = function(url) {
            return url && url.indexOf('gravatar.com/avatar') !== -1;
        };
                self.isPluginFileUrl = function(url) {
            return url && url.indexOf('/pluginfile.php') !== -1;
        };
                self.isThemeImageUrl = function(url) {
            return url && url.indexOf('/theme/image.php') !== -1;
        };
                self.isValidURL = function(url) {
            return /^http(s)?\:\/\/.+/i.test(url);
        };
                self.fixPluginfileURL = function(url, token) {
            if (!url) {
                return '';
            }
            if (url.indexOf('token=') != -1) {
                return url;
            }
            if (url.indexOf('pluginfile') == -1) {
                return url;
            }
            if (!token) {
                return '';
            }
            if (url.indexOf('?file=') != -1 || url.indexOf('?forcedownload=') != -1 || url.indexOf('?rev=') != -1) {
                url += '&';
            } else {
                url += '?';
            }
            url += 'token=' + token;
            if (url.indexOf('/webservice/pluginfile') == -1) {
                url = url.replace('/pluginfile', '/webservice/pluginfile');
            }
            return url;
        };
                self.openFile = function(path) {
            var deferred = $q.defer();
            if (window.plugins) {
                var extension = $mmFS.getFileExtension(path),
                    mimetype = $mmFS.getMimeType(extension);
                if (ionic.Platform.isAndroid() && window.plugins.webintent) {
                    var iParams = {
                        action: "android.intent.action.VIEW",
                        url: path,
                        type: mimetype
                    };
                    window.plugins.webintent.startActivity(
                        iParams,
                        function() {
                            $log.debug('Intent launched');
                            deferred.resolve();
                        },
                        function() {
                            $log.debug('Intent launching failed.');
                            $log.debug('action: ' + iParams.action);
                            $log.debug('url: ' + iParams.url);
                            $log.debug('type: ' + iParams.type);
                            if (!extension || extension.indexOf('/') > -1 || extension.indexOf('\\') > -1) {
                                $mmLang.translateAndRejectDeferred(deferred, 'mm.core.erroropenfilenoextension');
                            } else {
                                $mmLang.translateAndRejectDeferred(deferred, 'mm.core.erroropenfilenoapp');
                            }
                        }
                    );
                } else if (ionic.Platform.isIOS() && typeof handleDocumentWithURL == 'function') {
                    $mmFS.getBasePath().then(function(fsRoot) {
                        if (path.indexOf(fsRoot > -1)) {
                            path = path.replace(fsRoot, "");
                            path = encodeURIComponent(decodeURIComponent(path));
                            path = fsRoot + path;
                        }
                        handleDocumentWithURL(
                            function() {
                                $log.debug('File opened with handleDocumentWithURL' + path);
                                deferred.resolve();
                            },
                            function(error) {
                                $log.debug('Error opening with handleDocumentWithURL' + path);
                                if(error == 53) {
                                    $log.error('No app that handles this file type.');
                                }
                                self.openInBrowser(path);
                                deferred.resolve();
                            },
                            path
                        );
                    }, deferred.reject);
                } else {
                    self.openInBrowser(path);
                    deferred.resolve();
                }
            } else {
                $log.debug('Opening external file using window.open()');
                window.open(path, '_blank');
                deferred.resolve();
            }
            return deferred.promise;
        };
                self.openInBrowser = function(url) {
            window.open(url, '_system');
        };
                self.openInApp = function(url, options) {
            if (!url) {
                return;
            }
            options = options || {};
            if (!options.enableViewPortScale) {
                options.enableViewPortScale = 'yes';
            }
            if (!options.location && ionic.Platform.isIOS() && url.indexOf('file://') === 0) {
                options.location = 'no';
            }
            $cordovaInAppBrowser.open(url, '_blank', options);
        };
                self.closeInAppBrowser = function() {
            $cordovaInAppBrowser.close();
        };
                self.openOnlineFile = function(url) {
            var deferred = $q.defer();
            if (ionic.Platform.isAndroid() && window.plugins && window.plugins.webintent) {
                var extension,
                    iParams;
                $mmWS.getRemoteFileMimeType(url).then(function(mimetype) {
                    if (!mimetype) {
                        extension = $mmText.guessExtensionFromUrl(url);
                        mimetype = $mmFS.getMimeType(extension);
                    }
                    iParams = {
                        action: "android.intent.action.VIEW",
                        url: url,
                        type: mimetype
                    };
                    window.plugins.webintent.startActivity(
                        iParams,
                        function() {
                            $log.debug('Intent launched');
                            deferred.resolve();
                        },
                        function() {
                            $log.debug('Intent launching failed.');
                            $log.debug('action: ' + iParams.action);
                            $log.debug('url: ' + iParams.url);
                            $log.debug('type: ' + iParams.type);
                            if (!extension || extension.indexOf('/') > -1 || extension.indexOf('\\') > -1) {
                                $mmLang.translateAndRejectDeferred(deferred, 'mm.core.erroropenfilenoextension');
                            } else {
                                $mmLang.translateAndRejectDeferred(deferred, 'mm.core.erroropenfilenoapp');
                            }
                        }
                    );
                });
            } else {
                $log.debug('Opening remote file using window.open()');
                window.open(url, '_blank');
                deferred.resolve();
            }
            return deferred.promise;
        };
                self.getMimeType = function(url) {
            return $mmWS.getRemoteFileMimeType(url).then(function(mimetype) {
                if (!mimetype) {
                    extension = $mmText.guessExtensionFromUrl(url);
                    mimetype = $mmFS.getMimeType(extension);
                }
                return mimetype || '';
            });
        };
                self.showModalLoading = function(text, needsTranslate) {
            var modalClosed = false,
                modalShown = false;
            if (!text) {
                text = 'mm.core.loading';
                needsTranslate = true;
            }
            function showModal(text) {
                if (!modalClosed) {
                    $ionicLoading.show({
                        template:   '<ion-spinner></ion-spinner>' +
                                    '<p>'+text+'</p>'
                    });
                    modalShown = true;
                }
            }
            if (needsTranslate) {
                $translate(text).then(showModal);
            } else {
                showModal(text);
            }
            return {
                dismiss: function() {
                    modalClosed = true;
                    if (modalShown) {
                        $ionicLoading.hide();
                    }
                }
            };
        };
                self.showModalLoadingWithTemplate = function(template, options) {
            options = options || {};
            if (!template) {
                template = "<ion-spinner></ion-spinner><p>{{'mm.core.loading' | translate}}</p>";
            }
            options.template = template;
            $ionicLoading.show(options);
            return {
                dismiss: function() {
                    $ionicLoading.hide();
                }
            };
        };
                self.showErrorModal = function(errorMessage, needsTranslate, autocloseTime) {
            var errorKey = 'mm.core.error',
                langKeys = [errorKey],
                matches;
            if (angular.isObject(errorMessage)) {
                if (typeof errorMessage.content != 'undefined') {
                    errorMessage = errorMessage.content;
                } else if (typeof errorMessage.body != 'undefined') {
                    errorMessage = errorMessage.body;
                } else if (typeof errorMessage.message != 'undefined') {
                    errorMessage = errorMessage.message;
                } else if (typeof errorMessage.error != 'undefined') {
                    errorMessage = errorMessage.error;
                } else {
                    errorMessage = JSON.stringify(errorMessage);
                }
                matches = errorMessage.match(/token"?[=|:]"?(\w*)/, '');
                if (matches && matches[1]) {
                    errorMessage = errorMessage.replace(new RegExp(matches[1], 'g'), 'secret');
                }
            }
            if (needsTranslate) {
                langKeys.push(errorMessage);
            }
            $translate(langKeys).then(function(translations) {
                var popup = $ionicPopup.alert({
                    title: translations[errorKey],
                    template: needsTranslate ? translations[errorMessage] : errorMessage
                });
                if (typeof autocloseTime != 'undefined' && !isNaN(parseInt(autocloseTime))) {
                    $timeout(function() {
                        popup.close();
                    }, parseInt(autocloseTime));
                } else {
                    delete popup;
                }
            });
        };
                self.showModal = function(title, message) {
            var promises = [
                $translate(title),
                $translate(message),
            ];
            $q.all(promises).then(function(translations) {
                $ionicPopup.alert({
                    title: translations[0],
                    template: translations[1]
                });
            });
        };
                self.showConfirm = function(template, title, options) {
            options = options || {};
            options.template = template;
            options.title = title;
            return $ionicPopup.confirm(options).then(function(confirmed) {
                if (!confirmed) {
                    return $q.reject();
                }
            });
        };
                self.showPrompt = function(body, title, inputPlaceholder, inputType) {
            inputType = inputType || 'password';
            var options = {
                template: body,
                title: title,
                inputPlaceholder: inputPlaceholder,
                inputType: inputType
            };
            return $ionicPopup.prompt(options).then(function(data) {
                if (typeof data == 'undefined') {
                    return $q.reject();
                }
                return data;
            });
        };
                self.readJSONFile = function(path) {
            return $http.get(path).then(function(response) {
                return response.data;
            });
        };
                self.getCountryName = function(code) {
            var countryKey = 'mm.core.country-' + code,
                countryName = $translate.instant(countryKey);
            return countryName !== countryKey ? countryName : code;
        };
                self.getDocsUrl = function(release, page) {
            page = page || 'Mobile_app';
            var docsurl = 'https://docs.moodle.org/en/' + page;
            if (typeof release != 'undefined') {
                var version = release.substr(0, 3).replace(".", "");
                if (parseInt(version) >= 24) {
                    docsurl = docsurl.replace('https://docs.moodle.org/', 'https://docs.moodle.org/' + version + '/');
                }
            }
            return $mmLang.getCurrentLanguage().then(function(lang) {
                return docsurl.replace('/en/', '/' + lang + '/');
            }, function() {
                return docsurl;
            });
        };
                self.timestamp = function() {
            return Math.round(new Date().getTime() / 1000);
        };
                self.isFalseOrZero = function(value) {
            return typeof value != 'undefined' && (value === false || parseInt(value) === 0);
        };
                self.isTrueOrOne = function(value) {
            return typeof value != 'undefined' && (value === true || parseInt(value) === 1);
        };
                self.formatTime = function(seconds) {
            var langKeys = ['mm.core.day', 'mm.core.days', 'mm.core.hour', 'mm.core.hours', 'mm.core.min', 'mm.core.mins',
                            'mm.core.sec', 'mm.core.secs', 'mm.core.year', 'mm.core.years', 'mm.core.now'];
            return $translate(langKeys).then(function(translations) {
                totalSecs = Math.abs(seconds);
                var years     = Math.floor(totalSecs / mmCoreSecondsYear);
                var remainder = totalSecs - (years * mmCoreSecondsYear);
                var days      = Math.floor(remainder / mmCoreSecondsDay);
                remainder = totalSecs - (days * mmCoreSecondsDay);
                var hours     = Math.floor(remainder / mmCoreSecondsHour);
                remainder = remainder - (hours * mmCoreSecondsHour);
                var mins      = Math.floor(remainder / mmCoreSecondsMinute);
                var secs      = remainder - (mins * mmCoreSecondsMinute);
                var ss = (secs == 1)  ? translations['mm.core.sec']  : translations['mm.core.secs'];
                var sm = (mins == 1)  ? translations['mm.core.min']  : translations['mm.core.mins'];
                var sh = (hours == 1) ? translations['mm.core.hour'] : translations['mm.core.hours'];
                var sd = (days == 1)  ? translations['mm.core.day']  : translations['mm.core.days'];
                var sy = (years == 1) ? translations['mm.core.year'] : translations['mm.core.years'];
                var oyears = '',
                    odays = '',
                    ohours = '',
                    omins = '',
                    osecs = '';
                if (years) {
                    oyears  = years + ' ' + sy;
                }
                if (days) {
                    odays  = days + ' ' + sd;
                }
                if (hours) {
                    ohours = hours + ' ' + sh;
                }
                if (mins) {
                    omins  = mins + ' ' + sm;
                }
                if (secs) {
                    osecs  = secs + ' ' + ss;
                }
                if (years) {
                    return oyears + ' ' + odays;
                }
                if (days) {
                    return odays + ' ' + ohours;
                }
                if (hours) {
                    return ohours + ' ' + omins;
                }
                if (mins) {
                    return omins + ' ' + osecs;
                }
                if (secs) {
                    return osecs;
                }
                return translations['mm.core.now'];
            });
        };
                self.formatDuration = function(duration, precission) {
            eventDuration = moment.duration(duration, 'seconds');
            if (!precission) {
                precission = 5;
            }
            durationString = "";
            if (precission && eventDuration.years() > 0) {
                durationString += " " + moment.duration(eventDuration.years(), 'years').humanize();
                precission--;
            }
            if (precission && eventDuration.months() > 0) {
                durationString += " " + moment.duration(eventDuration.months(), 'months').humanize();
                precission--;
            }
            if (precission && eventDuration.days() > 0) {
                durationString += " " + moment.duration(eventDuration.days(), 'days').humanize();
                precission--;
            }
            if (precission && eventDuration.hours() > 0) {
                durationString += " " + moment.duration(eventDuration.hours(), 'hours').humanize();
                precission--;
            }
            if (precission && eventDuration.minutes() > 0) {
                durationString += " " + moment.duration(eventDuration.minutes(), 'minutes').humanize();
                precission--;
            }
            return durationString.trim();
        };
                self.emptyArray = function(array) {
            array.length = 0;
        };
                self.emptyObject = function(object) {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    delete object[key];
                }
            }
        };
                self.allPromises = function(promises) {
            if (!promises || !promises.length) {
                return $q.when();
            }
            var count = 0,
                failed = false,
                deferred = $q.defer();
            angular.forEach(promises, function(promise) {
                promise.catch(function() {
                    failed = true;
                }).finally(function() {
                    count++;
                    if (count === promises.length) {
                        if (failed) {
                            deferred.reject();
                        } else {
                            deferred.resolve();
                        }
                    }
                });
            });
            return deferred.promise;
        };
                self.basicLeftCompare = function(itemA, itemB, maxLevels, level) {
            level = level || 0;
            maxLevels = maxLevels || 0;
            if (angular.isFunction(itemA) || angular.isFunction(itemB)) {
                return true;
            } else if (angular.isObject(itemA) && angular.isObject(itemB)) {
                if (level >= maxLevels) {
                    return true;
                }
                var equal = true;
                angular.forEach(itemA, function(value, name) {
                    if (!self.basicLeftCompare(value, itemB[name], maxLevels, level + 1)) {
                        equal = false;
                    }
                });
                return equal;
            } else {
                var floatA = parseFloat(itemA),
                    floatB = parseFloat(itemB);
                if (!isNaN(floatA) && !isNaN(floatB)) {
                    return floatA == floatB;
                }
                return itemA === itemB;
            }
        };
                self.confirmDownloadSize = function(size, message, unknownsizemessage, wifiThreshold, limitedThreshold) {
            wifiThreshold = typeof wifiThreshold == 'undefined' ? mmCoreWifiDownloadThreshold : wifiThreshold;
            limitedThreshold = typeof limitedThreshold == 'undefined' ? mmCoreDownloadThreshold : limitedThreshold;
            message = message || 'mm.course.confirmdownload';
            unknownsizemessage = unknownsizemessage || 'mm.course.confirmdownloadunknownsize';
            if (size <= 0) {
                return self.showConfirm($translate(unknownsizemessage));
            }
            else if (size >= wifiThreshold || ($mmApp.isNetworkAccessLimited() && size >= limitedThreshold)) {
                var readableSize = $mmText.bytesToSize(size, 2);
                return self.showConfirm($translate(message, {size: readableSize}));
            }
            return $q.when();
        };
                self.formatPixelsSize = function(size) {
            if (typeof size == 'string' && (size.indexOf('px') > -1 || size.indexOf('%') > -1)) {
                return size;
            }
            size = parseInt(size, 10);
            if (!isNaN(size)) {
                return size + 'px';
            }
            return '';
        };
                self.param = function(obj) {
            return provider.param(obj);
        };
                self.roundToDecimals = function(number, decimals) {
            if (typeof decimals == 'undefined') {
                decimals = 2;
            }
            var multiplier = Math.pow(10, decimals);
            return Math.round(parseFloat(number) * multiplier) / multiplier;
        };
                self.extractUrlParams = function(url) {
            var regex = /[?&]+([^=&]+)=?([^&]*)?/gi,
                params = {};
            url.replace(regex, function(match, key, value) {
                params[key] = value !== undefined ? value : '';
            });
            return params;
        };
                self.restoreSourcesInHtml = function(html, paths, anchorFn) {
            var div = angular.element('<div>'),
                media;
            div.html(html);
            media = div[0].querySelectorAll('img, video, audio, source');
            angular.forEach(media, function(el) {
                var src = paths[decodeURIComponent(el.getAttribute('src'))];
                if (typeof src !== 'undefined') {
                    el.setAttribute('src', src);
                }
            });
            angular.forEach(div.find('a'), function(anchor) {
                var href = decodeURIComponent(anchor.getAttribute('href')),
                    url = paths[href];
                if (typeof url !== 'undefined') {
                    anchor.setAttribute('href', url);
                    if (angular.isFunction(anchorFn)) {
                        anchorFn(anchor, href);
                    }
                }
            });
            return div.html();
        };
                self.scrollToElement = function(container, selector, scrollDelegate, scrollParentClass) {
            var position;
            if (!scrollDelegate) {
                scrollDelegate = $ionicScrollDelegate;
            }
            position = self.getElementXY(container, selector, scrollParentClass);
            if (!position) {
                return false;
            }
            scrollDelegate.scrollTo(position[0], position[1]);
            return true;
        };
                self.getElementXY = function(container, selector, positionParentClass) {
            var element = selector ? container.querySelector(selector) : container,
                offsetElement,
                positionTop = 0,
                positionLeft = 0;
            if (!positionParentClass) {
                positionParentClass = 'scroll-content';
            }
            if (!element) {
                return false;
            }
            while (element) {
                positionLeft += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                positionTop += (element.offsetTop - element.scrollTop + element.clientTop);
                offsetElement = element.offsetParent;
                element = element.parentElement;
                while (offsetElement != element && element) {
                    if (angular.element(element).hasClass(positionParentClass)) {
                        element = false;
                    } else {
                        element = element.parentElement;
                    }
                }
                if (angular.element(element).hasClass(positionParentClass)) {
                    element = false;
                }
            }
            return [positionLeft, positionTop];
        };
                self.extractUrlsFromCSS = function(code) {
            var urls = [],
                matches = code.match(/url\(\s*["']?(?!data:)([^)]+)\)/igm);
            angular.forEach(matches, function(match) {
                var submatches = match.match(/url\(\s*['"]?([^'"]*)['"]?\s*\)/im);
                if (submatches && submatches[1]) {
                    urls.push(submatches[1]);
                }
            });
            return urls;
        };
                self.getContentsOfElement = function(element, selector) {
            if (element) {
                var el = element[0] || element,
                    selected = el.querySelector(selector);
                if (selected) {
                    return selected.innerHTML;
                }
            }
        };
                self.removeElement = function(element, selector) {
            if (element) {
                var el = element[0] || element,
                    selected = el.querySelector(selector);
                if (selected) {
                    angular.element(selected).remove();
                }
            }
        };
                self.removeElementFromHtml = function(html, selector, removeAll) {
            var div = document.createElement('div'),
                selected;
            div.innerHTML = html;
            if (removeAll) {
                selected = div.querySelectorAll(selector);
                angular.forEach(selected, function(el) {
                    angular.element(el).remove();
                });
            } else {
                selected = div.querySelector(selector);
                if (selected) {
                    angular.element(selected).remove();
                }
            }
            return div.innerHTML;
        };
                self.replaceClassesInElement = function(element, map) {
            element = element[0] || element;
            angular.forEach(map, function(newValue, toReplace) {
                var matches = element.querySelectorAll('.' + toReplace);
                angular.forEach(matches, function(element) {
                    element.className = element.className.replace(toReplace, newValue);
                });
            });
        };
                self.closest = function(element, selector) {
            if (typeof element.closest == 'function') {
                return element.closest(selector);
            }
            if (!matchesFn) {
                ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
                    if (typeof document.body[fn] == 'function') {
                        matchesFn = fn;
                        return true;
                    }
                    return false;
                });
                if (!matchesFn) {
                    return;
                }
            }
            while (element) {
                if (element[matchesFn](selector)) {
                    return element;
                }
                element = element.parentElement;
            }
        };
                self.extractDownloadableFilesFromHtml = function(html) {
            var div = document.createElement('div'),
                elements,
                urls = [];
            div.innerHTML = html;
            elements = div.querySelectorAll('a, img, audio, video, source');
            angular.forEach(elements, function(element) {
                var url = element.tagName === 'A' ? element.href : element.src;
                if (url && self.isDownloadableUrl(url)) {
                    urls.push(url);
                }
            });
            return urls;
        };
                self.objectToArrayOfObjects = function(obj, keyName, valueName, sort) {
            var result = [],
                keys = Object.keys(obj);
            if (sort) {
                keys = keys.sort();
            }
            angular.forEach(keys, function(key) {
                var entry = {};
                entry[keyName] = key;
                entry[valueName] = obj[key];
                result.push(entry);
            });
            return result;
        };
                self.sameAtKeyMissingIsBlank = function(obj1, obj2, key) {
            var value1 = typeof obj1[key] != 'undefined' ? obj1[key] : '',
                value2 = typeof obj2[key] != 'undefined' ? obj2[key] : '';
            if (typeof value1 == 'number' || typeof value1 == 'boolean') {
                value1 = '' + value1;
            }
            if (typeof value2 == 'number' || typeof value2 == 'boolean') {
                value2 = '' + value2;
            }
            return value1 === value2;
        };
                self.mergeArraysWithoutDuplicates = function(array1, array2) {
            return self.uniqueArray(array1.concat(array2));
        };
                self.uniqueArray = function(array) {
            var unique = [],
                len = array.length;
            for (var i = 0; i < len; i++) {
                var value = array[i];
                if (unique.indexOf(value) == -1) {
                    unique.push(value);
                }
            }
            return unique;
        };
                self.isWebServiceError = function(error) {
            var localErrors = [
                $translate.instant('mm.core.wsfunctionnotavailable'),
                $translate.instant('mm.core.lostconnection'),
                $translate.instant('mm.core.userdeleted'),
                $translate.instant('mm.core.unexpectederror'),
                $translate.instant('mm.core.networkerrormsg'),
                $translate.instant('mm.core.serverconnection'),
                $translate.instant('mm.core.errorinvalidresponse')
            ];
            return error && localErrors.indexOf(error) == -1;
        };
                self.focusElement = function(el) {
            if (el && el.focus) {
                el.focus();
                if (ionic.Platform.isAndroid() && self.supportsInputKeyboard(el)) {
                    $mmApp.openKeyboard();
                }
            }
        };
                self.supportsInputKeyboard = function(el) {
            return el && !el.disabled && (el.tagName.toLowerCase() == 'textarea' ||
                (el.tagName.toLowerCase() == 'input' && inputSupportKeyboard.indexOf(el.type) != -1));
        };
                self.isRichTextEditorSupported = function() {
            if (!ionic.Platform.isIOS() && !ionic.Platform.isAndroid()) {
                return true;
            }
            if (ionic.Platform.isAndroid() && ionic.Platform.version() >= 4.4) {
                return true;
            }
            if (ionic.Platform.isIOS() && ionic.Platform.version() > 6) {
                return true;
            }
            return false;
        };
                self.isRichTextEditorEnabled = function() {
            if (self.isRichTextEditorSupported()) {
                return $mmConfig.get(mmCoreSettingsRichTextEditor, true);
            }
            return $q.when(false);
        };
                self.hasRepeatedFilenames = function(files) {
            if (!files || !files.length) {
                return false;
            }
            var names = [];
            for (var i = 0; i < files.length; i++) {
                var name = files[i].filename || files[i].name;
                if (names.indexOf(name) > -1) {
                    return $translate.instant('mm.core.filenameexist', {$a: name});
                } else {
                    names.push(name);
                }
            }
            return false;
        };
        return self;
    }];
}]);

angular.module('mm.core')
.constant('mmWSTimeout', 30000)
.factory('$mmWS', ["$http", "$q", "$log", "$mmLang", "$cordovaFileTransfer", "$mmApp", "$mmFS", "mmCoreSessionExpired", "mmCoreUserDeleted", "$translate", "$window", "md5", "$timeout", "mmWSTimeout", function($http, $q, $log, $mmLang, $cordovaFileTransfer, $mmApp, $mmFS, mmCoreSessionExpired,
            mmCoreUserDeleted, $translate, $window, md5, $timeout, mmWSTimeout) {
    $log = $log.getInstance('$mmWS');
    var self = {},
        mimeTypeCache = {},
        ongoingCalls = {};
        self.call = function(method, data, preSets) {
        var siteurl;
        data = convertValuesToString(data);
        if (typeof preSets == 'undefined' || preSets === null ||
                typeof preSets.wstoken == 'undefined' || typeof preSets.siteurl == 'undefined') {
            return $mmLang.translateAndReject('mm.core.unexpectederror');
        } else if (!$mmApp.isOnline()) {
            return $mmLang.translateAndReject('mm.core.networkerrormsg');
        }
        preSets.typeExpected = preSets.typeExpected || 'object';
        if (typeof preSets.responseExpected == 'undefined') {
            preSets.responseExpected = true;
        }
        data.wsfunction = method;
        data.wstoken = preSets.wstoken;
        siteurl = preSets.siteurl + '/webservice/rest/server.php?moodlewsrestformat=json';
        var ajaxData = data;
        var promise = getPromiseHttp('post', preSets.siteurl, ajaxData);
        if (!promise) {
            promise = $http.post(siteurl, ajaxData, {timeout: mmWSTimeout}).then(function(data) {
                if ((!data || !data.data) && !preSets.responseExpected) {
                    data = {};
                } else {
                    data = data.data;
                }
                if (!data) {
                    return $mmLang.translateAndReject('mm.core.serverconnection');
                } else if (typeof data != preSets.typeExpected) {
                    $log.warn('Response of type "' + typeof data + '" received, expecting "' + preSets.typeExpected + '"');
                    return $mmLang.translateAndReject('mm.core.errorinvalidresponse');
                }
                if (typeof(data.exception) !== 'undefined') {
                    if (data.errorcode == 'invalidtoken' ||
                            (data.errorcode == 'accessexception' && data.message.indexOf('Invalid token - token expired') > -1)) {
                        $log.error("Critical error: " + JSON.stringify(data));
                        return $q.reject(mmCoreSessionExpired);
                    } else if (data.errorcode === 'userdeleted') {
                        return $q.reject(mmCoreUserDeleted);
                    } else {
                        return $q.reject(data.message);
                    }
                }
                if (typeof(data.debuginfo) != 'undefined') {
                    return $q.reject('Error. ' + data.message);
                }
                $log.info('WS: Data received from WS ' + typeof(data));
                if (typeof(data) == 'object' && typeof(data.length) != 'undefined') {
                    $log.info('WS: Data number of elements '+ data.length);
                }
                return data;
            }, function() {
                return $mmLang.translateAndReject('mm.core.serverconnection');
            });
            setPromiseHttp(promise, 'post', preSets.siteurl, ajaxData);
        }
        return promise;
    };
        function setPromiseHttp(promise, method, url, params) {
        var deletePromise,
            queueItemId = getQueueItemId(method, url, params);
        ongoingCalls[queueItemId] = promise;
        deletePromise = $timeout(function() {
            delete ongoingCalls[queueItemId];
        }, mmWSTimeout);
        ongoingCalls[queueItemId].finally(function() {
            delete ongoingCalls[queueItemId];
            $timeout.cancel(deletePromise);
        });
    }
        function getPromiseHttp(method, url, params) {
        var queueItemId = getQueueItemId(method, url, params);
        if (typeof ongoingCalls[queueItemId] != 'undefined') {
            return ongoingCalls[queueItemId];
        }
        return false;
    }
        function getQueueItemId(method, url, params) {
        if (params) {
            url += '###' + serializeParams(params);
        }
        return method + '#' + md5.createHash(url);
    }
        function convertValuesToString(data) {
        var result = [];
        if (!angular.isArray(data) && angular.isObject(data)) {
            result = {};
        }
        for (var el in data) {
            if (angular.isObject(data[el])) {
                result[el] = convertValuesToString(data[el]);
            } else {
                result[el] = data[el] + '';
            }
        }
        return result;
    }
        self.downloadFile = function(url, path, addExtension) {
        $log.debug('Downloading file ' + url);
        var tmpPath = path + '.tmp';
        return $mmFS.createFile(tmpPath).then(function(fileEntry) {
            return $cordovaFileTransfer.download(url, fileEntry.toURL(), { encodeURI: false }, true).then(function() {
                var promise;
                if (addExtension) {
                    ext = $mmFS.getFileExtension(path);
                    if (!ext) {
                        promise = self.getRemoteFileMimeType(url).then(function(mime) {
                            var ext;
                            if (mime) {
                                ext = $mmFS.getExtension(mime, url);
                                if (ext) {
                                    path += '.' + ext;
                                }
                                return ext;
                            }
                            return false;
                        });
                    } else {
                        promise = $q.when(ext);
                    }
                } else {
                    promise = $q.when("");
                }
                return promise.then(function(extension) {
                    return $mmFS.moveFile(tmpPath, path).then(function(movedEntry) {
                        movedEntry.extension = extension;
                        movedEntry.path = path;
                        $log.debug('Success downloading file ' + url + ' to ' + path);
                        return movedEntry;
                    });
                });
            });
        }).catch(function(err) {
            $log.error('Error downloading ' + url + ' to ' + path);
            $log.error(JSON.stringify(err));
            return $q.reject(err);
        });
    };
        self.uploadFile = function(uri, options, preSets) {
        $log.debug('Trying to upload file: ' + uri);
        if (!uri || !options || !preSets) {
            return $q.reject();
        }
        var ftOptions = {},
            uploadUrl = preSets.siteurl + '/webservice/upload.php';
        ftOptions.fileKey = options.fileKey;
        ftOptions.fileName = options.fileName;
        ftOptions.httpMethod = 'POST';
        ftOptions.mimeType = options.mimeType;
        ftOptions.params = {
            token: preSets.token,
            filearea: options.fileArea || 'draft',
            itemid: options.itemId || 0
        };
        ftOptions.chunkedMode = false;
        ftOptions.headers = {
            Connection: "close"
        };
        $log.debug('Initializing upload');
        return $cordovaFileTransfer.upload(uploadUrl, uri, ftOptions, true).then(function(success) {
            var data = success.response;
            try {
                data = JSON.parse(data);
            } catch(err) {
                $log.error('Error parsing response:', err, data);
                return $mmLang.translateAndReject('mm.core.errorinvalidresponse');
            }
            if (!data) {
                return $mmLang.translateAndReject('mm.core.serverconnection');
            } else if (typeof data != 'object') {
                $log.warn('Upload file: Response of type "' + typeof data + '" received, expecting "object"');
                return $mmLang.translateAndReject('mm.core.errorinvalidresponse');
            }
            if (typeof data.exception !== 'undefined') {
                return $q.reject(data.message);
            } else if (data && typeof data.error !== 'undefined') {
                return $q.reject(data.error);
            } else if (data[0] && typeof data[0].error !== 'undefined') {
                return $q.reject(data[0].error);
            }
            $log.debug('Successfully uploaded file');
            return data[0];
        }, function(error) {
            $log.error('Error while uploading file', error.exception);
            return $mmLang.translateAndReject('mm.core.serverconnection');
        });
    };
        self.getRemoteFileSize = function(url) {
        var promise = getPromiseHttp('head', url);
        if (!promise) {
            promise = $http.head(url, {timeout: mmWSTimeout}).then(function(data) {
                var size = parseInt(data.headers('Content-Length'), 10);
                if (size) {
                    return size;
                }
                return -1;
            }).catch(function() {
                return -1;
            });
            setPromiseHttp(promise, 'head', url);
        }
        return promise;
    };
        self.getRemoteFileMimeType = function(url, ignoreCache) {
        if (mimeTypeCache[url] && !ignoreCache) {
            return $q.when(mimeTypeCache[url]);
        }
        var promise = getPromiseHttp('head', url);
        if (!promise) {
            promise = $http.head(url, {timeout: mmWSTimeout}).then(function(data) {
                var mimeType = data.headers('Content-Type');
                mimeTypeCache[url] = mimeType;
                return mimeType || '';
            }).catch(function() {
                return '';
            });
            setPromiseHttp(promise, 'head', url);
        }
        return promise;
    };
        self.syncCall = function(method, data, preSets) {
        var siteurl,
            xhr,
            errorResponse = {
                error: true,
                message: ''
            };
        data = convertValuesToString(data);
        if (typeof preSets == 'undefined' || preSets === null ||
                typeof preSets.wstoken == 'undefined' || typeof preSets.siteurl == 'undefined') {
            errorResponse.message = $translate.instant('mm.core.unexpectederror');
            return errorResponse;
        } else if (!$mmApp.isOnline()) {
            errorResponse.message = $translate.instant('mm.core.networkerrormsg');
            return errorResponse;
        }
        preSets.typeExpected = preSets.typeExpected || 'object';
        if (typeof preSets.responseExpected == 'undefined') {
            preSets.responseExpected = true;
        }
        data.wsfunction = method;
        data.wstoken = preSets.wstoken;
        siteurl = preSets.siteurl + '/webservice/rest/server.php?moodlewsrestformat=json';
        data = serializeParams(data);
        xhr = new $window.XMLHttpRequest();
        xhr.open('post', siteurl, false);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xhr.send(data);
        data = ('response' in xhr) ? xhr.response : xhr.responseText;
        xhr.status = Math.max(xhr.status === 1223 ? 204 : xhr.status, 0);
        if (xhr.status < 200 || xhr.status >= 300) {
            errorResponse.message = data;
            return errorResponse;
        }
        try {
            data = JSON.parse(data);
        } catch(ex) {}
        if ((!data || !data.data) && !preSets.responseExpected) {
            data = {};
        }
        if (!data) {
            errorResponse.message = $translate.instant('mm.core.serverconnection');
        } else if (typeof data != preSets.typeExpected) {
            $log.warn('Response of type "' + typeof data + '" received, expecting "' + preSets.typeExpected + '"');
            errorResponse.message = $translate.instant('mm.core.errorinvalidresponse');
        }
        if (typeof data.exception != 'undefined' || typeof data.debuginfo != 'undefined') {
            errorResponse.message = data.message;
        }
        if (errorResponse.message !== '') {
            return errorResponse;
        }
        $log.info('Synchronous: Data received from WS ' + typeof data);
        if (typeof(data) == 'object' && typeof(data.length) != 'undefined') {
            $log.info('Synchronous: Data number of elements '+ data.length);
        }
        return data;
    };
        function serializeParams(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += serializeParams(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += serializeParams(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null) query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    }
    return self;
}]);

angular.module('mm.core')
.filter('mmBytesToSize', ["$mmText", function($mmText) {
    return function(text) {
        return $mmText.bytesToSize(text);
    };
}]);
angular.module('mm.core')
.filter('mmCreateLinks', function() {
    var replacePattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])(?![^<]*>|[^<>]*<\/)/gim;
    return function(text) {
        return text.replace(replacePattern, '<a href="$1">$1</a>');
    };
});
angular.module('mm.core')
.filter('mmDateDayOrTime', ["$translate", function($translate) {
    return function(timestamp) {
        return moment(timestamp * 1000).calendar(null, {
            sameDay: $translate.instant('mm.core.dftimedate'),
            lastDay: $translate.instant('mm.core.dflastweekdate'),
            lastWeek: $translate.instant('mm.core.dflastweekdate')
        });
    };
}]);

angular.module('mm.core')
.filter('mmFormatDate', ["$translate", function($translate) {
    return function(timestamp, format) {
        if (format.indexOf('.') == -1) {
            format = 'mm.core.' + format;
        }
        return moment(timestamp).format($translate.instant(format));
    };
}]);

angular.module('mm.core')
.filter('mmNoTags', function() {
    return function(text) {
        return String(text).replace(/(<([^>]+)>)/ig, '');
    }
});
angular.module('mm.core')
.filter('mmSecondsToHMS', ["$mmText", "mmCoreSecondsHour", "mmCoreSecondsMinute", function($mmText, mmCoreSecondsHour, mmCoreSecondsMinute) {
    return function(seconds) {
        var hours,
            minutes;
        if (typeof seconds == 'undefined' || seconds < 0) {
            seconds = 0;
        }
        hours = Math.floor(seconds / mmCoreSecondsHour);
        seconds -= hours * mmCoreSecondsHour;
        minutes = Math.floor(seconds / mmCoreSecondsMinute);
        seconds -= minutes * mmCoreSecondsMinute;
        return $mmText.twoDigits(hours) + ':' + $mmText.twoDigits(minutes) + ':' + $mmText.twoDigits(seconds);
    };
}]);

angular.module('mm.core')
.filter('mmTimeAgo', function() {
    return function(timestamp) {
        return moment(timestamp * 1000).fromNow(true);
    };
});

angular.module('mm.core')
.filter('mmToLocaleString', function() {
    return function(text) {
        var timestamp = parseInt(text);
        if (isNaN(timestamp) || timestamp < 0) {
            return '';
        }
        if (timestamp < 100000000000) {
            timestamp = timestamp * 1000;
        }
        return new Date(timestamp).toLocaleString();
    };
});

angular.module('mm.core')
.directive('mmAttachments', ["$mmText", "$translate", "$ionicScrollDelegate", "$mmUtil", "$mmApp", "$mmFileUploaderHelper", "$q", function($mmText, $translate, $ionicScrollDelegate, $mmUtil, $mmApp, $mmFileUploaderHelper, $q) {
    return {
        restrict: 'E',
        priority: 100,
        templateUrl: 'core/templates/attachments.html',
        scope: {
            files: '=',
            maxSize: '@?',
            maxSubmissions: '@?',
            component: '@?',
            componentId: '@?'
        },
        link: function(scope) {
            var maxSize = parseInt(scope.maxSize, 10);
            maxSize = !isNaN(maxSize) && maxSize > 0 ? maxSize : -1;
            if (maxSize == -1) {
                scope.maxSizeReadable = $translate.instant('mm.core.unknown');
            } else {
                scope.maxSizeReadable = $mmText.bytesToSize(maxSize, 2);
            }
            if (typeof scope.maxSubmissions == 'undefined' || scope.maxSubmissions < 0) {
                scope.maxSubmissions = $translate.instant('mm.core.unknown');
            }
            scope.add = function() {
                if (!$mmApp.isOnline()) {
                    $mmUtil.showErrorModal('mm.fileuploader.errormustbeonlinetoupload', true);
                } else {
                    return $mmFileUploaderHelper.selectFile(maxSize).then(function(result) {
                        scope.files.push(result);
                    });
                }
            };
            scope.delete = function(index, askConfirm) {
                var promise;
                if (askConfirm) {
                    promise = $mmUtil.showConfirm($translate.instant('mm.core.confirmdeletefile'));
                } else {
                    promise = $q.when();
                }
                promise.then(function() {
                    scope.files.splice(index, 1);
                    $ionicScrollDelegate.resize();
                });
            };
            scope.renamed = function(index, file) {
                scope.files[index] = file;
            };
        }
    };
}]);

angular.module('mm.core')
.directive('mmAutoFocus', ["$mmUtil", function($mmUtil) {
    return {
        restrict: 'A',
        link: function(scope, el) {
            var unregister = scope.$watch(function() {
                return ionic.transition.isActive;
            }, function(isActive) {
                if (!isActive) {
                    $mmUtil.focusElement(el[0]);
                    unregister();
                }
            });
        }
    };
}]);

angular.module('mm.core')
.directive('mmCompletion', ["$mmSite", "$mmUtil", "$mmText", "$translate", "$q", function($mmSite, $mmUtil, $mmText, $translate, $q) {
    function showStatus(scope) {
        var langKey,
            moduleName = scope.moduleName || '';
        if (scope.completion.tracking === 1 && scope.completion.state === 0) {
            scope.completionImage = 'img/completion/completion-manual-n.svg';
            langKey = 'mm.core.completion-alt-manual-n';
        } else if(scope.completion.tracking === 1 && scope.completion.state === 1) {
            scope.completionImage = 'img/completion/completion-manual-y.svg';
            langKey = 'mm.core.completion-alt-manual-y';
        } else if(scope.completion.tracking === 2 && scope.completion.state === 0) {
            scope.completionImage = 'img/completion/completion-auto-n.svg';
            langKey = 'mm.core.completion-alt-auto-n';
        } else if(scope.completion.tracking === 2 && scope.completion.state === 1) {
            scope.completionImage = 'img/completion/completion-auto-y.svg';
            langKey = 'mm.core.completion-alt-auto-y';
        } else if(scope.completion.tracking === 2 && scope.completion.state === 2) {
            scope.completionImage = 'img/completion/completion-auto-pass.svg';
            langKey = 'mm.core.completion-alt-auto-pass';
        } else if(scope.completion.tracking === 2 && scope.completion.state === 3) {
            scope.completionImage = 'img/completion/completion-auto-fail.svg';
            langKey = 'mm.core.completion-alt-auto-fail';
        }
        if (moduleName) {
            $mmText.formatText(moduleName, true, true, 50).then(function(formatted) {
                $translate(langKey, {$a: formatted}).then(function(translated) {
                    scope.completionDescription = translated;
                });
            });
        }
    }
    return {
        restrict: 'E',
        priority: 100,
        scope: {
            completion: '=',
            afterChange: '=',
            moduleName: '=?'
        },
        templateUrl: 'core/templates/completion.html',
        link: function(scope, element, attrs) {
            if (scope.completion) {
                showStatus(scope);
                element.on('click', function(e) {
                    if (typeof scope.completion.cmid == 'undefined' || scope.completion.tracking !== 1) {
                        return;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    var modal = $mmUtil.showModalLoading(),
                        params = {
                            cmid: scope.completion.cmid,
                            completed: scope.completion.state === 1 ? 0 : 1
                        };
                    $mmSite.write('core_completion_update_activity_completion_status_manually', params).then(function(response) {
                        if (!response.status) {
                            return $q.reject();
                        }
                        if (angular.isFunction(scope.afterChange)) {
                            scope.afterChange();
                        }
                    }).catch(function(error) {
                        if (error) {
                            $mmUtil.showErrorModal(error);
                        } else {
                            $mmUtil.showErrorModal('mm.core.errorchangecompletion', true);
                        }
                    }).finally(function() {
                        modal.dismiss();
                    });
                });
            }
        }
    };
}]);

angular.module('mm.core')
.directive('mmContextMenu', ["$translate", "$ionicPopover", function($translate, $ionicPopover) {
    return {
        restrict: 'E',
        scope: {
            icon: '@?',
            title: '@?'
        },
        transclude: true,
        templateUrl: 'core/templates/contextmenuicon.html',
        controller: ['$scope', function($scope) {
            var items = $scope.ctxtMenuItems = [],
                refreshObserver;
            this.addContextMenuItem = function(item) {
                items.push(item);
                item.$on('$destroy', function() {
                    var index = items.indexOf(item);
                    items.splice(index, 1);
                });
            };
            $scope.contextMenuItemClicked = function(item) {
                if (typeof item.action == 'function') {
                    if (!item.iconAction || item.iconAction == 'spinner') {
                        return false;
                    }
                    hideContextMenu(item.closeOnClick);
                    return item.action();
                } else if (item.href) {
                    hideContextMenu(item.closeOnClick);
                }
                return true;
            };
            $scope.showContextMenu = function($event) {
                $scope.contextMenuPopover.show($event);
            };
            function hideContextMenu(closeOnClick) {
                if (typeof closeOnClick == 'undefined' || closeOnClick == "true") {
                    $scope.contextMenuPopover.hide();
                }
            }
            $ionicPopover.fromTemplateUrl('core/templates/contextmenu.html', {
                scope: $scope
            }).then(function(popover) {
                $scope.contextMenuPopover = popover;
            });
            refreshObserver = $scope.$on('scroll.refreshComplete', function() {
                $scope.contextMenuPopover.hide();
            });
            $scope.$on('$destroy', function() {
                $scope.contextMenuPopover.remove();
                refreshObserver && refreshObserver.off && refreshObserver.off();
            });
        }],
        link: function(scope) {
            scope.contextMenuIcon = scope.icon || 'ion-android-more-vertical';
            scope.contextMenuAria = scope.title || $translate.instant('mm.core.info');
        }
    };
}])
.directive('mmContextMenuItem', function() {
    return {
        require: '^^mmContextMenu',
        restrict: 'E',
        scope: {
            content: '@',
            iconAction: '@?',
            iconDescription: '@?',
            ariaAction: '@?',
            ariaDescription: '@?',
            action: '&?',
            href: '@?',
            captureLink: '@?',
            closeOnClick: '@?',
            priority: '@?'
        },
        link: function(scope, element, attrs, CtxtMenuCtrl) {
            scope.priority = scope.priority || 1;
            if (scope.action) {
                scope.href = false;
            } else if (scope.href) {
                scope.action = false;
            }
            scope.captureLink = scope.href && scope.captureLink ? scope.captureLink : "false";
            CtxtMenuCtrl.addContextMenuItem(scope);
        }
    };
});
angular.module('mm.core')
.directive('mmExternalContent', ["$log", "$mmFilepool", "$mmSite", "$mmSitesManager", "$mmUtil", "$q", "$mmApp", function($log, $mmFilepool, $mmSite, $mmSitesManager, $mmUtil, $q, $mmApp) {
    $log = $log.getInstance('mmExternalContent');
        function addSource(dom, url) {
        if (dom.tagName !== 'SOURCE') {
            return;
        }
        var e = document.createElement('source'),
            type = dom.getAttribute('type');
        e.setAttribute('src', url);
        if (type) {
            e.setAttribute('type', type);
        }
        dom.parentNode.insertBefore(e, dom);
    }
        function handleExternalContent(siteId, dom, targetAttr, url, component, componentId) {
        if (!url || !$mmUtil.isDownloadableUrl(url)) {
            $log.debug('Ignoring non-downloadable URL: ' + url);
            if (dom.tagName === 'SOURCE') {
                addSource(dom, url);
            }
            return $q.reject();
        }
        return $mmSitesManager.getSite(siteId).then(function(site) {
            if (!site.canDownloadFiles() && $mmUtil.isPluginFileUrl(url)) {
                angular.element(dom).remove();
                return $q.reject();
            }
            var fn;
            if (targetAttr === 'src' && dom.tagName !== 'SOURCE') {
                fn = $mmFilepool.getSrcByUrl;
            } else {
                fn = $mmFilepool.getUrlByUrl;
            }
            return fn(siteId, url, component, componentId).then(function(finalUrl) {
                $log.debug('Using URL ' + finalUrl + ' for ' + url);
                if (dom.tagName === 'SOURCE') {
                    addSource(dom, finalUrl);
                } else {
                    dom.setAttribute(targetAttr, finalUrl);
                }
                if (finalUrl.indexOf('http') === 0 &&
                            (dom.tagName == 'VIDEO' || dom.tagName == 'AUDIO' || dom.tagName == 'A' || dom.tagName == 'SOURCE')) {
                    var eventName = dom.tagName == 'A' ? 'click' : 'play';
                    if (dom.tagName == 'SOURCE') {
                        dom = $mmUtil.closest(dom, 'video,audio');
                        if (!dom) {
                            return;
                        }
                    }
                    angular.element(dom).on(eventName, function() {
                        if (!$mmApp.isNetworkAccessLimited()) {
                            fn(siteId, url, component, componentId, undefined, false);
                        }
                    });
                }
            });
        });
    }
    return {
        restrict: 'A',
        scope: {
            siteid: '='
        },
        link: function(scope, element, attrs) {
            var dom = element[0],
                siteid = scope.siteid || $mmSite.getId(),
                component = attrs.component,
                componentId = attrs.componentId,
                targetAttr,
                sourceAttr,
                observe = false;
            if (dom.tagName === 'A') {
                targetAttr = 'href';
                sourceAttr = 'href';
                if (attrs.hasOwnProperty('ngHref')) {
                    observe = true;
                }
            } else if (dom.tagName === 'IMG') {
                targetAttr = 'src';
                sourceAttr = 'src';
                if (attrs.hasOwnProperty('ngSrc')) {
                    observe = true;
                }
            } else if (dom.tagName === 'AUDIO' || dom.tagName === 'VIDEO' || dom.tagName === 'SOURCE') {
                targetAttr = 'src';
                sourceAttr = 'targetSrc';
                if (attrs.hasOwnProperty('ngSrc')) {
                    observe = true;
                }
            } else {
                $log.warn('Directive attached to non-supported tag: ' + dom.tagName);
                return;
            }
            if (observe) {
                attrs.$observe(targetAttr, function(url) {
                    if (!url) {
                        return;
                    }
                    handleExternalContent(siteid, dom, targetAttr, url, component, componentId);
                });
            } else {
                handleExternalContent(siteid, dom, targetAttr, attrs[sourceAttr] || attrs[targetAttr], component, componentId);
            }
        }
    };
}]);

angular.module('mm.core')
.directive('mmFile', ["$q", "$mmUtil", "$mmFilepool", "$mmSite", "$mmApp", "$mmEvents", "$mmFS", "mmCoreDownloaded", "mmCoreDownloading", "mmCoreNotDownloaded", "mmCoreOutdated", function($q, $mmUtil, $mmFilepool, $mmSite, $mmApp, $mmEvents, $mmFS, mmCoreDownloaded, mmCoreDownloading,
            mmCoreNotDownloaded, mmCoreOutdated) {
        function getState(scope, siteId, fileUrl, timeModified, alwaysDownload) {
        return $mmFilepool.getFileStateByUrl(siteId, fileUrl, timeModified).then(function(state) {
            var canDownload = $mmSite.canDownloadFiles();
            scope.isDownloaded = state === mmCoreDownloaded || state === mmCoreOutdated;
            scope.isDownloading = canDownload && state === mmCoreDownloading;
            scope.showDownload = canDownload && (state === mmCoreNotDownloaded || state === mmCoreOutdated ||
                    (alwaysDownload && state === mmCoreDownloaded));
        });
    }
        function downloadFile(scope, siteId, fileUrl, component, componentId, timeModified, alwaysDownload) {
        if (!$mmSite.canDownloadFiles()) {
            $mmUtil.showErrorModal('mm.core.cannotdownloadfiles', true);
            return $q.reject();
        }
        scope.isDownloading = true;
        return $mmFilepool.downloadUrl(siteId, fileUrl, false, component, componentId, timeModified).then(function(localUrl) {
            getState(scope, siteId, fileUrl, timeModified, alwaysDownload);
            return localUrl;
        }, function() {
            return getState(scope, siteId, fileUrl, timeModified, alwaysDownload).then(function() {
                if (scope.isDownloaded) {
                    return localUrl;
                } else {
                    return $q.reject();
                }
            });
        });
    }
        function openFile(scope, siteId, fileUrl, fileSize, component, componentId, timeModified, alwaysDownload) {
        var fixedUrl = $mmSite.fixPluginfileURL(fileUrl),
            promise;
        if ($mmFS.isAvailable()) {
            promise = $q.when().then(function() {
                var isWifi = !$mmApp.isNetworkAccessLimited(),
                    isOnline = $mmApp.isOnline();
                if (scope.isDownloaded && !scope.showDownload) {
                    return $mmFilepool.getUrlByUrl(siteId, fileUrl, component, componentId, timeModified);
                } else {
                    if (!isOnline && !scope.isDownloaded) {
                        return $q.reject();
                    }
                    return $mmFilepool.shouldDownloadBeforeOpen(fixedUrl, fileSize).then(function() {
                        if (scope.isDownloading) {
                            return;
                        }
                        return downloadFile(scope, siteId, fileUrl, component, componentId, timeModified, alwaysDownload);
                    }, function() {
                        if (isWifi && isOnline) {
                            downloadFile(scope, siteId, fileUrl, component, componentId, timeModified, alwaysDownload);
                        }
                        if (scope.isDownloading || !scope.isDownloaded || isOnline) {
                            return fixedUrl;
                        } else {
                            return $mmFilepool.getUrlByUrl(siteId, fileUrl, component, componentId, timeModified);
                        }
                    });
                }
            });
        } else {
            promise = $q.when(fixedUrl);
        }
        return promise.then(function(url) {
            if (!url) {
                return;
            }
            if (url.indexOf('http') === 0) {
                return $mmUtil.openOnlineFile(url);
            } else {
                return $mmUtil.openFile(url);
            }
        });
    }
    return {
        restrict: 'E',
        templateUrl: 'core/templates/file.html',
        scope: {
            file: '=',
            canDelete: '@?',
            onDelete: '&?'
        },
        link: function(scope, element, attrs) {
            var fileUrl = scope.file.fileurl || scope.file.url,
                fileName = scope.file.filename,
                fileSize = scope.file.filesize,
                timeModified = attrs.timemodified || 0,
                siteId = $mmSite.getId(),
                component = attrs.component,
                componentId = attrs.componentId,
                alwaysDownload = attrs.alwaysDownload && attrs.alwaysDownload !== 'false',
                observer;
            if (!fileName) {
                return;
            }
            scope.filename = fileName;
            scope.fileicon = $mmFS.getFileIcon(fileName);
            getState(scope, siteId, fileUrl, timeModified, alwaysDownload);
            $mmFilepool.getFileEventNameByUrl(siteId, fileUrl).then(function(eventName) {
                observer = $mmEvents.on(eventName, function(data) {
                    getState(scope, siteId, fileUrl, timeModified, alwaysDownload);
                    if (!data.success) {
                        $mmUtil.showErrorModal('mm.core.errordownloading', true);
                    }
                });
            });
            scope.download = function(e, openAfterDownload) {
                e.preventDefault();
                e.stopPropagation();
                var promise;
                if (scope.isDownloading && !openAfterDownload) {
                    return;
                }
                if (!$mmApp.isOnline() && (!openAfterDownload || (openAfterDownload && !scope.isDownloaded))) {
                    $mmUtil.showErrorModal('mm.core.networkerrormsg', true);
                    return;
                }
                if (openAfterDownload) {
                    openFile(scope, siteId, fileUrl, fileSize, component, componentId, timeModified, alwaysDownload)
                            .catch(function(error) {
                        $mmUtil.showErrorModal(error);
                    });
                } else {
                    promise = fileSize ? $mmUtil.confirmDownloadSize(fileSize) : $q.when();
                    promise.then(function() {
                        $mmFilepool.invalidateFileByUrl(siteId, fileUrl).finally(function() {
                            scope.isDownloading = true;
                            $mmFilepool.addToQueueByUrl(siteId, fileUrl, component, componentId, timeModified);
                        });
                    });
                }
            };
            if (scope.canDelete) {
                scope.delete = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (scope.onDelete) {
                        scope.onDelete();
                    }
                };
            }
            scope.$on('$destroy', function() {
                if (observer && observer.off) {
                    observer.off();
                }
            });
        }
    };
}]);

angular.module('mm.core')
.directive('mmFormatText', ["$interpolate", "$mmText", "$compile", "$translate", function($interpolate, $mmText, $compile, $translate) {
    var extractVariableRegex = new RegExp('{{([^|]+)(|.*)?}}', 'i'),
        tagsToIgnore = ['AUDIO', 'VIDEO', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'];
        function addExternalContent(el, component, componentId, siteId) {
        el.setAttribute('mm-external-content', '');
        if (component) {
            el.setAttribute('component', component);
            if (componentId) {
                el.setAttribute('component-id', componentId);
            }
        }
        if (siteId) {
            el.setAttribute('siteid', siteId);
        }
    }
        function calculateShorten(element, shorten) {
        var multiplier;
        if (typeof shorten == 'string' && shorten.indexOf('%') > -1) {
            multiplier = parseInt(shorten.replace(/%/g, '').trim()) / 100;
            if (isNaN(multiplier)) {
                multiplier = 0.3;
            }
        } else if (typeof shorten != 'undefined' && shorten === '') {
            multiplier = 0.3;
        } else {
            var number = parseInt(shorten);
            if (isNaN(number)) {
                return;
            } else {
                return number;
            }
        }
        var el = element[0],
            elWidth = el.offsetWidth || el.width || el.clientWidth;
        if (!elWidth) {
            return 100;
        } else {
            return Math.round(elWidth * multiplier);
        }
    }
        function addMediaAdaptClass(el) {
        angular.element(el).addClass('mm-media-adapt-width');
    }
        function formatAndRenderContents(scope, element, attrs, text) {
        if (typeof text == 'undefined') {
            element.removeClass('hide');
            return;
        }
        attrs.shorten = calculateShorten(element, attrs.shorten);
        var shorten = (attrs.expandOnClick || attrs.fullviewOnClick) ? 0 : attrs.shorten;
        text = $interpolate(text)(scope);
        text = text.trim();
        formatContents(scope, element, attrs, text, shorten).then(function(fullText) {
            if (attrs.shorten && (attrs.expandOnClick || attrs.fullviewOnClick)) {
                var shortened = $mmText.shortenText($mmText.cleanTags(fullText, false), parseInt(attrs.shorten)),
                    expanded = false;
                if (shortened.trim() === '') {
                    var hasContent = false,
                        meaningfulTags = ['img', 'video', 'audio'];
                    angular.forEach(meaningfulTags, function(tag) {
                        if (fullText.indexOf('<'+tag) > -1) {
                            hasContent = true;
                        }
                    });
                    if (hasContent) {
                        shortened = $translate.instant(attrs.expandOnClick ? 'mm.core.clicktohideshow' : 'mm.core.clicktoseefull');
                    }
                }
                element.on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var target = e.target;
                    if (tagsToIgnore.indexOf(target.tagName) === -1 || (target.tagName === 'A' && !target.getAttribute('href'))) {
                        if (attrs.expandOnClick) {
                            expanded = !expanded;
                            element.html( expanded ? fullText : shortened);
                            if (expanded) {
                                $compile(element.contents())(scope);
                            }
                        } else {
                            $mmText.expandText(attrs.expandTitle || $translate.instant('mm.core.description'), text,
                                attrs.newlinesOnFullview);
                        }
                    }
                });
                renderText(scope, element, shortened, attrs.afterRender);
            } else {
                renderText(scope, element, fullText, attrs.afterRender);
            }
        });
    }
        function formatContents(scope, element, attrs, text, shorten) {
        var siteId = scope.siteid,
            component = attrs.component,
            componentId = attrs.componentId;
        return $mmText.formatText(text, attrs.clean, attrs.singleline, shorten).then(function(formatted) {
            var el = element[0],
                elWidth = el.offsetWidth || el.width || el.clientWidth,
                dom = angular.element('<div>').html(formatted);
            angular.forEach(dom.find('a'), function(anchor) {
                anchor.setAttribute('mm-link', '');
                anchor.setAttribute('capture-link', true);
                addExternalContent(anchor, component, componentId, siteId);
            });
            angular.forEach(dom.find('img'), function(img) {
                addMediaAdaptClass(img);
                addExternalContent(img, component, componentId, siteId);
                if (!attrs.notAdaptImg) {
                    var imgWidth = img.offsetWidth || img.width || img.clientWidth;
                    if (imgWidth > elWidth) {
                        var div = angular.element('<div class="mm-adapted-img-container"></div>'),
                            jqImg = angular.element(img),
                            label = $mmText.escapeHTML($translate.instant('mm.core.openfullimage')),
                            imgSrc = $mmText.escapeHTML(img.getAttribute('src'));
                        img.style.float = '';
                        jqImg.wrap(div);
                        jqImg.after('<a href="#" class="mm-image-viewer-icon" mm-image-viewer img="' + imgSrc +
                                        '" aria-label="' + label + '"><i class="icon ion-ios-search-strong"></i></a>');
                    }
                }
            });
            angular.forEach(dom.find('audio'), function(el) {
                treatMedia(el, component, componentId, siteId);
            });
            angular.forEach(dom.find('video'), function(el) {
                treatMedia(el, component, componentId, siteId);
                el.setAttribute('data-tap-disabled', true);
            });
            angular.forEach(dom.find('iframe'), addMediaAdaptClass);
            if (ionic.Platform.isIOS()) {
                angular.forEach(dom.find('select'), function(select) {
                    select.setAttribute('mm-ios-select-fix', '');
                });
            }
            angular.forEach(dom[0].querySelectorAll('.button'), function(button) {
                if (button.querySelector('a')) {
                    angular.element(button).addClass('mm-button-with-inner-link');
                }
            });
            return dom.html();
        });
    }
        function renderText(scope, element, text, afterRender) {
        element.html(text);
        element.removeClass('hide');
        $compile(element.contents())(scope);
        if (afterRender && scope[afterRender]) {
            scope[afterRender](scope);
        }
    }
        function treatMedia(el, component, componentId, siteId) {
        addMediaAdaptClass(el);
        addExternalContent(el, component, componentId, siteId);
        angular.forEach(angular.element(el).find('source'), function(source) {
            source.setAttribute('target-src', source.getAttribute('src'));
            source.removeAttribute('src');
            addExternalContent(source, component, componentId, siteId);
        });
    }
    return {
        restrict: 'EA',
        scope: true,
        link: function(scope, element, attrs) {
            element.addClass('hide');
            var content = element.html();
            if (attrs.watch) {
                var matches = content.match(extractVariableRegex);
                if (matches && typeof matches[1] == 'string') {
                    var variable = matches[1].trim();
                    scope.$watch(variable, function() {
                        formatAndRenderContents(scope, element, attrs, content);
                    });
                }
            } else {
                formatAndRenderContents(scope, element, attrs, content);
            }
        }
    };
}]);

angular.module('mm.core')
.directive('mmIframe', ["$mmUtil", function($mmUtil) {
    var errorShownTime = 0,
        tags = ['iframe', 'frame', 'object', 'embed'];
        function treatFrame(element) {
        if (element) {
            redefineWindowOpen(element);
            treatLinks(element);
            element.on('load', function() {
                redefineWindowOpen(element);
                treatLinks(element);
            });
        }
    }
        function redefineWindowOpen(element) {
        var el = element[0],
            contentWindow = element.contentWindow || el.contentWindow,
            contents = element.contents();
        if (!contentWindow && el && el.contentDocument) {
            contentWindow = el.contentDocument.defaultView;
        }
        if (!contentWindow && el && el.getSVGDocument) {
            var svgDoc = el.getSVGDocument();
            if (svgDoc && svgDoc.defaultView) {
                contents = angular.element(svgdoc);
                contentWindow = svgdoc.defaultView;
            } else if (el.window) {
                contentWindow = el.window;
            } else if (el.getWindow) {
                contentWindow = el.getWindow();
            }
        }
        if (contentWindow) {
            contentWindow.open = function () {
                var currentTime = new Date().getTime();
                if (currentTime - errorShownTime > 500) {
                    errorShownTime = currentTime;
                    $mmUtil.showErrorModal('mm.core.erroropenpopup', true);
                }
                return {};
            };
        }
        angular.forEach(tags, function(tag) {
            angular.forEach(contents.find(tag), function(subelement) {
                treatFrame(angular.element(subelement));
            });
        });
    }
        function treatLinks(element) {
        var links = element.contents().find('a');
        angular.forEach(links, function(el) {
            var href = el.href;
            if (href) {
                if (href.indexOf('http') === 0) {
                    angular.element(el).on('click', function(e) {
                        if (!e.defaultPrevented) {
                            e.preventDefault();
                            $mmUtil.openInBrowser(href);
                        }
                    });
                } else if (el.target == '_parent' || el.target == '_top' || el.target == '_blank') {
                    angular.element(el).on('click', function(e) {
                        if (!e.defaultPrevented) {
                            e.preventDefault();
                            $mmUtil.openInApp(href);
                        }
                    });
                } else if (ionic.Platform.isIOS() && (!el.target || el.target == '_self')) {
                    angular.element(el).on('click', function(e) {
                        if (!e.defaultPrevented) {
                            if (element[0].tagName.toLowerCase() == 'object') {
                                e.preventDefault();
                                element.attr('data', href);
                            } else {
                                e.preventDefault();
                                element.attr('src', href);
                            }
                        }
                    });
                }
            }
        });
    }
    return {
        restrict: 'E',
        template: '<div class="iframe-wrapper"><iframe class="mm-iframe" ng-style="{\'width\': width, \'height\': height}" ng-src="{{src}}"></iframe></div>',
        scope: {
            src: '='
        },
        link: function(scope, element, attrs) {
            scope.width = $mmUtil.formatPixelsSize(attrs.iframeWidth) || '100%';
            scope.height = $mmUtil.formatPixelsSize(attrs.iframeHeight) || '100%';
            var iframe = angular.element(element.find('iframe')[0]);
            treatFrame(iframe);
        }
    };
}]);

angular.module('mm.core')
.directive('mmImageViewer', ["$ionicModal", function($ionicModal) {
    return {
        restrict: 'A',
        priority: 500,
        scope: true,
        link: function(scope, element, attrs) {
            if (attrs.img) {
                scope.img = attrs.img;
                scope.closeModal = function(){
                    scope.modal.hide();
                };
                element.on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!scope.modal) {
                        $ionicModal.fromTemplateUrl('core/templates/imageviewer.html', {
                            scope: scope,
                            animation: 'slide-in-up'
                        }).then(function(m) {
                            scope.modal = m;
                            scope.modal.show();
                        });
                    } else {
                        scope.modal.show();
                    }
                });
                scope.$on('$destroy', function() {
                    if (scope.modal) {
                        scope.modal.remove();
                    }
                });
            }
        }
    };
}]);

angular.module('mm.core')
.directive('mmIosSelectFix', function() {
    return {
        restrict: 'A',
        priority: 100,
        scope: false,
        require: 'select',
        link: function(scope, element) {
            if (ionic.Platform.isIOS()) {
                scope.$watch(function() {
                    return element.html();
                }, function() {
                    if (!element[0].querySelector('optgroup')) {
                        element.append('<optgroup label=""></optgroup>');
                    }
                });
            }
        }
    };
});

angular.module('mm.core')
.directive('mmLink', ["$mmUtil", "$mmContentLinksHelper", "$location", function($mmUtil, $mmContentLinksHelper, $location) {
        function navigate(href) {
        if (href.indexOf('cdvfile://') === 0 || href.indexOf('file://') === 0) {
            $mmUtil.openFile(href).catch(function(error) {
                $mmUtil.showErrorModal(error);
            });
        } else if (href.charAt(0) == '#'){
            href = href.substr(1);
            if (href.charAt(0) == '/') {
                $location.url(href);
            } else {
                $mmUtil.scrollToElement(document, "#" + href + ", [name='" + href + "']");
            }
        } else {
            $mmUtil.openInBrowser(href);
        }
    }
    return {
        restrict: 'A',
        priority: 100,
        link: function(scope, element, attrs) {
            element.on('click', function(event) {
                var href = element[0].getAttribute('href');
                if (href) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (attrs.captureLink && attrs.captureLink !== 'false') {
                        $mmContentLinksHelper.handleLink(href).then(function(treated) {
                            if (!treated) {
                               navigate(href);
                            }
                        });
                    } else {
                        navigate(href);
                    }
                }
            });
        }
    };
}]);

angular.module('mm.core')
.directive('mmLoading', ["$translate", function($translate) {
    return {
        restrict: 'E',
        templateUrl: 'core/templates/loading.html',
        transclude: true,
        scope: {
            hideUntil: '=?',
            message: '@?',
            dynMessage: '=?',
            loadingPaddingTop: '=?'
        },
        link: function(scope, element, attrs) {
            var el = element[0],
                loading = angular.element(el.querySelector('.mm-loading-container'));
            if (!attrs.message) {
                $translate('mm.core.loading').then(function(loadingString) {
                    scope.message = loadingString;
                });
            }
            if (attrs.loadingPaddingTop) {
                scope.$watch('loadingPaddingTop', function(newValue) {
                    var num = parseInt(newValue);
                    if (num >= 0 || num < 0) {
                        loading.css('padding-top', newValue + 'px');
                    } else if(typeof newValue == 'string') {
                        loading.css('padding-top', newValue);
                    }
                });
            }
        }
    };
}]);

angular.module('mm.core')
.directive('mmLocalFile', ["$mmFS", "$mmText", "$mmUtil", "$timeout", "$translate", function($mmFS, $mmText, $mmUtil, $timeout, $translate) {
    function loadFileBasicData(scope, file) {
        scope.fileName = file.name;
        scope.fileIcon = $mmFS.getFileIcon(file.name);
        scope.fileExtension = $mmFS.getFileExtension(file.name);
    }
    return {
        restrict: 'E',
        templateUrl: 'core/templates/localfile.html',
        scope: {
            file: '=',
            manage: '=?',
            fileDeleted: '&?',
            fileRenamed: '&?',
            overrideClick: '=?',
            fileClicked: '&?'
        },
        link: function(scope, element) {
            var file = scope.file,
                relativePath;
            if (!file || !file.name) {
                return;
            }
            relativePath = $mmFS.removeBasePath(file.toURL());
            if (!relativePath) {
                relativePath = file.fullPath;
            }
            loadFileBasicData(scope, file);
            scope.data = {};
            $mmFS.getMetadata(file).then(function(metadata) {
                if (metadata.size >= 0) {
                    scope.size = $mmText.bytesToSize(metadata.size, 2);
                }
                scope.timeModified = moment(metadata.modificationTime).format('LLL');
            });
            scope.open = function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (scope.overrideClick && scope.fileClicked) {
                    scope.fileClicked();
                } else {
                    $mmUtil.openFile(file.toURL());
                }
            };
            scope.activateEdit = function(e) {
                e.preventDefault();
                e.stopPropagation();
                scope.editMode = true;
                scope.data.filename = file.name;
                $timeout(function() {
                    $mmUtil.focusElement(element[0].querySelector('input'));
                });
            };
            scope.changeName = function(e, newName) {
                e.preventDefault();
                e.stopPropagation();
                if (newName == file.name) {
                    scope.editMode = false;
                    return;
                }
                var modal = $mmUtil.showModalLoading(),
                    fileAndDir = $mmFS.getFileAndDirectoryFromPath(relativePath),
                    newPath = $mmFS.concatenatePaths(fileAndDir.directory, newName);
                $mmFS.getFile(newPath).then(function() {
                    $mmUtil.showErrorModal('mm.core.errorfileexistssamename', true);
                }).catch(function() {
                    return $mmFS.moveFile(relativePath, newPath).then(function(fileEntry) {
                        scope.editMode = false;
                        scope.file = file = fileEntry;
                        loadFileBasicData(scope, file);
                        scope.fileRenamed && scope.fileRenamed({file: file});
                    }).catch(function() {
                        $mmUtil.showErrorModal('mm.core.errorrenamefile', true);
                    });
                }).finally(function() {
                    modal.dismiss();
                });
            };
            scope.deleteFile = function(e) {
                e.preventDefault();
                e.stopPropagation();
                $mmUtil.showConfirm($translate.instant('mm.core.confirmdeletefile')).then(function() {
                    var modal = $mmUtil.showModalLoading();
                    $mmFS.removeFile(relativePath).then(function() {
                        scope.fileDeleted && scope.fileDeleted();
                    }).catch(function() {
                        $mmUtil.showErrorModal('mm.core.errordeletefile', true);
                    }).finally(function() {
                        modal.dismiss();
                    });
                });
            };
        }
    };
}]);

angular.module('mm.core')
.directive('mmNavigationBar', ["$state", "$translate", function($state, $translate) {
    return {
        restrict: 'E',
        scope: {
            previous: '=?',
            next: '=?',
            action: '=?',
            info: '=?'
        },
        templateUrl: 'core/templates/navigationbar.html',
        link: function(scope, element, attrs) {
            scope.title = attrs.title || $translate.instant('mm.core.info');
            scope.showInfo = function() {
                $state.go('site.mm_textviewer', {
                    title: scope.title,
                    content: scope.info
                });
            };
        }
    };
}]);

angular.module('mm.core')
.directive('mmNoInputValidation', function() {
    return {
        restrict: 'A',
        priority: 500,
        compile: function(el, attrs) {
            attrs.$set('type',
                null,               
                false               
            );
        }
    }
});

angular.module('mm.core')
.directive('mmRichTextEditor', ["$ionicPlatform", "$mmLang", "$timeout", "$q", "$window", "$ionicScrollDelegate", "$mmUtil", "$mmSite", "$mmFilepool", function($ionicPlatform, $mmLang, $timeout, $q, $window, $ionicScrollDelegate, $mmUtil,
            $mmSite, $mmFilepool) {
    var editorInitialHeight = 300,
        frameTags = ['iframe', 'frame', 'object', 'embed'];
        function calculateFixedBarsHeight(editorEl) {
        var ionContentEl = editorEl.parentElement;
        while (ionContentEl && ionContentEl.nodeName != 'ION-CONTENT') {
            ionContentEl = ionContentEl.parentElement;
        }
        if (ionContentEl.nodeName == 'ION-CONTENT') {
            ionContentHeight = ionContentEl.offsetHeight || ionContentEl.height || ionContentEl.clientHeight;
            return $window.innerHeight - ionContentHeight;
        } else {
            return 0;
        }
    }
        function changeLanguageCode(lang) {
        var split = lang.split('-');
        if (split.length > 1) {
            split[1] = split[1].toUpperCase();
            return split.join('_');
        } else {
            return lang;
        }
    }
        function getCKEditorController(element) {
        var ckeditorEl = element.querySelector('textarea[ckeditor]');
        if (ckeditorEl) {
            return angular.element(ckeditorEl).controller('ckeditor');
        }
    }
        function searchAndFormatWysiwyg(element, component, componentId, tries) {
        if (typeof tries == 'undefined') {
            tries = 0;
        }
        var wysiwygIframe = element.querySelector('.cke_wysiwyg_frame');
        if (wysiwygIframe) {
            treatFrame(wysiwygIframe, component, componentId);
            return $q.when(wysiwygIframe);
        } else if (tries < 5) {
            return $timeout(function() {
                return searchAndFormatWysiwyg(element, component, componentId, tries+1);
            }, 100);
        }
    }
        function treatFrame(element, component, componentId) {
        if (element) {
            var loaded = false;
            element = angular.element(element);
            element.on('load', function() {
                if (!loaded) {
                    loaded = true;
                    treatExternalContent(element, component, componentId);
                    treatSubframes(element, component, componentId);
                }
            });
            $timeout(function() {
                if (!loaded) {
                    loaded = true;
                    treatExternalContent(element, component, componentId);
                    treatSubframes(element, component, componentId);
                }
            }, 1000);
        }
    }
        function treatSubframes(element, component, componentId) {
        var el = element[0],
            contentWindow = element.contentWindow || el.contentWindow,
            contents = element.contents();
        if (!contentWindow && el && el.contentDocument) {
            contentWindow = el.contentDocument.defaultView;
        }
        if (!contentWindow && el && el.getSVGDocument) {
            var svgDoc = el.getSVGDocument();
            if (svgDoc && svgDoc.defaultView) {
                contents = angular.element(svgdoc);
            }
        }
        angular.forEach(frameTags, function(tag) {
            angular.forEach(contents.find(tag), function(subelement) {
                treatFrame(angular.element(subelement), component, componentId);
            });
        });
    }
        function treatExternalContent(element, component, componentId) {
        var elements = element.contents().find('img');
        angular.forEach(elements, function(el) {
            var url = el.src,
                siteId = $mmSite.getId();
            if (!url || !$mmUtil.isDownloadableUrl(url) || (!$mmSite.canDownloadFiles() && $mmUtil.isPluginFileUrl(url))) {
                return;
            }
            return $mmFilepool.getSrcByUrl(siteId, url, component, componentId).then(function(finalUrl) {
                el.setAttribute('src', finalUrl);
            });
        });
    }
    return {
        restrict: 'E',
        templateUrl: 'core/templates/richtexteditor.html',
        scope: {
            model: '=',
            placeholder: '@?',
            options: '=?',
            tabletOptions: '=?',
            phoneOptions: '=?',
            scrollHandle: '@?',
            name: '@?',
            textChange: '&?',
            firstRender: '&?',
            component: '@?',
            componentId: '@?'
        },
        link: function(scope, element) {
            element = element[0];
            var defaultOptions = {
                    allowedContent: true,
                    defaultLanguage: 'en',
                    height: editorInitialHeight,
                    toolbarCanCollapse: true,
                    toolbarStartupExpanded: false,
                    toolbar: [
                        {name: 'basicstyles', items: ['Bold', 'Italic']},
                        {name: 'styles', items: ['Format']},
                        {name: 'links', items: ['Link', 'Unlink']},
                        {name: 'lists', items: ['NumberedList', 'BulletedList']},
                        '/',
                        {name: 'document', items: ['Source', 'RemoveFormat']},
                        {name: 'tools', items: [ 'Maximize' ]}
                    ],
                    toolbarLocation: 'bottom',
                    removePlugins: 'elementspath,resize,pastetext,pastefromword,clipboard,image',
                    removeButtons: ''
                },
                scrollView,
                resized = false,
                fixedBarsHeight,
                component = scope.component,
                componentId = scope.componentId,
                firstChange = true,
                renderTime;
            if (scope.scrollHandle) {
                scrollView = $ionicScrollDelegate.$getByHandle(scope.scrollHandle);
            }
            $mmUtil.isRichTextEditorEnabled().then(function(enabled) {
                scope.richTextEditor = !!enabled;
                renderTime = new Date().getTime();
                if (enabled) {
                    $mmLang.getCurrentLanguage().then(function(lang) {
                        defaultOptions.language = changeLanguageCode(lang);
                        if ($ionicPlatform.isTablet()) {
                            scope.editorOptions = angular.extend(defaultOptions, scope.options, scope.tabletOptions);
                        } else {
                            scope.editorOptions = angular.extend(defaultOptions, scope.options, scope.phoneOptions);
                        }
                    });
                }
            });
            scope.editorReady = function() {
                var collapser = element.querySelector('.cke_toolbox_collapser'),
                    firstButton = element.querySelector('.cke_toolbox_main .cke_toolbar:first-child'),
                    lastButton = element.querySelector('.cke_toolbox_main .cke_toolbar:last-child'),
                    toolbar = element.querySelector('.cke_bottom'),
                    editorEl = element.querySelector('.cke'),
                    contentsEl = element.querySelector('.cke_contents'),
                    sourceCodeButton = element.querySelector('.cke_button__source'),
                    seeingSourceCode = false,
                    wysiwygIframe,
                    unregisterDialogListener,
                    editorController;
                searchAndFormatWysiwyg(element, component, componentId).then(function(iframe) {
                    wysiwygIframe = iframe;
                });
                if (firstButton && lastButton && collapser && toolbar) {
                    if (firstButton.offsetTop == lastButton.offsetTop) {
                        angular.element(collapser).css('display', 'none');
                    }
                    angular.element(collapser).on('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        angular.element(toolbar).toggleClass('cke_expanded');
                        if (resized) {
                            resizeContent(editorEl, contentsEl, toolbar);
                        }
                    });
                }
                if (sourceCodeButton) {
                    angular.element(sourceCodeButton).on('click', function() {
                        $timeout(function() {
                            seeingSourceCode = !seeingSourceCode;
                            if (!seeingSourceCode) {
                                searchAndFormatWysiwyg(element, component, componentId).then(function(iframe) {
                                    wysiwygIframe = iframe;
                                });
                            }
                        });
                    });
                }
                if (scope.richTextEditor && scope.firstRender) {
                    $timeout(function() {
                        if (firstChange) {
                            scope.firstRender();
                            firstChange = false;
                        }
                    }, 1000);
                }
                editorController = getCKEditorController(element);
                ionic.on('resize', onResize, window);
                scope.$on('$destroy', function() {
                    if (editorController && editorController.instance) {
                        editorController.instance.destroy(false);
                    }
                    ionic.off('resize', onResize, window);
                    if (unregisterDialogListener) {
                        unregisterDialogListener();
                    }
                });
                function onResize() {
                    resizeContent(editorEl, contentsEl, toolbar);
                    if (firstButton.offsetTop == lastButton.offsetTop) {
                        angular.element(collapser).css('display', 'none');
                    } else {
                        angular.element(collapser).css('display', 'block');
                    }
                }
            };
            scope.onChange = function() {
                if (scope.richTextEditor && firstChange && scope.firstRender && new Date().getTime() - renderTime < 1000) {
                    scope.firstRender();
                }
                firstChange = false;
                if (scope.textChange) {
                    scope.textChange();
                }
            };
            function resizeContent(editorEl, contentsEl, toolbar) {
                var toolbarHeight = toolbar.offsetHeight || toolbar.height || toolbar.clientHeight || 0,
                    editorHeightWithoutResize = editorInitialHeight + toolbarHeight,
                    contentVisibleHeight,
                    editorContentNewHeight,
                    screenSmallerThanEditor;
                if (typeof fixedBarsHeight == 'undefined') {
                    fixedBarsHeight = calculateFixedBarsHeight(editorEl);
                }
                contentVisibleHeight = $window.innerHeight - fixedBarsHeight;
                screenSmallerThanEditor = contentVisibleHeight > 0 && contentVisibleHeight < editorHeightWithoutResize;
                editorContentNewHeight = contentVisibleHeight - toolbarHeight;
                if (resized && !screenSmallerThanEditor) {
                    undoResize(editorEl, contentsEl);
                } else if (editorContentNewHeight > 50 && (resized || screenSmallerThanEditor)) {
                    angular.element(editorEl).css('height', contentVisibleHeight + 'px');
                    angular.element(contentsEl).css('height', editorContentNewHeight + 'px');
                    resized = true;
                    if (scrollView) {
                        var focused = document.activeElement;
                        if (focused) {
                            var parentEditor = $mmUtil.closest(focused, '.cke');
                            if (parentEditor == editorEl) {
                                $mmUtil.scrollToElement(editorEl, undefined, scrollView);
                            }
                        }
                    }
                }
            }
            function undoResize(editorEl, contentsEl) {
                angular.element(editorEl).css('height', 'auto');
                angular.element(contentsEl).css('height', editorInitialHeight + 'px');
                resized = false;
            }
        }
    };
}]);

angular.module('mm.core')
.directive('mmSitePicker', ["$mmSitesManager", "$mmSite", "$translate", "$mmText", "$q", function($mmSitesManager, $mmSite, $translate, $mmText, $q) {
    return {
        restrict: 'E',
        templateUrl: 'core/templates/sitepicker.html',
        scope: {
            siteSelected: '&',
            initialSite: '@?'
        },
        link: function(scope) {
            scope.selectedSite = scope.initialSite || $mmSite.getId();
            $mmSitesManager.getSites().then(function(sites) {
                var promises = [];
                sites.forEach(function(site) {
                    promises.push($mmText.formatText(site.sitename, true, true).catch(function() {
                        return site.sitename;
                    }).then(function(formatted) {
                        site.fullnameandsitename = $translate.instant('mm.core.fullnameandsitename',
                                {fullname: site.fullname, sitename: formatted});
                    }));
                });
                return $q.all(promises).then(function() {
                    scope.sites = sites;
                });
            });
        }
    };
}]);

angular.module('mm.core')
.constant('mmCoreSplitViewLoad', 'mmSplitView:load')
.directive('mmSplitView', ["$log", "$state", "$ionicPlatform", "$timeout", "$mmUtil", "$interpolate", "mmCoreSplitViewLoad", function($log, $state, $ionicPlatform, $timeout, $mmUtil, $interpolate, mmCoreSplitViewLoad) {
    $log = $log.getInstance('mmSplitView');
        function triggerClick(link) {
        if (link && link.length && link.triggerHandler) {
            link.triggerHandler('click');
            return true;
        }
        return false;
    }
    function controller() {
        var self = this,
            element,
            menuState,
            linkToLoad,
            component;
                this.clearMarkedLinks = function() {
            angular.element(element.querySelectorAll('[mm-split-view-link]')).removeClass('mm-split-item-selected');
        };
                this.getComponent = function() {
            return component;
        };
                this.getMenuState = function() {
            return menuState || $state.current.name;
        };
                this.loadLink = function(scope, loadAttr, retrying) {
            if ($ionicPlatform.isTablet()) {
                if (!linkToLoad) {
                    if (typeof loadAttr != 'undefined') {
                        var position = parseInt(loadAttr);
                        if (!position) {
                            position = parseInt($interpolate(loadAttr)(scope), 10);
                        }
                        if (position) {
                            var links = element.querySelectorAll('[mm-split-view-link]');
                            position = position > links.length ? 0 : position - 1;
                            linkToLoad = angular.element(links[position]);
                        } else {
                            linkToLoad = angular.element(element.querySelector('[mm-split-view-link]'));
                        }
                    } else {
                        linkToLoad = angular.element(element.querySelector('[mm-split-view-link]'));
                    }
                }
                if (!triggerClick(linkToLoad)) {
                    if (!retrying) {
                        linkToLoad = undefined;
                        $timeout(function() {
                            self.loadLink(scope, loadAttr, true);
                        });
                    }
                }
            }
        };
                this.setComponent = function(cmp) {
            component = cmp;
        };
                this.setElement = function(el) {
            element = el;
        };
                this.setLink = function(link) {
            linkToLoad = link;
        };
                this.setMenuState = function(state) {
            menuState = state;
        };
    }
    return {
        restrict: 'E',
        templateUrl: 'core/templates/splitview.html',
        transclude: true,
        controller: controller,
        link: function(scope, element, attrs, controller) {
            var el = element[0],
                menu = angular.element(el.querySelector('.mm-split-pane-menu')),
                menuState = attrs.menuState || $state.$current.name,
                menuParams = $state.params,
                menuWidth = attrs.menuWidth,
                component = attrs.component || 'tablet';
            scope.component = component;
            controller.setComponent(component);
            controller.setElement(el);
            controller.setMenuState(menuState);
            if (menuWidth && $ionicPlatform.isTablet()) {
                menu.css('width', menuWidth);
                menu.css('-webkit-flex-basis', menuWidth);
                menu.css('-moz-flex-basis', menuWidth);
                menu.css('-ms-flex-basis', menuWidth);
                menu.css('flex-basis', menuWidth);
            }
            if (attrs.loadWhen) {
                scope.$watch(attrs.loadWhen, function(newValue) {
                    if (newValue) {
                        controller.loadLink(scope, attrs.load);
                    }
                });
            } else {
                controller.loadLink(scope, attrs.load);
            }
            scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                if (toState.name === menuState && $mmUtil.basicLeftCompare(toParams, menuParams, 1)) {
                    controller.loadLink();
                }
            });
            scope.$on(mmCoreSplitViewLoad, function(e, data) {
                if (data && data.load) {
                    controller.loadLink(scope, data.load);
                } else {
                    controller.loadLink(scope, attrs.load);
                }
            });
        }
    };
}]);

angular.module('mm.core')
.directive('mmSplitViewLink', ["$log", "$ionicPlatform", "$state", "$mmApp", function($log, $ionicPlatform, $state, $mmApp) {
    $log = $log.getInstance('mmSplitViewLink');
    var srefRegex = new RegExp(/([^\(]*)(\((.*)\))?$/);
        function createTabletState(stateName, tabletStateName, newViewName) {
        var targetState = $state.get(stateName),
            newConfig,
            viewName;
        if (targetState) {
            newConfig = angular.copy(targetState);
            viewName = Object.keys(newConfig.views)[0];
            newConfig.views[newViewName] = newConfig.views[viewName];
            delete newConfig.views[viewName];
            delete newConfig['name'];
            $mmApp.createState(tabletStateName, newConfig);
            return true;
        } else {
            $log.error('State doesn\'t exist: '+stateName);
            return false;
        }
    }
        function scopeEval(scope, value) {
        if (typeof value == 'string') {
            try {
                return scope.$eval(value);
            } catch(ex) {
                $log.error('Error evaluating string: ' + param);
            }
        }
    }
    return {
        restrict: 'A',
        require: '^mmSplitView',
        link: function(scope, element, attrs, splitViewController) {
            var sref = attrs.mmSplitViewLink,
                menuState = splitViewController.getMenuState(),
                matches,
                stateName,
                stateParams,
                stateParamsString,
                tabletStateName;
            if (sref) {
                matches = sref.match(srefRegex);
                if (matches && matches.length) {
                    stateName = matches[1];
                    tabletStateName = menuState + '.' + stateName.substr(stateName.lastIndexOf('.') + 1);
                    stateParamsString = matches[3];
                    stateParams = scopeEval(scope, stateParamsString);
                    scope.$watch(stateParamsString, function(newVal) {
                        stateParams = newVal;
                    });
                    element.on('click', function(event) {
                        event.stopPropagation();
                        event.preventDefault();
                        if ($ionicPlatform.isTablet()) {
                            if (!$state.get(tabletStateName)) {
                                if (!createTabletState(stateName, tabletStateName, splitViewController.getComponent())) {
                                    return;
                                }
                            }
                            splitViewController.setLink(element);
                            splitViewController.clearMarkedLinks();
                            element.addClass('mm-split-item-selected');
                            $state.go(tabletStateName, stateParams, {location:'replace'});
                        } else {
                            $state.go(stateName, stateParams);
                        }
                    });
                } else {
                    $log.error('Invalid sref.');
                }
            } else {
                $log.error('Invalid sref.');
            }
        }
    };
}]);

angular.module('mm.core')
.directive('mmStateClass', ["$state", function($state) {
    return {
        restrict: 'A',
        link: function(scope, el) {
            var current = $state.$current.name,
                split,
                className = 'mm-';
            if (typeof current == 'string') {
                split = current.split('.');
                className += split.shift();
                if (split.length) {
                    className += '_' + split.pop();
                }
                el.addClass(className);
            }
        }
    };
}]);

angular.module('mm.core')
.directive('mmTimer', ["$interval", "$mmUtil", function($interval, $mmUtil) {
    return {
        restrict: 'E',
        scope: {
            endTime: '=',
            finished: '&'
        },
        templateUrl: 'core/templates/timer.html',
        link: function(scope, element, attrs) {
            if (!scope.endTime || !scope.finished) {
                return;
            }
            var timeLeftClass = attrs.timeLeftClass || 'mm-timer-timeleft-',
                timeInterval;
            element.addClass('mm-timer');
            scope.text = attrs.timerText || '';
            timeInterval = $interval(function() {
                scope.timeLeft = scope.endTime - $mmUtil.timestamp();
                if (scope.timeLeft < 0) {
                    $interval.cancel(timeInterval);
                    scope.finished();
                    return;
                }
                if (scope.timeLeft < 100 && !element.hasClass(timeLeftClass + scope.timeLeft)) {
                    element.removeClass(timeLeftClass + (scope.timeLeft + 1));
                    element.removeClass(timeLeftClass + (scope.timeLeft + 2));
                    element.addClass(timeLeftClass + scope.timeLeft);
                }
            }, 200);
            scope.$on('$destroy', function() {
                if (timeInterval) {
                    $interval.cancel(timeInterval);
                }
            });
        }
    };
}]);

angular.module('mm.core.comments', [])
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mm_commentviewer', {
        url: '/mm_commentviewer',
        params : {
            contextLevel: null,
            instanceId: null,
            component: null,
            itemId: null,
            area: null,
            page: null,
            title: null
        },
        views: {
            'site': {
                templateUrl: 'core/components/comments/templates/commentviewer.html',
                controller: 'mmCommentViewerCtrl'
            }
        }
    });
}]);

angular.module('mm.core.contentlinks', [])
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('mm_contentlinks', {
        url: '/mm_contentlinks',
        abstract: true,
        templateUrl: 'core/components/contentlinks/templates/base.html',
        cache: false,  
    })
    .state('mm_contentlinks.choosesite', {
        url: '/choosesite',
        templateUrl: 'core/components/contentlinks/templates/choosesite.html',
        controller: 'mmContentLinksChooseSiteCtrl',
        params: {
            url: null
        }
    });
}])
.run(["$log", "$mmURLDelegate", "$mmContentLinksHelper", function($log, $mmURLDelegate, $mmContentLinksHelper) {
    $log = $log.getInstance('mmContentLinks');
    $mmURLDelegate.register('mmContentLinks', $mmContentLinksHelper.handleCustomUrl);
}]);

angular.module('mm.core.course', ['mm.core.courses'])
.constant('mmCoreCoursePriority', 800)
.constant('mmCoreCourseAllSectionsId', -1)
.config(["$stateProvider", "$mmCoursesDelegateProvider", "mmCoreCoursePriority", function($stateProvider, $mmCoursesDelegateProvider, mmCoreCoursePriority) {
    $stateProvider
    .state('site.mm_course', {
        url: '/mm_course',
        params: {
            courseid: null,
            sid: null,
            moduleid: null,
            coursefullname: null
        },
        views: {
            'site': {
                templateUrl: 'core/components/course/templates/sections.html',
                controller: 'mmCourseSectionsCtrl'
            }
        }
    })
    .state('site.mm_course-section', {
        url: '/mm_course-section',
        params: {
            sectionid: null,
            cid: null,
            mid: null
        },
        views: {
            'site': {
                templateUrl: 'core/components/course/templates/section.html',
                controller: 'mmCourseSectionCtrl'
            }
        }
    })
    .state('site.mm_course-modcontent', {
        url: '/mm_course-modcontent',
        params: {
            module: null
        },
        views: {
            site: {
                templateUrl: 'core/components/course/templates/modcontent.html',
                controller: 'mmCourseModContentCtrl'
            }
        }
    });
    $mmCoursesDelegateProvider.registerNavHandler('mmCourse', '$mmCourseCoursesNavHandler', mmCoreCoursePriority);
}])
.run(["$mmEvents", "mmCoreEventLogin", "mmCoreEventSiteUpdated", "$mmCourseDelegate", "mmCoreEventRemoteAddonsLoaded", function($mmEvents, mmCoreEventLogin, mmCoreEventSiteUpdated, $mmCourseDelegate, mmCoreEventRemoteAddonsLoaded) {
    $mmEvents.on(mmCoreEventLogin, $mmCourseDelegate.updateContentHandlers);
    $mmEvents.on(mmCoreEventSiteUpdated, $mmCourseDelegate.updateContentHandlers);
    $mmEvents.on(mmCoreEventRemoteAddonsLoaded, $mmCourseDelegate.updateContentHandlers);
}]);

angular.module('mm.core.courses', [])
.constant('mmCoursesSearchComponent', 'mmCoursesSearch')
.constant('mmCoursesSearchPerPage', 20)
.constant('mmCoursesEnrolInvalidKey', 'mmCoursesEnrolInvalidKey')
.constant('mmCoursesEventMyCoursesUpdated', 'my_courses_updated')
.constant('mmCoursesEventMyCoursesRefreshed', 'my_courses_refreshed')
.constant('mmCoursesAccessMethods', {
     guest: 'guest',
     default: 'default'
})
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mm_courses', {
        url: '/mm_courses',
        views: {
            'site': {
                templateUrl: 'core/components/courses/templates/list.html',
                controller: 'mmCoursesListCtrl'
            }
        }
    })
    .state('site.mm_searchcourses', {
        url: '/mm_searchcourses',
        views: {
            'site': {
                templateUrl: 'core/components/courses/templates/search.html',
                controller: 'mmCoursesSearchCtrl'
            }
        }
    })
    .state('site.mm_viewresult', {
        url: '/mm_viewresult',
        params: {
            course: null
        },
        views: {
            'site': {
                templateUrl: 'core/components/courses/templates/viewresult.html',
                controller: 'mmCoursesViewResultCtrl'
            }
        }
    });
}])
.config(["$mmContentLinksDelegateProvider", function($mmContentLinksDelegateProvider) {
    $mmContentLinksDelegateProvider.registerLinkHandler('mmCourses', '$mmCoursesHandlers.linksHandler');
}])
.run(["$mmEvents", "mmCoreEventLogin", "mmCoreEventSiteUpdated", "mmCoreEventLogout", "$mmCoursesDelegate", "$mmCourses", "mmCoreEventRemoteAddonsLoaded", function($mmEvents, mmCoreEventLogin, mmCoreEventSiteUpdated, mmCoreEventLogout, $mmCoursesDelegate, $mmCourses,
            mmCoreEventRemoteAddonsLoaded) {
    $mmEvents.on(mmCoreEventLogin, $mmCoursesDelegate.updateNavHandlers);
    $mmEvents.on(mmCoreEventSiteUpdated, $mmCoursesDelegate.updateNavHandlers);
    $mmEvents.on(mmCoreEventRemoteAddonsLoaded, $mmCoursesDelegate.updateNavHandlers);
    $mmEvents.on(mmCoreEventLogout, function() {
        $mmCoursesDelegate.clearCoursesHandlers();
        $mmCourses.clearCurrentCourses();
    });
}]);

angular.module('mm.core.fileuploader', ['mm.core'])
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.fileuploader-picker', {
        url: '/fileuploader-picker',
        params: {
            maxsize: -1,
            upload: true
        },
        views: {
            'site': {
                templateUrl: 'core/components/fileuploader/templates/picker.html',
                controller: 'mmFileUploaderPickerCtrl'
            }
        }
    });
}])
.run(["$mmEvents", "mmCoreEventLogin", "mmCoreEventSiteUpdated", "mmCoreEventLogout", "$mmFileUploaderDelegate", "mmCoreEventRemoteAddonsLoaded", function($mmEvents, mmCoreEventLogin, mmCoreEventSiteUpdated, mmCoreEventLogout, $mmFileUploaderDelegate,
            mmCoreEventRemoteAddonsLoaded) {
    $mmEvents.on(mmCoreEventLogin, $mmFileUploaderDelegate.updateHandlers);
    $mmEvents.on(mmCoreEventSiteUpdated, $mmFileUploaderDelegate.updateHandlers);
    $mmEvents.on(mmCoreEventRemoteAddonsLoaded, $mmFileUploaderDelegate.updateHandlers);
    $mmEvents.on(mmCoreEventLogout, $mmFileUploaderDelegate.clearSiteHandlers);
}]);

angular.module('mm.core.login', [])
.config(["$stateProvider", "$urlRouterProvider", "$mmInitDelegateProvider", "mmInitDelegateMaxAddonPriority", function($stateProvider, $urlRouterProvider, $mmInitDelegateProvider, mmInitDelegateMaxAddonPriority) {
    $stateProvider
    .state('mm_login', {
        url: '/mm_login',
        abstract: true,
        templateUrl: 'core/components/login/templates/base.html',
        cache: false,  
        onEnter: ["$ionicHistory", function($ionicHistory) {
            $ionicHistory.clearHistory();
        }]
    })
    .state('mm_login.init', {
        url: '/init',
        templateUrl: 'core/components/login/templates/init.html',
        controller: 'mmLoginInitCtrl',
        cache: false
    })
    .state('mm_login.sites', {
        url: '/sites',
        templateUrl: 'core/components/login/templates/sites.html',
        controller: 'mmLoginSitesCtrl',
        onEnter: ["$mmLoginHelper", "$mmSitesManager", function($mmLoginHelper, $mmSitesManager) {
            $mmSitesManager.hasNoSites().then(function() {
                $mmLoginHelper.goToAddSite();
            });
        }]
    })
    .state('mm_login.site', {
        url: '/site',
        templateUrl: 'core/components/login/templates/site.html',
        controller: 'mmLoginSiteCtrl',
	onEnter: function($state) {
       	 $state.go('mm_login.credentials', {siteurl: 'http://professores.somoseducacao.com.br/'});
    }
        
    })
    .state('mm_login.credentials', {
        url: '/cred',
        templateUrl: 'core/components/login/templates/credentials.html',
        controller: 'mmLoginCredentialsCtrl',
        params: {
            siteurl: 'http://professores.somoseducacao.com.br/',
            username: '',
            urltoopen: ''
        },
        onEnter: ["$state", "$stateParams", function($state, $stateParams) {
            if (!$stateParams.siteurl) {
              $state.go('mm_login.init');
            }
        }]
    })
    .state('mm_login.reconnect', {
        url: '/reconnect',
        templateUrl: 'core/components/login/templates/reconnect.html',
        controller: 'mmLoginReconnectCtrl',
        cache: false,
        params: {
            siteurl: '',
            username: '',
            infositeurl: ''
        }
    });
    $urlRouterProvider.otherwise(function($injector) {
        var $state = $injector.get('$state');
        return $state.href('mm_login.init').replace('#', '');
    });
    $mmInitDelegateProvider.registerProcess('mmLogin', '$mmSitesManager.restoreSession', mmInitDelegateMaxAddonPriority + 200);
}])
.run(["$log", "$state", "$mmUtil", "$translate", "$mmSitesManager", "$rootScope", "$mmSite", "$mmURLDelegate", "$ionicHistory", "$timeout", "$mmEvents", "$mmLoginHelper", "mmCoreEventSessionExpired", "$mmApp", "$ionicPlatform", "mmCoreConfigConstants", function($log, $state, $mmUtil, $translate, $mmSitesManager, $rootScope, $mmSite, $mmURLDelegate, $ionicHistory, $timeout,
                $mmEvents, $mmLoginHelper, mmCoreEventSessionExpired, $mmApp, $ionicPlatform, mmCoreConfigConstants) {
    $log = $log.getInstance('mmLogin');
    var isSSOConfirmShown,
        waitingForBrowser = false;
    $mmEvents.on(mmCoreEventSessionExpired, sessionExpired);
    $mmURLDelegate.register('mmLoginSSO', appLaunchedByURL);
    $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event) {
        var url = event.url.replace(/^http:\/\//, '');
        if (appLaunchedByURL(url)) {
            $mmUtil.closeInAppBrowser();
        }
    });
    $rootScope.$on('$cordovaInAppBrowser:exit', function() {
        waitingForBrowser = false;
    });
    $ionicPlatform.on('resume', function() {
        $timeout(function() {
            waitingForBrowser = false;
        }, 1000);
    });
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (!$mmApp.isReady() && toState.name !== 'mm_login.init') {
            event.preventDefault();
            $state.transitionTo('mm_login.init');
            $log.warn('Forbidding state change to \'' + toState.name + '\'. App is not ready yet.');
            return;
        }
        if (toState.name.substr(0, 8) === 'redirect' || toState.name.substr(0, 15) === 'mm_contentlinks') {
            return;
        } else if ((toState.name.substr(0, 8) !== 'mm_login' || toState.name === 'mm_login.reconnect') && !$mmSite.isLoggedIn()) {
            event.preventDefault();
            $log.debug('Redirect to login page, request was: ' + toState.name);
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.transitionTo('mm_login.init');
        } else if (toState.name.substr(0, 8) === 'mm_login' && toState.name !== 'mm_login.reconnect' && $mmSite.isLoggedIn()) {
            event.preventDefault();
            $log.debug('Redirect to course page, request was: ' + toState.name);
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $mmLoginHelper.goToSiteInitialPage();
        }
    });
    function sessionExpired(siteid) {
        var siteurl = $mmSite.getURL();
        if (typeof(siteurl) !== 'undefined') {
            if (siteid && siteid !== $mmSite.getId()) {
                return;
            }
            $mmSitesManager.checkSite(siteurl).then(function(result) {
                if (result.warning) {
                    $mmUtil.showErrorModal(result.warning, true, 4000);
                }
                if ($mmLoginHelper.isSSOLoginNeeded(result.code)) {
                    if (!$mmApp.isSSOAuthenticationOngoing() && !isSSOConfirmShown && !waitingForBrowser) {
                        isSSOConfirmShown = true;
                        $mmUtil.showConfirm($translate('mm.login.reconnectssodescription')).then(function() {
                            waitingForBrowser = true;
                            $mmLoginHelper.openBrowserForSSOLogin(result.siteurl, result.code);
                        }).finally(function() {
                            isSSOConfirmShown = false;
                        });
                    }
                } else {
                    var info = $mmSite.getInfo();
                    if (typeof(info) !== 'undefined' && typeof(info.username) !== 'undefined') {
                        $ionicHistory.nextViewOptions({disableBack: true});
                        $state.go('mm_login.reconnect',
                                        {siteurl: result.siteurl, username: info.username, infositeurl: info.siteurl});
                    }
                }
            });
        }
    }
    function appLaunchedByURL(url) {
        var ssoScheme = mmCoreConfigConstants.customurlscheme + '://token=';
        if (url.indexOf(ssoScheme) == -1) {
            return false;
        }
        $mmApp.startSSOAuthentication();
        $log.debug('App launched by URL');
        var modal = $mmUtil.showModalLoading('mm.login.authenticating', true);
        url = url.replace(ssoScheme, '');
        try {
            url = atob(url);
        } catch(err) {
            $log.error('Error decoding parameter received for login SSO');
            return false;
        }
        $mmApp.ready().then(function() {
            return $mmLoginHelper.validateBrowserSSOLogin(url);
        }).then(function(siteData) {
            return $mmLoginHelper.handleSSOLoginAuthentication(siteData.siteurl, siteData.token);
        }).then(function() {
            $mmLoginHelper.goToSiteInitialPage();
        }).catch(function(errorMessage) {
            if (typeof errorMessage === 'string' && errorMessage !== '') {
                $mmUtil.showErrorModal(errorMessage);
            }
        }).finally(function() {
            modal.dismiss();
            $mmApp.finishSSOAuthentication();
        });
        return true;
    }
}]);

angular.module('mm.core.question', [])
.constant('mmQuestionComponent', 'mmQuestion')
.run(["$mmEvents", "mmCoreEventLogin", "mmCoreEventSiteUpdated", "$mmQuestionDelegate", "$mmQuestionBehaviourDelegate", "mmCoreEventRemoteAddonsLoaded", function($mmEvents, mmCoreEventLogin, mmCoreEventSiteUpdated, $mmQuestionDelegate, $mmQuestionBehaviourDelegate,
			mmCoreEventRemoteAddonsLoaded) {
	function updateHandlers() {
		$mmQuestionDelegate.updateQuestionHandlers();
		$mmQuestionBehaviourDelegate.updateQuestionBehaviourHandlers();
	}
	$mmEvents.on(mmCoreEventLogin, updateHandlers);
	$mmEvents.on(mmCoreEventSiteUpdated, updateHandlers);
	$mmEvents.on(mmCoreEventRemoteAddonsLoaded, updateHandlers);
}]);

angular.module('mm.core.settings', [])
.constant('mmCoreSettingsDownloadSection', 'mmCoreSettingsDownloadSection')
.constant('mmCoreSettingsReportInBackground', 'mmCoreReportInBackground')
.constant('mmCoreSettingsRichTextEditor', 'mmCoreSettingsRichTextEditor')
.constant('mmCoreSettingsSyncOnlyOnWifi', 'mmCoreSyncOnlyOnWifi')
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mm_settings', {
        url: '/mm_settings',
        views: {
            'site': {
                templateUrl: 'core/components/settings/templates/list.html',
                controller: 'mmSettingsListCtrl'
            }
        }
    })
    .state('site.mm_settings-about', {
        url: '/mm_settings-about',
        views: {
            'site': {
                templateUrl: 'core/components/settings/templates/about.html',
                controller: 'mmSettingsAboutCtrl'
            }
        }
    })
    .state('site.mm_settings-general', {
        url: '/mm_settings-general',
        views: {
            'site': {
                templateUrl: 'core/components/settings/templates/general.html',
                controller: 'mmSettingsGeneralCtrl'
            }
        }
    })
    .state('site.mm_settings-spaceusage', {
        url: '/mm_settings-spaceusage',
        views: {
            'site': {
                templateUrl: 'core/components/settings/templates/space-usage.html',
                controller: 'mmSettingsSpaceUsageCtrl'
            }
        }
    })
    .state('site.mm_settings-synchronization', {
        url: '/mm_settings-synchronization',
        views: {
            'site': {
                templateUrl: 'core/components/settings/templates/synchronization.html',
                controller: 'mmSettingsSynchronizationCtrl'
            }
        }
    });
}]);

angular.module('mm.core.sharedfiles', ['mm.core'])
.constant('mmSharedFilesFolder', 'sharedfiles')
.constant('mmSharedFilesStore', 'shared_files')
.constant('mmSharedFilesEventFileShared', 'file_shared')
.constant('mmSharedFilesPickerPriority', 1000)
.config(["$stateProvider", "$mmFileUploaderDelegateProvider", "mmSharedFilesPickerPriority", function($stateProvider, $mmFileUploaderDelegateProvider, mmSharedFilesPickerPriority) {
    var chooseSiteState = {
            url: '/sharedfiles-choose-site',
            params: {
                filepath: null
            }
        },
        chooseSiteView = {
            controller: 'mmSharedFilesChooseSiteCtrl',
            templateUrl: 'core/components/sharedfiles/templates/choosesite.html'
        };
    $stateProvider
    .state('site.sharedfiles-choose-site', angular.extend(angular.copy(chooseSiteState), {
        views: {
            'site': chooseSiteView
        }
    }))
    .state('mm_login.sharedfiles-choose-site', angular.extend(angular.copy(chooseSiteState), chooseSiteView))
    .state('site.sharedfiles-list', {
        url: '/sharedfiles-list',
        params: {
            path: null,
            manage: false,
            pick: false
        },
        views: {
            'site': {
                templateUrl: 'core/components/sharedfiles/templates/list.html',
                controller: 'mmSharedFilesListCtrl'
            }
        }
    });
    $mmFileUploaderDelegateProvider.registerHandler('mmSharedFiles',
                '$mmSharedFilesHandlers.filePicker', mmSharedFilesPickerPriority);
}])
.run(["$mmSharedFilesHelper", "$ionicPlatform", function($mmSharedFilesHelper, $ionicPlatform) {
    if (ionic.Platform.isIOS()) {
        $ionicPlatform.on('resume', $mmSharedFilesHelper.searchIOSNewSharedFiles);
        $mmSharedFilesHelper.searchIOSNewSharedFiles();
    }
}]);

angular.module('mm.core.sidemenu', [])
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site', {
        url: '/site',
        templateUrl: 'core/components/sidemenu/templates/menu.html',
        controller: 'mmSideMenuCtrl',
        abstract: true,
        cache: false,
        onEnter: ["$ionicHistory", "$state", "$mmSite", function($ionicHistory, $state, $mmSite) {
            $ionicHistory.clearHistory();
            if (!$mmSite.isLoggedIn()) {
                $state.go('mm_login.init');
            }
        }]
    });
}])
.run(["$mmEvents", "mmCoreEventLogin", "mmCoreEventSiteUpdated", "mmCoreEventLogout", "$mmSideMenuDelegate", "mmCoreEventRemoteAddonsLoaded", function($mmEvents, mmCoreEventLogin, mmCoreEventSiteUpdated, mmCoreEventLogout, $mmSideMenuDelegate,
            mmCoreEventRemoteAddonsLoaded) {
    $mmEvents.on(mmCoreEventLogin, $mmSideMenuDelegate.updateNavHandlers);
    $mmEvents.on(mmCoreEventSiteUpdated, $mmSideMenuDelegate.updateNavHandlers);
    $mmEvents.on(mmCoreEventRemoteAddonsLoaded, $mmSideMenuDelegate.updateNavHandlers);
    $mmEvents.on(mmCoreEventLogout, $mmSideMenuDelegate.clearSiteHandlers);
}]);

angular.module('mm.core.textviewer', [])
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mm_textviewer', {
        url: '/mm_textviewer',
        params: {
            title: null,
            content: null,
            replacelinebreaks: null
        },
        views: {
            'site': {
                templateUrl: 'core/components/textviewer/templates/textviewer.html',
                controller: 'mmTextViewerIndexCtrl'
            }
        }
    });
}]);

angular.module('mm.core.user', [])
.constant('mmUserEventProfileRefreshed', 'user_profile_refreshed')
.value('mmUserProfileState', 'site.mm_user-profile')
.config(["$stateProvider", "$mmContentLinksDelegateProvider", function($stateProvider, $mmContentLinksDelegateProvider) {
    $stateProvider
        .state('site.mm_user-profile', {
            url: '/mm_user-profile',
            views: {
                'site': {
                    controller: 'mmUserProfileCtrl',
                    templateUrl: 'core/components/user/templates/profile.html'
                }
            },
            params: {
                courseid: 0,
                userid: 0
            }
        });
    $mmContentLinksDelegateProvider.registerLinkHandler('mmUser', '$mmUserHandlers.linksHandler');
}])
.run(["$mmEvents", "mmCoreEventLogin", "mmCoreEventSiteUpdated", "$mmUserDelegate", "$mmSite", "mmCoreEventUserDeleted", "$mmUser", "mmCoreEventRemoteAddonsLoaded", function($mmEvents, mmCoreEventLogin, mmCoreEventSiteUpdated, $mmUserDelegate, $mmSite, mmCoreEventUserDeleted, $mmUser,
            mmCoreEventRemoteAddonsLoaded) {
    $mmEvents.on(mmCoreEventLogin, $mmUserDelegate.updateProfileHandlers);
    $mmEvents.on(mmCoreEventSiteUpdated, $mmUserDelegate.updateProfileHandlers);
    $mmEvents.on(mmCoreEventRemoteAddonsLoaded, $mmUserDelegate.updateProfileHandlers);
    $mmEvents.on(mmCoreEventUserDeleted, function(data) {
        if (data.siteid && data.siteid === $mmSite.getId() && data.params) {
            var params = data.params,
                userid = 0;
            if (params.userid) {
                userid = params.userid;
            } else if (params.userids) {
                userid = params.userids[0];
            } else if (params.field === 'id' && params.values && params.values.length) {
                userid = params.values[0];
            } else if (params.userlist && params.userlist.length) {
                userid = params.userlist[0].userid;
            }
            userid = parseInt(userid);
            if (userid > 0) {
                $mmUser.deleteStoredUser(userid);
            }
        }
    });
}]);

angular.module('mm.core.comments')
.controller('mmCommentViewerCtrl', ["$stateParams", "$scope", "$translate", "$mmComments", "$mmUtil", "$mmUser", "$q", function($stateParams, $scope, $translate, $mmComments, $mmUtil, $mmUser, $q) {
    var contextLevel = $stateParams.contextLevel,
        instanceId = $stateParams.instanceId,
        component = $stateParams.component,
        itemId = $stateParams.itemId,
        area = $stateParams.area,
        page = $stateParams.page || 0;
    $scope.title = $stateParams.title || $translate.instant('mm.core.comments');
    function fetchComments() {
        return $mmComments.getComments(contextLevel, instanceId, component, itemId, area, page).then(function(comments) {
            $scope.comments = comments;
            angular.forEach(comments, function(comment) {
                $mmUser.getProfile(comment.userid, undefined, true).then(function(user) {
                    comment.profileimageurl = user.profileimageurl || true;
                });
            });
        }).catch(function(error) {
            if (error) {
                if (component == 'assignsubmission_comments') {
                    $mmUtil.showModal('mm.core.notice', 'mm.core.commentsnotworking');
                } else {
                    $mmUtil.showErrorModal(error);
                }
            } else {
                $translate('mm.core.error').then(function(error) {
                    $mmUtil.showErrorModal(error + ': get_comments');
                });
            }
            return $q.reject();
        });
    }
    fetchComments().finally(function() {
        $scope.commentsLoaded = true;
    });
    $scope.refreshComments = function() {
        return $mmComments.invalidateCommentsData(contextLevel, instanceId, component, itemId, area, page).finally(function() {
            return fetchComments().finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        });
    };
}]);
angular.module('mm.core.comments')
.directive('mmComments', ["$mmComments", "$state", function($mmComments, $state) {
    return {
        restrict: 'E',
        priority: 100,
        scope: {
            contextLevel: '@',
            instanceId: '@',
            component: '@',
            itemId: '@',
            area: '@?',
            page: '@?',
            title: '@?'
        },
        templateUrl: 'core/components/comments/templates/comments.html',
        link: function(scope, el, attr) {
            var params;
            scope.commentsCount = -1;
            scope.commentsLoaded = false;
            scope.showComments = function() {
                if (scope.commentsCount > 0) {
                    $state.go('site.mm_commentviewer', params);
                }
            };
            $mmComments.getComments(attr.contextLevel, attr.instanceId, attr.component, attr.itemId, attr.area, attr.page)
                    .then(function(comments) {
                params = {
                    contextLevel: attr.contextLevel,
                    instanceId: attr.instanceId,
                    component: attr.component,
                    itemId: attr.itemId,
                    area: attr.area,
                    page: attr.page,
                    title: attr.title
                };
                scope.commentsCount = comments && comments.length ? comments.length : 0;
                scope.commentsLoaded = true;
            }).catch(function() {
                scope.commentsLoaded = true;
            });
        }
    };
}]);

angular.module('mm.core.comments')
.factory('$mmComments', ["$log", "$mmSitesManager", "$mmSite", "$q", function($log, $mmSitesManager, $mmSite, $q) {
    $log = $log.getInstance('$mmComments');
    var self = {};
        function getCommentsCacheKey(contextLevel, instanceId, component, itemId, area, page) {
        page = page || 0;
        area = area || "";
        return getCommentsPrefixCacheKey(contextLevel, instanceId) + ':' + component + ':' + itemId + ':' + area + ':' + page;
    }
        function getCommentsPrefixCacheKey(contextLevel, instanceId) {
        return 'mmComments:comments:' + contextLevel + ':' + instanceId;
    }
        self.getComments = function(contextLevel, instanceId, component, itemId, area, page, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var params = {
                "contextlevel": contextLevel,
                "instanceid": instanceId,
                "component": component,
                "itemid": itemId
            },
            preSets = {};
            if (area) {
                params.area = area;
            }
            if (page) {
                params.page = page;
            }
            preSets.cacheKey = getCommentsCacheKey(contextLevel, instanceId, component, itemId, area, page);
            return site.read('core_comment_get_comments', params, preSets).then(function(response) {
                if (response.comments) {
                    return response.comments;
                }
                return $q.reject();
            });
        });
    };
        self.invalidateCommentsData = function(contextLevel, instanceId, component, itemId, area, page, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.invalidateWsCacheForKey(getCommentsCacheKey(contextLevel, instanceId, component, itemId, area, page));
        });
    };
        self.invalidateCommentsByInstance = function(contextLevel, instanceId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.invalidateWsCacheForKeyStartingWith(getCommentsPrefixCacheKey(contextLevel, instanceId));
        });
    };
        self.isPluginEnabled = function(siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return  site.wsAvailable('core_comment_get_comments');
        });
    };
    return self;
}]);

angular.module('mm.core.contentlinks')
.controller('mmContentLinksChooseSiteCtrl', ["$scope", "$stateParams", "$mmSitesManager", "$mmUtil", "$ionicHistory", "$state", "$q", "$mmContentLinksDelegate", "$mmContentLinksHelper", function($scope, $stateParams, $mmSitesManager, $mmUtil, $ionicHistory, $state, $q,
            $mmContentLinksDelegate, $mmContentLinksHelper) {
    $scope.url = $stateParams.url || '';
    var action;
    function leaveView() {
        $mmSitesManager.logout().finally(function() {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('mm_login.sites');
        });
    }
    if (!$scope.url) {
        leaveView();
        return;
    }
    $mmContentLinksDelegate.getActionsFor($scope.url).then(function(actions) {
        action = $mmContentLinksHelper.getFirstValidAction(actions);
        if (!action) {
            return $q.reject();
        }
        $mmSitesManager.getSites(action.sites).then(function(sites) {
            $scope.sites = sites;
        });
    }).catch(function() {
        $mmUtil.showErrorModal('mm.contentlinks.errornosites', true);
        leaveView();
    });
    $scope.siteClicked = function(siteId) {
        action.action(siteId);
    };
    $scope.cancel = function() {
        leaveView();
    };
}]);

angular.module('mm.core.contentlinks')
.provider('$mmContentLinksDelegate', function() {
    var linkHandlers = {},
        self = {};
        self.registerLinkHandler = function(name, handler, priority) {
        if (typeof linkHandlers[name] !== 'undefined') {
            console.log("$mmContentLinksDelegateProvider: Addon '" + linkHandlers[name].name +
                        "' already registered as link handler");
            return false;
        }
        console.log("$mmContentLinksDelegateProvider: Registered handler '" + name + "' as link handler.");
        linkHandlers[name] = {
            name: name,
            handler: handler,
            instance: undefined,
            priority: typeof priority === 'undefined' ? 100 : priority
        };
        return true;
    };
    self.$get = ["$mmUtil", "$log", "$q", "$mmSitesManager", function($mmUtil, $log, $q, $mmSitesManager) {
        var self = {};
        $log = $log.getInstance('$mmContentLinksDelegate');
                self.getActionsFor = function(url, courseId, username) {
            if (!url) {
                return $q.when([]);
            }
            return $mmSitesManager.getSiteIdsFromUrl(url, true, username).then(function(siteIds) {
                var linkActions = [],
                    promises = [];
                angular.forEach(linkHandlers, function(handler) {
                    if (typeof handler.instance === 'undefined') {
                        handler.instance = $mmUtil.resolveObject(handler.handler, true);
                    }
                    if (handler.instance) {
                        promises.push($q.when(handler.instance.getActions(siteIds, url, courseId)).then(function(actions) {
                            if (actions && actions.length) {
                                linkActions.push({
                                    priority: handler.priority,
                                    actions: actions
                                });
                            }
                        }));
                    }
                });
                return $mmUtil.allPromises(promises).catch(function() {}).then(function() {
                    return sortActionsByPriority(linkActions);
                });
            });
        };
                self.getSiteUrl = function(url) {
            if (!url) {
                return;
            }
            for (var name in linkHandlers) {
                var handler = linkHandlers[name];
                if (typeof handler.instance === 'undefined') {
                    handler.instance = $mmUtil.resolveObject(handler.handler, true);
                }
                if (handler.instance && handler.instance.handles) {
                    var siteUrl = handler.instance.handles(url);
                    if (siteUrl) {
                        return siteUrl;
                    }
                }
            }
        };
                function sortActionsByPriority(actions) {
            var sorted = [];
            actions = actions.sort(function(a, b) {
                return a.priority > b.priority;
            });
            actions.forEach(function(entry) {
                sorted = sorted.concat(entry.actions);
            });
            return sorted;
        }
        return self;
    }];
    return self;
});

angular.module('mm.core.contentlinks')
.factory('$mmContentLinksHelper', ["$log", "$ionicHistory", "$state", "$mmSite", "$mmContentLinksDelegate", "$mmUtil", "$translate", "$mmCourseHelper", "$mmSitesManager", "$q", "$mmLoginHelper", "$mmText", "mmCoreConfigConstants", function($log, $ionicHistory, $state, $mmSite, $mmContentLinksDelegate, $mmUtil, $translate,
            $mmCourseHelper, $mmSitesManager, $q, $mmLoginHelper, $mmText, mmCoreConfigConstants) {
    $log = $log.getInstance('$mmContentLinksHelper');
    var self = {};
        self.filterSupportedSites = function(siteIds, isEnabledFn, checkAll) {
        var promises = [],
            supported = [],
            extraParams = Array.prototype.slice.call(arguments, 3);
        angular.forEach(siteIds, function(siteId) {
            if (checkAll || !promises.length) {
                promises.push(isEnabledFn.apply(isEnabledFn, [siteId].concat(extraParams)).then(function(enabled) {
                    if (enabled) {
                        supported.push(siteId);
                    }
                }));
            }
        });
        return $mmUtil.allPromises(promises).catch(function() {}).then(function() {
            if (!checkAll) {
                if (supported.length) {
                    return siteIds;
                } else {
                    return [];
                }
            } else {
                return supported;
            }
        });
    };
        self.getFirstValidAction = function(actions) {
        if (actions) {
            for (var i = 0; i < actions.length; i++) {
                var action = actions[i];
                if (action && action.sites && action.sites.length && angular.isFunction(action.action)) {
                    return action;
                }
            }
        }
    };
        self.goInSite = function(stateName, stateParams, siteId) {
        siteId = siteId || $mmSite.getId();
        if (siteId == $mmSite.getId()) {
            return $state.go(stateName, stateParams);
        } else {
            return $state.go('redirect', {
                siteid: siteId,
                state: stateName,
                params: stateParams
            });
        }
    };
        self.goToChooseSite = function(url) {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        return $state.go('mm_contentlinks.choosesite', {url: url});
    };
        self.handleCustomUrl = function(url) {
        var contentLinksScheme = mmCoreConfigConstants.customurlscheme + '://link=';
        if (url.indexOf(contentLinksScheme) == -1) {
            return false;
        }
        $log.debug('Treating custom URL scheme: ' + url);
        var modal = $mmUtil.showModalLoading(),
            username;
        url = url.replace(contentLinksScheme, '');
        username = $mmText.getUsernameFromUrl(url);
        if (username) {
            url = url.replace(username + '@', '');
        }
        $mmSitesManager.getSiteIdsFromUrl(url, false, username).then(function(siteIds) {
            if (siteIds.length) {
                modal.dismiss();
                return self.handleLink(url, username).then(function(treated) {
                    if (!treated) {
                        $mmUtil.showErrorModal('mm.contentlinks.errornoactions', true);
                    }
                });
            } else {
                var siteUrl = $mmContentLinksDelegate.getSiteUrl(url),
                    formatted = $mmUtil.formatURL(siteUrl);
                if (!siteUrl) {
                    $mmUtil.showErrorModal('mm.login.invalidsite', true);
                    return;
                }
                return $mmSitesManager.checkSite(siteUrl).then(function(result) {
                    var promise,
                        ssoNeeded = $mmLoginHelper.isSSOLoginNeeded(result.code);
                    modal.dismiss();
                    if (!$mmSite.isLoggedIn()) {
                        if (ssoNeeded) {
                            promise = $mmUtil.showConfirm($translate('mm.login.logininsiterequired'));
                        } else {
                            promise = $q.when();
                        }
                    } else {
                        promise = $mmUtil.showConfirm($translate('mm.contentlinks.confirmurlothersite')).then(function() {
                            if (!ssoNeeded) {
                                return $mmSitesManager.logout().catch(function() {
                                });
                            }
                        });
                    }
                    return promise.then(function() {
                        if (ssoNeeded) {
                            $mmLoginHelper.openBrowserForSSOLogin(result.siteurl, result.code);
                        } else {
                            $state.go('mm_login.credentials', {
                                siteurl: result.siteurl,
                                username: username,
                                urltoopen: url
                            });
                        }
                    });
                }, function(error) {
                    $mmUtil.showErrorModal(error);
                });
            }
        }).finally(function() {
            modal.dismiss();
        });
        return true;
    };
        self.handleLink = function(url, username) {
        return $mmContentLinksDelegate.getActionsFor(url, undefined, username).then(function(actions) {
            var action = self.getFirstValidAction(actions);
            if (action) {
                if (!$mmSite.isLoggedIn()) {
                    if (action.sites.length == 1) {
                        action.action(action.sites[0]);
                    } else {
                        self.goToChooseSite(url);
                    }
                } else if (action.sites.length == 1 && action.sites[0] == $mmSite.getId()) {
                    action.action(action.sites[0]);
                } else {
                    $mmUtil.showConfirm($translate('mm.contentlinks.confirmurlothersite')).then(function() {
                        if (action.sites.length == 1) {
                            action.action(action.sites[0]);
                        } else {
                            self.goToChooseSite(url);
                        }
                    });
                }
                return true;
            }
            return false;
        }).catch(function() {
            return false;
        });
    };
        self.treatModuleGradeUrl = function(siteIds, url, isEnabled, courseId, gotoReview) {
        var params = $mmUtil.extractUrlParams(url);
        if (typeof params.id != 'undefined') {
            courseId = courseId || params.courseid || params.cid;
            return self.filterSupportedSites(siteIds, isEnabled, false, courseId).then(function(ids) {
                if (!ids.length) {
                    return [];
                } else {
                    return [{
                        message: 'mm.core.view',
                        icon: 'ion-eye',
                        sites: ids,
                        action: function(siteId) {
                            var modal = $mmUtil.showModalLoading();
                            $mmSitesManager.getSite(siteId).then(function(site) {
                                if (!params.userid || params.userid == site.getUserId()) {
                                    $mmCourseHelper.navigateToModule(parseInt(params.id, 10), siteId, courseId);
                                } else if (angular.isFunction(gotoReview)) {
                                    gotoReview(url, params, courseId, siteId);
                                } else {
                                    $mmUtil.openInBrowser(url);
                                }
                            }).finally(function() {
                                modal.dismiss();
                            });
                        }
                    }];
                }
            });
        }
        return $q.when([]);
    };
        self.treatModuleIndexUrl = function(siteIds, url, isEnabled, courseId) {
        var params = $mmUtil.extractUrlParams(url);
        if (typeof params.id != 'undefined') {
            courseId = courseId || params.courseid || params.cid;
            return self.filterSupportedSites(siteIds, isEnabled, false, courseId).then(function(ids) {
                if (!ids.length) {
                    return [];
                } else {
                    return [{
                        message: 'mm.core.view',
                        icon: 'ion-eye',
                        sites: ids,
                        action: function(siteId) {
                            $mmCourseHelper.navigateToModule(parseInt(params.id, 10), siteId, courseId);
                        }
                    }];
                }
            });
        }
        return $q.when([]);
    };
    return self;
}]);

angular.module('mm.core.course')
.controller('mmCourseModContentCtrl', ["$log", "$stateParams", "$scope", function($log, $stateParams, $scope) {
    $log = $log.getInstance('mmCourseModContentCtrl');
    var module = $stateParams.module || {};
    $scope.description = module.description;
    $scope.title = module.name;
    $scope.url = module.url;
}]);

angular.module('mm.core.course')
.controller('mmCourseSectionCtrl', ["$mmCourseDelegate", "$mmCourse", "$mmUtil", "$scope", "$stateParams", "$translate", "$mmSite", "$mmEvents", "$ionicScrollDelegate", "$mmCourses", "$q", "mmCoreEventCompletionModuleViewed", "$controller", "$mmCoursePrefetchDelegate", "$mmCourseHelper", function($mmCourseDelegate, $mmCourse, $mmUtil, $scope, $stateParams, $translate, $mmSite,
            $mmEvents, $ionicScrollDelegate, $mmCourses, $q, mmCoreEventCompletionModuleViewed, $controller,
            $mmCoursePrefetchDelegate, $mmCourseHelper) {
    var courseId = $stateParams.cid || 1,
        sectionId = $stateParams.sectionid || -1,
        moduleId = $stateParams.mid;
    $scope.sitehome = (courseId === 1);
    $scope.sections = [];
    if (sectionId < 0) {
        if ($scope.sitehome) {
            $scope.title = $translate.instant('mma.frontpage.sitehome');
        } else {
            $scope.title = $translate.instant('mm.course.allsections');
        }
        $scope.summary = null;
        $scope.allSections = true;
    }
    function loadContent(sectionId) {
        return $mmCourses.getUserCourse(courseId, true).catch(function() {
        }).then(function(course) {
            var promise;
            if (course && course.enablecompletion === false) {
                promise = $q.when([]);
            } else {
                promise = $mmCourse.getActivitiesCompletionStatus(courseId).catch(function() {
                    return [];
                });
            }
            return promise.then(function(statuses) {
                var promise,
                    sectionnumber;
                if (sectionId < 0) {
                    sectionnumber = 0;
                    promise = $mmCourse.getSections(courseId);
                } else {
                    sectionnumber = sectionId;
                    promise = $mmCourse.getSection(courseId, sectionId).then(function(section) {
                        $scope.title = section.name;
                        $scope.summary = section.summary;
                        return [section];
                    });
                }
                return promise.then(function(sections) {
                    if ($scope.sitehome) {
                        sections.reverse();
                    }
                    var hasContent = false;
                    angular.forEach(sections, function(section) {
                        if (section.summary != '' || section.modules.length) {
                            hasContent = true;
                        }
                        angular.forEach(section.modules, function(module) {
                            module._controller =
                                    $mmCourseDelegate.getContentHandlerControllerFor(module.modname, module, courseId, section.id);
                            var status = statuses[module.id];
                            if (typeof status != 'undefined') {
                                module.completionstatus = status;
                            }
                            if (module.id == moduleId) {
                                var scope = $scope.$new();
                                $controller(module._controller, {$scope: scope});
                                if (scope.action) {
                                    scope.action();
                                }
                            }
                        });
                    });
                    $scope.sections = sections;
                    $scope.hasContent = hasContent;
                    $mmSite.write('core_course_view_course', {
                        courseid: courseId
                    });
                }, function(error) {
                    if (error) {
                        $mmUtil.showErrorModal(error);
                    } else {
                        $mmUtil.showErrorModal('mm.course.couldnotloadsectioncontent', true);
                    }
                });
            });
        });
    }
    loadContent(sectionId).finally(function() {
        $scope.sectionLoaded = true;
    });
    $scope.doRefresh = function() {
        var promises = [];
        promises.push($mmCourse.invalidateSections(courseId));
        if ($scope.sections) {
            var modules = $mmCourseHelper.getSectionsModules($scope.sections);
            promises.push($mmCoursePrefetchDelegate.invalidateModules(modules, courseId));
        }
        $q.all(promises).finally(function() {
            loadContent(sectionId).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        });
    };
    function refreshAfterCompletionChange() {
        var scrollView = $ionicScrollDelegate.$getByHandle('mmSectionScroll');
        if (scrollView && scrollView.getScrollPosition()) {
            $scope.loadingPaddingTop = scrollView.getScrollPosition().top;
        }
        $scope.sectionLoaded = false;
        $scope.sections = [];
        loadContent(sectionId).finally(function() {
            $scope.sectionLoaded = true;
            $scope.loadingPaddingTop = 0;
        });
    }
    $scope.completionChanged = function() {
        $mmCourse.invalidateSections(courseId).finally(function() {
            refreshAfterCompletionChange();
        });
    };
    var observer = $mmEvents.on(mmCoreEventCompletionModuleViewed, function(cid) {
        if (cid === courseId) {
            refreshAfterCompletionChange();
        }
    });
    $scope.$on('$destroy', function() {
        if (observer && observer.off) {
            observer.off();
        }
    });
}]);

angular.module('mm.core.course')
.controller('mmCourseSectionsCtrl', ["$mmCourse", "$mmUtil", "$scope", "$stateParams", "$translate", "$mmCourseHelper", "$mmEvents", "$mmSite", "$mmCoursePrefetchDelegate", "$mmCourses", "$q", "$ionicHistory", "$ionicPlatform", "mmCoreCourseAllSectionsId", "mmCoreEventSectionStatusChanged", "$mmConfig", "mmCoreSettingsDownloadSection", "$state", "$timeout", function($mmCourse, $mmUtil, $scope, $stateParams, $translate, $mmCourseHelper, $mmEvents,
            $mmSite, $mmCoursePrefetchDelegate, $mmCourses, $q, $ionicHistory, $ionicPlatform, mmCoreCourseAllSectionsId,
            mmCoreEventSectionStatusChanged, $mmConfig, mmCoreSettingsDownloadSection, $state, $timeout) {
    var courseId = $stateParams.courseid,
        sectionId = $stateParams.sid,
        moduleId = $stateParams.moduleid,
        courseFullName = $stateParams.coursefullname,
        downloadSectionsEnabled;
    $scope.courseId = courseId;
    $scope.sectionToLoad = 2;
    $scope.fullname = courseFullName;
    function checkDownloadSectionsEnabled() {
        return $mmConfig.get(mmCoreSettingsDownloadSection, true).then(function(enabled) {
            downloadSectionsEnabled = enabled;
        }).catch(function() {
            downloadSectionsEnabled = false;
        });
    }
    function loadSections(refresh) {
        var promise;
        if (courseFullName) {
            promise = $q.when();
        } else {
            promise = $mmCourses.getUserCourse(courseId).catch(function() {
                return $mmCourses.getCourse(courseId);
            }).then(function(course) {
                return course.fullname;
            }).catch(function() {
                return $translate.instant('mm.core.course');
            });
        }
        return promise.then(function(courseFullName) {
            if (courseFullName) {
                $scope.fullname = courseFullName;
            }
            return $mmCourse.getSections(courseId).then(function(sections) {
                return $translate('mm.course.allsections').then(function(str) {
                    var result = [{
                        name: str,
                        id: mmCoreCourseAllSectionsId
                    }].concat(sections);
                    $scope.sections = result;
                    if (downloadSectionsEnabled) {
                        $mmCourseHelper.calculateSectionsStatus(result, courseId, true, refresh).catch(function() {
                        }).then(function(downloadpromises) {
                            if (downloadpromises && downloadpromises.length) {
                                $mmUtil.allPromises(downloadpromises).catch(function() {
                                    if (!$scope.$$destroyed) {
                                        $mmUtil.showErrorModal('mm.course.errordownloadingsection', true);
                                    }
                                }).finally(function() {
                                    if (!$scope.$$destroyed) {
                                        $mmCourseHelper.calculateSectionsStatus($scope.sections, courseId, false);
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }).catch(function(error) {
            if (error) {
                $mmUtil.showErrorModal(error);
            } else {
                $mmUtil.showErrorModal('mm.course.couldnotloadsections', true);
            }
        });
    }
    function prefetch(section, manual) {
        $mmCourseHelper.prefetch(section, courseId, $scope.sections).catch(function() {
            if ($scope.$$destroyed) {
                return;
            }
            var current = $ionicHistory.currentStateName(),
                isCurrent = ($ionicPlatform.isTablet() && current == 'site.mm_course.mm_course-section') ||
                            (!$ionicPlatform.isTablet() && current == 'site.mm_course');
            if (!manual && !isCurrent) {
                return;
            }
            $mmUtil.showErrorModal('mm.course.errordownloadingsection', true);
        }).finally(function() {
            if (!$scope.$$destroyed) {
                $mmCourseHelper.calculateSectionsStatus($scope.sections, courseId, false);
            }
        });
    }
    function autoloadSection() {
        if (sectionId) {
            if ($ionicPlatform.isTablet()) {
                angular.forEach($scope.sections, function(section, index) {
                    if (section.id == sectionId) {
                        $scope.sectionToLoad = index + 1;
                    }
                });
                $scope.moduleId = moduleId;
                $timeout(function() {
                    $scope.moduleId = null;
                }, 500);
            } else {
                $state.go('site.mm_course-section', {
                    sectionid: sectionId,
                    cid: courseId,
                    mid: moduleId
                });
            }
        }
    }
    $scope.doRefresh = function() {
        var promises = [];
        promises.push($mmCourses.invalidateUserCourses());
        promises.push($mmCourse.invalidateSections(courseId));
        if ($scope.sections) {
            var modules = $mmCourseHelper.getSectionsModules($scope.sections);
            promises.push($mmCoursePrefetchDelegate.invalidateModules(modules, courseId));
        }
        $q.all(promises).finally(function() {
            loadSections(true).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        });
    };
    $scope.prefetch = function(e, section) {
        e.preventDefault();
        e.stopPropagation();
        section.isCalculating = true;
        $mmCourseHelper.confirmDownloadSize(courseId, section, $scope.sections).then(function() {
            prefetch(section, true);
        }).finally(function() {
            section.isCalculating = false;
        });
    };
    checkDownloadSectionsEnabled().then(function() {
        loadSections().finally(function() {
            autoloadSection();
            $scope.sectionsLoaded = true;
        });
    });
    var statusObserver = $mmEvents.on(mmCoreEventSectionStatusChanged, function(data) {
        if (downloadSectionsEnabled && $scope.sections && $scope.sections.length && data.siteid === $mmSite.getId() &&
                    !$scope.$$destroyed&& data.sectionid) {
            if ($mmCoursePrefetchDelegate.isBeingDownloaded($mmCourseHelper.getSectionDownloadId({id: data.sectionid}))) {
                return;
            }
            $mmCourseHelper.calculateSectionsStatus($scope.sections, courseId, false).then(function() {
                var section;
                angular.forEach($scope.sections, function(s) {
                    if (s.id === data.sectionid) {
                        section = s;
                    }
                });
                if (section) {
                    var downloadid = $mmCourseHelper.getSectionDownloadId(section);
                    if (section.isDownloading && !$mmCoursePrefetchDelegate.isBeingDownloaded(downloadid)) {
                        prefetch(section, false);
                    }
                }
            });
        }
    });
    $scope.$on('$destroy', function() {
        statusObserver && statusObserver.off && statusObserver.off();
    });
}]);

angular.module('mm.core.course')
.directive('mmCourseModDescription', function() {
    return {
        compile: function(element, attrs) {
            if (attrs.watch) {
                element.find('mm-format-text').attr('watch', attrs.watch);
            }
            return function(scope) {
                scope.showfull = !!attrs.showfull;
            };
        },
        restrict: 'E',
        scope: {
            description: '=',
            note: '='
        },
        templateUrl: 'core/components/course/templates/mod_description.html'
    };
});

angular.module('mm.core.course')
.factory('$mmCourseContentHandler', ["$mmCourse", "$mmUtil", function($mmCourse, $mmUtil) {
    return {
        getController: function(module) {
            return function($scope, $state) {
                $scope.icon = $mmCourse.getModuleIconSrc(module.modname);
                $scope.title = module.name;
                $scope.class = 'mm-course-default-handler mm-course-module-' + module.modname + '-handler';
                $scope.action = function(e) {
                    $state.go('site.mm_course-modcontent', {module: module});
                    e.preventDefault();
                    e.stopPropagation();
                };
                if (module.url) {
                    $scope.buttons = [{
                        icon: 'ion-share',
                        label: 'mm.core.openinbrowser',
                        action: function(e) {
                            $mmUtil.openInBrowser(module.url);
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }];
                }
            };
        }
    };
}]);

angular.module('mm.core.course')
.constant('mmCoreCourseModulesStore', 'course_modules')
.config(["$mmSitesFactoryProvider", "mmCoreCourseModulesStore", function($mmSitesFactoryProvider, mmCoreCourseModulesStore) {
    var stores = [
        {
            name: mmCoreCourseModulesStore,
            keyPath: 'id'
        }
    ];
    $mmSitesFactoryProvider.registerStores(stores);
}])
.factory('$mmCourse', ["$mmSite", "$translate", "$q", "$log", "$mmEvents", "$mmSitesManager", "mmCoreEventCompletionModuleViewed", function($mmSite, $translate, $q, $log, $mmEvents, $mmSitesManager, mmCoreEventCompletionModuleViewed) {
    $log = $log.getInstance('$mmCourse');
    var self = {},
        mods = ["assign", "assignment", "book", "chat", "choice", "data", "database", "date", "external-tool",
            "feedback", "file", "folder", "forum", "glossary", "ims", "imscp", "label", "lesson", "lti", "page", "webaula", "textos", "pense", "proposta", "saiba", "estudo", "quiz",
            "resource", "scorm", "survey", "url", "wiki", "workshop"
        ],
        modsWithContent = ['book', 'folder', 'imscp', 'page', 'webaula', 'textos', 'pense', 'proposta', 'saiba', 'estudo', 'resource', 'url'];
        function addContentsIfNeeded(module) {
        if (modsWithContent.indexOf(module.modname) > -1) {
            module.contents = module.contents || [];
        }
        return module;
    }
        self.canGetModuleWithoutCourseId = function(siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.wsAvailable('core_course_get_course_module');
        });
    };
        self.canGetModuleByInstance = function(siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.wsAvailable('core_course_get_course_module_by_instance');
        });
    };
        self.checkModuleCompletion = function(courseId, completion) {
        if (completion && completion.tracking === 2 && completion.state === 0) {
            self.invalidateSections(courseId).finally(function() {
                $mmEvents.trigger(mmCoreEventCompletionModuleViewed, courseId);
            });
        }
    };
        self.getActivitiesCompletionStatus = function(courseid, userid) {
        userid = userid || $mmSite.getUserId();
        $log.debug('Getting completion status for user ' + userid + ' in course ' + courseid);
        var params = {
                courseid: courseid,
                userid: userid
            },
            preSets = {
                cacheKey: getActivitiesCompletionCacheKey(courseid, userid)
            };
        return $mmSite.read('core_completion_get_activities_completion_status', params, preSets).then(function(data) {
            if (data && data.statuses) {
                var formattedStatuses = {};
                angular.forEach(data.statuses, function(status) {
                    formattedStatuses[status.cmid] = status;
                });
                return formattedStatuses;
            }
            return $q.reject();
        });
    };
        function getActivitiesCompletionCacheKey(courseid, userid) {
        return 'mmCourse:activitiescompletion:' + courseid + ':' + userid;
    }
        self.getModuleBasicInfo = function(moduleId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var params = {
                    cmid: moduleId
                },
                preSets = {
                    cacheKey: getModuleCacheKey(moduleId)
                };
            return site.read('core_course_get_course_module', params, preSets).then(function(response) {
                if (response.cm && (!response.warnings || !response.warnings.length)) {
                    return response.cm;
                }
                return $q.reject();
            });
        });
    };
        self.getModuleBasicInfoByInstance = function(id, module, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var params = {
                    instance: id,
                    module: module
                },
                preSets = {
                    cacheKey: getModuleByInstanceCacheKey(id, module)
                };
            return site.read('core_course_get_course_module_by_instance', params, preSets).then(function(response) {
                if (response.cm && (!response.warnings || !response.warnings.length)) {
                    return response.cm;
                }
                return $q.reject();
            });
        });
    };
        self.getModule = function(moduleId, courseId, sectionId, preferCache) {
        if (!moduleId) {
            return $q.reject();
        }
        if (typeof preferCache == 'undefined') {
            preferCache = false;
        }
        var promise;
        if (!courseId) {
            promise = self.getModuleBasicInfo(moduleId).then(function(module) {
                return module.course;
            });
        } else {
            promise = $q.when(courseId);
        }
        return promise.then(function(courseId) {
            $log.debug('Getting module ' + moduleId + ' in course ' + courseId);
            params = {
                courseid: courseId,
                options: [
                    {
                        name: 'cmid',
                        value: moduleId
                    }
                ]
            };
            preSets = {
                cacheKey: getModuleCacheKey(moduleId),
                omitExpires: preferCache
            };
            if (sectionId) {
                params.options.push({
                    name: 'sectionid',
                    value: sectionId
                });
            }
            return $mmSite.read('core_course_get_contents', params, preSets).catch(function() {
                params.options = [];
                preSets.cacheKey = getSectionsCacheKey(courseId);
                return $mmSite.read('core_course_get_contents', params, preSets);
            }).then(function(sections) {
                var section,
                    module;
                for (var i = 0; i < sections.length; i++) {
                    section = sections[i];
                    for (var j = 0; j < section.modules.length; j++) {
                        module = section.modules[j];
                        if (module.id == moduleId) {
                            module.course = courseId;
                            return addContentsIfNeeded(module);
                        }
                    }
                }
                return $q.reject();
            });
        });
    };
        function getModuleByInstanceCacheKey(id, module) {
        return 'mmCourse:moduleByInstance:' + module + ':' + id;
    }
        function getModuleCacheKey(moduleid) {
        return 'mmCourse:module:' + moduleid;
    }
        self.getModuleIconSrc = function(moduleName) {
        if (mods.indexOf(moduleName) < 0) {
            moduleName = "external-tool";
        }
        return "img/mod/" + moduleName + ".svg";
    };
        self.getModuleSectionId = function(moduleId, courseId, siteId) {
        if (!moduleId) {
            return $q.reject();
        }
        return self.getModuleBasicInfo(moduleId, siteId).then(function(module) {
            return module.section;
        }).catch(function() {
            if (!courseId) {
                return $q.reject();
            }
            return self.getSections(courseId, {}, siteId).then(function(sections) {
                for (var i = 0, seclen = sections.length; i < seclen; i++) {
                    var section = sections[i];
                    for (var j = 0, modlen = section.modules.length; j < modlen; j++) {
                        if (section.modules[j].id == moduleId) {
                            return section.id;
                        }
                    }
                }
                return $q.reject();
            });
        });
    };
        self.getSection = function(courseid, sectionid) {
        var deferred = $q.defer();
        if (sectionid < 0) {
            deferred.reject('Invalid section ID');
            return deferred.promise;
        }
        self.getSections(courseid).then(function(sections) {
            for (var i = 0; i < sections.length; i++) {
                if (sections[i].id == sectionid) {
                    deferred.resolve(sections[i]);
                    return;
                }
            }
            deferred.reject('Unkown section');
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
        self.getSections = function(courseid, preSets, siteId) {
        preSets = preSets || {};
        siteId = siteId || $mmSite.getId();
        preSets.cacheKey = getSectionsCacheKey(courseid);
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.read('core_course_get_contents', {
                courseid: courseid,
                options: []
            }, preSets).then(function(sections) {
                angular.forEach(sections, function(section) {
                    angular.forEach(section.modules, function(module) {
                        addContentsIfNeeded(module);
                    });
                });
                return sections;
            });
        });
    };
        function getSectionsCacheKey(courseid) {
        return 'mmCourse:sections:' + courseid;
    }
        self.invalidateModule = function(moduleid) {
        return $mmSite.invalidateWsCacheForKey(getModuleCacheKey(moduleid));
    };
        self.invalidateModuleByInstance = function(id, module) {
        return $mmSite.invalidateWsCacheForKey(getModuleByInstanceCacheKey(id, module));
    };
        self.invalidateSections = function(courseid, userid) {
        userid = userid || $mmSite.getUserId();
        var p1 = $mmSite.invalidateWsCacheForKey(getSectionsCacheKey(courseid)),
            p2 = $mmSite.invalidateWsCacheForKey(getActivitiesCompletionCacheKey(courseid, userid));
        return $q.all([p1, p2]);
    };
        self.translateModuleName = function(moduleName) {
        if (mods.indexOf(moduleName) < 0) {
            moduleName = "external-tool";
        }
        var langkey = 'mm.core.mod_'+moduleName;
        return $translate(langkey).then(function(translated) {
            return translated !== langkey ? translated : moduleName;
        });
    };
    return self;
}]);

angular.module('mm.core.course')
.factory('$mmCourseCoursesNavHandler', function() {
    return {
                isEnabled: function() {
            return true;
        },
                isEnabledForCourse: function() {
            return true;
        },
                getController: function(courseId) {
            return function($scope, $state) {
                $scope.icon = 'ion-briefcase';
                $scope.title = 'mm.course.contents';
                $scope.class = 'mm-course-handler';
                $scope.action = function(e, course) {
                    $state.go('site.mm_course', {courseid: course.id, coursefullname: course.fullname});
                    e.preventDefault();
                    e.stopPropagation();
                };
            };
        }
    };
});

angular.module('mm.core.course')
.provider('$mmCourseDelegate', function() {
    var contentHandlers = {},
        self = {};
        self.registerContentHandler = function(addon, handles, handler) {
        if (typeof contentHandlers[handles] !== 'undefined') {
            console.log("$mmCourseDelegateProvider: Addon '" + contentHandlers[handles].addon + "' already registered as handler for '" + handles + "'");
            return false;
        }
        console.log("$mmCourseDelegateProvider: Registered addon '" + addon + "' as course content handler.");
        contentHandlers[handles] = {
            addon: addon,
            handler: handler,
            instance: undefined
        };
        return true;
    };
    self.$get = ["$q", "$log", "$mmSite", "$mmUtil", "$mmCourseContentHandler", function($q, $log, $mmSite, $mmUtil, $mmCourseContentHandler) {
        var enabledHandlers = {},
            self = {},
            lastUpdateHandlersStart = {};
        $log = $log.getInstance('$mmCourseDelegate');
                self.getContentHandlerControllerFor = function(handles, module, courseid, sectionid) {
            if (typeof enabledHandlers[handles] !== 'undefined') {
                return enabledHandlers[handles].getController(module, courseid, sectionid);
            }
            return $mmCourseContentHandler.getController(module, courseid, sectionid);
        };
                self.isLastUpdateCall = function(time) {
            if (!lastUpdateHandlersStart) {
                return true;
            }
            return time == lastUpdateHandlersStart;
        };
                self.updateContentHandler = function(handles, handlerInfo, time) {
            var promise,
                siteId = $mmSite.getId();
            if (typeof handlerInfo.instance === 'undefined') {
                handlerInfo.instance = $mmUtil.resolveObject(handlerInfo.handler, true);
            }
            if (!$mmSite.isLoggedIn()) {
                promise = $q.reject();
            } else {
                promise = $q.when(handlerInfo.instance.isEnabled());
            }
            return promise.catch(function() {
                return false;
            }).then(function(enabled) {
                if (self.isLastUpdateCall(time) && $mmSite.isLoggedIn() && $mmSite.getId() === siteId) {
                    if (enabled) {
                        enabledHandlers[handles] = handlerInfo.instance;
                    } else {
                        delete enabledHandlers[handles];
                    }
                }
            });
        };
                self.updateContentHandlers = function() {
            var promises = [],
                now = new Date().getTime();
            $log.debug('Updating content handlers for current site.');
            lastUpdateHandlersStart = now;
            angular.forEach(contentHandlers, function(handlerInfo, handles) {
                promises.push(self.updateContentHandler(handles, handlerInfo, now));
            });
            return $q.all(promises).then(function() {
                return true;
            }, function() {
                return true;
            });
        };
        return self;
    }];
    return self;
});

angular.module('mm.core.course')
.factory('$mmCourseHelper', ["$q", "$mmCoursePrefetchDelegate", "$mmFilepool", "$mmUtil", "$mmCourse", "$mmSite", "$state", "mmCoreNotDownloaded", "mmCoreOutdated", "mmCoreDownloading", "mmCoreCourseAllSectionsId", "$mmText", "$translate", function($q, $mmCoursePrefetchDelegate, $mmFilepool, $mmUtil, $mmCourse, $mmSite, $state,
            mmCoreNotDownloaded, mmCoreOutdated, mmCoreDownloading, mmCoreCourseAllSectionsId, $mmText, $translate) {
    var self = {};
        self.calculateSectionStatus = function(section, courseid, restoreDownloads, refresh, dwnpromises) {
        if (section.id !== mmCoreCourseAllSectionsId) {
            return $mmCoursePrefetchDelegate.getModulesStatus(section.id, section.modules, courseid, refresh, restoreDownloads)
                    .then(function(result) {
                var downloadid = self.getSectionDownloadId(section);
                if ($mmCoursePrefetchDelegate.isBeingDownloaded(downloadid)) {
                    result.status = mmCoreDownloading;
                }
                section.showDownload = result.status === mmCoreNotDownloaded;
                section.showRefresh = result.status === mmCoreOutdated;
                if (result.status !== mmCoreDownloading) {
                    section.isDownloading = false;
                    section.total = 0;
                } else if (!restoreDownloads) {
                    section.count = 0;
                    section.total = result[mmCoreOutdated].length + result[mmCoreNotDownloaded].length +
                                    result[mmCoreDownloading].length;
                    section.isDownloading = true;
                } else {
                    var promise = self.startOrRestorePrefetch(section, result, courseid).then(function() {
                        return self.calculateSectionStatus(section, courseid);
                    });
                    if (dwnpromises) {
                        dwnpromises.push(promise);
                    }
                }
                return result;
            });
        }
        return $q.reject();
    };
        self.calculateSectionsStatus = function(sections, courseid, restoreDownloads, refresh) {
        var allsectionssection,
            allsectionsstatus,
            downloadpromises = [],
            statuspromises = [];
        angular.forEach(sections, function(section) {
            if (section.id === mmCoreCourseAllSectionsId) {
                allsectionssection = section;
                section.isCalculating = true;
            } else {
                section.isCalculating = true;
                statuspromises.push(self.calculateSectionStatus(section, courseid, restoreDownloads, refresh, downloadpromises)
                        .then(function(result) {
                    allsectionsstatus = $mmFilepool.determinePackagesStatus(allsectionsstatus, result.status);
                }).finally(function() {
                    section.isCalculating = false;
                }));
            }
        });
        return $q.all(statuspromises).then(function() {
            if (allsectionssection) {
                allsectionssection.showDownload = allsectionsstatus === mmCoreNotDownloaded;
                allsectionssection.showRefresh = allsectionsstatus === mmCoreOutdated;
                allsectionssection.isDownloading = allsectionsstatus === mmCoreDownloading;
            }
            return downloadpromises;
        }).finally(function() {
            if (allsectionssection) {
                allsectionssection.isCalculating = false;
            }
        });
    };
        self.confirmDownloadSize = function(courseid, section, sections) {
        var sizePromise;
        if (section.id != mmCoreCourseAllSectionsId) {
            sizePromise = $mmCoursePrefetchDelegate.getDownloadSize(section.modules, courseid);
        } else {
            var promises = [],
                size = 0;
            angular.forEach(sections, function(s) {
                if (s.id != mmCoreCourseAllSectionsId) {
                    promises.push($mmCoursePrefetchDelegate.getDownloadSize(s.modules, courseid).then(function(sectionsize) {
                        size = size + sectionsize;
                    }));
                }
            });
            sizePromise = $q.all(promises).then(function() {
                return size;
            });
        }
        return sizePromise.then(function(size) {
            return $mmUtil.confirmDownloadSize(size);
        });
    };
        self.getModuleCourseIdByInstance = function(id, module, siteId) {
        return $mmCourse.getModuleBasicInfoByInstance(id, module, siteId).then(function(cm) {
            return cm.course;
        }).catch(function(error) {
            if (error) {
                $mmUtil.showErrorModal(error);
            } else {
                $mmUtil.showErrorModal('mm.course.errorgetmodule', true);
            }
            return $q.reject();
        });
    };
        self.getModulePrefetchInfo = function(module, courseId, invalidateCache) {
        var moduleInfo = {
                size: false,
                sizeReadable: false,
                timemodified: false,
                timemodifiedReadable: false,
                status: false,
                statusIcon: false
            },
            promises = [];
        if (typeof invalidateCache != "undefined" && invalidateCache) {
            $mmCoursePrefetchDelegate.invalidateModuleStatusCache(module);
        }
        promises.push($mmCoursePrefetchDelegate.getModuleDownloadedSize(module, courseId).then(function(moduleSize) {
            moduleInfo.size = moduleSize;
            moduleInfo.sizeReadable = $mmText.bytesToSize(moduleSize, 2);
        }));
        promises.push($mmCoursePrefetchDelegate.getModuleTimemodified(module, courseId).then(function(moduleModified) {
            moduleInfo.timemodified = moduleModified;
            if (moduleModified > 0) {
                var now = $mmUtil.timestamp();
                if (now - moduleModified < 7 * 86400) {
                    moduleInfo.timemodifiedReadable = moment(moduleModified * 1000).fromNow();
                } else {
                    moduleInfo.timemodifiedReadable = moment(moduleModified * 1000).calendar();
                }
            } else {
                moduleInfo.timemodifiedReadable = "";
            }
        }));
        promises.push($mmCoursePrefetchDelegate.getModuleStatus(module, courseId).then(function(moduleStatus) {
            moduleInfo.status = moduleStatus;
            switch (moduleStatus) {
                case mmCoreNotDownloaded:
                    moduleInfo.statusIcon = 'ion-ios-cloud-download-outline';
                    break;
                case mmCoreDownloading:
                    moduleInfo.statusIcon = 'spinner';
                    break;
                case mmCoreOutdated:
                    moduleInfo.statusIcon = 'ion-android-refresh';
                    break;
                default:
                    moduleInfo.statusIcon = "";
                    break;
            }
        }));
        return $q.all(promises).then(function () {
            return moduleInfo;
        });
    };
        self.getSectionDownloadId = function(section) {
        return 'Section-'+section.id;
    };
        self.getSectionsModules = function(sections) {
        if (!sections || !sections.length) {
            return [];
        }
        var modules = [];
        sections.forEach(function(section) {
            if (section.modules) {
                modules = modules.concat(section.modules);
            }
        });
        return modules;
    };
        self.navigateToModule = function(moduleId, siteId, courseId, sectionId) {
        siteId = siteId || $mmSite.getId();
        var modal = $mmUtil.showModalLoading(),
            promise;
        return $mmCourse.canGetModuleWithoutCourseId(siteId).then(function(enabled) {
            if (courseId && sectionId) {
                promise = $q.when();
            } else if (!courseId && !enabled) {
                promise = $q.reject();
            } else if (!courseId) {
                promise = $mmCourse.getModuleBasicInfo(moduleId, siteId).then(function(module) {
                    courseId = module.course;
                    sectionId = module.section;
                });
            } else {
                promise = $mmCourse.getModuleSectionId(moduleId, courseId, siteId).then(function(id) {
                    sectionId = id;
                });
            }
            return promise.then(function() {
                if (courseId == 1) {
                    return $state.go('redirect', {
                        siteid: siteId,
                        state: 'site.mm_course-section',
                        params: {
                            cid: courseId,
                            mid: moduleId
                        }
                    });
                } else {
                    return $state.go('redirect', {
                        siteid: siteId,
                        state: 'site.mm_course',
                        params: {
                            courseid: courseId,
                            moduleid: moduleId,
                            sid: sectionId
                        }
                    });
                }
            });
        }).catch(function(error) {
            if (error) {
                $mmUtil.showErrorModal(error);
            } else {
                $mmUtil.showErrorModal('mm.course.errorgetmodule', true);
            }
            return $q.reject();
        }).finally(function() {
            modal.dismiss();
        });
    };
        self.prefetch = function(section, courseid, sections) {
        if (section.id != mmCoreCourseAllSectionsId) {
            return self.prefetchSection(section, courseid, true, sections);
        } else {
            var promises = [];
            section.isDownloading = true;
            angular.forEach(sections, function(s) {
                if (s.id != mmCoreCourseAllSectionsId) {
                    promises.push(self.prefetchSection(s, courseid, false, sections).then(function() {
                        return self.calculateSectionStatus(s, courseid);
                    }));
                }
            });
            return $mmUtil.allPromises(promises);
        }
    };
        self.prefetchModule = function(scope, service, module, size, refresh) {
        return $mmUtil.confirmDownloadSize(size).then(function() {
            var promise = refresh ? service.invalidateContent(module.id) : $q.when();
            return promise.catch(function() {
            }).then(function() {
                return service.prefetchContent(module).catch(function() {
                    if (!scope.$$destroyed) {
                        $mmUtil.showErrorModal('mm.core.errordownloading', true);
                    }
                });
            });
        });
    };
        self.prefetchSection = function(section, courseid, singleDownload, sections) {
        if (section.id == mmCoreCourseAllSectionsId) {
            return $q.when();
        }
        section.isDownloading = true;
        return $mmCoursePrefetchDelegate.getModulesStatus(section.id, section.modules, courseid).then(function(result) {
            if (result.status === mmCoreNotDownloaded || result.status === mmCoreOutdated || result.status === mmCoreDownloading) {
                var promise = self.startOrRestorePrefetch(section, result, courseid);
                if (singleDownload) {
                    self.calculateSectionsStatus(sections, courseid, false);
                }
                return promise;
            }
        }, function() {
            section.isDownloading = false;
            return $q.reject();
        });
    };
        self.startOrRestorePrefetch = function(section, status, courseid) {
        if (section.id == mmCoreCourseAllSectionsId) {
            return $q.when();
        }
        var modules = status[mmCoreOutdated].concat(status[mmCoreNotDownloaded]).concat(status[mmCoreDownloading]),
            downloadid = self.getSectionDownloadId(section),
            moduleids;
        moduleids = modules.map(function(m) {
            return m.id;
        });
        section.count = 0;
        section.total = modules.length;
        section.isDownloading = true;
        return $mmCoursePrefetchDelegate.prefetchAll(downloadid, modules, courseid).then(function() {}, function() {
            return $q.reject();
        }, function(id) {
            var index = moduleids.indexOf(id);
            if (index > -1) {
                moduleids.splice(index, 1);
                section.count++;
            }
        });
    };
    return self;
}]);

angular.module('mm.core')
.provider('$mmCoursePrefetchDelegate', function() {
    var prefetchHandlers = {},
        self = {};
        self.registerPrefetchHandler = function(addon, handles, handler) {
        if (typeof prefetchHandlers[handles] !== 'undefined') {
            console.log("$mmCoursePrefetchDelegateProvider: Addon '" + prefetchHandlers[handles].addon +
                            "' already registered as handler for '" + handles + "'");
            return false;
        }
        console.log("$mmCoursePrefetchDelegateProvider: Registered addon '" + addon + "' as prefetch handler.");
        prefetchHandlers[handles] = {
            addon: addon,
            handler: handler,
            instance: undefined
        };
        return true;
    };
    self.$get = ["$q", "$log", "$mmSite", "$mmUtil", "$mmFilepool", "$mmEvents", "mmCoreDownloaded", "mmCoreDownloading", "mmCoreNotDownloaded", "mmCoreOutdated", "mmCoreNotDownloadable", "mmCoreEventSectionStatusChanged", "$mmFS", function($q, $log, $mmSite, $mmUtil, $mmFilepool, $mmEvents, mmCoreDownloaded, mmCoreDownloading,
                mmCoreNotDownloaded, mmCoreOutdated, mmCoreNotDownloadable, mmCoreEventSectionStatusChanged, $mmFS) {
        var enabledHandlers = {},
            self = {},
            deferreds = {},
            lastUpdateHandlersStart;
        $log = $log.getInstance('$mmCoursePrefetchDelegate');
                self.clearStatusCache = function() {
            statusCache.clear();
        };
                self.invalidateModuleStatusCache = function(module) {
            var handler = enabledHandlers[module.modname];
            if (handler) {
                statusCache.invalidate(handler.component, module.id);
            }
        };
        var statusCache = new function() {
            var cacheStore = {};
            this.clear = function() {
                cacheStore = {};
            };
                        this.get = function(component, componentId) {
                var packageId = $mmFilepool.getPackageId(component, componentId);
                if (!cacheStore[packageId]) {
                    cacheStore[packageId] = {};
                }
                return cacheStore[packageId];
            };
                        this.getValue = function(component, componentId, name, ignoreInvalidate) {
                var cache = this.get(component, componentId);
                if (typeof cache[name] != "undefined") {
                    var now = new Date().getTime();
                    if (!ignoreInvalidate || cache.lastupdate + 300000 >= now) {
                        return cache[name];
                    }
                }
                return false;
            };
                        this.setValue = function(component, componentId, name, value) {
                var cache = this.get(component, componentId);
                cache[name] = value;
                cache.lastupdate = new Date().getTime();
                return value;
            };
                        this.invalidate = function(component, componentId) {
                var packageId = $mmFilepool.getPackageId(component, componentId);
                delete cacheStore[packageId];
            };
        };
                self.determineModuleStatus = function(module, status, restoreDownloads) {
            var handler = enabledHandlers[module.modname];
            if (handler) {
                if (status == mmCoreDownloading && restoreDownloads) {
                    if (!$mmFilepool.getPackageDownloadPromise($mmSite.getId(), handler.component, module.id)) {
                        handler.prefetch(module);
                    }
                } else if (handler.determineStatus) {
                    return handler.determineStatus(status);
                }
            }
            return status;
        };
                self.getDownloadSize = function(modules, courseid) {
            var size = 0,
                promises = [];
            angular.forEach(modules, function(module) {
                promises.push(self.getModuleStatus(module, courseid).then(function(modstatus) {
                    if (modstatus === mmCoreNotDownloaded || modstatus === mmCoreOutdated) {
                        return self.getModuleDownloadSize(module, courseid).then(function(modulesize) {
                            size = size + modulesize;
                        });
                    }
                    return $q.when();
                }));
            });
            return $q.all(promises).then(function() {
                return size;
            });
        };
                self.prefetchModule = function(module, courseid) {
            var handler = enabledHandlers[module.modname];
            if (handler) {
                return handler.prefetch(module, courseid);
            }
            return $q.when();
        };
                self.getModuleDownloadSize = function(module, courseid) {
            var downloadSize,
                handler = enabledHandlers[module.modname];
            if (handler) {
                return self.isModuleDownloadable(module, courseid).then(function(downloadable) {
                    if (!downloadable) {
                        return;
                    }
                    downloadSize = statusCache.getValue(handler.component, module.id, 'downloadSize');
                    if (downloadSize !== false) {
                        return downloadSize;
                    }
                    return $q.when(handler.getDownloadSize(module, courseid)).then(function(size) {
                        return statusCache.setValue(handler.component, module.id, 'downloadSize', size);
                    }).catch(function() {
                        return statusCache.getValue(handler.component, module.id, 'downloadSize', true);
                    });
                });
            }
            return $q.when(0);
        };
                self.getModuleDownloadedSize = function(module, courseid) {
            var downloadedSize,
                handler = enabledHandlers[module.modname];
            if (handler) {
                return self.isModuleDownloadable(module, courseid).then(function(downloadable) {
                    if (!downloadable) {
                        return;
                    }
                    downloadedSize = statusCache.getValue(handler.component, module.id, 'downloadedSize');
                    if (downloadedSize !== false) {
                        return downloadedSize;
                    }
                    return self.getModuleFiles(module, courseid).then(function(files) {
                        var siteId = $mmSite.getId(),
                            promises = [],
                            size = 0;
                        angular.forEach(files, function(file) {
                            promises.push($mmFilepool.getFilePathByUrl(siteId, file.fileurl).then(function(path) {
                                return $mmFS.getFileSize(path).catch(function () {
                                    return $mmFilepool.isFileDownloadingByUrl(siteId, file.fileurl).then(function() {
                                        return file.filesize;
                                    }).catch(function() {
                                        return 0;
                                    });
                                }).then(function(fs) {
                                    size += fs;
                                });
                            }));
                        });
                        return $q.all(promises).then(function() {
                            return size;
                        });
                    }).then(function(size) {
                        return statusCache.setValue(handler.component, module.id, 'downloadedSize', size);
                    }).catch(function() {
                        return statusCache.getValue(handler.component, module.id, 'downloadedSize', true);
                    });
                });
            }
            return $q.when(0);
        };
                self.getModuleTimemodified = function(module, courseid, files) {
            var handler = enabledHandlers[module.modname],
                promise, timemodified;
            if (handler) {
                timemodified = statusCache.getValue(handler.component, module.id, 'timemodified');
                if (timemodified) {
                    return $q.when(timemodified);
                }
                if (handler.getTimemodified) {
                    promise = handler.getTimemodified(module, courseid);
                } else {
                    promise = files ? $q.when(files) : self.getModuleFiles(module, courseid);
                    return promise.then(function(files) {
                        return $mmFilepool.getTimemodifiedFromFileList(files);
                    });
                }
                return $q.when(promise).then(function(timemodified) {
                    return statusCache.setValue(handler.component, module.id, 'timemodified', timemodified);
                }).catch(function() {
                    return statusCache.getValue(handler.component, module.id, 'timemodified', true);
                });
            }
            return $q.reject();
        };
                self.getModuleRevision = function(module, courseid, files) {
            var handler = enabledHandlers[module.modname],
                promise, revision;
            if (handler) {
                revision = statusCache.getValue(handler.component, module.id, 'revision');
                if (revision) {
                    return $q.when(revision);
                }
                if (handler.getRevision) {
                    promise = handler.getRevision(module, courseid).then();
                } else {
                    promise = files ? $q.when(files) : self.getModuleFiles(module, courseid);
                    promise = promise.then(function(files) {
                        return $mmFilepool.getRevisionFromFileList(files);
                    });
                }
                return $q.when(promise).then(function(revision) {
                    return statusCache.setValue(handler.component, module.id, 'revision', revision);
                }).catch(function() {
                    return statusCache.getValue(handler.component, module.id, 'revision', true);
                });
            }
            return $q.reject();
        };
                self.getModuleFiles = function(module, courseid) {
            var handler = enabledHandlers[module.modname];
            module.contents = module.contents || [];
            return handler.getFiles ? $q.when(handler.getFiles(module, courseid)) : $q.when(module.contents);
        };
                self.removeModuleFiles = function(module, courseid) {
            var handler = enabledHandlers[module.modname],
                siteId = $mmSite.getId();
            return self.getModuleFiles(module, courseid).then(function(files) {
                angular.forEach(files, function(file) {
                    return $mmFilepool.removeFileByUrl(siteId, file.fileurl).catch(function() {
                    });
                });
                if (handler) {
                    statusCache.setValue(handler.component, module.id, 'downloadedSize', 0);
                    $mmFilepool.storePackageStatus(siteId, handler.component, module.id, mmCoreNotDownloaded);
                }
            });
        };
                self.getModuleStatus = function(module, courseid, revision, timemodified) {
            var handler = enabledHandlers[module.modname],
                siteid = $mmSite.getId();
            if (handler) {
                return self.isModuleDownloadable(module, courseid).then(function(downloadable) {
                    if (!downloadable) {
                        return mmCoreNotDownloadable;
                    }
                    var status = statusCache.getValue(handler.component, module.id, 'status');
                    if (status) {
                        return self.determineModuleStatus(module, status, true);
                    }
                    return self.getModuleFiles(module, courseid).then(function(files) {
                        var promises = [];
                        if (typeof revision == 'undefined') {
                            promises.push(self.getModuleRevision(module, courseid, files).then(function(rev) {
                                revision = rev;
                            }));
                        }
                        if (typeof timemodified == 'undefined') {
                            promises.push(self.getModuleTimemodified(module, courseid, files).then(function(timemod) {
                                timemodified = timemod;
                            }));
                        }
                        return $q.all(promises).then(function() {
                            return $mmFilepool.getPackageStatus(siteid, handler.component, module.id, revision, timemodified)
                                    .then(function(status) {
                                status = statusCache.setValue(handler.component, module.id, 'status', status);
                                return self.determineModuleStatus(module, status, true);
                            }).catch(function() {
                                status = statusCache.getValue(handler.component, module.id, 'status', true);
                                return self.determineModuleStatus(module, status, true);
                            });
                        });
                    });
                });
            }
            return $q.when(mmCoreNotDownloadable);
        };
                self.getModulesStatus = function(sectionid, modules, courseid, refresh, restoreDownloads) {
            var promises = [],
                status = mmCoreNotDownloadable,
                result = {};
            result[mmCoreNotDownloaded] = [];
            result[mmCoreDownloaded] = [];
            result[mmCoreDownloading] = [];
            result[mmCoreOutdated] = [];
            result.total = 0;
            angular.forEach(modules, function(module) {
                var handler = enabledHandlers[module.modname],
                    promise;
                module.contents = module.contents || [];
                if (handler) {
                    var cacheStatus = statusCache.getValue(handler.component, module.id, 'status');
                    if (!refresh && cacheStatus) {
                        promise = $q.when(self.determineModuleStatus(module, cacheStatus, restoreDownloads));
                    } else {
                        promise = self.getModuleStatus(module, courseid);
                    }
                    promises.push(
                        promise.then(function(modstatus) {
                            if (modstatus != mmCoreNotDownloadable) {
                                statusCache.setValue(handler.component, module.id, 'sectionid', sectionid);
                                modstatus = statusCache.setValue(handler.component, module.id, 'status', modstatus);
                                status = $mmFilepool.determinePackagesStatus(status, modstatus);
                                result[modstatus].push(module);
                                result.total++;
                            }
                        }).catch(function() {
                            modstatus = statusCache.getValue(handler.component, module.id, 'status', true);
                            if (!modstatus) {
                                return $q.reject();
                            }
                            if (modstatus != mmCoreNotDownloadable) {
                                status = $mmFilepool.determinePackagesStatus(status, modstatus);
                                result[modstatus].push(module);
                                result.total++;
                            }
                        })
                    );
                }
            });
            return $q.all(promises).then(function() {
                result.status = status;
                return result;
            });
        };
                self.getPrefetchHandlerFor = function(handles) {
            return enabledHandlers[handles];
        };
                self.invalidateModules = function(modules, courseId) {
            var promises = [];
            angular.forEach(modules, function(module) {
                var handler = enabledHandlers[module.modname];
                if (handler) {
                    if (handler.invalidateModule) {
                        promises.push(handler.invalidateModule(module, courseId).catch(function() {
                        }));
                    }
                    statusCache.invalidate(handler.component, module.id);
                }
            });
            return $q.all(promises);
        };
                self.isBeingDownloaded = function(id) {
            return deferreds[$mmSite.getId()] && deferreds[$mmSite.getId()][id];
        };
                self.isLastUpdateCall = function(time) {
            if (!lastUpdateHandlersStart) {
                return true;
            }
            return time == lastUpdateHandlersStart;
        };
                self.isModuleDownloadable = function(module, courseid) {
            var handler = enabledHandlers[module.modname],
                promise;
            if (handler) {
                if (typeof handler.isDownloadable == 'function') {
                    promise = $q.when(handler.isDownloadable(module, courseid));
                } else {
                    promise = $q.when(true);
                }
                return promise.catch(function() {
                    return false;
                });
            } else {
                return $q.when(false);
            }
        };
                self.prefetchAll = function(id, modules, courseid) {
            var siteid = $mmSite.getId();
            if (deferreds[siteid] && deferreds[siteid][id]) {
                return deferreds[siteid][id].promise;
            }
            var deferred = $q.defer(),
                promises = [];
            if (!deferreds[siteid]) {
                deferreds[siteid] = {};
            }
            deferreds[siteid][id] = deferred;
            angular.forEach(modules, function(module) {
                module.contents = module.contents || [];
                var handler = enabledHandlers[module.modname];
                if (handler) {
                    promises.push(self.isModuleDownloadable(module, courseid).then(function(downloadable) {
                        if (!downloadable) {
                            return;
                        }
                        return handler.prefetch(module, courseid).then(function() {
                            deferred.notify(module.id);
                        });
                    }));
                }
            });
            $q.all(promises).then(function() {
                delete deferreds[siteid][id];
                deferred.resolve();
            }, function() {
                delete deferreds[siteid][id];
                deferred.reject();
            });
            return deferred.promise;
        };
                self.updatePrefetchHandler = function(handles, handlerInfo, time) {
            var promise,
                siteId = $mmSite.getId();
            if (typeof handlerInfo.instance === 'undefined') {
                handlerInfo.instance = $mmUtil.resolveObject(handlerInfo.handler, true);
            }
            if (!$mmSite.isLoggedIn()) {
                promise = $q.reject();
            } else {
                promise = $q.when(handlerInfo.instance.isEnabled());
            }
            return promise.catch(function() {
                return false;
            }).then(function(enabled) {
                if (self.isLastUpdateCall(time) && $mmSite.isLoggedIn() && $mmSite.getId() === siteId) {
                    if (enabled) {
                        enabledHandlers[handles] = handlerInfo.instance;
                    } else {
                        delete enabledHandlers[handles];
                    }
                }
            });
        };
                self.updatePrefetchHandlers = function() {
            var promises = [],
                now = new Date().getTime();
            $log.debug('Updating prefetch handlers for current site.');
            lastUpdateHandlersStart = now;
            angular.forEach(prefetchHandlers, function(handlerInfo, handles) {
                promises.push(self.updatePrefetchHandler(handles, handlerInfo, now));
            });
            return $q.all(promises).then(function() {
                return true;
            }, function() {
                return true;
            });
        };
                self.updateStatusCache = function(component, componentId, status) {
            var notify,
                cachedStatus = statusCache.getValue(component, componentId, 'status', true);
            notify = cachedStatus && cachedStatus !== status;
            if (notify) {
                var sectionId = statusCache.getValue(component, componentId, 'sectionid', true);
                statusCache.invalidate(component, componentId);
                statusCache.setValue(component, componentId, 'status', status);
                statusCache.setValue(component, componentId, 'sectionid', sectionId);
                $mmEvents.trigger(mmCoreEventSectionStatusChanged, {
                    sectionid: sectionId,
                    siteid: $mmSite.getId()
                });
            } else {
                statusCache.setValue(component, componentId, 'status', status);
            }
        };
        return self;
    }];
    return self;
})
.run(["$mmEvents", "mmCoreEventLogin", "mmCoreEventSiteUpdated", "mmCoreEventLogout", "$mmCoursePrefetchDelegate", "$mmSite", "mmCoreEventPackageStatusChanged", "mmCoreEventRemoteAddonsLoaded", function($mmEvents, mmCoreEventLogin, mmCoreEventSiteUpdated, mmCoreEventLogout, $mmCoursePrefetchDelegate, $mmSite,
            mmCoreEventPackageStatusChanged, mmCoreEventRemoteAddonsLoaded) {
    $mmEvents.on(mmCoreEventLogin, $mmCoursePrefetchDelegate.updatePrefetchHandlers);
    $mmEvents.on(mmCoreEventSiteUpdated, $mmCoursePrefetchDelegate.updatePrefetchHandlers);
    $mmEvents.on(mmCoreEventRemoteAddonsLoaded, $mmCoursePrefetchDelegate.updatePrefetchHandlers);
    $mmEvents.on(mmCoreEventLogout, $mmCoursePrefetchDelegate.clearStatusCache);
    $mmEvents.on(mmCoreEventPackageStatusChanged, function(data) {
        if (data.siteid === $mmSite.getId()) {
            $mmCoursePrefetchDelegate.updateStatusCache(data.component, data.componentId, data.status);
        }
    });
}]);

angular.module('mm.core.courses')
.controller('mmCoursesListCtrl', ["$scope", "$mmCourses", "$mmCoursesDelegate", "$mmUtil", "$mmEvents", "$mmSite", "mmCoursesEventMyCoursesUpdated", "mmCoursesEventMyCoursesRefreshed", function($scope, $mmCourses, $mmCoursesDelegate, $mmUtil, $mmEvents, $mmSite,
            mmCoursesEventMyCoursesUpdated, mmCoursesEventMyCoursesRefreshed) {
    $scope.searchEnabled = $mmCourses.isSearchCoursesAvailable();
    $scope.areNavHandlersLoadedFor = $mmCoursesDelegate.areNavHandlersLoadedFor;
    $scope.filter = {};
    function fetchCourses(refresh) {
        return $mmCourses.getUserCourses().then(function(courses) {
            $scope.courses = courses;
            angular.forEach(courses, function(course) {
                course._handlers = $mmCoursesDelegate.getNavHandlersFor(course.id, refresh);
            });
            $scope.filter.filterText = '';
        }, function(error) {
            if (typeof error != 'undefined' && error !== '') {
                $mmUtil.showErrorModal(error);
            } else {
                $mmUtil.showErrorModal('mm.courses.errorloadcourses', true);
            }
        });
    }
    fetchCourses().finally(function() {
        $scope.coursesLoaded = true;
    });
    $scope.refreshCourses = function() {
        $mmEvents.trigger(mmCoursesEventMyCoursesRefreshed);
        $mmCourses.invalidateUserCourses().finally(function() {
            fetchCourses(true).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        });
    };
    $mmEvents.on(mmCoursesEventMyCoursesUpdated, function(siteid) {
        if (siteid == $mmSite.getId()) {
            fetchCourses();
        }
    });
}]);

angular.module('mm.core.courses')
.controller('mmCoursesSearchCtrl', ["$scope", "$mmCourses", "$q", "$mmUtil", function($scope, $mmCourses, $q, $mmUtil) {
    var page = 0,
    	currentSearch = '';
    $scope.searchText = '';
    function searchCourses(refresh) {
        if (refresh) {
            page = 0;
        }
        return $mmCourses.search(currentSearch, page).then(function(response) {
            if (page === 0) {
                $scope.courses = response.courses;
            } else {
                $scope.courses = $scope.courses.concat(response.courses);
            }
            $scope.total = response.total;
            page++;
            $scope.canLoadMore = $scope.courses.length < $scope.total;
        }).catch(function(message) {
            $scope.canLoadMore = false;
            if (message) {
                $mmUtil.showErrorModal(message);
            } else {
                $mmUtil.showErrorModal('mma.searchcourses.errorsearching', true);
            }
            return $q.reject();
        });
    }
    $scope.search = function(text) {
        currentSearch = text;
        $scope.courses = undefined;
    	var modal = $mmUtil.showModalLoading('mm.core.searching', true);
    	searchCourses(true).finally(function() {
            modal.dismiss();
    	});
    };
    $scope.loadMoreResults = function() {
    	searchCourses();
    };
}]);

angular.module('mm.core.courses')
.controller('mmCoursesViewResultCtrl', ["$scope", "$stateParams", "$mmCourses", "$mmCoursesDelegate", "$mmUtil", "$translate", "$q", "$ionicModal", "$mmEvents", "$mmSite", "mmCoursesSearchComponent", "mmCoursesEnrolInvalidKey", "mmCoursesEventMyCoursesUpdated", function($scope, $stateParams, $mmCourses, $mmCoursesDelegate, $mmUtil, $translate, $q,
            $ionicModal, $mmEvents, $mmSite, mmCoursesSearchComponent, mmCoursesEnrolInvalidKey, mmCoursesEventMyCoursesUpdated) {
    var course = $stateParams.course || {},
        selfEnrolWSAvailable = $mmCourses.isSelfEnrolmentEnabled(),
        guestWSAvailable = $mmCourses.isGuestWSAvailable(),
        isGuestEnabled = false,
        guestInstanceId,
        handlersShouldBeShown = true,
        enrollmentMethods;
    $scope.course = course;
    $scope.title = course.fullname;
    $scope.component = mmCoursesSearchComponent;
    $scope.selfEnrolInstances = [];
    $scope.enroldata = {
        password: ''
    };
    $scope.loadingHandlers = function() {
        return handlersShouldBeShown && !$mmCoursesDelegate.areNavHandlersLoadedFor(course.id);
    };
    function getCourse(refresh) {
        var promise;
        if (selfEnrolWSAvailable || guestWSAvailable) {
            $scope.selfEnrolInstances = [];
            promise = $mmCourses.getCourseEnrolmentMethods(course.id).then(function(methods) {
                enrollmentMethods = methods;
                angular.forEach(enrollmentMethods, function(method) {
                    if (selfEnrolWSAvailable && method.type === 'self') {
                        $scope.selfEnrolInstances.push(method);
                    } else if (guestWSAvailable && method.type === 'guest') {
                        isGuestEnabled = true;
                    }
                });
            }).catch(function(error) {
                if (error) {
                    $mmUtil.showErrorModal(error);
                }
            });
        } else {
            promise = $q.when();
        }
        return promise.then(function() {
            return $mmCourses.getUserCourse(course.id).then(function(c) {
                $scope.isEnrolled = true;
                return c;
            }).catch(function() {
                $scope.isEnrolled = false;
                return $mmCourses.getCourse(course.id);
            }).then(function(c) {
                course.fullname = c.fullname || course.fullname;
                course.summary = c.summary || course.summary;
                course._handlers = $mmCoursesDelegate.getNavHandlersFor(course.id, refresh);
            }).catch(function() {
                return canAccessAsGuest().then(function(passwordRequired) {
                    if (!passwordRequired) {
                        course._handlers = $mmCoursesDelegate.getNavHandlersForGuest(course.id, refresh);
                    } else {
                        course._handlers = [];
                        handlersShouldBeShown = false;
                    }
                }).catch(function() {
                    course._handlers = [];
                    handlersShouldBeShown = false;
                });
            });
        });
    }
    function canAccessAsGuest() {
        if (!isGuestEnabled) {
            return $q.reject();
        }
        angular.forEach(enrollmentMethods, function(method) {
            if (method.type == 'guest') {
                guestInstanceId = method.id;
            }
        });
        if (guestInstanceId) {
            return $mmCourses.getCourseGuestEnrolmentInfo(guestInstanceId).then(function(info) {
                if (!info.status) {
                    return $q.reject();
                }
                return info.passwordrequired;
            });
        }
        return $q.reject();
    }
    function refreshData() {
        var promises = [];
        promises.push($mmCourses.invalidateUserCourses());
        promises.push($mmCourses.invalidateCourse(course.id));
        promises.push($mmCourses.invalidateCourseEnrolmentMethods(course.id));
        if (guestInstanceId) {
            promises.push($mmCourses.invalidateCourseGuestEnrolmentInfo(guestInstanceId));
        }
        return $q.all(promises).finally(function() {
            return getCourse(true);
        });
    }
    getCourse().finally(function() {
        $scope.courseLoaded = true;
    });
    $scope.doRefresh = function() {
        refreshData().finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    if (selfEnrolWSAvailable && course.enrollmentmethods.indexOf('self') > -1) {
        $ionicModal.fromTemplateUrl('core/components/courses/templates/password-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.closeModal = function() {
                $scope.enroldata.password = '';
                delete $scope.currentEnrolInstance;
                modal.hide();
            };
            $scope.$on('$destroy', function() {
                modal.remove();
            });
        });
        $scope.enrol = function(instanceId, password) {
            var promise;
            if ($scope.modal.isShown()) {
                promise = $q.when();
            } else {
                promise = $mmUtil.showConfirm($translate('mm.courses.confirmselfenrol'));
            }
            promise.then(function() {
                var modal = $mmUtil.showModalLoading('mm.core.loading', true);
                $mmCourses.selfEnrol(course.id, password, instanceId).then(function() {
                    $scope.closeModal();
                    $scope.isEnrolled = true;
                    refreshData().finally(function() {
                        $mmEvents.trigger(mmCoursesEventMyCoursesUpdated, $mmSite.getId());
                    });
                }).catch(function(error) {
                    if (error) {
                        if (error.code === mmCoursesEnrolInvalidKey) {
                            if ($scope.modal.isShown()) {
                                $mmUtil.showErrorModal(error.message);
                            } else {
                                $scope.currentEnrolInstance = instanceId;
                                $scope.modal.show();
                            }
                        } else if (typeof error == 'string') {
                            $mmUtil.showErrorModal(error);
                        }
                    } else {
                        $mmUtil.showErrorModal('mm.courses.errorselfenrol', true);
                    }
                }).finally(function() {
                    modal.dismiss();
                });
            });
        };
    }
}]);

angular.module('mm.core.courses')
.factory('$mmCourses', ["$q", "$mmSite", "$log", "$mmSitesManager", "mmCoursesSearchPerPage", "mmCoursesEnrolInvalidKey", function($q, $mmSite, $log, $mmSitesManager, mmCoursesSearchPerPage, mmCoursesEnrolInvalidKey) {
    $log = $log.getInstance('$mmCourses');
    var self = {},
        currentCourses = {};
        self.clearCurrentCourses = function() {
        currentCourses = {};
    };
        self.getCourse = function(id, siteid) {
        return self.getCourses([id], siteid).then(function(courses) {
            if (courses && courses.length > 0) {
                return courses[0];
            }
            return $q.reject();
        });
    };
        self.getCourseEnrolmentMethods = function(id) {
        var params = {
                courseid: id
            },
            preSets = {
                cacheKey: getCourseEnrolmentMethodsCacheKey(id)
            };
        return $mmSite.read('core_enrol_get_course_enrolment_methods', params, preSets);
    };
        function getCourseEnrolmentMethodsCacheKey(id) {
        return 'mmCourses:enrolmentmethods:' + id;
    }
        self.getCourseGuestEnrolmentInfo = function(instanceId) {
        var params = {
                instanceid: instanceId
            },
            preSets = {
                cacheKey: getCourseGuestEnrolmentInfoCacheKey(instanceId)
            };
        return $mmSite.read('enrol_guest_get_instance_info', params, preSets).then(function(response) {
            return response.instanceinfo;
        });
    };
        function getCourseGuestEnrolmentInfoCacheKey(instanceId) {
        return 'mmCourses:guestinfo:' + instanceId;
    }
        self.getCourses = function(ids, siteid) {
        siteid = siteid || $mmSite.getId();
        if (!angular.isArray(ids)) {
            return $q.reject();
        } else if (ids.length === 0) {
            return $q.when([]);
        }
        return $mmSitesManager.getSite(siteid).then(function(site) {
            var data = {
                    options: {
                        ids: ids
                    }
                },
                preSets = {
                    cacheKey: getCoursesCacheKey(ids)
                };
            return site.read('core_course_get_courses', data, preSets).then(function(courses) {
                if (typeof courses != 'object' && !angular.isArray(courses)) {
                    return $q.reject();
                }
                return courses;
            });
        });
    };
        function getCoursesCacheKey(ids) {
        return 'mmCourses:course:' + JSON.stringify(ids);
    }
        self.getStoredCourse = function(id) {
        $log.warn('The function \'getStoredCourse\' is deprecated. Please use \'getUserCourse\' instead');
        return currentCourses[id];
    };
        self.getUserCourse = function(id, preferCache, siteid) {
        siteid = siteid || $mmSite.getId();
        if (!id) {
            return $q.reject();
        }
        if (typeof preferCache == 'undefined') {
            preferCache = false;
        }
        return self.getUserCourses(preferCache, siteid).then(function(courses) {
            var course;
            angular.forEach(courses, function(c) {
                if (c.id == id) {
                    course = c;
                }
            });
            return course ? course : $q.reject();
        });
    };
        self.getUserCourses = function(preferCache, siteid) {
        siteid = siteid || $mmSite.getId();
        if (typeof preferCache == 'undefined') {
            preferCache = false;
        }
        return $mmSitesManager.getSite(siteid).then(function(site) {
            var userid = site.getUserId(),
                presets = {
                    cacheKey: getUserCoursesCacheKey(),
                    omitExpires: preferCache
                },
                data = {userid: userid};
            if (typeof userid === 'undefined') {
                return $q.reject();
            }
            return site.read('core_enrol_get_users_courses', data, presets).then(function(courses) {
                if (siteid === $mmSite.getId()) {
                    storeCoursesInMemory(courses);
                }
                return courses;
            });
        });
    };
        function getUserCoursesCacheKey() {
        return 'mmCourses:usercourses';
    }
        self.invalidateCourse = function(id, siteid) {
        return self.invalidateCourses([id], siteid);
    };
        self.invalidateCourseEnrolmentMethods = function(id) {
        return $mmSite.invalidateWsCacheForKey(getCourseEnrolmentMethodsCacheKey(id));
    };
        self.invalidateCourseGuestEnrolmentInfo = function(instanceId) {
        return $mmSite.invalidateWsCacheForKey(getCourseGuestEnrolmentInfoCacheKey(instanceId));
    };
        self.invalidateCourses = function(ids, siteid) {
        siteid = siteid || $mmSite.getId();
        return $mmSitesManager.getSite(siteid).then(function(site) {
            return site.invalidateWsCacheForKey(getCoursesCacheKey(ids));
        });
    };
        self.invalidateUserCourses = function(siteid) {
        siteid = siteid || $mmSite.getId();
        return $mmSitesManager.getSite(siteid).then(function(site) {
            return site.invalidateWsCacheForKey(getUserCoursesCacheKey());
        });
    };
        self.isGuestWSAvailable = function() {
        return $mmSite.wsAvailable('enrol_guest_get_instance_info');
    };
        self.isSearchCoursesAvailable = function() {
        return $mmSite.wsAvailable('core_course_search_courses');
    };
        self.isSelfEnrolmentEnabled = function() {
        return $mmSite.wsAvailable('enrol_self_enrol_user');
    };
        self.search = function(text, page, perpage) {
        page = page || 0;
        perpage = perpage || mmCoursesSearchPerPage;
        var params = {
                criterianame: 'search',
                criteriavalue: text,
                page: page,
                perpage: perpage
            }, preSets = {
                getFromCache: false
            };
        return $mmSite.read('core_course_search_courses', params, preSets).then(function(response) {
            if (typeof response == 'object') {
                return {total: response.total, courses: response.courses};
            }
            return $q.reject();
        });
    };
        self.selfEnrol = function(courseid, password, instanceId) {
        if (typeof password == 'undefined') {
            password = '';
        }
        var params = {
            courseid: courseid,
            password: password
        };
        if (instanceId) {
            params.instanceid = instanceId;
        }
        return $mmSite.write('enrol_self_enrol_user', params).then(function(response) {
            if (response) {
                if (response.status) {
                    return true;
                } else if (response.warnings && response.warnings.length) {
                    var message;
                    angular.forEach(response.warnings, function(warning) {
                        if (warning.warningcode == '2' || warning.warningcode == '4') {
                            message = warning.message;
                        }
                    });
                    if (message) {
                        return $q.reject({code: mmCoursesEnrolInvalidKey, message: message});
                    }
                }
            }
            return $q.reject();
        });
    };
        function storeCoursesInMemory(courses) {
        angular.forEach(courses, function(course) {
            currentCourses[course.id] = angular.copy(course);
        });
    }
    return self;
}]);

angular.module('mm.core.courses')
.provider('$mmCoursesDelegate', function() {
    var navHandlers = {},
        self = {};
        self.registerNavHandler = function(addon, handler, priority) {
        if (typeof navHandlers[addon] !== 'undefined') {
            console.log("$mmCoursesDelegateProvider: Addon '" + navHandlers[addon].addon + "' already registered as navigation handler");
            return false;
        }
        console.log("$mmCoursesDelegateProvider: Registered addon '" + addon + "' as navibation handler.");
        navHandlers[addon] = {
            addon: addon,
            handler: handler,
            instance: undefined,
            priority: priority
        };
        return true;
    };
    self.$get = ["$mmUtil", "$q", "$log", "$mmSite", "mmCoursesAccessMethods", function($mmUtil, $q, $log, $mmSite, mmCoursesAccessMethods) {
        var enabledNavHandlers = {},
            coursesHandlers = {},
            self = {},
            loaded = {},
            lastUpdateHandlersStart,
            lastUpdateHandlersForCoursesStart = {};
        $log = $log.getInstance('$mmCoursesDelegate');
                self.areNavHandlersLoadedFor = function(courseId) {
            return loaded[courseId];
        };
                self.clearCoursesHandlers = function() {
            coursesHandlers = {};
            loaded = {};
        };
                function getNavHandlersForAccess(courseId, refresh, accessData) {
            if (refresh || !coursesHandlers[courseId] || coursesHandlers[courseId].access.type != accessData.type) {
                coursesHandlers[courseId] = {
                    access: accessData,
                    handlers: []
                };
                self.updateNavHandlersForCourse(courseId, accessData);
            }
            return coursesHandlers[courseId].handlers;
        }
                self.getNavHandlersFor = function(courseId, refresh) {
            var accessData = {
                type: mmCoursesAccessMethods.default
            };
            return getNavHandlersForAccess(courseId, refresh, accessData);
        };
                self.getNavHandlersForGuest = function(courseId, refresh) {
            var accessData = {
                type: mmCoursesAccessMethods.guest
            };
            return getNavHandlersForAccess(courseId, refresh, accessData);
        };
                self.isLastUpdateCall = function(time) {
            if (!lastUpdateHandlersStart) {
                return true;
            }
            return time == lastUpdateHandlersStart;
        };
                self.isLastUpdateCourseCall = function(courseId, time) {
            if (!lastUpdateHandlersForCoursesStart[courseId]) {
                return true;
            }
            return time == lastUpdateHandlersForCoursesStart[courseId];
        };
                self.updateNavHandler = function(addon, handlerInfo, time) {
            var promise,
                siteId = $mmSite.getId();
            if (typeof handlerInfo.instance === 'undefined') {
                handlerInfo.instance = $mmUtil.resolveObject(handlerInfo.handler, true);
            }
            if (!$mmSite.isLoggedIn()) {
                promise = $q.reject();
            } else {
                promise = $q.when(handlerInfo.instance.isEnabled());
            }
            return promise.catch(function() {
                return false;
            }).then(function(enabled) {
                if (self.isLastUpdateCall(time) && $mmSite.isLoggedIn() && $mmSite.getId() === siteId) {
                    if (enabled) {
                        enabledNavHandlers[addon] = {
                            instance: handlerInfo.instance,
                            priority: handlerInfo.priority
                        };
                    } else {
                        delete enabledNavHandlers[addon];
                    }
                }
            });
        };
                self.updateNavHandlers = function() {
            var promises = [],
                siteId = $mmSite.getId(),
                now = new Date().getTime();
            $log.debug('Updating navigation handlers for current site.');
            lastUpdateHandlersStart = now;
            angular.forEach(navHandlers, function(handlerInfo, addon) {
                promises.push(self.updateNavHandler(addon, handlerInfo, now));
            });
            return $q.all(promises).then(function() {
                return true;
            }, function() {
                return true;
            }).finally(function() {
                if (self.isLastUpdateCall(now) && $mmSite.isLoggedIn() && $mmSite.getId() === siteId) {
                    angular.forEach(coursesHandlers, function(handler, courseId) {
                        self.updateNavHandlersForCourse(parseInt(courseId), handler.access);
                    });
                }
            });
        };
                self.updateNavHandlersForCourse = function(courseId, accessData) {
            var promises = [],
                enabledForCourse = [],
                siteId = $mmSite.getId(),
                now = new Date().getTime();
            lastUpdateHandlersForCoursesStart[courseId] = now;
            angular.forEach(enabledNavHandlers, function(handler) {
                var promise = $q.when(handler.instance.isEnabledForCourse(courseId, accessData)).then(function(enabled) {
                    if (enabled) {
                        enabledForCourse.push(handler);
                    } else {
                        return $q.reject();
                    }
                }).catch(function() {
                });
                promises.push(promise);
            });
            return $q.all(promises).then(function() {
                return true;
            }).catch(function() {
                return true;
            }).finally(function() {
                if (self.isLastUpdateCourseCall(courseId, now) && $mmSite.isLoggedIn() && $mmSite.getId() === siteId) {
                    $mmUtil.emptyArray(coursesHandlers[courseId].handlers);
                    angular.forEach(enabledForCourse, function(handler) {
                        coursesHandlers[courseId].handlers.push({
                            controller: handler.instance.getController(courseId),
                            priority: handler.priority
                        });
                    });
                    loaded[courseId] = true;
                }
            });
        };
        return self;
    }];
    return self;
});

angular.module('mm.core.courses')
.factory('$mmCoursesHandlers', ["$mmSite", "$state", "$mmCourses", "$q", "$mmUtil", "$translate", "$timeout", "$mmCourse", "mmCoursesEnrolInvalidKey", function($mmSite, $state, $mmCourses, $q, $mmUtil, $translate, $timeout, $mmCourse,
            mmCoursesEnrolInvalidKey) {
    var self = {};
        self.linksHandler = function() {
        var self = {},
            patterns = [
                /(\/enrol\/index\.php)|(\/course\/enrol\.php)/,
                /\/course\/view\.php/,
                /\/course\/?(index\.php.*)?$/
            ];
                function actionEnrol(courseId, url) {
            var modal = $mmUtil.showModalLoading(),
                isEnrolUrl = url.indexOf(patterns[0]) > -1 || url.indexOf(patterns[1]) > -1;
            $mmCourses.getUserCourse(courseId).catch(function() {
                return canSelfEnrol(courseId).then(function() {
                    var promise;
                    modal.dismiss();
                    promise = isEnrolUrl ? $q.when() : $mmUtil.showConfirm($translate('mm.courses.confirmselfenrol'));
                    return promise.then(function() {
                        return selfEnrol(courseId).catch(function(error) {
                            if (typeof error == 'string') {
                                $mmUtil.showErrorModal(error);
                            }
                            return $q.reject();
                        });
                    }, function() {
                        return $mmCourse.getSections(courseId);
                    });
                }, function(error) {
                    return $mmCourse.getSections(courseId).catch(function() {
                        modal.dismiss();
                        if (typeof error != 'string') {
                            error = $translate.instant('mm.courses.notenroled');
                        }
                        var body = $translate('mm.core.twoparagraphs',
                                        {p1: error, p2: $translate.instant('mm.core.confirmopeninbrowser')});
                        $mmUtil.showConfirm(body).then(function() {
                            $mmUtil.openInBrowser(url);
                        });
                        return $q.reject();
                    });
                });
            }).then(function() {
                modal.dismiss();
                $state.go('redirect', {
                    siteid: $mmSite.getId(),
                    state: 'site.mm_course',
                    params: {courseid: courseId}
                });
            });
        }
                function canSelfEnrol(courseId) {
            if (!$mmCourses.isSelfEnrolmentEnabled()) {
                return $q.reject();
            }
            return $mmCourses.getCourseEnrolmentMethods(courseId).then(function(methods) {
                var isSelfEnrolEnabled = false,
                    instances = 0;
                angular.forEach(methods, function(method) {
                    if (method.type == 'self' && method.status) {
                        isSelfEnrolEnabled = true;
                        instances++;
                    }
                });
                if (!isSelfEnrolEnabled || instances != 1) {
                    return $q.reject();
                }
            });
        }
                function selfEnrol(courseId, password) {
            var modal = $mmUtil.showModalLoading();
            return $mmCourses.selfEnrol(courseId, password).then(function() {
                return $mmCourses.invalidateUserCourses().catch(function() {
                }).then(function() {
                    return $timeout(function() {}, 4000).finally(function() {
                        modal.dismiss();
                    });
                });
            }).catch(function(error) {
                modal.dismiss();
                if (error && error.code === mmCoursesEnrolInvalidKey) {
                    var title = $translate.instant('mm.courses.selfenrolment'),
                        body = ' ',
                        placeholder = $translate.instant('mm.courses.password');
                    if (typeof password != 'undefined') {
                        $mmUtil.showErrorModal(error.message);
                    }
                    return $mmUtil.showPrompt(body, title, placeholder).then(function(password) {
                        return selfEnrol(courseId, password);
                    });
                } else {
                    return $q.reject(error);
                }
            });
        }
                self.getActions = function(siteIds, url) {
            if (typeof self.handles(url) != 'undefined') {
                if (url.search(patterns[2]) > -1) {
                    return [{
                        message: 'mm.core.view',
                        icon: 'ion-eye',
                        sites: siteIds,
                        action: function(siteId) {
                            $state.go('redirect', {
                                siteid: siteId || $mmSite.getId(),
                                state: 'site.mm_courses'
                            });
                        }
                    }];
                } else {
                    var params = $mmUtil.extractUrlParams(url),
                        courseId = parseInt(params.id, 10);
                    if (courseId && courseId != 1) {
                        return [{
                            message: 'mm.core.view',
                            icon: 'ion-eye',
                            sites: siteIds,
                            action: function(siteId) {
                                siteId = siteId || $mmSite.getId();
                                if (siteId == $mmSite.getId()) {
                                    actionEnrol(courseId, url);
                                } else {
                                    $state.go('redirect', {
                                        siteid: siteId,
                                        state: 'site.mm_course',
                                        params: {courseid: courseId}
                                    });
                                }
                            }
                        }];
                    }
                }
            }
            return [];
        };
                self.handles = function(url) {
            for (var i = 0; i < patterns.length; i++) {
                var position = url.search(patterns[i]);
                if (position > -1) {
                    return url.substr(0, position);
                }
            }
        };
        return self;
    };
    return self;
}]);

angular.module('mm.core.fileuploader')
.controller('mmFileUploaderPickerCtrl', ["$scope","$window","$ionicPopup", "$mmUtil", "$mmFileUploaderHelper", "$ionicHistory", "$mmApp", "$mmFS", "$q", "$mmFileUploaderDelegate", "$stateParams", "$translate", function($scope,$window ,$ionicPopup, $mmUtil, $mmFileUploaderHelper, $ionicHistory, $mmApp, $mmFS, $q,
            $mmFileUploaderDelegate, $stateParams, $translate) {
    var maxSize = $stateParams.maxsize,
        upload = $stateParams.upload,
        uploadMethods = {
            audio: $mmFileUploaderHelper.uploadAudioOrVideo,
            video: $mmFileUploaderHelper.uploadAudioOrVideo
        };
    $scope.isAndroid = ionic.Platform.isAndroid();
    $scope.handlers = $mmFileUploaderDelegate.getHandlers();
    $scope.title = $translate.instant(upload ? 'mm.fileuploader.uploadafile' : 'mm.fileuploader.selectafile');
    $scope.selectVideo = function(){
       if($scope.isAndroid){
           navigator.camera.getPicture(
            function (fileURI) {
                window.resolveLocalFileSystemURL("file:///" + fileURI,
                    function(fileEntry){
                        // alert(JSON.stringify(fileEntry));

                        var win = function (r) {
                            progressPopUp.close();
                            document.getElementById('addtarefa').disabled = false;
                            var myPopup = $ionicPopup.show({
                                    template: 'Aguarde a avaliação do seu tutor.',
                                    title: 'Upload Concluido',
                                    subTitle: '',
                                    scope: $scope,
                                    buttons: [
                                    {
                                        text: '<b>OK</b>',
                                        type: 'button-positive',
                                        onTap: function(e) {
                                            $window.location.reload();
                                        }
                                    }
                                    ]
                                });
                           
                            
                        };

                        var fail = function (error) {
                            alert(JSON.stringify(error, null, 2));
                            document.getElementById('addtarefa').disabled = false;
                        };

                        fileuri = "file:///" + fileURI;

                        var options = new FileUploadOptions();
                        options.fileKey = "file";
                        options.fileName = fileuri.substr(fileuri.lastIndexOf('/') + 1);
                        options.mimeType = "video/mp4";

                        var params = {};
                        params.usuario_id = userFinalId;
                        params.id_atividade = assignFinalId;

                        options.params = params;

                        var ft = new FileTransfer();
                        var uri = encodeURI("http://profs.somoseducacao.com.br/mod/assign/submission/file/upvimeo.php");
                        //var uri = encodeURI("http://127.0.0.1/up/upload.php");

                        var progressPopUp = $ionicPopup.show({
                            template: '<progress id="upload_progress" value="0" max="100"></progress>',
                            title: 'Convertendo',
                            subTitle: '',
                            scope: $scope
                        });

                        ft.onprogress = function(progressEvent) {
                            if (progressEvent.lengthComputable) {
                                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                                document.getElementById('upload_progress').value = perc;
                            } else {
                                //var lsi = loadingStatus.increment();
                                //alert(loadingStatus);
                            }
                        };

                        ft.upload(fileuri, uri, win, fail, options);
                        document.getElementById('addtarefa').disabled = true;

                    },
                function(error){//error
                        alert("Error: " + JSON.stringify(error, null, 2));
                });
            }, function (error){
            }, {
                destinationType: Camera.DestinationType.NATIVE_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                mediaType: Camera.MediaType.VIDEO
            }
        );
       }else{
             navigator.device.capture.captureVideo(
                                videoCaptureSuccess,
                                videoCaptureError,
                                {
                                    limit: 1,
                                    duration:   1200
                                }
                            );
       } 
     
    };
    function videoCaptureSuccess(mediaFiles) {
    // Wrap this below in a ~100 ms timeout on Android if
    // you just recorded the video using the capture plugin.
    // For some reason it is not available immediately in the file system.
        var file = mediaFiles[0];
        transcodeI(file.fullPath);

    }
    function videoCaptureError(error){
        alert(JSON.stringify(erro,null,2));
    }

    function transcodeI(mediaFiles) {
        // options used with transcodeVideo function
        // VideoEditorOptions is global, no need to declare it
        var VideoEditorOptions = {
            OptimizeForNetworkUse: {
                NO: 0,
                YES: 1
            },
            OutputFileType: {
                M4V: 0,
                MPEG4: 1,
                M4A: 2,
                QUICK_TIME: 3
            }
        };

        var file = mediaFiles;
        var videoFileName = 'Da Video'; // I suggest a uuid
        document.getElementById('addtarefa').innerHTML = 'Convertendo...';
        document.getElementById('addtarefa').disabled = true;

        var duration = 0;
        VideoEditor.transcodeVideo(
            function (result) {
                console.log('videoTranscodeSuccess, result: ' + result);
          //      alert('3');
          //      alert('4');
                filetransf(result);
          
            },
            function (err) {
                alert(JSON.stringify(err, null, 2));
                console.log('videoTranscodeError, err: ' + err);
            },
            {
                fileUri: file,
                outputFileName: videoFileName,
                outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
                optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.YES,
                saveToLibrary: true, // optional, defaults to true
                deleteInputFile: false, // optional (android only), defaults to false
                maintainAspectRatio: true, // optional (ios only), defaults to true
                width: 480, // optional, see note below on width and height
                height: 360, // optional, see notes below on width and height
                videoBitrate: 500000, // optional, bitrate in bits, defaults to 1 megabit (1000000)
                fps: 30, // optional (android only), defaults to 24
                audioChannels: 2, // optional (ios only), number of audio channels, defaults to 2
                audioSampleRate: 44100, // optional (ios only), sample rate for the audio, defaults to 44100
                audioBitrate: 128000, // optional (ios only), audio bitrate for the video in bits, defaults to 128 kilobits (128000)
                progress: function(info) {
                    console.log('transcodeVideo progress callback, info: ' + info);
                    //document.getElementById("addtarefa").innerHTML = info;
                    // info on android will be shell output from android-ffmpeg-java
                    // info on ios will be a number from 0 to 100

                    if (device.platform.toLowerCase() === 'ios') {
                        // use info to update your progress indicator
                        document.getElementById('addtarefa').innerHTML = 'Transcoding ' + info + '%';
                        return; // the code below is for android
                    }

                    // for android this arithmetic below can be used to track the progress
                    // of ffmpeg by using info provided by the android-ffmpeg-java shell output
                    // this is a modified version of http://stackoverflow.com/a/17314632/1673842

                    // get duration of source
                    if (!duration) {
                        var matches = (info) ? info.match(/Duration: (.*?), start:/) : [];
                        if (matches && matches.length > 0) {
                            var rawDuration = matches[1];
                            // convert rawDuration from 00:00:00.00 to seconds.
                            var ar = rawDuration.split(":").reverse();
                            duration = parseFloat(ar[0]);
                            if (ar[1]) duration += parseInt(ar[1]) * 60;
                            if (ar[2]) duration += parseInt(ar[2]) * 60 * 60;
                        }
                        return;
                    }

                    // get the time
                    var matches = info.match(/time=(.*?) bitrate/g);
                    if (matches && matches.length > 0) {
                        var time = 0;
                        var progress = 0;
                        var rawTime = matches.pop();
                        rawTime = rawTime.replace('time=', '').replace(' bitrate', '');

                        // convert rawTime from 00:00:00.00 to seconds.
                        var ar = rawTime.split(":").reverse();
                        time = parseFloat(ar[0]);
                        if (ar[1]) time += parseInt(ar[1]) * 60;
                        if (ar[2]) time += parseInt(ar[2]) * 60 * 60;

                        //calculate the progress
                        progress = Math.round((time / duration) * 100);
                        var progressObj = {
                            duration: duration,
                            current: time,
                            progress: progress
                        };

                        console.log('progressObj: ' + JSON.stringify(progressObj, null, 2));
                        //alert(JSON.stringify(progressObj, null, 2));
                        document.getElementById('addtarefa').innerHTML = 'Convertendo ' + progress + '%';

                        /* update your progress indicator here with above values ... */
                    }
                }
            }
        );
    };

    function filetransf(fileuri) {
        var win = function (r) {
            document.getElementById('addtarefa').innerHTML = 'Enviar Video <span style="font-size:11px"><em>(Conversão e Upload Rápido)</em></span>';
            document.getElementById('addtarefa').disabled = false;
            var myPopup = $ionicPopup.show({
                    template: 'Aguarde a avaliação do seu tutor.',
                    title: 'Upload Concluido',
                    subTitle: '',
                    scope: $scope,
                    buttons: [
                    {
                        text: '<b>OK</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            $window.location.reload();
                        }
                    }
                    ]
                });
           
            
        };

        var fail = function (error) {
            alert(JSON.stringify(error, null, 2));
            document.getElementById('addtarefa').disabled = false;
        };

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileuri.substr(fileuri.lastIndexOf('/') + 1);
        options.mimeType = "video/mp4";

        var params = {};
        params.usuario_id = userFinalId;
        params.id_atividade = assignFinalId;

        options.params = params;

        var ft = new FileTransfer();
        var uri = encodeURI("http://profs.somoseducacao.com.br/mod/assign/submission/file/upvimeo.php");
        //var uri = encodeURI("http://127.0.0.1/up/upload.php");

        ft.onprogress = function(progressEvent) {
            if (progressEvent.lengthComputable) {
                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                document.getElementById('addtarefa').innerHTML = "Upload " + perc + "%";
            } else {
                //var lsi = loadingStatus.increment();
                //alert(loadingStatus);
            }
        };

        ft.upload(fileuri, uri, win, fail, options);
        document.getElementById('addtarefa').disabled = true;
    };

    function successUploading(result) {
        $mmFileUploaderHelper.fileUploaded(result);
        $ionicHistory.goBack();
    }
    function errorUploading(err) {
        if (err) {
            $mmUtil.showErrorModal(err);
        }
        return $q.reject();
    }
    function uploadFileEntry(fileEntry, deleteAfterUpload) {
        return $mmFS.getFileObjectFromFileEntry(fileEntry).then(function(file) {
            return uploadFileObject(file).then(function() {
                if (deleteAfterUpload) {
                    $mmFS.removeFileByFileEntry(fileEntry);
                }
            });
        }, function() {
            $mmUtil.showErrorModal('mm.fileuploader.errorreadingfile', true);
            return $q.reject();
        });
    }
    function uploadFileObject(file) {
        if (maxSize != -1 && file.size > maxSize) {
            return $mmFileUploaderHelper.errorMaxBytes(maxSize, file.name);
        }
        return $mmFileUploaderHelper.confirmUploadFile(file.size).then(function() {
            return $mmFileUploaderHelper.copyAndUploadFile(file, upload).then(successUploading, errorUploading);
        }, errorUploading);
    }
    $scope.upload = function(type, param) {
        if (!$mmApp.isOnline()) {
            $mmUtil.showErrorModal('mm.fileuploader.errormustbeonlinetoupload', true);
        } else {
            if (typeof(uploadMethods[type]) !== 'undefined') {
                uploadMethods[type](param, maxSize, upload).then(successUploading, errorUploading);
            }
        }
    };
    $scope.uploadFile = function(evt) {
        var input = evt.srcElement;
        var file = input.files[0];
        input.value = '';
        if (file) {
            uploadFileObject(file);
        }
    };
    $scope.handlerClicked = function(e, action) {
        e.preventDefault();
        e.stopPropagation();
        action(maxSize, upload).then(function(data) {
            if (data.uploaded) {
                successUploading(data.result);
            } else {
                if (data.fileEntry) {
                    return uploadFileEntry(data.fileEntry, data.delete);
                } else if (data.path) {
                    return $mmFS.getFile(data.path).then(function(fileEntry) {
                        return uploadFileEntry(fileEntry, data.delete);
                    }, function() {
                        return $mmFS.getExternalFile(data.path).then(function(fileEntry) {
                            return uploadFileEntry(fileEntry, data.delete);
                        }, errorUploading);
                    });
                }
                $mmUtil.showErrorModal('No file received');
            }
        });
    };
    $scope.$on('$destroy', function(){
        $mmFileUploaderHelper.filePickerClosed();
    });
}]);

angular.module('mm.core.fileuploader')
.directive('mmFileUploaderOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.mmFileUploaderOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});

angular.module('mm.core.fileuploader')
.provider('$mmFileUploaderDelegate', function() {
    var handlers = {},
        self = {};
        self.registerHandler = function(addon, handler, priority) {
        if (typeof handlers[addon] !== 'undefined') {
            console.log("$mmFileUploaderDelegate: Addon '" + handlers[addon].addon + "' already registered as handler");
            return false;
        }
        console.log("$mmFileUploaderDelegate: Registered addon '" + addon + "' as handler.");
        handlers[addon] = {
            addon: addon,
            handler: handler,
            instance: undefined,
            priority: priority
        };
        return true;
    };
    self.$get = ["$mmUtil", "$q", "$log", "$mmSite", function($mmUtil, $q, $log, $mmSite) {
        var enabledHandlers = {},
            self = {},
            lastUpdateHandlersStart;
        $log = $log.getInstance('$mmFileUploaderDelegate');
                self.clearSiteHandlers = function() {
            enabledHandlers = {};
        };
                self.getHandlers = function() {
            var handlers = [];
            angular.forEach(enabledHandlers, function(handler) {
                handlers.push({
                    controller: handler.instance.getController(),
                    priority: handler.priority
                });
            });
            return handlers;
        };
                self.isLastUpdateCall = function(time) {
            if (!lastUpdateHandlersStart) {
                return true;
            }
            return time == lastUpdateHandlersStart;
        };
                self.updateHandler = function(addon, handlerInfo, time) {
            var promise,
                siteId = $mmSite.getId();
            if (typeof handlerInfo.instance === 'undefined') {
                handlerInfo.instance = $mmUtil.resolveObject(handlerInfo.handler, true);
            }
            if (!$mmSite.isLoggedIn()) {
                promise = $q.reject();
            } else {
                promise = $q.when(handlerInfo.instance.isEnabled());
            }
            return promise.catch(function() {
                return false;
            }).then(function(enabled) {
                if (self.isLastUpdateCall(time) && $mmSite.isLoggedIn() && $mmSite.getId() === siteId) {
                    if (enabled) {
                        enabledHandlers[addon] = {
                            instance: handlerInfo.instance,
                            priority: handlerInfo.priority
                        };
                    } else {
                        delete enabledHandlers[addon];
                    }
                }
            });
        };
                self.updateHandlers = function() {
            var promises = [],
                now = new Date().getTime();
            $log.debug('Updating navigation handlers for current site.');
            lastUpdateHandlersStart = now;
            angular.forEach(handlers, function(handlerInfo, addon) {
                promises.push(self.updateHandler(addon, handlerInfo, now));
            });
            return $q.all(promises).then(function() {
                return true;
            }, function() {
                return true;
            });
        };
        return self;
    }];
    return self;
});

angular.module('mm.core.fileuploader')
.factory('$mmFileUploader', ["$mmSite", "$mmFS", "$q", "$timeout", "$log", "$mmSitesManager", function($mmSite, $mmFS, $q, $timeout, $log, $mmSitesManager) {
    $log = $log.getInstance('$mmFileUploader');
    var self = {};
        self.uploadFile = function(uri, options, siteId) {
        options = options || {};
        siteId = siteId || $mmSite.getId();
        var deleteAfterUpload = options.deleteAfterUpload,
            ftOptions = angular.copy(options);
        delete ftOptions.deleteAfterUpload;
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.uploadFile(uri, ftOptions);
        }).then(function(result) {
            if (deleteAfterUpload) {
                $timeout(function() {
                    $mmFS.removeExternalFile(uri);
                }, 500);
            }
            return result;
        });
    };
        self.uploadImage = function(uri, isFromAlbum) {
        $log.debug('Uploading an image');
        var options = {};
        if (typeof uri == 'undefined' || uri === ''){
            $log.debug('Received invalid URI in $mmFileUploader.uploadImage()');
            return $q.reject();
        }
        options.deleteAfterUpload = !isFromAlbum;
        options.fileKey = 'file';
        options.fileName = 'image_' + new Date().getTime() + '.jpg';
        options.mimeType = 'image/jpeg';
        return self.uploadFile(uri, options);
    };
        self.uploadMedia = function(mediaFile) {
        $log.debug('Uploading media');
        var options = {},
            filename = mediaFile.name,
            split;
        if (ionic.Platform.isIOS()) {
            split = filename.split('.');
            split[0] += '_' + new Date().getTime();
            filename = split.join('.');
        }
        options.fileKey = null;
        options.fileName = filename;
        options.mimeType = null;
        options.deleteAfterUpload = true;
        return self.uploadFile(mediaFile.fullPath, options);
    };
        self.uploadGenericFile = function(uri, name, type, deleteAfterUpload, fileArea, itemId, siteId) {
        var options = {};
        options.fileKey = null;
        options.fileName = name;
        options.mimeType = type;
        options.deleteAfterUpload = deleteAfterUpload;
        options.itemId = itemId;
        options.fileArea = fileArea;
        return self.uploadFile(uri, options, siteId);
    };
    return self;
}]);

angular.module('mm.core.fileuploader')
.constant('mmFileUploaderFileSizeWarning', 5242880)
.factory('$mmFileUploaderHelper', ["$q", "$mmUtil", "$mmApp", "$log", "$translate", "$window", "$state", "$rootScope", "$mmFileUploader", "$cordovaCamera", "$cordovaCapture", "$mmLang", "$mmFS", "$mmText", "mmFileUploaderFileSizeWarning", "$ionicPopup", "$ionicHistory", function($q, $mmUtil, $mmApp, $log, $translate, $window, $state, $rootScope,
        $mmFileUploader, $cordovaCamera, $cordovaCapture, $mmLang, $mmFS, $mmText, mmFileUploaderFileSizeWarning, $ionicPopup, $ionicHistory) {
    $log = $log.getInstance('$mmFileUploaderHelper');
    var self = {},
        filePickerDeferred;
        self.confirmUploadFile = function(size, alwaysConfirm) {
        if (!$mmApp.isOnline()) {
            return $mmLang.translateAndReject('mm.fileuploader.errormustbeonlinetoupload');
        }
        if (size < 0) {
            return $mmUtil.showConfirm($translate('mm.fileuploader.confirmuploadunknownsize'));
        } else if ($mmApp.isNetworkAccessLimited() || size >= mmFileUploaderFileSizeWarning) {
            size = $mmText.bytesToSize(size, 2);
            return $mmUtil.showConfirm($translate('mm.fileuploader.confirmuploadfile', {size: size}));
        } else {
            if (alwaysConfirm) {
                return $mmUtil.showConfirm($translate('mm.core.areyousure'));
            } else {
                return $q.when();
            }
        }
    };
        self.copyAndUploadFile = function(file, upload) {
        var modal = $mmUtil.showModalLoading('mm.fileuploader.readingfile', true),
            fileData;
        return $mmFS.readFileData(file, $mmFS.FORMATARRAYBUFFER).then(function(data) {
            fileData = data;
            return $mmFS.getUniqueNameInFolder($mmFS.getTmpFolder(), file.name);
        }).then(function(newName) {
            var filepath = $mmFS.concatenatePaths($mmFS.getTmpFolder(), newName);
            return $mmFS.writeFile(filepath, fileData);
        }).catch(function(error) {
            $log.error('Error reading file to upload: '+JSON.stringify(error));
            modal.dismiss();
            return $mmLang.translateAndReject('mm.fileuploader.errorreadingfile');
        }).then(function(fileEntry) {
            modal.dismiss();
            if (upload) {
                return self.uploadGenericFile(fileEntry.toURL(), file.name, file.type, true);
            } else {
                return fileEntry;
            }
        });
    };
        self.errorMaxBytes = function(maxSize, fileName) {
        var error = $translate.instant('mm.fileuploader.maxbytesfile', {$a: {
            file: fileName,
            size: $mmText.bytesToSize(maxSize, 2)
        }});
        $mmUtil.showErrorModal(error);
        return $q.reject();
    };
        self.filePickerClosed = function() {
        if (filePickerDeferred) {
            filePickerDeferred.reject();
            filePickerDeferred = undefined;
        }
    };
        self.fileUploaded = function(result) {
        if (filePickerDeferred) {
            filePickerDeferred.resolve(result);
            filePickerDeferred = undefined;
        }
    };
        self.selectAndUploadFile = function(maxSize) {
        filePickerDeferred = $q.defer();
        $state.go('site.fileuploader-picker', {maxsize: maxSize, upload: true});
        return filePickerDeferred.promise;
    };
        self.selectFile = function(maxSize) {
        filePickerDeferred = $q.defer();
        $state.go('site.fileuploader-picker', {maxsize: maxSize, upload: false});
        return filePickerDeferred.promise;
    };
        self.showConfirmAndUploadInSite = function(fileEntry, deleteAfterUpload, siteId) {
        return $mmFS.getFileObjectFromFileEntry(fileEntry).then(function(file) {
            return self.confirmUploadFile(file.size).then(function() {
                return self.uploadGenericFile(fileEntry.toURL(), file.name, file.type, deleteAfterUpload, siteId).then(function() {
                    $mmUtil.showModal('mm.core.success', 'mm.fileuploader.fileuploaded');
                });
            }).catch(function(err) {
                if (err) {
                    $mmUtil.showErrorModal(err);
                }
                return $q.reject();
            });
        }, function() {
            $mmUtil.showErrorModal('mm.fileuploader.errorreadingfile', true);
            return $q.reject();
        });
    };
    self.uploadAudioOrVideo = function(isAudio, maxSize, upload) {
        $log.debug('Trying to record a video file');
        var fn = isAudio ? $cordovaCapture.captureAudio : $cordovaCapture.captureVideo;
        fn({limit: 1}).then(function(medias) {
            var media = medias[0],
                path = media.localURL;   
                transcode(media.fullPath, maxSize, $mmFileUploader.uploadMedia, media);
            if (upload) {
                return uploadFile(true, path, maxSize, true, $mmFileUploader.uploadMedia, media);
            } else {
                return;
            }                      
        }, function(error) {
            var defaultError = isAudio ? 'mm.fileuploader.errorcapturingaudio' : 'mm.fileuploader.errorcapturingvideo';
            return treatCaptureError(error, defaultError);
        });
    };

    /* ALERTA GAMBIARRA */

    function transcode(mediaFiles, maxSize, mmUploadFile, media) {

        // options used with transcodeVideo function
        // VideoEditorOptions is global, no need to declare it
        var VideoEditorOptions = {
            OptimizeForNetworkUse: {
                NO: 0,
                YES: 1
            },
            OutputFileType: {
                M4V: 0,
                MPEG4: 1,
                M4A: 2,
                QUICK_TIME: 3
            }
        };

        var videoFileName = 'Da Video'; // I suggest a uuid
        var progressPopUp = $ionicPopup.show({
                            template: '<progress id="upload_progress" value="0" max="100"></progress>',
                            title: 'Convertendo',
                            subTitle: '',
                            scope: $rootScope
                        });

        var duration = 0;

        setTimeout(function() {

            VideoEditor.transcodeVideo(
                function (result) {
                    document.getElementById("upload_progress").value = 100;
                    progressPopUp.close();
                    var res = copyToTmpFolder("file:///" + result, true, maxSize);
                    res.then(function(response) {
                        self.fileUploaded(response);
                        $ionicHistory.goBack();
                    });
                },
                function (err) {
                    document.getElementById("upload_progress").value = 100;
                    progressPopUp.close();
                    var res = copyToTmpFolder(mediaFiles, true, maxSize);
                    res.then(function(response) {
                        self.fileUploaded(response);
                        $ionicHistory.goBack();
                    });
                },
                {
                    fileUri: mediaFiles,
                    outputFileName: videoFileName,
                    outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
                    optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.YES,
                    saveToLibrary: true, // optional, defaults to true
                    deleteInputFile: false, // optional (android only), defaults to false
                    maintainAspectRatio: true, // optional (ios only), defaults to true
                    width: 480, // optional, see note below on width and height
                    height: 360, // optional, see notes below on width and height
                    videoBitrate: 500000, // optional, bitrate in bits, defaults to 1 megabit (1000000)
                    fps: 30, // optional (android only), defaults to 24
                    audioChannels: 2, // optional (ios only), number of audio channels, defaults to 2
                    audioSampleRate: 44100, // optional (ios only), sample rate for the audio, defaults to 44100
                    audioBitrate: 128000, // optional (ios only), audio bitrate for the video in bits, defaults to 128 kilobits (128000)
                    progress: function(info) {
                        console.log('transcodeVideo progress callback, info: ' + info);
                        //document.getElementById("addtarefa").innerHTML = info;
                        // info on android will be shell output from android-ffmpeg-java
                        // info on ios will be a number from 0 to 100

                        if (device.platform.toLowerCase() === 'ios') {
                            // use info to update your progress indicator
                            // document.getElementById('addtarefa').innerHTML = 'Transcoding ' + info + '%';
                            return; // the code below is for android
                        }

                        // for android this arithmetic below can be used to track the progress
                        // of ffmpeg by using info provided by the android-ffmpeg-java shell output
                        // this is a modified version of http://stackoverflow.com/a/17314632/1673842

                        // get duration of source
                        if (!duration) {
                            var matches = (info) ? info.match(/Duration: (.*?), start:/) : [];
                            if (matches && matches.length > 0) {
                                var rawDuration = matches[1];
                                // convert rawDuration from 00:00:00.00 to seconds.
                                var ar = rawDuration.split(":").reverse();
                                duration = parseFloat(ar[0]);
                                if (ar[1]) duration += parseInt(ar[1]) * 60;
                                if (ar[2]) duration += parseInt(ar[2]) * 60 * 60;
                            }
                            return;
                        }

                        // get the time
                        var matches = info.match(/time=(.*?) bitrate/g);
                        if (matches && matches.length > 0) {
                            var time = 0;
                            var progress = 0;
                            var rawTime = matches.pop();
                            rawTime = rawTime.replace('time=', '').replace(' bitrate', '');

                            // convert rawTime from 00:00:00.00 to seconds.
                            var ar = rawTime.split(":").reverse();
                            time = parseFloat(ar[0]);
                            if (ar[1]) time += parseInt(ar[1]) * 60;
                            if (ar[2]) time += parseInt(ar[2]) * 60 * 60;

                            //calculate the progress
                            progress = Math.round((time / duration) * 100);
                            var progressObj = {
                                duration: duration,
                                current: time,
                                progress: progress
                            };

                            console.log('progressObj: ' + JSON.stringify(progressObj, null, 2));
                            //alert(JSON.stringify(progressObj, null, 2));
                            document.getElementById('upload_progress').value = progress;

                            /* update your progress indicator here with above values ... */
                        }
                    }
                }
            );
        }, 150);
    };

    /* CABÔ A GAMBIARRA */

    self.uploadGenericFile = function(uri, name, type, deleteAfterUpload, siteId) {
        return uploadFile(deleteAfterUpload, uri, -1, false,
                $mmFileUploader.uploadGenericFile, uri, name, type, deleteAfterUpload, undefined, undefined, siteId);
    };
        self.uploadImage = function(fromAlbum, maxSize, upload) {
        $log.debug('Trying to capture an image with camera');
        var options = {
            quality: 50,
            destinationType: navigator.camera.DestinationType.FILE_URI
        };
        if (fromAlbum) {
            options.sourceType = navigator.camera.PictureSourceType.PHOTOLIBRARY;
            options.popoverOptions = new CameraPopoverOptions(10, 10, $window.innerWidth  - 200, $window.innerHeight - 200,
                                            Camera.PopoverArrowDirection.ARROW_ANY);
        }
        return $cordovaCamera.getPicture(options).then(function(path) {
            if (upload) {
                return uploadFile(!fromAlbum, path, maxSize, true, $mmFileUploader.uploadImage, path, fromAlbum);
            } else {
                return copyToTmpFolder(path, !fromAlbum, maxSize, 'jpg');
            }
        }, function(error) {
            var defaultError = fromAlbum ? 'mm.fileuploader.errorgettingimagealbum' : 'mm.fileuploader.errorcapturingimage';
            return treatImageError(error, defaultError);
        });
    };
    function treatImageError(error, defaultMessage) {
        if (error) {
            if (typeof error == 'string') {
                if (error.toLowerCase().indexOf("error") > -1 || error.toLowerCase().indexOf("unable") > -1) {
                    $log.error('Error getting image: ' + error);
                    return $q.reject(error);
                } else {
                    $log.debug('Cancelled');
                }
            } else {
                return $mmLang.translateAndReject(defaultMessage);
            }
        }
        return $q.reject();
    }
     
     
        function treatCaptureError(error, defaultMessage) {
        if (error) {
            if (typeof error === 'string') {
                $log.error('Error while recording audio/video: ' + error);
                if (error.indexOf('No Activity found') > -1) {
                    return $mmLang.translateAndReject('mm.fileuploader.errornoapp');
                } else {
                    return $mmLang.translateAndReject(defaultMessage);
                }
            } else {
                if (error.code != 3) {
                    $log.error('Error while recording audio/video: ' + JSON.stringify(error));
                    return $mmLang.translateAndReject(defaultMessage);
                } else {
                    $log.debug('Cancelled');
                }
            }
        }
        return $q.reject();
    }
        function copyToTmpFolder(path, shouldDelete, maxSize, defaultExt) {
        var fileName = $mmFS.getFileAndDirectoryFromPath(path).name,
            promise,
            fileTooLarge;
        if (typeof maxSize != 'undefined' && maxSize != -1) {
            promise = $mmFS.getExternalFile(path).then(function(fileEntry) {
                return $mmFS.getFileObjectFromFileEntry(fileEntry).then(function(file) {
                    if (file.size > maxSize) {
                        fileTooLarge = file;
                    }
                });
            }).catch(function() {
            });
        } else {
            promise = $q.when();
        }
        return promise.then(function() {
            if (fileTooLarge) {
                return self.errorMaxBytes(maxSize, fileTooLarge.name);
            }
            return $mmFS.getUniqueNameInFolder($mmFS.getTmpFolder(), fileName, defaultExt);
        }).then(function(newName) {
            var destPath = $mmFS.concatenatePaths($mmFS.getTmpFolder(), newName);
            if (shouldDelete) {
                return $mmFS.moveExternalFile(path, destPath);
            } else {
                return $mmFS.copyExternalFile(path, destPath);
            }
        });
    }
        function uploadFile(deleteAfterUpload, path, maxSize, checkSize, uploadFn) {
        var errorStr = $translate.instant('mm.core.error'),
            retryStr = $translate.instant('mm.core.retry'),
            args = arguments,
            progressTemplate =  "<ion-spinner></ion-spinner>" +
                                "<p ng-if=\"!perc\">{{'mm.fileuploader.uploading' | translate}}</p>" +
                                "<p ng-if=\"perc\">{{'mm.fileuploader.uploadingperc' | translate:{$a: perc} }}</p>",
            scope,
            modal,
            promise,
            file;
        if (!$mmApp.isOnline()) {
            return errorUploading($translate.instant('mm.fileuploader.errormustbeonlinetoupload'));
        }
        if (checkSize) {
            promise = $mmFS.getExternalFile(path).then(function(fileEntry) {
                return $mmFS.getFileObjectFromFileEntry(fileEntry).then(function(f) {
                    file = f;
                    return file.size;
                });
            }).catch(function() {
            });
        } else {
            promise = $q.when(0);
        }
        return promise.then(function(size) {
            if (maxSize != -1 && size > maxSize) {
                return self.errorMaxBytes(maxSize, file.name);
            }
            if (size > 0) {
                return self.confirmUploadFile(size);
            }
        }).then(function() {
            scope = $rootScope.$new();
            modal = $mmUtil.showModalLoadingWithTemplate(progressTemplate, {scope: scope});
            return uploadFn.apply(undefined, Array.prototype.slice.call(args, 5)).then(undefined, undefined, function(progress) {
                if (progress && progress.lengthComputable) {
                    var perc = parseFloat(Math.min((progress.loaded / progress.total) * 100, 100)).toFixed(1);
                    if (perc >= 0) {
                        scope.perc = perc;
                    }
                }
            }).catch(function(error) {
                $log.error('Error uploading file: '+JSON.stringify(error));
                modal.dismiss();
                if (typeof error != 'string') {
                    error = $translate.instant('mm.fileuploader.errorwhileuploading');
                }
                return errorUploading(error);
            }).finally(function() {
                modal.dismiss();
            });
        });
        function errorUploading(error) {
            var options = {
                okText: retryStr
            };
            return $mmUtil.showConfirm(error, errorStr, options).then(function() {
                return uploadFile.apply(undefined, args);
            }, function() {
                if (deleteAfterUpload) {
                    angular.forEach(paths, function(path) {
                        $mmFS.removeExternalFile(path);
                    });
                }
                return $q.reject();
            });
        }
    }
    return self;
}]);

angular.module('mm.core.login')
.controller('mmLoginCredentialsCtrl', ["$scope", "$state", "$stateParams", "$mmSitesManager", "$mmUtil", "$ionicHistory", "$mmApp", "$q", "$mmLoginHelper", "$translate", "$mmContentLinksDelegate", "$mmContentLinksHelper", function($scope, $state, $stateParams, $mmSitesManager, $mmUtil, $ionicHistory, $mmApp,
            $q, $mmLoginHelper, $translate, $mmContentLinksDelegate, $mmContentLinksHelper) {
    $scope.siteurl = $stateParams.siteurl;
    $scope.credentials = {
        username: $stateParams.username
    };
    var siteChecked = false,
        urlToOpen = $stateParams.urltoopen;
    function checkSite(siteurl) {
        var checkmodal = $mmUtil.showModalLoading(),
            protocol = siteurl.indexOf('http://') === 0 ? 'http://' : undefined;
        return $mmSitesManager.checkSite(siteurl, protocol).then(function(result) {
            siteChecked = true;
            $scope.siteurl = result.siteurl;
            if (result && result.warning) {
                $mmUtil.showErrorModal(result.warning, true, 4000);
            }
            if ($mmLoginHelper.isSSOLoginNeeded(result.code)) {
                $scope.isBrowserSSO = true;
                if (!$mmApp.isSSOAuthenticationOngoing() && !$scope.$$destroyed) {
                    $mmUtil.showConfirm($translate('mm.login.logininsiterequired')).then(function() {
                        $mmLoginHelper.openBrowserForSSOLogin(result.siteurl, result.code);
                    });
                }
            } else {
                $scope.isBrowserSSO = false;
            }
        }).catch(function(error) {
            $mmUtil.showErrorModal(error);
            return $q.reject();
        }).finally(function() {
            checkmodal.dismiss();
        });
    }
    if ($mmLoginHelper.isFixedUrlSet()) {
        checkSite($scope.siteurl);
    } else {
        siteChecked = true;
    }
    $scope.login = function() {
        $mmApp.closeKeyboard();
        var siteurl = $scope.siteurl,
            username = $scope.credentials.username,
            password = $scope.credentials.password;
        if (!siteChecked) {
            return checkSite(siteurl).then(function() {
                if (!$scope.isBrowserSSO) {
                    return $scope.login();
                }
            });
        } else if ($scope.isBrowserSSO) {
            return checkSite(siteurl);
        }
        if (!username) {
            $mmUtil.showErrorModal('mm.login.usernamerequired', true);
            return;
        }
        if (!password) {
            $mmUtil.showErrorModal('mm.login.passwordrequired', true);
            return;
        }
        var modal = $mmUtil.showModalLoading();
        return $mmSitesManager.getUserToken(siteurl, username, password).then(function(data) {
            return $mmSitesManager.newSite(data.siteurl, data.token).then(function() {
                delete $scope.credentials;
                $ionicHistory.nextViewOptions({disableBack: true});
                if (urlToOpen) {
                    return $mmContentLinksDelegate.getActionsFor(urlToOpen, undefined, username).then(function(actions) {
                        action = $mmContentLinksHelper.getFirstValidAction(actions);
                        if (action && action.sites.length) {
                            action.action(action.sites[0]);
                        } else {
                            return $mmLoginHelper.goToSiteInitialPage();
                        }
                    });
                } else {
                    return $mmLoginHelper.goToSiteInitialPage();
                }
            });
        }).catch(function(error) {
            $mmUtil.showErrorModal(error);
        }).finally(function() {
            modal.dismiss();
        });
    };
}]);

angular.module('mm.core.login')
.controller('mmLoginInitCtrl', ["$log", "$ionicHistory", "$state", "$mmSitesManager", "$mmSite", "$mmApp", "$mmLoginHelper", function($log, $ionicHistory, $state, $mmSitesManager, $mmSite, $mmApp, $mmLoginHelper) {
    $log = $log.getInstance('mmLoginInitCtrl');
    $mmApp.ready().then(function() {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        if ($mmSite.isLoggedIn()) {
            $mmLoginHelper.goToSiteInitialPage();
        } else {
            $mmSitesManager.hasSites().then(function() {
                return $state.go('mm_login.sites');
            }, function() {
                return $mmLoginHelper.goToAddSite();
            });
        }
    });
}]);

angular.module('mm.core.login')
.controller('mmLoginReconnectCtrl', ["$scope", "$state", "$stateParams", "$mmSitesManager", "$mmApp", "$mmUtil", "$ionicHistory", "$mmLoginHelper", function($scope, $state, $stateParams, $mmSitesManager, $mmApp, $mmUtil, $ionicHistory,
            $mmLoginHelper) {
    var infositeurl = $stateParams.infositeurl;
    $scope.siteurl = $stateParams.siteurl;
    $scope.credentials = {
        username: $stateParams.username,
        password: ''
    };
    $scope.cancel = function() {
        $mmSitesManager.logout().finally(function() {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('mm_login.sites');
        });
    };
    $scope.login = function() {
        $mmApp.closeKeyboard();
        var siteurl = $scope.siteurl,
            username = $scope.credentials.username,
            password = $scope.credentials.password;
        if (!password) {
            $mmUtil.showErrorModal('mm.login.passwordrequired', true);
            return;
        }
        var modal = $mmUtil.showModalLoading();
        $mmSitesManager.getUserToken(siteurl, username, password).then(function(data) {
            $mmSitesManager.updateSiteToken(infositeurl, username, data.token).then(function() {
                $mmSitesManager.updateSiteInfoByUrl(infositeurl, username).finally(function() {
                    delete $scope.credentials;
                    $ionicHistory.nextViewOptions({disableBack: true});
                    return $mmLoginHelper.goToSiteInitialPage();
                });
            }, function(error) {
                $mmUtil.showErrorModal('mm.login.errorupdatesite', true);
                $scope.cancel();
            }).finally(function() {
                modal.dismiss();
            });
        }, function(error) {
            modal.dismiss();
            $mmUtil.showErrorModal(error);
        });
    };
}]);

angular.module('mm.core.login')
.controller('mmLoginSiteCtrl', ["$scope", "$state", "$mmSitesManager", "$mmUtil", "$translate", "$ionicHistory", "$mmApp", "$ionicModal", "$mmLoginHelper", function($scope, $state, $mmSitesManager, $mmUtil, $translate, $ionicHistory, $mmApp,
        $ionicModal, $mmLoginHelper) {
    $scope.siteurl = '';
    $scope.connect = function(url) {
        $mmApp.closeKeyboard();
        if (!url) {
            $mmUtil.showErrorModal('mm.login.siteurlrequired', true);
            return;
        }
        var modal = $mmUtil.showModalLoading(),
            sitedata = $mmSitesManager.getDemoSiteData(url);
        if (sitedata) {
            $mmSitesManager.getUserToken(sitedata.url, sitedata.username, sitedata.password).then(function(data) {
                $mmSitesManager.newSite(data.siteurl, data.token).then(function() {
                    $ionicHistory.nextViewOptions({disableBack: true});
                    return $mmLoginHelper.goToSiteInitialPage();
                }, function(error) {
                    $mmUtil.showErrorModal(error);
                }).finally(function() {
                    modal.dismiss();
                });
            }, function(error) {
                modal.dismiss();
                $mmUtil.showErrorModal(error);
            });
        } else {
            $mmSitesManager.checkSite(url).then(function(result) {
                if (result.warning) {
                    $mmUtil.showErrorModal(result.warning, true, 4000);
                }
                if ($mmLoginHelper.isSSOLoginNeeded(result.code)) {
                    $mmUtil.showConfirm($translate('mm.login.logininsiterequired')).then(function() {
                        $mmLoginHelper.openBrowserForSSOLogin(result.siteurl, result.code);
                    });
                } else {
                    $state.go('mm_login.credentials', {siteurl: result.siteurl});
                }
            }, function(error) {
                $mmUtil.showErrorModal(error);
            }).finally(function() {
                modal.dismiss();
            });
        }
    };
    $mmUtil.getDocsUrl().then(function(docsurl) {
        $scope.docsurl = docsurl;
    });
    $ionicModal.fromTemplateUrl('core/components/login/templates/help-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(helpModal) {
        $scope.showHelp = function() {
            helpModal.show();
        };
        $scope.closeHelp = function() {
            helpModal.hide();
        };
        $scope.$on('$destroy', function() {
            helpModal.remove();
        });
    });
}]);

angular.module('mm.core.login')
.controller('mmLoginSitesCtrl', ["$scope", "$state", "$mmSitesManager", "$log", "$translate", "$mmUtil", "$ionicHistory", "$mmText", "$mmLoginHelper", function($scope, $state, $mmSitesManager, $log, $translate, $mmUtil, $ionicHistory, $mmText,
            $mmLoginHelper) {
    $log = $log.getInstance('mmLoginSitesCtrl');
    $mmSitesManager.getSites().then(function(sites) {
        $scope.sites = sites;
        $scope.data = {
            hasSites: sites.length > 0,
            showDelete: false
        };
    });
    $scope.toggleDelete = function() {
        $scope.data.showDelete = !$scope.data.showDelete;
    };
    $scope.onItemDelete = function(e, index) {
        e.stopPropagation();
        var site = $scope.sites[index],
            sitename = site.sitename;
        $mmText.formatText(sitename).then(function(sitename) {
            $mmUtil.showConfirm($translate('mm.login.confirmdeletesite', {sitename: sitename})).then(function() {
                $mmSitesManager.deleteSite(site.id).then(function() {
                    $scope.sites.splice(index, 1);
                    $mmSitesManager.hasNoSites().then(function() {
                        $ionicHistory.nextViewOptions({disableBack: true});
                        $mmLoginHelper.goToAddSite();
                    });
                }, function() {
                    $log.error('Delete site failed');
                    $mmUtil.showErrorModal('mm.login.errordeletesite', true);
                });
            });
        });
    };
    $scope.login = function(siteid) {
        var modal = $mmUtil.showModalLoading();
        $mmSitesManager.loadSite(siteid).then(function() {
            $ionicHistory.nextViewOptions({disableBack: true});
            return $mmLoginHelper.goToSiteInitialPage();
        }, function(error) {
            $log.error('Error loading site '+siteid);
            error = error || 'Error loading site.';
            $mmUtil.showErrorModal(error);
        }).finally(function() {
            modal.dismiss();
        });
    };
    $scope.add = function() {
        $mmLoginHelper.goToAddSite();
    };
}]);

angular.module('mm.core.login')
.constant('mmLoginSSOCode', 2)
.constant('mmLoginSSOInAppCode', 3)
.constant('mmLoginLaunchSiteURL', 'mmLoginLaunchSiteURL')
.constant('mmLoginLaunchPassport', 'mmLoginLaunchPassport')
.factory('$mmLoginHelper', ["$q", "$log", "$mmConfig", "mmLoginSSOCode", "mmLoginSSOInAppCode", "mmLoginLaunchSiteURL", "mmLoginLaunchPassport", "md5", "$mmSite", "$mmSitesManager", "$mmLang", "$mmUtil", "$state", "$mmAddonManager", "$translate", "mmCoreConfigConstants", function($q, $log, $mmConfig, mmLoginSSOCode, mmLoginSSOInAppCode, mmLoginLaunchSiteURL,
            mmLoginLaunchPassport, md5, $mmSite, $mmSitesManager, $mmLang, $mmUtil, $state, $mmAddonManager,
            $translate, mmCoreConfigConstants) {
    $log = $log.getInstance('$mmLoginHelper');
    var self = {};
        self.goToAddSite = function() {
        if (mmCoreConfigConstants.siteurl) {
            return $state.go('mm_login.credentials', {siteurl: mmCoreConfigConstants.siteurl});
        } else {
            return $state.go('mm_login.site');
        }
    };
        self.goToSiteInitialPage = function() {
        if ($mmSite.getInfo() && $mmSite.getInfo().userhomepage === 0) {
            var $mmaFrontpage = $mmAddonManager.get('$mmaFrontpage');
            if ($mmaFrontpage) {
                return $state.go('site.mm_course-section');
            }
        }
        return $state.go('site.mm_courses');
    };
        self.isFixedUrlSet = function() {
        return typeof mmCoreConfigConstants.siteurl != 'undefined';
    };
        self.isSSOLoginNeeded = function(code) {
        return code == mmLoginSSOCode || code == mmLoginSSOInAppCode;
    };
        self.openBrowserForSSOLogin = function(siteurl, typeOfLogin) {
        var passport = Math.random() * 1000;
        var loginurl = siteurl + "/local/mobile/launch.php?service=" + mmCoreConfigConstants.wsextservice;
        loginurl += "&passport=" + passport;
        loginurl += "&urlscheme=" + mmCoreConfigConstants.customurlscheme;
        $mmConfig.set(mmLoginLaunchSiteURL, siteurl);
        $mmConfig.set(mmLoginLaunchPassport, passport);
        if (typeOfLogin == mmLoginSSOInAppCode) {
            $translate('mm.login.cancel').then(function(cancelStr) {
                var options = {
                    clearsessioncache: 'yes',
                    closebuttoncaption: cancelStr,
                };
                $mmUtil.openInApp(loginurl, options);
            });
        } else {
            $mmUtil.openInBrowser(loginurl);
            if (navigator.app) {
                navigator.app.exitApp();
            }
        }
    };
        self.validateBrowserSSOLogin = function(url) {
        var params = url.split(":::");
        return $mmConfig.get(mmLoginLaunchSiteURL).then(function(launchSiteURL) {
            return $mmConfig.get(mmLoginLaunchPassport).then(function(passport) {
                $mmConfig.delete(mmLoginLaunchSiteURL);
                $mmConfig.delete(mmLoginLaunchPassport);
                var signature = md5.createHash(launchSiteURL + passport);
                if (signature != params[0]) {
                    if (launchSiteURL.indexOf("https://") != -1) {
                        launchSiteURL = launchSiteURL.replace("https://", "http://");
                    } else {
                        launchSiteURL = launchSiteURL.replace("http://", "https://");
                    }
                    signature = md5.createHash(launchSiteURL + passport);
                }
                if (signature == params[0]) {
                    $log.debug('Signature validated');
                    return { siteurl: launchSiteURL, token: params[1] };
                } else {
                    $log.debug('Inalid signature in the URL request yours: ' + params[0] + ' mine: '
                                    + signature + ' for passport ' + passport);
                    return $mmLang.translateAndReject('mm.core.unexpectederror');
                }
            });
        });
    };
        self.handleSSOLoginAuthentication = function(siteurl, token) {
        if ($mmSite.isLoggedIn()) {
            var deferred = $q.defer();
            var info = $mmSite.getInfo();
            if (typeof(info) !== 'undefined' && typeof(info.username) !== 'undefined') {
                $mmSitesManager.updateSiteToken(info.siteurl, info.username, token).then(function() {
                    $mmSitesManager.updateSiteInfoByUrl(info.siteurl, info.username).finally(deferred.resolve);
                }, function() {
                    $mmLang.translateAndRejectDeferred(deferred, 'mm.login.errorupdatesite');
                });
            } else {
                $mmLang.translateAndRejectDeferred(deferred, 'mm.login.errorupdatesite');
            }
            return deferred.promise;
        } else {
            return $mmSitesManager.newSite(siteurl, token);
        }
    };
    return self;
}]);

angular.module('mm.core.question')
.directive('mmQuestionBehaviour', ["$compile", function($compile) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            if (scope.directive) {
                element[0].removeAttribute('mm-question-behaviour');
                element[0].setAttribute(scope.directive, '');
                $compile(element)(scope);
            }
        }
    };
}]);

angular.module('mm.core.question')
.directive('mmQuestion', ["$log", "$compile", "$mmQuestionDelegate", "$mmQuestionHelper", "$mmQuestionBehaviourDelegate", "$mmUtil", "$translate", "$q", "$mmQuestion", function($log, $compile, $mmQuestionDelegate, $mmQuestionHelper, $mmQuestionBehaviourDelegate, $mmUtil,
            $translate, $q, $mmQuestion) {
    $log = $log.getInstance('mmQuestion');
    return {
        restrict: 'E',
        templateUrl: 'core/components/question/templates/question.html',
        scope: {
            question: '=',
            component: '=?',
            componentId: '=?',
            attemptId: '=?',
            abort: '&',
            buttonClicked: '&?',
            offlineEnabled: '@?',
            scrollHandle: '@?'
        },
        link: function(scope, element) {
            var question = scope.question,
                component = scope.component,
                attemptId = scope.attemptId,
                questionContainer = element[0].querySelector('.mm-question-container'),
                behaviour,
                promise,
                offline = scope.offlineEnabled && scope.offlineEnabled !== '0' && scope.offlineEnabled !== 'false';
            if (question && questionContainer) {
                var directive = $mmQuestionDelegate.getDirectiveForQuestion(question);
                if (directive) {
                    $mmQuestionHelper.extractQuestionScripts(question);
                    behaviour = $mmQuestionDelegate.getBehaviourForQuestion(question, question.preferredBehaviour);
                    if (!$mmQuestionBehaviourDelegate.isBehaviourSupported(behaviour)) {
                        $log.warn('Aborting question because the behaviour is not supported.', question.name);
                        $mmQuestionHelper.showDirectiveError(scope,
                                $translate.instant('mma.mod_quiz.errorbehaviournotsupported') + ' ' + behaviour);
                        return;
                    }
                    scope.seqCheck = $mmQuestionHelper.getQuestionSequenceCheckFromHtml(question.html);
                    if (!scope.seqCheck) {
                        $log.warn('Aborting question because couldn\'t retrieve sequence check.', question.name);
                        $mmQuestionHelper.showDirectiveError(scope);
                        return;
                    }
                    if (offline) {
                        promise = $mmQuestion.getQuestionAnswers(component, attemptId, question.slot).then(function(answers) {
                            question.localAnswers = $mmQuestion.convertAnswersArrayToObject(answers, true);
                        }).catch(function() {
                            question.localAnswers = {};
                        });
                    } else {
                        question.localAnswers = {};
                        promise = $q.when();
                    }
                    promise.then(function() {
                        scope.behaviourDirectives = $mmQuestionBehaviourDelegate.handleQuestion(
                                        question, question.preferredBehaviour);
                        $mmQuestionHelper.extractQbehaviourRedoButton(question);
                        question.html = $mmUtil.removeElementFromHtml(question.html, '.im-controls');
                        question.validationError = $mmQuestionHelper.getValidationErrorFromHtml(question.html);
                        $mmQuestionHelper.loadLocalAnswersInHtml(question);
                        $mmQuestionHelper.extractQuestionFeedback(question);
                        $mmQuestionHelper.extractQuestionComment(question);
                        questionContainer.setAttribute(directive, '');
                        $compile(questionContainer)(scope);
                    });
                }
            }
        }
    };
}]);

angular.module('mm.core.question')
.provider('$mmQuestionBehaviourDelegate', function() {
    var handlers = {},
        self = {};
        self.registerHandler = function(name, behaviour, handler) {
        if (typeof handlers[behaviour] !== 'undefined') {
            console.log("$mmQuestionBehaviourDelegateProvider: Addon '" + name +
                            "' already registered as handler for '" + behaviour + "'");
            return false;
        }
        console.log("$mmQuestionBehaviourDelegateProvider: Registered handler '" + name + "' for behaviour '" + behaviour + "'");
        handlers[behaviour] = {
            addon: name,
            instance: undefined,
            handler: handler
        };
    };
    self.$get = ["$log", "$q", "$mmUtil", "$mmSite", "$mmQuestionDelegate", function($log, $q, $mmUtil, $mmSite, $mmQuestionDelegate) {
        $log = $log.getInstance('$mmQuestionBehaviourDelegate');
        var enabledHandlers = {},
            self = {},
            lastUpdateHandlersStart;
                self.determineQuestionState = function(behaviour, component, attemptId, question, siteId) {
            behaviour = $mmQuestionDelegate.getBehaviourForQuestion(question, behaviour);
            var handler = enabledHandlers[behaviour];
            if (typeof handler != 'undefined' && handler.determineQuestionState) {
                return $q.when(handler.determineQuestionState(component, attemptId, question, siteId));
            }
            return $q.when(false);
        };
                self.handleQuestion = function(question, behaviour) {
            behaviour = $mmQuestionDelegate.getBehaviourForQuestion(question, behaviour);
            if (typeof enabledHandlers[behaviour] != 'undefined') {
                return enabledHandlers[behaviour].handleQuestion(question);
            }
        };
                self.isBehaviourSupported = function(behaviour) {
            return typeof enabledHandlers[behaviour] != 'undefined';
        };
                self.isLastUpdateCall = function(time) {
            if (!lastUpdateHandlersStart) {
                return true;
            }
            return time == lastUpdateHandlersStart;
        };
                self.updateQuestionBehaviourHandler = function(behaviour, handlerInfo, time) {
            var promise,
                siteId = $mmSite.getId();
            if (typeof handlerInfo.instance === 'undefined') {
                handlerInfo.instance = $mmUtil.resolveObject(handlerInfo.handler, true);
            }
            if (!$mmSite.isLoggedIn()) {
                promise = $q.reject();
            } else {
                promise = $q.when(handlerInfo.instance.isEnabled());
            }
            return promise.catch(function() {
                return false;
            }).then(function(enabled) {
                if (self.isLastUpdateCall(time) && $mmSite.isLoggedIn() && $mmSite.getId() === siteId) {
                    if (enabled) {
                        enabledHandlers[behaviour] = handlerInfo.instance;
                    } else {
                        delete enabledHandlers[behaviour];
                    }
                }
            });
        };
                self.updateQuestionBehaviourHandlers = function() {
            var promises = [],
                now = new Date().getTime();
            $log.debug('Updating question behaviour handlers for current site.');
            lastUpdateHandlersStart = now;
            angular.forEach(handlers, function(handlerInfo, behaviour) {
                promises.push(self.updateQuestionBehaviourHandler(behaviour, handlerInfo, now));
            });
            return $q.all(promises).then(function() {
                return true;
            }, function() {
                return true;
            });
        };
        return self;
    }];
    return self;
});

angular.module('mm.core.question')
.provider('$mmQuestionDelegate', function() {
    var handlers = {},
        self = {};
        self.registerHandler = function(name, questionType, handler) {
        if (typeof handlers[questionType] !== 'undefined') {
            console.log("$mmQuestionDelegateProvider: Addon '" + name + "' already registered as handler for '" + questionType + "'");
            return false;
        }
        console.log("$mmQuestionDelegateProvider: Registered handler '" + name + "' for question type '" + questionType + "'");
        handlers[questionType] = {
            addon: name,
            instance: undefined,
            handler: handler
        };
    };
    self.$get = ["$log", "$q", "$mmUtil", "$mmSite", function($log, $q, $mmUtil, $mmSite) {
        $log = $log.getInstance('$mmQuestionDelegate');
        var enabledHandlers = {},
            self = {},
            lastUpdateHandlersStart;
                self.getBehaviourForQuestion = function(question, behaviour) {
            var type = 'qtype_' + question.type;
            if (typeof enabledHandlers[type] != 'undefined' && enabledHandlers[type].getBehaviour) {
                var questionBehaviour = enabledHandlers[type].getBehaviour(question, behaviour);
                if (questionBehaviour) {
                    return questionBehaviour;
                }
            }
            return behaviour;
        };
                self.getDirectiveForQuestion = function(question) {
            var type = 'qtype_' + question.type;
            if (typeof enabledHandlers[type] != 'undefined') {
                return enabledHandlers[type].getDirectiveName(question);
            }
        };
                self.getPreventSubmitMessage = function(question) {
            var type = 'qtype_' + question.type,
                handler = enabledHandlers[type];
            if (typeof handler != 'undefined' && handler.getPreventSubmitMessage) {
                return handler.getPreventSubmitMessage(question);
            }
        };
                self.isCompleteResponse = function(question, answers) {
            var type = 'qtype_' + question.type;
            if (typeof enabledHandlers[type] != 'undefined') {
                if (enabledHandlers[type].isCompleteResponse) {
                    return enabledHandlers[type].isCompleteResponse(question, answers);
                }
            }
            return -1;
        };
                self.isGradableResponse = function(question, answers) {
            var type = 'qtype_' + question.type;
            if (typeof enabledHandlers[type] != 'undefined') {
                if (enabledHandlers[type].isGradableResponse) {
                    return enabledHandlers[type].isGradableResponse(question, answers);
                }
            }
            return -1;
        };
                self.isLastUpdateCall = function(time) {
            if (!lastUpdateHandlersStart) {
                return true;
            }
            return time == lastUpdateHandlersStart;
        };
                self.isSameResponse = function(question, prevAnswers, newAnswers) {
            var type = 'qtype_' + question.type;
            if (typeof enabledHandlers[type] != 'undefined') {
                if (enabledHandlers[type].isSameResponse) {
                    return enabledHandlers[type].isSameResponse(question, prevAnswers, newAnswers);
                }
            }
            return false;
        };
                self.isQuestionSupported = function(type) {
            return typeof enabledHandlers['qtype_' + type] != 'undefined';
        };
                self.updateQuestionHandler = function(questionType, handlerInfo, time) {
            var promise,
                siteId = $mmSite.getId();
            if (typeof handlerInfo.instance === 'undefined') {
                handlerInfo.instance = $mmUtil.resolveObject(handlerInfo.handler, true);
            }
            if (!$mmSite.isLoggedIn()) {
                promise = $q.reject();
            } else {
                promise = $q.when(handlerInfo.instance.isEnabled());
            }
            return promise.catch(function() {
                return false;
            }).then(function(enabled) {
                if (self.isLastUpdateCall(time) && $mmSite.isLoggedIn() && $mmSite.getId() === siteId) {
                    if (enabled) {
                        enabledHandlers[questionType] = handlerInfo.instance;
                    } else {
                        delete enabledHandlers[questionType];
                    }
                }
            });
        };
                self.updateQuestionHandlers = function() {
            var promises = [],
                now = new Date().getTime();
            $log.debug('Updating question handlers for current site.');
            lastUpdateHandlersStart = now;
            angular.forEach(handlers, function(handlerInfo, questionType) {
                promises.push(self.updateQuestionHandler(questionType, handlerInfo, now));
            });
            return $q.all(promises).then(function() {
                return true;
            }, function() {
                return true;
            });
        };
                self.validateSequenceCheck = function(question, offlineSequenceCheck) {
            var type = 'qtype_' + question.type;
            if (typeof enabledHandlers[type] != 'undefined') {
                if (enabledHandlers[type].validateSequenceCheck) {
                    return enabledHandlers[type].validateSequenceCheck(question, offlineSequenceCheck);
                } else {
                    return question.sequencecheck == offlineSequenceCheck;
                }
            }
            return false;
        };
        return self;
    }];
    return self;
});

angular.module('mm.core.question')
.factory('$mmQuestionHelper', ["$mmUtil", "$mmText", "$ionicModal", "mmQuestionComponent", "$mmSitesManager", "$mmFilepool", "$q", "$mmQuestion", "$mmSite", function($mmUtil, $mmText, $ionicModal, mmQuestionComponent, $mmSitesManager, $mmFilepool, $q,
            $mmQuestion, $mmSite) {
    var self = {},
        lastErrorShown = 0;
        function addBehaviourButton(question, button) {
        if (!button || !question) {
            return;
        }
        if (!question.behaviourButtons) {
            question.behaviourButtons = [];
        }
        question.behaviourButtons.push({
            id: button.id,
            name: button.name,
            value: button.value,
            disabled: button.disabled
        });
    }
        self.directiveInit = function(scope, log) {
        var question = scope.question,
            questionEl;
        if (!question) {
            log.warn('Aborting because of no question received.');
            return self.showDirectiveError(scope);
        }
        questionEl = angular.element(question.html);
        question.text = $mmUtil.getContentsOfElement(questionEl, '.qtext');
        if (typeof question.text == 'undefined') {
            log.warn('Aborting because of an error parsing question.', question.name);
            return self.showDirectiveError(scope);
        }
        return questionEl;
    };
        self.extractQbehaviourButtons = function(question, selector) {
        selector = selector || '.im-controls input[type="submit"]';
        var div = document.createElement('div'),
            buttons;
        div.innerHTML = question.html;
        buttons = div.querySelectorAll(selector);
        angular.forEach(buttons, function(button) {
            addBehaviourButton(question, button);
        });
        question.html = div.innerHTML;
    };
        self.extractQbehaviourCBM = function(question) {
        var div = document.createElement('div'),
            labels;
        div.innerHTML = question.html;
        labels = div.querySelectorAll('.im-controls .certaintychoices label[for*="certainty"]');
        question.behaviourCertaintyOptions = [];
        angular.forEach(labels, function(label) {
            var input = label.querySelector('input[type="radio"]');
            if (input) {
                question.behaviourCertaintyOptions.push({
                    id: input.id,
                    name: input.name,
                    value: input.value,
                    text: $mmText.cleanTags(label.innerHTML),
                    disabled: input.disabled
                });
                if (input.checked) {
                    question.behaviourCertaintySelected = input.value;
                }
            }
        });
        if (question.localAnswers && typeof question.localAnswers['-certainty'] != 'undefined') {
            question.behaviourCertaintySelected = question.localAnswers['-certainty'];
        }
        return labels && labels.length;
    };
        self.extractQbehaviourRedoButton = function(question) {
        var div = document.createElement('div'),
            redoSelector = 'input[type="submit"][name*=redoslot]';
        if (!searchButton('html', '.outcome ' + redoSelector)) {
            if (question.feedbackHtml) {
                if (searchButton('feedbackHtml', redoSelector)) {
                    return;
                }
            }
            if (!question.infoHtml) {
                searchButton('infoHtml', redoSelector);
            }
        }
        function searchButton(htmlProperty, selector) {
            var button;
            div.innerHTML = question[htmlProperty];
            button = div.querySelector(selector);
            if (button) {
                addBehaviourButton(question, button);
                angular.element(button).remove();
                question[htmlProperty] = div.innerHTML;
                return true;
            }
            return false;
        }
    };
        self.extractQbehaviourSeenInput = function(question) {
        var div = document.createElement('div'),
            seenInput;
        div.innerHTML = question.html;
        seenInput = div.querySelector('input[type="hidden"][name*=seen]');
        if (seenInput) {
            question.behaviourSeenInput = {
                name: seenInput.name,
                value: seenInput.value
            };
            angular.element(seenInput).remove();
            question.html = div.innerHTML;
            return true;
        }
        return false;
    };
        self.extractQuestionComment = function(question) {
        extractQuestionLastElementNotInContent(question, '.comment', 'commentHtml');
    };
        self.extractQuestionFeedback = function(question) {
        extractQuestionLastElementNotInContent(question, '.outcome', 'feedbackHtml');
    };
        self.extractQuestionInfoBox = function(question, selector) {
        extractQuestionLastElementNotInContent(question, selector, 'infoHtml');
    };
        function extractQuestionLastElementNotInContent(question, selector, attrName) {
        var div = document.createElement('div'),
            matches,
            last,
            position;
        div.innerHTML = question.html;
        matches = div.querySelectorAll(selector);
        position = matches.length -1;
        last = matches[position];
        while (last) {
            if (!$mmUtil.closest(last, '.formulation')) {
                question[attrName] = last.innerHTML;
                angular.element(last).remove();
                question.html = div.innerHTML;
                return;
            }
            position--;
            last = matches[position];
        }
    }
        self.extractQuestionScripts = function(question) {
        var matches;
        question.scriptsCode = '';
        question.initObjects = [];
        if (question.html) {
            matches = question.html.match(/<script[^>]*>[\s\S]*?<\/script>/mg);
            angular.forEach(matches, function(match) {
                question.scriptsCode += match;
                question.html = question.html.replace(match, '');
                var initMatches = match.match(new RegExp('M\.qtype_' + question.type + '\.init_question\\(.*?}\\);', 'mg'));
                if (initMatches) {
                    var initMatch = initMatches.pop();
                    initMatch = initMatch.replace('M.qtype_' + question.type + '.init_question(', '');
                    initMatch = initMatch.substr(0, initMatch.length - 2);
                    try {
                        question.initObjects = JSON.parse(initMatch);
                    } catch(ex) {}
                }
            });
        }
    };
        self.getAllInputNamesFromHtml = function(html) {
        var form = document.createElement('form'),
            answers = {};
        form.innerHTML = html;
        angular.forEach(form.elements, function(element) {
            var name = element.name || '';
            if (!name || name.match(/_:flagged$/) || element.type == 'submit' || element.tagName == 'BUTTON') {
                return;
            }
            answers[$mmQuestion.removeQuestionPrefix(name)] = true;
        });
        return answers;
    };
        self.getAnswersFromForm = function(form) {
        if (!form || !form.elements) {
            return {};
        }
        var answers = {};
        angular.forEach(form.elements, function(element) {
            var name = element.name || '';
            if (!name || name.match(/_:flagged$/) || element.type == 'submit' || element.tagName == 'BUTTON') {
                return;
            }
            if (element.type == 'checkbox') {
                answers[name] = !!element.checked;
            } else if (element.type == 'radio') {
                if (element.checked) {
                    answers[name] = element.value;
                }
            } else {
                answers[name] = element.value;
            }
        });
        return answers;
    };
        self.getQuestionAttachmentsFromHtml = function(html) {
        var el = angular.element('<div></div>'),
            anchors,
            attachments = [];
        el.html(html);
        el = el[0];
        $mmUtil.removeElement(el, 'div[id*=filemanager]');
        anchors = el.querySelectorAll('a');
        angular.forEach(anchors, function(anchor) {
            var content = anchor.innerHTML;
            if (anchor.href && content) {
                content = $mmText.cleanTags(content, true).trim();
                attachments.push({
                    filename: content,
                    fileurl: anchor.href
                });
            }
        });
        return attachments;
    };
        self.getQuestionSequenceCheckFromHtml = function(html) {
        var el,
            input;
        if (html) {
            el = angular.element(html)[0];
            input = el.querySelector('input[name*=sequencecheck]');
            if (input && typeof input.name != 'undefined' && typeof input.value != 'undefined') {
                return {
                    name: input.name,
                    value: input.value
                };
            }
        }
    };
        self.getQuestionStateClass = function(name) {
        var state = $mmQuestion.getState(name);
        return state ? state.class : '';
    };
        self.getValidationErrorFromHtml = function(html) {
        return $mmUtil.getContentsOfElement(angular.element(html), '.validationerror');
    };
        self.hasDraftFileUrls = function(html) {
        var url = $mmSite.getURL();
        if (url.slice(-1) != '/') {
            url = url += '/';
        }
        url += 'draftfile.php';
        return html.indexOf(url) != -1;
    };
        self.inputTextDirective = function(scope, log) {
        var questionEl = self.directiveInit(scope, log);
        if (questionEl) {
            questionEl = questionEl[0] || questionEl;
            input = questionEl.querySelector('input[type="text"][name*=answer]');
            if (!input) {
                log.warn('Aborting because couldn\'t find input.', question.name);
                return self.showDirectiveError(scope);
            }
            scope.input = {
                id: input.id,
                name: input.name,
                value: input.value,
                readOnly: input.readOnly
            };
            if (input.className.indexOf('incorrect') >= 0) {
                scope.input.isCorrect = 0;
            } else if (input.className.indexOf('correct') >= 0) {
                scope.input.isCorrect = 1;
            }
        }
    };
        self.loadLocalAnswersInHtml = function(question) {
        var form = document.createElement('form');
        form.innerHTML = question.html;
        angular.forEach(form.elements, function(element) {
            var name = element.name || '';
            if (!name || name.match(/_:flagged$/) || element.type == 'submit' || element.tagName == 'BUTTON') {
                return;
            }
            name = $mmQuestion.removeQuestionPrefix(name);
            if (question.localAnswers && typeof question.localAnswers[name] != 'undefined') {
                var selected;
                if (element.tagName == 'TEXTAREA') {
                    element.innerHTML = question.localAnswers[name];
                } else if (element.tagName == 'SELECT') {
                    selected = element.querySelector('option[value="' + question.localAnswers[name] + '"]');
                    if (selected) {
                        selected.setAttribute('selected', 'selected');
                    }
                } else if (element.type == 'radio' || element.type == 'checkbox') {
                    if (element.value == question.localAnswers[name]) {
                        element.setAttribute('checked', 'checked');
                    }
                } else {
                    element.setAttribute('value', question.localAnswers[name]);
                }
            }
        });
        question.html = form.innerHTML;
    };
        self.matchingDirective = function(scope, log) {
        var questionEl = self.directiveInit(scope, log),
            question = scope.question,
            rows;
        if (questionEl) {
            questionEl = questionEl[0] || questionEl;
            rows = questionEl.querySelectorAll('tr');
            if (!rows || !rows.length) {
                log.warn('Aborting because couldn\'t find any row.', question.name);
                return self.showDirectiveError(scope);
            }
            question.rows = [];
            angular.forEach(rows, function(row) {
                var rowModel = {},
                    select,
                    options,
                    accessibilityLabel,
                    columns = row.querySelectorAll('td');
                if (!columns || columns.length < 2) {
                    log.warn('Aborting because couldn\'t find the right columns.', question.name);
                    return self.showDirectiveError(scope);
                }
                rowModel.text = columns[0].innerHTML;
                select = columns[1].querySelector('select');
                options = columns[1].querySelectorAll('option');
                if (!select || !options || !options.length) {
                    log.warn('Aborting because couldn\'t find select or options.', question.name);
                    return self.showDirectiveError(scope);
                }
                rowModel.id = select.id;
                rowModel.name = select.name;
                rowModel.disabled = select.disabled;
                rowModel.options = [];
                if (columns[1].className.indexOf('incorrect') >= 0) {
                    rowModel.isCorrect = 0;
                } else if (columns[1].className.indexOf('correct') >= 0) {
                    rowModel.isCorrect = 1;
                }
                angular.forEach(options, function(option) {
                    if (typeof option.value == 'undefined') {
                        log.warn('Aborting because couldn\'t find option value.', question.name);
                        return self.showDirectiveError(scope);
                    }
                    rowModel.options.push({
                        value: option.value,
                        label: option.innerHTML,
                        selected: option.selected
                    });
                });
                accessibilityLabel = columns[1].querySelector('label.accesshide');
                rowModel.accessibilityLabel = accessibilityLabel.innerHTML;
                question.rows.push(rowModel);
            });
            question.loaded = true;
        }
    };
        self.multiChoiceDirective = function(scope, log) {
        var questionEl = self.directiveInit(scope, log),
            question = scope.question;
        scope.mcAnswers = {};
        if (questionEl) {
            questionEl = questionEl[0] || questionEl;
            question.prompt = $mmUtil.getContentsOfElement(questionEl, '.prompt');
            var options = questionEl.querySelectorAll('input[type="radio"]');
            if (!options || !options.length) {
                question.multi = true;
                options = questionEl.querySelectorAll('input[type="checkbox"]');
                if (!options || !options.length) {
                    log.warn('Aborting because of no radio and checkbox found.', question.name);
                    return self.showDirectiveError(scope);
                }
            }
            question.options = [];
            angular.forEach(options, function(element) {
                var option = {
                        id: element.id,
                        name: element.name,
                        value: element.value,
                        checked: element.checked,
                        disabled: element.disabled
                    },
                    label,
                    parent = element.parentNode,
                    feedback;
                label = questionEl.querySelector('label[for="' + option.id + '"]');
                if (label) {
                    option.text = label.innerHTML;
                    if (typeof option.name != 'undefined' && typeof option.value != 'undefined' &&
                                typeof option.text != 'undefined') {
                        if (element.checked) {
                            if (!question.multi) {
                                scope.mcAnswers[option.name] = option.value;
                            }
                            if (parent) {
                                if (parent && parent.className.indexOf('incorrect') >= 0) {
                                    option.isCorrect = 0;
                                } else if (parent && parent.className.indexOf('correct') >= 0) {
                                    option.isCorrect = 1;
                                }
                                feedback = parent.querySelector('.specificfeedback');
                                if (feedback) {
                                    option.feedback = feedback.innerHTML;
                                }
                            }
                        }
                        question.options.push(option);
                        return;
                    }
                }
                log.warn('Aborting because of an error parsing options.', question.name, option.name);
                return self.showDirectiveError(scope);
            });
        }
    };
        self.prefetchQuestionFiles = function(question, siteId) {
        var urls = $mmUtil.extractDownloadableFilesFromHtml(question.html);
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var promises = [];
            angular.forEach(urls, function(url) {
                if (!site.canDownloadFiles() && $mmUtil.isPluginFileUrl(url)) {
                    return;
                }
                if (url.indexOf('theme/image.php') > -1 && url.indexOf('flagged') > -1) {
                    return;
                }
                promises.push($mmFilepool.addToQueueByUrl(siteId, url, mmQuestionComponent, question.id));
            });
            return $q.all(promises);
        });
    };
        self.replaceCorrectnessClasses = function(element) {
        $mmUtil.replaceClassesInElement(element, {
            correct: 'mm-question-answer-correct',
            incorrect: 'mm-question-answer-incorrect'
        });
    };
        self.replaceFeedbackClasses = function(element) {
        $mmUtil.replaceClassesInElement(element, {
            outcome: 'mm-question-feedback-container mm-question-feedback-padding',
            specificfeedback: 'mm-question-feedback-container mm-question-feedback-inline'
        });
    };
        self.showDirectiveError = function(scope, error) {
        error = error || 'Error processing the question. This could be caused by custom modifications in your site.';
        var now = new Date().getTime();
        if (now - lastErrorShown > 500) {
            lastErrorShown = now;
            $mmUtil.showErrorModal(error);
        }
        scope.abort();
    };
        self.treatCorrectnessIcons = function(scope, element) {
        element = element[0] || element;
        var icons = element.querySelectorAll('.questioncorrectnessicon');
        angular.forEach(icons, function(icon) {
            var parent;
            if (icon.src && icon.src.indexOf('incorrect') > -1) {
                icon.src = 'img/icons/grade_incorrect.svg';
            } else if (icon.src && icon.src.indexOf('correct') > -1) {
                icon.src = 'img/icons/grade_correct.svg';
            }
            parent = icon.parentNode;
            if (!parent) {
                return;
            }
            if (!parent.querySelector('.feedbackspan.accesshide')) {
                return;
            }
            icon.setAttribute('ng-click', 'questionCorrectnessIconClicked($event)');
        });
        scope.questionCorrectnessIconClicked = function(event) {
            var parent = event.target.parentNode,
                feedback;
            if (parent) {
                feedback = parent.querySelector('.feedbackspan.accesshide');
                if (feedback && feedback.innerHTML) {
                    scope.currentFeedback = feedback.innerHTML;
                    scope.feedbackModal.show();
                }
            }
        };
        $ionicModal.fromTemplateUrl('core/components/question/templates/feedbackmodal.html', {
            scope: scope
        }).then(function(modal) {
            scope.feedbackModal = modal;
            scope.closeModal = function() {
                modal.hide();
            };
        });
    };
    return self;
}]);

angular.module('mm.core.question')
.constant('mmQuestionStore', 'questions')
.constant('mmQuestionAnswersStore', 'question_answers')
.config(["$mmSitesFactoryProvider", "mmQuestionStore", "mmQuestionAnswersStore", function($mmSitesFactoryProvider, mmQuestionStore, mmQuestionAnswersStore) {
    var stores = [
        {
            name: mmQuestionStore,
            keyPath: ['component', 'attemptid', 'slot'],
            indexes: [
                {
                    name: 'userid'
                },
                {
                    name: 'component'
                },
                {
                    name: 'componentId'
                },
                {
                    name: 'attemptid'
                },
                {
                    name: 'slot'
                },
                {
                    name: 'state'
                },
                {
                    name: 'componentAndAttempt',
                    generator: function(obj) {
                        return [obj.component, obj.attemptid];
                    }
                },
                {
                    name: 'componentAndComponentId',
                    generator: function(obj) {
                        return [obj.component, obj.componentId];
                    }
                }
            ]
        },
        {
            name: mmQuestionAnswersStore,
            keyPath: ['component', 'attemptid', 'name'],
            indexes: [
                {
                    name: 'userid'
                },
                {
                    name: 'component'
                },
                {
                    name: 'componentId'
                },
                {
                    name: 'attemptid'
                },
                {
                    name: 'name'
                },
                {
                    name: 'questionslot'
                },
                {
                    name: 'componentAndAttempt',
                    generator: function(obj) {
                        return [obj.component, obj.attemptid];
                    }
                },
                {
                    name: 'componentAndComponentId',
                    generator: function(obj) {
                        return [obj.component, obj.componentId];
                    }
                },
                {
                    name: 'componentAndAttemptAndQuestion',
                    generator: function(obj) {
                        return [obj.component, obj.attemptid, obj.questionslot];
                    }
                }
            ]
        }
    ];
    $mmSitesFactoryProvider.registerStores(stores);
}])
.factory('$mmQuestion', ["$log", "$mmSite", "$mmSitesManager", "$mmUtil", "$q", "$mmQuestionDelegate", "mmQuestionStore", "mmQuestionAnswersStore", function($log, $mmSite, $mmSitesManager, $mmUtil, $q, $mmQuestionDelegate, mmQuestionStore,
            mmQuestionAnswersStore) {
    $log = $log.getInstance('$mmQuestion');
    var self = {},
        questionPrefixRegex = /q\d+:(\d+)_/,
        states = {
            todo: {
                name: 'todo',
                class: 'mm-question-notyetanswered',
                status: 'notyetanswered',
                active: true,
                finished: false
            },
            invalid: {
                name: 'invalid',
                class: 'mm-question-invalidanswer',
                status: 'invalidanswer',
                active: true,
                finished: false
            },
            complete: {
                name: 'complete',
                class: 'mm-question-answersaved',
                status: 'answersaved',
                active: true,
                finished: false
            },
            needsgrading: {
                name: 'needsgrading',
                class: 'mm-question-requiresgrading',
                status: 'requiresgrading',
                active: false,
                finished: true
            },
            finished: {
                name: 'finished',
                class: 'mm-question-complete',
                status: 'complete',
                active: false,
                finished: true
            },
            gaveup: {
                name: 'gaveup',
                class: 'mm-question-notanswered',
                status: 'notanswered',
                active: false,
                finished: true
            },
            gradedwrong: {
                name: 'gradedwrong',
                class: 'mm-question-incorrect',
                status: 'incorrect',
                active: false,
                finished: true
            },
            gradedpartial: {
                name: 'gradedpartial',
                class: 'mm-question-partiallycorrect',
                status: 'partiallycorrect',
                active: false,
                finished: true
            },
            gradedright: {
                name: 'gradedright',
                class: 'mm-question-correct',
                status: 'correct',
                active: false,
                finished: true
            },
            mangrwrong: {
                name: 'mangrwrong',
                class: 'mm-question-incorrect',
                status: 'incorrect',
                active: false,
                finished: true
            },
            mangrpartial: {
                name: 'mangrpartial',
                class: 'mm-question-partiallycorrect',
                status: 'partiallycorrect',
                active: false,
                finished: true
            },
            mangrright: {
                name: 'mangrright',
                class: 'mm-question-correct',
                status: 'correct',
                active: false,
                finished: true
            },
            unknown: {
                name: 'unknown',
                class: 'mm-question-unknown',
                status: 'unknown',
                active: true,
                finished: false
            }
        };
        self.compareAllAnswers = function(prevAnswers, newAnswers) {
        var equal = true,
            keys = $mmUtil.mergeArraysWithoutDuplicates(Object.keys(prevAnswers), Object.keys(newAnswers));
        angular.forEach(keys, function(key) {
            if (!self.isExtraAnswer(key[0])) {
                if (!$mmUtil.sameAtKeyMissingIsBlank(prevAnswers, newAnswers, key)) {
                    equal = false;
                }
            }
        });
        return equal;
    };
        self.convertAnswersArrayToObject = function(answers, removePrefix) {
        var result = {};
        angular.forEach(answers, function(answer) {
            if (removePrefix) {
                var nameWithoutPrefix = self.removeQuestionPrefix(answer.name);
                result[nameWithoutPrefix] = answer.value;
            } else {
                result[answer.name] = answer.value;
            }
        });
        return result;
    };
        self.getAnswer = function(component, attemptId, name, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.getDb().get(mmQuestionAnswersStore, [component, attemptId, name]);
        });
    };
        self.getAttemptAnswers = function(component, attemptId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.getDb().whereEqual(mmQuestionAnswersStore, 'componentAndAttempt', [component, attemptId]);
        });
    };
        self.getAttemptQuestions = function(component, attemptId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.getDb().whereEqual(mmQuestionStore, 'componentAndAttempt', [component, attemptId]);
        });
    };
        self.getBasicAnswers = function(answers) {
        var result = {};
        angular.forEach(answers, function(value, name) {
            if (!self.isExtraAnswer(name)) {
                result[name] = value;
            }
        });
        return result;
    };
        self.getQuestion = function(component, attemptId, slot, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.getDb().get(mmQuestionStore, [component, attemptId, slot]);
        });
    };
        self.getQuestionAnswers = function(component, attemptId, slot, filter, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.getDb().whereEqual(mmQuestionAnswersStore, 'componentAndAttemptAndQuestion',
                        [component, attemptId, slot]).then(function(answers) {
                if (filter) {
                    var result = [];
                    angular.forEach(answers, function(answer) {
                        if (self.isExtraAnswer(answer.name)) {
                            result.push(answer);
                        }
                    });
                    return result;
                } else {
                    return answers;
                }
            });
        });
    };
        self.getQuestionSlotFromName = function(name) {
        if (name) {
            var match = name.match(questionPrefixRegex);
            if (match && match[1]) {
                return parseInt(match[1], 10);
            }
        }
        return -1;
    };
        self.getState = function(name) {
        return states[name];
    };
        self.isCompleteResponse = function(question, answers) {
        return $mmQuestionDelegate.isCompleteResponse(question, answers);
    };
        self.isExtraAnswer = function(name) {
        name = self.removeQuestionPrefix(name);
        return name[0] == '-' || name[0] == ':';
    };
        self.isGradableResponse = function(question, answers) {
        return $mmQuestionDelegate.isGradableResponse(question, answers);
    };
        self.isSameResponse = function(question, prevAnswers, newAnswers) {
        return $mmQuestionDelegate.isSameResponse(question, prevAnswers, newAnswers);
    };
        self.removeAttemptAnswers = function(component, attemptId, siteId) {
        siteId = siteId || $mmSite.getId();
        return self.getAttemptAnswers(component, attemptId, siteId).then(function(answers) {
            var promises = [];
            angular.forEach(answers, function(answer) {
                promises.push(self.removeAnswer(component, attemptId, answer.name, siteId));
            });
            return $q.all(promises);
        });
    };
        self.removeAttemptQuestions = function(component, attemptId, siteId) {
        siteId = siteId || $mmSite.getId();
        return self.getAttemptQuestions(component, attemptId, siteId).then(function(questions) {
            var promises = [];
            angular.forEach(questions, function(question) {
                promises.push(self.removeQuestion(component, attemptId, question.slot, siteId));
            });
            return $q.all(promises);
        });
    };
        self.removeAnswer = function(component, attemptId, name, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.getDb().remove(mmQuestionAnswersStore, [component, attemptId, name]);
        });
    };
        self.removeQuestion = function(component, attemptId, slot, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.getDb().remove(mmQuestionStore, [component, attemptId, slot]);
        });
    };
        self.removeQuestionAnswers = function(component, attemptId, slot, siteId) {
        return self.getQuestionAnswers(component, attemptId, slot, false, siteId).then(function(answers) {
            var promises = [];
            angular.forEach(answers, function(answer) {
                promises.push(self.removeAnswer(component, attemptId, answer.name, siteId));
            });
            return $q.all(promises);
        });
    };
        self.removeQuestionPrefix = function(name) {
        if (name) {
            return name.replace(questionPrefixRegex, '');
        }
        return '';
    };
        self.saveAnswers = function(component, componentId, attemptId, userId, answers, timemod, siteId) {
        siteId = siteId || $mmSite.getId();
        timemod = timemod || $mmUtil.timestamp();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var db = site.getDb(),
                promises = [];
            angular.forEach(answers, function(value, name) {
                var entry = {
                    component: component,
                    componentId: componentId,
                    attemptid: attemptId,
                    userid: userId,
                    questionslot: self.getQuestionSlotFromName(name),
                    name: name,
                    value: value,
                    timemodified: timemod
                };
                promises.push(db.insert(mmQuestionAnswersStore, entry));
            });
            return $q.all(promises);
        });
    };
        self.saveQuestion = function(component, componentId, attemptId, userId, question, state, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var entry = {
                component: component,
                componentId: componentId,
                attemptid: attemptId,
                userid: userId,
                number: question.number,
                slot: question.slot,
                state: state
            };
            return site.getDb().insert(mmQuestionStore, entry);
        });
    };
    return self;
}]);

angular.module('mm.core.settings')
.controller('mmSettingsAboutCtrl', ["$scope", "$translate", "$window", "$mmApp", "$ionicPlatform", "$mmLang", "$mmFS", "$mmLocalNotifications", "mmCoreConfigConstants", function($scope, $translate, $window, $mmApp, $ionicPlatform, $mmLang, $mmFS,
            $mmLocalNotifications, mmCoreConfigConstants) {
    $scope.versionname = mmCoreConfigConstants.versionname;
    $translate('mm.settings.appname', {version: $scope.versionname}).then(function(appName) {
        $scope.appname = appName;
    });
    $scope.versioncode = mmCoreConfigConstants.versioncode;
    $scope.navigator = $window.navigator;
    if ($window.location && $window.location.href) {
        var url = $window.location.href;
        $scope.locationhref = url.substr(0, url.indexOf('#/site/'));
    }
    $scope.appready = $mmApp.isReady() ? 'mm.core.yes' : 'mm.core.no';
    $scope.devicetype = $ionicPlatform.isTablet() ? 'mm.core.tablet' : 'mm.core.phone';
    if (ionic.Platform.isAndroid()) {
        $scope.deviceos = 'mm.core.android';
    } else if (ionic.Platform.isIOS()) {
        $scope.deviceos = 'mm.core.ios';
    } else if (ionic.Platform.isWindowsPhone()) {
        $scope.deviceos = 'mm.core.windowsphone';
    } else {
        var matches = navigator.userAgent.match(/\(([^\)]*)\)/);
        if (matches && matches.length > 1) {
            $scope.deviceos = matches[1];
        } else {
            $scope.deviceos = 'mm.core.unknown';
        }
    }
    $mmLang.getCurrentLanguage().then(function(lang) {
        $scope.currentlanguage = lang;
    });
    $scope.networkstatus = $mmApp.isOnline() ? 'mm.core.online' : 'mm.core.offline';
    $scope.wificonnection = $mmApp.isNetworkAccessLimited() ? 'mm.core.no' : 'mm.core.yes';
    $scope.devicewebworkers = !!window.Worker && !!window.URL ? 'mm.core.yes' : 'mm.core.no';
    $scope.device = ionic.Platform.device();
    if ($mmFS.isAvailable()) {
        $mmFS.getBasePath().then(function(basepath) {
            $scope.filesystemroot = basepath;
            $scope.fsclickable = $mmFS.usesHTMLAPI();
        });
    }
    $scope.storagetype = $mmApp.getDB().getType();
    $scope.localnotifavailable = $mmLocalNotifications.isAvailable() ? 'mm.core.yes' : 'mm.core.no';
}]);

angular.module('mm.core.settings')
.controller('mmSettingsGeneralCtrl', ["$scope", "$mmLang", "$ionicHistory", "$mmEvents", "$mmConfig", "mmCoreEventLanguageChanged", "mmCoreSettingsReportInBackground", "mmCoreConfigConstants", "mmCoreSettingsDownloadSection", "mmCoreSettingsRichTextEditor", "$mmUtil", function($scope, $mmLang, $ionicHistory, $mmEvents, $mmConfig, mmCoreEventLanguageChanged,
            mmCoreSettingsReportInBackground, mmCoreConfigConstants, mmCoreSettingsDownloadSection, mmCoreSettingsRichTextEditor,
            $mmUtil) {
    $scope.langs = mmCoreConfigConstants.languages;
    $mmLang.getCurrentLanguage().then(function(currentLanguage) {
        $scope.selectedLanguage = currentLanguage;
    });
    $scope.languageChanged = function(newLang) {
        $mmLang.changeCurrentLanguage(newLang).finally(function() {
            $ionicHistory.clearCache();
            $mmEvents.trigger(mmCoreEventLanguageChanged);
        });
    };
    $mmConfig.get(mmCoreSettingsDownloadSection, true).then(function(downloadSectionEnabled) {
        $scope.downloadSection = downloadSectionEnabled;
    });
    $scope.downloadSectionChanged = function(downloadSection) {
        $mmConfig.set(mmCoreSettingsDownloadSection, downloadSection);
    };
    $scope.rteSupported = $mmUtil.isRichTextEditorSupported();
    if ($scope.rteSupported) {
        $mmConfig.get(mmCoreSettingsRichTextEditor, true).then(function(richTextEditorEnabled) {
            $scope.richTextEditor = richTextEditorEnabled;
        });
        $scope.richTextEditorChanged = function(richTextEditor) {
            $mmConfig.set(mmCoreSettingsRichTextEditor, richTextEditor);
        };
    }
    if (localStorage && localStorage.getItem && localStorage.setItem) {
        $scope.showReport = true;
        $scope.reportInBackground = parseInt(localStorage.getItem(mmCoreSettingsReportInBackground), 10) === 1;
        $scope.reportChanged = function(inBackground) {
            localStorage.setItem(mmCoreSettingsReportInBackground, inBackground ? '1' : '0');
        };
    } else {
        $scope.showReport = false;
    }
}]);

angular.module('mm.core.settings')
.controller('mmSettingsListCtrl', ["$scope", function($scope) {
    $scope.isIOS = ionic.Platform.isIOS();
}]);

angular.module('mm.core.settings')
.controller('mmSettingsSpaceUsageCtrl', ["$log", "$scope", "$mmSitesManager", "$mmFS", "$q", "$mmUtil", "$translate", "$mmText", "$mmFilepool", function($log, $scope, $mmSitesManager, $mmFS, $q, $mmUtil, $translate,
            $mmText, $mmFilepool) {
    $log = $log.getInstance('mmSettingsSpaceUsageCtrl');
    function calculateSizeUsage() {
        return $mmSitesManager.getSites().then(function(sites) {
            var promises = [];
            $scope.sites = sites;
            angular.forEach(sites, function(siteEntry) {
                var promise = $mmSitesManager.getSite(siteEntry.id).then(function(site) {
                    return site.getSpaceUsage().then(function(size) {
                        siteEntry.spaceusage = size;
                    });
                });
                promises.push(promise);
            });
            return $q.all(promises);
        });
    }
    function calculateTotalUsage() {
        var total = 0;
        angular.forEach($scope.sites, function(site) {
            if (site.spaceusage) {
                total += parseInt(site.spaceusage, 10);
            }
        });
        $scope.totalusage = total;
    }
    function calculateFreeSpace() {
        if ($mmFS.isAvailable()) {
            return $mmFS.calculateFreeSpace().then(function(freespace) {
                $scope.freespace = freespace;
            }, function() {
                $scope.freespace = 0;
            });
        } else {
            $scope.freespace = 0;
        }
    }
    function fetchData() {
        var promises = [];
        promises.push(calculateSizeUsage().then(calculateTotalUsage));
        promises.push($q.when(calculateFreeSpace()));
        return $q.all(promises);
    }
    fetchData().finally(function() {
        $scope.sizeLoaded = true;
    });
    $scope.refresh = function() {
        fetchData().finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    function updateSiteUsage(site, newUsage) {
        var oldUsage = site.spaceusage;
        site.spaceusage = newUsage;
        $scope.totalusage -= oldUsage - newUsage;
        $scope.freespace += oldUsage - newUsage;
    }
    $scope.deleteSiteFiles = function(siteData) {
        if (siteData) {
            var siteid = siteData.id,
                sitename = siteData.sitename;
            $mmText.formatText(sitename).then(function(sitename) {
                $translate('mm.settings.deletesitefilestitle').then(function(title) {
                    return $mmUtil.showConfirm($translate('mm.settings.deletesitefiles', {sitename: sitename}), title);
                }).then(function() {
                    return $mmSitesManager.getSite(siteid);
                }).then(function(site) {
                    return site.deleteFolder().then(function() {
                        $mmFilepool.clearAllPackagesStatus(siteid);
                        $mmFilepool.clearFilepool(siteid);
                        updateSiteUsage(siteData, 0);
                    }).catch(function(error) {
                        if (error && error.code === FileError.NOT_FOUND_ERR) {
                            $mmFilepool.clearAllPackagesStatus(siteid);
                            updateSiteUsage(siteData, 0);
                        } else {
                            $mmUtil.showErrorModal('mm.settings.errordeletesitefiles', true);
                            site.getSpaceUsage().then(function(size) {
                                updateSiteUsage(siteData, size);
                            });
                        }
                    });
                });
            });
        }
    };
}]);

angular.module('mm.core.settings')
.controller('mmSettingsSynchronizationCtrl', ["$log", "$scope", "$mmSitesManager", "$mmUtil", "$mmFilepool", "$mmEvents", "$mmLang", "$mmConfig", "mmCoreEventSessionExpired", "mmCoreSettingsSyncOnlyOnWifi", function($log, $scope, $mmSitesManager, $mmUtil, $mmFilepool, $mmEvents,
            $mmLang, $mmConfig, mmCoreEventSessionExpired, mmCoreSettingsSyncOnlyOnWifi) {
    $log = $log.getInstance('mmSettingsSynchronizationCtrl');
    $mmSitesManager.getSites().then(function(sites) {
        $scope.sites = sites;
    });
    $mmConfig.get(mmCoreSettingsSyncOnlyOnWifi, true).then(function(syncOnlyOnWifi) {
        $scope.syncOnlyOnWifi = syncOnlyOnWifi;
    });
    $scope.syncWifiChanged = function(syncOnlyOnWifi) {
        $mmConfig.set(mmCoreSettingsSyncOnlyOnWifi, syncOnlyOnWifi);
    };
    $scope.synchronize = function(siteData) {
        if (siteData) {
            var siteid = siteData.id,
                modal = $mmUtil.showModalLoading('mm.settings.synchronizing', true);
            $mmFilepool.invalidateAllFiles(siteid).finally(function() {
                $mmSitesManager.getSite(siteid).then(function(site) {
                    return site.invalidateWsCache().then(function() {
                        return site.checkIfLocalMobileInstalledAndNotUsed().then(function() {
                            $mmEvents.trigger(mmCoreEventSessionExpired, siteid);
                            return $mmLang.translateAndReject('mm.core.lostconnection');
                        }, function() {
                            return $mmSitesManager.updateSiteInfo(siteid);
                        });
                    }).then(function() {
                        siteData.fullname = site.getInfo().fullname;
                        siteData.sitename = site.getInfo().sitename;
                        $mmUtil.showModal('mm.core.success', 'mm.settings.syncsitesuccess');
                    });
                }).catch(function(error) {
                    if (error) {
                        $mmUtil.showErrorModal(error);
                    } else {
                        $mmUtil.showErrorModal('mm.settings.errorsyncsite', true);
                    }
                }).finally(function() {
                    modal.dismiss();
                });
            });
        }
    };
}]);

angular.module('mm.core.sharedfiles')
.controller('mmSharedFilesChooseSiteCtrl', ["$scope", "$stateParams", "$mmSitesManager", "$mmUtil", "$ionicHistory", "$mmFS", "$mmSharedFilesHelper", function($scope, $stateParams, $mmSitesManager, $mmUtil, $ionicHistory, $mmFS,
            $mmSharedFilesHelper) {
    var filePath = $stateParams.filepath || {},
        fileAndDir = $mmFS.getFileAndDirectoryFromPath(filePath),
        fileEntry;
    if (!filePath) {
        $mmUtil.showErrorModal('Error reading file.');
        $ionicHistory.goBack();
        return;
    }
    $scope.filename = fileAndDir.name;
    $mmFS.getFile(filePath).then(function(fe) {
        fileEntry = fe;
        $scope.filename = fileEntry.name;
    }).catch(function() {
        $mmUtil.showErrorModal('Error reading file.');
        $ionicHistory.goBack();
    });
    $mmSitesManager.getSites().then(function(sites) {
        $scope.sites = sites;
    }).finally(function() {
        $scope.loaded = true;
    });
    $scope.storeInSite = function(siteId) {
        $scope.loaded = false;
        $mmSharedFilesHelper.storeSharedFileInSite(fileEntry, siteId).then(function() {
            $ionicHistory.goBack();
        }).finally(function() {
            $scope.loaded = true;
        });
    };
}]);

angular.module('mm.core.sharedfiles')
.controller('mmSharedFilesListCtrl', ["$scope", "$stateParams", "$mmSharedFiles", "$ionicScrollDelegate", "$state", "$mmFS", "$translate", "$mmEvents", "$mmSite", "$mmSharedFilesHelper", "$ionicHistory", "mmSharedFilesEventFileShared", function($scope, $stateParams, $mmSharedFiles, $ionicScrollDelegate, $state, $mmFS,
            $translate, $mmEvents, $mmSite, $mmSharedFilesHelper, $ionicHistory, mmSharedFilesEventFileShared) {
    var path = $stateParams.path || '',
        manage = $stateParams.manage,
        pick = $stateParams.pick,
        shareObserver,
        siteId = $mmSite.getId();
        window.path = path;
    $scope.manage = manage;
    $scope.pick = pick;
    if (path) {
        $scope.title = $mmFS.getFileAndDirectoryFromPath(path).name;
    } else {
        $scope.title = $translate.instant('mm.sharedfiles.sharedfiles');
    }
    function loadFiles() {
        return $mmSharedFiles.getSiteSharedFiles(siteId, path).then(function(files) {
            $scope.files = files;
        });
    }
    loadFiles().finally(function() {
        $scope.filesLoaded = true;
    });
    shareObserver = $mmEvents.on(mmSharedFilesEventFileShared, function(data) {
        if (data.siteid == siteId) {
            $scope.filesLoaded = false;
            loadFiles().finally(function() {
                $scope.filesLoaded = true;
            });
        }
    });
    $scope.refreshFiles = function() {
        loadFiles().finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.fileDeleted = function(index) {
        $scope.files.splice(index, 1);
        $ionicScrollDelegate.resize();
    };
    $scope.fileRenamed = function(index, file) {
        $scope.files[index] = file;
    };
    $scope.openFolder = function(folder) {
        $state.go('site.sharedfiles-list', {path: $mmFS.concatenatePaths(path, folder.name), manage: manage, pick: pick});
    };
    $scope.changeSite = function(sid) {
        siteId = sid;
        $scope.filesLoaded = false;
        loadFiles().finally(function() {
            $scope.filesLoaded = true;
        });
    };
    if (pick) {
        $scope.filePicked = function(file) {
            $mmSharedFilesHelper.filePicked(file.fullPath);
            if (path) {
                var count = path.split('/').length + 1;
                $ionicHistory.goBack(-count);
            } else {
                $ionicHistory.goBack();
            }
        };
    }
    $scope.$on('$destroy', function() {
        shareObserver && shareObserver.off && shareObserver.off();
        if (pick && !path) {
            $mmSharedFilesHelper.filePickerClosed();
        }
    });
}]);

angular.module('mm.core.sharedfiles')
.factory('$mmSharedFilesHandlers', ["$mmSharedFilesHelper", function($mmSharedFilesHelper) {
    var self = {};
        self.filePicker = function() {
        var self = {};
                self.isEnabled = function() {
            return ionic.Platform.isIOS();
        };
                self.getController = function() {
                        return function($scope) {
                $scope.title = 'mm.sharedfiles.sharedfiles';
                $scope.class = 'mm-sharedfiles-filepicker-handler';
                $scope.action = function(maxSize) {
                    return $mmSharedFilesHelper.pickSharedFile();
                };
            };
        };
        return self;
    };
    return self;
}]);

angular.module('mm.core.sharedfiles')
.factory('$mmSharedFilesHelper', ["$mmSharedFiles", "$mmUtil", "$log", "$mmApp", "$mmSitesManager", "$mmFS", "$rootScope", "$q", "$ionicModal", "$state", "$translate", function($mmSharedFiles, $mmUtil, $log, $mmApp, $mmSitesManager, $mmFS, $rootScope, $q,
            $ionicModal, $state, $translate) {
    $log = $log.getInstance('$mmSharedFilesHelper');
    var self = {},
        filePickerDeferred;
        self.askRenameReplace = function(originalName, newName) {
        var scope = $rootScope.$new();
        scope.originalName = originalName;
        scope.newName = newName;
        return $ionicModal.fromTemplateUrl('core/components/sharedfiles/templates/renamereplace.html', {
            scope: scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            var deferred = $q.defer();
            scope.modal = modal;
            modal.show();
            scope.click = function(name) {
                close();
                deferred.resolve(name);
            };
            scope.closeModal = function() {
                close();
                deferred.reject();
            };
            function close() {
                modal.remove();
                scope.$destroy();
            }
            return deferred.promise;
        });
    };
        self.filePickerClosed = function() {
        if (filePickerDeferred) {
            filePickerDeferred.reject();
            filePickerDeferred = undefined;
        }
    };
        self.filePicked = function(filePath) {
        if (filePickerDeferred) {
            filePickerDeferred.resolve({
                path: filePath,
                uploaded: false
            });
            filePickerDeferred = undefined;
        }
    };
        self.goToChooseSite = function(filePath) {
        var parentState = $state.$current.name.split('.')[0];
        return $state.go(parentState + '.sharedfiles-choose-site', {filepath: filePath});
    };
        self.pickSharedFile = function() {
        filePickerDeferred = $q.defer();
        $state.go('site.sharedfiles-list', {pick: true});
        return filePickerDeferred.promise;
    };
        self.searchIOSNewSharedFiles = function() {
        return $mmApp.ready().then(function() {
            if ($state.$current.name == 'site.sharedfiles-choose-site') {
                return $q.reject();
            }
            return $mmSharedFiles.checkIOSNewFiles().then(function(fileEntry) {
                return $mmSitesManager.getSitesIds().then(function(siteIds) {
                    if (!siteIds.length) {
                        $mmUtil.showErrorModal('mm.sharedfiles.errorreceivefilenosites', true);
                        $mmSharedFiles.deleteInboxFile(fileEntry);
                    } else if (siteIds.length == 1) {
                        self.storeSharedFileInSite(fileEntry, siteIds[0]);
                    } else {
                        self.goToChooseSite(fileEntry.fullPath);
                    }
                });
            });
        });
    };
        self.storeSharedFileInSite = function(fileEntry, siteId) {
        siteId = siteId || $mmSite.getId();
        var sharedFilesDirPath = $mmSharedFiles.getSiteSharedFilesDirPath(siteId);
        return $mmFS.getUniqueNameInFolder(sharedFilesDirPath, fileEntry.name).then(function(newName) {
            if (newName == fileEntry.name) {
                return newName;
            } else {
                return self.askRenameReplace(fileEntry.name, newName);
            }
        }).then(function(name) {
            return $mmSharedFiles.storeFileInSite(fileEntry, name, siteId).finally(function() {
                $mmSharedFiles.deleteInboxFile(fileEntry);
                $mmUtil.showModal(undefined, $translate.instant('mm.sharedfiles.successstorefile'));
            }).catch(function(err) {
                $mmUtil.showErrorModal(err || 'Error moving file.');
                return $q.reject();
            });
        });
    };
    return self;
}]);

angular.module('mm.core.sharedfiles')
.config(["$mmAppProvider", "mmSharedFilesStore", function($mmAppProvider, mmSharedFilesStore) {
    var stores = [
        {
            name: mmSharedFilesStore,
            keyPath: 'id'
        }
    ];
    $mmAppProvider.registerStores(stores);
}])
.factory('$mmSharedFiles', ["$mmFS", "$q", "$log", "$mmApp", "$mmSite", "$mmEvents", "md5", "mmSharedFilesStore", "mmSharedFilesFolder", "mmSharedFilesEventFileShared", function($mmFS, $q, $log, $mmApp, $mmSite, $mmEvents, md5, mmSharedFilesStore, mmSharedFilesFolder,
            mmSharedFilesEventFileShared) {
    $log = $log.getInstance('$mmSharedFiles');
    var self = {};
        self.checkIOSNewFiles = function() {
        $log.debug('Search for new files on iOS');
        return $mmFS.getDirectoryContents('Inbox').then(function(entries) {
            if (entries.length > 0) {
                var promises = [],
                    fileToReturn;
                angular.forEach(entries, function(entry) {
                    var fileId = self._getFileId(entry);
                    promises.push(self._isFileTreated(fileId).then(function() {
                        self.deleteInboxFile(entry);
                    }).catch(function() {
                        $log.debug('Found new file ' + entry.name + ' shared with the app.');
                        if (!fileToReturn) {
                            fileToReturn = entry;
                        }
                    }));
                });
                return $q.all(promises).then(function() {
                    var fileId;
                    if (fileToReturn) {
                        fileId = self._getFileId(fileToReturn);
                        return self._markAsTreated(fileId).then(function() {
                            $log.debug('File marked as "treated": ' + fileToReturn.name);
                            return fileToReturn;
                        });
                    } else {
                        return $q.reject();
                    }
                });
            } else {
                return $q.reject();
            }
        });
    };
        self.deleteInboxFile = function(entry) {
        var fileId = self._getFileId(entry),
            deferred = $q.defer();
        function removeMark() {
            self._unmarkAsTreated(fileId).then(function() {
                $log.debug('"Treated" mark removed from file: ' + entry.name);
                deferred.resolve();
            }).catch(function() {
                $log.debug('Error deleting "treated" mark from file: ' + entry.name);
                deferred.reject();
            });
        }
        $log.debug('Delete inbox file: ' + entry.name);
        entry.remove(removeMark, removeMark);
        return deferred.promise;
    };
        self._getFileId = function(entry) {
        return md5.createHash(entry.name);
    };
        self.getSiteSharedFiles = function(siteId, path) {
        siteId = siteId || $mmSite.getId();
        var pathToGet = self.getSiteSharedFilesDirPath(siteId);
        if (path) {
            pathToGet = $mmFS.concatenatePaths(pathToGet, path);
        }
        return $mmFS.getDirectoryContents(pathToGet).catch(function() {
            return [];
        });
    };
        self.getSiteSharedFilesDirPath = function(siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmFS.getSiteFolder(siteId) + '/' + mmSharedFilesFolder;
    };
        self._isFileTreated = function(fileId) {
        return $mmApp.getDB().get(mmSharedFilesStore, fileId);
    };
        self._markAsTreated = function(fileId) {
        return $mmApp.getDB().insert(mmSharedFilesStore, {id: fileId});
    };
        self.storeFileInSite = function(entry, newName, siteId) {
        siteId = siteId || $mmSite.getId();
        if (!entry || !siteId) {
            return $q.reject();
        }
        newName = newName || entry.name;
        var sharedFilesFolder = self.getSiteSharedFilesDirPath(siteId),
            newPath = $mmFS.concatenatePaths(sharedFilesFolder, newName);
        return $mmFS.createDir(sharedFilesFolder).then(function() {
            return $mmFS.moveFile(entry.fullPath, newPath).then(function(newFile) {
                $mmEvents.trigger(mmSharedFilesEventFileShared, {siteid: siteId, name: newName});
                return newFile;
            });
        });
    };
        self._unmarkAsTreated = function(fileId) {
        return $mmApp.getDB().remove(mmSharedFilesStore, fileId);
    };
    return self;
}]);

angular.module('mm.core.sidemenu')
.controller('mmSideMenuCtrl', ["$scope", "$state", "$mmSideMenuDelegate", "$mmSitesManager", "$mmSite", "$mmEvents", "$timeout", "mmCoreEventLanguageChanged", "mmCoreEventSiteUpdated", "$mmSideMenu", function($scope, $state, $mmSideMenuDelegate, $mmSitesManager, $mmSite, $mmEvents,
            $timeout, mmCoreEventLanguageChanged, mmCoreEventSiteUpdated, $mmSideMenu) {
    $mmSideMenu.setScope($scope);
    $scope.handlers = $mmSideMenuDelegate.getNavHandlers();
    $scope.areNavHandlersLoaded = $mmSideMenuDelegate.areNavHandlersLoaded;
    $scope.siteinfo = $mmSite.getInfo();
    $scope.logout = function() {
        $mmSitesManager.logout().finally(function() {
            $state.go('mm_login.sites');
        });
    };
    $mmSite.getDocsUrl().then(function(docsurl) {
        $scope.docsurl = docsurl;
    });
    function updateSiteInfo() {
        $scope.siteinfo = undefined;
        $timeout(function() {
            $scope.siteinfo = $mmSite.getInfo();
            $mmSite.getDocsUrl().then(function(docsurl) {
                $scope.docsurl = docsurl;
            });
        });
    }
    var langObserver = $mmEvents.on(mmCoreEventLanguageChanged, updateSiteInfo);
    var updateSiteObserver = $mmEvents.on(mmCoreEventSiteUpdated, function(siteid) {
        if ($mmSite.getId() === siteid) {
            updateSiteInfo();
        }
    });
    $scope.$on('$destroy', function() {
        if (langObserver && langObserver.off) {
            langObserver.off();
        }
        if (updateSiteObserver && updateSiteObserver.off) {
            updateSiteObserver.off();
        }
    });
}]);

angular.module('mm.core.sidemenu')
.provider('$mmSideMenuDelegate', function() {
    var navHandlers = {},
        self = {};
        self.registerNavHandler = function(addon, handler, priority) {
        if (typeof navHandlers[addon] !== 'undefined') {
            console.log("$mmSideMenuDelegateProvider: Addon '" + navHandlers[addon].addon + "' already registered as navigation handler");
            return false;
        }
        console.log("$mmSideMenuDelegateProvider: Registered addon '" + addon + "' as navigation handler.");
        navHandlers[addon] = {
            addon: addon,
            handler: handler,
            instance: undefined,
            priority: priority
        };
        return true;
    };
    self.$get = ["$mmUtil", "$q", "$log", "$mmSite", function($mmUtil, $q, $log, $mmSite) {
        var enabledNavHandlers = {},
            currentSiteHandlers = [],
            self = {},
            loaded = false,
            lastUpdateHandlersStart;
        $log = $log.getInstance('$mmSideMenuDelegate');
                self.areNavHandlersLoaded = function() {
            return loaded;
        };
                self.clearSiteHandlers = function() {
            loaded = false;
            $mmUtil.emptyArray(currentSiteHandlers);
        };
                self.getNavHandlers = function() {
            return currentSiteHandlers;
        };
                self.isLastUpdateCall = function(time) {
            if (!lastUpdateHandlersStart) {
                return true;
            }
            return time == lastUpdateHandlersStart;
        };
                self.updateNavHandler = function(addon, handlerInfo, time) {
            var promise,
                siteId = $mmSite.getId();
            if (typeof handlerInfo.instance === 'undefined') {
                handlerInfo.instance = $mmUtil.resolveObject(handlerInfo.handler, true);
            }
            if (!$mmSite.isLoggedIn()) {
                promise = $q.reject();
            } else {
                promise = $q.when(handlerInfo.instance.isEnabled());
            }
            return promise.catch(function() {
                return false;
            }).then(function(enabled) {
                if (self.isLastUpdateCall(time) && $mmSite.isLoggedIn() && $mmSite.getId() === siteId) {
                    if (enabled) {
                        enabledNavHandlers[addon] = {
                            instance: handlerInfo.instance,
                            priority: handlerInfo.priority
                        };
                    } else {
                        delete enabledNavHandlers[addon];
                    }
                }
            });
        };
                self.updateNavHandlers = function() {
            var promises = [],
                now = new Date().getTime();
            $log.debug('Updating navigation handlers for current site.');
            lastUpdateHandlersStart = now;
            angular.forEach(navHandlers, function(handlerInfo, addon) {
                promises.push(self.updateNavHandler(addon, handlerInfo, now));
            });
            return $q.all(promises).then(function() {
                return true;
            }, function() {
                return true;
            }).finally(function() {
                if (self.isLastUpdateCall(now)) {
                    $mmUtil.emptyArray(currentSiteHandlers);
                    angular.forEach(enabledNavHandlers, function(handler) {
                        currentSiteHandlers.push({
                            controller: handler.instance.getController(),
                            priority: handler.priority
                        });
                    });
                    loaded = true;
                }
            });
        };
        return self;
    }];
    return self;
});

angular.module('mm.core.sidemenu')
.factory('$mmSideMenu', ["$log", function($log) {
    $log = $log.getInstance('$mmSideMenu');
    var self = {},
        scope;
        self.hideRightSideMenu = function() {
        if (!scope) {
            return false;
        }
        if (!scope.rightSideMenu) {
            scope.rightSideMenu = {};
        }
        scope.rightSideMenu.show = false;
        return true;
    };
        self.setScope = function(scp) {
        scope = scp;
    };
        self.showRightSideMenu = function(template, data) {
        if (!template || !scope) {
            return false;
        }
        if (!scope.rightSideMenu) {
            scope.rightSideMenu = {};
        }
        scope.rightSideMenu.show = true;
        scope.rightSideMenu.template = template;
        scope.rsmScope = data;
        return true;
    };
    return self;
}])
.run(["$rootScope", "$mmSideMenu", function($rootScope, $mmSideMenu) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
        if (toState.name.split('.').length == 2) {
            $mmSideMenu.hideRightSideMenu();
        }
    });
}]);

angular.module('mm.core.textviewer')
.controller('mmTextViewerIndexCtrl', ["$stateParams", "$scope", function($stateParams, $scope) {
    $scope.title = $stateParams.title;
    if ($stateParams.replacelinebreaks) {
        $scope.content = $stateParams.content.replace(/(?:\r\n|\r|\n)/g, '<br />');
    } else {
        $scope.content = $stateParams.content;
    }
}]);

angular.module('mm.core.user')
.controller('mmUserProfileCtrl', ["$scope", "$stateParams", "$mmUtil", "$mmUser", "$mmUserDelegate", "$mmSite", "$q", "$translate", "$mmEvents", "mmUserEventProfileRefreshed", function($scope, $stateParams, $mmUtil, $mmUser, $mmUserDelegate, $mmSite, $q, $translate,
            $mmEvents, mmUserEventProfileRefreshed) {
    var courseid = $stateParams.courseid,
        userid   = $stateParams.userid;
    $scope.isAndroid = ionic.Platform.isAndroid();
    $scope.plugins = [];
    function fetchUserData() {
        return $mmUser.getProfile(userid, courseid).then(function(user) {
            user.address = $mmUser.formatAddress(user.address, user.city, user.country);
            if (user.address) {
                user.encodedAddress = encodeURIComponent(user.address);
            }
            $mmUser.formatRoleList(user.roles).then(function(roles) {
                user.roles = roles;
            });
            $scope.user = user;
            $scope.title = user.fullname;
            $scope.hasContact = user.email || user.phone1 || user.phone2 || user.city || user.country || user.address;
            $scope.hasCourseDetails = user.roles;
            $scope.hasDetails = user.url || user.interests || (user.customfields && user.customfields.length > 0);
            $scope.isLoadingHandlers = true;
            $mmUserDelegate.getProfileHandlersFor(user, courseid).then(function(handlers) {
                $scope.profileHandlers = handlers;
            }).finally(function() {
                $scope.isLoadingHandlers = false;
            });
        }, function(message) {
            $scope.user = false;
            if (message) {
                $mmUtil.showErrorMessage(message);
            }
            return $q.reject();
        });
    }
    fetchUserData().then(function() {
        return $mmSite.write('core_user_view_user_profile', {
            userid: userid,
            courseid: courseid
        }).catch(function(error) {
            $scope.isDeleted = error === $translate.instant('mm.core.userdeleted');
        });
    }).finally(function() {
        $scope.userLoaded = true;
    });
    $scope.refreshUser = function() {
        $mmEvents.trigger(mmUserEventProfileRefreshed, {courseid: courseid, userid: userid});
        $mmUser.invalidateUserCache(userid).finally(function() {
            fetchUserData().finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        });
    };
}]);

angular.module('mm.core.user')
.directive('mmUserCustomField', function() {
    return {
        restrict: 'E',
        scope: {
            field: '='
        },
        templateUrl: 'core/components/user/templates/usercustomfield.html',
        link: function(scope, element, attributes) {
            var field = scope.field;
            if (!field || (field.type != "checkbox" && field.type != "datetime" && field.type != "menu" && field.type != "text" &&
                    field.type != "textarea")) {
                return;
            }
            scope.name = field.name;
            scope.type = field.type;
            scope.value = field.value;
        }
    };
});

angular.module('mm.core')
.directive('mmUserLink', ["$state", "mmUserProfileState", function($state, mmUserProfileState) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.on('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                $state.go(mmUserProfileState, {courseid: attrs.courseid, userid: attrs.userid});
            });
        }
    };
}]);

angular.module('mm.core.user')
.provider('$mmUserDelegate', function() {
    var profileHandlers = {},
        self = {};
        self.registerProfileHandler = function(component, handler, priority) {
        if (typeof profileHandlers[component] !== 'undefined') {
            console.log("$mmUserDelegateProvider: Handler '" + profileHandlers[component].component + "' already registered as profile handler");
            return false;
        }
        console.log("$mmUserDelegateProvider: Registered component '" + component + "' as profile handler.");
        profileHandlers[component] = {
            component: component,
            handler: handler,
            instance: undefined,
            priority: typeof priority === 'undefined' ? 100 : priority
        };
        return true;
    };
    self.$get = ["$q", "$log", "$mmSite", "$mmUtil", function($q, $log, $mmSite, $mmUtil) {
        var enabledProfileHandlers = {},
            self = {},
            lastUpdateHandlersStart;
        $log = $log.getInstance('$mmUserDelegate');
                self.getProfileHandlersFor = function(user, courseId) {
            var handlers = [],
                promises = [];
            angular.forEach(enabledProfileHandlers, function(handler) {
                var promise = $q.when(handler.instance.isEnabledForUser(user, courseId)).then(function(enabled) {
                    if (enabled) {
                        handlers.push({
                            controller: handler.instance.getController(user, courseId),
                            priority: handler.priority
                        });
                    } else {
                        return $q.reject();
                    }
                }).catch(function() {
                });
                promises.push(promise);
            });
            return $q.all(promises).then(function() {
                return handlers;
            }).catch(function() {
                return handlers;
            });
        };
                self.isLastUpdateCall = function(time) {
            if (!lastUpdateHandlersStart) {
                return true;
            }
            return time == lastUpdateHandlersStart;
        };
                self.updateProfileHandler = function(component, handlerInfo, time) {
            var promise,
                siteId = $mmSite.getId();
            if (typeof handlerInfo.instance === 'undefined') {
                handlerInfo.instance = $mmUtil.resolveObject(handlerInfo.handler, true);
            }
            if (!$mmSite.isLoggedIn()) {
                promise = $q.reject();
            } else {
                promise = $q.when(handlerInfo.instance.isEnabled());
            }
            return promise.catch(function() {
                return false;
            }).then(function(enabled) {
                if (self.isLastUpdateCall(time) && $mmSite.isLoggedIn() && $mmSite.getId() === siteId) {
                    if (enabled) {
                        enabledProfileHandlers[component] = {
                            instance: handlerInfo.instance,
                            priority: handlerInfo.priority
                        };
                    } else {
                        delete enabledProfileHandlers[component];
                    }
                }
            });
        };
                self.updateProfileHandlers = function() {
            var promises = [],
                now = new Date().getTime();
            $log.debug('Updating profile handlers for current site.');
            lastUpdateHandlersStart = now;
            angular.forEach(profileHandlers, function(handlerInfo, component) {
                promises.push(self.updateProfileHandler(component, handlerInfo, now));
            });
            return $q.all(promises).then(function() {
                return true;
            }, function() {
                return true;
            });
        };
        return self;
    }];
    return self;
});

angular.module('mm.core.user')
.factory('$mmUserHandlers', ["$mmUtil", "$mmContentLinksHelper", function($mmUtil, $mmContentLinksHelper) {
    var self = {};
        self.linksHandler = function() {
        var self = {};
                self.getActions = function(siteIds, url) {
            if (url.indexOf('grade/report/user') == -1 &&
                    (url.indexOf('/user/view.php') > -1 || url.indexOf('/user/profile.php') > -1)) {
                var params = $mmUtil.extractUrlParams(url);
                if (typeof params.id != 'undefined') {
                    return [{
                        message: 'mm.core.view',
                        icon: 'ion-eye',
                        sites: siteIds,
                        action: function(siteId) {
                            var stateParams = {
                                courseid: params.course,
                                userid: parseInt(params.id, 10)
                            };
                            $mmContentLinksHelper.goInSite('site.mm_user-profile', stateParams, siteId);
                        }
                    }];
                }
            }
            return [];
        };
                self.handles = function(url) {
            var patterns = ['/user/view.php', '/user/profile.php'];
            if (url.indexOf('grade/report/user') == -1) {
                for (var i = 0; i < patterns.length; i++) {
                    var position = url.indexOf(patterns[i]);
                    if (position > -1) {
                        return url.substr(0, position);
                    }
                }
            }
        };
        return self;
    };
    return self;
}]);

angular.module('mm.core.user')
.constant('mmCoreUsersStore', 'users')
.config(["$mmSitesFactoryProvider", "mmCoreUsersStore", function($mmSitesFactoryProvider, mmCoreUsersStore) {
    var stores = [
        {
            name: mmCoreUsersStore,
            keyPath: 'id'
        }
    ];
    $mmSitesFactoryProvider.registerStores(stores);
}])
.factory('$mmUser', ["$log", "$q", "$mmSite", "$mmUtil", "$translate", "mmCoreUsersStore", function($log, $q, $mmSite, $mmUtil, $translate, mmCoreUsersStore) {
    $log = $log.getInstance('$mmUser');
    var self = {};
        self.deleteStoredUser = function(id) {
        if (!$mmSite.isLoggedIn()) {
            return $q.reject();
        }
        self.invalidateUserCache(id);
        return $mmSite.getDb().remove(mmCoreUsersStore, parseInt(id));
    };
        self.formatAddress = function(address, city, country) {
        if (address) {
            address += city ? ', ' + city : '';
            address += country ? ', ' + country : '';
        }
        return address;
    };
        self.formatRoleList = function(roles) {
        var deferred = $q.defer();
        if (roles && roles.length > 0) {
            $translate('mm.core.elementseparator').then(function(separator) {
                var rolekeys = roles.map(function(el) {
                    return 'mm.user.'+el.shortname;
                });
                $translate(rolekeys).then(function(roleNames) {
                    var roles = '';
                    for (var roleKey in roleNames) {
                        var roleName = roleNames[roleKey];
                        if (roleName.indexOf('mm.user.') > -1) {
                            roleName = roleName.replace('mm.user.', '');
                        }
                        roles += (roles != '' ? separator + " ": '') + roleName;
                    }
                    deferred.resolve(roles);
                });
            });
        } else {
            deferred.resolve('');
        }
        return deferred.promise;
    };
        self.getProfile = function(userid, courseid, forceLocal) {
        var deferred = $q.defer();
        if (forceLocal) {
            self.getUserFromLocal(userid).then(deferred.resolve, function() {
                self.getUserFromWS(userid, courseid).then(deferred.resolve, deferred.reject);
            });
        } else {
            self.getUserFromWS(userid, courseid).then(deferred.resolve, function() {
                self.getUserFromLocal(userid).then(deferred.resolve, deferred.reject);
            });
        }
        return deferred.promise;
    };
        function getUserCacheKey(userid) {
        return 'mmUser:data:'+userid;
    }
        self.getUserFromLocal = function(id) {
        if (!$mmSite.isLoggedIn()) {
            return $q.reject();
        }
        return $mmSite.getDb().get(mmCoreUsersStore, parseInt(id));
    };
        self.getUserFromWS = function(userid, courseid) {
        var wsName,
            data,
            preSets ={
                cacheKey: getUserCacheKey(userid)
            };
        if (courseid > 1) {
            $log.debug('Get participant with ID ' + userid + ' in course '+courseid);
            wsName = 'core_user_get_course_user_profiles';
            data = {
                "userlist[0][userid]": userid,
                "userlist[0][courseid]": courseid
            };
        } else {
            $log.debug('Get user with ID ' + userid);
            if ($mmSite.wsAvailable('core_user_get_users_by_field')) {
                wsName = 'core_user_get_users_by_field';
                data = {
                    'field': 'id',
                    'values[0]': userid
                };
            } else {
                wsName = 'core_user_get_users_by_id';
                data = {
                    'userids[0]': userid
                };
            }
        }
        return $mmSite.read(wsName, data, preSets).then(function(users) {
            if (users.length == 0) {
                return $q.reject();
            }
            var user = users.shift();
            if (user.country) {
                user.country = $mmUtil.getCountryName(user.country);
            }
            self.storeUser(user.id, user.fullname, user.profileimageurl);
            return user;
        });
    };
        self.invalidateUserCache = function(userid) {
        return $mmSite.invalidateWsCacheForKey(getUserCacheKey(userid));
    };
        self.storeUser = function(id, fullname, avatar) {
        if (!$mmSite.isLoggedIn()) {
            return $q.reject();
        }
        return $mmSite.getDb().insert(mmCoreUsersStore, {
            id: parseInt(id),
            fullname: fullname,
            profileimageurl: avatar
        });
    };
        self.storeUsers = function(users) {
        var promises = [];
        angular.forEach(users, function(user) {
            var userid = user.id || user.userid,
                img = user.profileimageurl || user.profileimgurl;
            if (typeof userid != 'undefined') {
                promises.push(self.storeUser(userid, user.fullname, img));
            }
        });
        return $q.all(promises);
    };
    return self;
}]);

angular.module('mm.addons.calendar', [])
.constant('mmaCalendarDaysInterval', 30)
.constant('mmaCalendarDefaultNotifTime', 60)
.constant('mmaCalendarComponent', 'mmaCalendarEvents')
.constant('mmaCalendarPriority', 400)
.config(["$stateProvider", "$mmSideMenuDelegateProvider", "mmaCalendarPriority", function($stateProvider, $mmSideMenuDelegateProvider, mmaCalendarPriority) {
    $stateProvider
        .state('site.calendar', {
            url: '/calendar',
            views: {
                'site': {
                    controller: 'mmaCalendarListCtrl',
                    templateUrl: 'addons/calendar/templates/list.html'
                }
            },
            params: {
                eventid: null,
                clear: false
            }
        })
        .state('site.calendar-event', {
            url: '/calendar-event/:id',
            views: {
                'site': {
                    controller: 'mmaCalendarEventCtrl',
                    templateUrl: 'addons/calendar/templates/event.html'
                }
            }
        });
    $mmSideMenuDelegateProvider.registerNavHandler('mmaCalendar', '$mmaCalendarHandlers.sideMenuNav', mmaCalendarPriority);
}])
.run(["$mmaCalendar", "$mmLocalNotifications", "$state", "$ionicPlatform", "$mmApp", "mmaCalendarComponent", function($mmaCalendar, $mmLocalNotifications, $state, $ionicPlatform, $mmApp, mmaCalendarComponent) {
    $mmLocalNotifications.registerClick(mmaCalendarComponent, function(data) {
        if (data.eventid) {
            $mmApp.ready().then(function() {
                $state.go('redirect', {siteid: data.siteid, state: 'site.calendar', params: {eventid: data.eventid}});
            });
        }
    });
    $ionicPlatform.ready(function() {
        $mmaCalendar.scheduleAllSitesEventsNotifications();
    });
}]);

angular.module('mm.addons.competency', [])
.constant('mmaCompetencyPriority', 900)
.constant('mmaCourseCompetenciesPriority', 700)
.constant('mmaCompetencyStatusDraft', 0)
.constant('mmaCompetencyStatusActive', 1)
.constant('mmaCompetencyStatusComplete', 2)
.constant('mmaCompetencyStatusWaitingForReview', 3)
.constant('mmaCompetencyStatusInReview', 4)
.constant('mmaCompetencyReviewStatusIdle', 0)
.constant('mmaCompetencyReviewStatusWaitingForReview', 1)
.constant('mmaCompetencyReviewStatusInReview', 2)
.config(["$stateProvider", "$mmSideMenuDelegateProvider", "$mmCoursesDelegateProvider", "$mmUserDelegateProvider", "mmaCompetencyPriority", "mmaCourseCompetenciesPriority", function($stateProvider, $mmSideMenuDelegateProvider, $mmCoursesDelegateProvider, $mmUserDelegateProvider,
    mmaCompetencyPriority, mmaCourseCompetenciesPriority) {
    $stateProvider
        .state('site.learningplans', {
            url: '/learningplans',
            params: {
                userid: null
            },
            views: {
                'site': {
                    controller: 'mmaLearningPlansListCtrl',
                    templateUrl: 'addons/competency/templates/planlist.html'
                }
            }
        })
        .state('site.learningplan', {
            url: '/learningplan',
            params: {
                id: null
            },
            views: {
                'site': {
                    controller: 'mmaLearningPlanCtrl',
                    templateUrl: 'addons/competency/templates/plan.html'
                }
            }
        })
        .state('site.competencies', {
            url: '/competencies',
            params: {
                pid: null,
                cid: null,
                compid: null,
                uid: null
            },
            views: {
                'site': {
                    controller: 'mmaCompetenciesListCtrl',
                    templateUrl: 'addons/competency/templates/competencies.html'
                }
            }
        })
        .state('site.competency', {
            url: '/competency',
            params: {
                planid: null,
                courseid: null,
                competencyid: null,
                userid: null
            },
            views: {
                'site': {
                    controller: 'mmaCompetencyCtrl',
                    templateUrl: 'addons/competency/templates/competency.html'
                }
            }
        })
        .state('site.coursecompetencies', {
            url: '/coursecompetencies',
            params: {
                courseid: null,
                userid: null
            },
            views: {
                'site': {
                    controller: 'mmaCourseCompetenciesCtrl',
                    templateUrl: 'addons/competency/templates/coursecompetencies.html'
                }
            }
        })
        .state('site.competencysummary', {
            url: '/competencysummary',
            params: {
                competencyid: null
            },
            views: {
                'site': {
                    controller: 'mmaCompetencySummaryCtrl',
                    templateUrl: 'addons/competency/templates/competencysummary.html'
                }
            }
        });
    $mmSideMenuDelegateProvider.registerNavHandler('mmaCompetency', '$mmaCompetencyHandlers.sideMenuNav', mmaCompetencyPriority);
    $mmCoursesDelegateProvider.registerNavHandler('mmaCompetency', '$mmaCompetencyHandlers.coursesNav',
        mmaCourseCompetenciesPriority);
    $mmUserDelegateProvider.registerProfileHandler('mmaCompetency:learningPlan', '$mmaCompetencyHandlers.learningPlan',
        mmaCompetencyPriority);
}]);
angular.module('mm.addons.coursecompletion', [])
.constant('mmaCourseCompletionPriority', 200)
.constant('mmaCourseCompletionViewCompletionPriority', 200)
.config(["$stateProvider", "$mmUserDelegateProvider", "$mmCoursesDelegateProvider", "mmaCourseCompletionPriority", "mmaCourseCompletionViewCompletionPriority", function($stateProvider, $mmUserDelegateProvider, $mmCoursesDelegateProvider, mmaCourseCompletionPriority,
            mmaCourseCompletionViewCompletionPriority) {
    $stateProvider
    .state('site.course-completion', {
        url: '/course-completion',
        views: {
            'site': {
                templateUrl: 'addons/coursecompletion/templates/report.html',
                controller: 'mmaCourseCompletionReportCtrl'
            }
        },
        params: {
            course: null,
            userid: null
        }
    });
    $mmUserDelegateProvider.registerProfileHandler('mmaCourseCompletion:viewCompletion',
            '$mmaCourseCompletionHandlers.viewCompletion', mmaCourseCompletionViewCompletionPriority);
    $mmCoursesDelegateProvider.registerNavHandler('mmaCourseCompletion',
            '$mmaCourseCompletionHandlers.coursesNav', mmaCourseCompletionPriority);
}]);

angular.module('mm.addons.files', ['mm.core'])
.constant('mmaFilesMyComponent', 'mmaFilesMy')
.constant('mmaFilesSiteComponent', 'mmaFilesSite')
.constant('mmaFilesPriority', 200)
.config(["$stateProvider", "$mmSideMenuDelegateProvider", "mmaFilesPriority", function($stateProvider, $mmSideMenuDelegateProvider, mmaFilesPriority) {
    $stateProvider
        .state('site.files', {
            url: '/files',
            views: {
                'site': {
                    controller: 'mmaFilesIndexController',
                    templateUrl: 'addons/files/templates/index.html'
                }
            }
        })
        .state('site.files-list', {
            url: '/list',
            params: {
                path: false,
                root: false,
                title: false
            },
            views: {
                'site': {
                    controller: 'mmaFilesListController',
                    templateUrl: 'addons/files/templates/list.html'
                }
            }
        })
        .state('site.files-choose-site', {
            url: '/choose-site',
            params: {
                file: null
            },
            views: {
                'site': {
                    controller: 'mmaFilesChooseSiteCtrl',
                    templateUrl: 'addons/files/templates/choosesite.html'
                }
            }
        });
    $mmSideMenuDelegateProvider.registerNavHandler('mmaFiles', '$mmaFilesHandlers.sideMenuNav', mmaFilesPriority);
}]);

angular.module('mm.addons.frontpage', [])
.constant('mmaFrontpagePriority', 1000)
.config(["$mmSideMenuDelegateProvider", "$mmContentLinksDelegateProvider", "mmaFrontpagePriority", function($mmSideMenuDelegateProvider, $mmContentLinksDelegateProvider, mmaFrontpagePriority) {
    $mmSideMenuDelegateProvider.registerNavHandler('mmaFrontpage', '$mmaFrontPageHandlers.sideMenuNav', mmaFrontpagePriority);
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaFrontpage', '$mmaFrontPageHandlers.linksHandler');
}]);

angular.module('mm.addons.grades', [])
.constant('mmaGradesPriority', 400)
.constant('mmaGradesViewGradesPriority', 400)
.config(["$stateProvider", "$mmUserDelegateProvider", "$mmCoursesDelegateProvider", "$mmContentLinksDelegateProvider", "mmaGradesPriority", "mmaGradesViewGradesPriority", function($stateProvider, $mmUserDelegateProvider, $mmCoursesDelegateProvider, $mmContentLinksDelegateProvider,
            mmaGradesPriority, mmaGradesViewGradesPriority) {
    $stateProvider
    .state('site.grades', {
        url: '/grades',
        views: {
            'site': {
                templateUrl: 'addons/grades/templates/table.html',
                controller: 'mmaGradesTableCtrl'
            }
        },
        params: {
            course: null,
            userid: null
        }
    })
    .state('site.grade', {
        url: '/grade',
        views: {
            'site': {
                templateUrl: 'addons/grades/templates/grade.html',
                controller: 'mmaGradesGradeCtrl'
            }
        },
        params: {
            courseid: null,
            userid: null,
            gradeid: null
        }
    });;
    $mmUserDelegateProvider.registerProfileHandler('mmaGrades:viewGrades', '$mmaGradesHandlers.viewGrades', mmaGradesViewGradesPriority);
    $mmCoursesDelegateProvider.registerNavHandler('mmaGrades', '$mmaGradesHandlers.coursesNav', mmaGradesPriority);
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaGrades', '$mmaGradesHandlers.linksHandler');
}]);

angular.module('mm.addons.messages', ['mm.core'])
.constant('mmaMessagesDiscussionLoadedEvent', 'mma_messages_discussion_loaded')
.constant('mmaMessagesDiscussionLeftEvent', 'mma_messages_discussion_left')
.constant('mmaMessagesPollInterval', 5000)
.constant('mmaMessagesPriority', 600)
.constant('mmaMessagesSendMessagePriority', 1000)
.constant('mmaMessagesAddContactPriority', 800)
.constant('mmaMessagesBlockContactPriority', 600)
.constant('mmaMessagesNewMessageEvent', 'mma-messages_new_message')
.config(["$stateProvider", "$mmUserDelegateProvider", "$mmSideMenuDelegateProvider", "mmaMessagesSendMessagePriority", "mmaMessagesAddContactPriority", "mmaMessagesBlockContactPriority", "mmaMessagesPriority", "$mmContentLinksDelegateProvider", function($stateProvider, $mmUserDelegateProvider, $mmSideMenuDelegateProvider, mmaMessagesSendMessagePriority,
            mmaMessagesAddContactPriority, mmaMessagesBlockContactPriority, mmaMessagesPriority, $mmContentLinksDelegateProvider) {
    $stateProvider
    .state('site.messages', {
        url: '/messages',
        views: {
            'site': {
                templateUrl: 'addons/messages/templates/index.html',
                controller: 'mmaMessagesIndexCtrl'
            }
        }
    })
    .state('site.messages-discussion', {
        url: '/messages-discussion',
        params: {
            userId: null
        },
        views: {
            'site': {
                templateUrl: 'addons/messages/templates/discussion.html',
                controller: 'mmaMessagesDiscussionCtrl'
            }
        }
    });
    $mmSideMenuDelegateProvider.registerNavHandler('mmaMessages', '$mmaMessagesHandlers.sideMenuNav', mmaMessagesPriority);
    $mmUserDelegateProvider.registerProfileHandler('mmaMessages:sendMessage', '$mmaMessagesHandlers.sendMessage', mmaMessagesSendMessagePriority);
    $mmUserDelegateProvider.registerProfileHandler('mmaMessages:addContact', '$mmaMessagesHandlers.addContact', mmaMessagesAddContactPriority);
    $mmUserDelegateProvider.registerProfileHandler('mmaMessages:blockContact', '$mmaMessagesHandlers.blockContact', mmaMessagesBlockContactPriority);
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaMessages', '$mmaMessagesHandlers.linksHandler');
}])
.run(["$mmaMessages", "$mmEvents", "$state", "$mmAddonManager", "$mmUtil", "mmCoreEventLogin", function($mmaMessages, $mmEvents, $state, $mmAddonManager, $mmUtil, mmCoreEventLogin) {
    $mmEvents.on(mmCoreEventLogin, function() {
        $mmaMessages.invalidateEnabledCache();
    });
    var $mmPushNotificationsDelegate = $mmAddonManager.get('$mmPushNotificationsDelegate');
    if ($mmPushNotificationsDelegate) {
        $mmPushNotificationsDelegate.registerHandler('mmaMessages', function(notification) {
            if ($mmUtil.isFalseOrZero(notification.notif)) {
                $mmaMessages.isMessagingEnabledForSite(notification.site).then(function() {
                    $mmaMessages.invalidateDiscussionsCache().finally(function() {
                        $state.go('redirect', {siteid: notification.site, state: 'site.messages'});
                    });
                });
                return true;
            }
        });
    }
}]);

angular.module('mm.addons.notes', [])
.constant('mmaNotesPriority', 200)
.constant('mmaNotesAddNotePriority', 200)
.config(["$stateProvider", "$mmUserDelegateProvider", "$mmCoursesDelegateProvider", "mmaNotesPriority", "mmaNotesAddNotePriority", function($stateProvider, $mmUserDelegateProvider, $mmCoursesDelegateProvider, mmaNotesPriority, mmaNotesAddNotePriority) {
    $stateProvider
    .state('site.notes-types', {
        url: '/notes-types',
        views: {
            'site': {
                templateUrl: 'addons/notes/templates/types.html',
                controller: 'mmaNotesTypesCtrl'
            }
        },
        params: {
            course: null
        }
    })
    .state('site.notes-list', {
        url: '/notes-list',
        views: {
            'site': {
                templateUrl: 'addons/notes/templates/list.html',
                controller: 'mmaNotesListCtrl'
            }
        },
        params: {
            courseid: null,
            type: null
        }
    });
    $mmUserDelegateProvider.registerProfileHandler('mmaNotes:addNote', '$mmaNotesHandlers.addNote', mmaNotesAddNotePriority);
    $mmCoursesDelegateProvider.registerNavHandler('mmaNotes', '$mmaNotesHandlers.coursesNav', mmaNotesPriority);
}]);

angular.module('mm.addons.notifications', [])
.constant('mmaNotificationsListLimit', 20)
.constant('mmaNotificationsPriority', 800)
.config(["$stateProvider", "$mmSideMenuDelegateProvider", "mmaNotificationsPriority", function($stateProvider, $mmSideMenuDelegateProvider, mmaNotificationsPriority) {
    $stateProvider
    .state('site.notifications', {
        url: '/notifications',
        views: {
            'site': {
                templateUrl: 'addons/notifications/templates/list.html',
                controller: 'mmaNotificationsListCtrl'
            }
        }
    });
    $mmSideMenuDelegateProvider.registerNavHandler('mmaNotifications', '$mmaNotificationsHandlers.sideMenuNav', mmaNotificationsPriority);
}])
.run(["$log", "$mmaNotifications", "$mmUtil", "$state", "$mmAddonManager", function($log, $mmaNotifications, $mmUtil, $state, $mmAddonManager) {
    $log = $log.getInstance('mmaNotifications');
    var $mmPushNotificationsDelegate = $mmAddonManager.get('$mmPushNotificationsDelegate');
    if ($mmPushNotificationsDelegate) {
        $mmPushNotificationsDelegate.registerHandler('mmaNotifications', function(notification) {
            if ($mmUtil.isTrueOrOne(notification.notif)) {
                $mmaNotifications.isPluginEnabledForSite(notification.site).then(function() {
                    $mmaNotifications.invalidateNotificationsList().finally(function() {
                        $state.go('redirect', {siteid: notification.site, state: 'site.notifications'});
                    });
                });
                return true;
            }
        });
    }
}]);

angular.module('mm.addons.participants', [])
.constant('mmaParticipantsListLimit', 50)
.constant('mmaParticipantsPriority', 600)
.config(["$stateProvider", "$mmCoursesDelegateProvider", "$mmContentLinksDelegateProvider", "mmaParticipantsPriority", function($stateProvider, $mmCoursesDelegateProvider, $mmContentLinksDelegateProvider, mmaParticipantsPriority) {
    $stateProvider
        .state('site.participants', {
            url: '/participants',
            views: {
                'site': {
                    controller: 'mmaParticipantsListCtrl',
                    templateUrl: 'addons/participants/templates/list.html'
                }
            },
            params: {
                course: null
            }
        });
    $mmCoursesDelegateProvider.registerNavHandler('mmaParticipants', '$mmaParticipantsHandlers.coursesNavHandler',
                mmaParticipantsPriority);
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaParticipants', '$mmaParticipantsHandlers.linksHandler');
}]);

angular.module('mm.addons.pushnotifications', [])
.constant('mmaPushNotificationsComponent', 'mmaPushNotifications')
.run(["$mmaPushNotifications", "$ionicPlatform", "$rootScope", "$mmEvents", "$mmLocalNotifications", "mmCoreEventLogin", "mmaPushNotificationsComponent", "mmCoreEventSiteDeleted", function($mmaPushNotifications, $ionicPlatform, $rootScope, $mmEvents, $mmLocalNotifications, mmCoreEventLogin,
            mmaPushNotificationsComponent, mmCoreEventSiteDeleted) {
    $ionicPlatform.ready(function() {
        $mmaPushNotifications.registerDevice();
    });
    $rootScope.$on('$cordovaPushV5:notificationReceived', function(e, notification) {
        $mmaPushNotifications.onMessageReceived(notification);
    });
    $mmEvents.on(mmCoreEventLogin, function() {
        $mmaPushNotifications.registerDeviceOnMoodle();
    });
    $mmEvents.on(mmCoreEventSiteDeleted, function(site) {
        $mmaPushNotifications.unregisterDeviceOnMoodle(site);
    });
    $mmLocalNotifications.registerClick(mmaPushNotificationsComponent, $mmaPushNotifications.notificationClicked);
}]);

angular.module('mm.addons.remotestyles', [])
.constant('mmaRemoteStylesComponent', 'mmaRemoteStyles')
.config(["$mmInitDelegateProvider", "mmInitDelegateMaxAddonPriority", function($mmInitDelegateProvider, mmInitDelegateMaxAddonPriority) {
    $mmInitDelegateProvider.registerProcess('mmaRemoteStylesCurrent',
                '$mmaRemoteStyles._preloadCurrentSite', mmInitDelegateMaxAddonPriority + 250, true);
    $mmInitDelegateProvider.registerProcess('mmaRemoteStylesPreload', '$mmaRemoteStyles._preloadSites');
}])
.run(["$mmEvents", "mmCoreEventLogin", "mmCoreEventLogout", "mmCoreEventSiteAdded", "mmCoreEventSiteUpdated", "$mmaRemoteStyles", "$mmSite", "mmCoreEventSiteDeleted", function($mmEvents, mmCoreEventLogin, mmCoreEventLogout, mmCoreEventSiteAdded, mmCoreEventSiteUpdated, $mmaRemoteStyles,
            $mmSite, mmCoreEventSiteDeleted) {
    $mmEvents.on(mmCoreEventSiteAdded, function(siteId) {
        $mmaRemoteStyles.addSite(siteId);
    });
    $mmEvents.on(mmCoreEventSiteUpdated, function(siteId) {
        if (siteId === $mmSite.getId()) {
            $mmaRemoteStyles.load(siteId);
        }
    });
    $mmEvents.on(mmCoreEventLogin, $mmaRemoteStyles.enable);
    $mmEvents.on(mmCoreEventLogout, $mmaRemoteStyles.clear);
    $mmEvents.on(mmCoreEventSiteDeleted, function(site) {
        $mmaRemoteStyles.removeSite(site.id);
    });
}]);

angular.module('mm.addons.mod_assign', ['mm.core'])
.constant('mmaModAssignComponent', 'mmaModAssign')
.constant('mmaModAssignSubmissionComponent', 'mmaModAssignSubmission')
.constant('mmaModAssignSubmissionStatusNew', 'new')
.constant('mmaModAssignSubmissionStatusReopened', 'reopened')
.constant('mmaModAssignSubmissionStatusDraft', 'draft')
.constant('mmaModAssignSubmissionStatusSubmitted', 'submitted')
.constant('mmaModAssignAttemptReopenMethodNone', 'none')
.constant('mmaModAssignUnlimitedAttempts', -1)
.constant('mmaModAssignGradingStatusGraded', 'graded')
.constant('mmaModAssignGradingStatusNotGraded', 'notgraded')
.constant('mmaModMarkingWorkflowStateReleased', 'released')
.constant('mmaModAssignSubmissionInvalidatedEvent', 'mma_mod_assign_submission_invalidated')
.constant('mmaModAssignSubmissionSavedEvent', 'mma_mod_assign_submission_saved')
.constant('mmaModAssignSubmittedForGradingEvent', 'mma_mod_assign_submitted_for_grading')
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_assign', {
        url: '/mod_assign',
        params: {
            module: null,
            courseid: null
        },
        views: {
            'site': {
                controller: 'mmaModAssignIndexCtrl',
                templateUrl: 'addons/mod/assign/templates/index.html'
            }
        }
    })
    .state('site.mod_assign-description', {
        url: '/mod_assign-description',
        params: {
            assignid: null,
            description: null,
            files: null
        },
        views: {
            'site': {
                controller: 'mmaModAssignDescriptionCtrl',
                templateUrl: 'addons/mod/assign/templates/description.html'
            }
        }
    })
    .state('site.mod_assign-submission-list', {
        url: '/mod_assign-submission-list',
        params: {
            moduleid: null,
            modulename: null,
            sid: null,
            courseid: null
        },
        views: {
            'site': {
                controller: 'mmaModAssignSubmissionListCtrl',
                templateUrl: 'addons/mod/assign/templates/submissionlist.html'
            }
        }
    })
    .state('site.mod_assign-submission', {
        url: '/mod_assign-submission',
        params: {
            submitid: null,
            blindid: null,
            moduleid: null,
            courseid: null
        },
        views: {
            'site': {
                controller: 'mmaModAssignSubmissionReviewCtrl',
                templateUrl: 'addons/mod/assign/templates/submissionreview.html'
            }
        }
    })
    .state('site.mod_assign-submission-edit', {
        url: '/mod_assign-submission-edit',
        params: {
            moduleid: null,
            courseid: null,
            userid: null,
            blindid: null
        },
        views: {
            'site': {
                controller: 'mmaModAssignEditCtrl',
                templateUrl: 'addons/mod/assign/templates/edit.html'
            }
        }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmContentLinksDelegateProvider", "$mmCoursePrefetchDelegateProvider", function($mmCourseDelegateProvider, $mmContentLinksDelegateProvider, $mmCoursePrefetchDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModAssign', 'assign', '$mmaModAssignHandlers.courseContent');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModAssign', '$mmaModAssignHandlers.linksHandler');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModAssign', 'assign', '$mmaModAssignPrefetchHandler');
}]);
angular.module('mm.addons.mod_book', ['mm.core'])
.constant('mmaModBookComponent', 'mmaModBook')
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_book', {
      url: '/mod_book',
      params: {
        module: null,
        courseid: null
      },
      views: {
        'site': {
          controller: 'mmaModBookIndexCtrl',
          templateUrl: 'addons/mod/book/templates/index.html'
        }
      }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmCoursePrefetchDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmCoursePrefetchDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModBook', 'book', '$mmaModBookHandlers.courseContentHandler');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModBook', 'book', '$mmaModBookPrefetchHandler');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModBook', '$mmaModBookHandlers.linksHandler');
}]);

angular.module('mm.addons.mod_chat', [])
.constant('mmaChatPollInterval', 4000)
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_chat', {
        url: '/mod_chat',
        params: {
            module: null,
            courseid: null
        },
        views: {
            'site': {
                controller: 'mmaModChatIndexCtrl',
                templateUrl: 'addons/mod/chat/templates/index.html'
            }
        }
    })
    .state('site.mod_chat-chat', {
        url: '/mod_chat-chat',
        params: {
            chatid: null,
            courseid: null,
            title: null
        },
        views: {
            'site': {
                controller: 'mmaModChatChatCtrl',
                templateUrl: 'addons/mod/chat/templates/chat.html'
            }
        }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModChat', 'chat', '$mmaModChatHandlers.courseContent');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModChat', '$mmaModChatHandlers.linksHandler');
}]);
angular.module('mm.addons.mod_choice', [])
.constant('mmaModChoiceResultsNot', 0)
.constant('mmaModChoiceResultsAfterAnswer', 1)
.constant('mmaModChoiceResultsAfterClose', 2)
.constant('mmaModChoiceResultsAlways', 3)
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_choice', {
        url: '/mod_choice',
        params: {
            module: null,
            courseid: null
        },
        views: {
            'site': {
                controller: 'mmaModChoiceIndexCtrl',
                templateUrl: 'addons/mod/choice/templates/index.html'
            }
        }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModChoice', 'choice', '$mmaModChoiceHandlers.courseContent');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModChoice', '$mmaModChoiceHandlers.linksHandler');
}]);

angular.module('mm.addons.mod_folder', ['mm.core'])
.constant('mmaModFolderComponent', 'mmaModFolder')
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_folder', {
      url: '/mod_folder',
      params: {
        module: null,
        courseid: null,
        sectionid: null,
        path: null
      },
      views: {
        'site': {
          controller: 'mmaModFolderIndexCtrl',
          templateUrl: 'addons/mod/folder/templates/index.html'
        }
      }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmCoursePrefetchDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmCoursePrefetchDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModFolder', 'folder', '$mmaModFolderHandlers.courseContent');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModFolder', 'folder', '$mmaModFolderPrefetchHandler');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModFolder', '$mmaModFolderHandlers.linksHandler');
}]);

angular.module('mm.addons.mod_forum', [])
.constant('mmaModForumDiscPerPage', 10)
.constant('mmaModForumComponent', 'mmaModForum')
.constant('mmaModForumNewDiscussionEvent', 'mma-mod_forum_new_discussion')
.constant('mmaModForumReplyDiscussionEvent', 'mma-mod_forum_reply_discussion')
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_forum', {
        url: '/mod_forum',
        params: {
            module: null,
            courseid: null
        },
        views: {
            'site': {
                controller: 'mmaModForumDiscussionsCtrl',
                templateUrl: 'addons/mod/forum/templates/discussions.html'
            }
        }
    })
    .state('site.mod_forum-discussion', {
        url: '/mod_forum-discussion',
        params: {
            discussionid: null,
            cid: null,
            forumid: null,
            cmid: null
        },
        views: {
            'site': {
                controller: 'mmaModForumDiscussionCtrl',
                templateUrl: 'addons/mod/forum/templates/discussion.html'
            }
        }
    })
    .state('site.mod_forum-newdiscussion', {
        url: '/mod_forum-newdiscussion',
        params: {
            cid: null,
            forumid: null,
            cmid: null
        },
        views: {
            'site': {
                controller: 'mmaModForumNewDiscussionCtrl',
                templateUrl: 'addons/mod/forum/templates/newdiscussion.html'
            }
        }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModForum', 'forum', '$mmaModForumHandlers.courseContent');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModForum', '$mmaModForumHandlers.linksHandler');
}]);

angular.module('mm.addons.mod_glossary', ['mm.core'])
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_glossary', {
      url: '/mod_glossary',
      params: {
        module: null,
        courseid: null
      },
      views: {
        'site': {
          controller: 'mmaModGlossaryIndexCtrl',
          templateUrl: 'addons/mod/glossary/templates/index.html'
        }
      }
    })
    .state('site.mod_glossary-entry', {
      url: '/mod_glossary-entry',
      params: {
        cid: null,
        entry: null,
        entryid: null
      },
      views: {
        'site': {
          controller: 'mmaModGlossaryEntryCtrl',
          templateUrl: 'addons/mod/glossary/templates/entry.html'
        }
      }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModGlossary', 'glossary', '$mmaModGlossaryHandlers.courseContent');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModGlossary', '$mmaModGlossaryHandlers.linksHandler');
}]);

angular.module('mm.addons.mod_imscp', ['mm.core'])
.constant('mmaModImscpComponent', 'mmaModImscp')
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_imscp', {
      url: '/mod_imscp',
      params: {
        module: null,
        courseid: null
      },
      views: {
        'site': {
          controller: 'mmaModImscpIndexCtrl',
          templateUrl: 'addons/mod/imscp/templates/index.html'
        }
      }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmCoursePrefetchDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmCoursePrefetchDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModImscp', 'imscp', '$mmaModImscpHandlers.courseContent');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModImscp', 'imscp', '$mmaModImscpPrefetchHandler');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModImscp', '$mmaModImscpHandlers.linksHandler');
}]);

angular.module('mm.addons.mod_label', ['mm.core'])
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_label', {
        url: '/mod_label',
        params: {
            description: null
        },
        views: {
            'site': {
                templateUrl: 'addons/mod/label/templates/index.html',
                controller: 'mmaModLabelIndexCtrl'
            }
        }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModLabel', 'label', '$mmaModLabelHandlers.courseContent');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModLabel', '$mmaModLabelHandlers.linksHandler');
}]);

angular.module('mm.addons.mod_lti', [])
.constant('mmaModLtiComponent', 'mmaModLti')
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_lti', {
        url: '/mod_lti',
        params: {
            module: null,
            courseid: null
        },
        views: {
            'site': {
                controller: 'mmaModLtiIndexCtrl',
                templateUrl: 'addons/mod/lti/templates/index.html'
            }
        }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModLti', 'lti', '$mmaModLtiHandlers.courseContent');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModLti', '$mmaModLtiHandlers.linksHandler');
}]);

angular.module('mm.addons.mod_page', ['mm.core'])
.constant('mmaModPageComponent', 'mmaModPage')
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_page', {
      url: '/mod_page',
      params: {
        module: null,
        courseid: null
      },
      views: {
        'site': {
          controller: 'mmaModPageIndexCtrl',
          templateUrl: 'addons/mod/page/templates/index.html'
        }
      }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmCoursePrefetchDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmCoursePrefetchDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModPage', 'page', '$mmaModPageHandlers.courseContent');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModPage', 'page', '$mmaModPagePrefetchHandler');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModPage', '$mmaModPageHandlers.linksHandler');
}]);
//--->somosapp
angular.module('mm.addons.mod_estudo', ['mm.core'])
.constant('mmaModEstudoComponent', 'mmaModEstudo')
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_estudo', {
      url: '/mod_estudo',
      params: {
        module: null,
        courseid: null
      },
      views: {
        'site': {
          controller: 'mmaModEstudoIndexCtrl',
          templateUrl: 'addons/mod/estudo/templates/index.html'
        }
      }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmCoursePrefetchDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmCoursePrefetchDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModEstudo', 'estudo', '$mmaModEstudoHandlers.courseContent');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModEstudo', 'estudo', '$mmaModEstudoPrefetchHandler');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModEstudo', '$mmaModEstudoHandlers.linksHandler');
}]);

angular.module('mm.addons.mod_webaula', ['mm.core'])
.constant('mmaModWebaulaComponent', 'mmaModWebaula')
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_webaula', {
      url: '/mod_webaula',
      params: {
        module: null,
        courseid: null
      },
      views: {
        'site': {
          controller: 'mmaModWebaulaIndexCtrl',
          templateUrl: 'addons/mod/webaula/templates/index.html'
        }
      }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmCoursePrefetchDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmCoursePrefetchDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModWebaula', 'webaula', '$mmaModWebaulaHandlers.courseContent');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModWebaula', 'webaula', '$mmaModWebaulaPrefetchHandler');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModWebaula', '$mmaModWebaulaHandlers.linksHandler');
}]);

angular.module('mm.addons.mod_textos', ['mm.core'])
.constant('mmaModTextosComponent', 'mmaModTextos')
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_textos', {
      url: '/mod_textos',
      params: {
        module: null,
        courseid: null
      },
      views: {
        'site': {
          controller: 'mmaModTextosIndexCtrl',
          templateUrl: 'addons/mod/textos/templates/index.html'
        }
      }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmCoursePrefetchDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmCoursePrefetchDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModTextos', 'textos', '$mmaModTextosHandlers.courseContent');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModTextos', 'textos', '$mmaModTextosPrefetchHandler');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModTextos', '$mmaModTextosHandlers.linksHandler');
}]);

angular.module('mm.addons.mod_proposta', ['mm.core'])
.constant('mmaModPropostaComponent', 'mmaModProposta')
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_proposta', {
      url: '/mod_proposta',
      params: {
        module: null,
        courseid: null
      },
      views: {
        'site': {
          controller: 'mmaModPropostaIndexCtrl',
          templateUrl: 'addons/mod/proposta/templates/index.html'
        }
      }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmCoursePrefetchDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmCoursePrefetchDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModProposta', 'proposta', '$mmaModPropostaHandlers.courseContent');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModProposta', 'proposta', '$mmaModPropostaPrefetchHandler');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModProposta', '$mmaModPropostaHandlers.linksHandler');
}]);


angular.module('mm.addons.mod_saiba', ['mm.core'])
.constant('mmaModSaibaComponent', 'mmaModSaiba')
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_saiba', {
      url: '/mod_saiba',
      params: {
        module: null,
        courseid: null
      },
      views: {
        'site': {
          controller: 'mmaModSaibaIndexCtrl',
          templateUrl: 'addons/mod/saiba/templates/index.html'
        }
      }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmCoursePrefetchDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmCoursePrefetchDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModSaiba', 'saiba', '$mmaModSaibaHandlers.courseContent');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModSaiba', 'saiba', '$mmaModSaibaPrefetchHandler');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModSaiba', '$mmaModSaibaHandlers.linksHandler');
}]);


angular.module('mm.addons.mod_pense', ['mm.core'])
.constant('mmaModPenseComponent', 'mmaModPense')
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_pense', {
      url: '/mod_pense',
      params: {
        module: null,
        courseid: null
      },
      views: {
        'site': {
          controller: 'mmaModPenseIndexCtrl',
          templateUrl: 'addons/mod/pense/templates/index.html'
        }
      }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmCoursePrefetchDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmCoursePrefetchDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModPense', 'pense', '$mmaModPenseHandlers.courseContent');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModPense', 'pense', '$mmaModPensePrefetchHandler');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModPense', '$mmaModPenseHandlers.linksHandler');
}]);


//-->fim
angular.module('mm.addons.mod_quiz', ['mm.core'])
.constant('mmaModQuizComponent', 'mmaModQuiz')
.constant('mmaModQuizCheckChangesInterval', 5000)
.constant('mmaModQuizComponent', 'mmaModQuiz')
.constant('mmaModQuizEventAttemptFinished', 'mma_mod_quiz_attempt_finished')
.constant('mmaModQuizEventAutomSynced', 'mma_mod_quiz_autom_synced')
.constant('mmaModQuizSyncTime', 300000)
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_quiz', {
      url: '/mod_quiz',
      params: {
        module: null,
        courseid: null
      },
      views: {
        'site': {
          controller: 'mmaModQuizIndexCtrl',
          templateUrl: 'addons/mod/quiz/templates/index.html'
        }
      }
    })
    .state('site.mod_quiz-attempt', {
      url: '/mod_quiz-attempt',
      params: {
        courseid: null,
        quizid: null,
        attemptid: null
      },
      views: {
        'site': {
          controller: 'mmaModQuizAttemptCtrl',
          templateUrl: 'addons/mod/quiz/templates/attempt.html'
        }
      }
    })
    .state('site.mod_quiz-player', {
      url: '/mod_quiz-player',
      params: {
        courseid: null,
        quizid: null,
        moduleurl: null
      },
      views: {
        'site': {
          controller: 'mmaModQuizPlayerCtrl',
          templateUrl: 'addons/mod/quiz/templates/player.html'
        }
      }
    })
    .state('site.mod_quiz-review', {
      url: '/mod_quiz-review',
      params: {
        courseid: null,
        quizid: null,
        attemptid: null,
        page: -1
      },
      views: {
        'site': {
          controller: 'mmaModQuizReviewCtrl',
          templateUrl: 'addons/mod/quiz/templates/review.html'
        }
      }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmContentLinksDelegateProvider", "$mmCoursePrefetchDelegateProvider", function($mmCourseDelegateProvider, $mmContentLinksDelegateProvider, $mmCoursePrefetchDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModQuiz', 'quiz', '$mmaModQuizHandlers.courseContentHandler');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModQuiz', '$mmaModQuizHandlers.linksHandler');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModQuiz', 'quiz', '$mmaModQuizPrefetchHandler');
}])
.run(["$timeout", "$mmaModQuizSync", "$mmApp", "$mmEvents", "$mmSite", "mmCoreEventLogin", function($timeout, $mmaModQuizSync, $mmApp, $mmEvents, $mmSite, mmCoreEventLogin) {
    var lastExecution = 0,
        executing = false,
        allSitesCalled = false;
    function syncQuizzes(allSites) {
        var now = new Date().getTime();
        if (!allSites && !$mmSite.isLoggedIn()) {
            return;
        }
        if (now - 5000 > lastExecution && (!executing || now - 300000 > lastExecution)) {
            lastExecution = new Date().getTime();
            executing = true;
            $timeout(function() {
                $mmaModQuizSync.syncAllQuizzes(allSites ? undefined : $mmSite.getId()).finally(function() {
                    executing = false;
                });
            }, 1000);
        }
    }
    $mmApp.ready().then(function() {
        document.addEventListener('online', function() {
            syncQuizzes(false);
        }, false);
        window.addEventListener('online', function() {
            syncQuizzes(false);
        }, false);
        if (!$mmSite.isLoggedIn()) {
            allSitesCalled = true;
            if ($mmApp.isOnline()) {
                syncQuizzes(true);
            }
        }
    });
    $mmEvents.on(mmCoreEventLogin, function() {
        var allSites = false;
        if (!allSitesCalled) {
            allSitesCalled = true;
            allSites = true;
        }
        if ($mmApp.isOnline()) {
            syncQuizzes(allSites);
        }
    });
}]);

angular.module('mm.addons.mod_resource', ['mm.core'])
.constant('mmaModResourceComponent', 'mmaModResource')
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_resource', {
      url: '/mod_resource',
      params: {
        module: null,
        courseid: null
      },
      views: {
        'site': {
          controller: 'mmaModResourceIndexCtrl',
          templateUrl: 'addons/mod/resource/templates/index.html'
        }
      }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmCoursePrefetchDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmCoursePrefetchDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModResource', 'resource', '$mmaModResourceHandlers.courseContent');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModResource', 'resource', '$mmaModResourcePrefetchHandler');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModResource', '$mmaModResourceHandlers.linksHandler');
}]);

angular.module('mm.addons.mod_scorm', ['mm.core'])
.constant('mmaModScormComponent', 'mmaModScorm')
.constant('mmaModScormEventLaunchNextSco', 'mma_mod_scorm_launch_next_sco')
.constant('mmaModScormEventLaunchPrevSco', 'mma_mod_scorm_launch_prev_sco')
.constant('mmaModScormEventUpdateToc', 'mma_mod_scorm_update_toc')
.constant('mmaModScormEventGoOffline', 'mma_mod_scorm_go_offline')
.constant('mmaModScormEventAutomSynced', 'mma_mod_scorm_autom_synced')
.constant('mmaModScormSyncTime', 300000)
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_scorm', {
      url: '/mod_scorm',
      params: {
        module: null,
        courseid: null
      },
      views: {
        'site': {
          controller: 'mmaModScormIndexCtrl',
          templateUrl: 'addons/mod/scorm/templates/index.html'
        }
      }
    })
    .state('site.mod_scorm-player', {
      url: '/mod_scorm-player',
      params: {
        scorm: null,
        mode: null,
        newAttempt: false,
        organizationId: null,
        scoId: null
      },
      views: {
        'site': {
          controller: 'mmaModScormPlayerCtrl',
          templateUrl: 'addons/mod/scorm/templates/player.html'
        }
      }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmCoursePrefetchDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmCoursePrefetchDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModScorm', 'scorm', '$mmaModScormHandlers.courseContent');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModScorm', 'scorm', '$mmaModScormPrefetchHandler');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModScorm', '$mmaModScormHandlers.linksHandler');
}])
.run(["$timeout", "$mmaModScormSync", "$mmApp", "$mmEvents", "$mmSite", "mmCoreEventLogin", function($timeout, $mmaModScormSync, $mmApp, $mmEvents, $mmSite, mmCoreEventLogin) {
    var lastExecution = 0,
        executing = false,
        allSitesCalled = false;
    function syncScorms(allSites) {
        var now = new Date().getTime();
        if (!allSites && !$mmSite.isLoggedIn()) {
            return;
        }
        if (now - 5000 > lastExecution && (!executing || now - 300000 > lastExecution)) {
            lastExecution = new Date().getTime();
            executing = true;
            $timeout(function() {
                $mmaModScormSync.syncAllScorms(allSites ? undefined : $mmSite.getId()).finally(function() {
                    executing = false;
                });
            }, 1000);
        }
    }
    $mmApp.ready().then(function() {
        document.addEventListener('online', function() {
            syncScorms(false);
        }, false);
        window.addEventListener('online', function() {
            syncScorms(false);
        }, false);
        if (!$mmSite.isLoggedIn()) {
            allSitesCalled = true;
            if ($mmApp.isOnline()) {
                syncScorms(true);
            }
        }
    });
    $mmEvents.on(mmCoreEventLogin, function() {
        var allSites = false;
        if (!allSitesCalled) {
            allSitesCalled = true;
            allSites = true;
        }
        if ($mmApp.isOnline()) {
            syncScorms(allSites);
        }
    });
}]);

angular.module('mm.addons.mod_survey', [])
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_survey', {
        url: '/mod_survey',
        params: {
            module: null,
            courseid: null
        },
        views: {
            'site': {
                controller: 'mmaModSurveyIndexCtrl',
                templateUrl: 'addons/mod/survey/templates/index.html'
            }
        }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModSurvey', 'survey', '$mmaModSurveyHandlers.courseContent');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModSurvey', '$mmaModSurveyHandlers.linksHandler');
}]);

angular.module('mm.addons.mod_url', ['mm.core'])
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_url', {
      url: '/mod_url',
      params: {
        module: null,
        courseid: null
      },
      views: {
        'site': {
          controller: 'mmaModUrlIndexCtrl',
          templateUrl: 'addons/mod/url/templates/index.html'
        }
      }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModUrl', 'url', '$mmaModUrlHandlers.courseContentHandler');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModUrl', '$mmaModUrlHandlers.linksHandler');
}]);

angular.module('mm.addons.mod_wiki', [])
.constant('mmaModWikiSubwikiPagesLoaded', 'mma_mod_wiki_subwiki_pages_loaded')
.constant('mmaModWikiComponent', 'mmaModWiki')
.constant('mmaModWikiRenewLockTimeout', 30)
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_wiki', {
        url: '/mod_wiki',
        params: {
            module: null,
            moduleid: null,
            courseid: null,
            pageid: null,
            pagetitle: null,
            wikiid: null,
            subwikiid: null,
            action: null
        },
        views: {
            'site': {
                controller: 'mmaModWikiIndexCtrl',
                templateUrl: 'addons/mod/wiki/templates/index.html'
            }
        }
    })
    .state('site.mod_wiki-edit', {
        url: '/mod_wiki-edit',
        params: {
            module: null,
            courseid: null,
            pageid: null,
            pagetitle: null,
            subwikiid: null,
            section: null
        },
        views: {
            'site': {
                controller: 'mmaModWikiEditCtrl',
                templateUrl: 'addons/mod/wiki/templates/edit.html'
            }
        }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmContentLinksDelegateProvider", "$mmCoursePrefetchDelegateProvider", function($mmCourseDelegateProvider, $mmContentLinksDelegateProvider, $mmCoursePrefetchDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModWiki', 'wiki', '$mmaModWikiHandlers.courseContent');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModWiki', '$mmaModWikiHandlers.linksHandler');
    $mmCoursePrefetchDelegateProvider.registerPrefetchHandler('mmaModWiki', 'wiki', '$mmaModWikiPrefetchHandler');
}])
.run(["$mmEvents", "mmCoreEventLogout", "$mmaModWiki", function($mmEvents, mmCoreEventLogout, $mmaModWiki) {
    $mmEvents.on(mmCoreEventLogout, $mmaModWiki.clearSubwikiList);
}]);
angular.module('mm.addons.qbehaviour_adaptive', ['mm.core'])
.config(["$mmQuestionBehaviourDelegateProvider", function($mmQuestionBehaviourDelegateProvider) {
    $mmQuestionBehaviourDelegateProvider.registerHandler('mmaQbehaviourAdaptive', 'adaptive', '$mmaQbehaviourAdaptiveHandler');
}]);

angular.module('mm.addons.qbehaviour_adaptivenopenalty', ['mm.core'])
.config(["$mmQuestionBehaviourDelegateProvider", function($mmQuestionBehaviourDelegateProvider) {
    $mmQuestionBehaviourDelegateProvider.registerHandler('mmaQbehaviourAdaptiveNoPenalty', 'adaptivenopenalty',
    			'$mmaQbehaviourAdaptiveNoPenaltyHandler');
}]);

angular.module('mm.addons.qbehaviour_deferredcbm', ['mm.core'])
.config(["$mmQuestionBehaviourDelegateProvider", function($mmQuestionBehaviourDelegateProvider) {
    $mmQuestionBehaviourDelegateProvider.registerHandler('mmaQbehaviourDeferredCBM', 'deferredcbm',
    			'$mmaQbehaviourDeferredCBMHandler');
}]);

angular.module('mm.addons.qbehaviour_deferredfeedback', ['mm.core'])
.config(["$mmQuestionBehaviourDelegateProvider", function($mmQuestionBehaviourDelegateProvider) {
    $mmQuestionBehaviourDelegateProvider.registerHandler('mmaQbehaviourDeferredFeedback', 'deferredfeedback',
    			'$mmaQbehaviourDeferredFeedbackHandler');
}]);

angular.module('mm.addons.qbehaviour_immediatecbm', ['mm.core'])
.config(["$mmQuestionBehaviourDelegateProvider", function($mmQuestionBehaviourDelegateProvider) {
    $mmQuestionBehaviourDelegateProvider.registerHandler('mmaQbehaviourImmediateCBM', 'immediatecbm',
    			'$mmaQbehaviourImmediateCBMHandler');
}]);

angular.module('mm.addons.qbehaviour_immediatefeedback', ['mm.core'])
.config(["$mmQuestionBehaviourDelegateProvider", function($mmQuestionBehaviourDelegateProvider) {
    $mmQuestionBehaviourDelegateProvider.registerHandler('mmaQbehaviourImmediateFeedback', 'immediatefeedback',
    			'$mmaQbehaviourImmediateFeedbackHandler');
}]);

angular.module('mm.addons.qbehaviour_informationitem', ['mm.core'])
.config(["$mmQuestionBehaviourDelegateProvider", function($mmQuestionBehaviourDelegateProvider) {
    $mmQuestionBehaviourDelegateProvider.registerHandler('mmaQbehaviourInformationItem', 'informationitem',
    			'$mmaQbehaviourInformationItemHandler');
}]);

angular.module('mm.addons.qbehaviour_interactive', ['mm.core'])
.config(["$mmQuestionBehaviourDelegateProvider", function($mmQuestionBehaviourDelegateProvider) {
    $mmQuestionBehaviourDelegateProvider.registerHandler('mmaQbehaviourInteractive', 'interactive',
    			'$mmaQbehaviourInteractiveHandler');
}]);

angular.module('mm.addons.qbehaviour_interactivecountback', ['mm.core'])
.config(["$mmQuestionBehaviourDelegateProvider", function($mmQuestionBehaviourDelegateProvider) {
    $mmQuestionBehaviourDelegateProvider.registerHandler('mmaQbehaviourInteractiveCountback', 'interactivecountback',
    			'$mmaQbehaviourInteractiveCountbackHandler');
}]);

angular.module('mm.addons.qbehaviour_manualgraded', ['mm.core'])
.config(["$mmQuestionBehaviourDelegateProvider", function($mmQuestionBehaviourDelegateProvider) {
    $mmQuestionBehaviourDelegateProvider.registerHandler('mmaQbehaviourManualGraded', 'manualgraded',
    			'$mmaQbehaviourManualGradedHandler');
}]);

angular.module('mm.addons.qtype_calculated', ['mm.core'])
.config(["$mmQuestionDelegateProvider", function($mmQuestionDelegateProvider) {
    $mmQuestionDelegateProvider.registerHandler('mmaQtypeCalculated', 'qtype_calculated', '$mmaQtypeCalculatedHandler');
}]);

angular.module('mm.addons.qtype_calculatedmulti', ['mm.core'])
.config(["$mmQuestionDelegateProvider", function($mmQuestionDelegateProvider) {
    $mmQuestionDelegateProvider.registerHandler('mmaQtypeCalculatedMulti', 'qtype_calculatedmulti',
    												'$mmaQtypeCalculatedMultiHandler');
}]);

angular.module('mm.addons.qtype_calculatedsimple', ['mm.core'])
.config(["$mmQuestionDelegateProvider", function($mmQuestionDelegateProvider) {
    $mmQuestionDelegateProvider.registerHandler('mmaQtypeCalculatedSimple', 'qtype_calculatedsimple',
    												'$mmaQtypeCalculatedSimpleHandler');
}]);

angular.module('mm.addons.qtype_ddimageortext', ['mm.core'])
.config(["$mmQuestionDelegateProvider", function($mmQuestionDelegateProvider) {
    $mmQuestionDelegateProvider.registerHandler('mmaQtypeDdimageortext', 'qtype_ddimageortext', '$mmaQtypeDdimageortextHandler');
}]);

angular.module('mm.addons.qtype_ddmarker', ['mm.core'])
.config(["$mmQuestionDelegateProvider", function($mmQuestionDelegateProvider) {
    $mmQuestionDelegateProvider.registerHandler('mmaQtypeDdmarker', 'qtype_ddmarker', '$mmaQtypeDdmarkerHandler');
}]);

angular.module('mm.addons.qtype_ddwtos', ['mm.core'])
.config(["$mmQuestionDelegateProvider", function($mmQuestionDelegateProvider) {
    $mmQuestionDelegateProvider.registerHandler('mmaQtypeDdwtos', 'qtype_ddwtos', '$mmaQtypeDdwtosHandler');
}]);

angular.module('mm.addons.qtype_description', ['mm.core'])
.config(["$mmQuestionDelegateProvider", function($mmQuestionDelegateProvider) {
    $mmQuestionDelegateProvider.registerHandler('mmaQtypeDescription', 'qtype_description', '$mmaQtypeDescriptionHandler');
}]);

angular.module('mm.addons.qtype_essay', ['mm.core'])
.config(["$mmQuestionDelegateProvider", function($mmQuestionDelegateProvider) {
    $mmQuestionDelegateProvider.registerHandler('mmaQtypeEssay', 'qtype_essay', '$mmaQtypeEssayHandler');
}]);

angular.module('mm.addons.qtype_gapselect', ['mm.core'])
.config(["$mmQuestionDelegateProvider", function($mmQuestionDelegateProvider) {
    $mmQuestionDelegateProvider.registerHandler('mmaQtypeGapSelect', 'qtype_gapselect', '$mmaQtypeGapSelectHandler');
}]);

angular.module('mm.addons.qtype_match', ['mm.core'])
.config(["$mmQuestionDelegateProvider", function($mmQuestionDelegateProvider) {
    $mmQuestionDelegateProvider.registerHandler('mmaQtypeMatch', 'qtype_match', '$mmaQtypeMatchHandler');
}]);

angular.module('mm.addons.qtype_multianswer', ['mm.core'])
.config(["$mmQuestionDelegateProvider", function($mmQuestionDelegateProvider) {
    $mmQuestionDelegateProvider.registerHandler('mmaQtypeMultianswer', 'qtype_multianswer', '$mmaQtypeMultianswerHandler');
}]);

angular.module('mm.addons.qtype_multichoice', ['mm.core'])
.config(["$mmQuestionDelegateProvider", function($mmQuestionDelegateProvider) {
    $mmQuestionDelegateProvider.registerHandler('mmaQtypeMultichoice', 'qtype_multichoice', '$mmaQtypeMultichoiceHandler');
}]);

angular.module('mm.addons.qtype_numerical', ['mm.core'])
.config(["$mmQuestionDelegateProvider", function($mmQuestionDelegateProvider) {
    $mmQuestionDelegateProvider.registerHandler('mmaQtypeNumerical', 'qtype_numerical', '$mmaQtypeNumericalHandler');
}]);

angular.module('mm.addons.qtype_randomsamatch', ['mm.core'])
.config(["$mmQuestionDelegateProvider", function($mmQuestionDelegateProvider) {
    $mmQuestionDelegateProvider.registerHandler('mmaQtypeRandomSaMatch', 'qtype_randomsamatch', '$mmaQtypeRandomSaMatchHandler');
}]);

angular.module('mm.addons.qtype_shortanswer', ['mm.core'])
.config(["$mmQuestionDelegateProvider", function($mmQuestionDelegateProvider) {
    $mmQuestionDelegateProvider.registerHandler('mmaQtypeShortAnswer', 'qtype_shortanswer', '$mmaQtypeShortAnswerHandler');
}]);

angular.module('mm.addons.qtype_truefalse', ['mm.core'])
.config(["$mmQuestionDelegateProvider", function($mmQuestionDelegateProvider) {
    $mmQuestionDelegateProvider.registerHandler('mmaQtypeTruefalse', 'qtype_truefalse', '$mmaQtypeTruefalseHandler');
}]);

angular.module('mm.addons.calendar')
.controller('mmaCalendarEventCtrl', ["$scope", "$log", "$stateParams", "$mmaCalendar", "$mmUtil", "$mmCourse", "$mmCourses", "$mmLocalNotifications", function($scope, $log, $stateParams, $mmaCalendar, $mmUtil, $mmCourse, $mmCourses,
        $mmLocalNotifications) {
    $log = $log.getInstance('mmaCalendarEventCtrl');
    var eventid = parseInt($stateParams.id);
    function fetchEvent(refresh) {
        return $mmaCalendar.getEvent(eventid, refresh).then(function(e) {
            $mmaCalendar.formatEventData(e);
            $scope.event = e;
            $scope.title = e.name;
            if (e.moduleicon) {
                $mmCourse.translateModuleName(e.modulename).then(function(name) {
                    if (name.indexOf('mm.core.mod') === -1) {
                        e.modulename = name;
                    }
                });
            }
            if (e.courseid > 1) {
                $mmCourses.getUserCourse(e.courseid, true).then(function(course) {
                    $scope.coursename = course.fullname;
                });
            }
        }, function(error) {
            if (error) {
                $mmUtil.showErrorModal(error);
            } else {
                $mmUtil.showErrorModal('mma.calendar.errorloadevent', true);
            }
        });
    }
    fetchEvent().finally(function() {
        $scope.eventLoaded = true;
    });
    $scope.refreshEvent = function() {
        fetchEvent(true).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.notificationsEnabled = $mmLocalNotifications.isAvailable();
    if ($scope.notificationsEnabled) {
        $mmaCalendar.getEventNotificationTime(eventid).then(function(notificationtime) {
            $scope.notification = {
                time: String(notificationtime)
            };
        });
        $scope.updateNotificationTime = function() {
            var time = parseInt($scope.notification.time);
            if (!isNaN(time) && $scope.event && $scope.event.id) {
                $mmaCalendar.updateNotificationTime($scope.event, time);
            }
        };
    }
}]);

angular.module('mm.addons.calendar')
.controller('mmaCalendarListCtrl', ["$scope", "$stateParams", "$log", "$state", "$mmaCalendar", "$mmUtil", "$ionicHistory", "mmaCalendarDaysInterval", function($scope, $stateParams, $log, $state, $mmaCalendar, $mmUtil, $ionicHistory,
        mmaCalendarDaysInterval) {
    $log = $log.getInstance('mmaCalendarListCtrl');
    var daysLoaded,
        emptyEventsTimes;
    if ($stateParams.eventid) {
        $ionicHistory.clearHistory();
        $state.go('site.calendar-event', {id: $stateParams.eventid});
    }
    function initVars() {
        daysLoaded = 0;
        emptyEventsTimes = 0;
        $scope.events = [];
    }
    function fetchEvents(refresh) {
        if (refresh) {
            initVars();
        }
        $scope.canLoadMore = false;
        return $mmaCalendar.getEvents(daysLoaded, mmaCalendarDaysInterval, refresh).then(function(events) {
            daysLoaded += mmaCalendarDaysInterval;
            if (events.length === 0) {
                emptyEventsTimes++;
                if (emptyEventsTimes > 5) {
                    $scope.canLoadMore = false;
                    $scope.eventsLoaded = true;
                } else {
                    return fetchEvents();
                }
            } else {
                angular.forEach(events, $mmaCalendar.formatEventData);
                if (refresh) {
                    $scope.events = events;
                } else {
                    $scope.events = $scope.events.concat(events);
                }
                $scope.count = $scope.events.length;
                $scope.eventsLoaded = true;
                $scope.canLoadMore = true;
                $mmaCalendar.scheduleEventsNotifications(events);
            }
        }, function(error) {
            if (error) {
                $mmUtil.showErrorModal(error);
            } else {
                $mmUtil.showErrorModal('mma.calendar.errorloadevents', true);
            }
            $scope.eventsLoaded = true;
        });
    }
    initVars();
    $scope.count = 0;
    fetchEvents();
    $scope.loadMoreEvents = function() {
        fetchEvents().finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
    $scope.refreshEvents = function() {
        $mmaCalendar.invalidateEventsList().finally(function() {
            fetchEvents(true).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        });
    };
}]);

angular.module('mm.addons.calendar')
.constant('mmaCalendarEventsStore', 'calendar_events')
.config(["$mmSitesFactoryProvider", "mmaCalendarEventsStore", function($mmSitesFactoryProvider, mmaCalendarEventsStore) {
    var stores = [
        {
            name: mmaCalendarEventsStore,
            keyPath: 'id',
            indexes: [
                {
                    name: 'notificationtime'
                }
            ]
        }
    ];
    $mmSitesFactoryProvider.registerStores(stores);
}])
.factory('$mmaCalendar', ["$log", "$q", "$mmSite", "$mmUtil", "$mmCourses", "$mmGroups", "$mmCourse", "$mmLocalNotifications", "$mmSitesManager", "mmCoreSecondsDay", "mmaCalendarDaysInterval", "mmaCalendarEventsStore", "mmaCalendarDefaultNotifTime", "mmaCalendarComponent", function($log, $q, $mmSite, $mmUtil, $mmCourses, $mmGroups, $mmCourse, $mmLocalNotifications,
        $mmSitesManager, mmCoreSecondsDay, mmaCalendarDaysInterval, mmaCalendarEventsStore, mmaCalendarDefaultNotifTime,
        mmaCalendarComponent) {
    $log = $log.getInstance('$mmaCalendar');
    var self = {},
        calendarImgPath = 'addons/calendar/img/',
        eventicons = {
            'course': calendarImgPath + 'courseevent.svg',
            'group': calendarImgPath + 'groupevent.svg',
            'site': calendarImgPath + 'siteevent.svg',
            'user': calendarImgPath + 'userevent.svg'
        };
        function getEventsListCacheKey(daysToStart, daysInterval) {
        return 'mmaCalendar:events:' + daysToStart + ':' + daysInterval;
    }
        function getEventCacheKey(id) {
        return 'mmaCalendar:events:' + id;
    }
        function getEventsCommonCacheKey() {
        return 'mmaCalendar:events:';
    }
        function storeEventsInLocalDB(events, siteid) {
        siteid = siteid || $mmSite.getId();
        return $mmSitesManager.getSite(siteid).then(function(site) {
            var promises = [],
                db = site.getDb();
            angular.forEach(events, function(event) {
                var promise = self.getEventNotificationTime(event.id, siteid).then(function(time) {
                    event.notificationtime = time;
                    return db.insert(mmaCalendarEventsStore, event);
                });
                promises.push(promise);
            });
            return $q.all(promises);
        });
    }
        self.formatEventData = function(e) {
        var icon = self.getEventIcon(e.eventtype);
        if (icon === '') {
            icon = $mmCourse.getModuleIconSrc(e.modulename);
            e.moduleicon = icon;
        }
        e.icon = icon;
    };
        self.getEvent = function(id, refresh) {
        var presets = {},
            data = {
                "options[userevents]": 0,
                "options[siteevents]": 0,
                "events[eventids][0]": id
            };
        presets.cacheKey = getEventCacheKey(id);
        if (refresh) {
            presets.getFromCache = false;
        }
        return $mmSite.read('core_calendar_get_calendar_events', data, presets).then(function(response) {
            var e = response.events[0];
            if (e) {
                return e;
            } else {
                return self.getEventFromLocalDb(id);
            }
        }, function() {
            return self.getEventFromLocalDb(id);
        });
    };
        self.getEventFromLocalDb = function(id) {
        if (!$mmSite.isLoggedIn()) {
            return $q.reject();
        }
        return $mmSite.getDb().get(mmaCalendarEventsStore, id);
    };
        self.getEventIcon = function(type) {
        return eventicons[type] || '';
    };
        self.getEventNotificationTime = function(id, siteid) {
        siteid = siteid || $mmSite.getId();
        return $mmSitesManager.getSite(siteid).then(function(site) {
            var db = site.getDb();
            return db.get(mmaCalendarEventsStore, id).then(function(e) {
                if (typeof e.notificationtime != 'undefined') {
                    return e.notificationtime;
                }
                return mmaCalendarDefaultNotifTime;
            }, function(err) {
                return mmaCalendarDefaultNotifTime;
            });
        });
    };
        self.getEvents = function(daysToStart, daysInterval, refresh, siteid) {
        daysToStart = daysToStart || 0;
        daysInterval = daysInterval || mmaCalendarDaysInterval;
        siteid = siteid || $mmSite.getId();
         var now = $mmUtil.timestamp(),
            start = now + (mmCoreSecondsDay * daysToStart),
            end = start + (mmCoreSecondsDay * daysInterval);
        var data = {
            "options[userevents]": 1,
            "options[siteevents]": 1,
            "options[timestart]": start,
            "options[timeend]": end
        };
        return $mmCourses.getUserCourses(false, siteid).then(function(courses) {
            courses.push({id: 1});
            angular.forEach(courses, function(course, index) {
                data["events[courseids][" + index + "]"] = course.id;
            });
            return $mmGroups.getUserGroups(courses, refresh, siteid).then(function(groups) {
                angular.forEach(groups, function(group, index) {
                    data["events[groupids][" + index + "]"] = group.id;
                });
                return $mmSitesManager.getSite(siteid).then(function(site) {
                    var preSets = {
                        cacheKey: getEventsListCacheKey(daysToStart, daysInterval),
                        getCacheUsingCacheKey: true
                    };
                    return site.read('core_calendar_get_calendar_events', data, preSets).then(function(response) {
                        storeEventsInLocalDB(response.events, siteid);
                        return response.events;
                    });
                });
            });
        });
    };
        self.invalidateEventsList = function() {
        var p1 = $mmCourses.invalidateUserCourses(),
            p2 = $mmSite.invalidateWsCacheForKeyStartingWith(getEventsCommonCacheKey());
        return $q.all([p1, p2]);
    };
        self.isAvailable = function() {
        return $mmSite.wsAvailable('core_calendar_get_calendar_events');
    };
        self.scheduleAllSitesEventsNotifications = function() {
        if ($mmLocalNotifications.isAvailable()) {
            return $mmSitesManager.getSitesIds().then(function(siteids) {
                var promises = [];
                angular.forEach(siteids, function(siteid) {
                    var promise = self.getEvents(undefined, undefined, false, siteid).then(function(events) {
                        return self.scheduleEventsNotifications(events, siteid);
                    });
                    promises.push(promise);
                });
                return $q.all(promises);
            });
        } else {
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }
    };
        self.scheduleEventNotification = function(event, time, siteid) {
        siteid = siteid || $mmSite.getId();
        if ($mmLocalNotifications.isAvailable()) {
            if (time === 0) {
                return $mmLocalNotifications.cancel(event.id, mmaCalendarComponent, siteid);
            } else {
                var timeend = (event.timestart + event.timeduration) * 1000;
                if (timeend <= new Date().getTime()) {
                    return $q.when();
                }
                var dateTriggered = new Date((event.timestart - (time * 60)) * 1000),
                    startDate = new Date(event.timestart * 1000),
                    notification = {
                        id: event.id,
                        title: event.name,
                        text: startDate.toLocaleString(),
                        at: dateTriggered,
                        data: {
                            eventid: event.id,
                            siteid: siteid
                        }
                    };
                return $mmLocalNotifications.schedule(notification, mmaCalendarComponent, siteid);
            }
        } else {
            return $q.when();
        }
    };
        self.scheduleEventsNotifications = function(events, siteid) {
        siteid = siteid || $mmSite.getId();
        var promises = [];
        if ($mmLocalNotifications.isAvailable()) {
            angular.forEach(events, function(e) {
                var promise = self.getEventNotificationTime(e.id, siteid).then(function(time) {
                    return self.scheduleEventNotification(e, time, siteid);
                });
                promises.push(promise);
            });
        }
        return $q.all(promises);
    };
        self.updateNotificationTime = function(event, time) {
        if (!$mmSite.isLoggedIn()) {
            return $q.reject();
        }
        var db = $mmSite.getDb();
        event.notificationtime = time;
        return db.insert(mmaCalendarEventsStore, event).then(function() {
            return self.scheduleEventNotification(event, time);
        });
    };
    return self;
}]);

angular.module('mm.addons.calendar')
.factory('$mmaCalendarHandlers', ["$log", "$mmaCalendar", function($log, $mmaCalendar) {
    $log = $log.getInstance('$mmaCalendarHandlers');
    var self = {};
        self.sideMenuNav = function() {
        var self = {};
                self.isEnabled = function() {
            return $mmaCalendar.isAvailable();
        };
                self.getController = function() {
                        return function($scope) {
                $scope.icon = 'ion-calendar';
                $scope.title = 'mma.calendar.calendarevents';
                $scope.state = 'site.calendar';
                $scope.class = 'mma-calendar-handler';
            };
        };
        return self;
    };
    return self;
}]);

angular.module('mm.addons.competency')
.controller('mmaCompetenciesListCtrl', ["$scope", "$mmaCompetency", "$mmUtil", "$stateParams", "$state", "$ionicPlatform", "$q", "$translate", "$mmaCompetencyHelper", function($scope, $mmaCompetency, $mmUtil, $stateParams, $state, $ionicPlatform, $q,
    $translate, $mmaCompetencyHelper) {
    var planId = parseInt($stateParams.pid) || false,
        courseId = parseInt($stateParams.cid) || false,
        competencyId = parseInt($stateParams.compid),
        userId = parseInt($stateParams.uid) || false;
    function fetchCompetencies() {
        var promise;
        if (planId) {
            promise = $mmaCompetency.getLearningPlan(planId);
        } else if (courseId){
            promise = $mmaCompetency.getCourseCompetencies(courseId);
        } else {
            promise = $q.reject();
        }
        return promise.then(function(response) {
            if (response.competencycount <= 0) {
                return $q.reject($translate.instant('mma.competency.errornocompetenciesfound'));
            }
            if (planId) {
                $scope.title = response.plan.name;
                $scope.id = response.plan.id;
                $scope.idname = 'planid';
                userId = response.plan.userid;
            } else {
                $scope.title = $translate.instant('mma.competency.coursecompetencies');
                $scope.id = response.courseid;
                $scope.idname = 'courseid';
            }
            $scope.competencies = response.competencies;
        }).catch(function(message) {
            if (message) {
                $mmUtil.showErrorModal(message);
            } else {
                $mmUtil.showErrorModal('Error getting competencies data.');
            }
            return $q.reject();
        });
    }
    $scope.gotoCompetency = function(competencyId) {
        if (planId) {
            $state.go('site.competency', {planid: planId, competencyid: competencyId});
        } else {
            $state.go('site.competency', {courseid: courseId, competencyid: competencyId, userid: userId});
        }
    };
    function refreshAllData() {
        var promise;
        if (planId) {
            promise = $mmaCompetency.invalidateLearningPlan(planId);
        } else {
            promise = $mmaCompetency.invalidateCourseCompetencies(courseId);
        }
        return promise.finally(function() {
            return fetchCompetencies();
        });
    }
    function autoloadCompetency() {
        if (competencyId) {
            if ($ionicPlatform.isTablet()) {
                angular.forEach($scope.competencies, function(competency, index) {
                    if (competency.competency.id == competencyId) {
                        $scope.competencyToLoad = index + 1;
                    }
                });
            } else {
                $scope.gotoCompetency(competencyId);
            }
        }
    }
    fetchCompetencies().finally(function() {
        autoloadCompetency();
        $scope.competenciesLoaded = true;
    });
    $scope.refreshCompetencies = function() {
        refreshAllData().finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
}]);

angular.module('mm.addons.competency')
.controller('mmaCompetencyCtrl', ["$scope", "$stateParams", "$mmaCompetency", "$mmUtil", "$translate", "$q", "$mmSite", "mmaCompetencyReviewStatusIdle", "mmaCompetencyReviewStatusInReview", "mmaCompetencyReviewStatusWaitingForReview", function($scope, $stateParams, $mmaCompetency, $mmUtil, $translate, $q, $mmSite,
    mmaCompetencyReviewStatusIdle, mmaCompetencyReviewStatusInReview, mmaCompetencyReviewStatusWaitingForReview) {
    var competencyId = parseInt($stateParams.competencyid),
        planId = parseInt($stateParams.planid) || false,
        courseId = parseInt($stateParams.courseid) || false,
        userId = parseInt($stateParams.userid) || false,
        planStatus = false;
    function fetchCompetency() {
        if (planId) {
            planStatus = false;
            promise = $mmaCompetency.getCompetencyInPlan(planId, competencyId);
        } else if (courseId){
            promise = $mmaCompetency.getCompetencyInCourse(courseId, competencyId, userId);
        } else {
            promise = $q.reject();
        }
        return promise.then(function(competency) {
            if (planId) {
                planStatus = competency.plan.status;
                competency.usercompetencysummary.usercompetency.statusname = getStatusName(competency.usercompetencysummary.usercompetency.status);
            } else {
                competency.usercompetencysummary.usercompetency = competency.usercompetencysummary.usercompetencycourse;
                $scope.coursemodules = competency.coursemodules;
            }
            if (competency.usercompetencysummary.user.id != $mmSite.getUserId()) {
                competency.usercompetencysummary.user.profileimageurl = competency.usercompetencysummary.user.profileimageurl
                    || true;
                $scope.user = competency.usercompetencysummary.user;
            }
            angular.forEach(competency.usercompetencysummary.evidence, function(evidence) {
                if (evidence.descidentifier) {
                    evidence.description = $translate.instant('mma.competency.' + evidence.descidentifier, {a: evidence.desca});
                }
            });
            $scope.competency = competency.usercompetencysummary;
        }, function(message) {
            if (message) {
                $mmUtil.showErrorModal(message);
            } else {
                $mmUtil.showErrorModal('Error getting competency data.');
            }
            return $q.reject();
        });
    }
    function getStatusName(status) {
        var statusTranslateName;
        switch (status) {
            case mmaCompetencyReviewStatusIdle:
                statusTranslateName = 'idle';
                break;
            case mmaCompetencyReviewStatusInReview:
                statusTranslateName = 'inreview';
                break;
            case mmaCompetencyReviewStatusWaitingForReview:
                statusTranslateName = 'waitingforreview';
                break;
            default:
                return status;
        }
        return $translate.instant('mma.competency.usercompetencystatus_' + statusTranslateName);
    }
    function refreshAllData() {
        var promise;
        if (planId) {
            promise =  $mmaCompetency.invalidateCompetencyInPlan(planId, competencyId);
        } else {
            promise = $mmaCompetency.invalidateCompetencyInCourse(courseId, competencyId);
        }
        return promise.finally(function() {
            return fetchCompetency();
        });
    }
    fetchCompetency().then(function() {
        if (planId) {
            $mmaCompetency.logCompetencyInPlanView(planId, competencyId, planStatus, userId);
        } else {
            $mmaCompetency.logCompetencyInCourseView(courseId, competencyId, userId);
        }
    }).finally(function() {
        $scope.competencyLoaded = true;
    });
    $scope.refreshCompetency = function() {
        refreshAllData().finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
}]);

angular.module('mm.addons.competency')
.controller('mmaCompetencySummaryCtrl', ["$scope", "$stateParams", "$mmaCompetency", "$mmUtil", "$q", function($scope, $stateParams, $mmaCompetency, $mmUtil, $q) {
    var competencyId = parseInt($stateParams.competencyid);
    function fetchCompetency() {
        return $mmaCompetency.getCompetencySummary(competencyId).then(function(competency) {
            $scope.competency = competency;
        }, function(message) {
            if (message) {
                $mmUtil.showErrorModal(message);
            } else {
                $mmUtil.showErrorModal('Error getting competency summary data.');
            }
            return $q.reject();
        });
    }
    function refreshAllData() {
        return $mmaCompetency.invalidateCompetencySummary(competencyId).finally(function() {
            return fetchCompetency();
        });
    }
    fetchCompetency().then(function() {
        $mmaCompetency.logCompetencyView(competencyId);
    }).finally(function() {
        $scope.competencyLoaded = true;
    });
    $scope.refreshCompetency = function() {
        refreshAllData().finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
}]);

angular.module('mm.addons.competency')
.controller('mmaCourseCompetenciesCtrl', ["$scope", "$stateParams", "$mmaCompetency", "$mmUtil", "$state", "$ionicPlatform", "$q", "$mmaCompetencyHelper", function($scope, $stateParams, $mmaCompetency, $mmUtil, $state, $ionicPlatform, $q,
    $mmaCompetencyHelper) {
    var courseId = parseInt($stateParams.courseid);
        userId = parseInt($stateParams.userid) || false;
    function fetchCourseCompetencies() {
        return $mmaCompetency.getCourseCompetencies(courseId).then(function(competencies) {
            $scope.competencies = competencies;
            $mmaCompetencyHelper.getProfile(userId).then(function(user) {
                $scope.user = user;
            });
        }, function(message) {
            if (message) {
                $mmUtil.showErrorModal(message);
            } else {
                $mmUtil.showErrorModal('Error getting course competencies data.');
            }
            return $q.reject();
        });
    }
    $scope.gotoCompetency = function(competencyId) {
        if ($ionicPlatform.isTablet()) {
            $state.go('site.competencies', {cid: courseId, compid: competencyId, uid: userId});
        } else {
            $state.go('site.competency', {courseid: courseId, competencyid: competencyId, userid: userId});
        }
    };
    function refreshAllData() {
        return $mmaCompetency.invalidateCourseCompetencies(courseId).finally(function() {
            return fetchCourseCompetencies();
        });
    }
    fetchCourseCompetencies().finally(function() {
        $scope.competenciesLoaded = true;
    });
    $scope.refreshCourseCompetencies = function() {
        refreshAllData().finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
}]);

angular.module('mm.addons.competency')
.controller('mmaLearningPlanCtrl', ["$scope", "$stateParams", "$mmaCompetency", "$mmUtil", "$translate", "mmaCompetencyStatusDraft", "mmaCompetencyStatusActive", "mmaCompetencyStatusComplete", "mmaCompetencyStatusWaitingForReview", "mmaCompetencyStatusInReview", "$state", "$ionicPlatform", "$q", "$mmaCompetencyHelper", function($scope, $stateParams, $mmaCompetency, $mmUtil, $translate,
    mmaCompetencyStatusDraft, mmaCompetencyStatusActive, mmaCompetencyStatusComplete, mmaCompetencyStatusWaitingForReview,
    mmaCompetencyStatusInReview, $state, $ionicPlatform, $q, $mmaCompetencyHelper) {
    var planId = parseInt($stateParams.id);
    function fetchLearningPlan() {
        return $mmaCompetency.getLearningPlan(planId).then(function(plan) {
            var statusName, userId;
            plan.plan.statusname = getStatusName(plan.plan.status);
            userId = plan.plan.userid;
            $mmaCompetencyHelper.getProfile(userId).then(function(user) {
                $scope.user = user;
            });
            $scope.plan = plan;
        }, function(message) {
            if (message) {
                $mmUtil.showErrorModal(message);
            } else {
                $mmUtil.showErrorModal('Error getting learning plan data.');
            }
            return $q.reject();
        });
    }
    $scope.gotoCompetency = function(competencyId) {
        if ($ionicPlatform.isTablet()) {
            $state.go('site.competencies', {pid: planId, compid: competencyId});
        } else {
            $state.go('site.competency', {planid: planId, competencyid: competencyId});
        }
    };
    function getStatusName(status) {
        var statusTranslateName;
        switch (status) {
            case mmaCompetencyStatusDraft:
                statusTranslateName = 'draft';
                break;
            case mmaCompetencyStatusInReview:
                statusTranslateName = 'inreview';
                break;
            case mmaCompetencyStatusWaitingForReview:
                statusTranslateName = 'waitingforreview';
                break;
            case mmaCompetencyStatusActive:
                statusTranslateName = 'active';
                break;
            case mmaCompetencyStatusComplete:
                statusTranslateName = 'complete';
                break;
            default:
                return status;
        }
        return $translate.instant('mma.competency.planstatus' + statusTranslateName);
    }
    function refreshAllData() {
        return $mmaCompetency.invalidateLearningPlan(planId).finally(function() {
            return fetchLearningPlan();
        });
    }
    fetchLearningPlan().finally(function() {
        $scope.planLoaded = true;
    });
    $scope.refreshLearningPlan = function() {
        refreshAllData().finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
}]);

angular.module('mm.addons.competency')
.controller('mmaLearningPlansListCtrl', ["$scope", "$mmaCompetency", "$mmUtil", "$q", "$stateParams", "$mmaCompetencyHelper", function($scope, $mmaCompetency, $mmUtil, $q, $stateParams, $mmaCompetencyHelper) {
    var userId = parseInt($stateParams.userid) || false;
    function fetchLearningPlans() {
        return $mmaCompetency.getLearningPlans(userId).then(function(plans) {
            $scope.plans = plans;
        }).catch(function(message) {
            if (message) {
                $mmUtil.showErrorModal(message);
            } else {
                $mmUtil.showErrorModal('Error getting learning plans data.');
            }
            return $q.reject();
        });
    }
    function refreshAllData() {
        return $mmaCompetency.invalidateLearningPlans(userId).finally(function() {
            return fetchLearningPlans();
        });
    }
    fetchLearningPlans().finally(function() {
        $scope.plansLoaded = true;
    });
    $scope.refreshLearningPlans = function() {
        refreshAllData().finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
}]);

angular.module('mm.addons.competency')
.factory('$mmaCompetency', ["$log", "$mmSite", "$mmSitesManager", "$q", "mmaCompetencyStatusComplete", function($log, $mmSite, $mmSitesManager, $q, mmaCompetencyStatusComplete) {
    $log = $log.getInstance('$mmaCompetency');
    var self = {};
        function getLearningPlansCacheKey(userId) {
        return 'mmaCompetency:userplans:' + userId;
    }
        function getLearningPlanCacheKey(planId) {
        return 'mmaCompetency:learningplan:' + planId;
    }
        function getCompetencyInPlanCacheKey(planId, competencyId) {
        return 'mmaCompetency:plancompetency:' + planId + ':' + competencyId;
    }
        function getCompetencyInCourseCacheKey(courseId, competencyId, userId) {
        return 'mmaCompetency:coursecompetency:' + userId + ':' + courseId + ':' + competencyId;
    }
        function getCompetencySummaryCacheKey(competencyId, userId) {
        return 'mmaCompetency:competencysummary:' + userId + ':' + competencyId;
    }
        function getCourseCompetenciesCacheKey(courseId) {
        return 'mmaCompetency:coursecompetencies:' + courseId;
    }
        self.isPluginEnabled = function(siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            if (site.wsAvailable('core_competency_list_course_competencies') && site.wsAvailable('tool_lp_data_for_plans_page')) {
                return self.getLearningPlans(false, siteId);
            }
            return false;
        });
    };
        self.isPluginForCourseEnabled = function(courseId, siteId) {
        if (!$mmSite.isLoggedIn()) {
            return $q.when(false);
        }
        if (!self.isPluginEnabled(siteId)) {
            return $q.when(false);
        }
        return self.getCourseCompetencies(courseId, siteId).then(function(competencies) {
            if (competencies.competencies.length <= 0) {
                return false;
            }
            return competencies;
        }).catch(function() {
            return $q.when(false);
        });
    };
        self.getLearningPlans = function(userId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            userId = userId || site.getUserId();
            $log.debug('Get plans for user ' + userId);
            var params = {
                    userid: userId
                },
                preSets = {
                    cacheKey: getLearningPlansCacheKey(userId)
                };
            return site.read('tool_lp_data_for_plans_page', params, preSets).then(function(response) {
                if (response.plans) {
                    return response.plans;
                }
                return $q.reject();
            });
        });
    };
        self.getLearningPlan = function(planId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            $log.debug('Get plan ' + planId);
            var params = {
                    planid: planId
                },
                preSets = {
                    cacheKey: getLearningPlanCacheKey(planId)
                };
            return site.read('tool_lp_data_for_plan_page', params, preSets).then(function(response) {
                if (response.plan) {
                    return response;
                }
                return $q.reject();
            });
        });
    };
        self.getCompetencyInPlan = function(planId, competencyId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            $log.debug('Get competency ' + competencyId + ' in plan ' + planId);
            var params = {
                    planid: planId,
                    competencyid: competencyId
                },
                preSets = {
                    cacheKey: getCompetencyInPlanCacheKey(planId, competencyId)
                };
            return site.read('tool_lp_data_for_user_competency_summary_in_plan', params, preSets).then(function(response) {
                if (response.usercompetencysummary) {
                    return response;
                }
                return $q.reject();
            });
        });
    };
        self.getCompetencyInCourse = function(courseId, competencyId, userId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            userId = userId || site.getUserId();
            $log.debug('Get competency ' + competencyId + ' in course ' + courseId);
            var params = {
                    courseid: courseId,
                    competencyid: competencyId,
                    userid: userId
                },
                preSets = {
                    cacheKey: getCompetencyInCourseCacheKey(courseId, competencyId, userId)
                };
            return site.read('tool_lp_data_for_user_competency_summary_in_course', params, preSets).then(function(response) {
                if (response.usercompetencysummary) {
                    return response;
                }
                return $q.reject();
            });
        });
    };
        self.getCompetencySummary = function(competencyId, userId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            userId = userId || site.getUserId();
            $log.debug('Get competency ' + competencyId + ' summary for user' + userId);
            var params = {
                    competencyid: competencyId,
                    userid: userId
                },
                preSets = {
                    cacheKey: getCompetencySummaryCacheKey(competencyId, userId)
                };
            return site.read('tool_lp_data_for_user_competency_summary', params, preSets).then(function(response) {
                if (response.competency) {
                    return response.competency;
                }
                return $q.reject();
            });
        });
    };
        self.getCourseCompetencies = function(courseId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            $log.debug('Get course competencies for course ' + courseId);
            var params = {
                    courseid: courseId
                },
                preSets = {
                    cacheKey: getCourseCompetenciesCacheKey(courseId)
                };
            return site.read('tool_lp_data_for_course_competencies_page', params, preSets).then(function(response) {
                if (response.competencies) {
                    return response;
                }
                return $q.reject();
            });
        });
    };
        self.invalidateLearningPlans = function(userId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            userId = userId || site.getUserId();
            return site.invalidateWsCacheForKey(getLearningPlansCacheKey(userId));
        });
    };
        self.invalidateLearningPlan = function(planId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.invalidateWsCacheForKey(getLearningPlanCacheKey(planId));
        });
    };
        self.invalidateCompetencyInPlan = function(planId, competencyId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.invalidateWsCacheForKey(getCompetencyInPlanCacheKey(planId, competencyId));
        });
    };
        self.invalidateCompetencyInCourse = function(courseId, competencyId, userId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            userId = userId || site.getUserId();
            return site.invalidateWsCacheForKey(getCompetencyInCourseCacheKey(courseId, competencyId, userId));
        });
    };
        self.invalidateCompetencySummary = function(competencyId, userId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            userId = userId || site.getUserId();
            return site.invalidateWsCacheForKey(getCompetencySummaryCacheKey(competencyId, userId));
        });
    };
        self.invalidateCourseCompetencies = function(courseId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.invalidateWsCacheForKey(getCourseCompetenciesCacheKey(courseId));
        });
    };
        self.logCompetencyInPlanView = function(planId, competencyId, planStatus, userId, siteId) {
        if (planId && competencyId) {
            siteId = siteId || $mmSite.getId();
            return $mmSitesManager.getSite(siteId).then(function(site) {
                userId = userId || site.getUserId();
                var params = {
                    planid: planId,
                    competencyid: competencyId,
                    userid: userId
                };
                if (planStatus == mmaCompetencyStatusComplete) {
                    return site.write('core_competency_user_competency_plan_viewed', params);
                } else {
                    return site.write('core_competency_user_competency_viewed_in_plan', params);
                }
            });
        }
        return $q.reject();
    };
        self.logCompetencyInCourseView = function(courseId, competencyId, userId, siteId) {
        if (courseId && competencyId) {
            siteId = siteId || $mmSite.getId();
            return $mmSitesManager.getSite(siteId).then(function(site) {
                userId = userId || site.getUserId();
                var params = {
                    courseid: courseId,
                    competencyid: competencyId,
                    userid: userId
                };
                return site.write('core_competency_user_competency_viewed_in_course', params);
            });
        }
        return $q.reject();
    };
        self.logCompetencyView = function(competencyId, siteId) {
        if (competencyId) {
            siteId = siteId || $mmSite.getId();
            return $mmSitesManager.getSite(siteId).then(function(site) {
                var params = {
                    id: competencyId,
                };
                return site.write('core_competency_competency_viewed', params);
            });
        }
        return $q.reject();
    };
    return self;
}]);

angular.module('mm.addons.competency')
.factory('$mmaCompetencyHandlers', ["$log", "$mmaCompetency", "mmCoursesAccessMethods", function($log, $mmaCompetency, mmCoursesAccessMethods) {
    $log = $log.getInstance('$mmaCompetencyHandlers');
    var self = {},
        coursesNavEnabledCache = {},
        participantsNavEnabledCache = {},
        usersNavEnabledCache = {};
        self.clearCoursesNavCache = function() {
        coursesNavEnabledCache = {};
    };
        self.clearUsersNavCache = function() {
        participantsNavEnabledCache = {};
        usersNavEnabledCache = {};
    };
        self.sideMenuNav = function() {
        var self = {};
                self.isEnabled = function(siteId) {
            return $mmaCompetency.isPluginEnabled(siteId).then(function(enabled) {
                if (!enabled) {
                    return false;
                }
                return $mmaCompetency.getLearningPlans(false, siteId).then(function(plans) {
                    return plans.length > 0;
                });
            });
        };
                self.getController = function() {
                        return function($scope) {
                $scope.icon = 'ion-map';
                $scope.title = 'mma.competency.mylearningplans';
                $scope.state = 'site.learningplans';
                $scope.class = 'mma-competency-handler';
            };
        };
        return self;
    };
        self.coursesNav = function() {
        var self = {};
                self.isEnabled = function() {
            return $mmaCompetency.isPluginEnabled();
        };
                self.isEnabledForCourse = function(courseId, accessData) {
            if (accessData && accessData.type == mmCoursesAccessMethods.guest) {
                return false;
            }
            if (typeof coursesNavEnabledCache[courseId] != 'undefined') {
                return coursesNavEnabledCache[courseId];
            }
            return $mmaCompetency.isPluginForCourseEnabled(courseId).then(function(competencies) {
                var enabled = competencies ? !competencies.canmanagecoursecompetencies : false;
                participantsNavEnabledCache[courseId] = !!competencies;
                coursesNavEnabledCache[courseId] = enabled;
                return enabled;
            });
        };
                self.getController = function(courseId) {
                        return function($scope, $state) {
                $scope.icon = 'ion-ribbon-a';
                $scope.title = 'mma.competency.competencies';
                $scope.class = 'mma-competency-handler';
                $scope.action = function($event, course) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $state.go('site.coursecompetencies', {
                        courseid: course.id
                    });
                };
            };
        };
        return self;
    };
        self.learningPlan = function() {
        var self = {};
                self.isEnabled = function() {
            return $mmaCompetency.isPluginEnabled();
        };
                self.isEnabledForUser = function(user, courseId) {
            if (courseId) {
                if (typeof participantsNavEnabledCache[courseId] != 'undefined') {
                    return participantsNavEnabledCache[courseId];
                }
                return $mmaCompetency.isPluginForCourseEnabled(courseId).then(function(competencies) {
                    var enabled = !!competencies;
                    coursesNavEnabledCache[courseId] = competencies ? !competencies.canmanagecoursecompetencies : false;
                    participantsNavEnabledCache[courseId] = enabled;
                    return enabled;
                });
            } else {
                if (typeof usersNavEnabledCache[user.id] != 'undefined') {
                    return usersNavEnabledCache[user.id];
                }
                return $mmaCompetency.getLearningPlans(user.id).then(function(plans) {
                    var enabled = plans.length > 0;
                    usersNavEnabledCache[user.id] = enabled;
                    return enabled;
                });
            }
        };
                self.getController = function(user, courseId) {
                        return function($scope, $state) {
                $scope.class = 'mma-competency-handler';
                if (courseId) {
                    $scope.icon = 'ion-ribbon-a';
                    $scope.title = 'mma.competency.competencies';
                    $scope.action = function($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        $state.go('site.coursecompetencies', {
                            courseid: courseId,
                            userid: user.id
                        });
                    };
                } else {
                    $scope.icon = 'ion-map';
                    $scope.title = 'mma.competency.learningplans';
                    $scope.action = function($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        $state.go('site.learningplans', {
                            userid: user.id
                        });
                    };
                }
            };
        };
        return self;
    };
    return self;
}])
.run(["$mmaCompetencyHandlers", "$mmEvents", "mmCoreEventLogout", "mmCoursesEventMyCoursesRefreshed", "mmUserEventProfileRefreshed", function($mmaCompetencyHandlers, $mmEvents, mmCoreEventLogout, mmCoursesEventMyCoursesRefreshed, mmUserEventProfileRefreshed) {
    $mmEvents.on(mmCoreEventLogout, function() {
        $mmaCompetencyHandlers.clearCoursesNavCache();
        $mmaCompetencyHandlers.clearUsersNavCache();
    });
    $mmEvents.on(mmCoursesEventMyCoursesRefreshed, $mmaCompetencyHandlers.clearCoursesNavCache);
    $mmEvents.on(mmUserEventProfileRefreshed, $mmaCompetencyHandlers.clearUsersNavCache);
}]);

angular.module('mm.addons.competency')
.factory('$mmaCompetencyHelper', ["$mmUser", "$mmSite", "$log", "$q", function($mmUser, $mmSite, $log, $q) {
    $log = $log.getInstance('$mmaCompetencyHelper');
    var self = {};
        self.getProfile = function(userId) {
        if (!userId || userId == $mmSite.getUserId()) {
            return $q.when(false);
        }
        return $mmUser.getProfile(userId, undefined, true).then(function(user) {
            user.profileimageurl = user.profileimageurl || true;
            return user;
        });
    };
    return self;
}]);

angular.module('mm.addons.coursecompletion')
.controller('mmaCourseCompletionReportCtrl', ["$scope", "$stateParams", "$mmUtil", "$mmaCourseCompletion", "$mmSite", "$ionicPlatform", function($scope, $stateParams, $mmUtil, $mmaCourseCompletion, $mmSite,
            $ionicPlatform) {
    var course = $stateParams.course,
        userid = $stateParams.userid || $mmSite.getUserId();
    $scope.isTablet = $ionicPlatform.isTablet();
    function fetchCompletion() {
        return $mmaCourseCompletion.getCompletion(course.id, userid).then(function(completion) {
            completion.statusText = $mmaCourseCompletion.getCompletedStatusText(completion);
            $scope.completion = completion;
            $scope.showSelfComplete = $mmaCourseCompletion.isSelfCompletionAvailable() &&
                                        $mmaCourseCompletion.canMarkSelfCompleted(userid, completion);
        }).catch(function(message) {
            if (message) {
                $mmUtil.showErrorModal(message);
            } else {
                $mmUtil.showErrorModal('mma.coursecompletion.couldnotloadreport', true);
            }
        });
    }
    fetchCompletion().finally(function() {
        $scope.completionLoaded = true;
    });
    function refreshCompletion() {
        return $mmaCourseCompletion.invalidateCourseCompletion(course.id, userid).finally(function() {
            return fetchCompletion();
        });
    }
    $scope.refreshCompletion = function() {
        refreshCompletion().finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.completeCourse = function() {
        var modal = $mmUtil.showModalLoading('mm.core.sending', true);
        $mmaCourseCompletion.markCourseAsSelfCompleted(course.id).then(function() {
            return refreshCompletion();
        }).catch(function(message) {
            $mmUtil.showErrorModal(message);
        }).finally(function() {
            modal.dismiss();
        });
    };
}]);

angular.module('mm.addons.coursecompletion')
.factory('$mmaCourseCompletion', ["$mmSite", "$log", "$q", "$mmCourses", function($mmSite, $log, $q, $mmCourses) {
    $log = $log.getInstance('$mmaCourseCompletion');
    var self = {};
        self.canMarkSelfCompleted = function(userid, completion) {
        var selfCompletionActive = false,
            alreadyMarked = false;
        if ($mmSite.getUserId() != userid) {
            return false;
        }
        angular.forEach(completion.completions, function(criteria) {
            if (criteria.type === 1) {
                selfCompletionActive = true;
                alreadyMarked = criteria.complete;
            }
        });
        return selfCompletionActive && !alreadyMarked;
    };
        self.getCompletedStatusText = function(completion) {
        if (completion.completed) {
            return 'mma.coursecompletion.completed';
        } else {
            var hasStarted = false;
            angular.forEach(completion.completions, function(criteria) {
                if (criteria.timecompleted || criteria.complete) {
                    hasStarted = true;
                }
            });
            if (hasStarted) {
                return 'mma.coursecompletion.inprogress';
            } else {
                return 'mma.coursecompletion.notyetstarted';
            }
        }
    };
        self.getCompletion = function(courseid, userid) {
        userid = userid || $mmSite.getUserId();
        $log.debug('Get completion for course ' + courseid + ' and user ' + userid);
        var data = {
                courseid : courseid,
                userid: userid
            },
            preSets = {
                cacheKey: getCompletionCacheKey(courseid, userid)
            };
        return $mmSite.read('core_completion_get_course_completion_status', data, preSets).then(function(data) {
            if (data.completionstatus) {
                return data.completionstatus;
            }
            return $q.reject();
        });
    };
        function getCompletionCacheKey(courseid, userid) {
        return 'mmaCourseCompletion:view:' + courseid + ':' + userid;
    }
        self.invalidateCourseCompletion = function(courseid, userid) {
        userid = userid || $mmSite.getUserId();
        return $mmSite.invalidateWsCacheForKey(getCompletionCacheKey(courseid, userid));
    };
        self.isPluginViewEnabled = function() {
        if (!$mmSite.isLoggedIn()) {
            return false;
        } else if (!$mmSite.wsAvailable('core_completion_get_course_completion_status')) {
            return false;
        }
        return true;
    };
        self.isPluginViewEnabledForCourse = function(courseId) {
        if (!courseId) {
            return $q.reject();
        }
        return $mmCourses.getUserCourse(courseId, true).then(function(course) {
            if (course && typeof course.enablecompletion != 'undefined' && course.enablecompletion == 0) {
                return false;
            }
            return true;
        });
    };
        self.isPluginViewEnabledForUser = function(courseId, userId) {
        return self.getCompletion(courseId, userId).then(function() {
            return true;
        }).catch(function() {
            return false;
        });
    };
        self.isSelfCompletionAvailable = function() {
        return $mmSite.wsAvailable('core_completion_mark_course_self_completed');
    };
        self.markCourseAsSelfCompleted = function(courseid) {
        var params = {
            courseid: courseid
        };
        return $mmSite.write('core_completion_mark_course_self_completed', params).then(function(response) {
            if (!response.status) {
                return $q.reject();
            }
        });
    };
    return self;
}]);

angular.module('mm.addons.coursecompletion')
.factory('$mmaCourseCompletionHandlers', ["$mmaCourseCompletion", "$state", "mmCoursesAccessMethods", function($mmaCourseCompletion, $state, mmCoursesAccessMethods) {
    var self = {},
        viewCompletionEnabledCache = {},
        coursesNavEnabledCache = {};
        function getCacheKey(courseId, userId) {
        return courseId + '#' + userId;
    }
        self.clearViewCompletionCache = function(courseId, userId) {
        if (courseId && userId) {
            delete viewCompletionEnabledCache[getCacheKey(courseId, userId)];
        } else {
            viewCompletionEnabledCache = {};
        }
    };
        self.clearCoursesNavCache = function() {
        coursesNavEnabledCache = {};
    };
        self.viewCompletion = function() {
        var self = {};
                self.isEnabled = function() {
            return $mmaCourseCompletion.isPluginViewEnabled();
        };
                self.isEnabledForUser = function(user, courseId) {
            return $mmaCourseCompletion.isPluginViewEnabledForCourse(courseId).then(function() {
                var cacheKey = getCacheKey(courseId, user.id);
                if (typeof viewCompletionEnabledCache[cacheKey] != 'undefined') {
                    return viewCompletionEnabledCache[cacheKey];
                }
                return $mmaCourseCompletion.isPluginViewEnabledForUser(courseId, user.id).then(function(enabled) {
                    viewCompletionEnabledCache[cacheKey] = enabled;
                    return enabled;
                });
            });
        };
                self.getController = function(user, courseId) {
                        return function($scope) {
                $scope.title = 'mma.coursecompletion.viewcoursereport';
                $scope.class = 'mma-coursecompletion-user-handler';
                $scope.action = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $state.go('site.course-completion', {
                        userid: user.id,
                        course: {id: courseId}
                    });
                };
            };
        };
        return self;
    };
        self.coursesNav = function() {
        var self = {};
                self.isEnabled = function() {
            return $mmaCourseCompletion.isPluginViewEnabled();
        };
                self.isEnabledForCourse = function(courseId, accessData) {
            if (accessData && accessData.type == mmCoursesAccessMethods.guest) {
                return false;
            }
            return $mmaCourseCompletion.isPluginViewEnabledForCourse(courseId).then(function() {
                if (typeof coursesNavEnabledCache[courseId] != 'undefined') {
                    return coursesNavEnabledCache[courseId];
                }
                return $mmaCourseCompletion.isPluginViewEnabledForUser(courseId).then(function(enabled) {
                    coursesNavEnabledCache[courseId] = enabled;
                    return enabled;
                });
            });
        };
                self.getController = function(courseId) {
                        return function($scope, $state) {
                $scope.icon = 'ion-android-checkbox-outline';
                $scope.title = 'mma.coursecompletion.coursecompletion';
                $scope.class = 'mma-coursecompletion-mine-handler';
                $scope.action = function($event, course) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $state.go('site.course-completion', {
                        course: course
                    });
                };
            };
        };
        return self;
    };
    return self;
}])
.run(["$mmaCourseCompletionHandlers", "$mmEvents", "mmCoreEventLogout", "mmCoursesEventMyCoursesRefreshed", "mmUserEventProfileRefreshed", function($mmaCourseCompletionHandlers, $mmEvents, mmCoreEventLogout, mmCoursesEventMyCoursesRefreshed,
            mmUserEventProfileRefreshed) {
    $mmEvents.on(mmCoreEventLogout, function() {
        $mmaCourseCompletionHandlers.clearViewCompletionCache();
        $mmaCourseCompletionHandlers.clearCoursesNavCache();
    });
    $mmEvents.on(mmCoursesEventMyCoursesRefreshed, $mmaCourseCompletionHandlers.clearCoursesNavCache);
    $mmEvents.on(mmUserEventProfileRefreshed, function(data) {
        if (data) {
            $mmaCourseCompletionHandlers.clearViewCompletionCache(data.courseid, data.userid);
        }
    });
}]);

angular.module('mm.addons.files')
.controller('mmaFilesIndexController', ["$scope", "$mmaFiles", "$mmSite", "$mmUtil", "$mmApp", "$mmaFilesHelper", function($scope, $mmaFiles, $mmSite, $mmUtil, $mmApp, $mmaFilesHelper) {
    $scope.canAccessFiles = $mmaFiles.canAccessFiles;
    $scope.showPrivateFiles = function() {
        return $mmaFiles.canAccessFiles() && $mmSite.canAccessMyFiles();
    };
    $scope.showUpload = function() {
        return !$mmaFiles.canAccessFiles() && $mmSite.canAccessMyFiles() && $mmSite.canUploadFiles();
    };
    $scope.canDownload = $mmSite.canDownloadFiles;
    $scope.add = function() {
        $mmaFiles.versionCanUploadFiles().then(function(canUpload) {
            if (!canUpload) {
                $mmUtil.showModal('mm.core.notice', 'mma.files.erroruploadnotworking');
            } else if (!$mmApp.isOnline()) {
                $mmUtil.showErrorModal('mm.fileuploader.errormustbeonlinetoupload', true);
            } else {
                $mmaFilesHelper.selectAndUploadFile();
            }
        });
    };
}]);

angular.module('mm.addons.files')
.controller('mmaFilesListController', ["$q", "$scope", "$stateParams", "$mmaFiles", "$mmSite", "$translate", "$mmUtil", "$mmaFilesHelper", "$mmApp", "mmaFilesMyComponent", "mmaFilesSiteComponent", function($q, $scope, $stateParams, $mmaFiles, $mmSite, $translate, $mmUtil,
        $mmaFilesHelper, $mmApp, mmaFilesMyComponent, mmaFilesSiteComponent) {
    var path = $stateParams.path,
        root = $stateParams.root,
        promise;
    $scope.count = -1;
    $scope.component = root === 'my' ? mmaFilesMyComponent : mmaFilesSiteComponent;
    function fetchFiles(root, path) {
        if (!path) {
            if (root === 'site') {
                promise = $mmaFiles.getSiteFiles();
                $scope.title = $translate.instant('mma.files.sitefiles');
            } else if (root === 'my') {
                promise = $mmaFiles.getMyFiles();
                $scope.title = $translate.instant('mma.files.myprivatefiles');
            } else {
                promise = $q.reject();
            }
        } else {
            pathdata = JSON.parse(path);
            promise = $mmaFiles.getFiles(pathdata);
            $scope.title = $stateParams.title;
        }
        return promise.then(function(files) {
            $scope.files = files.entries;
            $scope.count = files.count;
        }).catch(function() {
            $mmUtil.showErrorModal('mma.files.couldnotloadfiles', true);
        });
    }
    function refreshFiles() {
        return $mmaFiles.invalidateDirectory(root, path).finally(function() {
            return fetchFiles(root, path);
        });
    }
    fetchFiles(root, path).finally(function() {
        $scope.filesLoaded = true;
    });
    $scope.refreshFiles = function() {
        refreshFiles().finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.showUpload = function() {
        return (root === 'my' && !path && $mmSite.canUploadFiles());
    };
    $scope.add = function() {
        $mmaFiles.versionCanUploadFiles().then(function(canUpload) {
            if (!canUpload) {
                $mmUtil.showModal('mm.core.notice', 'mma.files.erroruploadnotworking');
            } else if (!$mmApp.isOnline()) {
                $mmUtil.showErrorModal('mm.fileuploader.errormustbeonlinetoupload', true);
            } else {
                $mmaFilesHelper.selectAndUploadFile().then(function() {
                    $scope.filesLoaded = false;
                    refreshFiles().finally(function() {
                        $scope.filesLoaded = true;
                    });
                });
            }
        });
    };
}]);

angular.module('mm.addons.files')
.factory('$mmaFiles', ["$mmSite", "$mmFS", "$q", "$log", "$mmSitesManager", "md5", function($mmSite, $mmFS, $q, $log, $mmSitesManager, md5) {
    $log = $log.getInstance('$mmaFiles');
    var self = {},
        defaultParams = {
            "contextid": 0,
            "component": "",
            "filearea": "",
            "itemid": 0,
            "filepath": "",
            "filename": ""
        },
        moodle310version = 2016052300;
        self.canAccessFiles = function() {
        return $mmSite.wsAvailable('core_files_get_files');
    };
        self.canMoveFromDraftToPrivate = function(siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.wsAvailable('core_user_add_user_private_files');
        });
    };
        self.getFiles = function(params) {
        var deferred = $q.defer(),
            options = {};
        options.cacheKey = getFilesListCacheKey(params);
        $mmSite.read('core_files_get_files', params, options).then(function(result) {
            var data = {
                entries: [],
                count: 0
            };
            if (typeof result.files == 'undefined') {
                deferred.reject();
                return;
            }
            angular.forEach(result.files, function(entry) {
                entry.link = {};
                entry.link.contextid = (entry.contextid) ? entry.contextid : "";
                entry.link.component = (entry.component) ? entry.component : "";
                entry.link.filearea = (entry.filearea) ? entry.filearea : "";
                entry.link.itemid = (entry.itemid) ? entry.itemid : 0;
                entry.link.filepath = (entry.filepath) ? entry.filepath : "";
                entry.link.filename = (entry.filename) ? entry.filename : "";
                if (entry.component && entry.isdir) {
                    entry.link.filename = "";
                }
                if (entry.isdir) {
                    entry.imgpath = $mmFS.getFolderIcon();
                } else {
                    entry.imgpath = $mmFS.getFileIcon(entry.filename);
                }
                entry.link = JSON.stringify(entry.link);
                entry.linkId = md5.createHash(entry.link);
                data.count += 1;
                data.entries.push(entry);
            });
            deferred.resolve(data);
        }, function() {
            deferred.reject();
        });
        return deferred.promise;
    };
        function getFilesListCacheKey(params) {
        var root = params.component === '' ? 'site' : 'my';
        return 'mmaFiles:list:' + root + ':' + params.contextid + ':' + params.filepath;
    }
        self.getMyFiles = function() {
        var params = getMyFilesRootParams();
        return self.getFiles(params);
    };
        function getMyFilesListCommonCacheKey() {
        return 'mmaFiles:list:my';
    }
        function getMyFilesRootParams() {
        var params = angular.copy(defaultParams, {});
        params.component = "user";
        params.filearea = "private";
        params.contextid = -1;
        params.contextlevel = "user";
        params.instanceid = $mmSite.getUserId();
        return params;
    }
        self.getSiteFiles = function() {
        var params = angular.copy(defaultParams, {});
        return self.getFiles(params);
    };
        function getSiteFilesListCommonCacheKey() {
        return 'mmaFiles:list:site';
    }
        self.invalidateDirectory = function(root, path, siteid) {
        siteid = siteid || $mmSite.getId();
        var params = {};
        if (!path) {
            if (root === 'site') {
                params = angular.copy(defaultParams, {});
            } else if (root === 'my') {
                params = getMyFilesRootParams();
            }
        } else {
            params = JSON.parse(path);
        }
        return $mmSitesManager.getSite(siteid).then(function(site) {
            return site.invalidateWsCacheForKey(getFilesListCacheKey(params));
        });
    };
        self.invalidateMyFiles = function() {
        return $mmSite.invalidateWsCacheForKeyStartingWith(getMyFilesListCommonCacheKey());
    };
        self.invalidateSiteFiles = function() {
        return $mmSite.invalidateWsCacheForKeyStartingWith(getSiteFilesListCommonCacheKey());
    };
        self.isPluginEnabled = function() {
        var canAccessFiles = self.canAccessFiles(),
            canAccessMyFiles = $mmSite.canAccessMyFiles(),
            canUploadFiles = $mmSite.canUploadFiles();
        return canAccessFiles || (canUploadFiles && canAccessMyFiles);
    };
        self.moveFromDraftToPrivate = function(draftId, siteId) {
        siteId = siteId || $mmSite.getId();
        var params = {
                draftid: draftId
            },
            preSets = {
                responseExpected: false
            };
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.write('core_user_add_user_private_files', params, preSets);
        });
    };
        self.shouldMoveFromDraftToPrivate = function(siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var version = parseInt(site.getInfo().version, 10);
            return version && version >= moodle310version;
        });
    };
        self.versionCanUploadFiles = function(siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var version = parseInt(site.getInfo().version, 10);
            if (!version) {
                return false;
            } else if (version == moodle310version) {
                return false;
            } else if (version > moodle310version) {
                return self.canMoveFromDraftToPrivate(siteId);
            }
            return true;
        });
    };
    return self;
}]);

angular.module('mm.addons.files')
.factory('$mmaFilesHandlers', ["$log", "$mmaFiles", function($log, $mmaFiles) {
    $log = $log.getInstance('$mmaFilesHandlers');
    var self = {};
        self.sideMenuNav = function() {
        var self = {};
                self.isEnabled = function() {
            return $mmaFiles.isPluginEnabled();
        };
                self.getController = function() {
                        return function($scope) {
                $scope.icon = 'ion-folder';
                $scope.title = 'mma.files.myfiles';
                $scope.state = 'site.files';
                $scope.class = 'mma-files-handler';
            };
        };
        return self;
    };
    return self;
}]);

angular.module('mm.addons.files')
.factory('$mmaFilesHelper', ["$q", "$mmUtil", "$log", "$mmaFiles", "$mmFileUploaderHelper", "$mmSite", function($q, $mmUtil, $log, $mmaFiles, $mmFileUploaderHelper, $mmSite) {
    $log = $log.getInstance('$mmaFilesHelper');
    var self = {};
        self.selectAndUploadFile = function() {
        var maxSize = $mmSite.getInfo().usermaxuploadfilesize,
            userQuota = $mmSite.getInfo().userquota;
        if (typeof maxSize == 'undefined') {
            if (typeof userQuota != 'undefined') {
                maxSize = userQuota;
            } else {
                maxSize = -1;
            }
        } else if (typeof userQuota != 'undefined') {
            maxSize = Math.min(maxSize, userQuota);
        }
        return $mmFileUploaderHelper.selectAndUploadFile(maxSize).then(function(result) {
            return $mmaFiles.shouldMoveFromDraftToPrivate().then(function(move) {
                if (move) {
                    if (!result) {
                        return $q.reject();
                    }
                    var modal = $mmUtil.showModalLoading('mm.fileuploader.uploading', true);
                    return $mmaFiles.moveFromDraftToPrivate(result.itemid).catch(function(error) {
                        if (error) {
                            $mmUtil.showErrorModal(error);
                        } else {
                            $mmUtil.showErrorModal('mm.fileuploader.errorwhileuploading', true);
                        }
                        return $q.reject();
                    }).finally(function() {
                        modal.dismiss();
                    });
                }
            });
        }).then(function() {
            $mmUtil.showModal('mm.core.success', 'mm.fileuploader.fileuploaded');
        });
    };
    return self;
}]);

angular.module('mm.addons.frontpage')
.factory('$mmaFrontpage', ["$mmSite", "$log", "$q", "$mmCourse", function($mmSite, $log, $q, $mmCourse) {
    $log = $log.getInstance('$mmaFrontpage');
    var self = {};
        self.isPluginEnabled = function() {
        if (!$mmSite.isLoggedIn()) {
            return false;
        }
        return true;
    };
        self.isFrontpageAvailable = function() {
        $log.debug('Using WS call to check if frontpage is available.');
        return $mmCourse.getSections(1, {emergencyCache: false}).then(function(data) {
            if (!angular.isArray(data) || data.length == 0) {
                return $q.reject();
            }
        });
    };
    return self;
}]);

angular.module('mm.addons.frontpage')
.factory('$mmaFrontPageHandlers', ["$log", "$mmaFrontpage", "$mmUtil", "$state", function($log, $mmaFrontpage, $mmUtil, $state) {
    $log = $log.getInstance('$mmaFrontPageHandlers');
    var self = {};
        self.sideMenuNav = function() {
        var self = {};
                self.isEnabled = function() {
            if ($mmaFrontpage.isPluginEnabled()) {
                return $mmaFrontpage.isFrontpageAvailable().then(function() {
                    return true;
                });
            }
            return false;
        };
                self.getController = function() {
                        return function($scope) {
                $scope.icon = 'ion-home';
                $scope.title = 'mma.frontpage.sitehome';
                $scope.state = 'site.mm_course-section';
                $scope.class = 'mma-frontpage-handler';
            };
        };
        return self;
    };
        self.linksHandler = function() {
        var self = {};
                self.getActions = function(siteIds, url) {
            if (typeof self.handles(url) != 'undefined') {
                var params = $mmUtil.extractUrlParams(url),
                    courseId = parseInt(params.id, 10);
                if (courseId === 1) {
                    return [{
                        message: 'mm.core.view',
                        icon: 'ion-eye',
                        sites: siteIds,
                        action: function(siteId) {
                            siteId = siteId || $mmSite.getId();
                            $state.go('redirect', {
                                siteid: siteId,
                                state: 'site.mm_course-section'
                            });
                        }
                    }];
                }
            }
            return [];
        };
                self.handles = function(url) {
            var patterns = ['/course/view.php'];
            for (var i = 0; i < patterns.length; i++) {
                var position = url.indexOf(patterns[i]);
                if (position > -1) {
                    return url.substr(0, position);
                }
            }
        };
        return self;
    };
    return self;
}]);

angular.module('mm.addons.grades')
.controller('mmaGradesGradeCtrl', ["$scope", "$stateParams", "$mmUtil", "$mmaGrades", "$mmSite", "$mmaGradesHelper", "$log", "$mmContentLinksHelper", function($scope, $stateParams, $mmUtil, $mmaGrades, $mmSite, $mmaGradesHelper, $log,
        $mmContentLinksHelper) {
    $log = $log.getInstance('mmaGradesGradeCtrl');
    var courseId = $stateParams.courseid,
        userId = $stateParams.userid || $mmSite.getUserId();
    function fetchGrade() {
        return $mmaGrades.getGradesTable(courseId, userId).then(function(table) {
            $scope.grade = $mmaGradesHelper.getGradeRow(table, $stateParams.gradeid);
        }, function(message) {
            $mmUtil.showErrorModal(message);
            $scope.errormessage = message;
        });
    }
    fetchGrade().finally(function() {
        $scope.gradeLoaded = true;
    });
    $scope.refreshGrade = function() {
        fetchGrade().finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.gotoActivity = function() {
        if ($scope.grade.link) {
            $mmContentLinksHelper.handleLink($scope.grade.link).then(function(treated) {
                if (!treated) {
                    $log.debug('Link not being handled ' + $scope.grade.link + ' opening in browser...');
                    $mmUtil.openInBrowser($scope.grade.link);
                }
            });
        }
    };
    $scope.refreshGrade = function() {
        $mmaGrades.invalidateGradesTableData(courseId, userId).finally(function() {
            fetchGrade().finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        });
    };
}]);

angular.module('mm.addons.grades')
.controller('mmaGradesTableCtrl', ["$scope", "$stateParams", "$mmUtil", "$mmaGrades", "$mmSite", "$mmaGradesHelper", "$state", function($scope, $stateParams, $mmUtil, $mmaGrades, $mmSite, $mmaGradesHelper, $state) {
    var course = $stateParams.course || {},
        courseId = course.id,
        userId = $stateParams.userid || $mmSite.getUserId();
    function fetchGrades() {
        return $mmaGrades.getGradesTable(courseId, userId).then(function(table) {
            table = $mmaGradesHelper.formatGradesTable(table);
            return $mmaGradesHelper.translateGradesTable(table).then(function(table) {
                $scope.gradesTable = table;
            });
        }, function(message) {
            $mmUtil.showErrorModal(message);
            $scope.errormessage = message;
        });
    }
    fetchGrades().then(function() {
        $mmSite.write('gradereport_user_view_grade_report', {
            courseid: courseId,
            userid: userId
        });
    }).finally(function() {
        $scope.gradesLoaded = true;
    });
    $scope.expandGradeInfo = function(gradeid) {
        if (gradeid) {
            $state.go('site.grade', {
                courseid: courseId,
                userid: userId,
                gradeid: gradeid
            });
        }
    };
    $scope.refreshGrades = function() {
        $mmaGrades.invalidateGradesTableData(courseId, userId).finally(function() {
            fetchGrades().finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        });
    };
}]);

angular.module('mm.addons.grades')
.factory('$mmaGrades', ["$q", "$log", "$mmSite", "$mmCourses", "$mmSitesManager", function($q, $log, $mmSite, $mmCourses, $mmSitesManager) {
    $log = $log.getInstance('$mmaGrades');
    var self = {};
        function getGradesTableCacheKey(courseId, userId) {
        return 'mmaGrades:table:' + courseId + ':' + userId;
    }
        self.invalidateGradesTableData = function(courseId, userId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.invalidateWsCacheForKey(getGradesTableCacheKey(courseId, userId));
        });
    };
        self.isPluginEnabled = function(siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.wsAvailable('gradereport_user_get_grades_table');
        });
    };
        self.isPluginEnabledForCourse = function(courseId, siteId) {
        if (!courseId) {
            return $q.reject();
        }
        return $mmCourses.getUserCourse(courseId, true, siteId).then(function(course) {
            if (course && typeof course.showgrades != 'undefined' && course.showgrades == 0) {
                return false;
            }
            return true;
        });
    };
        self.isPluginEnabledForUser = function(courseId, userId) {
        var data = {
                courseid: courseId,
                userid: userId
            };
        return $mmSite.read('gradereport_user_get_grades_table', data, {}).then(function() {
            return true;
        }).catch(function() {
            return false;
        });
    };
        self.getGradesTable = function(courseId, userId, siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            $log.debug('Get grades for course ' + courseId + ' and user ' + userId);
            var data = {
                    courseid : courseId,
                    userid   : userId
                },
                preSets = {
                    cacheKey: getGradesTableCacheKey(courseId, userId)
                };
            return $mmSite.read('gradereport_user_get_grades_table', data, preSets).then(function (table) {
                if (table && table.tables && table.tables[0]) {
                    return table.tables[0];
                }
                return $q.reject();
            });
        });
    };
    return self;
}]);

angular.module('mm.addons.grades')
.factory('$mmaGradesHandlers', ["$mmaGrades", "$state", "$mmUtil", "$mmContentLinksHelper", "mmCoursesAccessMethods", function($mmaGrades, $state, $mmUtil, $mmContentLinksHelper, mmCoursesAccessMethods) {
    var self = {},
        viewGradesEnabledCache = {};
        function getCacheKey(courseId, userId) {
        return courseId + '#' + userId;
    }
        self.clearViewGradesCache = function(courseId, userId) {
        if (courseId && userId) {
            delete viewGradesEnabledCache[getCacheKey(courseId, userId)];
        } else {
            viewGradesEnabledCache = {};
        }
    };
        self.coursesNav = function() {
        var self = {};
                self.isEnabled = function() {
            return $mmaGrades.isPluginEnabled();
        };
                self.isEnabledForCourse = function(courseId, accessData) {
            if (accessData && accessData.type == mmCoursesAccessMethods.guest) {
                return false;
            }
            return $mmaGrades.isPluginEnabledForCourse(courseId);
        };
                self.getController = function() {
                        return function($scope, $state) {
                $scope.icon = 'ion-stats-bars';
                $scope.title = 'mma.grades.grades';
                $scope.class = 'mma-grades-mine-handler';
                $scope.action = function($event, course) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $state.go('site.grades', {
                        course: course
                    });
                };
            };
        };
        return self;
    };
        self.viewGrades = function() {
        var self = {};
                self.isEnabled = function() {
            return $mmaGrades.isPluginEnabled();
        };
                self.isEnabledForUser = function(user, courseId) {
            return $mmaGrades.isPluginEnabledForCourse(courseId).then(function() {
                var cacheKey = getCacheKey(courseId, user.id);
                if (typeof viewGradesEnabledCache[cacheKey] != 'undefined') {
                    return viewGradesEnabledCache[cacheKey];
                }
                return $mmaGrades.isPluginEnabledForUser(courseId, user.id).then(function(enabled) {
                    viewGradesEnabledCache[cacheKey] = enabled;
                    return enabled;
                });
            });
        };
                self.getController = function(user, courseId) {
                        return function($scope) {
                $scope.title = 'mma.grades.viewgrades';
                $scope.class = 'mma-grades-user-handler';
                $scope.action = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $state.go('site.grades', {
                        userid: user.id,
                        course: {id: courseId}
                    });
                };
            };
        };
        return self;
    };
        self.linksHandler = function() {
        var self = {};
                function isEnabled(siteId, courseId) {
            return $mmaGrades.isPluginEnabled(siteId).then(function(enabled) {
                if (enabled) {
                    return $mmaGrades.isPluginEnabledForCourse(courseId, siteId);
                }
            });
        }
                self.getActions = function(siteIds, url) {
            if (typeof self.handles(url) != 'undefined') {
                var params = $mmUtil.extractUrlParams(url);
                if (typeof params.id != 'undefined') {
                    var courseId = parseInt(params.id, 10);
                    return $mmContentLinksHelper.filterSupportedSites(siteIds, isEnabled, false, courseId).then(function(ids) {
                        if (!ids.length) {
                            return [];
                        } else {
                            return [{
                                message: 'mm.core.view',
                                icon: 'ion-eye',
                                sites: ids,
                                action: function(siteId) {
                                    var stateParams = {
                                        course: {id: courseId},
                                        userid: parseInt(params.userid, 10)
                                    };
                                    $mmContentLinksHelper.goInSite('site.grades', stateParams, siteId);
                                }
                            }];
                        }
                    });
                }
            }
            return [];
        };
                self.handles = function(url) {
            var position = url.indexOf('/grade/report/user/index.php');
            if (position > -1) {
                return url.substr(0, position);
            }
        };
        return self;
    };
    return self;
}])
.run(["$mmaGradesHandlers", "$mmEvents", "mmCoreEventLogout", "mmUserEventProfileRefreshed", function($mmaGradesHandlers, $mmEvents, mmCoreEventLogout, mmUserEventProfileRefreshed) {
    $mmEvents.on(mmCoreEventLogout, $mmaGradesHandlers.clearViewGradesCache);
    $mmEvents.on(mmUserEventProfileRefreshed, function(data) {
        if (data) {
            $mmaGradesHandlers.clearViewGradesCache(data.courseid, data.userid);
        }
    });
}]);

angular.module('mm.addons.grades')
.factory('$mmaGradesHelper', ["$q", "$mmText", "$translate", "$mmCourse", function($q, $mmText, $translate, $mmCourse) {
    var self = {};
        self.formatGradesTable = function(table) {
        var formatted = {
            columns: [],
            rows: []
        };
        var columns = {
            itemname: true,
            weight: false,
            grade: false,
            range: false,
            percentage: false,
            lettergrade: false,
            rank: false,
            average: false,
            feedback: false,
            contributiontocoursetotal: false
        };
        var returnedColumns = [];
        var tabledata = [];
        var maxDepth = 0;
        if (table['tabledata']) {
            tabledata = table['tabledata'];
            maxDepth = table['maxdepth'];
            for (var el in tabledata) {
                if (!angular.isArray(tabledata[el]) && typeof(tabledata[el]["leader"]) === "undefined") {
                    for (var col in tabledata[el]) {
                        returnedColumns.push(col);
                    }
                    break;
                }
            }
        }
        if (returnedColumns.length > 0) {
            var columnAdded = false;
            for (var i = 0; i < tabledata.length && !columnAdded; i++) {
                if (typeof(tabledata[i]["grade"]) != "undefined" &&
                        typeof(tabledata[i]["grade"]["content"]) != "undefined") {
                    columns.grade = true;
                    columnAdded = true;
                } else if (typeof(tabledata[i]["percentage"]) != "undefined" &&
                        typeof(tabledata[i]["percentage"]["content"]) != "undefined") {
                    columns.percentage = true;
                    columnAdded = true;
                }
            }
            if (!columnAdded) {
                columns.grade = true;
            }
            for (var colName in columns) {
                if (returnedColumns.indexOf(colName) > -1) {
                    var width = colName == "itemname" ? maxDepth : 1;
                    var column = {
                        id: colName,
                        name: colName,
                        width: width,
                        showAlways: columns[colName]
                    };
                    formatted.columns.push(column);
                }
            }
            var name, rowspan, tclass, colspan, content, celltype, id, headers, img;
            for (var i = 0; i < tabledata.length; i++) {
                var row = {};
                row.text = '';
                if (typeof(tabledata[i]['leader']) != "undefined") {
                    rowspan = tabledata[i]['leader']['rowspan'];
                    tclass = tabledata[i]['leader']['class'];
                    row.text += '<td class="' + tclass + '" rowspan="' + rowspan + '"></td>';
                }
                for (el in returnedColumns) {
                    name = returnedColumns[el];
                    if (typeof(tabledata[i][name]) != "undefined") {
                        tclass = (typeof(tabledata[i][name]['class']) != "undefined")? tabledata[i][name]['class'] : '';
                        tclass += columns[name] ? '' : ' hidden-phone';
                        colspan = (typeof(tabledata[i][name]['colspan']) != "undefined")? "colspan='"+tabledata[i][name]['colspan']+"'" : '';
                        content = (typeof(tabledata[i][name]['content']) != "undefined")? tabledata[i][name]['content'] : null;
                        celltype = (typeof(tabledata[i][name]['celltype']) != "undefined")? tabledata[i][name]['celltype'] : 'td';
                        id = (typeof(tabledata[i][name]['id']) != "undefined")? "id='" + tabledata[i][name]['id'] +"'" : '';
                        headers = (typeof(tabledata[i][name]['headers']) != "undefined")? "headers='" + tabledata[i][name]['headers'] + "'" : '';
                        if (typeof(content) != "undefined") {
                            img = getImgHTML(content);
                            content = content.replace(/<\/span>/gi, "\n");
                            content = $mmText.cleanTags(content);
                            content = content.replace("\n", "<br />");
                            content = img + " " + content;
                            row.text += "<" + celltype + " " + id + " " + headers + " " + "class='"+ tclass +"' " + colspan +">";
                            row.text += content;
                            row.text += "</" + celltype + ">";
                        }
                    }
                }
                if (row.text.length > 0) {
                    if (tabledata[i].itemname && tabledata[i].itemname.id && tabledata[i].itemname.id.substr(0, 3) == 'row') {
                        row.id = tabledata[i].itemname.id.split('_')[1];
                    }
                    formatted.rows.push(row);
                }
            }
        }
        return formatted;
    };
        self.getGradeRow = function(table, gradeid) {
        var row = {},
            selectedRow = false;
        if (table['tabledata']) {
            var tabledata = table['tabledata'];
            for (var i = 0; i < tabledata.length; i++) {
                if (tabledata[i].itemname && tabledata[i].itemname.id && tabledata[i].itemname.id.substr(0, 3) == 'row') {
                    if (tabledata[i].itemname.id.split('_')[1] == gradeid) {
                        selectedRow = tabledata[i];
                        break;
                    }
                }
            }
        }
        if (!selectedRow) {
            return "";
        }
        for (var name in selectedRow) {
            if (typeof(selectedRow[name]) != "undefined" && typeof(selectedRow[name]['content']) != "undefined") {
                var content = selectedRow[name]['content'];
                if (name == 'itemname') {
                    var img = getImgHTML(content);
                    row.link = getModuleLink(content);
                    content = content.replace(/<\/span>/gi, "\n");
                    content = $mmText.cleanTags(content);
                    content = img + " " + content;
                } else {
                    content = content.replace("\n", "<br />");
                }
                if (content == '&nbsp;') {
                    content = "";
                }
                row[name] = content.trim();
            }
        }
        return row;
    };
        function getImgHTML(text) {
        var img = '';
        text = text.replace("%2F", "/").replace("%2f", "/");
        if (text.indexOf("/agg_mean") > -1) {
            img = '<img src="addons/grades/img/agg_mean.png" width="16">';
        } else if (text.indexOf("/agg_sum") > -1) {
            img = '<img src="addons/grades/img/agg_sum.png" width="16">';
        } else if (text.indexOf("/outcomes") > -1) {
            img = '<img src="addons/grades/img/outcomes.png" width="16">';
        } else if (text.indexOf("i/folder") > -1) {
            img = '<img src="addons/grades/img/folder.png" width="16">';
        } else if (text.indexOf("/manual_item") > -1) {
            img = '<img src="addons/grades/img/manual_item.png" width="16">';
        } else if (text.indexOf("/mod/") > -1) {
            var module = text.match(/mod\/([^\/]*)\//);
            if (typeof module[1] != "undefined") {
                var moduleSrc = $mmCourse.getModuleIconSrc(module[1]);
                img = '<img src="' + moduleSrc + '" width="16">';
            }
        }
        if (img) {
            img = '<span class="app-ico">' + img + '</span>';
        }
        return img;
    }
        function getModuleLink(text) {
        var el = angular.element(text)[0],
            link = el.attributes['href'] ? el.attributes['href'].value : false;
        if (!link || link.indexOf("/mod/") < 0) {
            return false;
        }
        return link;
    }
        self.translateGradesTable = function(table) {
        var columns = angular.copy(table.columns),
            promises = [];
        columns.forEach(function(column) {
            var promise = $translate('mma.grades.'+column.name).then(function(translated) {
                column.name = translated;
            });
            promises.push(promise);
        });
        return $q.all(promises).then(function() {
            return {
                columns: columns,
                rows: table.rows
            };
        });
    };
    return self;
}]);

angular.module('mm.addons.messages')
.controller('mmaMessagesContactsCtrl', ["$scope", "$mmaMessages", "$mmSite", "$mmUtil", "$mmApp", "mmUserProfileState", "$translate", function($scope, $mmaMessages, $mmSite, $mmUtil, $mmApp, mmUserProfileState, $translate) {
    var currentUserId = $mmSite.getUserId(),
        searchingMessage = $translate.instant('mm.core.searching'),
        loadingMessage = $translate.instant('mm.core.loading');
    $scope.loaded = false;
    $scope.contactTypes = ['online', 'offline', 'blocked', 'strangers', 'search'];
    $scope.searchType = 'search';
    $scope.hasContacts = false;
    $scope.canSearch = $mmaMessages.isSearchEnabled;
    $scope.formData = {
        searchString: ''
    };
    $scope.userStateName = mmUserProfileState;
    $scope.refresh = function() {
        $mmaMessages.invalidateAllContactsCache(currentUserId).then(function() {
            return fetchContacts(true).then(function() {
                $scope.formData.searchString = '';
            });
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.search = function(query) {
        if (query.length < 3) {
            return;
        }
        $mmApp.closeKeyboard();
        $scope.loaded = false;
        $scope.loadingMessage = searchingMessage;
        return $mmaMessages.searchContacts(query).then(function(result) {
            $scope.hasContacts = result.length > 0;
            $scope.contacts = {
                search: result
            };
        }).catch(function(error) {
            if (typeof error === 'string') {
                $mmUtil.showErrorModal(error);
            } else {
                $mmUtil.showErrorModal('mma.messages.errorwhileretrievingcontacts', true);
            }
        }).finally(function() {
            $scope.loaded = true;
        });
    };
    $scope.clearSearch = function() {
        $scope.loaded = false;
        fetchContacts().finally(function() {
            $scope.loaded = true;
        });
    };
    function fetchContacts() {
        $scope.loadingMessage = loadingMessage;
        return $mmaMessages.getAllContacts().then(function(contacts) {
            $scope.contacts = contacts;
            angular.forEach(contacts, function(contact) {
                if (contact.length > 0) {
                    $scope.hasContacts = true;
                }
            });
        }, function(error) {
            if (typeof error === 'string') {
                $mmUtil.showErrorModal(error);
            } else {
                $mmUtil.showErrorModal('mma.messages.errorwhileretrievingcontacts', true);
            }
        });
    }
    fetchContacts().finally(function() {
        $scope.loaded = true;
    });
}]);

angular.module('mm.addons.messages')
.controller('mmaMessagesDiscussionCtrl', ["$scope", "$stateParams", "$mmApp", "$mmaMessages", "$mmSite", "$timeout", "$mmEvents", "$window", "$ionicScrollDelegate", "mmUserProfileState", "$mmUtil", "mmaMessagesPollInterval", "$interval", "$log", "$ionicHistory", "$ionicPlatform", "mmCoreEventKeyboardShow", "mmCoreEventKeyboardHide", "mmaMessagesDiscussionLoadedEvent", "mmaMessagesDiscussionLeftEvent", "$mmUser", "$translate", "mmaMessagesNewMessageEvent", function($scope, $stateParams, $mmApp, $mmaMessages, $mmSite, $timeout, $mmEvents, $window,
        $ionicScrollDelegate, mmUserProfileState, $mmUtil, mmaMessagesPollInterval, $interval, $log, $ionicHistory, $ionicPlatform,
        mmCoreEventKeyboardShow, mmCoreEventKeyboardHide, mmaMessagesDiscussionLoadedEvent, mmaMessagesDiscussionLeftEvent,
        $mmUser, $translate, mmaMessagesNewMessageEvent) {
    $log = $log.getInstance('mmaMessagesDiscussionCtrl');
    var userId = $stateParams.userId,
        messagesBeingSent = 0,
        polling,
        fetching,
        backView = $ionicHistory.backView(),
        lastMessage,
        scrollView = $ionicScrollDelegate.$getByHandle('mmaMessagesScroll');
    $scope.loaded = false;
    $scope.messages = [];
    $scope.userId = userId;
    $scope.currentUserId = $mmSite.getUserId();
    if (backView && backView.stateName === mmUserProfileState) {
        $scope.profileLink = false;
    }
    if (userId) {
        $mmUser.getProfile(userId, undefined, true).then(function(user) {
            if (!$scope.title) {
                $scope.title = user.fullname;
            }
            if (typeof $scope.profileLink == 'undefined') {
                $scope.profileLink = user.profileimageurl || true;
            }
        }).catch(function() {
            $scope.profileLink = true;
        });
    }
    $scope.isAppOffline = function() {
        return !$mmApp.isOnline();
    };
    $scope.showDate = function(message, prevMessage) {
        if (!prevMessage) {
            return true;
        }
        return !moment(message.timecreated * 1000).isSame(prevMessage.timecreated * 1000, 'day');
    };
    $scope.sendMessage = function(text) {
        var message;
        if (!$mmApp.isOnline()) {
            return;
        } else if (!text.trim()) {
            return;
        }
        text = text.replace(/(?:\r\n|\r|\n)/g, '<br />');
        message = {
            sending: true,
            useridfrom: $scope.currentUserId,
            smallmessage: text,
            timecreated: ((new Date()).getTime() / 1000)
        };
        $scope.messages.push(message);
        messagesBeingSent++;
        $mmaMessages.sendMessage(userId, text).then(function() {
            message.sending = false;
            notifyNewMessage();
        }, function(error) {
            $mmApp.closeKeyboard();
            if (typeof error === 'string') {
                $mmUtil.showErrorModal(error);
            } else {
                $mmUtil.showErrorModal('mma.messages.messagenotsent', true);
            }
            $scope.messages.splice($scope.messages.indexOf(message), 1);
        }).finally(function() {
            messagesBeingSent--;
        });
    };
    $mmaMessages.getDiscussion(userId).then(function(messages) {
        $scope.messages = $mmaMessages.sortMessages(messages);
        if (!$scope.title && messages && messages.length > 0) {
            if (messages[0].useridto != $scope.currentUserId) {
                $scope.title = messages[0].usertofullname || '';
            } else {
                $scope.title = messages[0].userfromfullname || '';
            }
        }
        notifyNewMessage();
    }, function(error) {
        if (typeof error === 'string') {
            $mmUtil.showErrorModal(error);
        } else {
            $mmUtil.showErrorModal('mma.messages.errorwhileretrievingmessages', true);
        }
    }).finally(function() {
        $scope.loaded = true;
    });
    $scope.scrollAfterRender = function(scope) {
        if (scope.$last === true) {
            $timeout(function() {
                scrollView.scrollBottom();
                setScrollWithKeyboard();
            });
        }
    };
    function fetchMessages() {
        $log.debug('Polling new messages for discussion with user ' + userId);
        if (messagesBeingSent > 0) {
            return;
        } else if (!$mmApp.isOnline()) {
            return;
        } else if (fetching) {
            return;
        }
        fetching = true;
        $mmaMessages.invalidateDiscussionCache(userId);
        $mmaMessages.getDiscussion(userId).then(function(messages) {
            if (messagesBeingSent > 0) {
                return;
            }
            $scope.messages = $mmaMessages.sortMessages(messages);
            notifyNewMessage();
        }).finally(function() {
            fetching = false;
        });
    }
    function setPolling() {
        if (polling) {
            return;
        }
        polling = $interval(fetchMessages, mmaMessagesPollInterval);
    }
    function unsetPolling() {
        if (polling) {
            $log.debug('Cancelling polling for conversation with user ' + userId);
            $interval.cancel(polling);
            polling = undefined;
        }
    }
    if ($ionicPlatform.isTablet()) {
        $scope.$on('$viewContentLoaded', function(){
            setPolling();
        });
        $scope.$on('$destroy', function(){
            unsetPolling();
        });
    } else {
        $scope.$on('$ionicView.enter', function() {
            setPolling();
        });
        $scope.$on('$ionicView.leave', function(e) {
            unsetPolling();
        });
    }
    function notifyNewMessage() {
        var last = $scope.messages[$scope.messages.length - 1];
        if (last && last.smallmessage !== lastMessage) {
            lastMessage = last.smallmessage;
            $mmEvents.trigger(mmaMessagesNewMessageEvent, {
                siteid: $mmSite.getId(),
                userid: userId,
                message: lastMessage,
                timecreated: last.timecreated
            });
        }
    }
    function setScrollWithKeyboard() {
        if (ionic.Platform.isAndroid()) {
            $timeout(function() {
                var obsShow,
                    obsHide,
                    keyboardHeight,
                    maxInitialScroll = scrollView.getScrollView().__contentHeight - scrollView.getScrollView().__clientHeight,
                    initialHeight = $window.innerHeight;
                obsShow = $mmEvents.on(mmCoreEventKeyboardShow, function(e) {
                    $timeout(function() {
                        var heightDifference = initialHeight - $window.innerHeight,
                            newKeyboardHeight = heightDifference > 50 ? heightDifference : e.keyboardHeight;
                        if (newKeyboardHeight) {
                            keyboardHeight = newKeyboardHeight;
                            scrollView.scrollBy(0, newKeyboardHeight);
                        }
                    });
                });
                obsHide = $mmEvents.on(mmCoreEventKeyboardHide, function(e) {
                    if (!scrollView || !scrollView.getScrollPosition()) {
                        return;
                    }
                    if (scrollView.getScrollPosition().top >= maxInitialScroll) {
                        scrollView.scrollBy(0, scrollView.getScrollPosition().top - keyboardHeight - maxInitialScroll);
                    } else {
                        scrollView.scrollBy(0, - keyboardHeight);
                    }
                });
                $scope.$on('$destroy', function() {
                    obsShow && obsShow.off && obsShow.off();
                    obsHide && obsHide.off && obsHide.off();
                });
            });
        }
    }
    $scope.canDelete = $mmaMessages.canDeleteMessages();
    $scope.selectMessage = function(id) {
        $scope.selectedMessage = id;
    };
    $scope.deleteMessage = function(message, index) {
        $mmUtil.showConfirm($translate('mma.messages.deletemessageconfirmation')).then(function() {
            var modal = $mmUtil.showModalLoading('mm.core.deleting', true);
            $mmaMessages.deleteMessage(message.id, message.read).then(function() {
                $scope.messages.splice(index, 1);
                fetchMessages();
            }).catch(function(error) {
                if (typeof error === 'string') {
                    $mmUtil.showErrorModal(error);
                } else {
                    $mmUtil.showErrorModal('mma.messages.errordeletemessage', true);
                }
            }).finally(function() {
                modal.dismiss();
            });
        });
    };
    if ($ionicPlatform.isTablet()) {
        $mmEvents.trigger(mmaMessagesDiscussionLoadedEvent, userId);
    }
    $scope.$on('$destroy', function() {
        if ($ionicPlatform.isTablet()) {
            $mmEvents.trigger(mmaMessagesDiscussionLeftEvent);
        }
    });
}]);

angular.module('mm.addons.messages')
.controller('mmaMessagesDiscussionsCtrl', ["$scope", "$mmUtil", "$mmaMessages", "$rootScope", "$mmEvents", "$mmSite", "mmCoreSplitViewLoad", "mmaMessagesNewMessageEvent", function($scope, $mmUtil, $mmaMessages, $rootScope, $mmEvents, $mmSite,
            mmCoreSplitViewLoad, mmaMessagesNewMessageEvent) {
    var newMessagesObserver,
        siteId = $mmSite.getId(),
        discussions;
    $scope.loaded = false;
    function fetchDiscussions() {
        return $mmaMessages.getDiscussions().then(function(discs) {
            discussions = discs;
            var array = [];
            angular.forEach(discussions, function(v) {
                array.push(v);
            });
            $scope.discussions = array;
        }, function(error) {
            if (typeof error === 'string') {
                $mmUtil.showErrorModal(error);
            } else {
                $mmUtil.showErrorModal('mma.messages.errorwhileretrievingdiscussions', true);
            }
        });
    }
    function refreshData() {
        return $mmaMessages.invalidateDiscussionsCache().then(function() {
            return fetchDiscussions();
        });
    }
    $scope.refresh = function() {
        refreshData().finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    fetchDiscussions().finally(function() {
        $scope.loaded = true;
        $rootScope.$broadcast(mmCoreSplitViewLoad);
    });
    newMessagesObserver = $mmEvents.on(mmaMessagesNewMessageEvent, function(data) {
        var discussion;
        if (data && data.siteid == siteId && data.userid) {
            discussion = discussions[data.userid];
            if (typeof discussion == 'undefined') {
                $scope.loaded = false;
                refreshData().finally(function() {
                    $scope.loaded = true;
                });
            } else if (data.timecreated > discussion.message.timecreated) {
                discussion.message.message = data.message;
                discussion.message.timecreated = data.timecreated;
            }
        }
    });
    $scope.$on('$destroy', function() {
        if (newMessagesObserver && newMessagesObserver.off) {
            newMessagesObserver.off();
        }
    });
}]);

angular.module('mm.addons.messages')
.controller('mmaMessagesIndexCtrl', ["$scope", "$mmEvents", "$ionicPlatform", "$ionicTabsDelegate", "$mmUser", "mmaMessagesDiscussionLoadedEvent", "mmaMessagesDiscussionLeftEvent", function($scope, $mmEvents, $ionicPlatform, $ionicTabsDelegate, $mmUser,
            mmaMessagesDiscussionLoadedEvent, mmaMessagesDiscussionLeftEvent) {
    var obsLoaded = $mmEvents.on(mmaMessagesDiscussionLoadedEvent, function(userId) {
        if ($ionicPlatform.isTablet()) {
            $scope.userId = userId;
            $mmUser.getProfile(userId, undefined, true).catch(function() {
                return {
                    profileimageurl: true
                };
            }).then(function(user) {
                if ($scope.userId == userId) {
                    $scope.profileLink = user.profileimageurl || true;
                }
            });
        }
    });
    var obsLeft = $mmEvents.on(mmaMessagesDiscussionLeftEvent, function() {
        $scope.profileLink = false;
    });
    $scope.$on('$destroy', function() {
        if (obsLoaded && obsLoaded.off) {
            obsLoaded.off();
        }
        if (obsLeft && obsLeft.off) {
            obsLeft.off();
        }
    });
}]);

angular.module('mm.addons.messages')
.filter('mmaMessagesFormat', ["$mmText", function($mmText) {
  return function(text) {
    text = text.replace(/-{4,}/ig, '');
    text = text.replace(/<br \/><br \/>/ig, "<br />");
    text = $mmText.replaceNewLines(text, '<br />');
    return text;
  };
}]);

angular.module('mm.addons.messages')
.factory('$mmaMessagesHandlers', ["$log", "$mmaMessages", "$mmSite", "$state", "$mmUtil", "$mmContentLinksHelper", function($log, $mmaMessages, $mmSite, $state, $mmUtil, $mmContentLinksHelper) {
    $log = $log.getInstance('$mmaMessagesHandlers');
    var self = {};
        self.addContact = function() {
        var self = {};
        self.isEnabled = function() {
            return $mmaMessages.isPluginEnabled();
        };
        self.isEnabledForUser = function(user, courseId) {
            return user.id != $mmSite.getUserId();
        };
                self.getController = function(user, courseid) {
            return function($scope, $rootScope) {
                var disabled = false;
                function updateTitle() {
                    return $mmaMessages.isContact(user.id).then(function(isContact) {
                        if (isContact) {
                            $scope.title = 'mma.messages.removecontact';
                            $scope.class = 'mma-messages-removecontact-handler';
                        } else {
                            $scope.title = 'mma.messages.addcontact';
                            $scope.class = 'mma-messages-addcontact-handler';
                        }
                    }).catch(function() {
                        $scope.hidden = true;
                    });
                }
                $scope.title = '';
                $scope.spinner = false;
                $scope.action = function($event) {
                    if (disabled) {
                        return;
                    }
                    disabled = true;
                    $scope.spinner = true;
                    $mmaMessages.isContact(user.id).then(function(isContact) {
                        if (isContact) {
                            return $mmaMessages.removeContact(user.id);
                        } else {
                            return $mmaMessages.addContact(user.id);
                        }
                    }).catch(function(error) {
                        $mmUtil.showErrorModal(error);
                    }).finally(function() {
                        $rootScope.$broadcast('mmaMessagesHandlers:addUpdated');
                        updateTitle().finally(function() {
                            disabled = false;
                            $scope.spinner = false;
                        });
                    });
                };
                $scope.$on('mmaMessagesHandlers:blockUpdated', function() {
                    updateTitle();
                });
                updateTitle();
            };
        };
        return self;
    };
        self.blockContact = function() {
        var self = {};
        self.isEnabled = function() {
            return $mmaMessages.isPluginEnabled();
        };
        self.isEnabledForUser = function(user, courseId) {
            return user.id != $mmSite.getUserId();
        };
        self.getController = function(user, courseid) {
                        return function($scope, $rootScope) {
                var disabled = false;
                function updateTitle() {
                    return $mmaMessages.isBlocked(user.id).then(function(isBlocked) {
                        if (isBlocked) {
                            $scope.title = 'mma.messages.unblockcontact';
                            $scope.class = 'mma-messages-unblockcontact-handler';
                        } else {
                            $scope.title = 'mma.messages.blockcontact';
                            $scope.class = 'mma-messages-blockcontact-handler';
                        }
                    }).catch(function() {
                        $scope.hidden = true;
                    });
                }
                $scope.title = '';
                $scope.spinner = false;
                $scope.action = function($event) {
                    if (disabled) {
                        return;
                    }
                    disabled = true;
                    $scope.spinner = true;
                    $mmaMessages.isBlocked(user.id).then(function(isBlocked) {
                        if (isBlocked) {
                            return $mmaMessages.unblockContact(user.id);
                        } else {
                            return $mmaMessages.blockContact(user.id);
                        }
                    }).catch(function(error) {
                        $mmUtil.showErrorModal(error);
                    }).finally(function() {
                        $rootScope.$broadcast('mmaMessagesHandlers:blockUpdated');
                        updateTitle().finally(function() {
                            disabled = false;
                            $scope.spinner = false;
                        });
                    });
                };
                $scope.$on('mmaMessagesHandlers:addUpdated', function() {
                    updateTitle();
                });
                updateTitle();
            };
        };
        return self;
    };
        self.sendMessage = function() {
        var self = {};
        self.isEnabled = function() {
            return $mmaMessages.isPluginEnabled();
        };
        self.isEnabledForUser = function(user, courseId) {
            return user.id != $mmSite.getUserId();
        };
        self.getController = function(user, courseid) {
                        return function($scope) {
                $scope.title = 'mma.messages.sendmessage';
                $scope.class = 'mma-messages-sendmessage-handler';
                $scope.action = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $state.go('site.messages-discussion', {
                        userId: user.id
                    });
                };
            };
        };
        return self;
    };
        self.sideMenuNav = function() {
        var self = {};
                self.isEnabled = function() {
            return $mmaMessages.isPluginEnabled();
        };
                self.getController = function() {
                        return function($scope) {
                $scope.icon = 'ion-chatbox';
                $scope.title = 'mma.messages.messages';
                $scope.state = 'site.messages';
                $scope.class = 'mma-messages-handler';
            };
        };
        return self;
    };
        self.linksHandler = function() {
        var self = {};
                function isEnabledForSite(siteId) {
            return $mmaMessages.isPluginEnabled(siteId);
        }
                self.getActions = function(siteIds, url) {
            if (typeof self.handles(url) != 'undefined') {
                return $mmContentLinksHelper.filterSupportedSites(siteIds, isEnabledForSite, false).then(function(ids) {
                    if (!ids.length) {
                        return [];
                    } else {
                        var params = $mmUtil.extractUrlParams(url);
                        return [{
                            message: 'mm.core.view',
                            icon: 'ion-eye',
                            sites: ids,
                            action: function(siteId) {
                                var stateName,
                                    stateParams;
                                if (typeof params.user1 != 'undefined' && typeof params.user2 != 'undefined') {
                                    if ($mmSite.getUserId() == params.user1) {
                                        stateName = 'site.messages-discussion';
                                        stateParams = {userId: parseInt(params.user2, 10)};
                                    } else if ($mmSite.getUserId() == params.user2) {
                                        stateName = 'site.messages-discussion';
                                        stateParams = {userId: parseInt(params.user1, 10)};
                                    } else {
                                        $mmUtil.openInBrowser(url);
                                        return;
                                    }
                                } else if (typeof params.id != 'undefined') {
                                    stateName = 'site.messages-discussion';
                                    stateParams = {userId: parseInt(params.id, 10)};
                                }
                                if (!stateName) {
                                    $state.go('redirect', {
                                        siteid: siteId,
                                        state: 'site.messages',
                                        params: {}
                                    });
                                } else {
                                    $mmContentLinksHelper.goInSite(stateName, stateParams, siteId);
                                }
                            }
                        }];
                    }
                });
            }
            return [];
        };
                self.handles = function(url) {
            var position = url.indexOf('/message/index.php');
            if (position > -1) {
                return url.substr(0, position);
            }
        };
        return self;
    };
    return self;
}]);

angular.module('mm.addons.messages')
.factory('$mmaMessages', ["$mmSite", "$mmSitesManager", "$log", "$q", "$mmUser", "mmaMessagesNewMessageEvent", function($mmSite, $mmSitesManager, $log, $q, $mmUser, mmaMessagesNewMessageEvent) {
    $log = $log.getInstance('$mmaMessages');
    var self = {};
        self.addContact = function(userId) {
        return $mmSite.write('core_message_create_contacts', {
            userids: [ userId ]
        }).then(function() {
            return self.invalidateAllContactsCache($mmSite.getUserId());
        });
    };
        self.blockContact = function(userId) {
        return $mmSite.write('core_message_block_contacts', {
            userids: [ userId ]
        }).then(function() {
            return self.invalidateAllContactsCache($mmSite.getUserId());
        });
    };
        self.canDeleteMessages = function() {
        return $mmSite.wsAvailable('core_message_delete_message');
    };
        self.deleteMessage = function(id, read, userId) {
        userId = userId || $mmSite.getUserId();
        var params = {
                messageid: id,
                userid: userId,
                read: read
            };
        return $mmSite.write('core_message_delete_message', params).then(function() {
            return self.invalidateDiscussionCache(userId);
        });
    };
        self.getAllContacts = function() {
        return self.getContacts().then(function(contacts) {
            return self.getBlockedContacts().then(function(blocked) {
                contacts.blocked = blocked.users;
                storeUsersFromAllContacts(contacts);
                return contacts;
            }, function() {
                contacts.blocked = [];
                storeUsersFromAllContacts(contacts);
                return contacts;
            });
        });
    };
        self.getBlockedContacts = function() {
        var params = {
                userid: $mmSite.getUserId()
            },
            presets = {
                cacheKey: self._getCacheKeyForBlockedContacts($mmSite.getUserId())
            },
            deferred;
        if (!$mmSite.wsAvailable('core_message_get_blocked_users')) {
            deferred = $q.defer();
            deferred.resolve({users: [], warnings: []});
            return deferred.promise;
        }
        return $mmSite.read('core_message_get_blocked_users', params, presets);
    };
        self._getCacheKeyForContacts = function() {
        return 'mmaMessages:contacts';
    };
        self._getCacheKeyForBlockedContacts = function(userId) {
        return 'mmaMessages:blockedContacts:' + userId;
    };
        self._getCacheKeyForDiscussion = function(userId) {
        return 'mmaMessages:discussion:' + userId;
    };
        self._getCacheKeyForDiscussions = function() {
        return 'mmaMessages:discussions';
    };
        self._getCacheKeyForEnabled = function() {
        return 'mmaMessages:enabled';
    };
        self.getContacts = function() {
        var presets = {
                cacheKey: self._getCacheKeyForContacts()
            };
        return $mmSite.read('core_message_get_contacts', undefined, presets);
    };
        self.getDiscussionEventName = function(userid) {
        return mmaMessagesNewMessageEvent + '_' + $mmSite.getUserId() + '_' + userid;
    };
        self.getDiscussion = function(userId) {
        var messages,
            presets = {
                cacheKey: self._getCacheKeyForDiscussion(userId)
            },
            params = {
                useridto: $mmSite.getUserId(),
                useridfrom: userId,
                limitfrom: 0,
                limitnum: 50
            };
        return self._getRecentMessages(params, presets).then(function(response) {
            messages = response;
            params.useridto = userId;
            params.useridfrom = $mmSite.getUserId();
            return self._getRecentMessages(params, presets).then(function(response) {
                return messages.concat(response);
            });
        });
    };
        self.getDiscussions = function() {
        var discussions = {},
            presets = {
                cacheKey: self._getCacheKeyForDiscussions()
            },
            promise;
        return self._getRecentMessages({
            useridto: $mmSite.getUserId(),
            useridfrom: 0,
            limitfrom: 0,
            limitnum: 50
        }, presets).then(function(messages) {
            angular.forEach(messages, function(message) {
                if (typeof discussions[message.useridfrom] === 'undefined') {
                    discussions[message.useridfrom] = {
                        fullname: message.userfromfullname,
                        profileimageurl: ""
                    };
                    if (!message.timeread) {
                        discussions[message.useridfrom].unread = true;
                    }
                }
                if (typeof discussions[message.useridfrom].message === 'undefined' ||
                        discussions[message.useridfrom].message.timecreated < message.timecreated) {
                    discussions[message.useridfrom].message = {
                        user: message.useridfrom,
                        message: message.smallmessage,
                        timecreated: message.timecreated
                    };
                }
            });
            return self._getRecentMessages({
                useridfrom: $mmSite.getUserId(),
                useridto: 0,
                limitfrom: 0,
                limitnum: 50
            }, presets).then(function(messages) {
                angular.forEach(messages, function(message) {
                    if (typeof discussions[message.useridto] === 'undefined') {
                        discussions[message.useridto] = {
                            fullname: message.usertofullname,
                            profileimageurl: ""
                        };
                        if (!message.timeread) {
                            discussions[message.useridto].unread = true;
                        }
                    }
                    if (typeof discussions[message.useridto].message === 'undefined' ||
                            discussions[message.useridto].message.timecreated < message.timecreated) {
                        discussions[message.useridto].message = {
                            user: message.useridto,
                            message: message.smallmessage,
                            timecreated: message.timecreated
                        };
                    }
                });
                return self.getContacts().then(function(contacts) {
                    var types = ['online', 'offline', 'strangers'];
                    angular.forEach(types, function(type) {
                        if (contacts[type] && contacts[type].length > 0) {
                            angular.forEach(contacts[type], function(contact) {
                                if (typeof discussions[contact.id] === 'undefined' && contact.unread) {
                                    discussions[contact.id] = {
                                        fullname: contact.fullname,
                                        profileimageurl: "",
                                        message: {
                                            user: contact.id,
                                            message: "...",
                                            timecreated: 0,
                                        }
                                    };
                                }
                                if (typeof discussions[contact.id] !== 'undefined') {
                                    if (contact.profileimageurl) {
                                        discussions[contact.id].profileimageurl = contact.profileimageurl;
                                    }
                                    if (typeof contact.unread !== 'undefined') {
                                        discussions[contact.id].unread = contact.unread;
                                    }
                                }
                            });
                        }
                    });
                    return self.getDiscussionsUserImg(discussions).then(function(discussions) {
                        storeUsersFromDiscussions(discussions);
                        return discussions;
                    });
                });
            });
        });
    };
        self.getDiscussionsUserImg = function(discussions) {
        var promises = [];
        angular.forEach(discussions, function(discussion) {
            if (!discussion.profileimageurl) {
                var promise = $mmUser.getProfile(discussion.message.user, 1, true).then(function(user) {
                    discussion.profileimageurl = user.profileimageurl;
                }, function() {
                });
                promises.push(promise);
            }
        });
        return $q.all(promises).then(function() {
            return discussions;
        });
    };
        self._getMessages = function(params, presets) {
        params = angular.extend(params, {
            type: 'conversations',
            newestfirst: 1,
        });
        return $mmSite.read('core_message_get_messages', params, presets).then(function(response) {
            angular.forEach(response.messages, function(message) {
                message.read = params.read == 0 ? 0 : 1;
            });
            return response;
        });
    };
        self._getRecentMessages = function(params, presets) {
        params = angular.extend(params, {
            read: 0
        });
        return self._getMessages(params, presets).then(function(response) {
            var messages = response.messages;
            if (messages) {
                if (messages.length >= params.limitnum) {
                    return messages;
                }
                params.limitnum = params.limitnum - messages.length;
                params.read = 1;
                return self._getMessages(params, presets).then(function(response) {
                    if (response.messages) {
                        messages = messages.concat(response.messages);
                    }
                    return messages;
                }, function() {
                    return messages;
                });
            } else {
                return $q.reject();
            }
        });
    };
        self.invalidateAllContactsCache = function(userId) {
        return self.invalidateContactsCache().then(function() {
            return self.invalidateBlockedContactsCache(userId);
        });
    };
        self.invalidateBlockedContactsCache = function(userId) {
        return $mmSite.invalidateWsCacheForKey(self._getCacheKeyForBlockedContacts(userId));
    };
        self.invalidateContactsCache = function() {
        return $mmSite.invalidateWsCacheForKey(self._getCacheKeyForContacts());
    };
        self.invalidateDiscussionCache = function(userId) {
        return $mmSite.invalidateWsCacheForKey(self._getCacheKeyForDiscussion(userId));
    };
        self.invalidateDiscussionsCache = function(userId) {
        return $mmSite.invalidateWsCacheForKey(self._getCacheKeyForDiscussions()).then(function(){
            return self.invalidateContactsCache();
        });
    };
        self.invalidateEnabledCache = function() {
        return $mmSite.invalidateWsCacheForKey(self._getCacheKeyForEnabled());
    };
        self.isBlocked = function(userId) {
        return self.getBlockedContacts().then(function(blockedContacts) {
            var blocked = false;
            if (!blockedContacts.users || blockedContacts.users.length < 1) {
                return blocked;
            }
            angular.forEach(blockedContacts.users, function(user) {
                if (userId == user.id) {
                    blocked = true;
                }
            });
            return blocked;
        });
    };
        self.isContact = function(userId) {
        return self.getContacts().then(function(contacts) {
            var isContact = false,
                types = ['online', 'offline'];
            angular.forEach(types, function(type) {
                if (contacts[type] && contacts[type].length > 0) {
                    angular.forEach(contacts[type], function(user) {
                        if (userId == user.id) {
                            isContact = true;
                        }
                    });
                }
            });
            return isContact;
        });
    };
        self._isMessagingEnabled = function(siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            var enabled = site.canUseAdvancedFeature('messaging', 'unknown');
            if (enabled === 'unknown') {
                $log.debug('Using WS call to check if messaging is enabled.');
                return site.read('core_message_search_contacts', {
                    searchtext: 'CheckingIfMessagingIsEnabled',
                    onlymycourses: 0
                }, {
                    emergencyCache: false,
                    cacheKey: self._getCacheKeyForEnabled()
                });
            }
            if (enabled) {
                return true;
            }
            return $q.reject();
        });
    };
       self.isMessagingEnabledForSite = function(siteid) {
        return $mmSitesManager.getSite(siteid).then(function(site) {
            if (!site.canUseAdvancedFeature('messaging') || !site.wsAvailable('core_message_get_messages')) {
                return $q.reject();
            }
            $log.debug('Using WS call to check if messaging is enabled.');
            return site.read('core_message_search_contacts', {
                searchtext: 'CheckingIfMessagingIsEnabled',
                onlymycourses: 0
            }, {
                emergencyCache: false,
                cacheKey: self._getCacheKeyForEnabled()
            });
        });
    };
        self.isPluginEnabled = function(siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            if (!site.canUseAdvancedFeature('messaging')) {
                return false;
            } else if (!site.wsAvailable('core_message_get_messages')) {
                return false;
            } else {
                return self._isMessagingEnabled(siteId).then(function() {
                    return true;
                });
            }
        });
    };
        self.isSearchEnabled = function() {
        return $mmSite.wsAvailable('core_message_search_contacts');
    };
        self.removeContact = function(userId) {
        return $mmSite.write('core_message_delete_contacts', {
            userids: [ userId ]
        }, {
            responseExpected: false
        }).then(function() {
            return self.invalidateContactsCache();
        });
    };
        self.searchContacts = function(query, limit) {
        var data = {
                searchtext: query,
                onlymycourses: 0
            };
        limit = typeof limit === 'undefined' ? 100 : limit;
        return $mmSite.read('core_message_search_contacts', data).then(function(contacts) {
            if (limit && contacts.length > limit) {
                contacts = contacts.splice(0, limit);
            }
            $mmUser.storeUsers(contacts);
            return contacts;
        });
    };
        self.sendMessage = function(to, message) {
        return $mmSite.write('core_message_send_instant_messages', {
            messages: [
                {
                    touserid: to,
                    text: message,
                    textformat: 1
                }
            ]
        }).then(function(response) {
            if (response && response[0] && response[0].msgid === -1) {
                return $q.reject(response[0].errormessage);
            }
            return self.invalidateDiscussionCache(to);
        });
    };
        self.sortMessages = function(messages) {
        return messages.sort(function (a, b) {
            a = parseInt(a.timecreated, 10);
            b = parseInt(b.timecreated, 10);
            return a >= b ? 1 : -1;
        });
    };
        function storeUsersFromAllContacts(contactTypes) {
        angular.forEach(contactTypes, function(contacts) {
            $mmUser.storeUsers(contacts);
        });
    }
        function storeUsersFromDiscussions(discussions) {
        angular.forEach(discussions, function(discussion, userid) {
            if (typeof userid != 'undefined' && !isNaN(parseInt(userid))) {
                $mmUser.storeUser(userid, discussion.fullname, discussion.profileimageurl);
            }
        });
    }
        self.unblockContact = function(userId) {
        return $mmSite.write('core_message_unblock_contacts', {
            userids: [ userId ]
        }, {
            responseExpected: false
        }).then(function() {
            return self.invalidateAllContactsCache($mmSite.getUserId());
        });
    };
    return self;
}]);

angular.module('mm.addons.notes')
.controller('mmaNotesListCtrl', ["$scope", "$stateParams", "$mmUtil", "$mmaNotes", "$mmSite", "$translate", function($scope, $stateParams, $mmUtil, $mmaNotes, $mmSite, $translate) {
    var courseid = $stateParams.courseid,
        type = $stateParams.type;
    $scope.courseid = courseid;
    $scope.type = type;
    $translate('mma.notes.' + type + 'notes').then(function(string) {
        $scope.title = string;
    });
    function fetchNotes(refresh) {
        return $mmaNotes.getNotes(courseid, refresh).then(function(notes) {
            notes = notes[type + 'notes'];
            return $mmaNotes.getNotesUserData(notes, courseid).then(function(notes) {
                $scope.notes = notes;
            });
        }, function(message) {
            $mmUtil.showErrorModal(message);
        });
    }
    fetchNotes().then(function() {
        $mmSite.write('core_notes_view_notes', {
            courseid: courseid,
            userid: 0
        });
    })
    .finally(function() {
        $scope.notesLoaded = true;
    });
    $scope.refreshNotes = function() {
        fetchNotes(true).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
}]);

angular.module('mm.addons.notes')
.controller('mmaNotesTypesCtrl', ["$scope", "$stateParams", function($scope, $stateParams) {
    var course = $stateParams.course,
        courseid = course.id;
    $scope.courseid = courseid;
}]);

angular.module('mm.addons.notes')
.factory('$mmaNotesHandlers', ["$mmaNotes", "$mmSite", "$mmApp", "$ionicModal", "$mmUtil", "$q", "mmCoursesAccessMethods", function($mmaNotes, $mmSite, $mmApp, $ionicModal, $mmUtil, $q, mmCoursesAccessMethods) {
    var self = {},
        addNoteEnabledCache = {},
        coursesNavEnabledCache = {};
        self.clearAddNoteCache = function(courseId) {
        if (courseId) {
            delete addNoteEnabledCache[courseId];
        } else {
            addNoteEnabledCache = {};
        }
    };
        self.clearCoursesNavCache = function() {
        coursesNavEnabledCache = {};
    };
        self.addNote = function() {
        var self = {};
                self.isEnabled = function() {
            return $mmaNotes.isPluginAddNoteEnabled();
        };
                self.isEnabledForUser = function(user, courseId) {
            if (!courseId || user.id == $mmSite.getUserId()) {
                return $q.when(false);
            }
            if (typeof addNoteEnabledCache[courseId] != 'undefined') {
                return addNoteEnabledCache[courseId];
            }
            return $mmaNotes.isPluginAddNoteEnabledForCourse(courseId).then(function(enabled) {
                addNoteEnabledCache[courseId] = enabled;
                return enabled;
            });
        };
                self.getController = function(user, courseid) {
                        return function($scope) {
                $scope.title = 'mma.notes.addnewnote';
                $scope.class = 'mma-notes-add-handler';
                $ionicModal.fromTemplateUrl('addons/notes/templates/add.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(m) {
                    $scope.modal = m;
                });
                $scope.closeModal = function(){
                    $scope.modal.hide();
                };
                $scope.addNote = function(){
                    $mmApp.closeKeyboard();
                    var loadingModal = $mmUtil.showModalLoading('mm.core.sending', true);
                    $scope.processing = true;
                    $mmaNotes.addNote(user.id, courseid, $scope.note.publishstate, $scope.note.text).then(function() {
                        $mmUtil.showModal('mm.core.success', 'mma.notes.eventnotecreated');
                        $scope.closeModal();
                    }, function(error) {
                        $mmUtil.showErrorModal(error);
                        $scope.processing = false;
                    }).finally(function() {
                        loadingModal.dismiss();
                    });
                };
                $scope.action = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.note = {
                        publishstate: 'personal',
                        text: ''
                    };
                    $scope.processing = false;
                    $scope.modal.show();
                };
            };
        };
        return self;
    };
        self.coursesNav = function() {
        var self = {};
                self.isEnabled = function() {
            return $mmaNotes.isPluginViewNotesEnabled();
        };
                self.isEnabledForCourse = function(courseId, accessData) {
            if (accessData && accessData.type == mmCoursesAccessMethods.guest) {
                return false;
            }
            if (typeof coursesNavEnabledCache[courseId] != 'undefined') {
                return coursesNavEnabledCache[courseId];
            }
            return $mmaNotes.isPluginViewNotesEnabledForCourse(courseId).then(function(enabled) {
                coursesNavEnabledCache[courseId] = enabled;
                return enabled;
            });
        };
                self.getController = function(courseId) {
                        return function($scope, $state) {
                $scope.icon = 'ion-ios-list';
                $scope.title = 'mma.notes.notes';
                $scope.class = 'mma-notes-view-handler';
                $scope.action = function($event, course) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $state.go('site.notes-types', {
                        course: course
                    });
                };
            };
        };
        return self;
    };
    return self;
}])
.run(["$mmaNotesHandlers", "$mmEvents", "mmCoreEventLogout", "mmCoursesEventMyCoursesRefreshed", "mmUserEventProfileRefreshed", function($mmaNotesHandlers, $mmEvents, mmCoreEventLogout, mmCoursesEventMyCoursesRefreshed, mmUserEventProfileRefreshed) {
    $mmEvents.on(mmCoreEventLogout, function() {
        $mmaNotesHandlers.clearAddNoteCache();
        $mmaNotesHandlers.clearCoursesNavCache();
    });
    $mmEvents.on(mmCoursesEventMyCoursesRefreshed, $mmaNotesHandlers.clearCoursesNavCache);
    $mmEvents.on(mmUserEventProfileRefreshed, function(data) {
        $mmaNotesHandlers.clearAddNoteCache(data.courseid);
    });
}]);

angular.module('mm.addons.notes')
.factory('$mmaNotes', ["$mmSite", "$log", "$q", "$mmUser", "$translate", function($mmSite, $log, $q, $mmUser, $translate) {
    $log = $log.getInstance('$mmaNotes');
    var self = {};
        self.addNote = function(userId, courseId, publishState, noteText) {
        var data = {
            "notes[0][userid]" : userId,
            "notes[0][publishstate]": publishState,
            "notes[0][courseid]": courseId,
            "notes[0][text]": noteText,
            "notes[0][format]": 1
        };
        return $mmSite.write('core_notes_create_notes', data).then(function(response) {
            if (!response || !response.length) {
                return $q.reject();
            }
            if (response[0].noteid == -1) {
                return $q.reject(response[0].errormessage);
            }
            return response;
        });
    };
        self.isPluginAddNoteEnabled = function() {
        if (!$mmSite.isLoggedIn()) {
            return false;
        } else if (!$mmSite.canUseAdvancedFeature('enablenotes')) {
            return false;
        } else if (!$mmSite.wsAvailable('core_notes_create_notes')) {
            return false;
        }
        return true;
    };
        self.isPluginAddNoteEnabledForCourse = function(courseId) {
        var data = {
            "notes[0][userid]" : -1,
            "notes[0][courseid]": courseId,
            "notes[0][publishstate]": 'personal',
            "notes[0][text]": '',
            "notes[0][format]": 1
        };
        return $mmSite.read('core_notes_create_notes', data).then(function() {
            return true;
        }).catch(function() {
            return false;
        });
    };
        self.isPluginViewNotesEnabled = function() {
        if (!$mmSite.isLoggedIn()) {
            return false;
        } else if (!$mmSite.canUseAdvancedFeature('enablenotes')) {
            return false;
        } else if (!$mmSite.wsAvailable('core_notes_get_course_notes')) {
            return false;
        }
        return true;
    };
        self.isPluginViewNotesEnabledForCourse = function(courseId) {
        return self.getNotes(courseId).then(function() {
            return true;
        }).catch(function() {
            return false;
        });
    };
        self.getNotes = function(courseid, refresh) {
        $log.debug('Get notes for course ' + courseid);
        var data = {
                courseid : courseid
            },
            presets = {};
        if (refresh) {
            presets.getFromCache = false;
        }
        return $mmSite.read('core_notes_get_course_notes', data, presets);
    };
        self.getNotesUserData = function(notes, courseid) {
        var promises = [];
        angular.forEach(notes, function(note) {
            var promise = $mmUser.getProfile(note.userid, courseid, true).then(function(user) {
                note.userfullname = user.fullname;
                note.userprofileimageurl = user.profileimageurl;
            }, function() {
                return $translate('mma.notes.userwithid', {id: note.userid}).then(function(str) {
                    note.userfullname = str;
                });
            });
            promises.push(promise);
        });
        return $q.all(promises).then(function() {
            return notes;
        });
    };
    return self;
}]);

angular.module('mm.addons.notifications')
.controller('mmaNotificationsListCtrl', ["$scope", "$mmUtil", "$mmaNotifications", "mmaNotificationsListLimit", "mmUserProfileState", function($scope, $mmUtil, $mmaNotifications, mmaNotificationsListLimit,
            mmUserProfileState) {
    var readCount = 0,
        unreadCount = 0;
    $scope.notifications = [];
    $scope.userStateName = mmUserProfileState;
    function fetchNotifications(refresh) {
        if (refresh) {
            readCount = 0;
            unreadCount = 0;
        }
        return $mmaNotifications.getUnreadNotifications(unreadCount, mmaNotificationsListLimit).then(function(unread) {
            unreadCount += unread.length;
            if (unread.length < mmaNotificationsListLimit) {
                var readLimit = mmaNotificationsListLimit - unread.length;
                return $mmaNotifications.getReadNotifications(readCount, readLimit).then(function(read) {
                    readCount += read.length;
                    if (refresh) {
                        $scope.notifications = unread.concat(read);
                    } else {
                        $scope.notifications = $scope.notifications.concat(unread).concat(read);
                    }
                    $scope.canLoadMore = read.length >= readLimit;
                }, function(error) {
                    if (unread.length == 0) {
                        if (error) {
                            $mmUtil.showErrorModal(error);
                        } else {
                            $mmUtil.showErrorModal('mma.notifications.errorgetnotifications', true);
                        }
                        $scope.canLoadMore = false;
                    }
                });
            } else {
                if (refresh) {
                    $scope.notifications = unread;
                } else {
                    $scope.notifications = $scope.notifications.concat(unread);
                }
                $scope.canLoadMore = true;
            }
        }, function(error) {
            if (error) {
                $mmUtil.showErrorModal(error);
            } else {
                $mmUtil.showErrorModal('mma.notifications.errorgetnotifications', true);
            }
            $scope.canLoadMore = false;
        });
    }
    fetchNotifications().finally(function() {
        $scope.notificationsLoaded = true;
    });
    $scope.refreshNotifications = function() {
        $mmaNotifications.invalidateNotificationsList().finally(function() {
            fetchNotifications(true).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        });
    };
    $scope.loadMoreNotifications = function(){
        fetchNotifications().finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
}]);

angular.module('mm.addons.notifications')
.directive('mmaNotificationsActions', ["$log", "$mmContentLinksDelegate", function($log, $mmContentLinksDelegate) {
    $log = $log.getInstance('mmaNotificationsActions');
    function link(scope) {
        if (scope.contexturl) {
            $mmContentLinksDelegate.getActionsFor(scope.contexturl, scope.courseid).then(function(actions) {
                scope.actions = actions;
            });
        }
    }
    return {
        link: link,
        restrict: 'E',
        scope: {
            contexturl: '=',
            courseid: '='
        },
        templateUrl: 'addons/notifications/templates/actions.html',
    };
}]);

angular.module('mm.addons.notifications')
.filter('mmaNotificationsFormat', ["$mmText", function($mmText) {
  return function(text) {
    text = text.replace(/-{4,}/ig, '');
    text = $mmText.replaceNewLines(text, '<br />');
    return text;
  };
}]);

angular.module('mm.addons.notifications')
.factory('$mmaNotificationsHandlers', ["$log", "$mmaNotifications", function($log, $mmaNotifications) {
    $log = $log.getInstance('$mmaNotificationsHandlers');
    var self = {};
        self.sideMenuNav = function() {
        var self = {};
                self.isEnabled = function() {
            return $mmaNotifications.isPluginEnabled();
        };
                self.getController = function() {
                        return function($scope) {
                $scope.icon = 'ion-ios-bell';
                $scope.title = 'mma.notifications.notifications';
                $scope.state = 'site.notifications';
                $scope.class = 'mma-notifications-handler';
            };
        };
        return self;
    };
    return self;
}]);

angular.module('mm.addons.notifications')
.factory('$mmaNotifications', ["$q", "$log", "$mmSite", "$mmSitesManager", "$mmUser", "mmaNotificationsListLimit", function($q, $log, $mmSite, $mmSitesManager, $mmUser, mmaNotificationsListLimit) {
    $log = $log.getInstance('$mmaNotifications');
    var self = {};
    function formatNotificationsData(notifications) {
        angular.forEach(notifications, function(notification) {
            if (notification.contexturl && notification.contexturl.indexOf('/mod/forum/')) {
                notification.mobiletext = notification.smallmessage;
            } else {
                notification.mobiletext = notification.fullmessage;
            }
            var cid = notification.fullmessagehtml.match(/course\/view\.php\?id=([^"]*)/);
            if (cid && cid[1]) {
                notification.courseid = cid[1];
            }
            $mmUser.getProfile(notification.useridfrom, notification.courseid, true).then(function(user) {
                notification.profileimageurlfrom = user.profileimageurl;
            });
        });
    }
        function getNotificationsCacheKey() {
        return 'mmaNotifications:list';
    }
        self.getNotifications = function(read, limitFrom, limitNumber) {
        limitFrom = limitFrom || 0;
        limitNumber = limitNumber || mmaNotificationsListLimit;
        $log.debug('Get ' + (read ? 'read' : 'unread') + ' notifications from ' + limitFrom + '. Limit: ' + limitNumber);
        var data = {
            useridto: $mmSite.getUserId(),
            useridfrom: 0,
            type: 'notifications',
            read: read ? 1 : 0,
            newestfirst: 1,
            limitfrom: limitFrom,
            limitnum: limitNumber
        };
        var preSets = {
            cacheKey: getNotificationsCacheKey()
        };
        return $mmSite.read('core_message_get_messages', data, preSets).then(function(response) {
            if (response.messages) {
                var notifications = response.messages;
                formatNotificationsData(notifications);
                return notifications;
            } else {
                return $q.reject();
            }
        });
    };
        self.getReadNotifications = function(limitFrom, limitNumber) {
        return self.getNotifications(true, limitFrom, limitNumber);
    };
        self.getUnreadNotifications = function(limitFrom, limitNumber) {
        return self.getNotifications(false, limitFrom, limitNumber);
    };
        self.invalidateNotificationsList = function() {
        return $mmSite.invalidateWsCacheForKey(getNotificationsCacheKey());
    };
        self.isPluginEnabled = function() {
        return $mmSite.wsAvailable('core_message_get_messages');
    };
        self.isPluginEnabledForSite = function(siteid) {
        return $mmSitesManager.getSite(siteid).then(function(site) {
            if (!site.wsAvailable('core_message_get_messages')) {
                return $q.reject();
            }
        });
    };
    return self;
}]);

angular.module('mm.addons.participants')
.controller('mmaParticipantsListCtrl', ["$scope", "$state", "$stateParams", "$mmUtil", "$mmaParticipants", "$ionicPlatform", "$mmSite", "mmUserProfileState", function($scope, $state, $stateParams, $mmUtil, $mmaParticipants, $ionicPlatform, $mmSite,
            mmUserProfileState) {
    var course = $stateParams.course,
        courseid = course.id;
    $scope.participants = [];
    $scope.courseid = courseid;
    $scope.userStateName = mmUserProfileState;
    function fetchParticipants(refresh) {
        var firstToGet = refresh ? 0 : $scope.participants.length;
        return $mmaParticipants.getParticipants(courseid, firstToGet).then(function(data) {
            if (refresh) {
                $scope.participants = data.participants;
            } else {
                $scope.participants = $scope.participants.concat(data.participants);
            }
            $scope.canLoadMore = data.canLoadMore;
        }, function(message) {
            $mmUtil.showErrorModal(message);
            $scope.canLoadMore = false;
        });
    }
    fetchParticipants(true).then(function() {
        $mmSite.write('core_user_view_user_list', {
            courseid: courseid
        });
    }).finally(function() {
        $scope.participantsLoaded = true;
    });
    $scope.loadMoreParticipants = function(){
        fetchParticipants().finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
    $scope.refreshParticipants = function() {
        $mmaParticipants.invalidateParticipantsList(courseid).finally(function() {
            fetchParticipants(true).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        });
    };
}]);

angular.module('mm.addons.participants')
.factory('$mmaParticipantsHandlers', ["$mmaParticipants", "mmCoursesAccessMethods", "$mmUtil", "$state", function($mmaParticipants, mmCoursesAccessMethods, $mmUtil, $state) {
    var self = {};
        self.coursesNavHandler = function() {
        var self = {};
                self.isEnabled = function() {
            return true;
        };
                self.isEnabledForCourse = function(courseId, accessData) {
            if (accessData && accessData.type == mmCoursesAccessMethods.guest) {
                return false;
            }
            return $mmaParticipants.isPluginEnabledForCourse(courseId);
        };
                self.getController = function(courseId) {
            return function($scope, $state) {
                $scope.icon = 'ion-person-stalker';
                $scope.title = 'mma.participants.participants';
                $scope.class = 'mma-participants-handler';
                $scope.action = function($event, course) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $state.go('site.participants', {
                        course: course
                    });
                };
            };
        };
        return self;
    };
        self.linksHandler = function() {
        var self = {};
                self.getActions = function(siteIds, url) {
            if (typeof self.handles(url) != 'undefined') {
                var params = $mmUtil.extractUrlParams(url);
                if (typeof params.id != 'undefined') {
                    return [{
                        message: 'mm.core.view',
                        icon: 'ion-eye',
                        sites: siteIds,
                        action: function(siteId) {
                            $state.go('redirect', {
                                siteid: siteId,
                                state: 'site.participants',
                                params: {
                                    course: {id: parseInt(params.id, 10)}
                                }
                            });
                        }
                    }];
                }
            }
            return [];
        };
                self.handles = function(url) {
            if (url.indexOf('grade/report/user') == -1) {
                var position = url.indexOf('/user/index.php');
                if (position > -1) {
                    return url.substr(0, position);
                }
            }
        };
        return self;
    };
    return self;
}]);

angular.module('mm.addons.participants')
.factory('$mmaParticipants', ["$log", "$mmSite", "$mmUser", "mmaParticipantsListLimit", function($log, $mmSite, $mmUser, mmaParticipantsListLimit) {
    $log = $log.getInstance('$mmaParticipants');
    var self = {};
        function getParticipantsListCacheKey(courseid) {
        return 'mmaParticipants:list:'+courseid;
    }
        self.getParticipants = function(courseid, limitFrom, limitNumber) {
        if (typeof limitFrom == 'undefined') {
            limitFrom = 0;
        }
        if (typeof limitNumber == 'undefined') {
            limitNumber = mmaParticipantsListLimit;
        }
        $log.debug('Get participants for course ' + courseid + ' starting at ' + limitFrom);
        var wsName,
            data = {
                courseid: courseid
            }, preSets = {
                cacheKey: getParticipantsListCacheKey(courseid)
            };
        if ($mmSite.wsAvailable('core_enrol_get_enrolled_users')) {
            wsName = 'core_enrol_get_enrolled_users';
            data.options = [
                {
                    name: 'limitfrom',
                    value: limitFrom
                },
                {
                    name: 'limitnumber',
                    value: limitNumber
                },
                {
                    name: 'sortby',
                    value: 'siteorder'
                }
            ];
        } else {
            wsName = 'moodle_enrol_get_enrolled_users';
            limitNumber = 9999999999;
        }
        return $mmSite.read(wsName, data, preSets).then(function(users) {
            angular.forEach(users, function(user) {
                if (typeof user.id == 'undefined' && typeof user.userid != 'undefined') {
                    user.id = user.userid;
                }
                if (typeof user.profileimageurl == 'undefined' && typeof user.profileimgurl != 'undefined') {
                    user.profileimageurl = user.profileimgurl;
                }
            });
            var canLoadMore = users.length >= limitNumber;
            $mmUser.storeUsers(users);
            return {participants: users, canLoadMore: canLoadMore};
        });
    };
        self.invalidateParticipantsList = function(courseid) {
        return $mmSite.invalidateWsCacheForKey(getParticipantsListCacheKey(courseid));
    };
        self.isPluginEnabledForCourse = function(courseId) {
        if (!courseId) {
            return $q.reject();
        }
        return self.getParticipants(courseId, 0, 1).then(function(parcitipants) {
            return true;
        }).catch(function(error) {
            return false;
        });
    };
    return self;
}]);

angular.module('mm.addons.pushnotifications')
.factory('$mmPushNotificationsDelegate', ["$log", function($log) {
    $log = $log.getInstance('$mmPushNotificationsDelegate');
    var handlers = {},
        self = {};
        self.clicked = function(notification) {
        for (var name in handlers) {
            var callback = handlers[name];
            if (typeof callback == 'function') {
                var treated = callback(notification);
                if (treated) {
                    return;
                }
            }
        }
    };
        self.registerHandler = function(name, callback) {
        $log.debug("Registered handler '" + name + "' as push notification handler.");
        handlers[name] = callback;
    };
    return self;
}]);

angular.module('mm.addons.pushnotifications')
.factory('$mmaPushNotifications', ["$mmSite", "$log", "$cordovaPushV5", "$mmText", "$q", "$cordovaDevice", "$mmUtil", "mmCoreConfigConstants", "$mmApp", "$mmLocalNotifications", "$mmPushNotificationsDelegate", "$mmSitesManager", "mmaPushNotificationsComponent", function($mmSite, $log, $cordovaPushV5, $mmText, $q, $cordovaDevice, $mmUtil, mmCoreConfigConstants,
            $mmApp, $mmLocalNotifications, $mmPushNotificationsDelegate, $mmSitesManager, mmaPushNotificationsComponent) {
    $log = $log.getInstance('$mmaPushNotifications');
    var self = {},
        pushID;
        self.isPluginEnabled = function() {
        return $mmSite.wsAvailable('core_user_add_user_device')
                && $mmSite.wsAvailable('message_airnotifier_is_system_configured')
                && $mmSite.wsAvailable('message_airnotifier_are_notification_preferences_configured');
    };
        self.notificationClicked = function(notification) {
        $mmApp.ready().then(function() {
            $mmPushNotificationsDelegate.clicked(notification);
        });
    };
        self.onMessageReceived = function(notification) {
        var promise,
            data = notification ? notification.additionalData : {};
        if (data.site) {
            promise = $mmSitesManager.getSite(data.site);
        } else {
            promise = $q.when();
        }
        promise.then(function() {
            if ($mmUtil.isTrueOrOne(data.foreground)) {
                if ($mmLocalNotifications.isAvailable()) {
                    var localNotif = {
                            id: 1,
                            at: new Date(),
                            data: {
                                notif: data.notif,
                                site: data.site
                            }
                        },
                        promises = [];
                    promises.push($mmText.formatText(notification.title, true, true).then(function(formattedTitle) {
                        localNotif.title = formattedTitle;
                    }).catch(function() {
                        localNotif.title = notification.title;
                    }));
                    promises.push($mmText.formatText(notification.message, true, true).then(function(formattedMessage) {
                        localNotif.text = formattedMessage;
                    }).catch(function() {
                        localNotif.text = notification.message;
                    }));
                    $q.all(promises).then(function() {
                        $mmLocalNotifications.schedule(localNotif, mmaPushNotificationsComponent, data.site);
                    });
                }
            } else {
                data.title = notification.title;
                data.message = notification.message;
                self.notificationClicked(data);
            }
        });
    };
        self.registerDevice = function() {
        try {
            var options = {
                android: {
                    senderID: mmCoreConfigConstants.gcmpn
                },
                ios: {
                    alert: true,
                    badge: true,
                    sound: true
                }
            };
            return $cordovaPushV5.initialize(options).then(function() {
                $cordovaPushV5.onNotification();
                $cordovaPushV5.onError();
                return $cordovaPushV5.register().then(function(token) {
                    pushID = token;
                    return self.registerDeviceOnMoodle();
                });
            });
        } catch(ex) {}
        return $q.reject();
    };
        self.registerDeviceOnMoodle = function() {
        $log.debug('Register device on Moodle.');
        if (!$mmSite.isLoggedIn() || !pushID || !$mmApp.isDevice()) {
            return $q.reject();
        }
        var data = {
            appid:      mmCoreConfigConstants.app_id,
            name:       ionic.Platform.device().name || '',
            model:      $cordovaDevice.getModel(),
            platform:   $cordovaDevice.getPlatform(),
            version:    $cordovaDevice.getVersion(),
            pushid:     pushID,
            uuid:       $cordovaDevice.getUUID()
        };
        return $mmSite.write('core_user_add_user_device', data);
    };
        self.unregisterDeviceOnMoodle = function(site) {
        if (!site || !$mmApp.isDevice()) {
            return $q.reject();
        }
        $log.debug('Unregister device on Moodle: ' + site.id);
        var data = {
            appid: mmCoreConfigConstants.app_id,
            uuid:  $cordovaDevice.getUUID()
        };
        return site.write('core_user_remove_user_device', data).then(function(response) {
            if (!response || !response.removed) {
                return $q.reject();
            }
        });
    };
    return self;
}]);

angular.module('mm.addons.qbehaviour_adaptive')
.factory('$mmaQbehaviourAdaptiveHandler', ["$mmQuestionHelper", function($mmQuestionHelper) {
    var self = {};
        self.isEnabled = function() {
        return true;
    };
        self.handleQuestion = function(question) {
        $mmQuestionHelper.extractQbehaviourButtons(question);
    };
    return self;
}]);

angular.module('mm.addons.qbehaviour_adaptivenopenalty')
.factory('$mmaQbehaviourAdaptiveNoPenaltyHandler', ["$mmQuestionHelper", function($mmQuestionHelper) {
    var self = {};
        self.isEnabled = function() {
        return true;
    };
        self.handleQuestion = function(question) {
        $mmQuestionHelper.extractQbehaviourButtons(question);
    };
    return self;
}]);

angular.module('mm.addons.qbehaviour_deferredcbm')
.directive('mmaQbehaviourDeferredCbm', function() {
    return {
        restrict: 'A',
        priority: 100,
        templateUrl: 'addons/qbehaviour/deferredcbm/template.html'
    };
});

angular.module('mm.addons.qbehaviour_deferredcbm')
.factory('$mmaQbehaviourDeferredCBMHandler', ["$mmQuestionHelper", "$mmaQbehaviourDeferredFeedbackHandler", "$mmQuestion", function($mmQuestionHelper, $mmaQbehaviourDeferredFeedbackHandler, $mmQuestion) {
    var self = {};
        self.determineQuestionState = function(component, attemptId, question, siteId) {
        return $mmaQbehaviourDeferredFeedbackHandler.determineQuestionState(
                    component, attemptId, question, siteId, self.isCompleteResponse, self.isSameResponse);
    };
        self.isCompleteResponse = function(question, answers) {
        var complete = $mmQuestion.isCompleteResponse(question, answers);
        if (complete && complete != -1) {
            return !!answers['-certainty'];
        }
        return complete;
    };
        self.isSameResponse = function(question, prevAnswers, prevBasicAnswers, newAnswers, newBasicAnswers) {
        var same = $mmQuestion.isSameResponse(question, prevBasicAnswers, newBasicAnswers);
        if (same) {
            return prevAnswers['-certainty'] == newAnswers['-certainty'];
        }
        return same;
    };
        self.isEnabled = function() {
        return true;
    };
        self.handleQuestion = function(question) {
        if ($mmQuestionHelper.extractQbehaviourCBM(question)) {
            return ['mma-qbehaviour-deferred-cbm'];
        }
    };
    return self;
}]);

angular.module('mm.addons.qbehaviour_deferredfeedback')
.factory('$mmaQbehaviourDeferredFeedbackHandler', ["$mmQuestion", function($mmQuestion) {
    var self = {};
        self.determineQuestionState = function(component, attemptId, question, siteId, isComplete, isSame) {
        return $mmQuestion.getQuestion(component, attemptId, question.slot, siteId).catch(function() {
            return question;
        }).then(function(dbQuestion) {
            var state = $mmQuestion.getState(dbQuestion.state);
            if (state.finished || !state.active) {
                return false;
            }
            return $mmQuestion.getQuestionAnswers(component, attemptId, question.slot, false, siteId);
        }).then(function(prevAnswers) {
            var complete,
                gradable,
                newState,
                prevBasicAnswers,
                newBasicAnswers = $mmQuestion.getBasicAnswers(question.answers);
            prevAnswers = $mmQuestion.convertAnswersArrayToObject(prevAnswers, true);
            prevBasicAnswers = $mmQuestion.getBasicAnswers(prevAnswers);
            if (typeof isSame == 'function') {
                if (isSame(question, prevAnswers, prevBasicAnswers, question.answers, newBasicAnswers)) {
                    return false;
                }
            } else {
                if ($mmQuestion.isSameResponse(question, prevBasicAnswers, newBasicAnswers)) {
                    return false;
                }
            }
            if (typeof isComplete == 'function') {
                complete = isComplete(question, question.answers);
            } else {
                complete = $mmQuestion.isCompleteResponse(question, newBasicAnswers);
            }
            if (complete == -1) {
                newState = 'unknown';
            } else if (complete) {
                newState = 'complete';
            } else {
                gradable = $mmQuestion.isGradableResponse(question, newBasicAnswers);
                if (gradable == -1) {
                    newState = 'unknown';
                } else if (gradable) {
                    newState = 'invalid';
                } else {
                    newState = 'todo';
                }
            }
            return $mmQuestion.getState(newState);
        });
    };
        self.isEnabled = function() {
        return true;
    };
        self.handleQuestion = function(question) {
    };
    return self;
}]);

angular.module('mm.addons.qbehaviour_immediatecbm')
.factory('$mmaQbehaviourImmediateCBMHandler', ["$mmQuestionHelper", function($mmQuestionHelper) {
    var self = {};
        self.isEnabled = function() {
        return true;
    };
        self.handleQuestion = function(question) {
        $mmQuestionHelper.extractQbehaviourButtons(question);
        if ($mmQuestionHelper.extractQbehaviourCBM(question)) {
            return ['mma-qbehaviour-deferred-cbm'];
        }
    };
    return self;
}]);

angular.module('mm.addons.qbehaviour_immediatefeedback')
.factory('$mmaQbehaviourImmediateFeedbackHandler', ["$mmQuestionHelper", function($mmQuestionHelper) {
    var self = {};
        self.isEnabled = function() {
        return true;
    };
        self.handleQuestion = function(question) {
        $mmQuestionHelper.extractQbehaviourButtons(question);
    };
    return self;
}]);

angular.module('mm.addons.qbehaviour_informationitem')
.directive('mmaQbehaviourInformationItem', function() {
    return {
        restrict: 'A',
        priority: 100,
        templateUrl: 'addons/qbehaviour/informationitem/template.html'
    };
});

angular.module('mm.addons.qbehaviour_informationitem')
.factory('$mmaQbehaviourInformationItemHandler', ["$mmQuestionHelper", "$mmQuestion", function($mmQuestionHelper, $mmQuestion) {
    var self = {};
        self.determineQuestionState = function(component, attemptId, question, siteId, isComplete, isSame) {
        if (question.answers['-seen']) {
            return $mmQuestion.getState('complete');
        }
        return false;
    };
        self.isEnabled = function() {
        return true;
    };
        self.handleQuestion = function(question) {
        if ($mmQuestionHelper.extractQbehaviourSeenInput(question)) {
            return ['mma-qbehaviour-information-item'];
        }
    };
    return self;
}]);

angular.module('mm.addons.qbehaviour_interactive')
.factory('$mmaQbehaviourInteractiveHandler', ["$mmQuestionHelper", function($mmQuestionHelper) {
    var self = {};
        self.isEnabled = function() {
        return true;
    };
        self.handleQuestion = function(question) {
        $mmQuestionHelper.extractQbehaviourButtons(question);
    };
    return self;
}]);

angular.module('mm.addons.qbehaviour_interactivecountback')
.factory('$mmaQbehaviourInteractiveCountbackHandler', ["$mmQuestionHelper", function($mmQuestionHelper) {
    var self = {};
        self.isEnabled = function() {
        return true;
    };
        self.handleQuestion = function(question) {
        $mmQuestionHelper.extractQbehaviourButtons(question);
    };
    return self;
}]);

angular.module('mm.addons.qbehaviour_manualgraded')
.factory('$mmaQbehaviourManualGradedHandler', ["$mmQuestion", function($mmQuestion) {
    var self = {};
        self.determineQuestionState = function(component, attemptId, question, siteId, isComplete, isSame) {
        return $mmQuestion.getQuestion(component, attemptId, question.slot, siteId).catch(function() {
            return question;
        }).then(function(dbQuestion) {
            var state = $mmQuestion.getState(dbQuestion.state);
            if (state.finished || !state.active) {
                return false;
            }
            return $mmQuestion.getQuestionAnswers(component, attemptId, question.slot, false, siteId);
        }).then(function(prevAnswers) {
            var complete,
                newState,
                prevBasicAnswers,
                newBasicAnswers = $mmQuestion.getBasicAnswers(question.answers);
            prevAnswers = $mmQuestion.convertAnswersArrayToObject(prevAnswers);
            prevBasicAnswers = $mmQuestion.getBasicAnswers(prevAnswers);
            if (typeof isSame == 'function') {
                if (isSame(question, prevAnswers, prevBasicAnswers, question.answers, newBasicAnswers)) {
                    return false;
                }
            } else {
                if ($mmQuestion.isSameResponse(question, prevBasicAnswers, newBasicAnswers)) {
                    return false;
                }
            }
            if (typeof isComplete == 'function') {
                complete = isComplete(question, question.answers);
            } else {
                complete = $mmQuestion.isCompleteResponse(question, newBasicAnswers);
            }
            if (complete == -1) {
                newState = 'unknown';
            } else if (complete) {
                newState = 'complete';
            } else {
                newState = 'todo';
            }
            return $mmQuestion.getState(newState);
        });
    };
        self.isEnabled = function() {
        return true;
    };
        self.handleQuestion = function(question) {
    };
    return self;
}]);

angular.module('mm.addons.qtype_calculated')
.directive('mmaQtypeCalculated', ["$log", "$mmQuestionHelper", function($log, $mmQuestionHelper) {
	$log = $log.getInstance('mmaQtypeCalculated');
    return {
        restrict: 'A',
        priority: 100,
        templateUrl: 'addons/qtype/shortanswer/template.html',
        link: function(scope) {
            $mmQuestionHelper.inputTextDirective(scope, $log);
        }
    };
}]);

angular.module('mm.addons.qtype_calculated')
.factory('$mmaQtypeCalculatedHandler', ["$mmaQtypeNumericalHandler", function($mmaQtypeNumericalHandler) {
    var self = {};
        self.isCompleteResponse = function(question, answers) {
        return $mmaQtypeNumericalHandler.isCompleteResponse(question, answers);
    };
        self.isEnabled = function() {
        return true;
    };
        self.isGradableResponse = function(question, answers) {
        return $mmaQtypeNumericalHandler.isGradableResponse(question, answers);
    };
        self.isSameResponse = function(question, prevAnswers, newAnswers) {
        return $mmaQtypeNumericalHandler.isSameResponse(question, prevAnswers, newAnswers);
    };
        self.getDirectiveName = function(question) {
        return 'mma-qtype-calculated';
    };
    return self;
}]);

angular.module('mm.addons.qtype_calculatedmulti')
.directive('mmaQtypeCalculatedMulti', ["$log", "$mmQuestionHelper", function($log, $mmQuestionHelper) {
	$log = $log.getInstance('mmaQtypeCalculatedMulti');
    return {
        restrict: 'A',
        priority: 100,
        templateUrl: 'addons/qtype/multichoice/template.html',
        link: function(scope) {
        	$mmQuestionHelper.multiChoiceDirective(scope, $log);
        }
    };
}]);

angular.module('mm.addons.qtype_calculatedmulti')
.factory('$mmaQtypeCalculatedMultiHandler', ["$mmaQtypeMultichoiceHandler", function($mmaQtypeMultichoiceHandler) {
    var self = {};
        self.isCompleteResponse = function(question, answers) {
        return $mmaQtypeMultichoiceHandler.isCompleteResponseSingle(answers);
    };
        self.isEnabled = function() {
        return true;
    };
        self.isGradableResponse = function(question, answers) {
        return $mmaQtypeMultichoiceHandler.isGradableResponseSingle(answers);
    };
        self.isSameResponse = function(question, prevAnswers, newAnswers) {
        return $mmaQtypeMultichoiceHandler.isSameResponseSingle(prevAnswers, newAnswers);
    };
        self.getDirectiveName = function(question) {
        return 'mma-qtype-calculated-multi';
    };
    return self;
}]);

angular.module('mm.addons.qtype_calculatedsimple')
.directive('mmaQtypeCalculatedSimple', ["$log", "$mmQuestionHelper", function($log, $mmQuestionHelper) {
	$log = $log.getInstance('mmaQtypeCalculatedSimple');
    return {
        restrict: 'A',
        priority: 100,
        templateUrl: 'addons/qtype/shortanswer/template.html',
        link: function(scope) {
            $mmQuestionHelper.inputTextDirective(scope, $log);
        }
    };
}]);

angular.module('mm.addons.qtype_calculatedsimple')
.factory('$mmaQtypeCalculatedSimpleHandler', ["$mmaQtypeCalculatedHandler", function($mmaQtypeCalculatedHandler) {
    var self = {};
        self.isCompleteResponse = function(question, answers) {
        return $mmaQtypeCalculatedHandler.isCompleteResponse(question, answers);
    };
        self.isEnabled = function() {
        return true;
    };
        self.isGradableResponse = function(question, answers) {
        return $mmaQtypeCalculatedHandler.isGradableResponse(question, answers);
    };
        self.isSameResponse = function(question, prevAnswers, newAnswers) {
        return $mmaQtypeCalculatedHandler.isSameResponse(question, prevAnswers, newAnswers);
    };
        self.getDirectiveName = function(question) {
        return 'mma-qtype-calculated-simple';
    };
    return self;
}]);

angular.module('mm.addons.qtype_ddimageortext')
.directive('mmaQtypeDdimageortext', ["$log", "$mmQuestionHelper", "$mmaQtypeDdimageortextRender", "$timeout", "$mmUtil", function($log, $mmQuestionHelper, $mmaQtypeDdimageortextRender, $timeout, $mmUtil) {
	$log = $log.getInstance('mmaQtypeDdimageortext');
    return {
        restrict: 'A',
        priority: 100,
        templateUrl: 'addons/qtype/ddimageortext/template.html',
        link: function(scope) {
            var ddarea, questionEl,
                drops = [],
                question = scope.question;
            if (!question) {
                $log.warn('Aborting because of no question received.');
                return $mmQuestionHelper.showDirectiveError(scope);
            }
            questionEl = angular.element(question.html);
            questionEl = questionEl[0] || questionEl;
            ddarea = questionEl.querySelector('.ddarea');
            question.text = $mmUtil.getContentsOfElement(questionEl, '.qtext');
            if (!ddarea || typeof question.text == 'undefined') {
                log.warn('Aborting because of an error parsing question.', question.name);
                return self.showDirectiveError(scope);
            }
            question.ddarea = ddarea.outerHTML;
            question.readonly = false;
            if (question.initObjects) {
                if (typeof question.initObjects.drops != 'undefined') {
                    drops = question.initObjects.drops;
                }
                if (typeof question.initObjects.readonly != 'undefined') {
                    question.readonly = question.initObjects.readonly;
                }
            }
            question.loaded = false;
            $timeout(function() {
                var qi = $mmaQtypeDdimageortextRender.init_question(question, question.readonly, drops);
                scope.$on('$destroy', function() {
                    qi.destroy();
                });
            });
        }
    };
}]);

angular.module('mm.addons.qtype_ddimageortext')
.factory('$mmaQtypeDdimageortextHandler', ["$mmQuestion", function($mmQuestion) {
    var self = {};
        self.isCompleteResponse = function(question, answers) {
        var isComplete = true;
        angular.forEach(answers, function(value) {
            if (!value || value === '0') {
                isComplete = false;
            }
        });
        return isComplete;
    };
        self.isEnabled = function() {
        return true;
    };
        self.isGradableResponse = function(question, answers) {
        var hasReponse = false;
        angular.forEach(answers, function(value) {
            if (value && value !== '0') {
                hasReponse = true;
            }
        });
        return hasReponse;
    };
        self.isSameResponse = function(question, prevAnswers, newAnswers) {
        return $mmQuestion.compareAllAnswers(prevAnswers, newAnswers);
    };
        self.getBehaviour = function(question, behaviour) {
        if (behaviour === 'interactive') {
            return 'interactivecountback';
        }
        return behaviour;
    };
        self.getDirectiveName = function(question) {
        return 'mma-qtype-ddimageortext';
    };
    return self;
}]);

angular.module('mm.addons.qtype_ddimageortext')
.factory('$mmaQtypeDdimageortextRender', ["$mmUtil", "$timeout", function($mmUtil, $timeout) {
    var self = {};
    function question_instance(question, readonly, drops) {
        var instance = this;
        this.toload = 0;
        this.doc = null;
        this.afterimageloaddone = false;
        this.readonly = readonly;
        this.topnode = null;
        this.drops = drops;
        this.proportion = 1;
        this.selected = null;
        this.resizeFunction = function() {
            instance.reposition_drags_for_question();
        };
        this.destroy = function() {
            this.stop_polling();
            ionic.off('resize', this.resizeFunction, window);
        };
        this.initializer = function(question) {
            this.doc = this.doc_structure(question.slot);
            if (this.readonly) {
                var container = angular.element(this.doc.top_node());
                container.addClass('readonly');
            }
            $timeout(function() {
                var bgimg = instance.doc.bg_img();
                if (!bgimg.complete || !bgimg.naturalWidth) {
                    instance.toload++;
                    angular.element(bgimg).on('load', function() {
                        instance.toload--;
                    });
                }
                var item_homes = instance.doc.drag_item_homes();
                angular.forEach(item_homes, function(item) {
                    if (item.tagName == 'IMG') {
                        if (!item.complete || !item.naturalWidth) {
                            instance.toload++;
                            angular.element(item).on('load', function() {
                                instance.toload--;
                            });
                        }
                    }
                });
                instance.poll_for_image_load();
            });
            ionic.on('resize', this.resizeFunction, window);
        };
        this.poll_for_image_load = function () {
            if (this.afterimageloaddone) {
                return;
            }
            if (this.toload <= 0) {
                this.create_all_drag_and_drops();
                this.afterimageloaddone = true;
                question.loaded = true;
            }
            $timeout(function() {
                instance.poll_for_image_load();
            }, 1000);
        };
        this.stop_polling = function() {
            this.afterimageloaddone = true;
        };
                this.doc_structure = function(slot) {
            var topnode = document.querySelector("#mma-mod_quiz-question-" + slot + ' .mma-qtype-ddimageortext-container');
            var dragitemsarea = topnode.querySelector('div.dragitems');
            return {
                top_node : function() {
                    return topnode;
                },
                drag_itemsarea : function() {
                    return dragitemsarea;
                },
                drag_items : function() {
                    return dragitemsarea.querySelectorAll('.drag');
                },
                drop_zones : function() {
                    return topnode.querySelectorAll('div.dropzones div.dropzone');
                },
                drop_zone_group : function(groupno) {
                    return topnode.querySelectorAll('div.dropzones div.group' + groupno);
                },
                drag_items_cloned_from : function(dragitemno) {
                    return dragitemsarea.querySelectorAll('.dragitems' + dragitemno);
                },
                drag_item : function(draginstanceno) {
                    return dragitemsarea.querySelector('.draginstance' + draginstanceno);
                },
                drag_items_in_group : function(groupno) {
                    return dragitemsarea.querySelectorAll('.drag.group' + groupno);
                },
                drag_item_homes : function() {
                    return dragitemsarea.querySelectorAll('.draghome');
                },
                bg_img : function() {
                    return topnode.querySelector('.dropbackground');
                },
                drag_item_home : function (dragitemno) {
                    return dragitemsarea.querySelector('.dragitemhomes' + dragitemno);
                },
                get_classname_numeric_suffix : function(node, prefix) {
                    node = angular.element(node);
                    var classes = node.attr('class');
                    if (classes !== '') {
                        var classesarr = classes.split(' ');
                        var patt1 = new RegExp('^' + prefix + '([0-9])+$');
                        var patt2 = new RegExp('([0-9])+$');
                        for (var index = 0; index < classesarr.length; index++) {
                            if (patt1.test(classesarr[index])) {
                                var match = patt2.exec(classesarr[index]);
                                return + match[0];
                            }
                        }
                    }
                    throw 'Prefix "' + prefix + '" not found in class names.';
                },
                clone_new_drag_item : function (draginstanceno, dragitemno) {
                    var drag, divdrag;
                    var draghome = this.drag_item_home(dragitemno);
                    if (draghome === null) {
                        return null;
                    }
                    var draghomeimg = draghome.querySelector('img');
                    if (draghomeimg) {
                        draghomeimg = angular.element(draghomeimg);
                        draghome = angular.element(draghome);
                        drag = draghomeimg.clone(true);
                        divdrag = angular.element('<div>');
                        divdrag.append(drag);
                        divdrag.attr('class', draghome.attr('class'));
                        drag.attr('class', '');
                    } else {
                        draghome = angular.element(draghome);
                        divdrag = draghome.clone(true);
                    }
                    divdrag.removeClass('dragitemhomes' + dragitemno);
                    divdrag.removeClass('draghome');
                    divdrag.addClass('dragitems' + dragitemno);
                    divdrag.addClass('draginstance' + draginstanceno);
                    divdrag.addClass('drag');
                    divdrag.css('visibility', 'inherit').css('position', 'absolute');
                    divdrag.attr('draginstanceno', draginstanceno);
                    divdrag.attr('dragitemno', dragitemno);
                    draghome.after(divdrag);
                    return divdrag;
                }
            };
        };
        this.draggable_for_question = function (drag, group, choice) {
            drag.attr('group', group);
            drag.attr('choice', choice);
            drag.on('click', function(e) {
                if (drag.hasClass('beingdragged')) {
                    instance.deselect_drags();
                } else {
                    instance.select_drag(drag);
                }
                e.preventDefault();
                e.stopPropagation();
            });
        };
        this.select_drag = function(drag) {
            this.deselect_drags();
            this.selected = drag;
            drag.addClass('beingdragged');
        };
        this.deselect_drags = function() {
            var drags = this.doc.drag_items();
            angular.element(drags).removeClass('beingdragged');
            this.selected = null;
        };
        this.make_drag_area_clickable = function() {
            if (this.readonly) {
                return;
            }
            var home = angular.element(this.doc.drag_itemsarea());
            home.on('click', function(e) {
                var drag = instance.selected;
                if (!drag) {
                    return false;
                }
                instance.deselect_drags();
                instance.remove_drag_from_drop(drag);
                e.preventDefault();
                e.stopPropagation();
            });
        };
        this.update_padding_sizes_all = function () {
            for (var groupno = 1; groupno <= 8; groupno++) {
                this.update_padding_size_for_group(groupno);
            }
        };
        this.update_padding_size_for_group = function (groupno) {
            var originalpadding, img, width, height;
            var groupitems = this.doc.top_node().querySelectorAll('.draghome.group' + groupno);
            if (groupitems.length !== 0) {
                var maxwidth = 0;
                var maxheight = 0;
                for (var x = 0; x < groupitems.length; x++) {
                    img = groupitems[x].querySelector('img');
                    if (img) {
                        maxwidth = Math.max(maxwidth, Math.round(this.proportion * img.naturalWidth));
                        maxheight = Math.max(maxheight, Math.round(this.proportion * img.naturalHeight));
                    } else {
                        originalpadding = angular.element(groupitems[x]).css('padding');
                        angular.element(groupitems[x]).css('padding', '');
                        maxwidth = Math.max(maxwidth, Math.round(groupitems[x].clientWidth));
                        maxheight = Math.max(maxheight, Math.round(groupitems[x].clientHeight));
                        angular.element(groupitems[x]).css('padding', originalpadding);
                    }
                }
                if (maxwidth <= 0 || maxheight <= 0) {
                    return;
                }
                maxwidth = Math.round(maxwidth + this.proportion * 8);
                maxheight = Math.round(maxheight + this.proportion * 8);
                for (var y = 0; y < groupitems.length; y++) {
                    var item = groupitems[y];
                    img = item.querySelector('img');
                    if (img) {
                        width = Math.round(img.naturalWidth * this.proportion);
                        height = Math.round(img.naturalHeight * this.proportion);
                    } else {
                        originalpadding = angular.element(item).css('padding');
                        angular.element(item).css('padding', '');
                        width = Math.round(item.clientWidth);
                        height = Math.round(item.clientHeight);
                        angular.element(item).css('padding', originalpadding);
                    }
                    var margintopbottom = Math.round((maxheight - height) / 2);
                    var marginleftright = Math.round((maxwidth - width) / 2);
                    var widthcorrection = maxwidth - (width + marginleftright * 2);
                    var heightcorrection = maxheight - (height + margintopbottom * 2);
                    angular.element(item).css('padding', margintopbottom + 'px ' + marginleftright + 'px ' +
                        (margintopbottom + heightcorrection) + 'px ' + (marginleftright + widthcorrection) + 'px');
                    var dragitemno = Number(this.doc.get_classname_numeric_suffix(item, 'dragitemhomes'));
                    var drags = this.doc.top_node().querySelectorAll('.drag.group' + groupno + '.dragitems' + dragitemno);
                    angular.element(drags).css('padding', margintopbottom + 'px ' + marginleftright + 'px ' +
                        (margintopbottom + heightcorrection) + 'px ' + (marginleftright + widthcorrection) + 'px');
                }
                angular.element(this.doc.drop_zone_group(groupno))
                    .css('width', maxwidth + 2 + 'px ').css('height', maxheight + 2 + 'px ');
            }
        };
        this.convert_to_window_xy = function (bgimgxy) {
            var position = $mmUtil.getElementXY(this.doc.bg_img(), null, 'ddarea');
            bgimgxy = bgimgxy.split(',');
            bgimgxy[0] *= this.proportion;
            bgimgxy[1] *= this.proportion;
            return [Number(bgimgxy[0]) + position[0] + 1, Number(bgimgxy[1]) + position[1] + 1];
        };
        this.create_all_drag_and_drops = function () {
            this.init_drops();
            angular.element(this.doc.drag_itemsarea()).addClass('clearfix');
            this.make_drag_area_clickable();
            var i = 0;
            var dragitemhomes = this.doc.drag_item_homes();
            for (var x = 0; x < dragitemhomes.length; x++) {
                var dragitemhome = dragitemhomes[x];
                var dragitemno = Number(this.doc.get_classname_numeric_suffix(dragitemhome, 'dragitemhomes'));
                var choice = + this.doc.get_classname_numeric_suffix(dragitemhome, 'choice');
                var group = + this.doc.get_classname_numeric_suffix(dragitemhome, 'group');
                if (dragitemhome.tagName == 'IMG') {
                    var dragitemhomeAng = angular.element(dragitemhome);
                    var wrap = angular.element('<div>');
                    wrap.addClass(dragitemhomeAng.attr('class'));
                    dragitemhomeAng.attr('class', '');
                    dragitemhomeAng.wrap(wrap);
                }
                var dragnode = this.doc.clone_new_drag_item(i, dragitemno);
                i++;
                if (!this.readonly) {
                    this.draggable_for_question(dragnode, group, choice);
                }
                if (dragnode.hasClass('infinite')) {
                    var groupsize = this.doc.drop_zone_group(group).length;
                    var dragstocreate = groupsize - 1;
                    while (dragstocreate > 0) {
                        dragnode = this.doc.clone_new_drag_item(i, dragitemno);
                        i++;
                        if (!this.readonly) {
                            this.draggable_for_question(dragnode, group, choice);
                        }
                        dragstocreate--;
                    }
                }
            }
            this.reposition_drags_for_question();
            if (!this.readonly) {
                var dropzones = this.doc.drop_zones();
                angular.element(dropzones).attr('tabIndex', 0);
            }
        };
        this.drop_click = function (dropnode) {
            var drag = instance.selected;
            if (!drag) {
                return false;
            }
            this.deselect_drags();
            dropnodeAng = angular.element(dropnode);
            if (Number(dropnodeAng.attr('group')) === Number(drag.attr('group'))) {
                this.place_drag_in_drop(drag, dropnode);
            }
        };
        this.remove_drag_from_drop = function (drag) {
            var inputid = drag.attr('inputid');
            if (inputid) {
                var inputnode = angular.element(this.doc.top_node().querySelector('input#' + inputid));
                inputnode.attr('value', '');
            }
            var dragitemhome = this.doc.drag_item_home(drag.attr('dragitemno'));
            var position = $mmUtil.getElementXY(dragitemhome, null, 'ddarea');
            drag.css('left', position[0] + 'px').css('top', position[1] + 'px');
            drag.removeClass('placed');
            drag.attr('inputid', '');
        };
        this.place_drag_in_drop = function (drag, drop) {
            var targetinputid = angular.element(drop).attr('inputid');
            var inputnode = angular.element(this.doc.top_node().querySelector('input#' + targetinputid));
            var origininputid = drag.attr('inputid');
            if (origininputid && origininputid != targetinputid) {
                var origininputnode = angular.element(this.doc.top_node().querySelector('input#' + origininputid));
                origininputnode.attr('value', '');
            }
            var position = $mmUtil.getElementXY(drop, null, 'ddarea');
            drag.css('left', position[0] - 1 + 'px').css('top', position[1] - 1 + 'px');
            drag.addClass('placed');
            inputnode.attr('value', drag.attr('choice'));
            drag.attr('inputid', targetinputid);
        };
        this.calculate_img_proportion = function() {
            var bgimg = this.doc.bg_img();
            this.proportion = 1;
            if (bgimg.width != bgimg.naturalWidth) {
                this.proportion = bgimg.width / bgimg.naturalWidth;
            }
        };
        this.reposition_drags_for_question = function() {
            var dragitem;
            var drag_items = this.doc.drag_items();
            angular.element(drag_items).removeClass('placed').attr('inputid', '');
            this.calculate_img_proportion();
            var dragitemhomes = this.doc.drag_item_homes();
            for (var x = 0; x < dragitemhomes.length; x++) {
                var dragitemhome = dragitemhomes[x];
                var dragitemhomeimg = dragitemhome.querySelector('img');
                if (dragitemhomeimg && dragitemhomeimg.naturalWidth > 0) {
                    var widthheight = [Math.round(dragitemhomeimg.naturalWidth * this.proportion),
                        Math.round(dragitemhomeimg.naturalHeight * this.proportion)];
                    angular.element(dragitemhomeimg).css('width', widthheight[0] + 'px').css('height', widthheight[1] + 'px');
                    var dragitemno = Number(this.doc.get_classname_numeric_suffix(dragitemhome, 'dragitemhomes'));
                    var groupno = this.doc.get_classname_numeric_suffix(dragitemhome, 'group');
                    var dragsimg = this.doc.top_node().querySelectorAll('.drag.group' + groupno + '.dragitems' + dragitemno + '  img');
                    angular.element(dragsimg).css('width', widthheight[0] + 'px').css('height', widthheight[1] + 'px');
                }
            }
            this.update_pa