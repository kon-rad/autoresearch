import { Input } from '@/components/ui/input';


const AutoSearch = () => {
  const handleSearch = () => {
    
  }
  return (
    <div className="my-12 flex flex-col justify-center">
      <Input className="my-4 w-full py-8  " onClick={handleSearch} />
    </div>
  )
}

export default AutoSearch
