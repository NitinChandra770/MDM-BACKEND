const axios = require('axios');

const sendNotificationToOneSignal = async (notification, apiKey) => {
  try {
    const response = await axios.post(
      'https://onesignal.com/api/v1/notifications',
      notification,
      {
        headers: {
          Authorization: `Basic ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (err) {
    console.error('OneSignal Error:', err.response?.data || err.message);
    throw err;
  }
};

module.exports = {
  sendNotificationToOneSignal
};
