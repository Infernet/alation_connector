export let JobStatusEnum;

(function (JobStatusEnum) {
  JobStatusEnum["RUNNING"] = "running";
  JobStatusEnum["FAILED"] = "failed";
  JobStatusEnum["SUCCESSFUL"] = "successful";
})(JobStatusEnum || (JobStatusEnum = {}));

export let TokenStatusEnum;

(function (TokenStatusEnum) {
  TokenStatusEnum["ACTIVE"] = "ACTIVE";
  TokenStatusEnum["EXPIRED"] = "EXPIRED";
  TokenStatusEnum["REVOKED"] = "REVOKED";
})(TokenStatusEnum || (TokenStatusEnum = {}));
//# sourceMappingURL=index.js.map