async function verifyRecaptchaToken(token) {
    const secretKey = process.env.reCAPTCHA_SECRET_KEY
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify'

    const response = await fetch(verificationUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()
    return data.success
}

module.exports = {
    verifyRecaptchaToken,
}
