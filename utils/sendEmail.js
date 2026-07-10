let axios;

try {
    axios = require('axios');
} catch {
    axios = null;
}

// Send a transactional email through Brevo's HTTP API.
const sendEmail = async ({ to, subject, text, html }) => {
    const payload = {
        sender: { email: process.env.EMAIL_USER, name: 'Ecommerce App' },
        to: [{ email: to }],
        subject,
        textContent: text,
        htmlContent: html
    };

    try {
        if (axios) {
            await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
                headers: {
                    'api-key': process.env.BREVO_API_KEY,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            });
            return;
        }

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Brevo request failed with status ${response.status}`);
        }
    } catch (err) {
        console.error('Brevo email failed:', err.response?.data || err.message);
        throw err;
    }
};

module.exports = sendEmail;
