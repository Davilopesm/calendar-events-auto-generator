import app from './app';
import UserEvents from './application/user/events';
import cron = require('node-cron');

// cron.schedule('0 * * * *', async () => {
cron.schedule('* * * * *', async () => { // Cron to run every hour and send users to have their calendars synchronized
  await new UserEvents().createUserEvents();
});

app.listen('3000', async () => {
  await new UserEvents().syncUserEvents(); // Start SQS consumer to synchronize user calendar events
  console.info('Server running at port 3000');
})
