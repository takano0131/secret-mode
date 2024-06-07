function setResult(message) {
  document.getElementById('result').innerText = message;
}

function testFileSystemAPI() {
  const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
  if (!fs) {
      setResult('FileSystem APIがサポートされていません。');
      return;
  }
  fs(window.TEMPORARY, 100, () => setResult('通常モードです。'), () => setResult('シークレットモードです。'));
}

function testIndexedDB() {
  var db;
  var on = () => setResult('シークレットモードです。');
  var off = () => setResult('通常モードです。');
  var tryCatch = (func) => {
      try {
          return func();
      } catch (e) {
          return on();
      }
  };

  if (window.indexedDB && /Chrome/.test(navigator.userAgent)) {
      tryCatch(() => {
          db = indexedDB.open("test");
          db.onerror = on;
          db.onsuccess = off;
      });
  } else if (window.indexedDB) {
      tryCatch(() => {
          db = indexedDB.open("test");
          db.onerror = off;
          db.onsuccess = off;
      });
  } else {
      on();
  }
}

function testQuotaManagement() {
  if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(estimate => {
          if (estimate.quota < 120000000) {
              setResult('シークレットモードです。');
          } else {
              setResult('通常モードです。');
          }
      });
  } else {
      setResult('Quota Management APIがサポートされていません。');
  }
}

function testSafari() {
  const on = () => setResult('シークレットモードです。');
  const off = () => setResult('通常モードです。');

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isSafari) {
      try {
          window.openDatabase(null, null, null, null);
          off();
      } catch (_) {
          on();
      }
  } else {
      setResult('Safariブラウザではありません。');
  }
}

function testComprehensive() {
  const ua = navigator.userAgent;
  const isChrome = /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  
  if (isChrome) {
      const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
      if (!fs) {
          setResult('通常モードです。');
      } else {
          fs(window.TEMPORARY, 100, () => setResult('通常モードです。'), () => setResult('シークレットモードです。'));
      }
  } else if (isSafari) {
      try {
          window.openDatabase(null, null, null, null);
          setResult('通常モードです。');
      } catch (_) {
          setResult('シークレットモードです。');
      }
  } else if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(estimate => {
          if (estimate.quota < 120000000) {
              setResult('シークレットモードです。');
          } else {
              setResult('通常モードです。');
          }
      });
  } else if (window.indexedDB) {
      const db = indexedDB.open("test");
      db.onerror = () => setResult('シークレットモードです。');
      db.onsuccess = () => setResult('通常モードです。');
  } else {
      setResult('通常モードです。');
  }
}
