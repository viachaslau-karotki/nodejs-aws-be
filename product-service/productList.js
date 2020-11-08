'use strict';

const { Client } = require('pg');
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

module.exports.getProductsList = async event => {
console.log(`Event: ${JSON.stringify(event)}`);

  const query = 'select id, title, description, price, count from products p join stocks s on p.id = s.product_id';

  const client = new Client(dbParams);
  await client.connect();

  try {
    const { rows: result } = await client.query(query);
    console.log(`Result: ${JSON.stringify(result)}`);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result,null,2)
    }
  } catch (err) {
    console.log(`Error: ${JSON.stringify(err)}`);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: err.message
    }
  } finally {
    client.end();
  }

};
