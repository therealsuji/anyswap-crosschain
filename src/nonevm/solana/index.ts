import { useCallback, useMemo } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
// import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AppState, AppDispatch } from '../../state'
import {solAddress} from './actions'
import { useActiveReact } from '../../hooks/useActiveReact'
import config from "../../config"
import {VALID_BALANCE} from '../../config/constant'
import { tryParseAmount3 } from '../../state/swap/hooks'

import {recordsTxns} from '../../utils/bridge/register'
import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'

import {useTokensBalance} from '../../hooks/useAllBalances'

import solRouter from './router.json'
// import * as solanaWeb3 from '@solana/web3.js'
// import * as spl from '@solana/spl-token'
/* eslint-disable */
// eslint-disable-next-line
// import * as anchor from '@project-serum/anchor'
const anchor = require('@project-serum/anchor')
import * as spl from "@solana/spl-token";

const { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, Token} = spl
// console.log(getAccount )
const solanaWeb3 = anchor.web3
const Program = anchor.Program
// const spl = new anchor.Spl()
// const Token = anchor.Spl.token
console.log(anchor )
// console.log(solanaWeb3 )
// console.log(spl )
// console.log(Token )
// console.log(solanaWeb3.SystemProgram.programId )
// console.log(AnchorProvider.env() )
// console.log(ASSOCIATED_TOKEN_PROGRAM_ID )
// console.log(TOKEN_PROGRAM_ID )
/* eslint-disable */

const solAddressReg = /^[1-9A-Z]{44}$/

let solId = 0
// fetch('https://l2api.anyswap.exchange/v2/reswaptxns?hash=3SxanA7YwydbnkJLZPjwtDYQCeAmiQ3YYNTFshk54u56t2XvDkEj2Ed65BAAzZv4QWNvUw3fA23VBQNGuZWy3tbt&srcChainID=SOL_TEST&destChainID=5').then(res => res.json()).then(json => {console.log(json)})
// export function getSolanaInfo(chainId:any, params:any) {
export function getSolanaInfo(chainId:any, method: string, params: any) {
  return new Promise((resolve, reject) => {
    fetch(config.chainInfo[chainId].nodeRpc, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "id": solId ++,
        "method": method,
        "params": params
      })
    }).then(res => res.json()).then(json => {
      resolve(json)
    }).catch((err:any) => {
      reject(err)
    })
  })
}

export function isSolAddress (address:string):boolean | string {
  if (solAddressReg.test(address)) {
    return address
  }
  return false
}

export function useSolAddress () {
  const account:any = useSelector<AppState, AppState['sol']>(state => state.sol.solAddress)
  // console.log(useWallet)
  // console.log(useConnection)
  return {
    solAddress: account
  }
}

export function useLoginSol () {
  const dispatch = useDispatch<AppDispatch>()
  const loginSol = useCallback(() => {
    if (window?.solana?.connect) {
      window?.solana?.connect().then((res:any) => {
        if (res?.publicKey) {
          dispatch(solAddress({address: res.publicKey.toString()}))
        }
      }).catch((err:any) => {
        console.log(err)
      })
    } else {
      if (confirm('Please open or install Solana wallet.') === true) {
        window.open('https://solana.com/ecosystem/explore?categories=wallet')
      }
    }
  }, [])
  return {
    loginSol
  }
}

export function useSolCreateAccount () {

  const getAccount = useCallback((account, token) => {
    return new Promise(async(resolve) => {
      if (account && token) {
        try {
          const base58publicKey = new solanaWeb3.PublicKey(account)
          const tokenpublicKey = new solanaWeb3.PublicKey(token)
          const acctontToToken = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, tokenpublicKey, base58publicKey, true)
          resolve(acctontToToken)
        } catch (error) {
          console.log(error)
          resolve('')
        }
      } else {
        resolve('')
      }
    })
  }, [])

  const createAccount = useCallback(async() => {
    try {
      // const key = [{
      //   pubkey: 'payer',
      //   isSigner: true,
      //   isWritable: true
      // }, {
      //   pubkey: 'associatedAccount',
      //   isSigner: false,
      //   isWritable: true
      // }, {
      //   pubkey: 'owner',
      //   isSigner: false,
      //   isWritable: false
      // }, {
      //   pubkey: 'mint',
      //   isSigner: false,
      //   isWritable: false
      // }, {
      //   pubkey: web3_js.SystemProgram.programId,
      //   isSigner: false,
      //   isWritable: false
      // }, {
      //   pubkey: programId,
      //   isSigner: false,
      //   isWritable: false
      // }, {
      //   pubkey: web3_js.SYSVAR_RENT_PUBKEY,
      //   isSigner: false,
      //   isWritable: false
      // }]
      // const account = '8fBfAE4gVbv253UgwkwBT5TaV5SaZ7JJWgmQoqbEEei5'
      // const account = 'C5WYGHYJ3oAeHPtAZJMLnhFN8eVDjSZqJGKtJNSVvo8K'
      const account = '8fBfAE4gVbv253UgwkwBT5TaV5SaZ7JJWgmQoqbEEei5'
      const t = 'GkzTnqZSasjZ5geL4cbvPErNVB9xWby4zYN7hpW5k5iX'
      const tokenpublicKey = new solanaWeb3.PublicKey(t)
      const associatedAddress1:any = await getAccount(account, t)
      const associatedAddress = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        tokenpublicKey,
        new solanaWeb3.PublicKey(account),
      );
      console.log('associatedAddress1', associatedAddress1.toBase58())
      console.log('associatedAddress', associatedAddress.toBase58())
      const connection = new solanaWeb3.Connection(config.chainInfo['SOL_TEST'].nodeRpc)
      const token  = new Token(connection, tokenpublicKey, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, new solanaWeb3.PublicKey(account))
      // token.createAssociatedTokenAccount(new solanaWeb3.PublicKey(account))
      // token.createAccount(new solanaWeb3.PublicKey(account))
      // const token  = Token.createAssociatedTokenAccountInstruction(
      //   ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, new solanaWeb3.PublicKey('GkzTnqZSasjZ5geL4cbvPErNVB9xWby4zYN7hpW5k5iX'), base58publicKey, base58publicKey
      // )
      console.log(token)
      console.log(Token)
      // console.log(token.mintTo())
      const tx = new solanaWeb3.Transaction()
      tx.add(
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          tokenpublicKey,
          associatedAddress,
          new solanaWeb3.PublicKey(account),
          new solanaWeb3.PublicKey(account),
        )
        // Token.createAssociatedTokenAccountInstruction(
        //   new solanaWeb3.PublicKey(account),
        //   associatedAddress,
        //   new solanaWeb3.PublicKey(account),
        //   tokenpublicKey
        // )
      )
      console.log(tx)
      console.log(Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        tokenpublicKey,
        associatedAddress,
        new solanaWeb3.PublicKey(account),
        new solanaWeb3.PublicKey(account),
      ))
      // tx.add(
      //   // spl.createTransferCheckedInstruction(
      //   //   base58publicKey, // from
      //   //   new solanaWeb3.PublicKey('GkzTnqZSasjZ5geL4cbvPErNVB9xWby4zYN7hpW5k5iX'), // mint
      //   //   base58publicKey, // to
      //   //   base58publicKey, // from's owner
      //   //   1, // amount
      //   //   0 // decimals
      //   // )
      // )
      const result = await connection.getLatestBlockhash()
      // const result = await connection.getConfirmedBlock(blockNumber)
      console.log(result)
      tx.lastValidBlockHeight = result.lastValidBlockHeight;
      tx.recentBlockhash = result.blockhash;
      tx.feePayer = new solanaWeb3.PublicKey(account)
      const tsResult = await window?.solana?.signAndSendTransaction(tx)
      console.log(tsResult)
    } catch (error) {
      console.log(error)
    }
  }, [])
  return {
    getAccount,
    createAccount
  }
}


export function useSolBalance () {
  const {getAccount} = useSolCreateAccount()
  const getSolBalance = useCallback(({chainId, account}: {chainId: any, account:string|null|undefined}) => {
    return new Promise((resolve) => {
      if (account) {
        getSolanaInfo(chainId, 'getBalance', [account]).then((res:any) => {
          resolve(res)
        }).catch((err:any) => {
          console.log(err)
          resolve('')
        })
      } else {
        resolve('')
      }
    })
  }, []) 

  const getSolTokenBalance = useCallback(({chainId, account, token}: {chainId: any, account:string|null|undefined, token:string|null|undefined}) => {
    return new Promise(async(resolve) => {
      if (chainId && account && token) {
        const acctontToToken:any = await getAccount(account, token)
        // try {
        //   const base58publicKey = new solanaWeb3.PublicKey(account)
        //   // const tokenpublicKey = new solanaWeb3.PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
        //   // const tokenpublicKey = Buffer.from('GkzTnqZSasjZ5geL4cbvPErNVB9xWby4zYN7hpW5k5iX')
        //   // const tokenpublicKey = new solanaWeb3.PublicKey('GkzTnqZSasjZ5geL4cbvPErNVB9xWby4zYN7hpW5k5iX')
        //   const tokenpublicKey = new solanaWeb3.PublicKey(token)
        //   // const tokenpublicKey = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        //   // console.log(new solanaWeb3.PublicKey('GkzTnqZSasjZ5geL4cbvPErNVB9xWby4zYN7hpW5k5iX'))
        //   // console.log(tokenpublicKey)
        //   // const base58publicKey = new solanaWeb3.PublicKey(account)
        //   // programAddressFromKey = await solanaWeb3.PublicKey.createProgramAddress([tokenpublicKey], base58publicKey)
        //   // const programAddressFromKey = await solanaWeb3.PublicKey.createProgramAddress([tokenpublicKey.slice(0,32)], base58publicKey)
        //   // console.log(programAddressFromKey.toString())
        //   // console.log(programAddressFromKey.toBase58())
        //   acctontToToken = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, tokenpublicKey, base58publicKey, true)
        //   // console.log(t.toBase58())
        //   // const validProgramAddress = await solanaWeb3.PublicKey.findProgramAddress(
        //   //   [tokenpublicKey],
        //   //   base58publicKey,
        //   // )
        //   // console.log(validProgramAddress[0]?.toBase58())
        //   // const connection = new solanaWeb3.Connection(config.chainInfo[chainId].nodeRpc)
        //   // console.log(connection)
        //   // const blockNumber = await connection.getBlockHeight()
        //   // const result = await connection.getBlock(blockNumber)
        //   // console.log(result)

          
        //   // const token  = new Token(connection, tokenpublicKey, TOKEN_PROGRAM_ID)
        //   // const token  = Token.createAssociatedTokenAccountInstruction(
        //   //   ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, new solanaWeb3.PublicKey('GkzTnqZSasjZ5geL4cbvPErNVB9xWby4zYN7hpW5k5iX'), base58publicKey, base58publicKey
        //   // )
        //   // const tx = new solanaWeb3.Transaction()
        //   // // tx.add(
        //   // //   token
        //   // // )
        //   // tx.add(
        //   //   spl.createTransferCheckedInstruction(
        //   //     base58publicKey, // from
        //   //     new solanaWeb3.PublicKey('GkzTnqZSasjZ5geL4cbvPErNVB9xWby4zYN7hpW5k5iX'), // mint
        //   //     base58publicKey, // to
        //   //     base58publicKey, // from's owner
        //   //     1, // amount
        //   //     0 // decimals
        //   //   )
        //   // )
        //   // tx.lastValidBlockHeight = blockNumber;
        //   // tx.recentBlockhash = result.blockhash;
        //   // tx.feePayer = base58publicKey
        //   // console.log(tx)
        //   // // window?.solana?.signAndSendTransaction(tx)
        //   // window?.solana?.signTransaction(tx)
        //   // connection.sendTransaction(tx, [base58publicKey])
        //   // token.createAccount(base58publicKey)
        //   // token.createAssociatedTokenAccount(base58publicKey)
        //   // anchor.setProvider(config.chainInfo[chainId].nodeRpc)
        //   // const token = Token(tokenpublicKey)
        //   // const token = Token(config.chainInfo[chainId].nodeRpc)
        //   // console.log(await connection.sendTransaction(tx, [base58publicKey]))
        //   // console.log(Token.createAssociatedTokenAccountInstruction())
        //   // console.log(token.transaction.approve())
        // } catch (error) {
        //   console.log(error)
        // }
        // getSolanaInfo(chainId, 'getTokenAccountBalance', [account]).then((res:any) => {
        if (acctontToToken) {
          getSolanaInfo(chainId, 'getTokenAccountBalance', [acctontToToken.toBase58()]).then((res:any) => {
            resolve(res)
          }).catch((err:any) => {
            console.log(err)
            resolve('')
          })
        } else {
          resolve('')
        }
      } else {
        resolve('')
      }
    })
  }, [])

  const getSolTokenInfo = useCallback(({chainId, account}: {chainId: any, account:string|null|undefined}) => {
    return new Promise(async(resolve) => {
      if (chainId && account) {
        // const base58publicKey = new solanaWeb3.PublicKey(account)
        // const tokenpublicKey = new solanaWeb3.PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
        // const tokenpublicKey = Buffer.from('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
        // console.log(tokenpublicKey)
        // const programAddressFromKey = await solanaWeb3.PublicKey.createProgramAddress([tokenpublicKey], base58publicKey)
        // console.log(programAddressFromKey)
        // getSolanaInfo(chainId, 'getAccountInfo', [account, {
        getSolanaInfo(chainId, 'getAccountInfo', ['GkzTnqZSasjZ5geL4cbvPErNVB9xWby4zYN7hpW5k5iX', {
          "encoding": "jsonParsed"
        }]).then((res:any) => {
          resolve(res)
        }).catch((err:any) => {
          console.log(err)
          resolve('')
        })
      } else {
        resolve('')
      }
    })
  }, [])

  return {
    getSolBalance,
    getSolTokenBalance,
    getSolTokenInfo
  }
}

export function useSolAllowance(
  token: string | null | undefined,
  spender: string | null | undefined,
  chainId: string | null | undefined,
  account: string | null | undefined,
) {
  const setSolAllowance = useCallback((): Promise<any> => {
    return new Promise(async(resolve, reject) => {
      if (token && spender && account && chainId) {
        resolve('')
      } else {
        reject('')
      }
    })
  }, [token, spender, account, chainId])

  const getSolAllowance = useCallback(() => {
    return new Promise(async(resolve): Promise<any> => {
      resolve('')
    })
  }, [account, chainId, token, spender])

  return {
    setSolAllowance,
    getSolAllowance,
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
export function getSolTxnsStatus (txid:string, chainId:any) {
  return new Promise(resolve => {
    const data:TxDataResult = {
      msg: State.Null,
      info: '',
      error: ''
    }
    if (txid) {
      getSolanaInfo(chainId, 'getTransaction', [txid, "json"]).then((res:any) => {
        // console.log(res)
        if (res?.result?.meta?.status?.Ok === null) {
          data.msg = State.Success
          data.info = res?.result
        } else if (res?.result?.meta?.status?.Err) {
          data.msg = State.Failure
          data.error = 'Txns is failure!'
        } else {
          data.msg = State.Null
          data.error = 'Query is empty!'
        }
        resolve(data)
      }).catch((err:any) => {
        console.log(err)
        data.msg = State.Null
        data.error = 'Query is empty!'
        resolve(data)
      })
    }
  })
}

// getSolTxnsStatus('3SxanA7YwydbnkJLZPjwtDYQCeAmiQ3YYNTFshk54u56t2XvDkEj2Ed65BAAzZv4QWNvUw3fA23VBQNGuZWy3tbt', 'SOL_TEST').then(res => {
//   console.log(res)
// })

export function useSolCrossChain (
  routerToken: string | null | undefined,
  inputToken: string | null | undefined,
  selectCurrency: any,
  selectChain: any,
  receiveAddress: string | null | undefined,
  typedValue: string | undefined,
  destConfig: any,
): {
  inputError?: string
  balance?: any,
  execute?: undefined | (() => Promise<void>)
} {
  const { account, chainId } = useActiveReact()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()
  const {getAccount} = useSolCreateAccount()

  const balance = useTokensBalance(selectCurrency?.address, selectCurrency?.decimals, chainId)

  const inputAmount = useMemo(() => tryParseAmount3(typedValue, selectCurrency?.decimals), [typedValue, selectCurrency])

  return useMemo(() => {
    if (!chainId || !selectCurrency || !receiveAddress) return {}

    const sufficientBalance = typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))

    return {
      balance: '',
      execute: (sufficientBalance || !VALID_BALANCE) && inputAmount
      ?async () => {
        try {
          const contract = new Program(solRouter, routerToken, config.chainInfo[chainId].nodeRpc)
          let routeraccount = await solanaWeb3.PublicKey.findProgramAddress([Buffer.from('Router')], new solanaWeb3.PublicKey(routerToken))
          routeraccount = routeraccount[0]
          let instruction:any
          // console.log(contract)
          // console.log(routeraccount)
          if (destConfig.routerABI.indexOf('anySwapOutNative') !== -1) { // anySwapOutNative
            instruction = await contract.instruction.swapoutNative(
              receiveAddress,
              new anchor.BN(inputAmount),
              new anchor.BN(selectChain),
              {
                accounts: {
                  signer: account,
                  routerAccount: routeraccount,
                  systemProgram: solanaWeb3.SystemProgram.programId,
                },
              }
            );
          } else if (destConfig.routerABI.indexOf('anySwapOutUnderlying') !== -1) { // anySwapOutUnderlying
            const acctontToToken = await getAccount(account, inputToken)
            instruction = await contract.instruction.swapoutBurn(
              receiveAddress,
              new anchor.BN(inputAmount),
              new anchor.BN(selectChain),
              {
                accounts: {
                  signer: account,
                  routerAccount: routeraccount,
                  from: acctontToToken,
                  mint: inputToken,
                  tokenProgram: TOKEN_PROGRAM_ID
                },
              }
            );
          } else if (destConfig.routerABI.indexOf('anySwapOut') !== -1) { // anySwapOut
            const acctontToToken = await getAccount(account, inputToken)
            const routerToToken = await getAccount(routeraccount, inputToken)
            instruction = await contract.instruction.swapoutTransfer(
              receiveAddress,
              new anchor.BN(inputAmount),
              new anchor.BN(selectChain),
              {
                accounts: {
                  signer: account,
                  routerAccount: routeraccount,
                  from: acctontToToken,
                  to: routerToToken,
                  mint: inputToken,
                  tokenProgram: TOKEN_PROGRAM_ID
                },
              }
            );
          }
          // console.log(contract)
          // console.log(instruction)
          const connection = new solanaWeb3.Connection(config.chainInfo[chainId].nodeRpc)
          const result = await connection.getLatestBlockhash()
          // const result = await connection.getConfirmedBlock(blockNumber)
          console.log(result)
          const tx = new solanaWeb3.Transaction().add(instruction)
          tx.lastValidBlockHeight = result.lastValidBlockHeight;
          tx.recentBlockhash = result.blockhash;
          tx.feePayer = new solanaWeb3.PublicKey(account)
          console.log(tx)
          const tsResult = await window?.solana?.signAndSendTransaction(tx)
          console.log(tsResult)
          const txReceipt = {hash: tsResult.signature}
          if (txReceipt?.hash) {
            const data:any = {
              hash: txReceipt.hash,
              chainId: chainId,
              selectChain: selectChain,
              account: account,
              value: inputAmount,
              formatvalue: typedValue,
              to: receiveAddress,
              symbol: selectCurrency?.symbol,
              version: destConfig.type,
              pairid: selectCurrency?.symbol,
              routerToken: routerToken
            }
            addTransaction(txReceipt, {
              summary: `Cross bridge ${typedValue} ${selectCurrency?.symbol}`,
              value: typedValue,
              toChainId: selectChain,
              toAddress: receiveAddress.indexOf('0x') === 0 ? receiveAddress?.toLowerCase() : receiveAddress,
              symbol: selectCurrency?.symbol,
              version: destConfig.type,
              routerToken: routerToken,
              token: selectCurrency?.address,
              logoUrl: selectCurrency?.logoUrl,
              isLiquidity: destConfig?.isLiquidity,
              fromInfo: {
                symbol: selectCurrency?.symbol,
                name: selectCurrency?.name,
                decimals: selectCurrency?.decimals,
                address: selectCurrency?.address,
              },
              toInfo: {
                symbol: destConfig?.symbol,
                name: destConfig?.name,
                decimals: destConfig?.decimals,
                address: destConfig?.address,
              },
            })
            recordsTxns(data)
            onChangeViewDtil(txReceipt?.hash, true)
            // const tsResult = await window?.solana?.signTransaction(tx1)
          }
        } catch (error) {
          onChangeViewErrorTip(error, true)
        }
      } : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: selectCurrency?.symbol})
    }
  }, [routerToken, inputToken, chainId, selectCurrency, selectChain, receiveAddress, typedValue, destConfig, account, inputAmount, balance])
}

// enum SwapType {
//   withdraw = 'withdraw',
//   deposit = 'deposit',
// }

// export function useSolSwapPoolCallback(
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

//         console.log(1)
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

// export function useSolPoolDatas () {
//   const getSolPoolDatas = useCallback(async(calls: Array<[PoolCalls]>, chainId: string | null | undefined): Promise<PoolResult> => {
//     console.log(calls)
//     console.log(chainId)
//     return {
//       'anytoken': {
//         balanceOf: '',
//         totalSupply: '',
//         balance: '',
//       }
//     }
//   }, [])
//   return {
//     getSolPoolDatas
//   }
// }