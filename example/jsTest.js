const dbParser = require("../dist/db_parser")

const prefixIndex = 30;

const testCase = [
    "7rKRBAgN/OoFY6iTFFuz6dzRU3zEWqC9RGB71H8ahCUx5ka5gbcQsPB1cUHwZx58NfK+Kmo3L/rcCPoO1ygQuw==",
    "Lv27SPvdbaavHlLnjijCwRHKmJFYBkutGeL3kShExKA=",
    "IYTxubX21ZG/h6nuddWrIvivulhzxBHoikMPZGaEoUjgq3Fcyuh4qFK11xudPOBdwOJLWK8n4MUV+9qDc5/CbKsrHqwakMooTDCRskLFAF95Ii2jA8kZbogYOv+SoDIk",
]
const myUserId = "8466014366049313279";


testCase.forEach((text)=>{
    const deText = dbParser.decrypt(text, myUserId, prefixIndex)
    console.log(deText);

})