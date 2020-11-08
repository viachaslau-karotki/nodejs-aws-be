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

module.exports.getProductById = async event => {
  const pathParam = event.pathParameters.id;
  const query = `select id, title, description, price, count from products p join stocks s on p.id = s.product_id where p.id = '${pathParam}'`;

  const client = new Client(dbParams);
  await client.connect();

  try {
    const { rows: product } = await client.query(query);
    console.log(`Result: ${JSON.stringify(product)}`);
    if (product[0] === undefined) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: `Product with id ${pathParam} not found`
      };
    }
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(product[0], null, 2)
    };
  } catch(err) {
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
