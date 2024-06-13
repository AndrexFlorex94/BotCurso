const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const pdf = require("pdf-parse")
const fs = require("fs")
const chat = require("../chatgpt")
require("dotenv").config();

const { isActive } = require("../utils")

module.exports = addKeyword("GPT")
    .addAnswer("Hace la consulta  que quieras sobre el menu", { capture: true },
        async (ctx, ctxFn) => {
            const pdfPath = "./flows/pdfs/menu restaurante.pdf"
            let pdfBuff = fs.readFileSync(pdfPath)
            const pdfRead = await pdf(pdfBuff)
            const pdfTxt = pdfRead.text

            const prompt = "Sos un contacto inicial de un restaurante que te van a hacer preguntas sobre el menu. El menu es el siguiente: " + pdfTxt
            const text = ctx.body;
            const response = await chat(prompt, text);

            await ctxFn.flowDynamic(response)
        }
    )