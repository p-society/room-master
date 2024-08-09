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

  return context;
};

export default validateOTP;
