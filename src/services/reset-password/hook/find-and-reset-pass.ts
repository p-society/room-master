// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { query } from '@feathersjs/express';
import { Hook, HookContext } from '@feathersjs/feathers';
import { replaceItems } from 'feathers-hooks-common';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<any> => {

    const { data, app } = context;
    const { email, newPassword, otp } = data;

    if (!email || !newPassword || !otp) throw new Error('All credentials not provided!');

    const resetToken = await app.service('reset-password')._find({
      query: {
        'email': email,
        '$sort': {
          'createdAt': -1,
        },
      },
      paginate: false
    });
    console.log({ resetToken });
    if (resetToken.length === 0) throw new Error('No Request for password reset found');
    if (resetToken[0].expiresAt < new Date()) throw new Error('OTP Expired.Please Try Again!');
    if (resetToken[0].otp !== otp) throw new Error('Invalid OTP!');

    // valid user
    await app.service('users').patch(resetToken[0].user, {
      password: newPassword,
    });
    await Promise.all(resetToken.map((each: { _id: any; }) => app.service('reset-password')._remove(each._id)));
    context.result = {
      'message': 'password reset successfully',
    };
    return context;
  };
};
