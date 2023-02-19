const aws = require('aws-sdk');

const table = 'Products';

aws.config.update({
  region: 'us-east-2',
});

const docClient = new aws.DynamoDB.DocumentClient();

// get all products from DynamoDB
const getAllProducts = () => {
  const params = {
    TableName: table,
  };

  let items;
  do {
    items = docClient.scan(params).promise();
    params.ExclusiveStarterKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey !== 'undefined');

  return items;
};

// get product by id
const getProductById = (id) => {
  const params = {
    TableName: table,
    Key: {
      product_id: id,
    },
  };

  return docClient.get(params).promise();
};

function reduceInventory(id, quantity){
  const params = {
      TableName: 'Products',
      Key: {
          product_id: id,
      },
      UpdateExpression: 'SET #q = :val',
      ExpressionAttributeNames: {
          '#q': "quantity"
      },
      ExpressionAttributeValues: 
      {':val': quantity}
  }

  return docClient.update(params).promise();
}

module.exports = {
  getAllProducts,
  getProductById,
  reduceInventory
};
