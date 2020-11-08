const count = localStorage.getItem("count");
const values = localStorage.getItem("values").split(",");
const amounts = localStorage.getItem("amounts").split(",");
const roundNumber = document.getElementById('roundNumber');
const roundAmount = document.getElementById('roundAmount');
const amount = Number(amounts[0]);
const round5 = Number(amounts[1]);
const round10 = Number(amounts[2]);
const round15 = Number(amounts[3]);
const round20 = Number(amounts[4]);
let table = document.getElementById('table');
let accounts = []
let round = 1;

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0,
    //maximumFractionDigits: 0,
  });

class Account {
    constructor(amount, interest) {
        this.amount = amount;
        this.interest = interest;
    }

    calcAmount() {
        return this.amount * (this.interest / 100);
    }

    getAmount() {
        return this.amount
    }

    getRate() {
        return this.interest
    }

    payAmount(n) {
        this.amount = this.amount + this.calcAmount();
        this.amount = this.amount - n;
        if (this.amount < 0) {
            this.amount = 0
        }
        return this.amount;
    }
}



google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

let data = []
function start() {
    let header = ['Round']
    let starting_amounts = [0];
    let num = 0;
    for (i = 0; i < count; i++) {
        header.push(`Account ${i + 1}`);
        starting_amounts.push(Number(values[num]));
        num += 2;
    }
    data.push(header);
    data.push(starting_amounts);
    drawChart();

    for (i = 0; i < count * 2; i+=2) {
        let act = new Account(Number(values[i]), Number(values[i + 1]))
        accounts.push(act);
    }
    
    
    for (i = 0; i < count; i++) {
        let row = table.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        cell1.innerText = i + 1;
        cell2.innerText = formatter.format(accounts[i].getAmount().toFixed(2));
        cell3.innerText = `${accounts[i].getRate()}%`;
        cell4.innerText = formatter.format(accounts[i].calcAmount().toFixed(2));
        cell5.innerHTML = `<input type="text" id="amount${i + 1}"></input>`;

    }

    roundNumber.innerText = `Round Number: ${round}`;
    roundAmount.innerText = `Spending Limit: ${formatter.format(amount)}`;

}

function drawChart() {
    let graphData = google.visualization.arrayToDataTable(data);

    var options = {
        title: 'Debt Over Time',
        pointSize: 10,
        vAxis: {title: 'Amount',
                titleTextStyle: {'italic': false},
                minValue: 0},
        hAxis: {title: 'Round Number',
                titleTextStyle: {'italic': false},
                maxValue: 25, minValue: 0,
                gridlines: {interval: 1,},
                ticks: [0, 5, 10, 15, 20, 25]},
        width: '100%',
        chartArea:{
            top: 25,
            bottom: 70,
            width: '80%',
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(graphData, options);
}


function playRound() {
    if (round > 25) {
        document.getElementById("btn").disabled = true;
        alert(`Game over! You had ${formatter.format(getTotalDebt())} of debt left.`);
        return;
    }

    let spendingLimit = getRoundAmount();
    
    roundAmounts = [];
    let playerSpending = 0;
    for (i = 0; i < count; i++) {
        let amt = document.getElementById(`amount${i + 1}`).value;
        if (isNaN(amt) || Number(amt) < 0) {
            alert("You can only pay a positive number for an account");
            return;
        }
        amt = Number(amt);
        playerSpending += amt;
        roundAmounts.push(amt);
    }

    if (playerSpending > spendingLimit) {
        alert(`You only have ${formatter.format(spendingLimit)} but you are spending ${formatter.format(playerSpending)}`)
        return;
    } 
    
    for (i = 0; i < count; i++) {
        let account = accounts[i];
        account.payAmount(roundAmounts[i]);
    }

    roundValues = [round]
    for (i = 0; i < count; i++) {
        roundValues.push(accounts[i].getAmount());
    }
    data.push(roundValues);
    drawChart();

    for(r = 1; r < table.rows.length; r++) {
        let row = table.rows[r];
        row.cells[1].innerText = formatter.format(accounts[r - 1].getAmount().toFixed(2));
        row.cells[3].innerText = formatter.format(accounts[r - 1].calcAmount().toFixed(2));
        document.getElementById(`amount${r}`).value = '';
    }

    round += 1;
    if (getTotalDebt() <= 0) {
        document.getElementById("btn").disabled = true;
        alert(`Congratulations! In ${round - 1} rounds you paid off all of your debt!`);
        return;
    }
    roundNumber.innerText = `Round Number: ${round}`;
    roundAmount.innerText = `Spending Limit: ${formatter.format(getRoundAmount())}`;
}

function getRoundAmount() {
    if (round == 5) {
        return round5;
    }
    else if (round == 10) {
        return round10;
    }
    else if (round == 15) {
        return round15;
    }
    else if (round == 20) {
        return round20;
    }
    else {
        return amount;
    }
}

function getTotalDebt() {
    let totalDebt = 0;
    for(i = 0; i < accounts.length; i++) {
        totalDebt += accounts[i].getAmount();
    }
    return totalDebt;
}