// typescript mumbo-jumbo to make it know that SimpleToast can exist
declare global{
  interface Window {
    SimpleToast: any;
  }
}

const toast = (toastText: string) => {
  if (!window.SimpleToast || !toastText) return false;

  const defaults = {
    footer: 'from Advanced Userscript Example',
    css: {
      'background-color': 'rgba(0,5,20,0.6)',
      'text-shadow': '',
      'font-family': 'monospace',
      footer: {
        'text-align': 'end',
      },
    },
    text: toastText,
  };

  return new window.SimpleToast(defaults);
};

export default toast;
