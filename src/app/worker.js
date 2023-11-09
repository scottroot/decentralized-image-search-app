import { env, AutoTokenizer, CLIPTextModelWithProjection } from '@xenova/transformers';
import { getCachedFile, getCachedJSON } from './utils/index.js';
import gqlSearch from "@/app/utils/gqlSearch";

const EMBED_DIM = 768;

// Skip local model check
env.allowLocalModels = false;

class ApplicationSingleton {
    // static model_id = 'Xenova/clip-vit-base-patch16';
    // static BASE_URL = 'https://huggingface.co/datasets/Xenova/semantic-image-search-assets/resolve/main/';
    static model_id = 'Xenova/clip-vit-large-patch14';
    // static model_id = 'Xenova/clip-vit-base-patch32';
    static BASE_URL = 'https://huggingface.co/datasets/Xenova/semantic-image-search-assets/resolve/main/';

    static tokenizer = null;
    static text_model = null;
    static metadata = null;
    static embeddings = null;

    static async getInstance(progress_callback = null) {
        // Load tokenizer and text model
        if (this.tokenizer === null) {
            this.tokenizer = AutoTokenizer.from_pretrained(this.model_id, { progress_callback });
        }
        if (this.text_model === null) {
            this.text_model = CLIPTextModelWithProjection.from_pretrained(this.model_id, { progress_callback });
        }
        if (this.metadata === null) {
            this.metadata = getCachedJSON(this.BASE_URL + 'image-embeddings.json');
        }
        if (this.embeddings === null) {
            this.embeddings = new Promise(
                (resolve, reject) => {
                    getCachedJSON("https://llm-assets-public.s3.amazonaws.com/centroids.json")
                      .then((r) => resolve(r) )
                    // resolve(true)
                    // getCachedFile(this.BASE_URL + 'image-embeddings_25k-512-32bit.bin')
                    //     .then((buffer) => {
                    //         resolve(new Float32Array(buffer));
                    //     })
                    //     .catch(reject);
                    // getCachedFile(this.BASE_URL + 'image-embeddings_25k-512-32bit.bin')
                    //     .then((buffer) => {
                    //         resolve(new Float32Array(buffer));
                    //     })
                    //     .catch(reject);
                }
            )
        }

        return Promise.all([this.tokenizer, this.text_model, this.metadata, this.embeddings]);
    }
}

function argMax(array) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

function cosineSimilarity(query_embeds, database_embeds, K) {
    const numDB = database_embeds.length / EMBED_DIM;
    const similarityScores = new Array(numDB);

    for (let i = 0; i < numDB; ++i) {
        const startOffset = i * EMBED_DIM;
        const dbVector = database_embeds.slice(startOffset, startOffset + EMBED_DIM);

        let dotProduct = 0;
        let normEmbeds = 0;
        let normDB = 0;

        for (let j = 0; j < EMBED_DIM; ++j) {
            const embedValue = query_embeds[j];
            const dbValue = dbVector[j];

            dotProduct += embedValue * dbValue;
            normEmbeds += embedValue * embedValue;
            normDB += dbValue * dbValue;
        }

        similarityScores[i] = dotProduct / (Math.sqrt(normEmbeds) * Math.sqrt(normDB));
    }
    const maxScore = argMax(similarityScores);
    // return { maxScore, similarityScores };
    return similarityScores;
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    // Get the tokenizer, model, metadata, and embeddings. When called for the first time,
    // this will load the files and cache them for future use.
    const [tokenizer, text_model, metadata, embeddings] = await ApplicationSingleton.getInstance(self.postMessage);

    // const data = embeddings.map((vector, i) => ({
    //     id: String(i),
    //     title: String(i),
    //     url: `/path/${i}`,
    //     embeddings: vector,
    // }));
    // const resource = { embeddings: data };
    // const { Voy } = await import("voy-search");
    // const voy = new Voy(resource);

    // Send the output back to the main thread
    self.postMessage({ status: 'ready' });

    // // Run tokenization
    const text_inputs = tokenizer(event.data.text, { padding: true, truncation: true });
    // const text_inputs = tokenizer("yellow cat on a bench", { padding: true, truncation: true });
    //
    // // Compute embeddings
    const { text_embeds } = await text_model(text_inputs);
    // console.log(JSON.stringify(Object.keys(text_embeds.data).reduce((acc, curr)=>[...acc, text_embeds.data[curr]], [])))

    // const clusters = await voy.search(text_embeds, 3)
    const clusters = await fetch("https://permaweb.ar/mem/mock-contract", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({embedding: text_embeds})
    }).then(r => r.json())
    console.log(clusters)
    const results1 = await gqlSearch({
        tags: [
            // {name: "Search-Key", value: "ABCDEFG"},
            {name: "Protocol", values: ["image-search"]},
            {name: "Search-Key", values: clusters},
        ]
    });
    const results2 = await gqlSearch({
        tags: [
            // {name: "Search-Key", value: "ABCDEFG"},
            {name: "Title", values: event.data.text, match: "FUZZY_OR"},
            {name: "Content-Type", values: "image/", match: "FUZZY_AND"},
        ]
    });
    let results = []
    if(results1) {
        results = [...results, ...results1];
    }
    if(results2) {
        results = [...results, ...results2]
    }


    // Compute similarity scores
    const scores = cosineSimilarity(text_embeds.data, embeddings);

    // Make a copy of the metadata
    let output = new Array(embeddings.length);//metadata.slice(0);
    scores.forEach((s, idx) => {
        output[i] = {score: s, id: String(idx)}
    })
    // // Add scores to output
    // for (let i = 0; i < metadata.length; ++i) {
    //     output[i].score = scores[i];
    // }
    //
    // Sort by score
    output.sort((a, b) => b.score - a.score);
    //
    // Get top 3 results
    output = output.slice(0, 3);
    console.log(output);

    // Send the output back to the main thread
    self.postMessage({
        status: 'complete',
        output: output,
        results: results
    });
});
