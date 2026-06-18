import useTipCalculator from '../hooks/useTipCalculator'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './TipCalculator.css'

export default function TipCalculator() {
  const { values, result, serviceOptions, handleChange, calculateTip } = useTipCalculator()

  return (
    <section className="tip-calculator" aria-label="Tip Calculator">
      <div className="tip-card">
        <header className="tip-card__header">
          <h1>TIP CALCULATOR</h1>
        </header>

        <form
          className="tip-form"
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            calculateTip()
          }}
        >
          <label>
            Bill Amount
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="Enter bill amount"
              value={values.billAmount}
              onChange={(event) => handleChange('billAmount', event.target.value)}
              onInvalid={(event) => {
                event.preventDefault()
                calculateTip()
              }}
            />
          </label>

          <label>
            How was your service?
            <select
              value={values.serviceQuality}
              onChange={(event) => handleChange('serviceQuality', event.target.value)}
              onInvalid={(event) => event.preventDefault()}
            >
              {serviceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Number of People
            <input
              type="number"
              min="1"
              step="1"
              placeholder="Number of people"
              value={values.numberOfPeople}
              onChange={(event) => handleChange('numberOfPeople', event.target.value)}
              onInvalid={(event) => {
                event.preventDefault()
                calculateTip()
              }}
            />
          </label>

          <button type="submit" className="tip-button">
            CALCULATE!
          </button>
        </form>

        {result.error && <p className="tip-error">{result.error}</p>}

        {result.showResult && (
          <div className="tip-result" aria-live="polite">
            <span className="tip-result__label">Tip Amount</span>
            <strong className="tip-result__value">{result.amountPerPerson}</strong>
            <span className="tip-result__subtitle">each</span>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" />
    </section>
  )
}
