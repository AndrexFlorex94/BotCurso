const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock');
require("dotenv").config();


const asesorflow = require("./flows/asesor.flow")
const GPTflow = require("./flows/GPT.flow")
const voicetextflow = require("./flows/voicetext.flow")
const { writeToSheet, readSheet, appendToSheet, getFilteredData } = require("./googlesheets")


const flowSheets = addKeyword("sheets")
    .addAnswer("Este es el flujo Sheets", null,
        async (ctx, ctxFn) => {
            const values = [
                ['Alice', 25, 'New York', "raza1"],
                ['Bob', 30, 'San Francisco', "perro"]
            ];
            //await appendToSheet(values); // Agrega datos columna por columna.


            // let range = 'Hoja 1!G2';
            //await writeToSheet(values, range); // Escribe datos en un rango específico.

            // range = 'Hoja 1!A1:B10';
            //const response = await readSheet(range); // Lee datos de un rango.

            const response = await getFilteredData("C", "USA")
            console.log(response);



        });


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([GPTflow, voicetextflow, asesorflow, flowSheets])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
