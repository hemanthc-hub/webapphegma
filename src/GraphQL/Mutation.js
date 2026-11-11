import { gql } from "@apollo/client";

export const TOKEN_AUTH_MUTATION = gql`
  mutation TokenAuth($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      errors {
        field
        message
      }
      refreshToken
      csrfToken
      token
      user {
        id
        firstName
        lastName
        email
        wishlistToken
        __typename
        isStaff
      }
    }
  }
`;

export const TOKEN_VERIFY_MUTATION = gql`
  mutation VerifyToken($token: String!) {
    tokenVerify(token: $token) {
      payload
      isValid
      user {
        id
        email
      }
    }
  }
`;

export const TOKEN_REFRESH_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    tokenRefresh(refreshToken: $refreshToken) {
      token
      errors {
        message
      }
    }
  }
`;

export const CREATE_CHECKOUT_MUTATION = gql`
mutation CreateCheckout($email: String!, $lines: [CheckoutLineInput!]!, $channel: String!) {
  checkoutCreate(input: { channel: $channel, email: $email, lines: $lines }) {
    checkout {
      id
      token
    }
    errors {
      field
      message
      code
    }
  }
}
`;

export const CHECKOUT_ADD_PRODUCT_LINE_MUTATION = gql`
mutation CheckoutAddProductLine(
  $token: UUID!, $lines: [CheckoutLineInput!]!
) {
  checkoutLinesAdd(token: $token, lines: $lines) {
    checkout {
      id
      token
    }
    errors {
      message
      code
    }
  }
}
`;

export const CHECKOUT_LINE_DELETE = gql`
mutation CheckoutLineDelete(
$token:UUID!, $lineId:ID! 
) {
  checkoutLineDelete (
    token: $token
    lineId:$lineId
    
  ){
    
    errors{
      
      field
      message
    }
  }
}
`;

export const CHECKOUT_LINE_UPDATE = gql`
mutation CheckoutLineUpdate(
  $token: UUID
  $lines: [CheckoutLineUpdateInput!]!
) {
  checkoutLinesUpdate(token: $token, lines: $lines) {
    checkout {
      id
    }
    errors {
      message
    }
  }
}
`;

export const CREATE_ADDRESS_MUTATION = gql`
  mutation accountAddressCreate($input: AddressInput!) {
    accountAddressCreate(input: $input) {
      errors {
        field
        message
        code
      }
      address {
        id
        city
        cityArea
        phone
        firstName
        lastName
        postalCode
        countryArea
        country {
          country
          code
        }
        companyName
        streetAddress1
        streetAddress2
        isDefaultShippingAddress
        isDefaultBillingAddress
      }
    }
  }
`;

export const UPDATE_ADDRESS_MUTATION = gql`
  mutation accountAddressUpdate($id: ID!, $input: AddressInput!) {
    accountAddressUpdate(id: $id, input: $input) {
      errors {
        field
        message
        code
      }
      address {
        id
        city
        cityArea
        phone
        firstName
        lastName
        postalCode
        countryArea
        country {
          country
          code
        }
        companyName
        streetAddress1
        streetAddress2
        isDefaultShippingAddress
        isDefaultBillingAddress
      }
    }
  }
`;


export const UPDATE_WISHLIST_MUTATION = gql`
  mutation accountUpdate( $input:AccountInput! ) {
    accountUpdate(input: $input) {
      errors {
        message
      }
      user{
        id
      }
    }
  }
`;

export const CHECKOUT_ADD_PROMO_CODE = gql`
mutation checkoutAddPromoCode($token: UUID!, $promoCode: String!) {
  checkoutAddPromoCode(token: $token, promoCode: $promoCode) {
    checkout {
      id
      token
    }
    errors {
      message
      field
    }
  }
}
`;

export const CHECKOUT_REMOVE_PROMO_CODE = gql`
mutation checkoutRemovePromoCode($token: UUID!, $promoCode: String!) {
  checkoutRemovePromoCode(token: $token, promoCode: $promoCode) {
    checkout {
      id
      token
    }
    errors {
      message
      field
    }
  }
}
`;

export const ACCOUNT_ADDRESS_DELETE = gql`
  mutation accountAddressDelete($id: ID!) {
    accountAddressDelete(id: $id) {
      errors {
        field
        message
        code
      }
      address {
        id
      }
    }
  }
`;

export const ACCOUNT_SET_DEFAULT_ADDRESS = gql`
  mutation accountSetDefaultAddress($id: ID!, $type: AddressTypeEnum!) {
    accountSetDefaultAddress(id: $id, type: $type) {
      user {
        id
        defaultShippingAddress {
          id
        }
        defaultBillingAddress {
          id
        }
        addresses {
          id
          isDefaultShippingAddress
          isDefaultBillingAddress
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const CHECKOUT_PAYMENT_CREATE = gql`
mutation checkoutPaymentCreate($token: UUID!, $input: PaymentInput!) {
  checkoutPaymentCreate(token: $token, input: $input) {
    payment {
      id
      token
      gateway
      order{
        id
      }
      checkout{
        token 
      }
    }
    errors {
      field
      message
    }
  }
}
`;

export const PASSWORD_CHANGE_MUTATION = gql`
mutation passwordChange($oldPassword:String!,$newPassword:String! ){
  passwordChange(oldPassword:$oldPassword, newPassword: $newPassword) {
    errors {
          message
          code
        }
  }   
}
`;

export const ACCOUNT_UPDATE_MUTATION = gql`
mutation accountUpdate($input:AccountInput!){
  accountUpdate(input: $input) {
    user{
      firstName
      lastName
    }
    errors {
          message
          code
        }
  }   
}
`;

export const CHECKOUT_EMAIL_UPDATE = gql`
mutation CheckoutEmailUpdate($token: UUID!, $email: String!) {
  checkoutEmailUpdate(email: $email, token: $token) {
    checkout{
      token 
      totalPrice{
        net{
          amount
        }
      }
    }
    errors {
      field
      message
    }
  }
}
`;

export const CHECKOUT_BILLING_ADDRESS_UPDATE = gql`
mutation CheckoutBillingAddressUpdate(
  $token: UUID!
  $billingAddress: AddressInput!
) {
  checkoutBillingAddressUpdate(billingAddress: $billingAddress, token: $token) {
    checkout {
      id
    }
    errors {
      field
      message
      code
    }
  }
}
`;

export const CHECKOUT_SHIPPING_ADDRESS_UPDATE = gql`
mutation CheckoutShippingAddressUpdate(
  $token: UUID!
  $shippingAddress: AddressInput!
) {
  checkoutShippingAddressUpdate(shippingAddress: $shippingAddress, token: $token) {
    checkout {
      id
      shippingAddress{
        firstName
      }
    }
    errors {
      field
      message
      code
    }
  }
}
`;

export const CHECKOUT_DELIEVERY_METHOD_UPDATE = gql`
mutation checkoutDeliveryMethodUpdate(
  $token: UUID!
  $deliveryMethodId: ID!
) {
  checkoutDeliveryMethodUpdate(deliveryMethodId: $deliveryMethodId, token: $token) {
    checkout {
      id
    }
    errors {
      field
      message
      code
    }
  }
}
`;

export const METADATA_UPDATE = gql`
mutation updateMetadata(
  $id: ID!
  $input: [MetadataInput!]!
) {
  updateMetadata(id: $id, input: $input) {
    item{
      metadata{
        key
        value
      }
    }
    errors {
      field
      message
    }
  }
}
`;

export const CHECKOUT_CUSTOMER_ATTACH = gql`
mutation checkoutCustomerAttach(
  $token: UUID!
) {
  checkoutCustomerAttach(token: $token) {
    checkout {
      id
      user{
        email
      }
    }
    errors {
      field
      message
      code
    }
  }
}
`;

