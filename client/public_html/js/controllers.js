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

angular.module('myApp.controllers', []).controller('BootstrapCtrl', [ '$rootScope', '$window', 'moduleServices', function($scope, $window, modulesServices) {
	/**
	 * bootstrap
	 */
	$scope.load = function() {
		$scope.theme = "b";
		$scope.inventoryItem = {
			href : ''
		};
		$scope.modules = {};
	}

        /**
	 * node render
	 */
	$scope.render = function(clear, s, nodes) {
            if(clear) s.clear();
            /**
             * render all this nodes
             */
            nodes.forEach( function(node) {
                console.log(node)
                var nodeCircle = s.circle(150, 150, 100);
                var nodeTitle = s.text(120, 150, node.id);
                var myNode = s.group(nodeCircle, nodeTitle);
                
                nodeCircle.attr({
                    fill: "#bada55",
                    stroke: "#000",
                    strokeWidth: 5
                })
                myNode.drag();
                
                nodeCircle.hover(function() {
                    nodeCircle.animate({r: 120}, 100);}
                ,
            function() {
                    nodeCircle.animate({r: 100}, 100);}
                
            );
            });
        }

        /**
	 * node render
	 */
	$scope.reorder = function() {
            console.info("reorder");
        }

        /**
	 * load configuration
	 */
	$scope.loadModules = function(target, snap) {
		/**
		 * load configuration elements and blackboard
		 */
		$scope.modules.configuration = {};
                $scope.modules.blackboard = Snap(snap);
                
                /**
		 * load nodes
		 */
		modulesServices.getNodes({}, function(data) {
			$scope.modules.nodes = data;
                        $scope.render(true, $scope.modules.blackboard,$scope.modules.nodes);
			/**
			 * navigate to target
			 */
			$.mobile.navigate(target, {
				info : "navigate to " + target
			});
		}, function(failure) {
			/**
			 * TODO : handle error message
			 */
		});
	}
	/**
	 * load mongodb
	 */
	$scope.loadMongodb = function(target) {
		/**
		 * load mongodb elements
		 */
		$scope.modules.mongodb = {};
		/**
		 * loading mongodb collections then navigate to target
		 */
		modulesServices.getDbCollections({}, function(data) {
			$scope.modules.mongodb.collections = data;
			/**
			 * navigate to target
			 */
			$.mobile.navigate(target, {
				info : "navigate to " + target
			});
		}, function(failure) {
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
	$scope.loadCollection = function(collection, target) {
		/**
		 * loading mongodb collections then navigate to target
		 */
		modulesServices.getCollection({
			'database' : collection.db,
			'name' : collection.name,
			'offset' : collection.count - 20,
			'page' : 20
		}, function(data) {
			var columns = [];
			for ( var column in data[0]) {
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
				info : "navigate to " + target
			});
		}, function(failure) {
			/**
			 * TODO : handle error message
			 */
		});
	}
	$scope.send = function(target, element) {
		/**
		 * loading clients
		 */
		modulesServices.send({
			target : target,
			message : element
		}, function(data) {
			console.log(data);
		}, function(failure) {
			/**
			 * TODO : handle error message
			 */
		});
	}
	$scope.testJob = function(target) {
		/**
		 * loading clients
		 */
		modulesServices.testJob({
			plugin : target.plugin,
			job : target.job
		}, function(data) {
			console.log(data);
		}, function(failure) {
			/**
			 * TODO : handle error message
			 */
		});
	}
	$scope.selectItem = function(item) {
	}
	$scope.selectGroup = function(item) {
	}
} ]);