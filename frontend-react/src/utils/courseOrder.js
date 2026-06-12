const COURSE_ORDER = [
  ['dca', 'dca001', 'diplomaincomputerapplication'],
  ['adca', 'adca001', 'advancediplomaincomputerapplication', 'advanceddiplomaincomputerapplication'],
  ['pgdca', 'pgdca001', 'postgraduationincomputerapplication', 'postgraduatediplomaincomputerapplication'],
  ['officepackage', 'office001'],
  ['tally', 'tallyprimegst', 'tallygst001'],
  ['photoshop', 'ps001'],
  ['cttc', 'cttc001', 'computerteachertrainingcourse'],
  ['java', 'java001'],
  ['python', 'python001'],
];

const ORDER_LOOKUP = COURSE_ORDER.reduce((lookup, aliases, index) => {
  aliases.forEach((alias) => {
    lookup[alias] = index;
  });
  return lookup;
}, {});

const normalize = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9]/g, '');

const getCourseOrder = (course) => {
  const candidates = [
    course?._id,
    course?.code,
    course?.name,
    course?.category,
  ].map(normalize);

  const exactMatch = candidates.find((candidate) => ORDER_LOOKUP[candidate] !== undefined);
  if (exactMatch) return ORDER_LOOKUP[exactMatch];

  const partialMatch = COURSE_ORDER.findIndex((aliases) => (
    candidates.some((candidate) => aliases.some((alias) => candidate.includes(alias)))
  ));

  return partialMatch === -1 ? COURSE_ORDER.length : partialMatch;
};

export const sortCoursesByPreferredOrder = (courses = []) => (
  [...courses].sort((first, second) => getCourseOrder(first) - getCourseOrder(second))
);
