import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tugce.theclub',
  appName: 'The Club',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // Points the WebView to the live server during development.
    // Remove or replace with the production URL before a store release.
    url: 'https://e6dd15f2-bfc0-44b4-9154-f4e4c7ded82f-00-3qgtnpgiz3amh.worf.replit.dev',
    cleartext: false,
  }
};

export default config;
