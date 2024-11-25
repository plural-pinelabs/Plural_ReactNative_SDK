import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'plural_react_nativesdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const PluralReactNativesdkModule = NativeModules.PluralReactNativesdkModule
  ? NativeModules.PluralReactNativesdkModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

// Destructure the startPayment method from the SDK
const { startPayment } = PluralReactNativesdkModule;
export interface PaymentParams {
  token: string;
}

export const startPayment_ = (params: PaymentParams, callback: CallableFunction): void => {
  console.log("Starting payment with token:", params.token);
  startPayment(params.token, callback);
};

export default { startPayment_ };

