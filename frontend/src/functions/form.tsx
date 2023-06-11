import styled from 'styled-components'

const atLeastOneUppercase = /[A-Z]/g // capital letters from A to Z
const atLeastOneLowercase = /[a-z]/g // small letters from a to z
const atLeastOneNumeric = /[0-9]/g // numbers from 0 to 9
const atLeastOneSpecialChar = /[#?!@$%^&*-]/g // any of the special characters within the square brackets
const eightCharsOrMore = /.{8,}/g // eight characters or more

interface iPasswordTracker {
  uppercase: RegExpMatchArray | null,
  lowercase: RegExpMatchArray | null,
  number: RegExpMatchArray | null,
  specialChar: RegExpMatchArray | null,
  eightCharsOrGreater: RegExpMatchArray | null,
}

export default {
  form: {
    password: {
      tracker: (password: string) => {
        return password
          ? {
            uppercase: password.match(atLeastOneUppercase),
            lowercase: password.match(atLeastOneLowercase),
            number: password.match(atLeastOneNumeric),
            specialChar: password.match(atLeastOneSpecialChar),
            eightCharsOrGreater: password.match(eightCharsOrMore),
          }
          : null
      },
      strength: (passwordTracker: iPasswordTracker | null) => {
        return passwordTracker
          ? Object.values(passwordTracker).filter((value) => value).length
          : 0
      },
      validation: (form: string, field: string, meter: boolean, passwordStrength: number, passwordTracker: iPasswordTracker | null) => {
        let iColor = 'red'
        const psm = passwordStrength ? (passwordStrength / 5) * 100 : 0
        if (psm > 39) iColor = 'orange'
        if (psm > 59) iColor = '#03a2cc'
        if (psm > 79) iColor = '#03a2cc'
        if (psm > 99) iColor = '#0ce052'

        const passwordfield = (field === 'password' || field === 'newPassword')
        const passwordMeter = passwordTracker && passwordfield && meter && (form !== 'signIn')

        const PasswordStrengthMeter = styled.div`
          &:before {
            background-color: ${iColor};
            width: ${psm}%;
          }
        `

        return (
          passwordMeter && (
            <>
              <PasswordStrengthMeter className='password-strength-meter' />
              <div style={{ color: iColor }}>
                {passwordStrength < 5 && 'Must contain '}
                {!passwordTracker.uppercase && 'uppercase, '}
                {!passwordTracker.lowercase && 'lowercase, '}
                {!passwordTracker.specialChar && 'special character, '}
                {!passwordTracker.number && 'number, '}
                {!passwordTracker.eightCharsOrGreater &&
                  'eight characters or more'}
              </div>
            </>
          )
        )
      },
    }
  }
}
