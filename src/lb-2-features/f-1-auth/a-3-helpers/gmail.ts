import {DEV_VERSION} from '../../../lb-1-main/config';
import nodeMailer from 'nodemailer';

const transporter = nodeMailer.createTransport({
    // @ts-ignore
    service: 'Outlook365',
    host: 'smtp.office365.com',
    port: '587',
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
    },
    auth: {
        user: '171-421@mail.ru',
        pass: ''
    }
})


export const sendMail = async (
    from: string,
    to: string,
    subject: string,
    html?: string,
    text?: string
) => {
    const info = await transporter.sendMail({
        from: '171-421@mail.ru',
        to,
        subject,
        text,
        html: text ? undefined : html,
    })

    if (DEV_VERSION) console.log('gmail info: ', info);

    return info;
}