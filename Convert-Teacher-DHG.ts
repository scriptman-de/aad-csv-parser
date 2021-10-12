import * as Papa from "papaparse"
import * as fs from "fs"

type inputArray = {
    Vorname: string;
    Nachname: string;
}

type outputArray = {
    "Benutzername": string;
    "Vorname": string;
    "Nachname": string;
    "Anzeigename": string;
    "Position"?: string;
    "Abteilung"?: string;
    "Telefon – Geschäftlich"?: string;
    "Telefon (geschäftlich)"?: string;
    "Mobiltelefon"?: string;
    "Fax"?: string;
    "Alternative E-Mail-Adresse": string;
    "Adresse"?: string;
    "Ort"?: string;
    "Bundesstaat"?: string;
    "Postleitzahl"?: string;
    "Land oder Region"?: string;
}

const papaInputConfig = {
 delimiter: ";",
 header: true, 
 skipEmptyLines: true,
}

const papaOutputConfig = {
    delimiter: ",",
    quotes: false,
    columns: [
        "Benutzername",
        "Vorname",
        "Nachname",
        "Anzeigename",
        "Position",
        "Abteilung",
        "Telefon – Geschäftlich",
        "Telefon (geschäftlich)",
        "Mobiltelefon",
        "Fax",
        "Alternative E-Mail-Adresse",
        "Adresse",
        "Ort",
        "Bundesstaat",
        "Postleitzahl",
        "Land oder Region"
    ]
}

try {
    const filedata = fs.readFileSync("./DHG-Lehrer_21_22_SNV.CSV", "utf8")
    let inputCsv = Papa.parse<inputArray>(filedata, papaInputConfig)
    const outputArr: outputArray[] = []

    inputCsv.data.forEach((value) => {
        let username = value.Vorname.substr(0,1) + "." + value.Nachname
        username = username.replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("Ä", "Ae").replace("Ö", "Oe").replace("Ü", "Ue").replace("ß", "ss").replace(/\s*/g, "").toLowerCase()
        
        let displayName = value.Nachname + " " + value.Vorname.substr(0,1) + "."
        outputArr.push({
            Anzeigename: displayName,
            Benutzername: `${username}@gymdhg.onmicrosoft.com`,
            Nachname: value.Nachname,
            Vorname: value.Vorname,
            "Alternative E-Mail-Adresse": `${username}@deutschhaus.de`
        })
    })

    var outputcsv = Papa.unparse(outputArr, papaOutputConfig)
    
    fs.writeFileSync("DHG-aad_teacher_output.csv", outputcsv)
    
} catch(err) {
    console.error("could not read file")
}