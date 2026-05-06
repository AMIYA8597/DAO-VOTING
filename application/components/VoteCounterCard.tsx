import React from 'react'
import { Box, Typography, Avatar } from '@mui/material'
import { StyledCounterBox } from '../styles/voterStyles'
import { MediaRenderer } from '@thirdweb-dev/react'

type BigNumberLike = {
    toNumber: () => number;
};

type VoteCounterCardProps = {
    votes: BigNumberLike;
    candidateName: string;
    symbolImage: string;
};


function VoteCounterCard({ votes, candidateName, symbolImage }: VoteCounterCardProps) {
    const displayVotes = (() => {
        try {
            if (votes && typeof (votes as any).toNumber === 'function') {
                return (votes as any).toNumber();
            }
            const n = Number(votes as any);
            return Number.isFinite(n) ? n : 0;
        } catch (err) {
            return 0;
        }
    })();

    return (
        <StyledCounterBox>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                <MediaRenderer style={{ width: 100, height: 100, borderRadius: '50%' }} src={symbolImage} />
                <Typography variant='h5' sx={{ color: 'white' }} >{candidateName}</Typography>
            </Box>
            <Typography variant='h5' sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>{displayVotes}</Typography>
        </StyledCounterBox >
    )
}

export default VoteCounterCard