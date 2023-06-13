import styled from 'styled-components'

interface iPasswordStrengthMeter {
  color: string
  width: number
}

export const PasswordStrengthMeter = styled.div<iPasswordStrengthMeter>`
  &:before {
    background-color: ${({ color }) => color};
    width: ${({ width }) => width}%;
  }
`
