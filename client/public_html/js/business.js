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

/* Services */

var myAppBusiness = angular.module('myApp.business', []);

myAppBusiness.factory('moduleBusiness', function () {
    return {
        /**
         * reorder current graph
         * @returns nothing
         */
        reorder: function (canvas, inodes, links) {
            canvas.custom.updateLinks(links);
        },
        /**
         * render node on current snap board, with clear option
         * @param boolean clear
         * @param snap s
         * @param nodes nodes
         * @returns nothing
         */
        render: function ($scope, clear, canvas, nodes, inodes, links) {
            /**
             * clear it if requested
             */
            if (clear) {
                canvas.clear();
            }

            canvas.custom = {};
            canvas.custom.updateLinks = function(links) {
                /**
                 * internal function
                 * @param {type} line
                 * @param {type} x1
                 * @param {type} y1
                 * @param {type} x2
                 * @param {type} y2
                 * @returns {undefined}
                 */
                function move(line, x1, y1, x2, y2) {
                    line.attr({x1: x1, y1: y1});
                    line.attr({x2: x2, y2: y2});
                }

                /**
                 * render all this links
                 */
                links.forEach(function (link) {
                    var x1 = inodes[link.x1];
                    var x2 = inodes[link.x2];
                    var box1 = x1.graphic.target.getBBox();
                    var box2 = x2.graphic.target.getBBox();
                    move(link.graphic.target, box1.x, box1.y, box2.x, box2.y);
                });
            }
            
            /**
             * render all this nodes
             */
            nodes.forEach(function (node) {
                console.log(node)
                var nodeCircle = canvas.circle(150, 150, 100);
                var nodeTitle = canvas.text(120, 150, node.id);
                var image = canvas.image("resources/2363.png", 150, 150, 100, 100);

                var myNode = canvas.group(nodeCircle, nodeTitle, image);

                /**
                 * update node reference
                 */
                node.graphic = {target: myNode};

                nodeCircle.attr({
                    fill: "#bada55",
                    stroke: "#000",
                    strokeWidth: 2
                })

                nodeCircle.hover(
                        function () {
                            nodeCircle.animate({r: 120}, 100);
                            $scope.context.id = node.id;
                            $scope.context.cx = nodeCircle.getBBox().cx;
                            $scope.context.cy = nodeCircle.getBBox().cy;
                            $scope.$apply()
                        },
                        function () {
                            nodeCircle.animate({r: 100}, 100);
                        }
                );
            });

            /**
             * render all this links
             */
            links.forEach(function (link) {
                /**
                 * retrieve boxes area
                 */
                var box1 = inodes[link.x1].graphic.target.getBBox();
                var box2 = inodes[link.x2].graphic.target.getBBox();
                var association = canvas.line(box1.x, box1.y, box2.x, box2.y);
                association.attr({
                    stroke: "#000",
                    strokeWidth: 2
                })
                link.graphic = {target: association};
            });

            /**
             * each node have default drag option
             */
            nodes.forEach(function (node) {
                /**
                 * apply drag on each groups
                 */
                node.graphic.target.drag();
                /**
                 * and fire some event while moving this group
                 */
                eve.on('snap.drag.end.' + node.graphic.target.id, function() {
                    canvas.custom.updateLinks(links);
                });
                eve.on('snap.drag.move.' + node.graphic.target.id, function() {
                    canvas.custom.updateLinks(links);
                });
                eve.on('snap.drag.start.' + node.graphic.target.id, function() {
                    canvas.custom.updateLinks(links);
                });
            });
        }
    };
});
