/**
 * @generated SignedSource<<7ed7ce8267b824ac24ff100f31562fd2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type PharmaceuticalSearch = {
  category?: string | null | undefined;
  pharmaceuticalName: string;
  specification?: string | null | undefined;
};
export type AppQuery$variables = {
  search: PharmaceuticalSearch;
};
export type AppQuery$data = {
  readonly pharmaceutical: ReadonlyArray<{
    readonly category: string | null | undefined;
    readonly price: number | null | undefined;
    readonly product: string | null | undefined;
  }>;
};
export type AppQuery = {
  response: AppQuery$data;
  variables: AppQuery$variables;
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
    "name": "AppQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AppQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5d7de1f80f45b722c8303aa0ab7e4c7d",
    "id": null,
    "metadata": {},
    "name": "AppQuery",
    "operationKind": "query",
    "text": "query AppQuery(\n  $search: PharmaceuticalSearch!\n) {\n  pharmaceutical(search: $search) {\n    category\n    product\n    price\n  }\n}\n"
  }
};
})();

(node as any).hash = "aa658caa39638dbad10506b517693045";

export default node;
