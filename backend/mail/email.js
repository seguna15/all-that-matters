import ErrorHandler from "../utils/ErrorHandler.util.js"
import replaceAll from "../utils/replaceAll.util.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { transporter } from "./nodemailer.config.js";


export const sendVerificationEmail = async (recipientMail, verificationToken ) => {

    
    try {
        const response = await transporter.sendMail({
          from: process.env.SMTP_MAIL,
          to: recipientMail,
          subject: "Verify your email",
          html: VERIFICATION_EMAIL_TEMPLATE.replace(
            "{verificationCode}",
            verificationToken
          ),
          category: "Email Verification",
        }); 

        
    } catch (error) {
       throw new ErrorHandler(`Email verification could not be sent: ${error}`, 500)
    }
}

export const sendWelcomeEmail = async (recipientMail, recipientUsername, url ) => {


     try {
        
        const wordsToReplace = {
          username: recipientUsername,
          loginUrl: url,
        };
       const response = await transporter.sendMail({
         from: process.env.SMTP_MAIL,
         to: recipientMail,
         subject: "Verify your email",
         html: replaceAll(WELCOME_EMAIL_TEMPLATE, wordsToReplace),
         category: "Email Verification",
       });
     } catch (error) {
      throw new ErrorHandler(`Email verification could not be sent: ${error}`, 500)
     }
}


export const sendPasswordResetEmail = async (recipientMail, resetUrl) => {
   try {
     const response = await transporter.sendMail({
       from: process.env.SMTP_MAIL,
       to: recipientMail,
       subject: "Reset your password",
       html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
         "{resetURL}",
         resetUrl
       ),
       category: "Password Reset",
     });
   } catch (error) {
    throw new ErrorHandler(`Email verification could not be sent: ${error}`, 500)
     
   }
}

export const sendResetSuccessEmail = async (recipientMail) => {
   try {
     const response = await transporter.sendMail({
       from: process.env.SMTP_MAIL,
       to: recipientMail,
       subject: "Password reset success",
       html: PASSWORD_RESET_SUCCESS_TEMPLATE,
       category: "Reset Success",
     });
   } catch (error) {
      throw new ErrorHandler(`Email verification could not be sent: ${error}`, 500)
     
   }
}
