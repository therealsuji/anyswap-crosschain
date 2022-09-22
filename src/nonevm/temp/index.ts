import { useCallback, useMemo } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { AppState, AppDispatch } from '../../state'
import {tempAddress} from './actions'
import { useActiveReact } from '../../hooks/useActiveReact'

export function isTempAddress (address:string):boolean | string {
  return address //true: address; false: false
}

export function useTempAddress () {
  const account:any = useSelector<AppState, AppState['temp']>(state => state.temp.tempAddress)
  return {
    tempAddress: account
  }
}

export function useLoginTemp () {
  const dispatch = useDispatch<AppDispatch>()
  const loginTemp = useCallback(() => {
    dispatch(tempAddress({address: ''}))
  }, [])
  return {
    loginTemp
  }
}


export function useTempBalance () {
  const getTempBalance = useCallback(({account}: {account:string|null|undefined}) => {
    return new Promise((resolve) => {
      if (account) {
        resolve('')
      }
    })
  }, []) 

  const getTempTokenBalance = useCallback(({account, token}: {account:string|null|undefined, token:string|null|undefined}) => {
    return new Promise((resolve) => {
      if (account && token) {
        resolve('')
      }
    })
  }, [])

  return {
    getTempBalance,
    getTempTokenBalance
  }
}

export function useTempAllowance(
  token: string | null | undefined,
  spender: string | null | undefined,
  chainId: string | null | undefined,
  account: string | null | undefined,
) {
  const setTempAllowance = useCallback((): Promise<any> => {
    return new Promise(async(resolve, reject) => {
      if (token && spender && account && chainId) {
        resolve('')
      } else {
        reject('')
      }
    })
  }, [token, spender, account, chainId])

  const getTempAllowance = useCallback(() => {
    return new Promise(async(resolve): Promise<any> => {
      resolve('')
    })
  }, [account, chainId, token, spender])

  return {
    setTempAllowance,
    getTempAllowance,
  }
}

enum State {
  Success = 'Success',
  Failure = 'Failure',
  Null = 'Null',
}

interface TxDataResult {
  msg: State,
  info: any,
  error: any
}
export function getTempTxnsStatus (txid:string) {
  return new Promise(resolve => {
    const data:TxDataResult = {
      msg: State.Null,
      info: '',
      error: ''
    }
    if (txid) {
      resolve(data)
    }
  })
}

export function useTempCrossChain (
  routerToken: string | null | undefined,
  inputToken: string | null | undefined,
  selectCurrency: any,
  selectChain: string | null | undefined,
  receiveAddress: string | null | undefined,
  typedValue: string | null | undefined,
  destConfig: any,
): {
  inputError?: string
  balance?: any,
  execute?: undefined | (() => Promise<void>)
} {
  const { account, chainId } = useActiveReact()
  return useMemo(() => {
    return {
      balance: '',
      execute: async () => {

      },
      inputError: ''
    }
  }, [routerToken, inputToken, chainId, selectCurrency, selectChain, receiveAddress, typedValue, destConfig, account])
}

enum SwapType {
  withdraw = 'withdraw',
  deposit = 'deposit',
}

export function useTempSwapPoolCallback(
  routerToken: string | null | undefined,
  selectCurrency: string | null | undefined,
  inputToken: string | null | undefined,
  typedValue: string | null | undefined,
  swapType: SwapType,
  selectChain: string | null | undefined,
  receiveAddress: string | null | undefined,
  destConfig: any,
): { execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { account, chainId } = useActiveReact()
  return useMemo(() => {
    return {
      balance: '',
      execute: async () => {

      },
      inputError: ''
    }
  }, [routerToken, inputToken, swapType, selectCurrency, selectChain, receiveAddress, typedValue, destConfig, account, chainId])
}

interface PoolCalls {
  token: string | null | undefined,
  account: string | null | undefined,
  anytoken: string | null | undefined,
  dec: number
}

interface PoolResult {
  [key:string]: {
    balanceOf: string,
    totalSupply: string,
    balance: string,
  }
}

export function useTempPoolDatas () {
  const getTempPoolDatas = useCallback(async(calls: Array<[PoolCalls]>, chainId: string | null | undefined): Promise<PoolResult> => {
    return {
      'anytoken': {
        balanceOf: '',
        totalSupply: '',
        balance: '',
      }
    }
  }, [])
  return {
    getTempPoolDatas
  }
}