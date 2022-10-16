import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const APT_DEVNET = 'https://fullnode.devnet.aptoslabs.com'
export const APT_DEV_CHAINID = ChainId.APT_DEV
export const APT_DEV_EXPLORER = 'https://explorer.aptoslabs.com/?network=devnet'

export const APT_TESTNET = 'https://testnet.aptoslabs.com'
export const APT_TEST_CHAINID = ChainId.APT_TEST
export const APT_TEST_EXPLORER = 'https://explorer.aptoslabs.com/?network=testnet'

const symbol = 'APT'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [APT_DEV_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: APT_DEVNET,
    nodeRpcList: [],
    chainID: APT_DEV_CHAINID,
    lookHash: APT_DEV_EXPLORER + '/txn/',
    lookAddr: APT_DEV_EXPLORER + '/account/',
    lookBlock: APT_DEV_EXPLORER + '/block/',
    explorer: APT_DEV_EXPLORER,
    symbol: symbol,
    name: 'Aptos',
    networkName: 'Aptos Devnet',
    networkLogo: 'APT',
    type: 'dev',
    label: APT_DEV_CHAINID,
    chainType: APT_DEV_CHAINID
  },
  [APT_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: APT_TESTNET,
    chainID: APT_TEST_CHAINID,
    nodeRpcList: [],
    lookHash: APT_TEST_EXPLORER + '/txn/',
    lookAddr: APT_TEST_EXPLORER + '/account/',
    lookBlock: APT_TEST_EXPLORER + '/block/',
    explorer: APT_TEST_EXPLORER,
    symbol: symbol,
    name: 'Aptos',
    networkName: 'Aptos testnet',
    networkLogo: 'APT',
    type: 'test',
    label: APT_TEST_CHAINID,
    chainType: APT_TEST_CHAINID
  },
}