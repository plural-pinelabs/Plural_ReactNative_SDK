import React from "react";
import { View, Text, Button, Alert } from "react-native";
import axios from "axios";
import { startPayment_ } from "plural_react_nativesdk"; // Update the path to the actual bridge file location

// Define interfaces for order creation
interface OrderAmount {
  value: number;
  currency: string;
}

interface Address {
  address1: string;
  address2: string;
  address3: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

interface Customer {
  email_id: string;
  first_name: string;
  last_name: string;
  customer_id: string;
  mobile_number: string;
  billing_address: Address;
  shipping_address: Address;
}

interface MerchantMetaData {
  key1: string;
  key2: string;
}

interface PurchaseDetails {
  customer: Customer;
  merchant_metadata: MerchantMetaData;
}

interface Order {
  merchantId: number;
  pre_auth: boolean;
  order_amount: OrderAmount;
  purchase_details: PurchaseDetails;
}

// Sample Data
const sampleOrderAmount: OrderAmount = {
  value: 50000,
  currency: "INR",
};

const sampleBillingAddress: Address = {
  address1: "H.No 15, Sector 17",
  address2: "",
  address3: "",
  pincode: "61232112",
  city: "CHANDIGARH",
  state: "PUNJAB",
  country: "INDIA",
};

const sampleShippingAddress: Address = {
  address1: "H.No 15, Sector 17",
  address2: "string",
  address3: "string",
  pincode: "144001123",
  city: "CHANDIGARH",
  state: "PUNJAB",
  country: "INDIA",
};

const sampleCustomer: Customer = {
  email_id: "joe.sam@gmail.com",
  first_name: "joe",
  last_name: "kumar",
  customer_id: "192212",
  mobile_number: "905002003",
  billing_address: sampleBillingAddress,
  shipping_address: sampleShippingAddress,
};

const sampleMerchantMetaData: MerchantMetaData = {
  key1: "value1",
  key2: "value2",
};

const samplePurchaseDetails: PurchaseDetails = {
  customer: sampleCustomer,
  merchant_metadata: sampleMerchantMetaData,
};

// Axios instance to call APIs
const getApiInterface = () => {
  return axios.create({
    baseURL: "https://pluraluat.v2.pinepg.in/api",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Fetch access token
const fetchAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(
      "https://pluraluat.v2.pinepg.in/api/auth/v1/token",
      {
        client_id: "64408363-22fa-48f7-a409-3f95bdee1696",
        client_secret: "87600ED1BC80452685F5D9B7651BF373",
        grant_type: "client_credentials",
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 && response.data) {
      console.log("Access Token:", response.data.access_token);
      return response.data.access_token;
    } else {
      console.error("Failed to fetch access token:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
};

// Create an order and return the session token
const createOrder = async (authAccessToken: string): Promise<string | null> => {
  const apiInterface = getApiInterface();
  const orderReference = `order_${Math.floor(Math.random() * 10000)}`;

  try {
    const response = await apiInterface.post(
      "/checkout/v1/orders",
      {
        merchant_order_reference: orderReference,
        order_amount: sampleOrderAmount,
        purchase_details: samplePurchaseDetails,
      },
      {
        headers: {
          Authorization: `Bearer ${authAccessToken}`,
          "Merchant-ID": "110547",
        },
      }
    );

    if (response.status === 200 && response.data) {
      console.log("Full API Response:", JSON.stringify(response.data, null, 2));
      const sessionToken = response.data.token;
      console.log("Session Token:", sessionToken);
      return sessionToken;
    } else {
      console.error("Failed to create order:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error creating order:", error);
    Alert.alert("Error", "Failed to create order.");
    return null;
  }
};

// Main component
const App = () => {
  const handleCreateOrderAndStartPayment = async () => {
    const accessToken = await fetchAccessToken();

    if (accessToken) {
      const sessionToken = await createOrder(accessToken);
      if (sessionToken) {
        startPayment_(
          { token: sessionToken },
          (result: string) => {
            console.log("Payment Result:", result);
            Alert.alert("Payment Status", result);
          }
        );
      }
    } else {
      Alert.alert("Error", "Failed to fetch access token.");
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Order Creation & Payment</Text>
      <Button title="Fetch Token, Create Order, and Start Payment" onPress={handleCreateOrderAndStartPayment} />
    </View>
  );
};

export default App;
