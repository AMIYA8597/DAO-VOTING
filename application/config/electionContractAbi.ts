const ELECTION_CONTRACT_ABI = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            { internalType: "string", name: "_electionName", type: "string" },
            { internalType: "uint256", name: "_startTime", type: "uint256" },
            { internalType: "uint256", name: "_endTime", type: "uint256" },
            { internalType: "uint256", name: "_currentTimeStamp", type: "uint256" },
        ],
        name: "createElection",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "getElections",
        outputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "bytes32", name: "hash", type: "bytes32" },
                    { internalType: "uint256", name: "startTime", type: "uint256" },
                    { internalType: "uint256", name: "endTime", type: "uint256" },
                    {
                        components: [
                            { internalType: "string", name: "name", type: "string" },
                            { internalType: "uint256", name: "nid", type: "uint256" },
                            { internalType: "string", name: "symbolName", type: "string" },
                            { internalType: "string", name: "symbolImg", type: "string" },
                            { internalType: "uint256", name: "votes", type: "uint256" },
                            { internalType: "bytes32", name: "hash", type: "bytes32" },
                        ],
                        internalType: "struct ElectionContract.Candidate[]",
                        name: "candidates",
                        type: "tuple[]",
                    },
                    {
                        components: [
                            { internalType: "string", name: "name", type: "string" },
                            { internalType: "uint256", name: "nid", type: "uint256" },
                            { internalType: "bool", name: "votingStatus", type: "bool" },
                            { internalType: "bytes32", name: "hash", type: "bytes32" },
                        ],
                        internalType: "struct ElectionContract.Voter[]",
                        name: "voters",
                        type: "tuple[]",
                    },
                ],
                internalType: "struct ElectionContract.Election[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_electionId", type: "uint256" },
            { internalType: "uint256", name: "_voterNid", type: "uint256" },
        ],
        name: "getVoterHash",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_electionId", type: "uint256" },
            { internalType: "bytes32", name: "_voterHash", type: "bytes32" },
            { internalType: "bytes32", name: "_candidateHash", type: "bytes32" },
            { internalType: "uint256", name: "_currentTimeStamp", type: "uint256" },
        ],
        name: "giveVote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_electionId", type: "uint256" },
            { internalType: "string", name: "_name", type: "string" },
            { internalType: "uint256", name: "_nid", type: "uint256" },
            { internalType: "string", name: "_symbolName", type: "string" },
            { internalType: "string", name: "_symbolImg", type: "string" },
            { internalType: "uint256", name: "_currentTimeStamp", type: "uint256" },
        ],
        name: "registerCandidate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_electionId", type: "uint256" },
            { internalType: "string", name: "_name", type: "string" },
            { internalType: "uint256", name: "_nid", type: "uint256" },
            { internalType: "uint256", name: "_currentTimeStamp", type: "uint256" },
        ],
        name: "registerVoter",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;

export default ELECTION_CONTRACT_ABI;