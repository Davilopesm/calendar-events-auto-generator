import app from './app';
import UserEvents from './application/user/events';
import cron = require('node-cron');

/*

cron.schedule('0 * * * *', async () => { // Cron to run every hour and send users to be synchronized
  await new UserEvents().createUserEvents();
}); */

cron.schedule('25 * * * *', async () => { // Cron to run every hour and send users to have their calendars synchronized
  await new UserEvents().createUserEvents();
});

cron.schedule('* * * * *', async () => { // Cron to run every 5min and consume queue data to synchronize user calendar events
  await new UserEvents().syncUserEvents();
});

app.listen('3000', () => {
  console.info('Server running at port 3000');
})
