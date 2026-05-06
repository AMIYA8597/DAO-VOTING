import { useContract, useContractRead, useContractWrite, useStorageUpload } from "@thirdweb-dev/react";
import React, { useEffect, useCallback, createContext, useContext, useState } from "react";
import emailjs from '@emailjs/browser';
import { APP_CONTRACT_ADDRESS } from "../config/blockchain";
import ELECTION_CONTRACT_ABI from "../config/electionContractAbi";

export type AuthorityContextValue = {
    previousElection: any[];
    onGoingElection: any[];
    upComingElection: any[];
    isElectionListLoading: boolean;
    isContractConfigured: boolean;
    isBallotInitialized: boolean | undefined;
    isBallotLoading: boolean;
    initializeBallot: (value: { name: string; startTime: number; endTime: number }) => Promise<void>;
    isVoterRegistered: boolean | undefined;
    registerVoterCall: (value: { electionID: number; name: string; nid: string; email: string }) => Promise<void>;
    isVoterRegistrationLoading: boolean;
    isVoterEmailSent: boolean | undefined;
    setIsVoterEmailSent: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    registerCandidateCall: (
        value: { name: string; nid: string; email: string; electionID: number; symbolName: string },
        file: File,
    ) => Promise<void>;
    isCandidateRegistrationLoading: boolean;
    isCandidateRegistered: boolean | undefined;
    setSelectedElection: (data: SelectedElectionData) => void;
    selectedElectionData: SelectedElectionData;
    getElectionCandidate: (electionID: any) => void;
    selectedElectionCandidate: any[];
    giveVoteCall: (_electionId: number, _voterHash: any, _candidateHash: any) => Promise<void>;
    voteCountStatus: boolean;
    setVoteCountStatus: React.Dispatch<React.SetStateAction<boolean>>;
    isGivingVoteProcessLoading: boolean | undefined;
};

export type SelectedElectionData = {
    electionId: number;
    electionName: string;
    startTime: number;
    endTime: number;
};

type ElectionFormValues = {
    name: string;
    startTime: number;
    endTime: number;
};

type VoterFormValues = {
    electionID: number;
    name: string;
    nid: string;
    email: string;
};

type CandidateFormValues = {
    name: string;
    nid: string;
    email: string;
    electionID: number;
    symbolName: string;
};

export const AuthorityContext = createContext<AuthorityContextValue>({} as AuthorityContextValue);


interface ChildrenType {
    children: React.ReactNode
}

export const AuthorityContextProvider = ({ children }: ChildrenType) => {
    const contractAddress = APP_CONTRACT_ADDRESS || undefined;
    const { contract } = useContract(contractAddress, ELECTION_CONTRACT_ABI);
    const isContractConfigured = Boolean(APP_CONTRACT_ADDRESS);
    const [isBallotInitialized, setIsBallotInitialized] = useState<boolean>();
    const [isVoterRegistered, setIsVoterRegistered] = useState<boolean>();
    const [isVoterEmailSent, setIsVoterEmailSent] = useState<boolean>();
    const [isCandidateRegistered, setIsCandidateRegistered] = useState<boolean>();
    const [selectedElectionData, setSelectedElectionData] = useState<SelectedElectionData>({} as SelectedElectionData);
    const [allElectionList, setAllElectionList] = useState<any[]>([]);
    const [selectedElectionCandidate, setSelectedElectionCandidate] = useState<any[]>([]);
    const [voteCountStatus, setVoteCountStatus] = useState<boolean>(false);
    const [isGivingVoteProcessLoading, setIsGivingVoteProcessLoading] = useState<boolean>();
    //filtered election type
    const [onGoingElection, setOngoingElection] = useState<any[]>([]);
    const [previousElection, setPreviousElection] = useState<any[]>([]);
    const [upComingElection, setUpComingElection] = useState<any[]>([]);

    //voter hash finder state
    const [details, setDetails] = useState({
        electionID: null as number | null,
        nid: null as string | null,
        email: '',
        name: ''
    });


    //All elections
    const { data: electionList, isLoading: isElectionListLoading } = useContractRead(contract, "getElections");


    useEffect(() => {
        if (!electionList || !Array.isArray(electionList)) {
            return;
        }

        //make array empty
        const prev: any[] = [];
        const ongoing: any[] = [];
        const upcoming: any[] = [];

        try {
            setAllElectionList(electionList);
            electionList?.forEach((election: any, index: number) => {
                //filter election list
                const { startTime, endTime } = election;
                const timeStamp = Date.now();

                const startTimeMs = typeof startTime === 'object' && startTime.toNumber ? startTime.toNumber() : Number(startTime);
                const endTimeMs = typeof endTime === 'object' && endTime.toNumber ? endTime.toNumber() : Number(endTime);

                if (timeStamp > endTimeMs) {
                    prev.push({ electionId: index, election })

                } else if (timeStamp < startTimeMs) {
                    upcoming.push({ electionId: index, election })
                } else {
                    ongoing.push({ electionId: index, election })
                }
            });

            setPreviousElection(prev);
            setOngoingElection(ongoing);
            setUpComingElection(upcoming);
        } catch (err) {
            console.error('Error processing election list:', err);
        }
    }, [electionList])



    //initialize ballot
    const { mutateAsync: createElection, isLoading: isBallotLoading } = useContractWrite(contract, "createElection");
    const initializeBallot = async (value: ElectionFormValues) => {
        if (!isContractConfigured) {
            throw new Error('Contract address is not configured. Set NEXT_PUBLIC_CONTRACT_ADDRESS (or NEXT_PUBLIC_CONTRACT_KEY) before creating an election.');
        }

        try {
            const { name, startTime, endTime } = value
            await createElection({ args: [name, startTime, endTime, Date.now()] });
            setIsBallotInitialized(true);
            return;
        } catch (err) {
            setIsBallotInitialized(false);
            throw err;
        }
    }


    //register voters
    const { mutateAsync: registerVoter, isLoading: isVoterRegistrationLoading } = useContractWrite(contract, "registerVoter");

    // Only call getVoterHash when we have valid details to avoid encoding null into BigNumber
    const voterHashArgs = details.electionID !== null && details.nid ? [details.electionID, details.nid] : undefined;
    const { data: voterHash, isLoading: isVoterHashFinderLoading } = useContractRead(contract, "getVoterHash", voterHashArgs as any);

    const sendEmailWithHash = useCallback((hash: any) => {
        const emailData = {
            to_email: details.email,
            from_name: 'Decentralized Voting System',
            to_name: details.name,
            message: hash
        };

        emailjs.send(
            process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID!,
            process.env.NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID!,
            emailData,
            process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY
        ).then((result) => {
            setIsVoterEmailSent(true);
        }, (error) => {
            console.log("Email sending error: ", error);
        })
    }, [details.email, details.name]);

    const registerVoterCall = async (value: VoterFormValues) => {
        if (!isContractConfigured) {
            throw new Error('Contract address is not configured. Set NEXT_PUBLIC_CONTRACT_ADDRESS (or NEXT_PUBLIC_CONTRACT_KEY) before registering voters.');
        }

        try {
            const { electionID, name, nid, email } = value;
            await registerVoter({ args: [electionID, name, nid, Date.now()] });
            setDetails({ electionID, nid, email, name });
        } catch (err) {
            setIsVoterRegistered(false);
            throw err;
        }


    }


    useEffect(() => {
        if (!isVoterHashFinderLoading && voterHash != undefined) {
            sendEmailWithHash(voterHash)
        }
    }, [voterHash, isVoterHashFinderLoading, sendEmailWithHash])

    //register candidates
    const { mutateAsync: registerCandidate, isLoading: isCandidateRegistrationLoading } = useContractWrite(contract, "registerCandidate")
    const registerCandidateCall = async (value: CandidateFormValues, file: File) => {
        if (!isContractConfigured) {
            throw new Error('Contract address is not configured. Set NEXT_PUBLIC_CONTRACT_ADDRESS (or NEXT_PUBLIC_CONTRACT_KEY) before registering candidates.');
        }

        try {
            const { name, nid, email, electionID, symbolName } = value;
            const symbolUrl = await uploadFile(file);
            await registerCandidate({ args: [electionID, name, nid, symbolName, symbolUrl[0], Date.now()] });
            setIsCandidateRegistered(true);
        } catch (err) {
            setIsCandidateRegistered(false);
            throw err;
        }
    }

    //upload file to IPFS
    const { mutateAsync: upload } = useStorageUpload();
    const uploadFile = async (file: File) => {
        const uploadData = [file];
        const uris = await upload({ data: uploadData });
        return uris;
    }


    //selected data
    const setSelectedElection = (data: SelectedElectionData) => {
        console.log(data);
        setSelectedElectionData(data);
    }

    //get election candidate
    const getElectionCandidate = (electionID: any) => {
        allElectionList?.map((election: any, index: number) => {
            const { hash, candidates } = election;
            if (index == electionID) {
                return setSelectedElectionCandidate(candidates);
            }
        })
    }



    //give vote
    const { mutateAsync: giveVote, isLoading } = useContractWrite(contract, "giveVote");
    const giveVoteCall = async (_electionId: number, _voterHash: any, _candidateHash: any) => {
        if (!isContractConfigured) {
            throw new Error('Contract address is not configured. Set NEXT_PUBLIC_CONTRACT_ADDRESS (or NEXT_PUBLIC_CONTRACT_KEY) before casting votes.');
        }

        // Validate inputs before sending to contract to avoid encoding null/undefined
        if (typeof _electionId !== 'number' || Number.isNaN(_electionId)) {
            throw new Error('Invalid election id provided for voting.');
        }
        if (!_voterHash) {
            throw new Error('Voter hash is required to cast a vote.');
        }
        if (!_candidateHash) {
            throw new Error('Candidate hash is required to cast a vote.');
        }

        setIsGivingVoteProcessLoading(true);
        try {
            await giveVote({ args: [_electionId, _voterHash, _candidateHash, Date.now()] });
            setVoteCountStatus(true);
        } catch (err) {
            setVoteCountStatus(false);
            throw err;
        } finally {
            setIsGivingVoteProcessLoading(false);
        }
    }



    return <AuthorityContext.Provider value={{
        previousElection,
        onGoingElection,
        upComingElection,
        isElectionListLoading,
        isContractConfigured,
        isBallotInitialized,
        isBallotLoading,
        initializeBallot,
        isVoterRegistered,
        registerVoterCall,
        isVoterRegistrationLoading,
        isVoterEmailSent,
        setIsVoterEmailSent,
        registerCandidateCall,
        isCandidateRegistrationLoading,
        isCandidateRegistered,
        setSelectedElection,
        selectedElectionData,
        getElectionCandidate,
        selectedElectionCandidate,
        giveVoteCall,
        voteCountStatus,
        setVoteCountStatus,
        isGivingVoteProcessLoading,
    }}>
        {children}
    </AuthorityContext.Provider>
}