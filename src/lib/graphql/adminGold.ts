import "server-only";

export const ADMIN_GOLD_BOARD_QUERY = `
  query GetAdminGoldBoard($status: String, $first: Int) {
    adminGoldBuyOrders(status: $status, first: $first) {
      databaseId gameSlug gameName region amount offerAmount ratePer1k timerMinutes status createdAt proposalCount pendingProposalCount
    }
    adminGoldProposals(status: "all", first: 40) {
      databaseId buyOrderId userId profileId profileName amount status claimedBy claimedAt claimExpiresAt suspendedReason completedAt paidAt createdAt gameName gameSlug region buyAmount offerAmount
    }
    adminGoldDeals(status: "all", first: 20) {
      databaseId buyOrderId proposalId sellerUserId sellerName sellerEmail profileName proposalAmount status timerExpiresAt deliveredAmount deliveryConfirmedAt suspendedReason gameName gameSlug region offerAmount
    }
  }
`;

export const ADMIN_CREATE_GOLD_BUY_ORDER = `
  mutation AdminCreateGoldBuyOrder($gameSlug:String!,$gameName:String!,$region:String!,$amount:Int!,$offerAmount:String!,$ratePer1k:String,$timerMinutes:Int){
    adminCreateGoldBuyOrder(input:{gameSlug:$gameSlug,gameName:$gameName,region:$region,amount:$amount,offerAmount:$offerAmount,ratePer1k:$ratePer1k,timerMinutes:$timerMinutes}){success buyOrder{databaseId}}
  }
`;
export const ADMIN_CLAIM_GOLD_PROPOSAL = `
  mutation AdminClaimGoldProposal($proposalId:Int!){ adminClaimGoldProposal(input:{proposalId:$proposalId}){success proposal{databaseId status claimExpiresAt claimedBy}} }
`;
export const ADMIN_START_GOLD_DEAL = `
  mutation AdminStartGoldDeal($proposalId:Int!){ adminStartGoldDeal(input:{proposalId:$proposalId}){success deal{databaseId status timerExpiresAt proposalId sellerName profileName proposalAmount}} }
`;
export const ADMIN_UPDATE_GOLD_DEAL_STATUS = `
  mutation AdminUpdateGoldDealStatus($dealId:Int!,$status:String!,$reason:String){ adminUpdateGoldDealStatus(input:{dealId:$dealId,status:$status,reason:$reason}){success deal{databaseId status suspendedReason}} }
`;
export const ADMIN_CONFIRM_GOLD_RECEIVED = `
  mutation AdminConfirmGoldReceived($dealId:Int!,$amount:Int){ adminConfirmGoldReceived(input:{dealId:$dealId,amount:$amount}){success deal{databaseId status deliveredAmount deliveryConfirmedAt}} }
`;
export const ADMIN_RECORD_GOLD_PAYOUT = `
  mutation AdminRecordGoldPayout($dealId:Int!,$amount:String!,$note:String){ adminRecordGoldPayout(input:{dealId:$dealId,amount:$amount,note:$note}){success payout{databaseId amount status paidAt}} }
`;
export const ADMIN_ADD_GOLD_STRIKE = `
  mutation AdminAddGoldStrike($userId:Int!,$reason:String!){ adminAddGoldStrike(input:{userId:$userId,reason:$reason}){success strikeCount} }
`;
