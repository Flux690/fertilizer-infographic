let currentImporter = null;
let arc;
let currentFertilizerType = 'phosphate';

function drawDonutChart(countryName) {
    d3.select("#donut").select("svg").remove();

    const dataset = getCurrentFertilizerData();

    if (countryName.endsWith(" (imports)")) {
        countryName = countryName.slice(0, -10); // Remove the last 10 characters
    }
    const countryData = dataset.find(d => d.country === countryName);

    const container = document.getElementById('donut');
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!countryData || !countryData.products) {
        console.error("Invalid importer data:", countryData, countryName);
        hideDonutChart();
        return;
    }

    currentImporter = countryData;
    const radius = Math.min(width / 4, 115);

    // Sort products by percentage, but keep "Others" last
    const sortedProducts = [...countryData.products].sort((a, b) => {
        if (a.crop === "Others") return 1;
        if (b.crop === "Others") return -1;
        return b.percentage - a.percentage;
    });

    const color = d3.scaleOrdinal()
        .domain(sortedProducts.map(d => d.crop))
        .range(["#862b00", "#c94100", "#D87749", "#E8AE92", "#F0C9B6", "#595959"]); // Color scheme

    const svg = d3.select("#donut")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${radius + 10},${height / 2})`);

    const pie = d3.pie()
        .value(d => d.percentage)
        .sort(null);

    const data_ready = pie(sortedProducts);

    arc = d3.arc()
        .innerRadius(radius * 0.63)
        .outerRadius(radius);

    // Draw donut slices with initial opacity 0
    svg.selectAll('slices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('fill', d => color(d.data.crop))
        .style('opacity', 0)
        .each(function (d) { this._current = d; })
        .transition()
        .duration(1600)
        .style('opacity', 1)
        .attrTween("d", function (d) {
            const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return function (t) {
                return arc(i(t));
            };
        });

    // Centered text inside the donut
    const textsData = [(countryData.totalImportVolume / 1000000).toFixed(2), "million mt"];

    // Create a group to hold the texts
    const textGroup = svg.append("g")
        .attr("text-anchor", "start")
        .attr("transform", "translate(-20, 0)");

    // Append the volume figure
    textGroup.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .style("font-size", "1rem")
        .style("font-family", "Akkurat Bold")
        .style("fill", "white")
        .style('opacity', 0)
        .text(textsData[0])
        .transition()
        .delay(600)
        .duration(1600)
        .style('opacity', 1);

    // Append the "million mt" unit
    textGroup.append("text")
        .attr("x", 0)
        .attr("y", "1rem")
        .style("font-size", "0.8rem")
        .style("font-family", "Akkurat light")
        .style("fill", "white")
        .style('opacity', 0)
        .text(textsData[1])
        .transition()
        .delay(600)
        .duration(1600)
        .style('opacity', 1);


    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${radius + 20},${-height / 2})`);

    // Calculate legend spacing
    const legendSpacing = (height / (sortedProducts.length + 0.7));

    const isStacked = width >= 325 && width <= 380;
    const isMedium = (width > 380 && width <= 450) || (width > 450 && width <= 520);
    const isWide = width > 520;

    // Calculate dynamic properties based on width category
    let fontSize, rectSize, cropTextX, percentageTextX, dynamicTranslateX;

    if (isStacked) {
        fontSize = 0.775;
        rectSize = 14;
        cropTextX = 18;
        percentageTextX = 120;
        dynamicTranslateX = -10;
    } else if (isMedium) {
        fontSize = 0.825;
        rectSize = 16;
        cropTextX = 20;
        percentageTextX = 140;
        dynamicTranslateX = 0;
    } else if (isWide) {
        fontSize = 0.875;
        rectSize = 18;
        cropTextX = 84;
        percentageTextX = 200;
        dynamicTranslateX = 20;
    }

    legend.append("text")
        .attr("x", isWide ? cropTextX - 12 : dynamicTranslateX)
        .attr("y", legendSpacing / 3)
        .attr("font-size", `${fontSize}rem`)
        .attr("class", "crop-text-styling")
        .style("opacity", 0)
        .text("Used on crop (%)")
        .transition()
        .delay(600)
        .duration(1600)
        .style("opacity", 1);

    sortedProducts.forEach((product, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(${dynamicTranslateX}, ${i * legendSpacing + legendSpacing / 1.5})`)
            .style("opacity", 0);

        legendRow.append("rect")
            .attr("x", isWide ? cropTextX - 30 : 0)
            .attr("width", rectSize)
            .attr("height", rectSize)
            .attr("fill", color(product.crop));

        const cropText = legendRow.append("text")
            .attr("x", cropTextX)
            .attr("y", rectSize - 3)
            .attr("font-size", `${fontSize}rem`)
            .attr("class", "crop-text-styling")
            .text(product.crop);

        legendRow.append("text")
            .attr("x", percentageTextX)
            .attr("y", rectSize - 3)
            .attr("font-size", `${fontSize}rem`)
            .attr("class", "crop-text-styling")
            .text(product.percentage);

        legendRow.transition()
            .delay(600)
            .duration(1600)
            .style("opacity", 1);

        cropText.on("click", function () {
            showPriceChart();
        });
    });

    d3.select(".donutchart-title")
        .text(`${countryData.country}'s use of ${currentFertilizerType} imports`)
        .style("opacity", 0)
        .transition()
        .delay(600)
        .duration(1600)
        .style("opacity", 1);

    d3.select(".donutchart-footer1")
        .text("*Select a crop to see Platts assessments")
        .style("opacity", 0)
        .transition()
        .delay(600)
        .duration(1600)
        .style("opacity", 1);

    d3.select(".donutchart-footer2")
        .text("Source: S&P Global Commodity Insights")
        .style("opacity", 0)
        .transition()
        .delay(600)
        .duration(1600)
        .style("opacity", 1);
}

function hideDonutChart(type) {
    const svg = d3.select("#donut").select("svg");
    currentImporter = null;

    svg.selectAll('path')
        .transition()
        .duration(1600)
        .attrTween("d", function (d) {
            const i = d3.interpolate(d, { startAngle: 0, endAngle: 0 });
            return function (t) {
                return arc(i(t));
            };
        })
        .style("opacity", 0);

    svg.selectAll('text')
        .transition()
        .delay(600)
        .duration(1600)
        .style("opacity", 0);

    svg.selectAll('g')
        .transition()
        .delay(600)
        .duration(1600)
        .style("opacity", 0);


    d3.select(".donutchart-title")
        .transition()
        .duration(1600)
        .style("opacity", 0);

    d3.select(".donutchart-subtitle")
        .transition()
        .duration(1600)
        .style("opacity", 0);

    d3.select(".donutchart-footer1")
        .transition()
        .duration(1600)
        .style("opacity", 0);

    d3.select(".donutchart-footer2")
        .transition()
        .duration(1600)
        .style("opacity", 0)
        .on('end', () => {
            svg.remove();
            d3.select(".donutchart-title").text('');
            d3.select(".donutchart-subtitle").text('');
            d3.select(".donutchart-footer1").text('');
            d3.select(".donutchart-footer2").text('');
            updateChartDisplay(false, false);
        });
}

function showPriceChart() {
    const priceChartArea = document.querySelector(".crop-price-chart-area");
    priceChartArea.classList.add("active");

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "&times;";
    closeButton.className = "close-button";

    closeButton.addEventListener("click", () => {
        priceChartArea.classList.remove("active");
        closeButton.remove();
    });

    priceChartArea.appendChild(closeButton);
}


// Resize event listener for responsiveness
window.addEventListener('resize', () => {
    if (currentImporter) {
        drawDonutChart(currentImporter.country); // Update donut chart on resize
    }
});
