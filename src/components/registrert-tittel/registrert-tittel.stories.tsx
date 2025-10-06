import type { Meta, StoryObj } from "@storybook/react-vite";
import opplysningerOmArbeidssokerMock from "../../mocks/opplysninger-om-arbeidssoker-mock";
import RegistrertTittel from "./registrert-tittel";

const meta = {
  title: "Komponenter/RegistrertTittel",
  component: RegistrertTittel,
  args: {},
  tags: ["autodocs"],
} satisfies Meta<typeof RegistrertTittel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RegistreringsTittelAktivArbeidssokerStory: Story = {
  args: {
    sprak: "nb",
    harAktivArbeidssokerperiode: true,
    opplysningerOmArbeidssoker: opplysningerOmArbeidssokerMock as any,
  },
};

export const RegistreringsTittelIkkeAktivArbeidssokerStory: Story = {
  args: {
    sprak: "nb",
    harAktivArbeidssokerperiode: false,
    opplysningerOmArbeidssoker: opplysningerOmArbeidssokerMock as any,
  },
};
