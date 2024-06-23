exports.success = (_, res, message, status) => {
    res.status(status || 200).send({
        error: false,
        status: status || 200,
        body: message || ''
    })
}

exports.error = (_, res, message, status) => {
    res.status(status || 500).send({
        error: true,
        status: status || 500,
        body: message || 'err'
    })
}