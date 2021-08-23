"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TokenStatusEnum = exports.JobStatusEnum = void 0;
let JobStatusEnum;
exports.JobStatusEnum = JobStatusEnum;

(function (JobStatusEnum) {
  JobStatusEnum["RUNNING"] = "running";
  JobStatusEnum["FAILED"] = "failed";
  JobStatusEnum["SUCCESSFUL"] = "successful";
})(JobStatusEnum || (exports.JobStatusEnum = JobStatusEnum = {}));

let TokenStatusEnum;
exports.TokenStatusEnum = TokenStatusEnum;

(function (TokenStatusEnum) {
  TokenStatusEnum["ACTIVE"] = "ACTIVE";
  TokenStatusEnum["EXPIRED"] = "EXPIRED";
  TokenStatusEnum["REVOKED"] = "REVOKED";
})(TokenStatusEnum || (exports.TokenStatusEnum = TokenStatusEnum = {}));
//# sourceMappingURL=index.js.map