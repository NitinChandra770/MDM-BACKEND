const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const { getCurrentDateInIST } = require('../utils/dateUtil');

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/mdmdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define MongoDB Schema
const busSchema = new mongoose.Schema({
    busId: { type: Number, unique: true }, // Mapped from MySQL's id
    name: String,
    operatorId: Number,
    source: String,
    destination: String,
    routeName: String,
    busAppStatus: String,
    busServerId: String,
    password: String,
    macIdForDevice: { type: String, default: "" },
    macIdForTablet: String,
    OTPValidate: String,
    type: String,
    make: String,
    status: Boolean,
    noofseat: Number,
    AuthenticateCount: { type: Number, default: 0 },
    busConfig: { type: String, default: "{}" },
    OTPMovie: { type: String, default: "123456" },
    OTPAuthenticate: { type: String, default: "123456" },
    lastPassword: String,
    routes: String,
    session: Date,
    cities: { type: String, default: "[]" },
    viaCities: { type: String, default: "{}" },
    otpValidity: { type: Boolean, default: false },
    chassisNo: { type: String, default: "" },
    location_id: String,
    savingDateTime: Date,
    modifiedDateTime: Date
});

const Bus = mongoose.model('bus', busSchema);

const operatorSchema = new mongoose.Schema({
    operatorId : {type: Number },
    name : {type: String},
    type : {type: Number },
    emailId : {type: String},
    emailIdForHotelBooking : {type: String},
    emailIdForCabBooking : {type: String},
    emailIdForTicketRequest : {type: String},
    emailIdForComplaint:{type: String},
    emailIdForCustomerFeedBack:{type: String},
    emailIdForInstallation:{type: String},
    operatorLogo:{type: String},
    POCname:{type: String},
    POCnumber: {type: String}, //to send from frontend
    status: {type: Boolean},
    operatorAmazonId:{type: Number },
    emailService:{type: Boolean , default:false},
    maExpiryDate:{type: String},
    maSessionDuration:{type: Number, default:60},
    maConfig:{type: String, default:"{}"},
    otp:{type: String,default:"1212"},
    cities:{type: String,default:"[]"},
    notificationFlag:{type: Boolean, default:false},
    savingDateTime : Date,
    modifiedDateTime : Date 
});

const Operator = mongoose.model('operator', operatorSchema);

// MySQL Config
const mysqlConfig = {
    host: '13.202.38.192',
    port: 3306,
    user: 'root',
    password: 'moviesForYou',
    database: 'tt'
};

async function migrate() {
    const connection = await mysql.createConnection(mysqlConfig);

    console.log('Deleting all existing documents from MongoDB buses and operators collection...');
    await Bus.deleteMany({}); // <-- clear collection first
    await Operator.deleteMany({}); // <-- clear operators collection
    console.log('Old data removed. Starting migration...');

    const [busRows] = await connection.execute('SELECT * FROM bus');

    for (const row of busRows) {
        try {
            const istDate = getCurrentDateInIST();
            const status = !!(row.status && row.status[0]); // Convert <Buffer 00/01> to true/false
            const otpValidity = !!(row.otpValidity && row.otpValidity[0]);

            // Transform MySQL row → MongoDB doc
            const { id, status: _, otpValidity: __, ...rest } = row;
            const busDoc = new Bus({
                ...rest,
                busId: id, // map MySQL `id` to MongoDB `busId`
                status,
                otpValidity,
                savingDateTime: istDate                   
            });
            await busDoc.save();
            console.log(`Inserted busId: ${id}`);
        } catch (err) {
            console.error(`Error inserting busId: ${row.id}`, err.message);
        }
    }

    const [operatorRows] = await connection.execute('SELECT * FROM operator');
    for (const operatorrow of operatorRows) {
        try {
            const istDate = getCurrentDateInIST();
            const status = !!(operatorrow.status && operatorrow.status[0]); // Convert <Buffer 00/01> to true/false
            const emailService = !!(operatorrow.emailService && operatorrow.emailService[0]);
            const notificationFlag = !!(operatorrow.notificationFlag && operatorrow.notificationFlag[0]);

            // Transform MySQL row → MongoDB doc
            const { id, status: _, emailService: __, notificationFlag: ___, ...rest } = operatorrow;
            const operatorDoc = new Operator({
                ...rest,
                operatorId: id, // map MySQL `id` to MongoDB `operatorId`
                status,
                emailService,
                notificationFlag,
                savingDateTime: istDate                   
            });
            await operatorDoc.save();
            console.log(`Inserted operatorId: ${operatorrow.id}`);
        } catch (err) {
            console.error(`Error inserting operatorId: ${operatorrow.id}`, err.message);
        }
    }

    await connection.end();
    mongoose.disconnect();
    console.log("Migration completed!");
}


console.log('inside migrate function');

migrate();
