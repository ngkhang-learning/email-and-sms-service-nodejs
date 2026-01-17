// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { StatusCodes } from 'http-status-codes';
import { MOCK_USER } from '~/models/mockDatabase';
import { mailerSendService } from '~/providers/MailersendProvider';
import { resendService } from '~/providers/ResendProvider';

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
    const mailerEmailResponse = await mailerSendService.send({
      to: process.env.MAILERSEND_EMAIL_REGISTER, // MailerSend require valid domain. If not valid, you only send mail for email registered on MailerSend
      toName,
      subject,
      html,
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
