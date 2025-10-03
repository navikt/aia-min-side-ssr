// If your microfrontend contains an interactive element—also called a client-side island—you may implement as
// demonstrated in the example below.

import { Button } from "@navikt/ds-react";

const ClientIsland = () => {
  return (
    <div>
      <p>Client-side button</p>
      <Button onClick={() => console.log("clicked")}>Button</Button>
    </div>
  );
};

export default ClientIsland;
