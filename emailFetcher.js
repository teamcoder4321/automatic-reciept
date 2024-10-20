import Imap from 'imap';
import { simpleParser } from 'mailparser';

export async function fetchEmails() {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      tls: true,
    });

    const emails = [];

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) reject(err);

        const fetchOptions = {
          bodies: ['HEADER', 'TEXT'],
          markSeen: false,
        };

        imap.search(['UNSEEN', ['SUBJECT', 'Receipt']], (err, results) => {
          if (err) reject(err);

          const fetch = imap.fetch(results, fetchOptions);

          fetch.on('message', (msg) => {
            msg.on('body', (stream, info) => {
              simpleParser(stream, async (err, parsed) => {
                if (err) reject(err);

                const attachments = parsed.attachments;
                if (attachments.length > 0) {
                  emails.push({
                    subject: parsed.subject,
                    attachment: attachments[0],
                  });
                }
              });
            });
          });

          fetch.once('error', (err) => {
            reject(err);
          });

          fetch.once('end', () => {
            imap.end();
            resolve(emails);
          });
        });
      });
    });

    imap.once('error', (err) => {
      reject(err);
    });

    imap.connect();
  });
}