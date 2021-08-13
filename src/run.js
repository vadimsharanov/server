import express, { response } from "express";
import { readFile, writeFile } from "fs/promises";
import Handlebars from "handlebars";
import exphbs from "express-handlebars";

const SERVER_PORT = 3000;
const WEB_DIR = "web";
const DATA_FILE = "zmones.json"

const app = express()
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
                    // midlewar'u registravimo tvarka, turi reiksme
app.use(express.static(WEB_DIR, {
    index: false,   // pagal default'ine reiksme, programa skaitys is pradziu index.html,
                    // bet boolean'u false mes pasakome, kad default'a panaikiname
}));                // Reaguoja i visas uzklausas, patikrina, ar web direktorijoje yra toks failas, 
                    //jeigu yra - uzklausa apdorojama[nusius atsakyma narsyklej],
                    // ir next() nekvieciamas, o jei yra yra, tai kviecia funckjia next, ir ziures, kokius middlewar'us reikia atlikti.

// app.use((req, res, next) => { // login middleWar'as
//     console.log(req);        // kiekviena uzklausa(request) bus atspausdinta;
//                             // iskviesdamas sia funckija, sakau, kad apdorojimas dar nebaigtas, liepiu dirbti kitiem savo darba.
// })

app.use(express.urlencoded( {
    extended:true
}))

app.get("/", async function (req, res) {
    try {
        let zmones = await readFile(DATA_FILE, {
        encoding:"utf-8"
    })
    zmones = JSON.parse(zmones);
    res.render("zmones", { zmones , title: "Pilnas zmoniu sarasas"});
}
    catch (err) {
    res.status(500).end(`<html><body><h1>Ivyko klaida ${err.message}<h1></body></html>`);
}
});

app.get("/zmogus/:id", async (req, res) => {
    try {
        let zmones = await readFile(DATA_FILE, {
        encoding:"utf-8"
    })
    zmones = JSON.parse(zmones);

    const id = parseInt(req.params.id);
    const zmogus = zmones.find(z => z.id === id);
    res.render("zmogus", { zmogus, title: "Zmogaus informacija"});
}
    catch (err) {
    res.status(500).end(`<html><body><h1>Ivyko klaida ${err.message}<h1></body></html>`);
}
});

app.post("/zmogus", async (req, res) => {
    try {
        let zmones = await readFile(DATA_FILE, {
        encoding:"utf-8"
    })
    zmones = JSON.parse(zmones);
    let nextId = 0;
    for (const zmogus of zmones) {
        if (zmogus.id > nextId) {
        nextId = zmogus.id
    }
}
    nextId++;
    
    const zmogus = {
        id: nextId,
        vardas: req.body.vardas,
        pavarde: req.body.pavarde,
        alga: parseFloat(req.body.alga),
    }

    zmones.push(zmogus);
    console.log(req.body.zmogus2);
    
    await writeFile(DATA_FILE, JSON.stringify(zmones, null, 2), {
        encoding:"utf8"
    })
    res.redirect("/")
}
catch (err) {
    res.status(500).end(`<html><body><h1>Ivyko klaida ${err.message}<h1></body></html>`);
}

})
app.post("/", async (req, res) => {
    try {
        let zmones = await readFile(DATA_FILE, {
            encoding:"utf-8"
        })
        let id =0;
        zmones = JSON.parse(zmones);
        for (let i=1; i <=zmones.length; i++) {
            if (Number((Object.keys(req.body))) === i){
                id = i;
            }
        }
        for (const zmogus of zmones) {
            if (zmogus.id === id) {
                zmones.splice(id-1,1)
            }
        }

        await writeFile(DATA_FILE, JSON.stringify(zmones, null, 2), {
                encoding:"utf8"
            })
            
        res.redirect("/")
}
    catch (err) {
    res.status(500).end(`<html><body><h1>Ivyko klaida ${err.message}<h1></body></html>`);
}

})

app.listen(SERVER_PORT)

console.log(`Server started at port: ${SERVER_PORT}`);


    