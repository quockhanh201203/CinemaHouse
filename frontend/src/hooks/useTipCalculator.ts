import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

type ServiceOption = '' | '0.3' | '0.2' | '0.15' | '0.1' | '0.05'

export interface TipState {
  billAmount: string
  serviceQuality: ServiceOption
  numberOfPeople: string
}

export interface TipResult {
  amountPerPerson: string
  showResult: boolean
  error: string
}

const initialState: TipState = {
  billAmount: '',
  serviceQuality: '',
  numberOfPeople: '',
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function useTipCalculator() {
  const [values, setValues] = useState<TipState>(initialState)
  const [result, setResult] = useState<TipResult>({
    amountPerPerson: '',
    showResult: false,
    error: '',
  })

  const serviceOptions = useMemo(
    () => [
      { label: '-- Choose an Option --', value: '' as ServiceOption },
      { label: '30% - Outstanding', value: '0.3' as ServiceOption },
      { label: '20% - Good', value: '0.2' as ServiceOption },
      { label: '15% - It was OK', value: '0.15' as ServiceOption },
      { label: '10% - Bad', value: '0.1' as ServiceOption },
      { label: '5% - Terrible', value: '0.05' as ServiceOption },
    ],
    [],
  )

  const notifyError = (message: string) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored',
    })
  }

  const handleChange = (field: keyof TipState, value: string) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }))

    if (result.error || result.showResult) {
      setResult((current) => ({ ...current, error: '', showResult: false }))
    }
  }

  const calculateTip = () => {
    const bill = Number(values.billAmount)
    const people = Number(values.numberOfPeople)
    const tipRate = Number(values.serviceQuality)

    if (!values.billAmount.trim() || !values.numberOfPeople.trim()) {
      const message = 'Vui lòng nhập số tiền và số người.'
      notifyError(message)
      setResult({ amountPerPerson: '', showResult: false, error: message })
      return
    }

    if (values.serviceQuality === '') {
      const message = 'Vui lòng chọn chất lượng dịch vụ.'
      notifyError(message)
      setResult({ amountPerPerson: '', showResult: false, error: message })
      return
    }

    if (Number.isNaN(bill) || bill <= 0) {
      const message = 'Số tiền hóa đơn phải là số hợp lệ lớn hơn 0.'
      notifyError(message)
      setResult({ amountPerPerson: '', showResult: false, error: message })
      return
    }

    if (Number.isNaN(people) || people <= 0 || !Number.isInteger(people)) {
      const message = 'Số người phải là số nguyên lớn hơn 0.'
      notifyError(message)
      setResult({ amountPerPerson: '', showResult: false, error: message })
      return
    }

    const amountPerPerson = (bill * tipRate) / people
    setResult({
      amountPerPerson: formatter.format(amountPerPerson),
      showResult: true,
      error: '',
    })
    toast.success('Tính tip thành công!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored',
    })
  }

  return {
    values,
    result,
    serviceOptions,
    handleChange,
    calculateTip,
  }
}
