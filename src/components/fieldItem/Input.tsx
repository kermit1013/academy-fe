import { ChangeEvent, HTMLAttributes } from 'react'

interface InputProps extends HTMLAttributes<HTMLInputElement> {
  type?:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'tel'
    | 'url'
    | 'search'
    | 'date'
    | 'time'
    | 'datetime-local'
  value: string
  plaeceholder?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const Input = ({
  id,
  type = 'text',
  value,
  plaeceholder = '',
  onChange = () => {},
  onBlur = () => {}
}: InputProps) => {
  return (
    <input
      className="w-full appearance-none rounded-md border p-3 py-2 leading-tight focus:outline-none"
      type={type}
      id={id}
      placeholder={plaeceholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  )
}

export default Input
