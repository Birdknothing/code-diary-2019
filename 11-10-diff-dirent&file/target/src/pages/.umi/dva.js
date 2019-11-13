import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'edbox', ...(require('e:/git-pro/Edbox_H5/Edbox_Editor/Framework/web/src/models/edbox.js').default) });
app.model({ namespace: 'FeedBack', ...(require('e:/git-pro/Edbox_H5/Edbox_Editor/Framework/web/src/models/FeedBack.js').default) });
app.model({ namespace: 'edit', ...(require('e:/git-pro/Edbox_H5/Edbox_Editor/Framework/web/src/pages/gameEdit/models/edit.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
