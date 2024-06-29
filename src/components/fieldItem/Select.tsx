import { ChangeEvent, HTMLAttributes } from 'react'

// 箭頭
const Arrow = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.40988 8.25C7.24682 8.24994 7.08676 8.21269 6.94646 8.14216C6.80615 8.07162 6.69073 7.97039 6.61228 7.84904C6.53383 7.72769 6.49521 7.59067 6.50047 7.45232C6.50574 7.31397 6.55468 7.17936 6.64219 7.06255L9.2317 3.60788C9.31392 3.49821 9.4274 3.40791 9.56165 3.34535C9.69589 3.2828 9.84656 3.25 9.9997 3.25C10.1528 3.25 10.3035 3.2828 10.4377 3.34535C10.572 3.40791 10.6855 3.49821 10.7677 3.60788L13.3578 7.06255C13.4453 7.17939 13.4943 7.31405 13.4995 7.45245C13.5048 7.59085 13.4661 7.7279 13.3876 7.84926C13.309 7.97063 13.1935 8.07185 13.0532 8.14235C12.9128 8.21285 12.7526 8.25003 12.5895 8.25H7.40988Z"
        fill="#A1A1AA"
      />
      <path
        d="M12.5901 11.75C12.7532 11.7501 12.9132 11.7873 13.0535 11.8578C13.1939 11.9284 13.3093 12.0296 13.3877 12.151C13.4662 12.2723 13.5048 12.4093 13.4995 12.5477C13.4943 12.686 13.4453 12.8206 13.3578 12.9374L10.7683 16.3921C10.6861 16.5018 10.5726 16.5921 10.4384 16.6546C10.3041 16.7172 10.1534 16.75 10.0003 16.75C9.84716 16.75 9.6965 16.7172 9.56225 16.6546C9.42801 16.5921 9.31453 16.5018 9.23231 16.3921L6.64219 12.9374C6.55465 12.8206 6.50571 12.6859 6.50047 12.5476C6.49523 12.4092 6.5339 12.2721 6.61243 12.1507C6.69095 12.0294 6.80645 11.9281 6.94685 11.8576C7.08724 11.7872 7.24737 11.75 7.41049 11.75H12.5901Z"
        fill="#A1A1AA"
      />
    </svg>
  )
}

interface SelectProps extends HTMLAttributes<HTMLSelectElement> {
  value: string
  options: { value: string; label: string }[]
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
}

const Select = ({
  id,
  value,
  options = [],
  onChange = () => {},
  onBlur = () => {}
}: SelectProps) => {
  return (
    <div className="relative">
      <select
        className="w-full appearance-none rounded-md border py-2 pl-3 pr-6 leading-tight focus:outline-none"
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      >
        <option value={''} disabled>
          請選擇
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <Arrow />
      </div>
    </div>
  )
}

export default Select
