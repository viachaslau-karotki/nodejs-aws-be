const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const bucketName = process.env.bucketName;

module.exports.importProductsFile = async event => {
    const path = `uploaded/${event.queryStringParameters.name}`
    const params = {
        Bucket: bucketName,
        Key: path,
        Expires: 300,
        ContentType: 'text/csv'
    };
    try{
        const url = await s3.getSignedUrlPromise('putObject', params);
        console.log(`Event: ${JSON.stringify(url)}`);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
              },
            body: JSON.stringify(url)
        }
    } catch(err) {
        return {
            statusCode: 500,
            headers: {
          'Access-Control-Allow-Origin': '*'
        },
            body: err.message
        }
    }
    
};