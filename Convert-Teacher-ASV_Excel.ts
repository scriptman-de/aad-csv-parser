import * as Papa from "papaparse"
import * as fs from "fs"

type inputArray = {
    Kürzel: string;
    Amtsbez: string;
    Name: string;
    Rufname: string;
    Nachname: string;
    Geburtsdatum: string;
    Aktiviert: string;
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
    const filedata = fs.readFileSync("./Lehrerexport-2021-22-ASV.csv", "utf8")
    let inputCsv = Papa.parse<inputArray>(filedata, papaInputConfig)
    const outputArr: outputArray[] = []

    inputCsv.data.forEach((value) => {

        // parse Name field
        let namearr = value.Name.split(",");
        value.Rufname = namearr[1].trim();
        value.Nachname = namearr[0].trim();

        let username = value.Rufname.substr(0,1) + "." + value.Nachname
        username = username.replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss").replace(/\s*/g, "").toLowerCase()
        
        let displayName = value.Nachname + " " + value.Rufname.substr(0,1) + "."
        if(value.Aktiviert.toLowerCase() == 'true') {
            outputArr.push({
                Anzeigename: displayName,
                Benutzername: `${username}@gymvhh.de`,
                Nachname: value.Nachname,
                Vorname: value.Rufname,
                "Alternative E-Mail-Adresse": `${username}@gymn-vhh.bayern.de`
            })
        }
    })

    var outputcsv = Papa.unparse(outputArr, papaOutputConfig)
    
    fs.writeFileSync("aad-teacher-output.csv", outputcsv)
    
} catch(err) {
    console.error("could not read file")
}