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

myAppBusiness.factory('moduleBusiness', function() {
    return {
            /**
             * reorder current graph
             * @returns nothing
             */
            reorder : function() {
                alert(1);
            },
            /**
             * render node on current snap board, with clear option
             * @param boolean clear
             * @param snap s
             * @param nodes nodes
             * @returns nothing
             */
            render : function ($scope, clear, paper, nodes, inodes, links) {
                /**
                 * clear it if requested
                 */
                if (clear) {
                    paper.clear();
                }

                /**
                 * render all this nodes
                 */
                nodes.forEach(function (node) {
                    console.log(node)
                    var nodeCircle = paper.circle(150, 150, 100);
                    var nodeTitle = paper.text(120, 150, node.id);
                    var image = paper.image("resources/2363.png", 150, 150, 100, 100);

                    var myNode = paper.group(nodeCircle, nodeTitle, image);
                    
                    /**
                     * update node reference
                     */
                    node.graphic = {target : nodeCircle};

                    nodeCircle.attr({
                        fill: "#bada55",
                        stroke: "#000",
                        strokeWidth: 2
                    })
                    myNode.drag();

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
                    var lnode = inodes[link.left];
                    var rnode = inodes[link.right];
                    console.log(lnode.graphic.target.getBBox());
                });
            }
    };
});
