const branchCodes = {
  Titilagarh: 'TLG',
  Rajkhariar: 'KHR',
  Sonepur: 'SPR',
  Khariar: 'KHR',
  Titlagarh: 'TLG',
  'Khariar Road': 'KHR'
};

const validBranches = ['Titilagarh', 'Rajkhariar', 'Sonepur'];

const branchAliases = {
  balangir: 'Titilagarh',
  titlagarh: 'Titilagarh',
  khariar: 'Rajkhariar',
  'khariar road': 'Rajkhariar',
  sonepur: 'Sonepur',
  subarnapur: 'Sonepur'
};

const normalizeBranch = (branch) => {
  if (!branch) return branch;
  const key = branch.trim().toLowerCase();
  if (branchAliases[key]) return branchAliases[key];
  const exact = validBranches.find(b => b.toLowerCase() === key);
  return exact || branch.trim();
};

const getBranchCode = (branch) => {
  const normalized = normalizeBranch(branch);
  return branchCodes[normalized] || 'TLG';
};

module.exports = { branchCodes, validBranches, normalizeBranch, getBranchCode };
