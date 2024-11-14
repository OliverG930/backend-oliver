const OpenAI = require('openai')

const openai = new OpenAI({ apiKey: process.env.API_KEY })


exports.sendToGPT = async (user_message) => {


    const completion = await openai.chat.completions.create({
        messages: [
            {
                "role": "system",
                "content": "You are a knowledgeable and patient English teacher focused. responde en español"
            },
            {
                role: "user", content: user_message
            },
        ],
        model: "gpt-4o",
    })

    const message = completion.choices[0].message.content
    // console.log(completion)


    return { message }
}