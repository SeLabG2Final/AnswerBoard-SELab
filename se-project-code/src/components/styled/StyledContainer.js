import styled from 'styled-components';

const StyledContainer = styled.div`
    display: flex;
`

const StyledContainerFlexCol = styled(StyledContainer)`
    flex-direction: column;
`

export { StyledContainer, StyledContainerFlexCol };