import React from 'react'
import { FlatList } from 'react-native'

import { Button } from '../../components/Form/Button'

import { categories } from '../../utils/categories'

import { 
  Container, 
  Header, 
  Title, 
  Category, 
  Icon, 
  Name,
  Separator,
  Footer,
} from './styles'

interface Category {
  key: string
  name: string
}

interface CategorySelectProps {
  category: Category
  setCategory: (category: Category) => void
  closeSelectCategoryModal: () => void
}

export const CategorySelect = ({ 
  category, 
  setCategory, 
  closeSelectCategoryModal 
}: CategorySelectProps) => {
  const handleCategorySelect = (category: Category) => {
    setCategory(category)
  }

  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList 
        data={categories}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <Category
            onPress={() => handleCategorySelect(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )
        }
        ItemSeparatorComponent={() => <Separator />}
        style={{ flex: 1, width: '100%' }}
      />

      <Footer>
        <Button title="Selecionar" onPress={closeSelectCategoryModal} />
      </Footer>
    </Container>
  )
}