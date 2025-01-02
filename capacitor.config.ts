import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.openera.app',
  appName: 'Openera',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2D4531",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#EDEDDD",
    },
  }
};

export default config;