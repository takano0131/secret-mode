function isIncognito(callback) {
  const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
  if (!fs) {
      console.log('ブラウザが対応していません。');
      callback(false);
  } else {
      fs(window.TEMPORARY, 100, () => callback(false), () => callback(true));
  }
}

function checkPrivateBrowsing() {
  return new Promise((resolve) => {
      const on = () => resolve(true); // シークレットモード
      const off = () => resolve(false); // 通常モード

      const testLocalStorage = () => {
          try {
              if (window.localStorage) {
                  window.localStorage.setItem('test', '1');
                  window.localStorage.removeItem('test');
                  off();
              } else {
                  on();
              }
          } catch (e) {
              on();
          }
      };

      const ua = navigator.userAgent;
      const isSafari = /Safari/i.test(ua) && !/Chrome/i.test(ua);
      const isMobile = /Mobile|Android|iP(ad|hone)/i.test(ua);

      if (isSafari) {
          let test = () => {
              try {
                  window.openDatabase(null, null, null, null);
                  off();
              } catch (e) {
                  on();
              }
          };
          if (isMobile) {
              setTimeout(test, 100); // モバイルSafariのために少し待つ
          } else {
              test();
          }
      } else {
          testLocalStorage();
      }
  });
}

isIncognito((isInIncognito) => {
  if (isInIncognito) {
      console.log('シークレットモードです。');
  } else {
      console.log('通常モードです。');
  }
});

checkPrivateBrowsing().then((isPrivate) => {
  if (isPrivate) {
      console.log('シークレットモードです。');
  } else {
      console.log('通常モードです。');
  }
});
