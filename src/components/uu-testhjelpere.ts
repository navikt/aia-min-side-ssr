import { expect } from 'storybook/test';

type StoryUserEvent = {
  tab: (options?: { shift?: boolean }) => Promise<void>;
  keyboard: (keys: string) => Promise<void>;
};

export async function kontrollerTastaturOgTeksttilpasning(
  canvasElement: HTMLElement,
  userEvent: StoryUserEvent,
  forventedeLenkenavn: (string | RegExp)[],
  beholdTilpasning = false,
) {
  const document = canvasElement.ownerDocument;
  const window = document.defaultView;
  if (!window) throw new Error('Storyen må kjøre i en nettleser');
  const root = document.documentElement;
  const rootStyleBefore = root.style.cssText;
  const canvasStyleBefore = canvasElement.style.cssText;
  const elementStylesBefore = Array.from(
    canvasElement.querySelectorAll<HTMLElement>('*'),
    (element) => [element, element.style.cssText] as const,
  );

  const lenker = Array.from(canvasElement.querySelectorAll<HTMLAnchorElement>('a[href]'));
  expect(lenker).toHaveLength(forventedeLenkenavn.length);
  for (const [index, navn] of forventedeLenkenavn.entries()) {
    expect(lenker[index]).toHaveAccessibleName(navn);
  }
  for (const ikon of canvasElement.querySelectorAll('svg')) {
    expect(ikon).toHaveAttribute('aria-hidden', 'true');
    expect(ikon).toHaveAttribute('focusable', 'false');
    expect(ikon.querySelector('title')).not.toBeInTheDocument();
  }
  for (const lenke of lenker) {
    const bounds = lenke.getBoundingClientRect();
    expect(bounds.width).toBeGreaterThanOrEqual(24);
    expect(bounds.height).toBeGreaterThanOrEqual(24);
    expect(lenke.querySelector('a[href], button, input, select, textarea, [role="link"], [role="button"]')).toBeNull();
  }

  document.activeElement instanceof HTMLElement && document.activeElement.blur();
  for (const lenke of lenker) {
    await userEvent.tab();
    expect(lenke).toHaveFocus();
    expect(lenke.matches(':focus-visible')).toBe(true);
    const focusStyle = window.getComputedStyle(lenke);
    expect(focusStyle.outlineStyle).not.toBe('none');
    expect(Number.parseFloat(focusStyle.outlineWidth)).toBeGreaterThan(0);
  }
  for (let index = lenker.length - 2; index >= 0; index -= 1) {
    await userEvent.tab({ shift: true });
    expect(lenker[index]).toHaveFocus();
  }

  try {
    const opprinneligUrl = window.location.href;
    for (const lenke of lenker) {
      let klikk: MouseEvent | undefined;
      const avbrytNavigasjon = (event: MouseEvent) => {
        event.preventDefault();
        klikk = event;
      };
      lenke.addEventListener('click', avbrytNavigasjon, true);
      try {
        lenke.focus();
        await userEvent.keyboard('{Enter}');
        expect(klikk).toBeDefined();
        expect(klikk?.defaultPrevented).toBe(true);
        expect(window.location.href).toBe(opprinneligUrl);
      } finally {
        lenke.removeEventListener('click', avbrytNavigasjon, true);
      }
    }

    canvasElement.style.boxSizing = 'border-box';
    canvasElement.style.width = '320px';
    canvasElement.style.maxWidth = 'none';
    const canvasBounds = canvasElement.getBoundingClientRect();
    expect(canvasBounds.width).toBeCloseTo(320, 0);
    expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
    for (const element of [...lenker, ...canvasElement.querySelectorAll<HTMLElement>('h1, h2, h3, p')]) {
      const bounds = element.getBoundingClientRect();
      expect(bounds.left).toBeGreaterThanOrEqual(canvasBounds.left - 1);
      expect(bounds.right).toBeLessThanOrEqual(canvasBounds.right + 1);
      expect(bounds.top).toBeGreaterThanOrEqual(canvasBounds.top - 1);
      expect(bounds.bottom).toBeLessThanOrEqual(canvasBounds.bottom + 1);
      expect(bounds.height).toBeGreaterThan(0);
    }

    canvasElement.style.cssText = canvasStyleBefore;

    const textElementer = canvasElement.querySelectorAll<HTMLElement>('a, h1, h2, h3, p');
    expect(canvasElement.querySelectorAll('p').length).toBeGreaterThan(0);
    for (const element of textElementer) {
      element.style.lineHeight = '1.5';
      element.style.letterSpacing = '0.12em';
      element.style.wordSpacing = '0.16em';
      if (element.tagName === 'P') element.style.marginBottom = '2em';
    }

    const rootFontSizeBefore = Number.parseFloat(window.getComputedStyle(root).fontSize);
    root.style.fontSize = `${rootFontSizeBefore * 2}px`;
    const rootFontSizeAfter = Number.parseFloat(window.getComputedStyle(root).fontSize);
    expect(rootFontSizeAfter / rootFontSizeBefore).toBeCloseTo(2, 2);

    for (const element of textElementer) {
      const style = window.getComputedStyle(element);
      const fontSize = Number.parseFloat(style.fontSize);
      expect(Number.parseFloat(style.lineHeight) / fontSize).toBeCloseTo(1.5, 2);
      expect(Number.parseFloat(style.letterSpacing) / fontSize).toBeCloseTo(0.12, 2);
      expect(Number.parseFloat(style.wordSpacing) / fontSize).toBeCloseTo(0.16, 2);
      if (element.tagName === 'P') {
        expect(Number.parseFloat(style.marginBottom) / fontSize).toBeCloseTo(2, 2);
      }
    }

    expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
    const enlargedCanvasBounds = canvasElement.getBoundingClientRect();
    for (const element of [...lenker, ...canvasElement.querySelectorAll<HTMLElement>('h1, h2, h3, p')]) {
      const bounds = element.getBoundingClientRect();
      expect(bounds.left).toBeGreaterThanOrEqual(enlargedCanvasBounds.left - 1);
      expect(bounds.right).toBeLessThanOrEqual(enlargedCanvasBounds.right + 1);
      expect(bounds.top).toBeGreaterThanOrEqual(enlargedCanvasBounds.top - 1);
      expect(bounds.bottom).toBeLessThanOrEqual(enlargedCanvasBounds.bottom + 1);
      expect(bounds.height).toBeGreaterThan(0);
    }
  } finally {
    if (!beholdTilpasning) {
      root.style.cssText = rootStyleBefore;
      canvasElement.style.cssText = canvasStyleBefore;
      for (const [element, style] of elementStylesBefore) element.style.cssText = style;
    }
  }
}
