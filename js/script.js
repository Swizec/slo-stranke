
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

d3.json('stranke.json', function (stranke) {
    var dates = d3.keys(stranke.stranke_all).map(function (id) {
        var stranka = stranke.stranke_all[id];
        return new Date(stranka.od[0], stranka.od[1], stranka.od[2]);
    });
    dates = dates.sort(d3.ascending);

    //console.log(dates);

    timeline.domain([new Date(1988), new Date()]);
    y.domain(d3.keys(stranke.stranke_all));

    svg.append("g")
        .attr("transform", "translate(0,30)")
        .classed('axis', true)
        .call(axis);

    d3.keys(stranke.stranke_all).map(function (id) {
        var stranka = stranke.stranke_all[id],
            from = new Date(stranka.od[0], stranka.od[1], stranka.od[2]),
            to = new Date(stranka['do'][0], stranka['do'][1], stranka['do'][2]);

        if (stranka.od[0] < 1988) {
            return;
        }
        
        svg.append("rect")
            .attr({x: timeline(from),
                   y: y(id),
                   width: timeline(to)-timeline(from),
                   height: y.rangeBand()});
            //.style('fill', stranka.barva);

        svg.append('text')
            .classed('okrajsava', true)
            .text(stranka.okrajsava)
            .attr({x: timeline(from)+2,
                   y: (y(id)+y.rangeBand())-1});

        var postane = stranka.nastala_iz.map(function (id) {
            var s1 = stranke.stranke_all[id],
                origin;

            if (s1.do[0] > (new Date()).getFullYear()) {
                origin = from;
            }else{
                origin = new Date(s1.do[0], s1.do[1], s1.do[2]);
            }
            
            return {date: origin,
                    id: s1.id};
        }),
            me = {date: from,
                  id: stranka.id};

        var link = d3.svg.line()
                .interpolate('basis')
                .x(function (d) { return timeline(d.date); })
                .y(function (d) { return y(d.id)+y.rangeBand()/2; })
                .interpolate('cardinal')
                .tension(0.3);

        //svg.append('path')
        //    .attr("d", d3.svg.area(postane)
        //          .x0(function (d) { return timeline(from); })
        //          .x1(function (d) { return timeline(d.start); })
        //          .y0(function (d) {
        postane.map(function (s1) {
           //console.log([me, s1]);
            
            svg.append('path')
                .datum([me, s1])
                .attr("d", link)
                .attr({stroke: 'steelblue',
                       'stroke-width': 2,
                       fill: 'none',
                       opacity: 0.5});
                                        
        });
    });
});
