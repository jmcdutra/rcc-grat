window.onload = function() {
    loadGratifications();
};

function addNewRow(data = {}) {
    let table = document.getElementById("gratificationsTable");
    let row = table.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);

    cell1.innerHTML = `<select>
                           <option value="OP1" ${data.role === "OP1" ? "selected" : ""}>Operador 1</option>
                           <option value="OP2" ${data.role === "OP2" ? "selected" : ""}>Operador 2</option>
                           <option value="OP3" ${data.role === "OP3" ? "selected" : ""}>Operador 3</option>
                           <option value="OP4" ${data.role === "OP4" ? "selected" : ""}>Operador 4</option>
                           <option value="AO" ${data.role === "AO" ? "selected" : ""}>Auxiliar Operacional</option>
                           <option value="CG" ${data.role === "CG" ? "selected" : ""}>Cabo da Guarda</option>
                           <option value="ACG" ${data.role === "ACG" ? "selected" : ""}>Auxiliar do Cabo da Guarda</option>
                           <option value="OG" ${data.role === "OG" ? "selected" : ""}>Oficial da Guarda</option>
                           <option value="SEN" ${data.role === "SEN" ? "selected" : ""}>Sentinela</option>
                       </select>`;
    cell2.innerHTML = `<input type='text' placeholder='Nickname' value='${data.nickname || ""}'/>`;
    cell3.innerHTML = `<input type='datetime-local' value='${data.observation || ""}' onchange='updateInitialGratificationTime(this)'/>`;
    cell4.innerHTML = `<input type='text' value='${data.nextGrat || "N/A"}' readonly/>`;
    cell5.innerHTML = `<input type='text' value='${data.lastGrat || "N/A"}' readonly/>`;
    cell6.innerHTML = `<button onclick='updateTime(this)'>Gratificar</button> <button onclick='deleteRow(this)'>Remover</button>`;
}

function saveGratifications() {
    let table = document.getElementById("gratificationsTable");
    let rows = table.rows;
    let data = [];

    for (let i = 1; i < rows.length; i++) {
        let row = rows[i];
        let rowData = {
            role: row.cells[0].childNodes[0].value,
            nickname: row.cells[1].childNodes[0].value,
            observation: row.cells[2].childNodes[0].value,
            nextGrat: row.cells[3].childNodes[0].value,
            lastGrat: row.cells[4].childNodes[0].value
        };
        data.push(rowData);
    }

    localStorage.setItem('gratificationsData', JSON.stringify(data));
    console.log("Dados salvos:", data);  // Debug: Dados salvos
}

function loadGratifications() {
    let data = JSON.parse(localStorage.getItem('gratificationsData')) || [];
    console.log("Dados carregos:", data);  // Debug: Dados carregados
    data.forEach(rowData => {
        addNewRow(rowData);
    });
}

function updateInitialGratificationTime(input) {
    let dateTime = new Date(input.value);
    let row = input.parentNode.parentNode;
    if (!input.value) {
        row.cells[4].childNodes[0].value = "N/A";
        return;
    }
    dateTime.setMinutes(dateTime.getMinutes() + 15);
    row.cells[4].childNodes[0].value = dateTime.toLocaleString(); // Set Next Gratification
    saveGratifications();
}

function updateTime(button) {
    let row = button.parentNode.parentNode;
    let currentTime = new Date();
    let nextGratTimeValue = row.cells[3].childNodes[0].value;
    let nextGratTime = new Date(nextGratTimeValue);

    if (currentTime < nextGratTime) {
        alert("Ainda não é hora da próxima gratificação. Por favor, aguarde mais.");
        return;
    }

    let newNextGratTime = new Date(currentTime.getTime() + 15*60000);
    row.cells[3].childNodes[0].value = newNextGratTime.toLocaleString(); // Update Next Gratification Time
    row.cells[4].childNodes[0].value = currentTime.toLocaleString(); // Update Last Gratification Time
    alert("Gratificação registrada com sucesso!");
    saveGratifications();
}

function deleteRow(button) {
    if (confirm("Você tem certeza que deseja remover esta linha?")) {
        let row = button.parentNode.parentNode;
        row.parentNode.removeChild(row);
        saveGratifications();  // Save state after removing a row
    }
}