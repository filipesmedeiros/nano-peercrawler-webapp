export interface PeerTelemetry {
  hdr: {
    ext: number | null
    net_id: number | null
    ver_max: number | null
    ver_using: number | null
    ver_min: number | null
    msg_type: number | null
  } | null
  sig_verified: boolean | null
  sig: string | null
  node_id: string | null
  block_count: number | null
  cemented_count: number | null
  unchecked_count: number | null
  account_count: number | null
  bandwidth_cap: number | null
  peer_count: number | null
  protocol_ver: number | null
  uptime: number | null
  genesis_hash: string | null
  major_ver: number | null
  minor_ver: number | null
  patch_ver: number | null
  pre_release_ver: number | null
  maker_ver: number | null
  timestamp: number | null
  active_difficulty: number | null
}

export interface PeerInfo {
  ip: string | null
  port: number | null
  peer_id: string | null
  is_voting: boolean | null
  telemetry: PeerTelemetry | null
  aux: {} | null
  last_seen: number | null
  score: number | null
}

export interface NanoCommunityPeerInfo {
  alias: string
  account: string
  weight: string
  node_id: string
  address: string
  port: number
}

export type MergedPeerInfo = PeerInfo &
  Partial<Omit<NanoCommunityPeerInfo, 'port' | 'address'>>

export type SortDirection = 'asc' | 'desc' | undefined

export interface ConfirmationQuorumResponse {
  quorum_delta: string
  online_weight_quorum_percent: string
  online_weight_minimum: string
  online_stake_total: string
  peers_stake_total: string
  trended_stake_total: string
}
