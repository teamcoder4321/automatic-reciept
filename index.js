import dotenv from 'dotenv';
import { fetchEmails } from './src/emailFetcher.js';
import { processAttachment } from './src/attachmentProcessor.js';
import { submitToGoogleForm } from './src/googleFormSubmitter.js';
import { sendNotificationEmail } from './src/notificationSender.js';

dotenv.config();

async function main() {
  try {
    console.log('Starting receipt automation process...');

    // Fetch emails with attachments
    const emails = await fetchEmails();

    for (const email of emails) {
      // Process each attachment
      const receiptData = await processAttachment(email.attachment);

      if (receiptData) {
        // Submit data to Google Form
        await submitToGoogleForm(receiptData);

        // Send notification email
        await sendNotificationEmail(receiptData);

        console.log(`Processed receipt from ${receiptData.vendorName}`);
      }
    }

    console.log('Receipt automation process completed successfully.');
  } catch (error) {
    console.error('An error occurred during the automation process:', error);
  }
}

main();