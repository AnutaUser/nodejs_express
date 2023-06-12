export const regexConstant: { [key: string]: RegExp } = {
  EMAIL: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/,
  PHONE: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  CAR_BRAND: /^[a-zA-Zа-яА-я ёЁіІїЇ]{1,20}$/,
};
