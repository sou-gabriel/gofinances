import React from 'react'

import { Container, Category, Icon } from './styles'
 
interface CategorySelectButtonProps {
  title: string
  openSelectCategoryModal: () => void
}

export const CategorySelectButton = ({ 
  title,
  openSelectCategoryModal 
}: CategorySelectButtonProps) => {
  return (
    <Container onPress={openSelectCategoryModal}>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  )
}