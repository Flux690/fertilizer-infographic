let loadedData = null;

// Load XML data on page load
window.onload = function () {
    loadXML('data/calendar.xml', function (xmlDoc) {
        loadedData = parseXML(xmlDoc);
    });
};

document.getElementById('show-calendar').addEventListener('click', function () {
    const calendarArea = document.querySelector(".calendar-area");

    if (currentImporter && currentFertilizerType) {
        if (calendarArea.style.display === 'none' || calendarArea.style.display === '') {
            calendarArea.style.display = 'block';
            document.getElementById('show-calendar').classList.add('active');
            drawGanttChart(currentImporter.country, currentFertilizerType, loadedData);
            addCloseButton(calendarArea);
        }
    }
});

function addCloseButton(container) {
    if (container.querySelector('.close-button-ganttchart')) return;

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "&times;";
    closeButton.className = "close-button-ganttchart";
    closeButton.addEventListener('click', hideGanttChart);

    container.appendChild(closeButton);
}

function hideGanttChart() {
    const calendarArea = document.querySelector('.calendar-area');
    calendarArea.style.display = 'none';
    document.getElementById('show-calendar').classList.remove('active');

    // Remove the close button when hiding the Gantt chart
    const closeButton = calendarArea.querySelector('.close-button-ganttchart');
    if (closeButton) {
        closeButton.remove();
    }
}

function loadXML(filePath, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', filePath, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const xmlDoc = xhr.responseXML;
            callback(xmlDoc);
        }
    };
    xhr.send();
}

function parseXML(xmlDoc) {
    const data = [];
    const rows = xmlDoc.getElementsByTagName("Row");

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].children;
        const entry = {
            Importer: cells[1].textContent,
            Crop: cells[2].textContent,
            Start: new Date(cells[3].textContent),
            End: new Date(cells[4].textContent),
            Application: parseInt(cells[5].textContent, 10),
            Fertilizer: cells[6].textContent
        };
        data.push(entry);
    }
    return data;
}

function drawGanttChart(importer, fertilizerType, data) {
    const filteredData = data.filter(d => d.Importer === importer && d.Fertilizer === fertilizerType);

    const container = document.getElementById('calendar');

    const width = container.clientWidth || container.offsetWidth;
    const height = container.clientHeight || container.offsetHeight;

    const svg = d3.select(container).selectAll("svg").data([null]);
    const svgEnter = svg.enter().append("svg").merge(svg)
        .attr("width", width)
        .attr("height", height);

    svgEnter.selectAll("*").remove(); // Clear previous content

    if (!filteredData || filteredData.length === 0) {
        svgEnter.append("text")
            .attr("x", 10)
            .attr("y", 20)
            .text("NO DATA")
            .attr("fill", "white");
        return;
    }

    d3.select(".ganttchart-title")
        .text(`${importer} ${fertilizerType} Application Calendar`);


    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '12.8px Arial';
    const maxLabelWidth = Math.max(...filteredData.map(d => context.measureText(d.Crop).width));
    const margin = { top: 20, right: 10, bottom: 40, left: maxLabelWidth + 15 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const innerHeightAdjusted = innerHeight * 0.75;


    const x = d3.scaleTime()
        .domain([new Date("2000-01-01T00:00:00"), new Date("2000-12-31T23:59:59")])
        .range([0, innerWidth]);

    const y = d3.scaleBand()
        .domain(filteredData.map(d => d.Crop))
        .range([0, innerHeightAdjusted]);

    const xAxis = d3.axisBottom(x)
        .tickFormat(d3.timeFormat("%b"))
        .ticks(d3.timeMonth.every(1))
        .tickSize(0)
        .tickPadding(10);

    const yAxis = d3.axisLeft(y)
        .tickSize(0)
        .tickPadding(5);

    const g = svgEnter.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw horizontal grid lines at the top of each row
    g.append("g")
        .attr("class", "grid")
        .selectAll("line.horizontal")
        .data(y.domain())
        .enter()
        .append("line")
        .attr("x1", -margin.left)
        .attr("x2", innerWidth)
        .attr("y1", d => y(d))
        .attr("y2", d => y(d))
        .attr("stroke", "#595959")
        .attr("stroke-width", "1px");


    // Add horizontal line at the bottom of the last crop row
    g.append("line")
        .attr("x1", -margin.left)
        .attr("x2", innerWidth)
        .attr("y1", innerHeightAdjusted)
        .attr("y2", innerHeightAdjusted)
        .attr("stroke", "#595959")
        .attr("stroke-width", "1px");

    // Add vertical line at the start of the graph
    g.append("line")
        .attr("x1", -margin.left)
        .attr("x2", -margin.left)
        .attr("y1", 0)
        .attr("y2", innerHeightAdjusted)
        .attr("stroke", "#595959")
        .attr("stroke-width", "1px");

    // Vertical grid lines
    g.append("g")
        .attr("class", "grid")
        .selectAll("line.vertical")
        .data(x.ticks())
        .enter()
        .append("line")
        .attr("x1", d => x(d))
        .attr("x2", d => x(d))
        .attr("y1", 0)
        .attr("y2", innerHeightAdjusted)
        .attr("stroke", "#595959")
        .attr("stroke-width", "1px");

    // Add vertical line at the end of the graph
    g.append("line")
        .attr("x1", innerWidth)
        .attr("x2", innerWidth)
        .attr("y1", 0)
        .attr("y2", innerHeightAdjusted)
        .attr("stroke", "#595959")
        .attr("stroke-width", "1px");

    // X-axis with vertical labels
    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${innerHeightAdjusted})`)
        .call(xAxis)
        .selectAll("text")
        .attr("class", "x-axis")
        .style("font-size", "0.8rem")
        .style("fill", "white")
        .style("font-family", "Akkurat light")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("dy", "-0.5em")
        .attr("dx", "-0.8em");

    // Y-axis
    g.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
        .selectAll("text")
        .attr("class", "y-axis")
        .style("font-size", "0.8rem")
        .style("fill", "white")
        .style("font-family", "Akkurat light");

    const colorScale = d3.scaleOrdinal()
        .domain([1, 2, 3])
        .range(["#24829A", "#F1A649", "#AB2552"]);

    filteredData.forEach(d => {
        const start = new Date(`2000-${d.Start.getMonth() + 1}-${d.Start.getDate()}`);
        const end = new Date(`2000-${d.End.getMonth() + 1}-${d.End.getDate()}`);
        const cropY = y(d.Crop) + (y.bandwidth() - (0.55 * y.bandwidth())) / 2;
        const barHeight = y.bandwidth() * 0.55;

        if (start <= end) {
            // Normal case within the same year
            const barWidth = x(end) - x(start);
            if (barWidth > 0) {
                g.append("rect")
                    .attr("x", x(start))
                    .attr("y", cropY)
                    .attr("width", barWidth)
                    .attr("height", barHeight)
                    .attr("fill", colorScale(d.Application));
            }
        } else {
            // Split across the year-end, draw two bars
            const yearEnd = new Date("2000-12-31T23:59:59");
            const yearStart = new Date("2000-01-01T00:00:00");

            const firstBarWidth = x(yearEnd) - x(start);
            if (firstBarWidth > 0) {
                g.append("rect")
                    .attr("x", x(start))
                    .attr("y", cropY)
                    .attr("width", firstBarWidth)
                    .attr("height", barHeight)
                    .attr("fill", colorScale(d.Application));
            }

            const secondBarWidth = x(end) - x(yearStart);
            if (secondBarWidth > 0) {
                g.append("rect")
                    .attr("x", x(yearStart))
                    .attr("y", cropY)
                    .attr("width", secondBarWidth)
                    .attr("height", barHeight)
                    .attr("fill", colorScale(d.Application));
            }
        }
    });

    // Legend with fixed "APPLICATION NUMBER"
    const legend = g.append("g")
        .attr("transform", `translate(-${margin.left},${-margin.top})`);

    legend.append("text")
        .attr("x", 0)
        .attr("y", 10)
        .style("font-size", "0.8rem")
        .style("fill", "white")
        .style("font-family", "Akkurat light")
        .text("Application window");

    const legendData = [...new Set(filteredData.map(d => d.Application))];
    legendData.forEach((app, i) => {
        legend.append("rect")
            .attr("x", i * 40 + 120)
            .attr("y", 0)
            .attr("width", 18)
            .attr("height", 12)
            .attr("fill", colorScale(app));

        legend.append("text")
            .attr("x", i * 40 + 140)
            .attr("y", 10)
            .style("font-size", "0.8rem")
            .style("fill", "white")
            .style("font-family", "Akkurat light")
            .text(`${app}`);
    });

    // Ensure axis lines are consistent in color
    g.selectAll(".x-axis path, .y-axis path")
        .attr("stroke", "#595959")
        .attr("stroke-width", "1px");
}


// Event listener for resize to make the Gantt chart responsive
window.addEventListener('resize', () => {
    const calendarArea = document.querySelector('.calendar-area');
    if (calendarArea.style.display === 'block' && loadedData) {
        drawGanttChart(currentImporter.country, currentFertilizerType, loadedData);
    }
});

// Update the chart when a new node is selected
function updateChartForNode(importer, fertilizerType) {
    if (loadedData) {
        drawGanttChart(importer, fertilizerType, loadedData);
    }
}

// Event listener for resize to make the Gantt chart responsive
window.addEventListener('resize', () => {
    const calendarArea = document.querySelector('.calendar-area');
    if (calendarArea.style.display === 'block' && loadedData) {
        drawGanttChart(currentImporter.country, currentFertilizerType, loadedData);
    }
});
