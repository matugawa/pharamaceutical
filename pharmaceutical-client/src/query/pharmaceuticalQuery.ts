import { graphql, fetchQuery } from "react-relay";
import environment from "../relay.env";
import {pharmaceuticalQuery$variables, pharmaceuticalQuery$data} from "./__generated__/pharmaceuticalQuery.graphql"

const query = graphql`
  query pharmaceuticalQuery($search: PharmaceuticalSearch!) {
    pharmaceutical(search: $search) {
      ingredients {
        ingredient
        pharmaceuticals {
          category
          ingredient
          specification
          product
          manufacturer
          eligibleGeneric
          brandGeneric
          brandGenericWithGeneric
          price
          previousePrice
          expiraryDate
          remarks
        }
      }
    }
  }
`;

type Params = {
  input: pharmaceuticalQuery$variables;
  onStart?: () => void;
  onNext?: () => void;
  onComplete?: (result: pharmaceuticalQuery$data["pharmaceutical"]) => void;
  onError?: () => void;
};

export const getPharmaceutical = ({
  input,
  onStart,
  onNext,
  onComplete,
  onError,
}: Params) => {
  let result: pharmaceuticalQuery$data["pharmaceutical"] = { ingredients: [] };
  fetchQuery(environment, query, input).subscribe({
    start: () => {
      if (onStart) onStart();
    },
    next: (data: any) => {
      result = data.pharmaceutical;
      if (onNext) onNext();
    },
    complete: () => {
      if (onComplete) onComplete(result);
    },
    error: () => {
      if (onError) onError();
    },
  });
};
