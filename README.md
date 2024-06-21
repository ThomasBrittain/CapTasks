Thank you for taking the time to read my code, please find general information on the project,
and instructions on how to run the different tasks below.

* To run the random walk generator, run the file tasks/random_walk.py.
  * The random walk history is stored as a DataFrame in a pickle file at /tasks/RandomWalkDB


* To run the web backend, run the file web/controllers.py.


* The main webpage can be accessed through http://localhost:8080/
  * Links to other tasks are also located on this page
    * http://localhost:8080/chart displays historical and live data updates of the random walk
    * http://localhost:8080/chart_replay will allow users to replay a historical
    section of the random walk


* Charting is handled with chart.js (https://www.chartjs.org/).


* tasks/ contains the script random_walk.py for running the random walk
and accessing data, and the pickle file RandomWalkDB for historical random walk data.


* web/ contains all endpoint controllers, and html/css/js files for the frontend.
