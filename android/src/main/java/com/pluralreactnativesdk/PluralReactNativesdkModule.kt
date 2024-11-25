package com.pluralreactnativesdk


import com.facebook.react.bridge.ReactMethod
import android.util.Log
import android.widget.Toast
import com.pinelabs.pluralsdk.PluralSDKManager
import com.pinelabs.pluralsdk.callback.PaymentResultCallBack
import com.pinelabs.pluralsdk.data.utils.Utils
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Callback

class PluralReactNativesdkModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  // Instance of PluralManager to manage payment
  private val pluralManager: PluralSDKManager = PluralSDKManager()

  override fun getName(): String {
    return "PluralReactNativesdkModule"
  }

  @ReactMethod
  fun startPayment(token: String, callback: Callback) {
    val activity = currentActivity

    if (activity != null) {
      // Check if internet is available
     if(Utils.hasInternetConnection(activity)) {
        // Start the payment process with the pluralManager instance
       pluralManager.startPayment(activity, token, object : PaymentResultCallBack {

         override fun onErrorOccured(message: String?) {

         }

         override fun onSuccessOccured() {

         }

         override fun onTransactionResponse() {

         }

         override fun onCancelTransaction() {
         }
       })

    } else {
      callback.invoke("NO_ACTIVITY", "No activity found")
    }
  }
}}

