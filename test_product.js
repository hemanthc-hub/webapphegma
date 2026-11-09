const query = `
  query ProductDetails($slug: String!) {
    product(slug: $slug, channel: "default-channel") {
      name
      description
      seoTitle
      seoDescription
      category { name }
      productType { name }
      attributes {
        attribute { name }
        values { name }
      }
      variants {
        name
      }
    }
  }
`;

const variables = {
  slug: "api-pedo-forcep-kit-set-of-7"
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
  console.log(JSON.stringify(json, null, 2));
})
.catch(console.error);
