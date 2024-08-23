import {Chart, plugins, Tooltip} from 'chart.js/auto'

(async function () {
    const data = {
        labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Sprint 6', 'Sprint 7'],
        datasets: [
            {
                label: 'Actual task situations',
                data: [6, 7, 5, 3, 2, 1, 1],
                backgroundColor: 'rgba(255, 26, 104, 0.2)',
                borderColor: 'rgba(255, 26, 104, 1)',
                // borderWidth: 0,
                // fill: true,
                tasks: [0 , 1, -1, 0, 0, 0]
            },
            {
                label: 'Ideal tasks situations',
                data: [7, 6, 5, 4, 3, 0, 0],
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderColor: 'rgba(0, 0, 0, 1)',
                // borderWidth: 1,
                // pointRadius: 0,
                // hitRadius: 0
            },
            {
                label: 'Total tasks',
                data: [7, 8, 7, 7, 7, 7, 7],
                backgroundColor: 'yellow',
                borderColor: 'yellow',
                // borderWidth: 1,
                // pointRadius: 0,
                // hitRadius: 0
            }
        ]
    };

    // burndownChart plugin
    const burndownChartPlugin = {
        id: 'burndownChart',
        afterDatasetsDraw(chart, args, pluginOptions) {
            const { ctx, data, chartArea: {top, bottom, left, right, width, height }, scales: { x, y } } = chart;
            ctx.save();

            const segmentWidth = width / (data.labels.length - 1) / 2;
            const angle = Math.PI / 180;
            data.datasets[0].tasks.forEach((task, index) => {
                if(task !== 0) {
                    ctx.beginPath();
                    ctx.fillStyle = 'white';
                    // ctx.arc(x, y, radius, angleStart, angleEnd, false)
                    ctx.arc(
                        chart.getDatasetMeta(0).data[index].x + segmentWidth,
                        y.getPixelForValue(1),
                        15, 0,
                        angle * 360,
                        false
                    );
                    ctx.fill();
                    ctx.font = 'bold 12px sans-serif';
                    ctx.fillStyle = 'rgba(102, 102, 102, 1)';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(
                        task,
                        chart.getDatasetMeta(0).data[index].x + segmentWidth,
                        y.getPixelForValue(1)
                    )
                }
            });
        }
    }

    // config 
    const config = {
        type: 'bar',
        data,
        options: {
            interaction: {
              mode: 'index',
              intersect: false,
            },
            plugins: {
                tooltip:{
                    yAlign: 'bottom',
                    callbacks: {
                        afterBody: (context) =>{
                            return context[0].dataset.tasks[context[0].dataIndex] !== 0 ? '-------------': '';
                        },
                        footer: (context) => {
                            return context[0].dataset.tasks[context[0].dataIndex] !== 0 ? `Tasks changes: ${context[0].dataset.tasks[context[0].dataIndex]}`:'';
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Sprints'
                    },
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Tasks'
                    },
                    beginAtZero: true,
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        },
        // plugins: [burndownChartPlugin]
    };

    // render init block
    new Chart(
        document.getElementById('myChart'),
        config
    );

    // Instantly assign Chart.js version
    const chartVersion = document.getElementById('chartVersion');
    chartVersion.innerText = Chart.version;

})();