module.exports = {
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
