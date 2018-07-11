"use strict";
exports.__esModule = true;

const ttn_1 = require("ttn");

const fs = require('fs');
const promisify = require('util').promisify;
const readFileP = promisify(fs.readFile);

let appID;
let accessKey ;
async function Init (){
    try {
        [accessKey,appID] = await Promise.all([
            readFileP('accessKey.txt','utf8'),
            readFileP('appID.txt','utf8')
        ])
    } catch (err) {
        console.error('--- Maybe no file ? ---\n');
        throw err
    }
    accessKey = accessKey.trim();
    appID = appID.trim();
    console.log('Key and appID loaded');

    let client
    try { 
        client = await ttn_1.data(appID, accessKey);
    }
    catch (err){
        console.error('\n --- access to data ---\n\nMaybe wrong id or key \n\n');
        throw err
    }

    client.on("uplink", function (devID, payload) {
        console.log("Received : \"" + payload.payload_fields.message 
        + "\" from ", devID + " the " + payload.metadata.time + "\n");
    });

    console.log('Init done')
}

Init();
