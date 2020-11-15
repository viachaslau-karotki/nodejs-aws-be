const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.import = async event => {
    const list = await s3.listBuckets().promise();
    console.log(`Event: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
        body: JSON.stringify(list)
    }
};