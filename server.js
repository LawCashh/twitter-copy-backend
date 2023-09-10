const dotenv = require('dotenv');
const mongoose = require('mongoose');

if (process.env.NODE_ENV == 'development') {
  dotenv.config({ path: './config.env' });
} else if (process.env.NODE_ENV == 'production') {
  dotenv.config({ path: './config-production.env' });
}

const app = require('./app');

const uri = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(uri, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('povezan na bazu');
  })
  .catch((err) => {
    throw new Error(`Greska povezivanja na bazu: ${err}`);
  });

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port ' + process.env.PORT);
});
