// const Points = THREE.Points;
// const PointsMaterial = THREE.PointsMaterial;
// const BufferGeometry = THREE.BufferGeometry;
// const Float32BufferAttribute = THREE.Float32BufferAttribute;

function processData(data) {
    const nodes = [];
    const links = [];
    const nodeMap = {};

    data.forEach(exporter => {
        const topExportsSum = exporter.receivers
            .map(receiver => receiver.volume)
            .sort((a, b) => b - a)
            .reduce((sum, volume) => sum + volume, 0);

        if (!nodeMap[exporter.country]) {
            nodeMap[exporter.country] = { id: exporter.country, exportVolume: topExportsSum, importVolume: 0, isExport: true, isImport: false };
            nodes.push(nodeMap[exporter.country]);
        } else {
            nodeMap[exporter.country].exportVolume = topExportsSum;
        }

        exporter.receivers.forEach(receiver => {
            if (!nodeMap[receiver.country]) {
                nodeMap[receiver.country] = { id: receiver.country, exportVolume: 0, importVolume: 0, isExport: false, isImport: true };
                nodes.push(nodeMap[receiver.country]);
            }
            nodeMap[receiver.country].importVolume += receiver.volume;
            links.push({ source: nodeMap[exporter.country], target: nodeMap[receiver.country], volume: receiver.volume });
        });
    });

    nodes.forEach(node => {
        if (node.exportVolume > 0) {
            node.isExport = true;
        }
        if (node.importVolume > 0) {
            node.isImport = true;
        }
    });

    return { nodes, links };
}


// Initialize graphData with the current dataset
let graphData = processData(datasets[currentDataset]);

// Initialize the ForceGraph3D instance
const container = document.getElementById('3d_graph');
const sizeFactor = 0.023;
let focusedNode = null;


const Graph = new ForceGraph3D(container)
    .width(container.clientWidth)
    .height(container.clientHeight)
    .cameraPosition({ x: 0, y: 0, z: 170 }, { x: 0, y: 0, z: 0 }, 0)
    .backgroundColor('#0A0A0A')
    .graphData(graphData)
    .cooldownTicks(100)
    .linkDirectionalParticleWidth(0.5)
    .linkWidth(0.4)

    .nodeThreeObject(node => {
        const exportVolume = node.exportVolume || 0;
        const importVolume = node.importVolume || 0;

        const isConcentric = node.isExport && node.isImport;
        const totalVolume = exportVolume + importVolume; // Calculate total volume

        // Use totalVolume for the size of the outer sphere
        const outerGeometry = new THREE.SphereGeometry(Math.cbrt(totalVolume) * sizeFactor, 32, 32);
        const outerMaterial = new THREE.MeshBasicMaterial({
            color: exportVolume >= importVolume ? 0x24829a : 0xf1a649,
            transparent: false,
            opacity: 1,
            depthWrite: isConcentric ? false : true
        });
        const outerSphere = new THREE.Mesh(outerGeometry, outerMaterial);

        if (isConcentric) {
            const innerVolume = Math.min(exportVolume, importVolume);
            const innerGeometry = new THREE.SphereGeometry(Math.cbrt(innerVolume) * sizeFactor * 0.9, 32, 32);
            const innerMaterial = new THREE.MeshBasicMaterial({
                color: exportVolume < importVolume ? 0x24829a : 0xf1a649,
                transparent: false,
            });
            const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
            outerSphere.add(innerSphere);
        }

        node.__threeObj = outerSphere;

        // Create a SpriteText label
        const sprite = new SpriteText(node.id);
        sprite.color = 'white';
        sprite.fontFace = "Akkurat Bold";
        sprite.fontSize = 100;
        sprite.textHeight = 3;
        sprite.position.set(0, Math.cbrt(totalVolume) * sizeFactor + 3.5, 0);
        outerSphere.add(sprite);

        // Add click event listener to sprite
        sprite.onClick = () => {
            handleNodeClick(node);
        };

        return outerSphere;
    })
    .onNodeClick(handleNodeClick);

function handleNodeClick(clickedNode) {
    const explanationElement = document.querySelector('.explanation');
    const originalText = "Top 5 global exporters and their largest trade corridors, 2023";

    if (focusedNode === clickedNode) {
        // Reset view
        focusedNode = null;
        explanationElement.textContent = originalText; // Restore original text
        graphData.nodes.forEach(node => {
            if (node.__threeObj && node.__threeObj.material) {
                node.__threeObj.material.opacity = 1;
                node.__threeObj.material.transparent = false;
            }
        });
        Graph.linkDirectionalParticles(0);
        Graph.cameraPosition(
            { x: 0, y: 0, z: 170 },
            { x: 0, y: 0, z: 0 },
            1600
        );

        hideBarChart();
        hideDonutChart();

    } else {
        // Focus on new node
        focusedNode = clickedNode;

        const relatedNodes = new Set([clickedNode.id]);
        graphData.links.forEach(link => {
            if (link.source.id === clickedNode.id || link.target.id === clickedNode.id) {
                relatedNodes.add(link.source.id);
                relatedNodes.add(link.target.id);
            }
        });

        graphData.nodes.forEach(node => {
            if (node.__threeObj && node.__threeObj.material) {
                node.__threeObj.material.opacity = relatedNodes.has(node.id) ? 1 : 0.2;
                node.__threeObj.material.transparent = !relatedNodes.has(node.id);
            }
        });

        Graph.linkDirectionalParticles(link => {
            return link.source.id === clickedNode.id || link.target.id === clickedNode.id ? 2 : 0;
        });

        // Calculate the camera position to focus on the clicked node
        const distance = 60;
        const distRatio = 1 + distance / Math.hypot(clickedNode.x, clickedNode.y, clickedNode.z);

        const newPos = clickedNode.x || clickedNode.y || clickedNode.z
            ? { x: clickedNode.x * distRatio, y: clickedNode.y * distRatio, z: clickedNode.z * distRatio }
            : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

        Graph.cameraPosition(
            newPos, // new position
            clickedNode, // lookAt ({ x, y, z })
            2500  // ms transition duration
        );

        // Update explanation text based on node type
        if (clickedNode.isExport && clickedNode.isImport) {
            explanationElement.textContent = `Trade flows for ${clickedNode.id}, 2023: Top 5 Exports and Imports.`;
            updateChartDisplay(true, true);
            drawBarChart(datasets[currentDataset].find(d => d.country === clickedNode.id));
            drawDonutChart(clickedNode.id);

        } else if (clickedNode.isExport) {
            explanationElement.textContent = `Top 5 export flows from ${clickedNode.id}, 2023.`;
            updateChartDisplay(true, false);
            drawBarChart(datasets[currentDataset].find(d => d.country === clickedNode.id));

        } else if (clickedNode.isImport) {
            explanationElement.textContent = `Import flows to ${clickedNode.id} from top 5 global exporters, 2023.`;
            updateChartDisplay(false, true);
            drawDonutChart(clickedNode.id);
        }
    }
    hideGanttChart();
    updateChartForNode(clickedNode.id, currentFertilizerType);
}

function updateChartDisplay(showBarChart, showDonutChart) {
    const barplotContainer = document.querySelector('.barplot-container');
    const donutchartContainer = document.querySelector('.donutchart-container');

    if (showBarChart) {
        barplotContainer.style.display = 'flex';
    } else {
        barplotContainer.style.display = 'none';
    }

    if (showDonutChart) {
        donutchartContainer.style.display = 'flex';
    } else {
        donutchartContainer.style.display = 'none';
    }
}


function updateGraph(dataKey) {
    currentDataset = dataKey;
    graphData = processData(datasets[dataKey]);

    Graph.graphData(graphData);

    graphData.nodes.forEach(node => {
        if (node.__threeObj && node.__threeObj.material) {
            node.__threeObj.material.opacity = 1;
            node.__threeObj.material.transparent = false;
        }
    });

    Graph.linkDirectionalParticles(0);
    Graph.cameraPosition({ x: 0, y: 0, z: 170 }, { x: 0, y: 0, z: 0 }, 0);

    focusedNode = null;
    Graph.d3ReheatSimulation();
}

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', event => {
        document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        updateGraph(button.dataset.dataset);
    });
});

window.addEventListener('resize', () => {
    Graph.width(container.clientWidth);
    Graph.height(container.clientHeight);
});

// Create a dynamic starfield
// const isMobile = container.clientWidth <= 700;
// const starGeometry = new BufferGeometry();
// const starCount = isMobile ? 800 : 2000; // Increase number of stars for density
// const starDistance = 1800;
// const starVertices = [];
// for (let i = 0; i < starCount; i++) {
//     const x = THREE.MathUtils.randFloatSpread(starDistance);
//     const y = THREE.MathUtils.randFloatSpread(starDistance);
//     const z = THREE.MathUtils.randFloatSpread(starDistance);
//     starVertices.push(x, y, z);
// }
// starGeometry.setAttribute('position', new Float32BufferAttribute(starVertices, 3));

// const starMaterial = new PointsMaterial({
//     color: 0xffffff,
//     size: 1.5,
//     sizeAttenuation: true,
// });
// const starField = new Points(starGeometry, starMaterial);
// Graph.scene().add(starField);

// // Animate the scene
// function animate() {
//     requestAnimationFrame(animate);
//     TWEEN.update();
// }
// animate();