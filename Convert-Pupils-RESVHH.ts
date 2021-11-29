import * as Papa from "papaparse"
import * as fs from "fs"

type inputArray = {
    Klasse: string;
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
    "Alternative E-Mail-Adresse"?: string;
    "Adresse"?: string;
    "Ort"?: string;
    "Bundesstaat"?: string;
    "Postleitzahl"?: string;
    "Land oder Region"?: string;
}

const papaInputConfig = {
    delimiter: ",",
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
    const filedata = fs.readFileSync("./RESHH-add-importdatei.csv", "utf8")
    let inputCsv = Papa.parse<inputArray>(filedata, papaInputConfig)
    const outputArr: outputArray[] = []

    inputCsv.data.forEach((value) => {
        let username = value.Vorname + "." + value.Nachname
        username = username
            .toLowerCase()
            .replace(/ä/gi, "ae")
            .replace(/ö/gi, "oe")
            .replace(/ü/gi, "ue")
            .replace("ß", "ss")
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/\s*/g, "")

        let displayName = value.Nachname + " " + value.Vorname
        outputArr.push({
            Anzeigename: displayName,
            Benutzername: `${username}@resvhh.onmicrosoft.com`,
            Nachname: value.Nachname,
            Vorname: value.Vorname,
            Abteilung: value.Klasse
        })
    })

    var outputcsv = Papa.unparse(outputArr, papaOutputConfig)

    console.log(outputcsv)

    fs.writeFileSync("RESVHH-AAD-Pupil-import.csv", outputcsv)

} catch (err) {
    console.error("could not read file")
}