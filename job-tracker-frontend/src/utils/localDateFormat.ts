// forget to add comments on where and why we did this
export const localDateFormat = () => {
  const lastDayCentury = new Date(1999, 11, 31);
  let localStringDate = lastDayCentury.toLocaleDateString();
  localStringDate = localStringDate.replace("31","dd");
  localStringDate = localStringDate.replace("12","mm");
  localStringDate = localStringDate.replace("1999","yyyy");
  return localStringDate;
}