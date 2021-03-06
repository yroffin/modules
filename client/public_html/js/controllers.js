/* 
 * Copyright 2014 Yannick Roffin.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/* Controllers */

angular.module('myApp.controllers', []).controller('BootstrapCtrl', ['$rootScope', '$window', 'moduleServices', 'moduleBusiness', function ($scope, $window, modulesServices, moduleBusiness) {
        /**
         * bootstrap
         */
        $scope.load = function () {
            $scope.theme = "a";
            $scope.inventoryItem = {
                href: ''
            };
            $scope.modules = {};
        }

        /**
         * node render
         */
        $scope.reorder = function () {
            moduleBusiness.reorder($scope.modules.blackboard, $scope.modules.inodes, $scope.modules.links);
            /*
             var t = new Snap.Matrix()
             t.translate(100, 100);
             butterfly.transform(t); 
             */
        }

        /**
         * load configuration
         */
        $scope.loadModules = function (target, snap) {
            /**
             * load configuration elements and blackboard
             */
            $scope.modules.configuration = {};
            $scope.modules.blackboard = Snap(snap);

            /**
             * load nodes
             */
            modulesServices.getNodes({}, function (data) {
                $scope.modules.nodes = data.nodes;
                /**
                 * build local index on node id
                 */
                $scope.modules.inodes = {};
                data.nodes.forEach(function (node) {
                    $scope.modules.inodes[node.id] = node;
                });
                $scope.modules.links = data.links;
                /**
                 * $scope is passed to permit callback on model
                 */
                $scope.context = {};
                moduleBusiness.render($scope, true, $scope.modules.blackboard, $scope.modules.nodes, $scope.modules.inodes, $scope.modules.links);
                /**
                 * navigate to target
                 */
                $.mobile.navigate(target, {
                    info: "navigate to " + target
                });
            }, function (failure) {
                /**
                 * TODO : handle error message
                 */
            });
        }
        /**
         * load mongodb
         */
        $scope.loadMongodb = function (target) {
            /**
             * load mongodb elements
             */
            $scope.modules.mongodb = {};
            /**
             * loading mongodb collections then navigate to target
             */
            modulesServices.getDbCollections({}, function (data) {
                $scope.modules.mongodb.collections = data;
                /**
                 * navigate to target
                 */
                $.mobile.navigate(target, {
                    info: "navigate to " + target
                });
            }, function (failure) {
                /**
                 * TODO : handle error message
                 */
            });
        }
        /**
         * load collection in current scope
         * 
         * @param collection
         *            the selected collection
         */
        $scope.loadCollection = function (collection, target) {
            /**
             * loading mongodb collections then navigate to target
             */
            modulesServices.getCollection({
                'database': collection.db,
                'name': collection.name,
                'offset': collection.count - 20,
                'page': 20
            }, function (data) {
                var columns = [];
                for (var column in data[0]) {
                    if (column.indexOf('$') == -1 && column.indexOf('toJSON') == -1) {
                        columns.push(column);
                    }
                }
                $scope.modules.mongodb.current = collection;
                $scope.modules.mongodb.collection = data;
                $scope.modules.mongodb.columns = columns;
                $scope.modules.mongodb.offset = collection.count - 20;
                $scope.modules.mongodb.page = 20;

                /**
                 * navigate to target
                 */
                $.mobile.navigate(target, {
                    info: "navigate to " + target
                });
            }, function (failure) {
                /**
                 * TODO : handle error message
                 */
            });
        }
        $scope.send = function (target, element) {
            /**
             * loading clients
             */
            modulesServices.send({
                target: target,
                message: element
            }, function (data) {
                console.log(data);
            }, function (failure) {
                /**
                 * TODO : handle error message
                 */
            });
        }
        $scope.testJob = function (target) {
            /**
             * loading clients
             */
            modulesServices.testJob({
                plugin: target.plugin,
                job: target.job
            }, function (data) {
                console.log(data);
            }, function (failure) {
                /**
                 * TODO : handle error message
                 */
            });
        }
        $scope.selectItem = function (item) {
        }
        $scope.selectGroup = function (item) {
        }
    }]);