import arbitrum from './arbitrum'
import avax from './avax'
import bsc from './bsc'
import eth from './eth'
import fsn from './fsn'
import ftm from './ftm'
import ht from './ht'
import matic from './matic'
import xdai from './xdai'
import kcc from './kcc'
import okt from './okt'
import one from './one'
import omgx from './omgx'
import optimism from './optimism'
import movr from './movr'
import iotex from './iotex'
import sdn from './sdn'
import ltc from './ltc'
import btc from './btc'
import block from './block'
import colx from './colx'
import celo from './celo'
import cro from './cro'
import oeth from './oeth'
import tlos from './tlos'
import terra from './terra'
import fuse from './fuse'
import aurora from './aurora'
import sys from './sys'
import metis from './metis'
import glmr from './moonbeam'
import astar from './astar'
import rose from './rose'
import vlx from './vlx'
import clv from'./clv'
import crab from './crab'
import nas from './nas'
import xrp from './xrp'
import milkada from './milkada'
import rei from './rei'
import cfx from './cfx'
import rbtc from './rbtc'
import jewel from './jewel'
import btt from './btt'
import bas from './bas'
import evmos from './evmos'
import ron from './ron'
import etc from './etc'
import cmp from './cmp'
import gt from './gt'
import doge from './doge'
import tomo from './tomo'
import hoo from './hoo'
import tt from './tt'
import near from './near'
import kava from './kava'
import klay from './klay'
import kai from './kai'
import cube from './cube'
import intain from './intain'
import pft from './pft'
import goerli from './goerli'
import xlm from './xlm'
import ont from './ont'
import mintme from './mintme'
import bch from './bch'
import nova from './nova'
import fitfi from './fitfi'
import iota from './iota'
import rpg from './rpg'
import trx from './trx'
import bobabeam from './bobabeam'
import cardano from './cardano'
import ckb from './ckb'
import ethw from './ethw'

import { ChainId } from './chainId'

import {VERSION, USE_VERSION} from '../constant'

interface ConFig {
  [key: string]: any
}
export const chainInfo:ConFig = {
  ...ethw,
  ...ckb,
  ...cardano,
  ...bobabeam,
  ...trx,
  ...rpg,
  ...iota,
  ...fitfi,
  ...nova,
  ...bch,
  ...mintme,
  ...ont,
  ...xlm,
  ...goerli,
  ...pft,
  ...intain,
  ...cube,
  ...kai,
  ...near,
  ...klay,
  ...kava,
  ...tt,
  ...hoo,
  ...tomo,
  ...doge,
  ...gt,
  ...cmp,
  ...etc,
  ...ron,
  ...evmos,
  ...bas,
  ...btt,
  ...jewel,
  ...arbitrum,
  ...avax,
  ...bsc,
  ...eth,
  ...fsn,
  ...ftm,
  ...ht,
  ...matic,
  ...xdai,
  ...kcc,
  ...okt,
  ...one,
  ...ltc,
  ...btc,
  ...block,
  ...omgx,
  ...optimism,
  ...colx,
  ...movr,
  ...iotex,
  ...sdn,
  ...celo,
  ...cro,
  ...oeth,
  ...tlos,
  ...terra,
  ...fuse,
  ...aurora,
  ...sys,
  ...metis,
  ...glmr,
  ...astar,
  ...rose,
  ...vlx,
  ...clv,
  ...crab,
  ...nas,
  ...xrp,
  ...milkada,
  ...rei,
  ...cfx,
  ...rbtc,
}
const allChainList = [
  ChainId.ETH,
  ChainId.AVAX,
  ChainId.ARBITRUM,
  ChainId.BNB,
  ChainId.FTM,
  ChainId.MATIC,
  ChainId.GLMR,
  ChainId.MOVR,
  ChainId.ONE,
  ChainId.OPTIMISM,
  ChainId.AURORA,
  ChainId.BOBA,
  ChainId.CRO,
  ChainId.OKT,
  ChainId.HT,
  ChainId.XDAI,
  ChainId.CELO,
  ChainId.KCC,
  ChainId.FSN,
  ChainId.METIS,
  ChainId.TLOS,
  ChainId.ROSE,
  ChainId.SYS,
  ChainId.IOTEX,
  ChainId.SDN,
  ChainId.FUSE,
  ChainId.ASTAR,
  ChainId.VLX,
  ChainId.CLV,
  // ChainId.CRAB,
  ChainId.MIKO,
  ChainId.REI,
  ChainId.CFX,
  ChainId.RBTC,
  ChainId.JEWEL,
  ChainId.BTT,
  ChainId.EVMOS,
  // ChainId.RON,
  ChainId.ETC,
  ChainId.DOGE,
  ChainId.CMP,
  ChainId.GOERLI,
  ChainId.GT,
  ChainId.TOMO,
  // ChainId.HOO,
  ChainId.TT,
  ChainId.KAVA,
  ChainId.KLAY,
  ChainId.KAI,
  // ChainId.CUBE,
  ChainId.ONT,
  ChainId.MINTME,
  ChainId.BCH,
  ChainId.NOVA,
  ChainId.FITFI,
  ChainId.RPG,
  ChainId.BOBABEAM,
  ChainId.CKB,
  ChainId.ETHW,
  // ChainId.BNB_TEST,
  // ChainId.RINKEBY,
]

const testChainList = [
  ChainId.RINKEBY,
  ChainId.FTM_TEST,
  ChainId.BNB_TEST,
  ChainId.MATIC_TEST,
  ChainId.AVAX_TEST,
  ChainId.ARBITRUM_TEST,
  ChainId.BAS_TEST,
  ChainId.INTAIN_TEST,
  ChainId.PFT_TEST,
  ChainId.GOERLI1_TEST,
]

const useChain:any = {
  [VERSION.V1]: [
    ChainId.ETH,
    ChainId.BNB,
  ],
  [VERSION.V1_1]: [
    ChainId.ETH,
    ChainId.BNB,
    ChainId.MATIC,
    ChainId.AVAX,
    ChainId.HT,
    ChainId.OKT,
  ],
  [VERSION.V2]: [
    ChainId.ETH,
    ChainId.BNB,
    ChainId.FTM,
    ChainId.MATIC
  ],
  [VERSION.V2_1]: [
    ChainId.ETH,
    ChainId.BNB,
    ChainId.FTM,
    ChainId.MATIC
  ],
  [VERSION.V2_2]: [
    ChainId.ETH,
    ChainId.BNB,
    ChainId.FTM,
    ChainId.MATIC,
    ChainId.OKT,
    ChainId.AVAX,
    ChainId.ARBITRUM,
    ChainId.MOVR,
  ],
  [VERSION.V2_T1]: [
    ChainId.RINKEBY,
    ChainId.BNB_TEST,
    ChainId.HT_TEST,
  ],
  [VERSION.V2_T2]: [
    ChainId.RINKEBY,
    ChainId.ARBITRUM_TEST,
    ChainId.OMGX_TEST,
    ChainId.OPTIMISM_TEST
  ],
  [VERSION.V2_T3]: [
    ChainId.RINKEBY,
    ChainId.ARBITRUM_TEST,
    ChainId.OMGX_TEST,
    ChainId.OPTIMISM_TEST
  ],
  [VERSION.V3]: [
    ChainId.ETH,
    ChainId.ARBITRUM
  ],
  [VERSION.V3_1]: [
    ChainId.ETH,
    ChainId.BNB,
    ChainId.ARBITRUM
  ],
  [VERSION.V4]: [
    ChainId.ETH,
    ChainId.BNB,
    ChainId.FSN,
    ChainId.FTM,
    ChainId.MATIC,
    ChainId.HT,
    ChainId.AVAX,
    ChainId.XDAI,
    ChainId.KCC,
    ChainId.OKT,
    ChainId.ONE
  ],
  [VERSION.V4_OKT]: [
    ChainId.BNB,
    ChainId.OKT
  ],
  [VERSION.V4_MOVR]: [
    ChainId.ETH,
    ChainId.BNB,
    ChainId.MOVR
  ],
  [VERSION.V5]: [...allChainList],
  [VERSION.V6]: [
    ChainId.FTM,
    ChainId.RINKEBY
  ],
  [VERSION.V6_1]: [
    ChainId.ETH,
    ChainId.FTM,
    ChainId.MATIC,
    ChainId.AVAX,
  ],
  [VERSION.V7]: [
    ...allChainList,
    ChainId.BTC,
    ChainId.TERRA,
    ChainId.LTC,
    ChainId.BLOCK,
    ChainId.COLX,
    ChainId.NAS,
    ChainId.XRP,
    ChainId.NEAR,
  ],
  [VERSION.V7_TEST]: [
    ...testChainList,
    ChainId.TRX_TEST,
    ChainId.NEAR_TEST,
    ChainId.XLM_TEST,
    ChainId.IOTA_TEST,
    ChainId.ADA_TEST,
  ],
  [VERSION.V7_BAS_TEST]: [
    ChainId.BNB_TEST,
    ChainId.BAS_TEST
  ],
  ALL_MAIN: [
    ChainId.ETH,
    ChainId.BNB,
    ChainId.FSN,
    ChainId.FTM,
    ChainId.MATIC,
    ChainId.HT,
    ChainId.AVAX,
    ChainId.XDAI,
    ChainId.ARBITRUM,
    ChainId.KCC,
    ChainId.OKT,
    ChainId.ONE,
    ChainId.MOVR,
    ChainId.TERRA,
    ChainId.AURORA,
    ChainId.ASTAR,
    ChainId.NAS
  ]
}

// const envType:any = env
// export const spportChainArr = envType === 'dev' ? useChain['ALL_MAIN'] : useChain[USE_VERSION]
export const spportChainArr:any = useChain[USE_VERSION]