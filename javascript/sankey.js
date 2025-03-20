function transformData(data) {
    const nodes = [];
    const links = [];
    const nodeMap = new Map();
    const exporterSet = new Set(data.map(d => d.country));

    data.forEach(exporter => {
        if (!nodeMap.has(exporter.country)) {
            nodeMap.set(exporter.country, { name: exporter.country, code: exporter.code, totalVol: 0, isExport: true, isImport: false });
            nodes.push(nodeMap.get(exporter.country));
        }

        const topExports = exporter.receivers
            .map(receiver => receiver.volume)
            .sort((a, b) => b - a)
            .reduce((sum, volume) => sum + volume, 0);

        nodeMap.get(exporter.country).totalVol += topExports;

        exporter.receivers.forEach(receiver => {
            const isDualRole = exporterSet.has(receiver.country);
            const targetName = isDualRole ? receiver.country + " (imports)" : receiver.country;

            if (!nodeMap.has(targetName)) {
                nodeMap.set(targetName, { name: targetName, code: receiver.code, totalVol: 0, isExport: false, isImport: true });
                nodes.push(nodeMap.get(targetName));
            }
            nodeMap.get(targetName).totalVol += receiver.volume;

            links.push({
                source: nodeMap.get(exporter.country),
                target: nodeMap.get(targetName),
                value: receiver.volume
            });
        });
    });

    return { nodes, links };
}

let clickedNode = null; // Track the currently focused node

function drawSankey(data) {
    const container = document.getElementById('sankey');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const sankeyWidth = containerWidth * 0.5;
    const svgHeight = containerHeight;

    d3.select("#sankey").select("svg").remove();

    const svg = d3.select("#sankey").append("svg")
        .attr("width", containerWidth)
        .attr("height", svgHeight);

    const sankeyGroup = svg.append("g")
        .attr("transform", `translate(${(containerWidth - sankeyWidth) / 2}, 0)`);

    const defs = svg.append("defs");

    const gradient = defs.append("linearGradient")
        .attr("id", "linkGradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "50%").attr("y2", "0%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#24829a");

    gradient.append("stop")
        .attr("offset", "85%")
        .attr("stop-color", "#f1a649");

    const sankey = d3.sankey()
        .nodeWidth(10)
        .nodePadding(10)
        .extent([[0, 40], [sankeyWidth, svgHeight - 20]])
        .nodeSort((a, b) => b.totalVol - a.totalVol);

    const SankeyData = transformData(data);
    const { nodes, links } = sankey(SankeyData);

    const node = sankeyGroup.append("g")
        .selectAll("rect")
        .data(nodes)
        .enter().append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => Math.max(0, d.y1 - d.y0))
        .attr("width", d => Math.max(0, d.x1 - d.x0)) 
        .attr("fill", d => d.isImport ? "#f1a649" : "#24829a")
        .style("stroke-width", "1")
        .style("opacity", d => d.isImport ? 0 : 1)
        .on("mouseover", function (event, d) {
            if (!clickedNode) { // Only allow hover if no node is focused
                d3.selectAll(".sankey-hover").style("stroke-opacity", 0.25);
                d3.selectAll(".sankey-hover")
                    .filter(l => l.source === d || l.target === d)
                    .style("stroke-opacity", 0.8);
            }
        })
        .on("mouseout", function () {
            if (!clickedNode) { // Only reset opacity if no node is focused
                d3.selectAll(".sankey-hover").style("stroke-opacity", 0.8);
            }
        })
        .on("click", function (event, d) {
            const explanationElement = document.querySelector('.explanation');

            if (d.isExport) {
                if (clickedNode === d) {
                    // Unfocus the node
                    clickedNode = null;
                    d3.selectAll(".sankey-hover").style("stroke-opacity", 0.8);
                    hideBarChart(); // Hide the bar chart
                    explanationElement.textContent = "Top 5 global exporters and their largest trade corridors, 2023"; // Restore original text
                } else {
                    // Focus on the new node
                    clickedNode = d;
                    d3.selectAll(".sankey-hover").style("stroke-opacity", 0.25);
                    d3.selectAll(".sankey-hover")
                        .filter(l => l.source === d)
                        .style("stroke-opacity", 0.8);

                    const exporterData = datasets[currentDataset].find(exporter => exporter.country === d.name);
                    if (exporterData && exporterData.receivers) {
                        updateChartDisplay(true, false);
                        drawBarChart(exporterData);
                    } else {
                        console.error("No valid data found for exporter:", d.name);
                    }
                    explanationElement.textContent = `Top 5 export flows from ${d.name}, 2023.`;
                }
            } else if (d.isImport) {
                if (clickedNode === d) {
                    // Unfocus the node
                    clickedNode = null;
                    d3.selectAll(".sankey-hover").style("stroke-opacity", 0.8);
                    hideDonutChart(); // Hide the donut chart
                    explanationElement.textContent = "Top 5 global exporters and their largest trade corridors, 2023"; // Restore original text
                } else {
                    // Focus on the new node
                    clickedNode = d;
                    d3.selectAll(".sankey-hover").style("stroke-opacity", 0.25);
                    d3.selectAll(".sankey-hover")
                        .filter(l => l.target === d)
                        .style("stroke-opacity", 0.8);

                    // const importerData = datasets[currentDataset].find(importer => importer.country === d.name);
                    if (d.name) {
                        updateChartDisplay(false, true);
                        drawDonutChart(d.name);
                    } else {
                        console.error("No valid data found for importer:", d.name);
                    }
                    explanationElement.textContent = `Import flows to ${d.name} from top 5 global exporters, 2023.`;
                }
            }
        });

    const link = sankeyGroup.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.8)
        .selectAll("path")
        .data(links)
        .enter().append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", "url(#linkGradient)")
        .attr("stroke-width", d => Math.max(1, d.width))
        .attr("class", "sankey-hover")
        .style("stroke-dasharray", function () { return this.getTotalLength(); })
        .style("stroke-dashoffset", function () { return this.getTotalLength(); })
        .on("mouseover", function (event, d) {
            if (!clickedNode) { // Only allow hover if no node is focused
                d3.selectAll(".sankey-hover").style("stroke-opacity", 0.25);
                d3.select(this).style("stroke-opacity", 0.8);
            }
        })
        .on("mouseout", function () {
            if (!clickedNode) { // Only reset opacity if no node is focused
                d3.selectAll(".sankey-hover").style("stroke-opacity", 0.8);
            }
        });

    // Animate links
    const linkDuration = 1800;
    link.transition()
        .duration(linkDuration)
        .style("stroke-dashoffset", 0);

    // Reveal target nodes and labels
    const revealDelay = linkDuration - 400; // Start revealing 400ms before links finish
    const revealDuration = 800; // Duration for node and label appearance

    d3.selectAll('rect')
        .filter(node => node && node.isImport)
        .transition()
        .delay(revealDelay)
        .duration(revealDuration)
        .style("opacity", 1);

    const labels = sankeyGroup.append("g")
        .attr("font-family", "Akkurat Bold")
        .attr("font-size", 13)
        .attr("fill", "white")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("x", d => d.x0 === 0 ? d.x0 - 5 : d.x1 + 5)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 === 0 ? "end" : "start")
        .text(d => {
            let label = d.name;
            const parentCountry = data.find(countryInfo =>
                label.startsWith(countryInfo.country) || label.includes(countryInfo.country + ' (imports)')
            );
            if (parentCountry) {
                const countryCodeWithSuffix = `${parentCountry.code}${label.replace(parentCountry.country, '')}`;
                label = label.length > 12 ? countryCodeWithSuffix : label;
            }
            return label;
        })
        .style("opacity", d => d.isImport ? 0 : 1)
        .transition()
        .delay(revealDelay)
        .duration(revealDuration)
        .style("opacity", 1);

    svg.append("text")
        .attr("x", (containerWidth - sankeyWidth) / 2 - 2)
        .attr("y", 30)
        .attr("font-family", "Akkurat Bold")
        .attr("font-size", Math.max(14, containerWidth / 50))
        .attr("fill", "white")
        .text("Exporter");

    const importerText = svg.append("text")
        .attr("font-family", "Akkurat Bold")
        .attr("font-size", Math.max(14, containerWidth / 50))
        .attr("fill", "white")
        .text("Importer");

    const importerTextWidth = importerText.node().getBBox().width;
    importerText.remove();

    svg.append("text")
        .attr("x", sankeyWidth + (containerWidth - sankeyWidth) / 2 - importerTextWidth)
        .attr("y", 30)
        .attr("font-family", "Akkurat Bold")
        .attr("font-size", Math.max(14, containerWidth / 50))
        .attr("fill", "white")
        .text("Importer");
}

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', event => {
        document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentDataset = button.dataset.dataset;
        drawSankey(datasets[currentDataset]);
    });
});

drawSankey(datasets[currentDataset]);

window.addEventListener('resize', () => {
    drawSankey(datasets[currentDataset]);
});


