exports.Verification_Email_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f7fc;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 30px;
        }
        .header {
            text-align: center;
            background-color: #4CAF50;
            padding: 20px;
            border-radius: 8px;
            color: #ffffff;
            font-size: 24px;
            font-weight: 700;
        }
        .content {
            padding: 20px;
            color: #333;
            font-size: 16px;
            line-height: 1.6;
        }
        .verification-button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 15px 30px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            width: 100%;
            max-width: 250px;
            box-sizing: border-box;
            transition: background-color 0.3s ease;
        }
        .verification-button:hover {
            background-color: #45a049;
        }
        .footer {
            text-align: center;
            padding: 15px;
            color: #777;
            font-size: 12px;
            border-top: 1px solid #ddd;
            margin-top: 20px;
        }
        .footer p {
            margin: 0;
        }
        .footer .small-text {
            font-size: 14px;
            color: #888;
        }
        @media screen and (max-width: 600px) {
            .container {
                padding: 15px;
            }
            .verification-button {
                font-size: 16px;
                padding: 12px 25px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Verify Your Email
        </div>
        <div class="content">
            <p>Hi there,</p>
            <p>Thank you for signing up! Please click the button below to verify your email address:</p>
            <a href="{verificationLink}" class="verification-button">Click here to verify your email address</a>
            <p class="small-text" style="margin-top: 15px;">If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
