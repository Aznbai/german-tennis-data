(function() {
  myApp.directive("atpWtaDonutChart", atpWtaDonutDirective);
  atpWtaDonutDirective.$inject = ["d3Service", "$rootScope"];

  function atpWtaDonutDirective(d3Service, $rootScope) {
    return {
      restrict: 'EA',
      scope: {
        'config': '='
      },
      link: function(scope, element, attrs, filter) {
        function setupTennisDonut() {
          var color = d3.scale.category10();
          var el = element[0];
          var width = el.clientWidth;
          var height = el.clientHeight;
          var min = Math.min(width, height);
          var radius = min / 2 - 10;
          var pie = d3.layout.pie().sort(null).padAngle(.02);
          var arc = d3.svg.arc()
            .outerRadius(min / 2 * 0.8)
            .innerRadius(min / 2 * 0.75);
          var svg = d3.select(el).append('svg');
          svg.attr({
            width: width,
            height: height
          });
          var g = svg.append('g')
            // center the donut chart
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
          //console.log("tennis parts curr" + scope.config.stateCurr.atpWtaDonutParts);
          var arcs = g.selectAll('path')
            .data(pie(scope.config.stateCurr.atpWtaDonutParts))
            .enter().append('path')
            .attr('fill-opacity', 0.5)
            .attr('fill', function(d, i) {
              return color(i);
            }) // store the initial angles
            .each(function(d) {
              return this._current = d
            });
          var labels = g.selectAll('.label')
            .data(pie(scope.config.atpWtaNamesCurr))
            .enter().append("text")
            .attr("dy", ".35em")
            .attr("class", "label")
            .style("text-anchor", "middle")
            .text(function(d) {
              //     console.log("data pie");
              //    console.log(scope.config.atpWtaNamesCurr);
              return d.data;
            });
          //legend
          var legendRectSize = 20;
          var legendSpacing = 7;
          var legendHeight = legendRectSize + legendSpacing;
          var theData = new Array(function() {
            return scope.config.yearCurr;
          });
          scope.$watch(
            //passing the reference to the variable, not to the value itself
            //this is done by following function
            function() {
              return scope.config.yearCurr;
            },
            function(newVal, oldVal) {
              //    console.log("tennis donut directive yearchange watcher triggered");
              function arcTween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function(t) {
                  return arc(i(t));
                };
              };
              //   console.log("tennis donut current parts:");
              //   console.log(scope.config.stateCurr.atpWtaDonutParts);
              //   console.log("tennis donut current percentage:");
              var duration = 50;
              arcs.data(pie(scope.config.stateCurr.atpWtaDonutParts)); //.attr('d', arc);
              arcs.transition()
                .duration(duration)
                .attrTween('d', arcTween);
              labels
                .data(pie(scope.config.atpWtaNamesCurr))
                .text(function(d) {
                  var x = d.data;
                  //console.log(d);
                  return x;
                })
                .data(pie(scope.config.stateCurr.atpWtaDonutParts))
                .transition()
                .duration(duration)
                .attr("transform", function(d) {
                  return "translate(" + arc.centroid(d) + ")";
                });
            });
        }
        d3Service.loaded().then(function(d3) {
          setupTennisDonut();
        });
        // On config change events we paint our graph again to reflect any changes
        //  $rootScope.$on('configChange', setupDonut);
      }
    };
  };
})();