export default function compose(requests = [], options = {}) {
  const { terminateOnFail = false } = options;

  const results = [];

  function iterate(request, index) {
    console.log("iterating, index", index);

    return new Promise((resolve, reject) => {
      request([...results]).then(
        res => {
          results.push(res);
          resolve();
        },
        // Todo: reject this to end the chain early?
        err => {
          results.push(err);

          resolve();
        }
      );
    }).then(() => {
      if (index < requests.length - 1) {
        const nextRequest = requests[index + 1];
        console.log("returning the next iteration");

        return iterate(nextRequest, index + 1);
      } else {
        console.log("returning the results");
        return Promise.resolve([...results]);
      }
    });
  }

  return iterate(requests[0], 0);
}
