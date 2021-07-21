export const genId = (length: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array(length)
    .fill('')
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join('');
};
