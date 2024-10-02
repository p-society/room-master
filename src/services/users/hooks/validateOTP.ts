import { Hook } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import RolesEnum from '../../../constants/roles.enum';

const validateOTP = (): Hook => async (context) => {
  const { app, data, params } = context;
  const authService = app.service('authentication');
  const authHeader = params.headers && params.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const accessToken = authHeader.split(' ')[1];
    const authResult = await authService.create({
      strategy: 'jwt',
      accessToken: accessToken,
    });
    // console.log(authResult, accessToken)
    params.user = authResult.user;

    if (params.user && params.user.type === RolesEnum.SUPER_ADMIN) {
      return context;
    }
  }

  const authCodeService = app.service('otp');
  const authCode = await authCodeService._find({
    query: {
      type: 'email',
      dest: data.email,
      $sort: {
        createdAt: -1,
      },
    },
    paginate: false,
  });

  if (!authCode[0]) {
    throw new BadRequest('invalid OTP');
  }
  console.log(authCode[0].otp, data.otp);
  if (
    !(
      authCode[0].otp === data.otp ||
      /**
       * @todo @zakhaev26
       * remove '0000' default code.
       * for dev mode..!
       */
      data.otp === '0000'
    )
  ) {
    throw new BadRequest('invalid OTP');
  }

  const EXPIRATION_OFFSET: number = 10; // 10 Minutes
  console.log(authCode[0].createdAt);
  if (
    new Date(authCode[0].createdAt.getTime() + EXPIRATION_OFFSET) > new Date()
  ) {
    throw new BadRequest('This OTP is expired.Please try again.');
  }
  return context;
};

export default validateOTP;
