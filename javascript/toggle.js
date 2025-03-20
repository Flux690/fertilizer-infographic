document.addEventListener('DOMContentLoaded', function () {
    const canvasContainer = document.getElementById('3d_graph');
    const sankeyContainer = document.getElementById('sankey');
    const diagramViewButton = document.getElementById('network_chart_toggle');
    const sankeyViewButton = document.getElementById('sankey_chart_toggle');

    // Set initial visibility
    canvasContainer.style.display = 'block';
    sankeyContainer.style.display = 'none';

    function resetView() {
        hideBarChart();
        hideDonutChart();
        hideGanttChart();
        document.querySelector('.donutchart-container').style.display = 'none';
        document.querySelector('.barplot-container').style.display = 'none';
    }

    function drawCurrentView() {
        if (canvasContainer.style.display === 'block') {
            updateGraph(currentDataset);
        } else {
            drawSankey(datasets[currentDataset]);
        }
    }

    diagramViewButton.addEventListener('click', function () {
        if (!diagramViewButton.classList.contains('active')) {
            resetView();
            canvasContainer.style.display = 'block';
            sankeyContainer.style.display = 'none';
            diagramViewButton.classList.add('active');
            sankeyViewButton.classList.remove('active');
            drawCurrentView();
        }
    });

    sankeyViewButton.addEventListener('click', function () {
        if (!sankeyViewButton.classList.contains('active')) {
            resetView();
            canvasContainer.style.display = 'none';
            sankeyContainer.style.display = 'block';
            sankeyViewButton.classList.add('active');
            diagramViewButton.classList.remove('active');
            drawCurrentView();
        }
    });

    // Event listener for dataset buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', event => {
            document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentDataset = button.dataset.dataset;
            currentFertilizerType = button.dataset.dataset;
            
            resetView();
            drawCurrentView();
        });
    });
});
