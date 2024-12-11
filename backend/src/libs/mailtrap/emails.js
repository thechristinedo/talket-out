import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, name, verificationCode) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "695ca136-e084-4535-80b8-725beead174b",
      template_variables: {
        first_name: name,
        last_name: verificationCode,
      },
    });

    console.log("Verification mail sent successfully", response);
  } catch (error) {
    console.log("Error in sendVerificationEmail", error.message);
    throw new Error("Error in sendVerificationEmail", error.message);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "d94decc3-04ac-4071-be15-8bef1f96c180",
      template_variables: {
        first_name: name,
      },
    });
    console.log("Welcome mail sent successfully", response);
  } catch (error) {
    console.log("Error in sendWelcomeEmail", error.message);
    throw new Error("Error in sendWelcomeEmail", error.message);
  }
};
