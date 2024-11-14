const { sendToGPT } = require("../../../GPT/gpt")
const responses = require("../../../red/responses")

exports.sendMessage = async (req, res) => {
    const { user, body } = req

    if (!body.message) {
        console.error("Error! al recibir el mensaje del cliente")
        return responses.error(req, res, { message: "algo falló" }, 500)
    }

    const result = await sendToGPT(body.message)

    return responses.success(req, res, { "result_message": result.message }, 200)
}
