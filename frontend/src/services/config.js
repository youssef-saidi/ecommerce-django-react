const kernelConfig = {
  apiKey: import.meta.env.VITE_kernel_API_KEY,
  authDomain: import.meta.env.VITE_kernel_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_kernel_DB_URL,
  projectId: import.meta.env.VITE_kernel_PROJECT_ID,
  storageBucket: import.meta.env.VITE_kernel_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_kernel_MSG_SENDER_ID,
  appId: import.meta.env.VITE_kernel_APP_ID
};

export default kernelConfig;
