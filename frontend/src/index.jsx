import { Preloader } from '@/components/common';
import 'normalize.css/normalize.css';
import React from 'react';
import { render } from 'react-dom';
import 'react-phone-input-2/lib/style.css';
import { onAuthStateFail, onAuthStateSuccess } from '@/redux/actions/authActions';
import configureStore from '@/redux/store/store';
import '@/styles/style.scss';
import WebFont from 'webfontloader';
import App from './App';
import kernel from '@/services/kernel';

WebFont.load({
  google: {
    families: ['Tajawal']
  }
});

const { store, persistor } = configureStore();
const root = document.getElementById('app');

// Render the preloader on initial load
render(<Preloader />, root);

setTimeout(() => {
  kernel.onAuthStateChanged().then((msg)=>{

    const user=msg
    if (user&&user.id) {
      store.dispatch(onAuthStateSuccess(user));
    } else {
      store.dispatch(onAuthStateFail('Failed to authenticate'));
    }
    // then render the app after checking the auth state
    render(<App store={store} persistor={persistor} />, root);
  }).catch((err)=>{
    console.log(err)
  })
}, 3000);





if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('SW registered: ', registration);
    }).catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
