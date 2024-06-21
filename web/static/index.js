async function get_request(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send();
    return xmlHttp.responseText;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function display_time_and_value(time_and_value) {
    console.log(time_and_value)

    json_data = JSON.parse(time_and_value)

    time_elem = document.getElementById("random_walk_time")
    value_elem = document.getElementById("random_walk_value")

    time_elem.innerHTML = `Time: ${json_data["Time"]}`
    value_elem.innerHTML = `Value: ${json_data["Value"]}`
}

async function read_and_display_values() {

    while(true) {
        time_and_value = await get_request("./get_time_and_value")
        display_time_and_value(time_and_value)
        await sleep(500.0)
    }

}

window.onload = function() {
    read_and_display_values()
}
