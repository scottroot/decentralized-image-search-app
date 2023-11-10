export async function handle(state, action) {
  const input = action.input;

  function cosineSimilarity(A,B){
      let dp = 0;
      let a = 0;
      let b = 0;
      for(let i = 0; i < A.length; i++){
          dp += (A[i] * B[i]);
          a += (A[i]*A[i]);
          b += (B[i]*B[i]);
      }
      a = Math.sqrt(a);
      b = Math.sqrt(b);
      return (dp)/(a * b)
  }

  function normalizeL2(array, axis = -1, order = 2) {
      const squares = array.map(r => r.map(v => Math.pow(Math.abs(v), order)));
      const sums = squares.reduce((acc, curr) => curr.map((v, i) => acc[i] + v), Array(array[0].length).fill(0));
      const norms = sums.map(v => Math.pow(v, 1 / order));
      const norm = norms.map(v => (v === 0 ? 1 : v));
      return array.map(r => r.map(v => v / norm));
  }

  if (input.function === "closestPoint") {
    /**
     * @param {number[]} vector - Embedding vector with 768 points
     */
    let result = -1;
    if (input.data.vector.length === 768) {
      const inputVector = normalizeL2(input.data.vector);

      let maxSim = 0;
      for(let i = 0; i < state.points.length; i++){
        const sim = cosineSimilarity(state.point[i], inputVector);
        if (sim > maxSim) {
          maxSim = sim;
          result = i;
        }
      }
    }

    return { result };
  }

  if (input.function === "addPoint") {
    /**
     * @param {number[]} vector - Embedding vector with 768 points
     */

    const points = state.points || [];
    if (input.data.vector.length === 768) {
      points.push(input.data.vector)
      return { state: { points } }
    }
  }

  return { state }
}