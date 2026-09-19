export const ADMIN_ENGINE_HEALTH_QUERY = `
  query AdminEngineHealth {
    adminEngineHealth {
      overallStatus pluginVersion schemaVersion phpVersion wordpressVersion woocommerceVersion graphqlVersion
      actionSchedulerAvailable actionSchedulerPending actionSchedulerRunning actionSchedulerFailed actionSchedulerOverdue nextActionAt
      rateIntervalHours rateLastSyncAt rateNextRunAt rateConfigured
      schedulerStatus schedulerProgress schedulerPendingRequest
      revalidationPending revalidationClaimed revalidationFailed revalidationTableReady revalidationScheduled
      auditTableReady auditEntries checkedAt
    }
  }
`;

export const ADMIN_FAILED_JOBS_QUERY = `
  query AdminFailedJobs($first: Int) {
    adminFailedJobs(first: $first) {
      actionId hook group status scheduledAt lastAttemptAt attempts
    }
  }
`;

export const ADMIN_AUDIT_LOGS_QUERY = `
  query AdminAuditLogs($first: Int, $action: String, $result: String) {
    adminAuditLogs(first: $first, action: $action, result: $result) {
      id adminUserId adminName action entityType entityId result metadata createdAt
    }
  }
`;

export const ADMIN_RUN_RATE_SYNC_MUTATION = `
  mutation AdminRunRateSync {
    adminRunRateSync { success message }
  }
`;

export const ADMIN_SCHEDULE_PRICING_REBUILD_MUTATION = `
  mutation AdminSchedulePricingRebuild($currencies: [String]) {
    adminSchedulePricingRebuild(input: { currencies: $currencies }) { success message }
  }
`;

export const ADMIN_SCHEDULE_REVALIDATION_MUTATION = `
  mutation AdminScheduleRevalidation {
    adminScheduleRevalidation { success message }
  }
`;

export const ADMIN_RETRY_FAILED_JOB_MUTATION = `
  mutation AdminRetryFailedJob($actionId: Int!) {
    adminRetryFailedJob(input: { actionId: $actionId }) { success message }
  }
`;
