import * as Papa from "papaparse"
import * as fs from "fs"
import * as _ from "lodash"

type inputArray = {
    Klasse: string;
    Name: string;
    Erziehungsberechtigter: string;
    Zustimmung: string;
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
    const filedata = fs.readFileSync("./GYMVHH-2021-Schueler-MS365-umfrageergebnis.csv", "utf8")
    let inputCsv = Papa.parse<inputArray>(filedata, papaInputConfig)
    const outputArr: outputArray[] = []

    inputCsv.data.forEach((value) => {
        let name = value.Name.trim().split(", ");
        let username = name[1].trim() + "." + name[0].trim();
        username = username
          .replace("ä", "ae")
          .replace("ö", "oe")
          .replace("ü", "ue")
          .replace("ß", "ss")
          .replace(/\s*/g, "")
          .toLowerCase();

        let displayName = name[0] + " " + name[1]

        outputArr.push({
            Anzeigename: displayName,
            Benutzername: `${username}@gymvhh.de`,
            Nachname: name[0],
            Vorname: name[1],
            Abteilung: value.Klasse
        })
    })

    let orderedoutput = _.orderBy(outputArr, ["Abteilung","Anzeigename"], ["asc", "asc"])

    var outputcsv = Papa.unparse(outputArr, papaOutputConfig)

    fs.writeFileSync("GYMVHH-AAD-Schueler-importdatei.csv", outputcsv)

} catch (err) {
    console.error("could not read file")
}