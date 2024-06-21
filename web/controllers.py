import asyncio
from datetime import datetime

from flask import Flask, render_template, request

from tasks.random_walk import RandomWalk

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/chart')
def chart():
    return render_template('chart.html')


@app.route('/chart_replay')
def chart_replay():
    return render_template('replay.html')


@app.route('/get_time_and_value', methods=['GET'])
def get_time_and_value():

    last_time, last_value = asyncio.run(RandomWalk.get_time_and_value())

    return {'Time': last_time, 'Value': last_value}


@app.route('/get_chart_data', methods=['GET'])
def get_chart_data():

    chart_data = asyncio.run(RandomWalk.get_chart_data())

    return chart_data


@app.route('/get_interval_chart_data', methods=['GET'])
def get_interval_chart_data():
    start_time = request.args.get('start_time')
    end_time = request.args.get('end_time')

    start_time = datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S')
    end_time = datetime.strptime(end_time, '%Y-%m-%d %H:%M:%S')

    chart_data = asyncio.run(RandomWalk.get_chart_data(as_json=False, format_datetime=False))
    chart_data = chart_data[(start_time <= chart_data['DateTime']) & (chart_data['DateTime'] <= end_time)]
    chart_data['DateTime'] = chart_data['DateTime'].apply(lambda x: x.strftime("%H:%M:%S"))

    return chart_data.to_json(orient='records')


def run_server():
    app.run(host="localhost", port=8080, debug=True)


if __name__ == '__main__':
    run_server()
