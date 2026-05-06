import { Box, Grid, Typography, Backdrop, CircularProgress } from '@mui/material'
import React, { useContext } from 'react'
import { AuthorityContext } from '../context/AuthorityContext';
import { OngoingElectionCard, PreviousElectionCard, UpcomingElectionCard } from '../components';


const Dashboard = () => {
    const { previousElection, onGoingElection, upComingElection, isElectionListLoading } = useContext(AuthorityContext);

    return (
        <>
            <Grid sx={{ color: 'white', pt: 10, gap: 20 }} container justifyContent={"center"} >

                <Grid item xs={3} justifyContent={'center'}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }} variant='h4' fontWeight={'bold'}>Previous Elections</Typography>
                        {isElectionListLoading ? (
                            <Typography sx={{ textAlign: 'center' }}>Loading...</Typography>
                        ) : previousElection && previousElection.length > 0 ? (
                            previousElection?.map((electionList: any, index: any) => {
                                const { election, electionId } = electionList;
                                const { name, startTime, endTime } = election;
                                return <PreviousElectionCard electionId={electionId} electionName={name} startTime={startTime} endTime={endTime} key={index} />
                            })
                        ) : (
                            <Typography sx={{ textAlign: 'center', opacity: 0.7 }}>No previous elections</Typography>
                        )}
                    </Box>
                </Grid>


                <Grid item xs={3} justifyContent={'center'}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }} variant='h4' fontWeight={'bold'}>Ongoing Election</Typography>
                        {isElectionListLoading ? (
                            <Typography sx={{ textAlign: 'center' }}>Loading...</Typography>
                        ) : onGoingElection && onGoingElection.length > 0 ? (
                            onGoingElection?.map((electionList: any, index: any) => {
                                const { election, electionId } = electionList;
                                const { name, startTime, endTime } = election;
                                return <OngoingElectionCard electionId={electionId} electionName={name} startTime={startTime} endTime={endTime} key={index} />
                            })
                        ) : (
                            <Typography sx={{ textAlign: 'center', opacity: 0.7 }}>No ongoing elections</Typography>
                        )}
                    </Box>
                </Grid>

                <Grid item xs={3} justifyContent={'center'}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }} variant='h4' >Upcoming Elections</Typography>
                        {isElectionListLoading ? (
                            <Typography sx={{ textAlign: 'center' }}>Loading...</Typography>
                        ) : upComingElection && upComingElection.length > 0 ? (
                            upComingElection?.map((electionList: any, index: any) => {
                                const { election, electionId } = electionList;
                                const { name, startTime, endTime } = election;
                                return <UpcomingElectionCard electionId={electionId} electionName={name} startTime={startTime} endTime={endTime} key={index} />
                            })
                        ) : (
                            <Typography sx={{ textAlign: 'center', opacity: 0.7 }}>No upcoming elections</Typography>
                        )}
                    </Box>
                </Grid>


            </Grid>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isElectionListLoading ?? false}>
                <CircularProgress sx={{ color: "gray" }} />
            </Backdrop>
        </>)
}

export default Dashboard