export enum IconCatalog {
  cursorPointer = 'cursor-pointer',
  logout = 'logout',
  moon = 'moon',
  navArrowRight = 'nav-arrow-right',
  pcMouse = 'pc-mouse',
  trashCan = 'trash-can',
  sun = 'sun',
  xMark = 'x-mark',
}

interface IconType {
  outline: string;
  solid?: string;
}

export const Icons: Record<IconCatalog, IconType> = {
  [IconCatalog.cursorPointer]: {
    outline:
      'M19.503 9.97c1.204.489 1.112 2.224-.137 2.583l-6.306 1.813-2.88 5.895c-.57 1.168-2.295.957-2.568-.314L4.677 6.257A1.369 1.369 0 0 1 6.53 4.7L19.503 9.97Z',
  },
  [IconCatalog.logout]: {
    outline: 'M12 12h7m0 0-3 3m3-3-3-3M19 6V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1',
  },
  [IconCatalog.moon]: {
    outline: 'M3 11.507a9.493 9.493 0 0 0 18 4.219c-8.507 0-12.726-4.22-12.726-12.726A9.494 9.494 0 0 0 3 11.507Z',
  },
  [IconCatalog.navArrowRight]: {
    outline: 'm9 6 6 6-6 6',
  },
  [IconCatalog.pcMouse]: {
    outline: 'M12 2v0a8 8 0 0 1 8 8v4a8 8 0 0 1-8 8v0a8 8 0 0 1-8-8v-4a8 8 0 0 1 8-8v0Zm0 0v7',
  },
  [IconCatalog.trashCan]: {
    outline:
      'm20 9-1.995 11.346A2 2 0 0 1 16.035 22h-8.07a2 2 0 0 1-1.97-1.654L4 9M21 6h-5.625M3 6h5.625m0 0V4a2 2 0 0 1 2-2h2.75a2 2 0 0 1 2 2v2m-6.75 0h6.75',
  },
  [IconCatalog.sun]: {
    outline:
      'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM22 12h1M12 2V1M12 23v-1M20 20l-1-1M20 4l-1 1M4 20l1-1M4 4l1 1M1 12h1',
  },

  [IconCatalog.xMark]: { outline: 'M6.758 17.243 12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243' },
};
