import dateFormat from './modules/date';
import toast from './modules/toast';

(() => {
  const date = new Date();
  const formatted = `The date is ${dateFormat(date)}.`;
  console.log(formatted);
  toast(formatted)
})();
