// Native fetch is available in Node 25

const query = `
  query CollectionList(
    $first: Int
    $channel: String
  ) {
    collections(
      first: $first
      channel: $channel
    ) {
      edges {
        node {
          name
          products(first: 20) {
            edges {
              node {
                name
                media {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;

const variables = {
  first: 20,
  channel: "home-collection"
};

fetch('http://localhost:8000/graphql/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query, variables })
})
.then(async res => {
  const json = await res.json();
  const collections = json.data?.collections?.edges || [];
  console.log(`Total Collections (sets) retrieved: ${collections.length}`);
  
  let collectionsWithData = 0;
  let totalBanners = 0;
  
  collections.forEach((col, idx) => {
    const productCount = col.node.products?.edges?.length || 0;
    console.log(`- Collection ${idx + 1} (${col.node.name}): ${productCount} products (banners)`);
    if (productCount > 0) {
      collectionsWithData++;
      totalBanners += productCount;
    }
  });
  
  console.log(`\nSummary:`);
  console.log(`Collections with data: ${collectionsWithData}`);
  console.log(`Total banners (images): ${totalBanners}`);
})
.catch(console.error);
