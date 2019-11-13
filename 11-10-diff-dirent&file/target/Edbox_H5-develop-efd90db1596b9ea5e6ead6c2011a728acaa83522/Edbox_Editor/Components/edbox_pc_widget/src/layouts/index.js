import { setLocale } from 'umi/locale';
import React from 'react';

export default function(props) {
  const { Edbox } = window;
  const { Language } = Edbox;
  Edbox.Start();
  switch (Language) {
    case 'SimplifiedChinese':
      setLocale('zh-CN');
      break;
    case 'English':
      setLocale('en-US');
      break;
    case 'TraditionalChinese_TW':
      setLocale('zh-TW');
      break;
    case 'TraditionalChinese':
      setLocale('zh-HK');
      break;
    default:
      setLocale('zh-CN');
  }

  return <>{props.children}</>;
}
