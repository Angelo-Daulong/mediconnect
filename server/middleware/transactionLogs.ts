import { InsertTransactionLogs } from '~/utils/schema';
export default defineEventHandler(async (event) => {
  // console.log('middleware');
  if (
    event.method !== 'GET' &&
    event.path !== '/api/transaction' &&
    event.path !== '/api/adminUser/login' &&
    event.path !== '/api/hospitalUser/login'
  ) {
    // const body = await readBody(event);
    const host = getHeaders(event);
    const params = getQuery(event);
    const requestBody = await readBody(event);

    const { method, path } = event;
    // console.log(params, requestBody);
    if (
      path.includes('/api/hospitalUser/archive') ||
      path.includes('/api/email') ||
      path.includes('/api/hash')
    ) {
      return;
    }
    if (!host.useremail) {
      return console.error('No user found!', path, method);
    }

    const body: InsertTransactionLogs = {
      endpoint: path,
      method: method,
      user: host.useremail,
      context: `${
        requestBody && Object.keys(requestBody).length !== 0
          ? 'request body: ' + JSON.stringify(requestBody)
          : ''
      } ${
        params && Object.keys(params).length !== 0
          ? 'params: ' + JSON.stringify(params)
          : ''
      }`,
    };
    await $fetch('/api/transaction', {
      method: 'POST',
      body,
    });
  }
});
