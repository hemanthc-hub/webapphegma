import React, { Suspense, lazy, useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { onError } from "@apollo/client/link/error";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { ApolloProvider } from "@apollo/client/react";
import { HelmetProvider, Helmet } from 'react-helmet-async';
import 'react-lazy-load-image-component/src/effects/blur.css';
import SplashScreen from './components/Home/Splashscreen';

// Lazy-loaded route components
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const ProductScreen = lazy(() => import('./screens/ProductScreen'));
const DashboardScreen = lazy(() => import('./screens/DashboardScreen'));
const WishlistScreen = lazy(() => import('./screens/WishlistScreen'));
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const ForgotPasswordScreen = lazy(() => import('./screens/ForgotPasswordScreen'));
const ReturnPolicyScreen = lazy(() => import('./screens/ReturnPolicyScreen'));
const TermAndConditionsScreen = lazy(() => import('./screens/TermAndConditionsScreen'));
const PrivacyPolicyScreen = lazy(() => import('./screens/PrivacyPolicyScreen'));
const OrderCompletedScreen = lazy(() => import('./screens/OrderCompletedScreen'));
const AboutUsScreen = lazy(() => import('./screens/AboutUsScreen'));
const CartScreen = lazy(() => import('./screens/CartScreen'));
const CheckoutScreen = lazy(() => import('./screens/CheckoutScreen'));
const ContactUs = lazy(() => import('./screens/ContactUs'));
const ProductSearchScreen = lazy(() => import('./screens/ProductSearchScreen'));
const OrderPlacedScreen = lazy(() => import('./screens/OrderPlacedScreen'));
const OfflineOrder = lazy(() => import('./screens/OfflineOrder'));
const NewClinicSetup = lazy(() => import('./screens/NewClinicSetup'));
const OrderDetailScreen = lazy(() => import('./screens/OrderDetailScreen'));
const OrdersScreen = lazy(() => import('./screens/OrdersScreen'));
const AddressScreen = lazy(() => import('./screens/AddressScreen'));
const AccountDetail = lazy(() => import('./screens/AccountDetail'));
const ChangePasswordScreen = lazy(() => import('./screens/ChangePassowrdScreen'));
const SetPasswordScreen = lazy(() => import('./screens/SetPasswordScreen'));
const ShippingDeliveryPolicy = lazy(() => import('./screens/ShippingDeliveryPolicy'));

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error in ${operation?.operationName || 'unknown'}]: ${message}`, { locations, path })
    );
  if (networkError) console.error(`[Network error in ${operation?.operationName || 'unknown'}]:`, networkError);
});

const httpLink = new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_URL || "/graphql" });
console.log("[Hegma App] Active GraphQL endpoint:", process.env.REACT_APP_GRAPHQL_URL || "/graphql");

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return {
    headers: {
      ...headers,
      ...(user !== null && token ? { Authorization: `JWT ${token}` } : {})
    }
  }
});

const link = from([
  errorLink,
  authLink,
  httpLink,
]);

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Product: {
        fields: {
          pricing: { merge: true },
        },
      },
      ProductVariant: {
        fields: {
          pricing: { merge: true },
        },
      },
      Checkout: {
        fields: {
          shippingAddress: { merge: true },
          billingAddress: { merge: true },
        },
      },
    },
  }),
  link: link,
});

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }
  return (
    <HelmetProvider>
      <>
        <Helmet>
          <title>Hegmakart</title>
          <meta name="keywords" content="Hegmakart" />
          <meta name="description" content="Hegmakart" />
        </Helmet>

        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ApolloProvider client={client}>
            <Suspense fallback={null}>
              <Routes>
                <Route path='/change-password' element={<ChangePasswordScreen />} />
                <Route path='/set-password' element={<SetPasswordScreen />} />
                <Route path='/account-detail' element={<AccountDetail />} />
                <Route path='/top-deals-and-featured-products' element={<ProductSearchScreen />} />
                <Route path="/search/all" element={<ProductSearchScreen />} />
                <Route path='/address' element={<AddressScreen />} />
                <Route path='/order' element={<OrdersScreen />} />
                <Route path='/orderDetails/:id' element={<OrderDetailScreen />} />
                <Route path='/orderPlace' element={<OrderCompletedScreen />} />
                <Route path="/Dashboard" element={<DashboardScreen />} />
                <Route path="/" element={<HomeScreen />} />
                <Route path="/:slug" element={<HomeScreen />} />
                <Route path='/category' element={<ProductSearchScreen />} />
                <Route path='/category/:id' element={<ProductSearchScreen />} />
                <Route path='/category/:parentId/:id' element={<ProductSearchScreen />} />
                <Route path='/category/:grandParentId/:parentId/:id' element={<ProductSearchScreen />} />
                <Route path='/login' element={<LoginScreen />} />
                <Route path='/product/:slug' element={<ProductScreen />} />
                <Route path='/wishlist' element={<WishlistScreen />} />
                <Route path='/privacy-policy' element={<PrivacyPolicyScreen />} />
                <Route path='/forgotpassword' element={<ForgotPasswordScreen />} />
                <Route path='/ReturnPolicy' element={<ReturnPolicyScreen />} />
                <Route path='/TermAndConditions' element={<TermAndConditionsScreen />} />
                <Route path="ShippingDeliveryPolicy" element={<ShippingDeliveryPolicy />} />
                <Route path='/Order-Completed' element={<OrderCompletedScreen />} />
                <Route path='/about' element={<AboutUsScreen />} />
                <Route path='/cart' element={<CartScreen />} />
                <Route path='/offline-order' element={<OfflineOrder />} />
                <Route path='/new-clinic-setup/:packageId' element={<NewClinicSetup />} />
                <Route path='/checkout' element={<CheckoutScreen />} />
                <Route path='/contact-us' element={<ContactUs />} />
                <Route path='/search/:psearchData' element={<ProductSearchScreen />} />
                <Route path='/collection/:cosearchData' element={<ProductSearchScreen />} />
                <Route path='/productType/:productType' element={<ProductSearchScreen />} />
                <Route path='/brand/:attsearchData' element={<ProductSearchScreen />} />
              </Routes>
            </Suspense>
            <Toaster
              position="bottom-center"
              richColors
              closeButton
              style={{ zIndex: 999999 }}
              toastOptions={{
                className: 'hk-toast',
                duration: 1000,
                style: {
                  borderRadius: '10px',
                  fontSize: '14px',
                },
              }}
            />
          </ApolloProvider>
        </BrowserRouter>
      </>
    </HelmetProvider>
  )
}

export default App
