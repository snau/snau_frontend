module.exports = {
  safelist: ['col-span-4', 'col-span-8', 'col-span-12'],
  theme: {
    extend: {
      transitionProperty: {
        backdrop: 'backdrop-filter',
      },
      transitionTimingFunction: {
        'in-out-expo': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
}
