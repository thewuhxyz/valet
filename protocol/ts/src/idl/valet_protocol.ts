export type ValetProtocol = {
  "version": "0.1.0",
  "name": "valet_protocol",
  "instructions": [
    {
      "name": "createWalletAccount",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "walletDelegate",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "walletAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "walletSigner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "accountSeeds",
          "type": "string"
        }
      ]
    },
    {
      "name": "signInstructionSingleSigner",
      "accounts": [
        {
          "name": "walletAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "walletSigner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "walletDelegate",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "instructionProgramId",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "instructionData",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "signInstructionMultipleSigners",
      "accounts": [
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "instructionProgramId",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "instructionData",
          "type": "bytes"
        },
        {
          "name": "uniqueSigners",
          "type": "u8"
        }
      ]
    },
    {
      "name": "transferDelegate",
      "accounts": [
        {
          "name": "walletAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "walletSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "newWalletDelegate",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "walletDelegate",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "walletAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "walletDelegate",
            "type": "publicKey"
          },
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "accountBump",
            "type": "u8"
          },
          {
            "name": "signerBump",
            "type": "u8"
          },
          {
            "name": "delegateTransferred",
            "type": "bool"
          }
        ]
      }
    }
  ]
};

export const IDL: ValetProtocol = {
  "version": "0.1.0",
  "name": "valet_protocol",
  "instructions": [
    {
      "name": "createWalletAccount",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "walletDelegate",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "walletAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "walletSigner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "accountSeeds",
          "type": "string"
        }
      ]
    },
    {
      "name": "signInstructionSingleSigner",
      "accounts": [
        {
          "name": "walletAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "walletSigner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "walletDelegate",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "instructionProgramId",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "instructionData",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "signInstructionMultipleSigners",
      "accounts": [
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "instructionProgramId",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "instructionData",
          "type": "bytes"
        },
        {
          "name": "uniqueSigners",
          "type": "u8"
        }
      ]
    },
    {
      "name": "transferDelegate",
      "accounts": [
        {
          "name": "walletAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "walletSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "newWalletDelegate",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "walletDelegate",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "walletAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "walletDelegate",
            "type": "publicKey"
          },
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "accountBump",
            "type": "u8"
          },
          {
            "name": "signerBump",
            "type": "u8"
          },
          {
            "name": "delegateTransferred",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
