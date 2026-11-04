import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { aktivPeriode, avsluttetPeriode, permittertPeriode, side2Url } from '../storybook-testdata';
import { kontrollerTastaturOgTeksttilpasning } from '../uu-testhjelpere';
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
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er registrert som arbeidssøker' })).toBeVisible();
    await expect(canvas.getByText(/Registrert dato: 22\. desember.*sist bekreftet: 22\. desember/)).toBeVisible();
    await expect(canvas.getByRole('link')).toHaveAttribute('href', side2Url);
    await expect(canvas.getAllByRole('link')).toHaveLength(1);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [/^Du er registrert som arbeidssøker/]);
  },
};

export const AktivArbeidssokerMedTilgjengeligBekreftelse: Story = {
  args: { harTilgjengeligBekreftelse: true },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(
      canvas.getByRole('link', { name: 'Bekreft at du vil være registrert som arbeidssøker hos Nav' }),
    ).toHaveAttribute('href', `${side2Url}/bekreftelse`);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [
      /^Du er registrert som arbeidssøker/,
      'Bekreft at du vil være registrert som arbeidssøker hos Nav',
    ]);
  },
};

export const IkkeAktivArbeidssoker: Story = {
  args: { aggregertPeriode: avsluttetPeriode },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er ikke registrert som arbeidssøker' })).toBeVisible();
    await expect(canvas.getByText(/Du var registrert fra 22\. desember.*til\s+15\. januar/)).toBeVisible();
    await expect(canvas.getByText('Se tidligere opplysninger')).toBeVisible();
    await expect(canvas.getByRole('link')).toHaveAttribute('href', side2Url);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [/^Du er ikke registrert som arbeidssøker/]);
  },
};

export const UtenSisteBekreftelse: Story = {
  args: { aggregertPeriode: { ...aktivPeriode, bekreftelse: undefined } },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByText(/Registrert dato: 22\. desember/)).toBeVisible();
    await expect(canvas.queryByText(/sist bekreftet/)).not.toBeInTheDocument();
    await expect(canvas.getByRole('link')).toHaveAttribute('href', side2Url);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [/^Du er registrert som arbeidssøker/]);
  },
};

export const Nynorsk: Story = {
  args: { sprak: 'nn', harTilgjengeligBekreftelse: true },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er registrert som arbeidssøkjar' })).toBeVisible();
    await expect(canvas.getByText('Sjå og endre opplysningar')).toBeVisible();
    await expect(canvas.getByText(/Registrert dato: 22\. desember.*sist stadfesta: 22\. desember/)).toBeVisible();
    await expect(canvas.getByRole('link', { name: /Du er registrert/ })).toHaveAttribute('href', `${side2Url}/nn`);
    await expect(
      canvas.getByRole('link', { name: 'Stadfest at du vil vera registrert som arbeidssøkjar hos Nav' }),
    ).toHaveAttribute('href', `${side2Url}/nn/bekreftelse`);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [
      /^Du er registrert som arbeidssøkjar/,
      'Stadfest at du vil vera registrert som arbeidssøkjar hos Nav',
    ]);
  },
};

export const Engelsk: Story = {
  args: { sprak: 'en', harTilgjengeligBekreftelse: true },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'You are registered as job seeker' })).toBeVisible();
    await expect(canvas.getByText('View and change answers from registration')).toBeVisible();
    await expect(canvas.getByText(/Registered: December 22\..*last confirmed: December 22\./)).toBeVisible();
    await expect(canvas.getByRole('link', { name: /You are registered/ })).toHaveAttribute('href', `${side2Url}/en`);
    await expect(
      canvas.getByRole('link', { name: 'Confirm that you want to be registered as a jobseeker with Nav' }),
    ).toHaveAttribute('href', `${side2Url}/en/bekreftelse`);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [
      /^You are registered as job seeker/,
      'Confirm that you want to be registered as a jobseeker with Nav',
    ]);
  },
};

export const BekreftelseTekstforstorringNb: Story = {
  args: { harTilgjengeligBekreftelse: true },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er registrert som arbeidssøker' })).toBeVisible();
    await kontrollerTastaturOgTeksttilpasning(
      canvasElement,
      userEvent,
      [/^Du er registrert som arbeidssøker/, 'Bekreft at du vil være registrert som arbeidssøker hos Nav'],
      true,
    );
  },
};

export const BekreftelseTekstforstorringNn: Story = {
  args: { sprak: 'nn', harTilgjengeligBekreftelse: true },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er registrert som arbeidssøkjar' })).toBeVisible();
    await kontrollerTastaturOgTeksttilpasning(
      canvasElement,
      userEvent,
      [/^Du er registrert som arbeidssøkjar/, 'Stadfest at du vil vera registrert som arbeidssøkjar hos Nav'],
      true,
    );
  },
};

export const BekreftelseTekstforstorringEn: Story = {
  args: { sprak: 'en', harTilgjengeligBekreftelse: true },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'You are registered as job seeker' })).toBeVisible();
    await kontrollerTastaturOgTeksttilpasning(
      canvasElement,
      userEvent,
      [/^You are registered as job seeker/, 'Confirm that you want to be registered as a jobseeker with Nav'],
      true,
    );
  },
};

export const PermittertArbeidssoker: Story = {
  args: { aggregertPeriode: permittertPeriode },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er registrert som permittert arbeidssøker' })).toBeVisible();
    await expect(canvas.getByRole('link')).toHaveAttribute('href', side2Url);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [
      /^Du er registrert som permittert arbeidssøker/,
    ]);
  },
};

export const PermittertArbeidssokjar: Story = {
  args: { sprak: 'nn', aggregertPeriode: permittertPeriode },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er registrert som permittert arbeidssøkjar' })).toBeVisible();
    await expect(canvas.getByRole('link')).toHaveAttribute('href', `${side2Url}/nn`);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [
      /^Du er registrert som permittert arbeidssøkjar/,
    ]);
  },
};

export const PermittertJobSeeker: Story = {
  args: { sprak: 'en', aggregertPeriode: permittertPeriode },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(
      canvas.getByRole('heading', { name: 'You are registered as a temporarily layed off job seeker' }),
    ).toBeVisible();
    await expect(canvas.getByRole('link')).toHaveAttribute('href', `${side2Url}/en`);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [
      /^You are registered as a temporarily layed off job seeker/,
    ]);
  },
};

export const AvsluttetPeriodeNynorsk: Story = {
  args: { sprak: 'nn', aggregertPeriode: avsluttetPeriode },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er ikkje registrert som arbeidssøkjar' })).toBeVisible();
    await expect(canvas.getByText('Sjå tidligare opplysningar')).toBeVisible();
    await expect(canvas.getByRole('link')).toHaveAttribute('href', `${side2Url}/nn`);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [/^Du er ikkje registrert som arbeidssøkjar/]);
  },
};

export const AvsluttetPeriodeEngelsk: Story = {
  args: { sprak: 'en', aggregertPeriode: avsluttetPeriode },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'You are not registered as job seeker' })).toBeVisible();
    await expect(canvas.getByText('View answers from previous registration')).toBeVisible();
    await expect(canvas.getByRole('link')).toHaveAttribute('href', `${side2Url}/en`);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [/^You are not registered as job seeker/]);
  },
};

export const UtenSisteBekreftelseNynorsk: Story = {
  args: { sprak: 'nn', aggregertPeriode: { ...aktivPeriode, bekreftelse: undefined } },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er registrert som arbeidssøkjar' })).toBeVisible();
    await expect(canvas.getByText(/Registrert dato: 22\. desember/)).toBeVisible();
    await expect(canvas.queryByText(/sist stadfesta/)).not.toBeInTheDocument();
    await expect(canvas.getByRole('link')).toHaveAttribute('href', `${side2Url}/nn`);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [/^Du er registrert som arbeidssøkjar/]);
  },
};

export const UtenSisteBekreftelseEngelsk: Story = {
  args: { sprak: 'en', aggregertPeriode: { ...aktivPeriode, bekreftelse: undefined } },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'You are registered as job seeker' })).toBeVisible();
    await expect(canvas.getByText(/Registered: December 22\./)).toBeVisible();
    await expect(canvas.queryByText(/last confirmed/)).not.toBeInTheDocument();
    await expect(canvas.getByRole('link')).toHaveAttribute('href', `${side2Url}/en`);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [/^You are registered as job seeker/]);
  },
};
