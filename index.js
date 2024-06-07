function detectIncognitoMode(callback) {
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  
  if (isChrome) {
      const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
      if (!fs) {
          callback(false); // 旧バージョンのChrome
      } else {
          fs(window.TEMPORARY, 100, () => callback(false), () => callback(true));
      }
  } else {
      // 他のブラウザ用の検出ロジック
      detectNonChromeIncognitoMode(callback);
  }
}

function detectNonChromeIncognitoMode(callback) {
  const on = () => callback(true); // シークレットモード
  const off = () => callback(false); // 通常モード

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
}

detectIncognitoMode((isInIncognito) => {
  if (isInIncognito) {
      console.log('シークレットモードです。');
  } else {
      console.log('通常モードです。');
  }
});
