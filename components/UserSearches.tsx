import React from "react"

interface SearchItem {
  id: string
  title: string
}

interface UserSearchesProps {
  searches: SearchItem[]
}

const UserSearches: React.FC<UserSearchesProps> = ({
  searches,
  setCurrentSearch,
}) => {
  return (
    <div className="mx-4 h-full overflow-y-auto max-h-[1500px]">
      {searches.map((search) => (
        <div
          key={search.id}
          className="cursor-pointer p-2 hover:bg-gray-100"
          onClick={() => setCurrentSearch(search)}
        >
          <p>{search.query.slice(0, 40)}...</p>
          <small>{search.id}</small>
        </div>
      ))}
    </div>
  )
}

export default UserSearches
