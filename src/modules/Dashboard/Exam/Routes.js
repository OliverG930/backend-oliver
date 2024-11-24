const express = require("express")
const router = express.Router()
const security = require("../../../middlewares/security")
const responses = require("../../../red/responses")
const { saveResume, getResume } = require("./Controllers")

router.post("/", (req, res) => {
  return responses.success(req, res, { message: 'hola' }, 200)
})


router.post("/resume", security(), async (req, res) => {

  try {
    const { body, user } = req

    const data = {
      user_id: user.usuario_id,
      ...body
    }

    const saved = await saveResume(data)
    console.log(saved);

    return responses.success(req, res, { message: 'hola' }, 200)
  } catch (e) {
    return responses.error(req, res, { message: e.message }, 200)

  }
})

router.get("/resume/:id", security(), async (req, res) => {

  const { user, params } = req

  const result = await getResume(user.usuario_id, Number(params.id))

  console.log(user.usuario_id, Number(params.id))

  return responses.success(req, res, result, 200)
})


module.exports = router