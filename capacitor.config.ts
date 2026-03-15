import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tugce.theclub',
  appName: 'The Club',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;