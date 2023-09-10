const express = require('express');
const dotenv = require('dotenv');

if (process.env.NODE_ENV == 'development') {
  dotenv.config({ path: './config.env' });
} else if (process.env.NODE_ENV == 'production') {
  dotenv.config({ path: './config-production.env' });
}

const app = express();

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port ' + process.env.PORT);
});
