module.exports = {
  'extends': 'stylelint-config-standard',
  'rules': {
    'block-no-empty': null,
    'color-no-invalid-hex': true,
    'declaration-colon-space-after': 'always',
    'max-empty-lines': 2,
    'number-leading-zero': false,
    // "function-calc-no-invalid": true,
    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: ['host', 'global'],
    }],
    // 'unit-whitelist': ['em', 'rem', '%', 's'],
  },
};
