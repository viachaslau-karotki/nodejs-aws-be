const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const csv = require('csv-parser');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const sendToSQS = async (product) => {
    const params = {
        MessageBody: JSON.stringify(product),
        QueueUrl: process.env.SQS_URL
    };

    try {
        await sqs.sendMessage(params).promise();
    } catch(err) {
        console.log(`Error with message: ${err.message}`);
    }
}

module.exports.importFileParser = async event => {
    console.log(`Event: ${JSON.stringify(event)}`);
    const params = {
        Bucket: event.Records[0].s3.bucket.name,
        Key: event.Records[0].s3.object.key,
    };

    const name = event.Records[0].s3.object.key.split('/')[1];
    const copyParams = {
      Bucket: event.Records[0].s3.bucket.name, 
      CopySource: `${event.Records[0].s3.bucket.name}/${event.Records[0].s3.object.key}`,
      Key: `parsed/${name}`
    };
  try {
    const readStream = s3.getObject(params).createReadStream();
    await new Promise((resolve, reject) => {
        readStream.pipe(csv())
        .on('data', async (data) => await sendToSQS(data))
        .on('error', (error) => reject(error))
        .on('end', () => {
        console.log('End file');
        resolve();
        })
    });
    await s3.copyObject(copyParams).promise();
    await s3.deleteObject(params).promise();

    console.log('Finished');
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: 'success'
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
 
}