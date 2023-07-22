import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ionic-capacitor-tutorial',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '651481800238-q8csl3u52lsmf87k3s2bj0nuu7c2dipr.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  }
};

export default config;
