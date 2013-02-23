
var width = 1024,
    height = 500,
    padding = 50,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

var timeline = d3.time.scale()
        .range([padding, width-padding]),
    axis = d3.svg.axis()
        .orient('top')
        .ticks(d3.time.years, 5)
        .scale(timeline);

var x = d3.scale.linear().domain([0, 100]).range([0, width]);

d3.json('stranke.json', function (stranke) {
    var dates = d3.keys(stranke.stranke_all).map(function (id) {
        var stranka = stranke.stranke_all[id];
        return new Date(stranka.od[0], stranka.od[1], stranka.od[2]);
    });

    timeline.domain([d3.min(dates), new Date()]);

    svg.append("g")
        .attr("transform", "translate(0,30)")
        .classed('axis', true)
        .call(axis);

});
