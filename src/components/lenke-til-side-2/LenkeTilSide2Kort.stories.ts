import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { aktivPeriode, avsluttetPeriode, side2Url } from '../storybook-testdata';
import LenkeTilSide2Kort from './LenkeTilSide2Kort';

const meta = {
  title: 'Komponenter/LenkeTilSide2Kort',
  component: LenkeTilSide2Kort,
  tags: ['autodocs'],
  args: {
    sprak: 'nb',
    aggregertPeriode: aktivPeriode,
    harTilgjengeligBekreftelse: false,
    side2Url,
  },
} satisfies Meta<typeof LenkeTilSide2Kort>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AktivArbeidssoker: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er registrert som arbeidssøker' })).toBeVisible();
    await expect(canvas.getByText(/Registrert dato: 22\. desember.*sist bekreftet: 22\. desember/)).toBeVisible();
    await expect(canvas.getByRole('link')).toHaveAttribute('href', side2Url);
    await expect(canvas.getAllByRole('link')).toHaveLength(1);
  },
};

export const AktivArbeidssokerMedTilgjengeligBekreftelse: Story = {
  args: { harTilgjengeligBekreftelse: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: /Bekreft at du vil være registrert/ })).toHaveAttribute(
      'href',
      `${side2Url}/bekreftelse`,
    );
  },
};

export const IkkeAktivArbeidssoker: Story = {
  args: { aggregertPeriode: avsluttetPeriode },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er ikke registrert som arbeidssøker' })).toBeVisible();
    await expect(canvas.getByText(/Du var registrert fra 22\. desember.*til\s+15\. januar/)).toBeVisible();
    await expect(canvas.getByText('Se tidligere opplysninger')).toBeVisible();
  },
};

export const UtenSisteBekreftelse: Story = {
  args: { aggregertPeriode: { ...aktivPeriode, bekreftelse: undefined } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Registrert dato: 22\. desember/)).toBeVisible();
    await expect(canvas.queryByText(/sist bekreftet/)).not.toBeInTheDocument();
  },
};

export const Nynorsk: Story = {
  args: { sprak: 'nn', harTilgjengeligBekreftelse: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er registrert som arbeidssøkjar' })).toBeVisible();
    await expect(canvas.getByText('Sjå og endre opplysningar')).toBeVisible();
    await expect(canvas.getByText(/Registrert dato: 22\. desember.*sist stadfesta: 22\. desember/)).toBeVisible();
    await expect(canvas.getByRole('link', { name: /Du er registrert/ })).toHaveAttribute('href', `${side2Url}/nn`);
    await expect(canvas.getByRole('link', { name: /Stadfest at du vil vera registrert/ })).toHaveAttribute(
      'href',
      `${side2Url}/nn/bekreftelse`,
    );
  },
};

export const Engelsk: Story = {
  args: { sprak: 'en', harTilgjengeligBekreftelse: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'You are registered as job seeker' })).toBeVisible();
    await expect(canvas.getByText('View and change answers from registration')).toBeVisible();
    await expect(canvas.getByText(/Registered: December 22\..*last confirmed: December 22\./)).toBeVisible();
    await expect(canvas.getByRole('link', { name: /You are registered/ })).toHaveAttribute('href', `${side2Url}/en`);
    await expect(canvas.getByRole('link', { name: /Confirm that you want to be registered/ })).toHaveAttribute(
      'href',
      `${side2Url}/en/bekreftelse`,
    );
  },
};
