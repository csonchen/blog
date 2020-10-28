function dp1(n) {
  const dps = []
  dps[0] = 0
  dps[1] = 1
  dps[2] = 2
  for (let i = 3; i <= n; i++) {
    dps[i] = dps[i - 1] + dps[i - 2]
  }
  return dps[n]
}

module.exports = {
  dp1,
}