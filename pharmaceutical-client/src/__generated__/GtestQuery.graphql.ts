/**
 * @generated SignedSource<<d4cac22738fdbb7222db36c345926c75>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type PharmaceuticalSearch = {
  category?: string | null | undefined;
  searchName: string;
  specification?: string | null | undefined;
};
export type GtestQuery$variables = {
  search: PharmaceuticalSearch;
};
export type GtestQuery$data = {
  readonly pharmaceutical: ReadonlyArray<{
    readonly category: string | null | undefined;
    readonly price: number | null | undefined;
    readonly product: string | null | undefined;
  }>;
};
export type GtestQuery = {
  response: GtestQuery$data;
  variables: GtestQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "search"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "search",
        "variableName": "search"
      }
    ],
    "concreteType": "Pharmaceutical",
    "kind": "LinkedField",
    "name": "pharmaceutical",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "category",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "product",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "price",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GtestQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GtestQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "3e93b8f2db04e929156ac0bbf9606ad7",
    "id": null,
    "metadata": {},
    "name": "GtestQuery",
    "operationKind": "query",
    "text": "query GtestQuery(\n  $search: PharmaceuticalSearch!\n) {\n  pharmaceutical(search: $search) {\n    category\n    product\n    price\n  }\n}\n"
  }
};
})();

(node as any).hash = "14c925a74eeac52743ad7430bb04063b";

export default node;
