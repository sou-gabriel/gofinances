import React from 'react'
import { Gesture, RectButtonProps } from 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'


import { Container, Title } from './styles'

interface ButtonProps extends RectButtonProps {
  title: string
  onPress: () => void
}

export const Button = ({ title, onPress }: ButtonProps) => {
  return (
    <Container onPress={onPress}>
      <Title>{title}</Title>
    </Container>
  );
};