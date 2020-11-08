'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const bucketName = process.env.S3BucketName;
const productListFileName = process.env.productListFileName;

module.exports.getProductsList = async event => {
  
  const params = {
    Bucket: bucketName,
    Key: productListFileName
  }

  try {
    const file = await s3.getObject(params).promise();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: file.Body.toString('utf8')
    };
  } catch (err) {
    console.log(`Error: ${JSON.stringify(e)}`);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: err.message
    }
  }

};
