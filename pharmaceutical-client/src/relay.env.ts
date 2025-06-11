import {
  Environment,
  Network,
  RecordSource,
  RequestParameters,
  Store,
  Variables,
} from "relay-runtime";

// deploy
// const url = "https://okusuri-info.com/api/graphql";
// dev
// const url = "/graphql";
const url = import.meta.env.VITE_GRAPHQL_URL;
console.log("url", url);

async function runQuery(operation: RequestParameters, variables: Variables) {
  console.log("fetch....");
  return (
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    })
      // .then(res=>res.json())
      .then((res) => {
        return res.text().then((text) => {
          console.log("Raw response:", text);
          return JSON.parse(text);
        });
      })
      .then((data) => {
        console.log("GraphQL resonse", data);
        return data;
      })
      .catch((err) => {
        console.error("fetch error", err);
      })
  );
}

const environment = new Environment({
  network: Network.create(runQuery),
  store: new Store(new RecordSource()),
});

export default environment;
