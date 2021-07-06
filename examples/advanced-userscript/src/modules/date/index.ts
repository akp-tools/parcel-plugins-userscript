import format from 'date-fns/format';

export default (date: Date) => {
  return format(date, 'yyyy-MM-dd');
}
