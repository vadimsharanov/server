let zmones = [];
async function getPeople() {
    try {
     const res = await fetch("/json/zmogus");
     if (res.ok) {
        zmones = await res.json();
        showPeople();
     }
     else {
        console.log(res.status, res.statusText);
        alert(`klaida gaunant duomenis is serverio:  ${res.statusText}` )
    }
}
catch (err) {
    console.log(err);
}
}
function showOnePeople() {
    const app = document.getElementById("app")
    cleanElement(app);
    let input;
    app.appendChild(document.createTextNode("Vardas"));
    input = document.createElement("input");
    input.id = "vardas";
    app.appendChild(input);
    app.appendChild(document.createElement("br"))
    
    app.appendChild(document.createTextNode("Pavarde"));
    input = document.createElement("input");
    input.id = "pavarde";
    app.appendChild(input);
    app.appendChild(document.createElement("br"))
    
    app.appendChild(document.createTextNode("Alga"));
    input = document.createElement("input");
    input.id = "alga";
    app.appendChild(input);
    app.appendChild(document.createElement("br"))

    let button;
    button = document.createElement("button");
    button.appendChild(document.createTextNode("save"));
    button.onclick = savePeople;
    app.appendChild(button)
    button = document.createElement("button");
    button.appendChild(document.createTextNode("Back"));
    button.onclick = showPeople;
    app.appendChild(button);
}


async function showPeople() {
            const app = document.getElementById("app");
            cleanElement(app)
            const table = document.createElement("table");
           for (const zmogus of zmones) {
               const tr = document.createElement("tr");
               const td = document.createElement("td");
               td.appendChild(document.createTextNode(`${zmogus.vardas} ${zmogus.pavarde} (${zmogus.alga})`));
               tr.appendChild(td);
               table.appendChild(tr)
               const deleteButton = document.createElement("button");
               deleteButton.appendChild(document.createTextNode("delete"));
               deleteButton.zmogusId = zmogus.id
               deleteButton.onclick = deletePeople
               td.appendChild(deleteButton)
           }
           app.appendChild(table)
        }


 async function savePeople() {
    let vardas = document.getElementById("vardas").value
    let pavarde = document.getElementById("pavarde").value
    let alga = (document.getElementById("alga")).value
    let zmogus = {
        vardas,
        pavarde,
        alga,
    };
    try {
    let res = await fetch("/json/zmogus", {
        method:"POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(zmogus)
    });
    if (res.ok) {
        zmogus = await res.json();
        zmones.push(zmogus);
        showPeople()
        // console.log("Save failed with status :" + res.status);
    }
    else {
        console.log(res.status, res.statusText);
        alert(`Klaida issaugant: ${res.statusText}`)
    }
} 
catch (err) {
    console.log(err);
} 
}


async function deletePeople(event) {
    if (event && event.target && event.target.zmogusId) {
       const index =  zmones.findIndex(z => z.id === event.target.zmogusId)
       const zmogus = zmones[index]; // priskiriame kintamajam "zmogus" tikslu json masyvo elemento numeri
        try {
            const res = await fetch("/json/zmogus/" + zmogus.id, {
            method: "DELETE"
        });
            if (res.ok) {
                zmones.splice(index,1);
               showPeople();
            }
            else {
                console.log(res.status, res.statusText);
                alert("klaida trinant: " + res.statusText )
            }
       }
       catch (err) {
           console.log(err);
       }
    }
}



function cleanElement(el) {
    if (el instanceof Element) {
        while (el.firstChild) {
            el.firstChild.remove()
        }
    }
}