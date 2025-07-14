const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const dataPath = path.resolve(__dirname, '../../src/data/data.json');
    const data = fs.readFileSync(dataPath, 'utf-8');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao ler o arquivo de dados.' }),
    };
  }
}; 