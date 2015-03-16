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

angular.module('myApp.controllers', []).controller('BootstrapCtrl', [ '$rootScope', '$window', 'jarvisServices', function($scope, $window, modulesServices) {
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
	 * load configuration
	 */
	$scope.loadModules = function(target, snap) {
		/**
		 * load configuration elements
		 */
		$scope.modules.configuration = {};
                console.log('snap', snap);
                $scope.modules.blackboard = Snap(snap);
                
                console.log('snap',$scope.modules.blackboard);
                var s = $scope.modules.blackboard;

// Lets create big circle in the middle:
var bigCircle = s.circle(150, 150, 100);
// By default its black, lets change its attributes
bigCircle.attr({
    fill: "#bada55",
    stroke: "#000",
    strokeWidth: 5
});
// Now lets create another small circle:
var smallCircle = s.circle(100, 150, 70);
// Lets put this small circle and another one into a group:
var discs = s.group(smallCircle, s.circle(200, 150, 70));
discs.drag();
// Now we can change attributes for the whole group
discs.attr({
    fill: "#fff"
});
// Now more interesting stuff
// Lets assign this group as a mask for our big circle
bigCircle.attr({
    mask: discs
});
// Despite our small circle now is a part of a group
// and a part of a mask we could still access it:
smallCircle.animate({r: 50}, 1000);
// We don’t have reference for second small circle,
// but we could easily grab it with CSS selectors:
discs.select("circle:nth-child(2)").animate({r: 50}, 1000);
// Now lets create pattern
var p = s.path("M10-5-10,15M15,0,0,15M0-5-20,15").attr({
        fill: "none",
        stroke: "#bada55",
        strokeWidth: 5
    });
// To create pattern,
// just specify dimensions in pattern method:
p = p.pattern(0, 0, 10, 10);
// Then use it as a fill on big circle
bigCircle.attr({
    fill: p
});
// We could also grab pattern from SVG
// already embedded into our page
discs.attr({
    fill: Snap("#pattern")
});
// Lets change fill of circles to gradient
// This string means relative radial gradient
// from white to black
discs.attr({fill: "r()#fff-#000"});
// Note that you have two gradients for each circle
// If we want them to share one gradient,
// we need to use absolute gradient with capital R
discs.attr({fill: "R(150, 150, 100)#fff-#000"});
// Of course we could animate color as well
p.select("path").animate({stroke: "#f00"}, 1000);
// Now lets load external SVG file:
var titi = Snap.load("resources/2363.png", function (f) {
    // Note that we traversre and change attr before SVG
    // is even added to the page
    f.selectAll("polygon[fill='#09B39C']").attr({fill: "#bada55"});
    g = f.select("g");
    s.append(g);
    // Making croc draggable. Go ahead drag it around!
    g.drag();
    // Obviously drag could take event handlers too
    // That’s better! selectAll for the rescue.
});
    s.append(titi);
// Writing text as simple as:
var tt = s.text(200, 100, "Snap.svg");
tt.node.onclick = function () {
    tt.node.attr("fill", "red");
};
// Provide an array of strings (or arrays), to generate tspans
var t = s.text(200, 120, ["Snap", ".", "svg"]);
t.drag();
t.selectAll("tspan:nth-child(3)").attr({
    fill: "#900",
    "font-size": "20px"
});
 
		/**
		 * loading clients
		 */
                $.mobile.navigate(target, {
                        info : "navigate to " + target
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