import { gql } from '@apollo/client';

export const GET_CATEGORIES_LIST = gql`
{
    categories(first: 10) {
      edges {
        node {
        id
        name 
        description
          slug
          backgroundImage{
            url
            alt
          }
          
        }
    }
  }
  }
`
export const GET_PRODUCT_Types = gql`
query ProductTypes(
  $first: Int
  $filter: ProductTypeFilterInput
){ productTypes(first:$first, filter:$filter){
  edges{
    node{
      id
      name
      slug
    }
  }
}
}

`
export const GET_PRODUCT_LIST = gql`
query ProductList(
  $first: Int
  $after: String
  $last: Int
  $before: String
  $filter: ProductFilterInput
  $sortBy: ProductOrder
  $channel: String
)
{ 
  products(
    before: $before
      after: $after
      first: $first
      last: $last
      filter: $filter
      sortBy: $sortBy
      channel: $channel
    )
   
    { 
    totalCount 
    edges {
      cursor
      node {
        id
        name
        slug
        description
        codAvailable
        rating
        media{
          url 
        }
        attributes{
          attribute{
            name
            slug
          }
          values{
            id
            name
          }
        }
        productType{
          hasVariants
        }
        category{
          id
          name
          level
          parent{
            name
          }
        }
        pricing{
          priceRangeUndiscounted{
            start{
              net{
                amount
              }
            }
          }
          priceRange{
            start{
              gross{
                amount
              }
              net{
                amount
              }
            }
          }
        }   
        variants{
          id
          name
          quantityAvailable
          weightedShipping
          originalPrice
          pricing{ 
            price{
              net{
                amount
              }
            }
            discount{
              currency
              net{
                amount
              }
            }
            priceUndiscounted{
              currency
            net{
              amount
            }  
          }        
        }
      }
    }
  }
  pageInfo{
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
}
}
`

export const GET_CATEGORIES_BANNERS = gql`
query CategoryBanner(
  $slug: String
 
)
{
  category(slug:$slug){
    id
    name
    level
    parent{
      name
      slug
    }
    backgroundImage{
      url
    }
  }
}
`

export const GET_FILTERS_LIST = gql`
query FilterList(

    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: CategoryFilterInput
    $sort: CategorySortingInput
    $level:Int
)
{
  categories(    
    level:$level 
    first: $first
    after: $after
    last: $last
    before: $before
    filter: $filter
    sortBy: $sort
    )
  {
    edges{
      node {
        id
        name
        slug
        products(channel: "default-channel"){
          totalCount
        }
        children(first: 20){
          edges{
            node{
              id
              name
              slug
              products(first:20, channel: "default-channel"){
                totalCount
                edges{
                  node{
                    pricing{
                      priceRange{
                        start{
                          gross{
                            amount
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } 
      }
    } 
  }
}
`
export const GET_CATEGORIES_SUBLIST = gql`
{
  categories(first: 20, level:0) {
    edges {
      node {
        id
        name
        slug
        description
        products(channel: "default-channel") {
          totalCount
        }
        children(first: 20) {
          edges {
            node {
              id
              name
              slug
              products(channel: "default-channel") {
                totalCount
              }
            }
          }
        }
        backgroundImage {
          url
          alt
        }
      }
    }
  }
}
`

export const GET_COLLECTION_LIST = gql`
  query CollectionList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: CollectionFilterInput
    $sort: CollectionSortingInput
    $channel: String
  ) {
    collections(
      first: $first
      after: $after
      before: $before
      last: $last
      filter: $filter
      sortBy: $sort
      channel: $channel
    ) {
      edges {
        node {
          id
          name
          metadata{
            key
            value
          }
          products(first: $first) {
            edges{
              node{
                id
                name
                metadata{
                  key
                  value
                }
                slug
                rating
                pricing{
                  priceRange{
                    start{
                      gross{
                        amount
                      }
                      net{
                        amount
                      }
                    }
                  }
                  priceRangeUndiscounted{
                    start{
                      net{
                        amount
                      }
                    }
                  }
                }
                media{
                  url
                }
                variants{
                  originalPrice
                  weightedShipping
                  id
                  name
                  quantityAvailable
                  pricing{
                    price{
                      net{
                        amount
                      }
                    }
                    discount{
                      currency
                      net{
                        amount
                      }
                    }
                    priceUndiscounted{
                      currency
                      net{
                        amount
                      }
                    }
                  }
                }
                productType{
                  hasVariants
                }
                category{
                  name
                }
                attributes {
                  attribute {
                    name
                    slug
                  }
                  values {
                    name
                  }
                }
              }
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const GET_PRODUCT_DETAILS = gql`
query Product(
 $id:ID
 $channel:String
 $slug:String
)
{
  product(
id: $id
slug: $slug
channel: $channel
){
    id
    name
    slug
    metadata{
      key
      value
    }
    codAvailable
    description
    seoDescription
    rating
    purchaseNote
    productType{
      id
      hasVariants
    }
    category{
      name
      id
      slug
      level
      parent{
        name
      }
    }
    thumbnail{
      url
    }
    attributes{
      attribute{
        id
        name
      }
      values{
        id
        name
        file{
          url
        }
      }
    }
    pricing{
      priceRangeUndiscounted{
        start{
          net{
            amount
          }
        }
      }
      priceRange{
        start{
          net{
            amount
          }
          gross{
            amount
          }
        }
      }
    }
    media{
      url
    }
    variants{
      id
      name
      weightedShipping
      originalPrice
      media{
      url
    }
      quantityAvailable
      pricing{      
        price{
          net{
            amount
          }
        }
        priceUndiscounted{ 
          net{
            amount
          }  
        }        
      }
    }
  }
}
`;

export const GET_CHECKOUT_BY_TOKEN = gql`
query CheckoutByToken(
 $token:UUID!
)
{
  checkout(token: $token) {
    id
    email
    voucherCode
    shippingMethods{
      id
      name
      price{
        amount
      }
    }
    metadata{
      key
      value
    }
    discount{
      amount
    }
    deliveryMethod{
      __typename
    }
    quantity
    billingAddress{
      firstName
      lastName
      streetAddress1
      streetAddress2
      phone
      postalCode
      city
      cityArea
      countryArea
    }
    shippingAddress{
      firstName
      lastName
      streetAddress1
      streetAddress2
      phone
      postalCode
      city
      cityArea
      countryArea
    }
    shippingPrice{
      net{
        amount
      }
    }
    totalPrice{
      gross{
        amount
      }
      net{
        amount
      }
      tax{
        amount
      }
    }
    lines{
      id
      quantity
      totalPrice{
        net{
          amount
        }
      }
      variant{
        name
        id
        quantityAvailable
        weightedShipping
        originalPrice
        pricing{
          priceUndiscounted{
            net{
              amount
            }
          }
          price{
            gross{
              amount
            }
            net{
              amount
            }
          }
        }
        product{
          id
          name
          purchaseNote
          slug
          codAvailable
          media{
            url
          }
          category {
            name
          }
          attributes {
            attribute {
              name
            }
            values {
              name
            }
          }
          pricing{
            priceRange{
              start{
                gross{
                  amount
                }
              }
            }
          }
        }
        media {
          url
        }
      }
    }
  }    
}
`;

export const GET_ATTRIBUTE_LIST = gql`
  query AttributeList(
    $filter: AttributeFilterInput
    $before: String
    $after: String
    $first: Int
    $last: Int
    $sort: AttributeSortingInput
  ) {
    attributes(
      filter: $filter
      before: $before
      after: $after
      first: $first
      last: $last
      sortBy: $sort
    ) {
      edges {
        node {
          id
          name
          slug
          choices(first: 100){
            totalCount
            edges{
              node{
                id
                name
                slug
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const SAVED_ADDRESSES = gql`
query Saved_Addresses{
  me {
firstName
lastName
email
mobileNo
    addresses {
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
      }
      companyName
      streetAddress1
      streetAddress2
      
    }
  }
}
`
export const SAVED_ORDERS = gql`
query savedOrders{
  me {
      orders(first:10){
        totalCount
        edges{
                  node{
                    id
	                  number
                    created
                    status
                    invoices{
                      url
                    }
                    totalBalance{
                      amount
                    }
                    paymentStatus
                    isPaid
                    fulfillments{
                      created
                      status
                      fulfillmentDate
                      trackingNumber
                      lines{
                        quantity
                        userStatus
                        changeQuantity
                        orderLine{
                          id
                          variant{
                            product{
                              returnAvailableDays
                            }
                          }
                          variantName
                          productName
                          quantityFulfilled
                          quantityToFulfill
                        }
                      }
                    }
                    payments{
                      paymentMethodType
                    }
                    discounts{
                      amount{
                        amount
                      }
                    }
                    voucher{
                      code 
                    }
                    shippingPrice{
                      net{
                        amount
                      }
                    }
                    subtotal{
                      net{
                        amount
                      }
                    }
                    undiscountedTotal{
                      net{
                        amount
                      }
                    }
                    total{
                      net{
                        amount
                      }
                    }
                    shippingAddress{
                      firstName
                      lastName
                      streetAddress1
                      streetAddress2
                      city
                      postalCode
                      phone
                    }
                    lines{
                      quantity
                      variantName
                      productName
                      id
                      userStatus
                      changeQuantity
                      weightedShipping
                      unitPrice{
                        net{
                          amount
                        }
                      }
                      thumbnail{
                        url
                      }
                      variant{
                        id
                        product{
                          returnAvailableDays
                        }
                        weightedShipping
                        pricing{
                          price{
                            net{
                              amount
                            }
                          }
                        }
                      }
                    }
                    total{gross{amount}}
                    }
         }
      }
    }
}
`

export const COLLECTION_DETAILS = gql`
  query CollectionDetails(
    $channel: String
    $slug: String
  ) {
    collection(channel: $channel, slug: $slug) {
      id
      name
      description
      seoDescription
      seoTitle
      backgroundImage{
        url
      }
    }
  }
`;

export const SHOP_DATA = gql`
  query ShopData {
      shop{
        codAvailableLimit
        shippingMinimumLimit
        name
        description
      }
    }
`;

export const GET_MENU_LIST = gql`
  query MenuList(
    $first: Int
    $channel: String
  ) {
    menus(
      first: $first
      channel: $channel
    ) {
      edges{
        node{
          id
          name
          items{
            id
            name
            url
          }
        }
      }
    }
  }
`;

export const GET_TOP_CATEGORIES = gql`
  query TopCategories(
    $first: Int = 30
  ) {
    categories(
      first: $first
      level: 0
    ) {
      edges {
        node {
          id
          name  
          slug
          description
          products(channel: "default-channel") {
            totalCount
          }
          backgroundImage {
            url
            alt
          }
          metadata {
            key
            value
          }
        }
      }
    }
  }
`;

export const GET_TOP_BRANDS = gql`
  query TopBrands($first: Int = 30) {
    attributes(first: $first) {
      edges {
        node {
          id
          name
          slug
          choices(first: 100) {
            edges {
              node {
                id
                name
                slug
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_HOME_COLLECTIONS_WITH_PRODUCTS = gql`
  query HomeCollectionsWithProducts(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: CollectionFilterInput
    $sort: CollectionSortingInput
    $channel: String
  ) {
    collections(
      first: $first
      after: $after
      before: $before
      last: $last
      filter: $filter
      sortBy: $sort
      channel: $channel
    ) {
      edges {
        node {
          id
          name
          slug
          metadata {
            key
            value
          }
          products(first: 30) {
            edges {
              node {
                id
                name
                description
                metadata {
                  key
                  value
                }
                slug
                rating
                category {
                  name
                }
                attributes {
                  attribute {
                    name
                    slug
                  }
                  values {
                    name
                  }
                }
                pricing {
                  priceRange {
                    start {
                      gross {
                        amount
                      }
                      net {
                        amount
                      }
                    }
                  }
                  priceRangeUndiscounted {
                    start {
                      net {
                        amount
                      }
                    }
                  }
                }
                media {
                  url
                }
                variants {
                  id
                  name
                  originalPrice
                  weightedShipping
                  quantityAvailable
                  pricing {
                    price {
                      net {
                        amount
                      }
                    }
                    discount {
                      currency
                      net {
                        amount
                      }
                    }
                    priceUndiscounted {
                      currency
                      net {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;