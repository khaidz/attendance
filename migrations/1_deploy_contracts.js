const AttendanceSheet = artifacts.require("AttendanceSheet");

module.exports = function (deployer) {
  deployer.deploy(AttendanceSheet);
}; 