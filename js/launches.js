document.getElementById('refreshLaunches').onclick = function(event) {
    event.preventDefault();
    loadLaunches();
};

function loadLaunches() {
    const launchCount = document.getElementById('launchCount').value;
    const validRegex = /[1-9][0-9]*/;
    if (!validRegex.test(launchCount)) return;

    const apiURL = 'https://launchlibrary.net/1.3/launch/next/' + launchCount;

    fetch(apiURL).then((response) => {
        return response.json();
    }).then((json) => {
        renderLaunches(json, launchCount);
    });
}

function renderLaunches(json, launchCount) {
    const launchTitle = document.querySelector('#resultsContainer h5');
    if (launchCount > 1) {
        launchTitle.innerHTML = 'Showing Next ' + launchCount + ' Launches';
    } else {
        launchTitle.innerHTML = 'Showing Next Launch';
    }

    const launchTableBody = document.querySelector('#upcomingLaunchTable tbody');
    launchTableBody.innerHTML = '';

    // get upcoming launches
    let apiURL = 'https://launchlibrary.net/1.3/launch/next/' + launchCount;

    fetch(apiURL).then(response => {
        return response.json();
    }).then(json => {
        let currentID = 1;

        for (let launch of json['launches']) {
            let launchDate = new Date(launch['windowstart']).toDateString();
            let launchProvider = launch['lsp']['name'];
            let launchName = launch['name'];
            let rocketName = launch['rocket']['name'];
            let launchpadName = launch['location']['pads'][0]['name'];

            addRow(launchTableBody, [currentID, launchDate, launchProvider, launchName, rocketName, launchpadName]);
            currentID++;
        }
    }).catch(reason => {
        let newRow = document.createElement('tr');
        let newElement = document.createElement('td');
        newElement.colSpan = 6;
        newElement.innerText = 'Failed to load data from Launch Library API.';

        newRow.appendChild(newElement);
        launchTableBody.appendChild(newRow);
        launchTitle.innerHTML = 'Failed to Load Launch Data'
    });
}

// order of values in cellValueArray id, date, launchName, rocketName, launchpadName
function addRow(tableBody, cellValueArray) {
    const newRow = document.createElement('tr');

    for (let cellValue of cellValueArray) {
        let newElement = document.createElement('td');
        newElement.innerText = cellValue;

        newRow.appendChild(newElement);
    }

    tableBody.appendChild(newRow);
}

window.onload = loadLaunches();