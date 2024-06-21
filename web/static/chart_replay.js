async function get_request(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send();
    return xmlHttp.responseText;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
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

async function replay_chart() {

    // http://localhost:8080/get_interval_chart_data?start_time=2024-6-21%2011:18:30&end_time=2024-6-21%2011:19:30

    start_time = get('start_time')
    end_time = get('end_time')

    if((start_time == null) || (end_time == null)) {
        // window.alert('Please choose a start time and an end time.');
        return;
    }

    var current_url_string = window.location.href;

    var current_url = new URL(current_url_string);

    var data_url = current_url.origin + `/get_interval_chart_data?start_time=${start_time}&end_time=${end_time}`

    var chart_data_response = await get_request(data_url);

    var chart_data = JSON.parse(chart_data_response);

    const ctx = document.getElementById('chart');

    for (var row of chart_data) {

        time_elem = document.getElementById("random_walk_time")
        value_elem = document.getElementById("random_walk_value")

        time_elem.innerHTML = `Time: ${row.DateTime}`
        value_elem.innerHTML = `Value: ${row.Value}`

        try {

            myChart = new Chart(ctx, {
                data: {
                    datasets: [
                        {
                            type: 'line',
                            label: 'Random Walk',
                            data: [row.Value],
                            backgroundColor: 'royalblue',
                            borderColor: 'royalblue'
                        }
                    ],
                    labels: [row.DateTime]
                }
            });

            myChart.options.animation = false;

        }
        catch (error) {

            addData(myChart, row.DateTime, row.Value)

        }

        await sleep(1000.0);
    }
}


window.onload = function() {
    replay_chart()
}
