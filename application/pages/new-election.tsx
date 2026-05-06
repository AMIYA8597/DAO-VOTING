import { Grid, ListItem, List, Box, TextField, Typography, ListItemText, Backdrop, CircularProgress, Slide, Alert } from '@mui/material'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { StyledChildBox, StyledList, StyledListItem, StyledSubmitBtn, StyledSuccessBox, StyledTextField, StyledTypography } from '../styles/newElectionStyle'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { AuthorityContext } from '../context/AuthorityContext';
import CancelIcon from '@mui/icons-material/Cancel';
import { useWalletConnector } from '../context/WalletConnectionContext';
import { useRouter } from 'next/router';


function NewElection() {
    const { isBallotInitialized, isBallotLoading, initializeBallot, isContractConfigured } = useContext(AuthorityContext)
    const { isAdminWalletConnected, isWalletConnectionLoading } = useWalletConnector();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [electionState, setElectionState] = useState({
        name: '',
        startTime: null as number | null,
        endTime: null as number | null
    });
    const [successMessage, setSuccessMessage] = useState('');

    const currentDateTimeMin = useMemo(() => new Date().toISOString().slice(0, 16), []);

    // Authorization check - redirect non-admin users
    useEffect(() => {
        if (!isWalletConnectionLoading) {
            if (!isAdminWalletConnected) {
                router.replace('/dashboard');
            }
        }
    }, [isAdminWalletConnected, isWalletConnectionLoading, router]);

    const handleNameChange = (e: any) => {
        const { value, name } = e.target;
        setElectionState((current) => ({
            ...current,
            [name]: value
        }))
    }

    const handleTimeChange = (e: any) => {
        const { value, name } = e.target;
        setElectionState((current) => ({
            ...current,
            [name]: value ? new Date(value).getTime() : null,
        }))
    }

    const handleOnSubmitBtn = async () => {
        if (isSubmitting || isBallotLoading || !isContractConfigured) {
            return;
        }

        if (
            !electionState.name.trim() ||
            typeof electionState.startTime !== 'number' ||
            !Number.isFinite(electionState.startTime) ||
            typeof electionState.endTime !== 'number' ||
            !Number.isFinite(electionState.endTime)
        ) {
            setSuccessMessage('Please fill in the election name, start time, and end time.');
            setTimeout(() => setSuccessMessage(''), 3000);
            return;
        }

        if (electionState.endTime <= electionState.startTime) {
            setSuccessMessage('Error: End time must be after start time');
            setTimeout(() => setSuccessMessage(''), 3000);
            return;
        }

        try {
            setIsSubmitting(true);
            await initializeBallot({
                name: electionState.name,
                startTime: electionState.startTime,
                endTime: electionState.endTime,
            });
            setSuccessMessage('Election created successfully!');
            setTimeout(() => {
                setElectionState({
                    name: '',
                    startTime: null,
                    endTime: null
                });
                setSuccessMessage('');
            }, 2000);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error creating election. Please try again.';
            setSuccessMessage(message);
            setTimeout(() => setSuccessMessage(''), 3000);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleSuccessClose = () => {
        setSuccessMessage('');
        setElectionState({
            name: '',
            startTime: null,
            endTime: null
        });
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
                        Access Denied: Only election administrators can create new elections.
                    </Alert>
                </Grid>
            </Grid>
        );
    }


    return (
        <>
            <Grid sx={{ justifyContent: 'space-around', paddingTop: 8 }} container>
                <Grid item md={12}>
                    <Typography sx={{ textAlign: 'center', fontWeight: 'bold', color: 'white', paddingBottom: 10 }} variant='h5'> Initialize Ballot</Typography>
                </Grid>
                {!isContractConfigured && (
                    <Grid item md={12}>
                        <Alert severity="error" sx={{ mx: 2, mb: 3 }}>
                            Contract configuration is missing. Set NEXT_PUBLIC_CONTRACT_ADDRESS (or NEXT_PUBLIC_CONTRACT_KEY) before creating an election.
                        </Alert>
                    </Grid>
                )}
                <Grid item mx={6}>
                    <StyledList>
                        <StyledListItem sx={{ listStyle: 'none' }}><WarningAmberRoundedIcon sx={{ fontSize: 70, color: 'red' }} /><Typography variant='h4' sx={{ fontWeight: 'bold', color: 'red' }}>Be careful</Typography></StyledListItem>
                        <StyledListItem>
                            <ListItemText>Please be sure before Initialize Ballot</ListItemText>
                        </StyledListItem>
                        <StyledListItem>
                            <ListItemText>You can&apos;t modify after confirmation.</ListItemText></StyledListItem>
                        <StyledListItem>
                            <ListItemText>Only authorized person have rights to Initialize Ballot.</ListItemText>
                        </StyledListItem>
                    </StyledList>
                </Grid>
                <Grid item mx={6}>
                    <StyledChildBox>
                        <StyledTypography>Election Name:</StyledTypography>
                        <StyledTextField value={electionState.name} autoComplete='off' name='name' onChange={handleNameChange} placeholder='Enter Election name' type='text' />
                    </StyledChildBox>
                    <StyledChildBox>
                        <StyledTypography>Enter Election start Date & Time</StyledTypography>
                        <StyledTextField name='startTime' onChange={handleTimeChange} type='datetime-local' inputProps={{
                            min: currentDateTimeMin,
                        }} />
                    </StyledChildBox>
                    <StyledChildBox>
                        <StyledTypography>Enter Election end Date & Time</StyledTypography>
                        <StyledTextField onChange={handleTimeChange} name='endTime' type='datetime-local' inputProps={{
                            min: currentDateTimeMin,
                        }} />
                    </StyledChildBox>
                    <StyledSubmitBtn onClick={handleOnSubmitBtn} disabled={isSubmitting || isBallotLoading || !isContractConfigured}>Initialize</StyledSubmitBtn>
                </Grid>
            </Grid>


            <Slide direction="up" in={!!successMessage} mountOnEnter unmountOnExit>
                <StyledSuccessBox>
                    <Typography color={'white'}>{successMessage}</Typography>
                    <CancelIcon sx={{ cursor: 'pointer' }} onClick={handleSuccessClose} />
                </StyledSuccessBox>
            </Slide>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isBallotLoading ?? false}>
                <CircularProgress sx={{ color: "gray" }} />
            </Backdrop>
        </>
    )
}

export default NewElection