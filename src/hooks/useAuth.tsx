import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import * as AuthSession from 'expo-auth-session'
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage'

interface AuthContextProviderProps {
  children: ReactNode | ReactNode[]
}

interface User {
  id: string
  name: string
  email: string
  photo?: string
}

interface AuthContextData {
  user: User
  userStorageLoading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  signOut: () => Promise<void>
}

interface AuthorizationResponse {
  params: {
    access_token: string
  }
  type: string
}

const { CLIENT_ID } = process.env
const { REDIRECT_URI } = process.env

const AuthContext = createContext({} as AuthContextData)

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState({} as User)
  const [userStorageLoading, setUserStorageLoading] = useState(true)

  const userStorageKey = '@gofinances:user'

  const signInWithGoogle = async () => {
    try {
      const RESPONSE_TYPE  = 'token'
      const SCOPE = encodeURI('profile email')

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`
    
      const { params, type } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse

      if (type === 'success') {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)
        const data = await response.json()
        
        const userLogged = {
          id: data.id,
          email: data.email,
          name: data.given_name,
          photo: data.picture
        }

        setUser(userLogged)
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged))
      }
    } catch (error: any) {
      throw new Error(error)      
    }
  }

  const signInWithApple = async () => {
    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      })

      if (credentials) {
        const userLogged = {
          id: credentials.user,
          email: credentials.email,
          name: credentials.fullName.givenName,
          photo: `https://ui-avatars.com/api/?name=${credentials.fullName.givenName}&length=1`
        }

        setUser(userLogged)
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged))
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  const signOut = async () => {
    setUser({} as User)
    await AsyncStorage.removeItem(userStorageKey)
  }

  useEffect(() => {
    const loadUserStorageData = async () => {
      const userStoraged = await AsyncStorage.getItem(userStorageKey)

      if (userStoraged) {
        const userLogged = JSON.parse(userStoraged)
        setUser(userLogged)
      }

      setUserStorageLoading(false)
    }

    loadUserStorageData()
  }, [])

  return (
    <AuthContext.Provider value={{ user, userStorageLoading, signInWithGoogle, signInWithApple, signOut }}>
      {children}
    </AuthContext.Provider>
  )
} 

export const useAuth = () => useContext(AuthContext)
