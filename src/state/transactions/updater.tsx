import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import {updateTerraHash} from '../../hooks/terra'
import { useActiveReact } from '../../hooks/useActiveReact'
import { useAddPopup, useBlockNumber } from '../application/hooks'
import { AppDispatch, AppState } from '../index'
import { checkedTransaction, finalizeTransaction, updateTransaction } from './actions'
import {useHashSwapInfo} from './hooks'

import useInterval from '../../hooks/useInterval'

import {TERRA_MAIN_CHAINID} from '../../config/chainConfig/terra'

export function shouldCheck(
  lastBlockNumber: number,
  tx: { addedTime: number; receipt?: {}; lastCheckedBlockNumber?: number }
): boolean {
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9
  } else if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  } else {
    // otherwise every block
    return true
  }
}
const END_STATUS = [1, 3, 10, 16,-2]
export default function Updater(): null {
  const { library } = useActiveWeb3React()
  const { chainId } = useActiveReact()

  const lastBlockNumber = useBlockNumber()

  const dispatch = useDispatch<AppDispatch>()
  const state = useSelector<AppState, AppState['transactions']>(state => state.transactions)

  const transactions = chainId ? state[chainId] ?? {} : {}

  // show popup on confirm
  const addPopup = useAddPopup()

  const updateNonEVMTxns = useCallback(() => {
    if (chainId === TERRA_MAIN_CHAINID) {
      Object.keys(transactions)
      .filter(hash => {
        const tx = transactions[hash]
        // if (tx.receipt) return false
        if (tx.info && END_STATUS.includes(tx.info.status)) return false
        return true
      })
      .forEach(hash => {
        console.log(hash)
        const tx = transactions[hash]
        if (!tx.receipt) {
          updateTerraHash(hash).then((receipt:any) => {
            console.log(receipt)
            if (receipt && !receipt.error) {
              dispatch(
                finalizeTransaction({
                  chainId,
                  hash,
                  receipt: {
                    blockHash: '',
                    blockNumber: receipt.height,
                    contractAddress: '',
                    from: tx.from,
                    status: receipt.code ? 0 : 1,
                    to: tx.toAddress,
                    transactionHash: hash,
                    transactionIndex: ''
                  }
                })
              )
              addPopup(
                {
                  txn: {
                    hash,
                    success: !receipt.code,
                    summary: transactions[hash]?.summary
                  }
                },
                hash
              )
            }
          })
        } else if (
          !(tx.info && END_STATUS.includes(tx?.info?.status))
          && (tx.receipt.status === 1 || typeof tx.receipt?.status === 'undefined')
        )  {
          useHashSwapInfo(hash).then((receipt:any) => {
            if (receipt && receipt.msg === 'Success' && receipt.info) {
              dispatch(
                updateTransaction({
                  chainId,
                  hash,
                  info: {
                    ...receipt.info
                  }
                })
              )
            }
          })
        }
        // else {
        //   dispatch(
        //     updateTransaction({
        //       chainId,
        //       hash,
        //       info: ''
        //     })
        //   )
        // }
      })
    }
  }, [chainId, transactions])

  useInterval(updateNonEVMTxns, 1000 * 10)

  useEffect(() => {
    if (!chainId || !library || !lastBlockNumber || isNaN(chainId)) return
    Object.keys(transactions)
      .filter(hash => shouldCheck(lastBlockNumber, transactions[hash]))
      .forEach(hash => {
        const tx = transactions[hash]
        if (!tx.receipt) {
          library
            .getTransactionReceipt(hash)
            .then(receipt => {
              if (receipt) {
                dispatch(
                  finalizeTransaction({
                    chainId,
                    hash,
                    receipt: {
                      blockHash: receipt.blockHash,
                      blockNumber: receipt.blockNumber,
                      contractAddress: receipt.contractAddress,
                      from: receipt.from,
                      status: receipt.status,
                      to: receipt.to,
                      transactionHash: receipt.transactionHash,
                      transactionIndex: receipt.transactionIndex
                    }
                  })
                )

                addPopup(
                  {
                    txn: {
                      hash,
                      success: receipt.status === 1,
                      summary: transactions[hash]?.summary
                    }
                  },
                  hash
                )
              } else {
                dispatch(checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber }))
              }
            })
            .catch(error => {
              console.error(`failed to check transaction hash: ${hash}`, error)
            })
        } else if (
          !tx.info
          && (tx.receipt.status === 1 || typeof tx.receipt?.status === 'undefined')
        )  {
          useHashSwapInfo(hash).then((receipt:any) => {
            if (receipt && receipt.msg === 'Success' && receipt.info) {
              dispatch(
                updateTransaction({
                  chainId,
                  hash,
                  info: {
                    ...receipt.info
                  }
                })
              )
            }
          })
        }
      })
  }, [chainId, library, transactions, lastBlockNumber, dispatch, addPopup])

  return null
}
