import { useId } from "react";

export const SokerJobbIkon = () => {
  const id = useId();
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Jobbsøker ikon</title>
      <g clip-path={`url(${id})`}>
        <path
          d="M38 24C38 16.268 31.732 10 24 10C16.268 10 10 16.268 10 24C10 31.732 16.268 38 24 38"
          stroke="#CCE2F0"
          stroke-width="6"
          stroke-linecap="round"
        />
        <path
          d="M0.75 31.5C0.75 30.8096 1.30964 30.25 2 30.25H26C26.6904 30.25 27.25 30.8096 27.25 31.5V36.5C27.25 37.7426 26.2426 38.75 25 38.75H3C1.75736 38.75 0.75 37.7426 0.75 36.5V31.5Z"
          stroke="#23262A"
          stroke-width="1.5"
          stroke-miterlimit="16"
          stroke-linejoin="round"
        />
        <path
          d="M2.25 39C2.25 38.8619 2.36193 38.75 2.5 38.75H25.5C25.6381 38.75 25.75 38.8619 25.75 39V45C25.75 46.2426 24.7426 47.25 23.5 47.25H4.5C3.25736 47.25 2.25 46.2426 2.25 45V39Z"
          stroke="#23262A"
          stroke-width="1.5"
        />
        <path
          d="M10.25 28.4286C10.25 26.9492 11.4492 25.75 12.9286 25.75H15.0714C16.5508 25.75 17.75 26.9492 17.75 28.4286C17.75 29.4345 16.9345 30.25 15.9286 30.25H12.0714C11.0655 30.25 10.25 29.4345 10.25 28.4286Z"
          stroke="#23262A"
          stroke-width="1.5"
        />
        <path d="M14 36.5L14 40.5" stroke="#23262A" stroke-width="1.5" stroke-linecap="round" />
        <circle cx="43" cy="5" r="4.25" stroke="#23262A" stroke-width="1.5" />
        <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 35 4)" stroke="#23262A" stroke-width="1.5" />
        <circle cx="29" cy="5" r="4.25" stroke="#23262A" stroke-width="1.5" />
        <path
          d="M32.6821 4C33.6324 3.36815 34.7732 3 35.9999 3C37.2267 3 38.3674 3.36815 39.3177 4"
          stroke="#23262A"
          stroke-width="1.5"
        />
      </g>
      <defs>
        <clipPath id={id}>
          <rect width="48" height="48" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
