/**
 * @generated SignedSource<<e0278942bd5985b0087655bd08cbced5>>
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
export type pharmaceuticalQuery$variables = {
  search: PharmaceuticalSearch;
};
export type pharmaceuticalQuery$data = {
  readonly pharmaceutical: {
    readonly ingredients: ReadonlyArray<{
      readonly ingredient: string;
      readonly pharmaceuticals: ReadonlyArray<{
        readonly brandGeneric: string | null | undefined;
        readonly brandGenericWithGeneric: string | null | undefined;
        readonly category: string | null | undefined;
        readonly eligibleGeneric: string | null | undefined;
        readonly expiraryDate: string | null | undefined;
        readonly ingredient: string | null | undefined;
        readonly manufacturer: string | null | undefined;
        readonly previousePrice: number | null | undefined;
        readonly price: number | null | undefined;
        readonly product: string | null | undefined;
        readonly remarks: string | null | undefined;
        readonly specification: string | null | undefined;
      }>;
    }>;
  };
};
export type pharmaceuticalQuery = {
  response: pharmaceuticalQuery$data;
  variables: pharmaceuticalQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "search"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ingredient",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "search",
        "variableName": "search"
      }
    ],
    "concreteType": "IngredientList",
    "kind": "LinkedField",
    "name": "pharmaceutical",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Ingredient",
        "kind": "LinkedField",
        "name": "ingredients",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Pharmaceutical",
            "kind": "LinkedField",
            "name": "pharmaceuticals",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "category",
                "storageKey": null
              },
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "specification",
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
                "name": "manufacturer",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "eligibleGeneric",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "brandGeneric",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "brandGenericWithGeneric",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "price",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "previousePrice",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "expiraryDate",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "remarks",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
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
    "name": "pharmaceuticalQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "pharmaceuticalQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "9388ce47a7ab3b28a9dcbd94f8e753ca",
    "id": null,
    "metadata": {},
    "name": "pharmaceuticalQuery",
    "operationKind": "query",
    "text": "query pharmaceuticalQuery(\n  $search: PharmaceuticalSearch!\n) {\n  pharmaceutical(search: $search) {\n    ingredients {\n      ingredient\n      pharmaceuticals {\n        category\n        ingredient\n        specification\n        product\n        manufacturer\n        eligibleGeneric\n        brandGeneric\n        brandGenericWithGeneric\n        price\n        previousePrice\n        expiraryDate\n        remarks\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "94b6f5a5d608d6368b09d7195b0233ca";

export default node;
