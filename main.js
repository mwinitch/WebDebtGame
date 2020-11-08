const choice = document.getElementById('amount');
const inputs = document.getElementById('inputs');
const table = document.getElementById('table');
const table2 = document.getElementById('table2');
let count = 0


choice.addEventListener("change", (e) =>{
    e.preventDefault();
    count = e.target.value;
    table.querySelectorAll('*').forEach(n => n.remove());
    table2.querySelectorAll('*').forEach(n => n.remove());
    inputs.querySelectorAll('*').forEach(n => n.remove());
    let row = table.insertRow(0);
    row.setAttribute("class", "tableID");
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerText = "Account";
    cell2.innerText = "Starting Amount";
    cell3.innerText = "Interest Rate as a Percent";
    for (i = 0; i < count; i++) { 
        let row1 = table.insertRow(-1);
        let cell1 = row1.insertCell(0);
        let cell2 = row1.insertCell(1);
        let cell3 = row1.insertCell(2);
        cell1.innerText = i + 1;
        cell2.innerHTML = `<input type="text" id="amount${i + 1}"></input>`;
        cell3.innerHTML = `<input type="text" id="interest${i + 1}"></input>`;
    }

    let table2Row = table2.insertRow();
    table2Row.setAttribute("class", "tableID");
    let table2cell1 = table2Row.insertCell(0);
    let table2cell2 = table2Row.insertCell(1);
    table2cell1.innerText = "Round Number";
    table2cell2.innerText = "Amount";

    let row2 = table2.insertRow();
    cell1 = row2.insertCell(0);
    cell2 = row2.insertCell(1);
    cell1.innerText = "Regular Round";
    cell2.innerHTML = `<input type="text" id="normal"></input>`;

    for (i = 5; i < 21; i += 5) {
        let row = table2.insertRow();
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell1.innerText = `Round ${i}`;
        cell2.innerHTML = `<input type="text" id="round${i}"></input>`;
    }
    
    
    let button = document.createElement("button");
    button.innerText = "Start";
    button.onclick = start;
    inputs.appendChild(button);
})

function start() {
    let values = []
    for (i = 0; i < count; i++) {
        let acct_amt = document.getElementById(`amount${i + 1}`).value;
        let interest_amt = document.getElementById(`interest${i + 1}`).value;
        if (isNaN(acct_amt) || Number(acct_amt) < 0) {
            alert("Amounts and interest rates for the accounts must be positive numbers");
            return;
        }
        
        acct_amt = Number(acct_amt);
        interest_amt = Number(interest_amt);
        pair = [acct_amt, interest_amt];
        values.push(pair);
    }

    let roundAmounts = [];
    roundAmounts.push(document.getElementById("normal").value);
    roundAmounts.push(document.getElementById("round5").value);
    roundAmounts.push(document.getElementById("round10").value);
    roundAmounts.push(document.getElementById("round15").value);
    roundAmounts.push(document.getElementById("round20").value);
    for (j = 0; j < roundAmounts.length; j++){
        if (isNaN(roundAmounts[j]) || Number(roundAmounts[j]) < 0) {
            alert("Amounts for the rounds must be positive numbers.");
            return;
        }
    }
    
    localStorage.setItem("count", count);
    localStorage.setItem("values", values);
    localStorage.setItem("amounts", roundAmounts);
    window.location.href = "debt.html";
}