const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const csv = require('csv-parser');

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
    s3.getObject(params).createReadStream()
    .pipe(csv())
    .on('data', (data) => console.log(data))
    .on('end', () => {
    console.log('End file');
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