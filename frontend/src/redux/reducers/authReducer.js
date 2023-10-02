import { SIGNIN_SUCCESS, SIGNOUT_SUCCESS } from '@/constants/constants';

const initState = null;
// {
// id: 'test-123',
// role: 'ADMIN',
// provider: 'password'
// };

export default (state = initState, action) => {
  switch (action.type) {
    case SIGNIN_SUCCESS:
      console.log("--------------------------------------")
      console.log(action.payload)
      return {
        id: action.payload.id,
        role: action.payload.role,
        email: action.payload.email
      };
    case SIGNOUT_SUCCESS:
      return null;
    default:
      return state;
  }
};
