import { requestOboToken } from "@navikt/oasis";
import { isLocal } from "./environment";

const audience = `${process.env.NAIS_CLUSTER_NAME}:min-side:example-api`;

export const getOboToken = async (token: string): Promise<string> => {
  const oboResult = await requestOboToken(token, audience);

  if (isLocal) {
    return "Fake token";
  }

  if (!oboResult.ok) {
    console.error("Error getting access token: " + oboResult.error);
    throw new Error("Request oboToken for example-api failed ");
  }

  return oboResult.token;
};
