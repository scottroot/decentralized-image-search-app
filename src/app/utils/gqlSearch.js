import {path} from "ramda";


const ARWEAVE_HOST = "https://arweave-search.goldsky.com/graphql";

async function gqlSearch({ids, owners, first, sort, tags, block, fetchOptions, gateway, returnError, excludeFields}) {
  const isGoldsky = gateway ? (gateway === ARWEAVE_HOST) : true;
  const isBundlr = gateway && gateway.endsWith("bundlr.network/graphql");
  let variables = {first: Number(first || 10), sort: sort || "HEIGHT_DESC"}
  if(isBundlr) {
    variables.sort = variables.sort.replace("HEIGHT_", "");
  }
  if(ids) variables.ids = ids;
  if(owners) variables.owners = owners;
  if(tags) variables.tags = tags;
  if(block) {
    variables.block = {};
    if(block?.min && typeof block?.min !== 'undefined') variables.block.min = Number(block.min);
    if(block?.max && typeof block?.max !== 'undefined') variables.block.max = Number(block.max);
  }
  const excludes = excludeFields ? excludeFields : [];

  let graphql = JSON.stringify({
    query: `query (${ids ? `\n    $ids:[${isBundlr ? "String" : "ID"}!]` : ""}${owners ? "\n    $owners: [String!]" : ""}${block ? `\n    $block: ${isGoldsky ? "RangeFilter" : "BlockFilter"}` : ""}${tags ? "\n    $tags: [TagFilter!]" : ""}
    $first: Int = 10
    $sort: SortOrder = ${isBundlr ? "DESC" : "HEIGHT_DESC"}
    ) {
        transactions (${ids ? "\n            ids: $ids" : ""}${owners ? "\n            owners: $owners" : ""}${block ? "\n            block: $block" : ""}${tags ? "\n            tags: $tags" : ""}
            first: $first
            ${isBundlr ? "order" : "sort"}: $sort
        ) {
            edges {
                cursor
                node {
                    id ${isBundlr ? "" : `
                    recipient`} ${isBundlr ? `
                    address` : `owner {
                        address
                    }`} ${(isBundlr || excludes.includes("data")) ? "" : `
                    data {
                        size
                        type
                    }`}
                    ${excludes.includes("tags") ? "" : `tags {
                        name
                        value
                    }`} ${isBundlr ? "" : `
                    block {
                        timestamp
                        height
                    }`} ${(isBundlr || excludes.includes("data")) ? "" : `
                    bundledIn {
                        id
                    }`} ${isBundlr ? `
                    currency` : ""}${isBundlr ? `
                    timestamp` : ""}
                }
            }
        }
    }`,
    variables: variables
  })

  let requestOptions = {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: graphql,
  };
  if(fetchOptions) {
    Object.keys(fetchOptions).forEach((k) => {
        requestOptions[k] = fetchOptions[k]
    })
  }

  let gql;
  try {
    gql = await fetch(gateway || ARWEAVE_HOST, requestOptions).then(r=>r.json());
  }
  catch (err) {
    console.log("Error fetching response from Graphql...")
    console.log(err)
    if(returnError) {
      return String(err);
    }
    return []
  }

  try {
    const edges = path(["data", "transactions", "edges"], gql);
    if(typeof edges === 'undefined') {
      console.log("Graphql response did not include data.transactions.edges");
      return []
    }
    return edges.map(tx => tx.node);
  }
  catch (err) {
    console.log("Error doing graphql search")
    console.log(err)
    if(returnError) {
      return String(err?.message || err);
    }
  }
}

export default gqlSearch