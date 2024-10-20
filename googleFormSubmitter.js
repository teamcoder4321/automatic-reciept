import fetch from 'node-fetch';

export async function submitToGoogleForm(receiptData) {
  const formUrl = process.env.GOOGLE_FORM_URL;

  const formData = new URLSearchParams();
  formData.append('entry.1234567890', receiptData.receiptDate);
  formData.append('entry.2345678901', receiptData.receiptNumber);
  formData.append('entry.3456789012', receiptData.vendorName);
  formData.append('entry.4567890123', receiptData.totalAmount);
  formData.append('entry.5678901234', receiptData.itemsPurchased.join(', '));

  try {
    const response = await fetch(formUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Data submitted to Google Form successfully');
  } catch (error) {
    console.error('Error submitting data to Google Form:', error);
  }
}