'use strict';

const { Client } = require('pg');
const schema = require('./model/Product');
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

const errorResp = (errors) => {
    const err = errors.map(err => {
      const { path, message } = err
      return { path, message }
    })
    return {
      status: 'validation is failed',
      err
    }
  }

module.exports.postProduct = async event => {

  console.log(`Request: ${JSON.stringify(event)}`);
  const body = JSON.parse(event.body);
  const { error } = schema.validate(body);
  if (error) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: errorResp(error.details)
      }
  }  
  const postProductsQuery = `with postProducts as (
    insert into products(title, description, price)
    values('${body.title}','${body.description}',${body.price})
    returning id
  )
  insert into stocks(product_id, count)
  select id, ${body.count} 
  from postProducts
  returning product_id`;

  const client = new Client(dbParams);
  await client.connect();

  try {
    const {rows: products} = await client.query(postProductsQuery);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(products[0], null, 2)
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
