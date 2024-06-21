async function get_request(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send();
    return xmlHttp.responseText;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addData(chart, label, newData) {

    chart.data.labels.push(label);

    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(newData);
    });

    chart.update();

}

var myChart = null;

var last_timestamp = null;

async function buildChart() {

    var current_url_string = window.location.href;
    var current_url = new URL(current_url_string);

    var data_url = current_url.origin + "/get_chart_data";

    var chart_data_response = await get_request(data_url);

    var chart_data = JSON.parse(chart_data_response);

    var labels = chart_data.map(x => x.DateTime);

    var values = chart_data.map(x => x.Value);

    const ctx = document.getElementById('chart');

    try {

        myChart = new Chart(ctx, {
            data: {
                datasets: [
                    {
                        type: 'line',
                        label: 'Random Walk',
                        data: values,
                        backgroundColor: 'royalblue',
                        borderColor: 'royalblue'
                    }
                ],
                labels: labels
            }
        });

        myChart.options.animation = false;

        last_timestamp = chart_data.map(x => x.Timestamp).slice(-1)[0];

    }
    catch (error) {

        new_data = chart_data.filter(x => x.Timestamp > last_timestamp)

        for (var row of new_data) {
            addData(myChart, row.DateTime, row.Value)
        }

        if (new_data.length > 0) {
            last_timestamp = chart_data.map(x => x.Timestamp).slice(-1)[0];
        }

    }
}

async function read_and_build_chart() {

    while(true) {
        buildChart()
        await sleep(500.0)
    }

}

window.onload = function() {
    read_and_build_chart()
}
