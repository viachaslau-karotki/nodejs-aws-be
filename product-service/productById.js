'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const bucketName = process.env.S3BucketName;
const productListFileName = process.env.productListFileName;


module.exports.getProductById = async event => {
  const params = {
    Bucket: bucketName,
    Key: productListFileName
  }

  const file = await s3.getObject(params).promise();
  const productList = JSON.parse(file.Body.toString('utf8'));
  const pathParam = event.pathParameters.id;
  const product = productList.filter(product => product.id === pathParam)[0];
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(product, null, 2)
  };
};
