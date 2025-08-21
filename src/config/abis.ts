// ABIs pour les contrats Signal Garden

export const PIXEL_GARDEN_ABI = [
  {
    inputs: [
      { name: 'x', type: 'uint32' },
      { name: 'y', type: 'uint32' },
      { name: 'pixelType', type: 'uint8' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'setPixel',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'x', type: 'uint32' },
      { name: 'y', type: 'uint32' }
    ],
    name: 'getPixel',
    outputs: [
      { name: 'pixelType', type: 'uint8' },
      { name: 'signalStake', type: 'uint256' },
      { name: 'atomStake', type: 'uint256' },
      { name: 'tripleStake', type: 'uint256' },
      { name: 'totalStake', type: 'uint256' },
      { name: 'lastUpdate', type: 'uint64' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'width',
    outputs: [{ name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'height',
    outputs: [{ name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const

export const TRUST_TOKEN_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const
