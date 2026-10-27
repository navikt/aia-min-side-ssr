import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { aktivPeriode, permittertPeriode } from '../storybook-testdata';
import RegistrertTittel from './registrert-tittel';

const meta = {
  title: 'Komponenter/RegistrertTittel',
  component: RegistrertTittel,
  args: {
    sprak: 'nb',
    harAktivArbeidssokerperiode: true,
    opplysningerOmArbeidssoker: aktivPeriode.opplysning,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RegistrertTittel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RegistreringsTittelAktivArbeidssokerStory: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Du er registrert som arbeidssøker')).toBeVisible();
  },
};

export const RegistreringsTittelIkkeAktivArbeidssokerStory: Story = {
  args: { harAktivArbeidssokerperiode: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Du er ikke registrert som arbeidssøker')).toBeVisible();
  },
};

export const Permittert: Story = {
  args: { opplysningerOmArbeidssoker: permittertPeriode.opplysning },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Du er registrert som permittert arbeidssøker')).toBeVisible();
  },
};

export const AvsluttetPermittert: Story = {
  args: { harAktivArbeidssokerperiode: false, opplysningerOmArbeidssoker: permittertPeriode.opplysning },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Du er ikke registrert som arbeidssøker')).toBeVisible();
    await expect(canvas.queryByText(/permittert/)).not.toBeInTheDocument();
  },
};

export const UtenOpplysninger: Story = {
  args: { opplysningerOmArbeidssoker: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Du er registrert som arbeidssøker')).toBeVisible();
  },
};
