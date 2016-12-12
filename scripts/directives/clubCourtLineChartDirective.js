myApp.directive("clubCourtLineChart", clubCourtLineChartDirective);
clubCourtLineChartDirective.$inject = ["d3Service", "$rootScope"];

function clubCourtLineChartDirective(d3Service, $rootScope) {
  return {
    restrict: 'A',
    scope: {
      'config': '='
    },
    link: function(scope, element, attrs) {
        function setupGraph() {
          var iCurMarker = new Array;
          var iCurFocusMarker = new Array;
          var xScales = new Array;
          var yScales = new Array;
          var xAxes = new Array;
          var yAxes = new Array;
          var xSvg = new Array;
          var ySvg = new Array;
          var yearId = new Array; //year indicators for current years storred here
          var yearFocusId = new Array;
          var lines = new Array;
          var graphDatas = new Array;
          var graphYears = new Array;
          var colors = ["#e80738", "#767284", "#d905a7", "#996901", "#028263", "#0876d0", "#b5466a", "#ffd305", "#0b7e2e", "#0873ab", "#9a5f32", "#f7b1fe", "#d807fe", "#0fffd5", "#bdfe7c", "#fe5e71", "#6d8a79", "#32deff", "#f2840a"];
          var preScaleYearShift = [-34, -47, -36, -25, 0, 0]; //missing years on start, relative to visible representation scale
          var postScaleYearShift = [1, 1, 0, 0, 1, 1]; //missing years on end, relative to visible representation scale
          var axisLeftShift = [-10, -60, -115, -150, -180, -245];
          var graphLabels = ["CLUBS", "COURTS", "WTA", "ATP", "JUNIOR", "SENIOR"];
          var el = element[0];
          // margins
          var m = [30, 0, 20, 310];
          var scaleTxtMargin = -20;
          //get dimensions of parrent DOM element
          var width = el.clientWidth;
          var height = el.clientHeight;
          // width
          var w = width - m[1] - m[3];
          // height
          var h = height - m[0] - m[2];
          var yearStart = scope.config.yearMin;
          var yearEnd = scope.config.yearMax;
          var parseDate = d3.time.format("%d-%b-%y").parse;
          var bisectDate = d3.bisector(function(d) {
            return d;
          }).left;
          var formatValue = d3.format(",.2f");
          var formatCurrency = function(d) {
            return "$" + formatValue(d);
          };
          var focusYearIndicator;
          var xAxisFormat = d3.format("f");
          // main svg obj
          var graph = d3.select(el)
            .append('svg')
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
            .append("g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
          //ARRAY WITH "YEARS"-ARRAY OF EACH GRAPH 
          graphYears[0] = scope.config.clubChartData.year;
          graphYears[1] = scope.config.courtChartData.year;
          graphYears[2] = scope.config.wtaSuperstarsData.year;
          graphYears[3] = scope.config.atpSuperstarsData.year;
          graphYears[4] = scope.config.junSenData.year;
          graphYears[5] = scope.config.junSenData.year;
          //ARRAY WITH "DATA"-ARRAY OF EACH GRAPH 
          graphDatas[0] = scope.config.clubChartData.club;
          graphDatas[1] = scope.config.courtChartData.court;
          graphDatas[2] = scope.config.wtaSuperstarsData.stars;
          graphDatas[3] = scope.config.atpSuperstarsData.stars;
          graphDatas[4] = scope.config.junSenData.junior;
          graphDatas[5] = scope.config.junSenData.senior;
          // X SCALE FOR VISIBLE X AXIS
          var xScaleVis = d3.scale.linear()
            .domain([yearStart, yearEnd])
            .range([0, w]);
          //VISIBLE X AXIS
          xAxesVis = d3.svg.axis()
            .scale(xScaleVis)
            .tickSize(-h)
            .ticks(16)
            .tickFormat(xAxisFormat)
            .tickSubdivide(true);
          //X AXIS main common visible
          graph
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxesVis);
          //shit that appears onMouseover
          focusYearIndicator = graph
            .append("g")
            .attr("class", "focusYearIndicator")
            .style("display", "none");
          focusYearIndicator
            .append("circle")
            .attr("r", 4.5);
          focusYearIndicator
            .append("text")
            .attr("x", 9)
            .attr("dy", ".35em");
          //mouse sensitive rectangle
          //MUST be the last element to apped!
          graph
            .append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height);
          //   .on("mouseover", function() {
          //     focusYearIndicator.style("display", null);
          //     for (var i = 0; i < yearId.length; i++) {
          //       yearId[i].style("display", "none");
          //     };
          //   })
          //   .on("mouseout", function() {
          //     focusYearIndicator.style("display", "none");
          //     for (var i = 0; i < yearId.length; i++) {
          //       yearId[i].style("display", null);
          //     };
          //   })
          //   .on("mousemove", mousemove);
          for (var a = 0; a < 6; a++) {
            // X SCALES FOR INVISIBLE AXES
            xScales[a] = d3.scale.linear()
              .domain([d3.min(graphYears[a]) + preScaleYearShift[a], d3.max(graphYears[a]) + postScaleYearShift[a]])
              .range([0, w]);
            //Y SCALES
            yScales[a] = d3.scale.linear()
              .domain([d3.min(graphDatas[a]), d3.max(graphDatas[a])])
              .range([h, 0]);
            // VISIBLE Y AXES 
            yAxes[a] = d3.svg.axis().scale(yScales[a]).ticks(4).orient("left");
            //LINES FOR THE GRAPHS
            lines[a] = d3.svg.line()
              .x(function(d, i) {
                return xScales[a](graphYears[a][i]);
              })
              .y(function(d) {
                return yScales[a](d);
              });
            //GRAPH GROUP
            graph
              .append("path")
              .attr("d", lines[a](graphDatas[a]))
              .attr('stroke-width', 0.5)
              .style("fill", "none")
              .style("stroke", colors[a]);
            //Y AXIS 
            ySvg[a] = graph
              .append("g")
              .style("fill", "none")
              .style("stroke", colors[a])
              .attr("transform", "translate( " + axisLeftShift[a] + "  ,0)")
              .call(yAxes[a])
              .append("text")
              .attr("y", scaleTxtMargin)
              .attr("dy", ".5em")
              .attr("dx", ".5em")
              .style("fill", colors[a])
              .style("stroke", "none")
              .style("text-anchor", "end")
              .text(graphLabels[a]);
            //CURRENT YEAR INDICATOR
            yearId[a] = graph
              .append("g")
              .attr("class", "currYearIndicatorGroup");
            yearId[a]
              .append("circle")
              .attr("class", "currYearIndicator")
              .attr("r", 4.5)
              .style("fill", colors[a])
              .style("stroke", colors[a]);
            yearId[a]
              .append("text")
              .attr("class", "currYearIndicator")
              .attr("x", 9)
              .attr("dy", ".35em");
            //CURRENT FOCUS YEAR INDICATOR
            yearFocusId[a] = graph
              .append("g")
              .attr("class", "currYearIndicatorGroup");
            yearFocusId[a]
              .append("circle")
              .attr("class", "currYearIndicator")
              .attr("r", 4.5)
              .style("fill", colors[a])
              .style("stroke", colors[a]);
            yearFocusId[a]
              .append("text")
              .attr("class", "currYearIndicator")
              .attr("x", 9)
              .attr("dy", ".35em");
          };

          function mousemove() {
            var x0 = xScales[0].invert(d3.mouse(this)[0]);
            var i = bisectDate(graphYears[0], x0, 1);
            var d0 = graphYears[0][i - 1];
            var d1 = graphYears[0][i];
            var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            console.log("x0: " + x0);
            console.log("d: " + d);
            console.log("i: " + i);
            // focusYearIndicator.attr("transform", "translate(" + xScales[0](d) + "," + yScales[0](graphDatas[0][i]) + ")");
            // focusYearIndicator.select("text").text("CLUBS:" + graphDatas[0][i]);
            // for (var a = 0; a < 6; a++) {
            //   iCurFocusMarker[a] = findPos(xScales[0].invert(d3.mouse(this)[0]), graphYears[a]) - 1;
            //   yearFocusId[a]
            //     .attr("transform", "translate(" + xScales[a](graphYears[a][iCurFocusMarker[a]]) + "," + yScales[a](graphDatas[a][iCurMarker[a]]) + ")")
            //     .select("text")
            //     .text(graphLabels[a] + " " + graphDatas[a][iCurFocusMarker[a]]);
            //   scope.config.currData[a] = graphDatas[a][iCurFocusMarker[a]];
            // };
          };
          //lookup index of axis position array based on current year
          function findPos(filter, dataset) {
            var result = bisectDate(dataset, filter, 1);
            return result;
          };
          //passing the reference of the variable, not to the value itself (to the watch function)
          scope.$watch(function() {
              return scope.config.yearCurr;
            },
            function() {
              // var i = bisectDate(graphYears[0], graphYears[0][i], 1);
              //indexes of current marker circle positions 
              //in axis arrays
              for (var a = 0; a < 6; a++) {
                iCurMarker[a] = findPos(scope.config.yearCurr, graphYears[a]) - 1;
                yearId[a]
                  .attr("transform", "translate(" + xScales[a](graphYears[a][iCurMarker[a]]) + "," + yScales[a](graphDatas[a][iCurMarker[a]]) + ")")
                  .select("text")
                  .text(graphLabels[a] + " " + graphDatas[a][iCurMarker[a]]);
                scope.config.currData[a] = graphDatas[a][iCurMarker[a]];
              };
              console.log(scope.config.currData);
            }
          ); //scope.watch ends
        };
        //setupGraph end
        // make sure that d3 library is loaded and then trigger setup & painting
        d3Service.loaded().then(function(d3) {
          setupGraph();
        });
      }
      // linked function end
  };
};
// directive end