const { sendNotificationToOneSignal } = require('../utils/oneSignalUtil');
const dotenv = require('dotenv');
dotenv.config();

const APP_ID = process.env.App_ID;
const REST_API_KEY = process.env.REST_API_KEY;
const ENV_FLAG = process.env.ENV_FLAG || 'prod';

const sendNotification = async (roles = [], customNotification = {}) => {
 
    if (ENV_FLAG !== 'prod') {
    console.log('Skipping notification in non-prod environment');
    return null;
  }

  // Create filters from roles
  const filters = [];
  roles.forEach((role, index) => {

    var relationShip;

    console.log('role value is',role);

    if(role.split('_')[1]) 
    {
      console.log('true');
      relationShip = 'starts_with'
    }
    else
    {
      console.log('false');
      relationShip = '='
    }

    if (index > 0) filters.push({ operator: 'OR' }); // add OR between filters
    filters.push({
      field: 'tag',
      key: 'role',
      relation: relationShip,
      value: role
    });

    console.log('filter value is ',filters);

  });

  const notification = {
    app_id: APP_ID,
    filters,
    headings: { en: customNotification.heading || 'Hello' },
    contents: { en: customNotification.content || 'Default content message' },
    ios_sound: 'punch_emergency_declared.wav',
    existing_android_channel_id: '2003',
    ...customNotification // spread custom fields like data, url, etc.
  };

 // const response = await sendNotificationToOneSignal(notification, REST_API_KEY);
  return response;
};

module.exports = {
  sendNotification
};