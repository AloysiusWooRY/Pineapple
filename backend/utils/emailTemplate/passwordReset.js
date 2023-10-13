const passwordResetTemplate = (payload) => {
    const { name, code } = payload
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation Code Email</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f2f2f2;
                    padding: 20px;
                }
                .container {
                    background-color: #fff;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                }
                .header h1 {
                    color: #333;
                }
                .confirmation-code {
                    margin-top: 20px;
                    text-align: center;
                }
                .confirmation-code p {
                    font-size: 24px;
                    color: #007bff;
                }
                .instructions {
                    margin-top: 20px;
                    text-align: center;
                }
                .instructions p {
                    color: #555;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Code</h1>
                </div>
                <div class="confirmation-code">
                    <p><strong>${code}</strong></p>
                </div>
                <div class="instructions">
                    <p>Please use this code to confirm your email address.</p>
                </div>
            </div>
        </body>
        </html>
    `
}

module.exports = passwordResetTemplate