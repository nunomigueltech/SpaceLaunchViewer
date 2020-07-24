document.getElementById('searchAgency').onclick = function(event) {
    event.preventDefault();
    const agencySelection = document.getElementById('selectAgency').value;
    const apiURL = 'https://launchlibrary.net/1.3/agency/' + agencySelection;

    fetch(apiURL).then((response) => {
        return response.json();
    }).then((json) => {
        renderAgencyCard(json);
        renderLaunches(json);
    });
};

function renderAgencyCard(json) {
    const cardBody = document.querySelector('#resultsContainer .card .card-body');
    cardBody.innerHTML = '';

    let agencyTitle = document.createElement('h4');
    agencyTitle.classList.add('card-title');
    agencyTitle.innerText = json['agencies'][0]['name'] + ' (' + json['agencies'][0]['abbrev'] + ')';

    let agencyWikipedia = document.createElement('a');
    agencyWikipedia.classList.add('btn');
    agencyWikipedia.classList.add('btn-outline-dark');
    agencyWikipedia.classList.add('mb-4')
    agencyWikipedia.innerText = 'Wikipedia Article';
    agencyWikipedia.href = json['agencies'][0]['wikiURL'];

    // TABLE FORMATION
    const linkTable = document.createElement('table');
    linkTable.classList.add('table');
    const tableHead = document.createElement('thead');
    tableHead.classList.add('thead-dark');
    const tableHeadRow = document.createElement('tr');
    const tableHeadElement = document.createElement('th');
    tableHeadElement.innerText = 'Useful Links';
    const tableBody = document.createElement('tbody');

    tableHeadRow.appendChild(tableHeadElement);
    tableHead.appendChild(tableHeadRow);
    linkTable.appendChild(tableHead);
    linkTable.appendChild(tableBody);

    const urlArray = json['agencies'][0]['infoURLs'];
    urlArray.map(url => {
        let tableRow = document.createElement('tr');
        let tableElement = document.createElement('td');
        let tableLink = document.createElement('a');
        tableLink.innerText = url;
        tableLink.href = url;

        tableElement.appendChild(tableLink);
        tableRow.appendChild(tableElement);
        tableBody.appendChild(tableRow);
    });

    cardBody.appendChild(agencyTitle);
    cardBody.appendChild(agencyWikipedia);
    cardBody.appendChild(linkTable);
}

function renderLaunches(json) {
    const launchTitle = document.querySelector('#resultsContainer h3');
    launchTitle.classList.remove('d-none');

    const launchTable = document.querySelector('#agencyLaunchTable');
    launchTable.classList.remove('d-none');

    const launchTableBody = document.querySelector('#agencyLaunchTable tbody');
    launchTableBody.innerHTML = '';

    const isLaunchServiceProvider = json['agencies'][0]['islsp'];
    const agencyName = json['agencies'][0]['name'];
    const agencyAbbrev = json['agencies'][0]['abbrev'];

    if (isLaunchServiceProvider === 1) {
        // get upcoming launches
        let apiURL = 'https://launchlibrary.net/1.3/launch/next/5?lsp=' + agencyAbbrev;

        fetch(apiURL).then(response => {
            return response.json();
        }).then(json => {
            let currentID = 1;

            for (let launch of json['launches']) {
                let launchDate = new Date(launch['windowstart']).toDateString();
                let launchName = launch['name'];
                let rocketName = launch['rocket']['name'];
                let launchpadName = launch['location']['pads'][0]['name'];

                addRow(launchTableBody, [currentID, launchDate, launchName, rocketName, launchpadName]);
                currentID++;
            }
        });
    } else {
        let newRow = document.createElement('tr');
        let newElement = document.createElement('td');
        newElement.colSpan = 5;
        newElement.innerText = agencyName + ' is not a launch service provider.';

        newRow.appendChild(newElement);
        launchTableBody.appendChild(newRow);
    }
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