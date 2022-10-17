import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AptosClient, CoinClient, AptosAccount } from 'aptos'
import { AppState, AppDispatch } from '../../state'
import { aptosAddress } from './actions'
import config from '../../config'
export function isTempAddress(address: string): boolean | string {
  return address //true: address; false: false
}

export function useAptosAddress() {
  const account: any = useSelector<AppState, AppState['aptos']>(state => state.aptos.aptosAddress)
  return {
    aptosAddress: account
  }
}

/**
 * Connect wallet and set wallet address
 */
export function useLoginAptos() {
  const dispatch = useDispatch<AppDispatch>()
  const loginAptos = useCallback(async () => {
    const wallet = window.aptos
    if (wallet) {
      const response = await wallet.connect()
      dispatch(aptosAddress({ address: response.address }))
    } else {
      if (confirm('Please install Petra Wallet.') === true) {
        window.open('https://chrome.google.com/webstore/detail/petra/ejjladinnckdgjemekebdpeokbikhfci')
      }
    }
  }, [])
  return {
    loginAptos
  }
}

const initAptos = (chainId: string) => {
  const client = new AptosClient(config.chainInfo[chainId].nodeRpc)
  const coinClient = new CoinClient(client)
  return coinClient
}

/**
 * Get native balance and token balance
 *
 * @param account wallet address
 * @param token token address
 */
export function useAptosBalance() {
  const getAptosBalance = useCallback(({ chainId, account }: { chainId: any; account: string }) => {
    return new Promise(async resolve => {
      const aptosClient = initAptos(chainId)
      if (account) {
        const ac = new AptosAccount(undefined, account)
        const balance = await aptosClient.checkBalance(ac)
        resolve(Number(balance) / 100000000)
      }
    })
  }, [])
  const getAptosTokenBalance = useCallback(
    ({
      chainId,
      account,
      token
    }: {
      chainId: any
      account: string | null | undefined
      token: string | null | undefined
    }) => {
      return new Promise(async resolve => {
        const aptosClient = initAptos(chainId)
        if (account && token) {
          const ac = new AptosAccount(undefined, account)
          const balance = await aptosClient.checkBalance(ac, { coinType: token })
          resolve(balance)
        }
      })
    },
    []
  )

  return {
    getAptosBalance,
    getAptosTokenBalance
  }
}

// /**
//  * Authorization and obtaining authorization information
//  *
//  * @param account wallet address
//  * @param token token address
//  * @param spender spender address
//  */
// export function useTempAllowance(
//   token: string | null | undefined,
//   spender: string | null | undefined,
//   chainId: string | null | undefined,
//   account: string | null | undefined,
// ) {
//   const setTempAllowance = useCallback((): Promise<any> => {
//     return new Promise(async(resolve, reject) => {
//       if (token && spender && account && chainId) {
//         resolve('')
//       } else {
//         reject('')
//       }
//     })
//   }, [token, spender, account, chainId])

//   const getTempAllowance = useCallback(() => {
//     return new Promise(async(resolve): Promise<any> => {
//       resolve('')
//     })
//   }, [account, chainId, token, spender])

//   return {
//     setTempAllowance,
//     getTempAllowance,
//   }
// }

enum State {
  Success = 'Success',
  Failure = 'Failure',
  Null = 'Null'
}

interface TxDataResult {
  msg: State
  info: any
  error: any
}
/**
 * Get transaction info
 *
 * @param txid transaction hash
 */
export function getAptosTxnsStatus(txid: string, chainId: string) {
  return new Promise(async resolve => {
    const aptosClient = initAptos(chainId)
    if (!txid) return
    const data: TxDataResult = {
      msg: State.Null,
      info: '',
      error: ''
    }
    try {
      const tx:any = await aptosClient.aptosClient.getTransactionByHash(txid)
      data.msg = tx.success ? State.Success : State.Failure;
      data.info = tx.vm_status;
    } catch (e) {
      data.msg = State.Null
      data.info = 'invalid hash'
    }
    resolve(data)
  })
}

// /**
//  * Cross chain
//  *
//  * @param routerToken router token address
//  * @param inputToken any or underlying address
//  * @param selectCurrency select current token info
//  * @param selectChain to chainId
//  * @param receiveAddress receive address
//  * @param typedValue typed Value
//  * @param destConfig to chain info
//  */
// export function useTempCrossChain (
//   routerToken: string | null | undefined,
//   inputToken: string | null | undefined,
//   selectCurrency: any,
//   selectChain: string | null | undefined,
//   receiveAddress: string | null | undefined,
//   typedValue: string | null | undefined,
//   destConfig: any,
// ): {
//   inputError?: string
//   balance?: any,
//   execute?: undefined | (() => Promise<void>)
// } {
//   const { account, chainId } = useActiveReact()
//   return useMemo(() => {
//     return {
//       balance: '',
//       execute: async () => {

//       },
//       inputError: ''
//     }
//   }, [routerToken, inputToken, chainId, selectCurrency, selectChain, receiveAddress, typedValue, destConfig, account])
// }

// enum SwapType {
//   withdraw = 'withdraw',
//   deposit = 'deposit',
// }

// /**
//  * Cross chain
//  *
//  * @param routerToken router token address
//  * @param selectCurrency select current token info
//  * @param inputToken any or underlying address
//  * @param typedValue typed Value
//  * @param swapType deposit or withdraw
//  * @param selectChain to chainId
//  * @param receiveAddress receive address
//  * @param destConfig to chain info
//  */
// export function useTempSwapPoolCallback(
//   routerToken: string | null | undefined,
//   selectCurrency: string | null | undefined,
//   inputToken: string | null | undefined,
//   typedValue: string | null | undefined,
//   swapType: SwapType,
//   selectChain: string | null | undefined,
//   receiveAddress: string | null | undefined,
//   destConfig: any,
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
//   const { account, chainId } = useActiveReact()
//   return useMemo(() => {
//     return {
//       balance: '',
//       execute: async () => {

//       },
//       inputError: ''
//     }
//   }, [routerToken, inputToken, swapType, selectCurrency, selectChain, receiveAddress, typedValue, destConfig, account, chainId])
// }

// interface PoolCalls {
//   token: string | null | undefined,
//   account: string | null | undefined,
//   anytoken: string | null | undefined,
//   dec: number
// }

// interface PoolResult {
//   [key:string]: {
//     balanceOf: string,
//     totalSupply: string,
//     balance: string,
//   }
// }

// /**
//  * Get pool info
//  *
//  * @param chainId router token address
//  * @param calls [{token: '', anytoken: '', account: ''}]
//  * @return {'anytoken': {'balanceOf': '', 'totalSupply': '', 'balance': ''}}
//  */
// export function useTempPoolDatas () {
//   const getTempPoolDatas = useCallback(async(calls: Array<[PoolCalls]>, chainId: string | null | undefined): Promise<PoolResult> => {
//     return {
//       'anytoken': {
//         balanceOf: '',
//         totalSupply: '',
//         balance: '',
//       }
//     }
//   }, [])
//   return {
//     getTempPoolDatas
//   }
// }
