const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const pdf = require("pdf-parse")
const fs = require("fs")
const chat = require("../chatgpt")
const { voiceToText } = require("../voice2text")
const { text2voice } = require("../tex2voice")
require("dotenv").config();




module.exports = addKeyword(EVENTS.VOICE_NOTE)
    .addAction(async (ctx, ctxFn) => {
        const pdfPath = "./flows/pdfs/menu restaurante.pdf"
        let pdfBuff = fs.readFileSync(pdfPath)
        const pdfRead = await pdf(pdfBuff)
        const pdfTxt = pdfRead.text

        const prompt = "Sos un contacto inicial de un restaurant que te van a hacer preguntas sobre el menu. El menu es el siguiente: " + pdfTxt
        const response = await voiceToText(ctx);
        const text = response;
        const responseGPT = await chat(prompt, text);

        const responseAudio = await text2voice(responseGPT);
        await ctxFn.provider.sendAudio(`${ctx.from}@s.whatsapp.net`, responseAudio);

    })