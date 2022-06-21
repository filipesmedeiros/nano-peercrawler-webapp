export const getPeersUrl =
  process.env.NEXT_PUBLIC_PEER_CRAWLER_URL ||
  'http://hetzner1.siganos.xyz:5001/peercrawler/json'

export const network = process.env.NEXT_PUBLIC_NANO_NETWORK || 'live'

export const github =
  process.env.NEXT_PUBLIC_GITHUB ||
  'https://github.com/filipesmedeiros/nano-testnet-faucet'

export const email = process.env.NEXT_PUBLIC_EMAIL || 'hello@filipesm.com'

export const twitter = process.env.NEXT_PUBLIC_TWITTER || 'filipesm_com'

export const fediverse =
  process.env.NEXT_PUBLIC_FEDIVERSE || 'https://social.filipesm.com/web/@filipe'

export const donationAddress =
  process.env.NEXT_PUBLIC_DONATION_ADDRESS ||
  'nano_3stbuoteedww6z5dt4emx9xs6fa5ueeghreicy9p59ygpidizcckuue4ps3f'
