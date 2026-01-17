// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { StatusCodes } from 'http-status-codes';
import { MOCK_USER } from '~/models/mockDatabase';
import { mailerSendService } from '~/providers/MailersendProvider';
import { resendService } from '~/providers/ResendProvider';
import { MAILERSEND_TEMPLATE_IDS } from '~/utils/mailTemplates';

const register = async (req, res) => {
  try {
    // Giả sử việc tạo tài khoản đã thành công nhé. Còn trong thực tế ở bước này sẽ query vào database để tạo data và lưu lại

    const createdUser = MOCK_USER;

    // Gửi sms cho user sau khi đăng ký tài khoản, có thể là sms xác nhận, sms welcome...vv
    // Bước gửi sms này sẽ là việc gửi hành động đến một dịch vụ bên thứ 3.

    const toName = createdUser.USERNAME;
    const subject = 'Created account successfully';
    const html = `<h1>Hi! ${createdUser.USERNAME}</h1>
      <h2>Your account has been created successfully</h2>`;

    // ========= Approach 1: Usage Resend
    const sendEmailResponse = await resendService.send({
      to: process.env.RESEND_EMAIL_REGISTER, // Resend require valid domain. If not valid, you only send mail for email registered on Resend
      subject,
      html,
    });
    console.log('Resend service: Send mail response: ', sendEmailResponse);

    // ========= Approach 2: Usage MailerSend
    // - Basic
    // const mailerEmailResponse = await mailerSendService.send({
    //   to: process.env.MAILERSEND_EMAIL_REGISTER, // MailerSend require valid domain. If not valid, you only send mail for email registered on MailerSend
    //   toName,
    //   subject,
    //   html,
    // });

    // - With template + attachment
    const personalizationData = [
      {
        email: process.env.MAILERSEND_EMAIL_REGISTER,
        data: {
          name: 'Ng Khang',
          platform: 'Mang Film Chụp Chơi',
          background:
            'https://scontent.fsgn5-5.fna.fbcdn.net/v/t39.30808-1/420963414_3641198109425933_1889872821373659116_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-7&_nc_sid=1d2534&_nc_ohc=qV367OhyAA8Q7kNvwHR_rMi&_nc_oc=AdpLxNC1VMTaaxH3QVi5oHZTsPq0tYyOfkzsSOLaoC67ape4x7kF22EToXpIVKfYv6U&_nc_zt=24&_nc_ht=scontent.fsgn5-5.fna&_nc_gid=xFbnDGImlEqQ-nGuXDu5sQ&_nc_ss=7b2a8&oh=00_Af-OJoYepcBpR44MUmdA0G4clVPfThelkWoLeBh2NbZ8_w&oe=6A23143D',
        },
      },
    ];

    const attachmentFiles = [
      {
        filePath: 'src/files/image.jpg',
        fileName: 'image.jpg',
        attachmentType: 'attachment', // "attachment" - file will attachment at the end mail
      },
    ];

    const mailerEmailResponse = await mailerSendService.sendWithTemplate({
      to: process.env.MAILERSEND_EMAIL_REGISTER, // MailerSend require valid domain. If not valid, you only send mail for email registered on MailerSend
      toName,
      subject: 'Created account successfully - {{ name }}',
      templateId: MAILERSEND_TEMPLATE_IDS.WELCOME,
      personalization: personalizationData,
      attachmentFiles,
    });

    console.log('Mailer Send service: Send mail response: ', mailerEmailResponse);

    // Trả về response với thông tin user đã được tạo
    res.status(StatusCodes.OK).json({
      message: 'Created a new account successfully',
      data: {
        id: createdUser.ID,
        email: createdUser.EMAIL,
        username: createdUser.USERNAME,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

export const userController = {
  register,
};
