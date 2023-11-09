This is a thin static webpage UI to demonstrate the decentralized yet AI-powered image search capability accomplished via the below points:

After spending the first week of the hackathon thinking through how this could actually be done, I had this idea above after reading
more of the latest research on the topic.

## What it is
### TL;dr An Inverted Vector File index that uses near deterministic clustering in order to accomplish semantic
vector similarity search at an acceptable quality by storing the knn cluster index chunks under specific tags on Arweave.
 * This is a standard search engine style page that allows users to enter text queries and find images stored on Arweave.
 * The user's text query is encoded into a vector word embedding in order to identify the meaning and for finding results.
 * The client app via a web worker analyzes the query embedding and makes an API call (in this demo, to a mock
 contract hosted on permaweb.ar, but #TO-DO: deploy the Mem to DecentLand to do this step there), and finds the granular
 categories closest to the search query.
 * 125k+ categories and combinations.
 * The search query is made against Graphql.
 * The results to the user are delivered through the app from that data

## How it works
 * Transactions are indexed as they are added to a smart contract.  Indexing happens in Mem.
 * User searches for "yellow cat driving a car"
 * Model running in browser in Wasm encodes this, processes next via Mem (for now a temp api)



* Need to submit, will write up more after if that is allowed.