import type { Meta, StoryObj } from "@storybook/react-vite";
import { aggregertePerioderMock } from "../../mocks/aggregerte-perioder-mock";
import LenkeTilSide2Kort from "./LenkeTilSide2Kort";

const meta = {
  title: "Komponenter/LenkeTilSide2Kort",
  component: LenkeTilSide2Kort,
  decorators: [],
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof LenkeTilSide2Kort>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AktivArbeidssokerMedTilgjengeligBekreftelse: Story = {
  args: {
    sprak: "nb",
    aggregertPeriode: aggregertePerioderMock[0],
    harTilgjengeligBekreftelse: true,
    side2Url: "http://localhost:3000/arbeidssoekerregisteret",
  },
};

export const AktivArbeidssoker: Story = {
  args: {
    sprak: "nb",
    aggregertPeriode: aggregertePerioderMock[0],
    harTilgjengeligBekreftelse: false,
    side2Url: "http://localhost:3000/arbeidssoekerregisteret",
  },
};

export const IkkeAktivArbeidssoker: Story = {
  args: {
    sprak: "nb",
    aggregertPeriode: aggregertePerioderMock[1],
    harTilgjengeligBekreftelse: false,
    side2Url: "http://localhost:3000/arbeidssoekerregisteret",
  },
};
