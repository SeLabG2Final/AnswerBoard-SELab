import styled from 'styled-components';

const StyledStatsCard = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: var(--post-card-margin);
    gap: var(--post-card-margin);
`

const MyStats = styled.div`
    display: flex;
    flex-direction: column;
    gap: calc(var(--post-card-margin) / 2);
`
const StatItem = styled.div`
    display: flex;
    justify-content: space-between;
`

export {
    StyledStatsCard,
    MyStats,
    StatItem
};