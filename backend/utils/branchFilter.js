const getBranchFilter = (req, field = 'branch') => {
  if (req.admin.role === 'superadmin') {
    if (req.query.branch) {
      return { [field]: req.query.branch };
    }
    return {};
  }
  return { [field]: req.admin.branch };
};

const setBranchIfNeeded = (req, data) => {
  if (req.admin.role === 'branch_admin') {
    data.branch = req.admin.branch;
  }
  return data;
};

module.exports = { getBranchFilter, setBranchIfNeeded };
