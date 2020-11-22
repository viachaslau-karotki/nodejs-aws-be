const AWS = require('aws-sdk');
const SNS = new AWS.SNS();

const { Pool } = require('pg');
const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbParams = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
}

const uploadProduct = async (body, pool) => {
    console.log(`Product: ${body}`);
    const product = JSON.parse(body);
    const postProductsQuery = `with postProducts as (
        insert into products(title, description, price)
        values('${product.title}','${product.description}',${product.price})
        returning id
      )
      insert into stocks(product_id, count)
      select id, ${product.count}
      from postProducts
      returning product_id;`;
      console.log(`Query: ${postProductsQuery}`);
      const client = await pool.connect();
     try {
        await client.query('BEGIN;');
        await client.query(postProductsQuery);
        await client.query('COMMIT;');
     } catch (err) {
        await client.query('ROLLBACK;');
        console.log(`Error: ${JSON.stringify(err)}`);
     } finally {
        client.release();
     } 

}

module.exports.catalogBatchProcess = async event => {
    const pool = new Pool(dbParams);
    event.Records.map(async ({ body }) => 
        await uploadProduct(body, pool)
    );
    
    const params = {
        Subject: 'Products were imported',
        Message: 'Products were imported',
        TopicArn: process.env.SNS_URL
    }
    await SNS.publish(params).promise();
    console.log('import is finished');
}