
var width = 1024,
    height = 1024,
    padding = 50,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

var timeline = d3.time.scale()
        .range([padding, width-padding]),
    y = d3.scale.ordinal()
        .rangeRoundBands([0, height], 0.5, 2),
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
    dates = dates.sort(d3.ascending);

    //console.log(dates);

    timeline.domain([d3.min(dates), new Date()]);
    y.domain(d3.keys(stranke.stranke_all));

    console.log(y("5"));

    svg.append("g")
        .attr("transform", "translate(0,30)")
        .classed('axis', true)
        .call(axis);

    d3.keys(stranke.stranke_all).map(function (id) {
        var stranka = stranke.stranke_all[id],
            from = new Date(stranka.od[0], stranka.od[1], stranka.od[2]),
            to = new Date(stranka['do'][0], stranka['do'][1], stranka['do'][2]);
        
        svg.append("rect")
            .attr({x: timeline(from),
                   y: y(id),
                   width: timeline(to)-timeline(from),
                   height: y.rangeBand()})
            .style('fill', stranka.barva);
    });
});
