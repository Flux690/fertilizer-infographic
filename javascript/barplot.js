let currentExporter = null;

function drawBarChart(exporter) {
    currentExporter = exporter;

    // Clear existing content
    d3.select(".barchart-title").text('');
    d3.select(".barchart-subtitle").text('');
    d3.select("#barplot").select("svg").remove();
    d3.select(".barchart-footer").text('');

    // Get top 5 export volumes
    const topExports = exporter.receivers
        .map(receiver => ({ country: receiver.country, volume: receiver.volume / 1000000 }))
        .sort((a, b) => b.volume - a.volume);

    // Use a canvas to measure the width of the longest label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '12.8px Akkurat light';

    const maxLabelWidth = Math.max(...topExports.map(d => context.measureText(d.country).width));
    const leftMargin = maxLabelWidth + 10; // Add a small buffer

    // Set dimensions and margins
    const margin = { top: 10, right: 15, bottom: 20, left: leftMargin + 16 };
    const container = document.getElementById('barplot');
    const fullWidth = container.clientWidth - margin.left - margin.right;
    const fullHeight = container.clientHeight - margin.top - margin.bottom;

    // Add title and subtitle with fade-in
    d3.select(".barchart-title")
        .style("opacity", 0)
        .text(`${exporter.country} Top 5 Exports`)
        .transition()
        .duration(1600)
        .style("opacity", 1);

    d3.select(".barchart-subtitle")
        .style("opacity", 0)
        .text("(million mt)")
        .transition()
        .duration(1600)
        .style("opacity", 1);

    // Create SVG container
    const svg = d3.select("#barplot")
        .append("svg")
        .attr("width", fullWidth + margin.left + margin.right)
        .attr("height", fullHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set scales
    const maxVolume = Math.ceil(d3.max(topExports, d => d.volume) * 2) / 2;
    const x = d3.scaleLinear()
        .domain([0, maxVolume])
        .range([0, fullWidth]);

    const y = d3.scaleBand()
        .domain(topExports.map(d => d.country))
        .range([0, fullHeight])
        .padding(0.1);

    // Add vertical grid lines and x-axis labels with fade-in
    const xAxis = svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${fullHeight})`)
        .style("opacity", 0)
        .call(d3.axisBottom(x)
            .tickValues(d3.range(0, maxVolume + 0.5, 0.5))
            .tickFormat(d3.format(".1f"))
            .tickSize(-fullHeight)
        );
    xAxis.select(".domain").remove();
    xAxis.selectAll(".tick line").attr("stroke", "#ccc");
    xAxis.transition().duration(1600).style("opacity", 1);

    // Add Y axis with fade-in
    const yAxis = svg.append("g")
        .attr("class", "y-axis")
        .style("opacity", 0)
        .call(d3.axisLeft(y).tickSize(0).tickPadding(5));
    yAxis.select(".domain").remove();
    yAxis.transition().duration(1600).style("opacity", 1);

    // Add bars with fade-in and roll-out animation
    svg.selectAll("rect")
        .data(topExports)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => y(d.country))
        .attr("height", y.bandwidth())
        .attr("fill", "#f1a649")
        .attr("width", 0) // Start with width 0 for animation
        .style("opacity", 0) // Start with opacity 0 for fade-in
        .transition()
        .duration(1600)
        .attr("width", d => x(d.volume))
        .style("opacity", 1); // Fade in

    // Add footer with fade-in
    d3.select(".barchart-footer")
        .style("opacity", 0)
        .text("Source: S&P Global Commodity Insights")
        .transition()
        .duration(1600)
        .style("opacity", 1);
}

function hideBarChart() {
    const svg = d3.select("#barplot").select("svg");
    currentExporter = null;

    svg.selectAll("rect")
        .transition()
        .duration(1600)
        .attr("width", 0)
        .style("opacity", 0);

    svg.selectAll(".x-axis .tick text, .x-axis .tick line, .y-axis .tick text, .y-axis .tick line")
        .transition()
        .duration(1600)
        .style("opacity", 0);

    // Fade out titles and footer with transitions
    d3.select(".barchart-title")
        .transition()
        .duration(1600)
        .style("opacity", 0);

    d3.select(".barchart-subtitle")
        .transition()
        .duration(1600)
        .style("opacity", 0);

    d3.select(".barchart-footer")
        .transition()
        .duration(1600)
        .style("opacity", 0)
        .on('end', () => {
            svg.remove();
            d3.select(".barchart-title").text('');
            d3.select(".barchart-subtitle").text('');
            d3.select(".barchart-footer").text('');
            updateChartDisplay(false, false);
        });
}

// Event listener for window resize
window.addEventListener('resize', () => {
    if (currentExporter) {
        drawBarChart(currentExporter);
    }
});