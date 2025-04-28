const axios = require('axios');
const { sendNotification  } = require('../services/notificationService');
const Device = require('../models/device');

const REST_API_KEY = process.env.REST_API_KEY;
const APP_ID = process.env.App_ID;

exports.getSubscribersByRole=async(req,res)=>{
   const targetRole = req.query.role;
   console.log('targetRole value is ',targetRole);
  try{
    let allDevices=[];
    let offset = 0;
    const limit = 300;

    while (true) {
      const res = await axios.get(`https://onesignal.com/api/v1/players`,{
        params:{  
          app_id: APP_ID,
          limit,
          offset,
        },
        headers:{
          Authorization: `Basic ${REST_API_KEY}`,
        },
      });

      console.log('res value is ',res);

      const devices = res.data.players;
      if(!devices.length) break;

      allDevices.push(...devices);

      offset += limit;
    }

    const filtered = allDevices
    .filter((device)=>device.tags && device.tags.role === targetRole)
    .map((device) => ({
        status: device.invalid_identifier ? 'Inactive' : 'Active',
        sessions: device.session_count,
        lastSession: device.last_active,
        usageDuration: `${device.playtime} seconds`,
        device: `${device.device_model || 'Unknown'} (${device.device_os})`,
        subscriptionId: device.id,
        externalId: device.external_user_id || 'N/A',
        appVersion: device.game_version || 'N/A',
        ip: device.ip || 'N/A',
        created_at : device.created_at || 'N/A',
        tags: device.tags || {},
    })
    );

    console.log(`Found ${filtered.length} device(s) with role = ${targetRole}`);

    filtered.forEach((d, i) => {
      console.log(`\nDevice #${i + 1}`);
      console.log(d);
    });

    return res.status(200).send(filtered);
    
  }catch(error){
    console.error('Error fetching devices:', error.response?.data || error.message);
    return res.status(500).send({error: 'error occured while gettingDeviceDetails from one signal '+error});
  }
};


exports.getActiveSubscribersByRoleAndSyncDeviceDB=async(req,res)=>{
  const targetRole = req.query.role;
  console.log('targetRole value is ',targetRole);
 try{
   let allDevices=[];
   let offset = 0;
   const limit = 300;

   while (true) {
     const res = await axios.get(`https://onesignal.com/api/v1/players`,{
       params:{  
         app_id: APP_ID,
         limit,
         offset,
       },
       headers:{
         Authorization: `Basic ${REST_API_KEY}`,
       },
     });

     console.log('res value is ',res);

     const devices = res.data.players;
     if(!devices.length) break;

     allDevices.push(...devices);

     offset += limit;
   }

   const busServerIds = new Set();

   const filtered = allDevices
   .filter((device)=>device.tags && device.tags.role && device.tags.role.startsWith(targetRole) && device.invalid_identifier === false)
    .map((device) => {
    var fullRole = device.tags.role || '';
    var deviceIdFromRole = fullRole.split('_')[1];
    var busServerId = fullRole.split('_')[0];

    if (busServerId) busServerIds.add(busServerId);

    return {
       last_active: device.last_active,
       playtime: `${device.playtime} seconds`,
       device_model: `${device.device_model || 'Unknown'}`,
       device_os:`${device.device_os || 'Unknown'}`,
       external_user_id: device.external_user_id || 'N/A',
       deviceVersion: device.game_version || 'N/A',
       device_type: device.device_type || 'N/A',
       IPAddress: device.ip || 'N/A', 
       deviceId: deviceIdFromRole || 'N/A',
       created_at : device.created_at || 'N/A',
       tags: device.tags || {},
       busServerId: busServerId || 'N/A'
    };
   });
   

   /*console.log(`Found ${filtered.length} device(s) with role = ${targetRole}`);

   filtered.forEach((d, i) => {
     console.log(`\nDevice #${i + 1}`);
     console.log(d);
   }); */


   const roles = Array.from(busServerIds);// your role values (e.g., bus IDs)
   const customNotification = {
     heading: 'GET all device working status under bus',
     content: 'To get all bus device working status under bus',
     data: { type: 'emergency' },
     url: 'https://your-app.com/emergency'
   };
   
   let result = [];

   try {
    result = await sendNotification(roles, customNotification);
     console.log('result value is ',result);
     

     var resultMap = new Map();
      result.forEach((r) => {
        if (r.deviceId) {
          resultMap.set(r.deviceId, r);
        }
      });


      var enrichedFiltered = filtered.map((device) => {
        const extra = resultMap.get(device.deviceId);
        return extra ? { ...device, ...extra } : device;
      });


   //  res.status(200).json({ success: true, result });
   } catch (err) {
   //  res.status(500).json({ error: err.message });
   }

   for(const d of enrichedFiltered){  
    
    console.log('d value is ',d);
    
       const device = new Device(d);

       console.log('device value is ',device);

/*       const savedDeviceData = await device.save();
       if(savedDeviceData){
         return res.status(200).send(savedDeviceData);
       }
       else
       {
         return res.status(500).send({error:'Some error occured while saving oneSignal data to device database '});
       } */        
     } 

     return res.status(200).send(filtered);  

 }catch(error){
   console.error('Error fetching devices:', error.response?.data || error.message);
   return res.status(500).send({error: 'error occured while gettingDeviceDetails from one signal '+error});
 }
};




exports.getDevicesActive = async (req,res)=>{
try{
    var busServerId = '1091';
    var roleTag = busServerId;

    const customNotification = {
        headings: { en: 'Hello from OneSignal!' },
        contents: { en: `Bus ID ${roleTag} - New notification` },
      };

      const response = await sendNotification([roleTag], customNotification);

      console.log('Notification response:', response);
      res.status(200).send({ success: true, result: response });
    } catch (err) {
      console.error('Error sending notification:', err.message);
      res.status(500).send({ error: 'Error while sending notification! ' + err.message });
    }
}

exports.sendTestNotification = (async (req, res) => {
    const roles = ['superadmin']; // your role values (e.g., bus IDs)
    const customNotification = {
      heading: 'Bus Alert',
      content: 'Emergency on Bus 1091',
      data: { type: 'emergency' },
      url: 'https://your-app.com/emergency'
    };
  
    try {
      const result = await sendNotification(roles, customNotification);
      res.status(200).json({ success: true, result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });





