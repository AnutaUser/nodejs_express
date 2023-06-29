import { EEmailActions } from '../enums';

export const emailConstant = {
  [EEmailActions.REGISTER]: {
    templateName: 'register',
    subject: 'Welcome to our corporation',
  },

  [EEmailActions.ACTIVATION]: {
    templateName: 'activation',
    subject: 'Please, activate your account',
  },

  [EEmailActions.FORGOT_PASSWORD]: {
    templateName: 'forgot-password',
    subject: 'Dont worry, we control your password',
  },

  [EEmailActions.LOGOUT]: {
    templateName: 'logout',
    subject: 'Good bye, comeback quickly',
  },

  [EEmailActions.DELETE]: {
    templateName: 'delete',
    subject: 'Sorry, that you leave us',
  },

  [EEmailActions.COMEBACK]: {
    templateName: 'comeback',
    subject: 'Great offer',
  },
};
