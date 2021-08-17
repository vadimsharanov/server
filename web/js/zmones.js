

async function getPeople() {
    try {
     const res = await fetch("/json/zmogus");
     if (res.ok) {
         const zmones = await res.json();
         const app = document.getElementById("app");
         cleanElement(app)
         const ul = document.createElement("ul");
        for (const zmogus of zmones) {
            const li = document.createElement("li");
            li.appendChild(document.createTextNode(`${zmogus.vardas} ${zmogus.pavarde} (${zmogus.alga})`));
            ul.appendChild(li)
            const deleteButton = document.createElement("button");
            deleteButton.appendChild(document.createTextNode("delete"))
            deleteButton.onclick = deletePeople
            li.appendChild(deleteButton)
        }
        app.appendChild(ul)
     }
}
catch (err) {
    console.log(err);
}
}

function addPeople() {
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
    button.onclick = getPeople
    app.appendChild(button)
}

 async function savePeople() {
    let vardas = document.getElementById("vardas").value
    let pavarde = document.getElementById("pavarde").value
    let alga = (document.getElementById("alga")).value
    const zmogus = {
        vardas,
        pavarde,
        alga,
    };
    let res = await fetch("/json/zmogus", {
        method:"POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(zmogus)
    });
    if (!res.ok) {
        console.log("Save failed with status :" + res.status);
    }
    getPeople()
}

async function deletePeople() {
    const newNode = document.createTextNode("This text was added dynamic");
    document.body.appendChild(newNode)
}



function cleanElement(el) {
    if (el instanceof Element) {
        while (el.firstChild) {
            el.firstChild.remove()
        }
    }
}