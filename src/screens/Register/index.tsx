import React, { useState, useEffect } from 'react'
import { 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert,
} from 'react-native'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native'
import { useForm } from 'react-hook-form'
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'

import { Button } from '../../components/Form/Button'
import { InputForm } from '../../components/Form/InputForm'
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton'
import { CategorySelectButton } from '../../components/Form/CategorySelectButton'
import { CategorySelect } from '../CategorySelect'
import { useAuth } from '../../hooks/useAuth'

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './styles'

type TransactionType = 'positive' | 'negative'

interface FormData {
  [key: string]: string
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório')
})


export const Register = () => {
  const [transactionType, setTransactionType] = useState<TransactionType | null>(null)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria'
  })
  const { 
    control, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm({
    resolver: yupResolver(schema)
  })
  const navigation = useNavigation<NavigationProp<ParamListBase>>()
  const { user } = useAuth()

  const dataKey = `@gofinances:transactions_user:${user.id}`

  const handleTransactionTypeSelect = (type: 'positive' | 'negative') => {
    setTransactionType(type)
  }

  const handleCloseSelectCategoryModal = () => {
    setCategoryModalOpen(false)
  }

  const handleOpenSelectCategoryModal = () => {
    setCategoryModalOpen(true)
  } 

  const onRegister = async (form: FormData) => {
    if (!transactionType) {
      return Alert.alert('Selecione o tipo da transação')
    }

    if (category.key === 'category') {
      return Alert.alert('Selecione a categoria')      
    }
    
    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    }

    try {
      // const dataKey = `@gofinances:transactions_user:${}`
      const data = await AsyncStorage.getItem(dataKey)
      const currentData = data ? JSON.parse(data) : []

      const dataFormatted = [
        ...currentData,
        newTransaction
      ]

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))
    
      reset()
      setTransactionType(null)
      setCategory({
        key: 'category1',
        name: 'Categoria'
      })

      navigation.navigate('Listagem')
    } catch (error) {
      console.log(error)
      Alert.alert('Não foi possível salvar')
    }
  }

  useEffect(() => {
    const loadData = async () => {
      AsyncStorage.getItem(dataKey)
    }

    loadData()
  }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionsTypes>
              <TransactionTypeButton
                type="up"
                title="Income"
                isActive={transactionType === 'positive'}
                onPress={() => handleTransactionTypeSelect('positive')}
              />

              <TransactionTypeButton
                type="down"
                title="Outcome"
                isActive={transactionType === 'negative'}
                onPress={() => handleTransactionTypeSelect('negative')}
              />
            </TransactionsTypes>

            <CategorySelectButton
              title={category.name}
              openSelectCategoryModal={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button title="Enviar" onPress={handleSubmit(onRegister)} />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategoryModal={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}