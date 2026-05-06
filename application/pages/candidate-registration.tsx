import React, { useContext, useState, useEffect } from 'react'
import { Backdrop, MenuItem, Select, Grid, TextField, CircularProgress, Button, Typography, List, ListItem, ListItemText, Slide, Alert } from '@mui/material'
import { VoteCounterCard } from '../components'
import { StyledList, StyledTextField, StyledListItem, StyledMenuItem, StyledSuccessBox } from '../styles/newElectionStyle'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { StyledSelect, StyledChildBox, StyledSubmitBtn, StyledTypography } from '../styles/newElectionStyle';
import { AuthorityContext } from '../context/AuthorityContext';
import { useWalletConnector } from '../context/WalletConnectionContext';
import { useRouter } from 'next/router';
import CancelIcon from '@mui/icons-material/Cancel';

function CandidateRegistration() {
    const { upComingElection, isCandidateRegistered, registerCandidateCall, isCandidateRegistrationLoading } = useContext(AuthorityContext);
    const { isAdminWalletConnected, isWalletConnectionLoading } = useWalletConnector();
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [candidateDetails, setCandidateDetails] = useState({
        name: "",
        nid: "",
        symbolName: "",
        email: "",
        electionID: ""
    });

    // Authorization check - redirect non-admin users
    useEffect(() => {
        if (!isWalletConnectionLoading) {
            if (!isAdminWalletConnected) {
                router.replace('/dashboard');
            }
        }
    }, [isAdminWalletConnected, isWalletConnectionLoading, router]);

    const handleOnChange = (e: any) => {
        const { value, name } = e.target;
        setCandidateDetails({
            ...candidateDetails,
            [name]: value
        })
    }

    const handleOnFileUpload = (e: any) => {
        setFile(e.target.files[0]);
    }

    const handleOnSubmit = async () => {
        if (!file) {
            setSuccessMessage('Please select a candidate symbol image');
            setTimeout(() => setSuccessMessage(''), 3000);
            return;
        }

        if (!candidateDetails.electionID || !candidateDetails.name.trim() || !candidateDetails.nid || !candidateDetails.symbolName.trim()) {
            setSuccessMessage('Please fill all required fields');
            setTimeout(() => setSuccessMessage(''), 3000);
            return;
        }

        try {
            await registerCandidateCall({
                ...candidateDetails,
                electionID: Number(candidateDetails.electionID),
            }, file);
            setSuccessMessage('Candidate registered successfully!');
            // Reset form after 2 seconds
            setTimeout(() => {
                setCandidateDetails({
                    name: "",
                    nid: "",
                    symbolName: "",
                    email: "",
                    electionID: ""
                });
                setFile(null);
                setSuccessMessage('');
            }, 2000);
        } catch (error) {
            setSuccessMessage('Error registering candidate. Please try again.');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    }

    const handleSuccessClose = () => {
        setSuccessMessage('');
        setCandidateDetails({
            name: "",
            nid: "",
            symbolName: "",
            email: "",
            electionID: ""
        });
        setFile(null);
    }

    // Show loading while checking authorization
    if (isWalletConnectionLoading) {
        return (
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                <CircularProgress sx={{ color: "gray" }} />
            </Backdrop>
        );
    }

    // Show error if not admin
    if (!isAdminWalletConnected) {
        return (
            <Grid sx={{ justifyContent: 'center', paddingTop: 8 }} container>
                <Grid item md={12}>
                    <Alert severity="error" sx={{ m: 2 }}>
                        Access Denied: Only election administrators can register candidates.
                    </Alert>
                </Grid>
            </Grid>
        );
    }



    return (
        <>
            <Grid sx={{ justifyContent: 'space-around', paddingTop: 8 }} container>
                <Grid item md={12}>
                    <Typography sx={{ textAlign: 'center', fontWeight: 'bold', color: 'white', paddingBottom: 10 }} variant='h5'> Register Candidates</Typography>
                </Grid>
                <Grid item mx={6}>
                    <StyledList>
                        <StyledListItem sx={{ listStyle: 'none' }}><WarningAmberRoundedIcon sx={{ fontSize: 70, color: 'red' }} /><Typography variant='h4' sx={{ fontWeight: 'bold', color: 'red' }}>Be careful</Typography></StyledListItem>
                        <StyledListItem>
                            <ListItemText>Please be sure before register Candidates</ListItemText>
                        </StyledListItem>
                        <StyledListItem>
                            <ListItemText>You can&apos;t modify after confirmation.</ListItemText></StyledListItem>
                        <StyledListItem>
                            <ListItemText>Only authorized person have rights to register Candidates.</ListItemText>
                        </StyledListItem>
                    </StyledList>
                </Grid>
                <Grid item mx={6}>
                    <StyledChildBox>
                        <StyledTypography>Please select one election</StyledTypography>
                        <StyledSelect
                            onChange={handleOnChange}
                            value={candidateDetails.electionID}
                            name='electionID'
                            displayEmpty
                        >
                            <StyledMenuItem value={""} disabled><em>Please Select one Election</em></StyledMenuItem>
                            {
                                upComingElection.map((elections: any, index: any) => {
                                    const { election, electionId } = elections
                                    const { name } = election
                                    return <StyledMenuItem value={electionId} key={index}>{name}</StyledMenuItem>
                                })
                            }
                        </StyledSelect>
                    </StyledChildBox>

                    <StyledChildBox>
                        <StyledTypography>Candidate&apos;s Name</StyledTypography>
                        <StyledTextField onChange={handleOnChange} name='name' placeholder='Enter candidate name' type='text' />
                    </StyledChildBox>
                    <StyledChildBox>
                        <StyledTypography>Enter Candidate NID</StyledTypography>
                        <StyledTextField onChange={handleOnChange} name='nid' type='number' placeholder='NID number' />
                    </StyledChildBox>
                    <StyledChildBox>
                        <StyledTypography>Choose Symbol PNG</StyledTypography>
                        <StyledTextField onChange={handleOnFileUpload} type='file' />
                    </StyledChildBox>
                    <StyledChildBox>
                        <StyledTypography>Enter Symbol Name</StyledTypography>
                        <StyledTextField onChange={handleOnChange} name='symbolName' type='text' placeholder='Enter symbol name' />
                    </StyledChildBox>
                    <StyledSubmitBtn onClick={handleOnSubmit} sx={{ bgcolor: 'green!important' }}>Register Candidate</StyledSubmitBtn>
                </Grid>
            </Grid>

            <Slide direction="up" in={!!successMessage} mountOnEnter unmountOnExit>
                <StyledSuccessBox>
                    <Typography color={'white'}>{successMessage}</Typography>
                    <CancelIcon sx={{ cursor: 'pointer' }} onClick={handleSuccessClose} />
                </StyledSuccessBox>
            </Slide>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isCandidateRegistrationLoading ?? false}>
                <CircularProgress sx={{ color: "gray" }} />
            </Backdrop>
        </>
    )
}

export default CandidateRegistration